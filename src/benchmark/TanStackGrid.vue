<script setup lang="ts">
/**
 * TanStack Table is headless: it has the row model and the sorting, and the
 * page renders the markup. This component follows the official Vue
 * "virtualized-columns" example (rows and columns virtualized with TanStack
 * Virtual, same overscan), with what the benchmark needs changed:
 *  - fixed row height (no measuring), header height and column widths - the
 *    same as in the other grids
 *  - no column resizing
 *  - sortDescFirst: false - by default the first click on a number column
 *    sorts descending; in the other grids it sorts ascending
 *  - data-row-index / data-column-id on the cells, for the harness
 */
import { computed, ref } from 'vue';
import {
  FlexRender,
  columnSizingFeature,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table';
import { useVirtualizer } from '@tanstack/vue-virtual';

import {
  BENCH_COLUMNS,
  BENCH_COLUMN_WIDTH,
  BENCH_HEADER_HEIGHT,
  BENCH_ROW_HEIGHT,
} from './data';
import type { BenchRow } from './data';

const props = defineProps<{ data: BenchRow[] }>();

const features = tableFeatures({
  columnSizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
});

const columnHelper = createColumnHelper<typeof features, BenchRow>();

const columns = columnHelper.columns(
  BENCH_COLUMNS.map((c) =>
    columnHelper.accessor(c.field, {
      header: c.header,
      size: BENCH_COLUMN_WIDTH,
    }),
  ),
);

const table = useTable({
  features,
  columns,
  data: computed(() => props.data),
  getRowId: (row: BenchRow) => String(row.id),
  sortDescFirst: false,
});

const leafColumns = computed(() => table.getAllLeafColumns());
const rows = computed(() => table.getRowModel().rows);

// the virtualizers need to know the scrollable container element
const tableContainerRef = ref<HTMLDivElement | null>(null);

const columnVirtualizer = useVirtualizer(
  computed(() => ({
    count: leafColumns.value.length,
    estimateSize: (index: number) => leafColumns.value[index]?.getSize() ?? 0,
    getScrollElement: () => tableContainerRef.value,
    horizontal: true,
    overscan: 3,
  })),
);

// fixed row height - nothing is measured
const rowVirtualizer = useVirtualizer(
  computed(() => ({
    count: rows.value.length,
    estimateSize: () => BENCH_ROW_HEIGHT,
    getScrollElement: () => tableContainerRef.value,
    overscan: 5,
  })),
);

const virtualColumns = computed(() => columnVirtualizer.value.getVirtualItems());
const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems());

// columns are virtualized with an empty cell to the left and to the right
const virtualPaddingLeft = computed(() => {
  const items = virtualColumns.value;
  return items.length > 0 ? (items[0]?.start ?? 0) : undefined;
});

const virtualPaddingRight = computed(() => {
  const items = virtualColumns.value;
  if (!items.length) {
    return undefined;
  }

  return (
    columnVirtualizer.value.getTotalSize() - (items[items.length - 1]?.end ?? 0)
  );
});
</script>

<template>
  <div ref="tableContainerRef" :class="$style.container">
    <table :class="$style.table">
      <thead :class="$style.thead">
        <tr
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
          :class="$style.tr"
          :style="{ height: `${BENCH_HEADER_HEIGHT}px` }"
        >
          <th
            v-if="virtualPaddingLeft"
            :class="$style.th"
            :style="{ width: `${virtualPaddingLeft}px` }"
          />
          <th
            v-for="virtualColumn in virtualColumns"
            :key="headerGroup.headers[virtualColumn.index].id"
            :class="$style.th"
            :data-column-id="headerGroup.headers[virtualColumn.index].column.id"
            :style="{
              width: `${headerGroup.headers[virtualColumn.index].getSize()}px`,
            }"
          >
            <div
              :class="{
                [$style.sortable]:
                  headerGroup.headers[virtualColumn.index].column.getCanSort(),
              }"
              @click="
                headerGroup.headers[
                  virtualColumn.index
                ].column.getToggleSortingHandler()?.($event)
              "
            >
              <FlexRender :header="headerGroup.headers[virtualColumn.index]" />
              <span
                v-if="
                  headerGroup.headers[
                    virtualColumn.index
                  ].column.getIsSorted() === 'asc'
                "
              >
                &nbsp;▲
              </span>
              <span
                v-else-if="
                  headerGroup.headers[
                    virtualColumn.index
                  ].column.getIsSorted() === 'desc'
                "
              >
                &nbsp;▼
              </span>
            </div>
          </th>
          <th
            v-if="virtualPaddingRight"
            :class="$style.th"
            :style="{ width: `${virtualPaddingRight}px` }"
          />
        </tr>
      </thead>

      <tbody
        :class="$style.tbody"
        :style="{
          // tells the scrollbar how big the table is
          height: `${rowVirtualizer.getTotalSize()}px`,
        }"
      >
        <tr
          v-for="virtualRow in virtualRows"
          :key="rows[virtualRow.index].id"
          :class="[$style.tr, $style.bodyRow]"
          :style="{
            height: `${BENCH_ROW_HEIGHT}px`,
            // always a style, as it changes on scroll
            transform: `translateY(${virtualRow.start}px)`,
          }"
        >
          <td
            v-if="virtualPaddingLeft"
            :class="$style.td"
            :style="{ width: `${virtualPaddingLeft}px` }"
          />
          <td
            v-for="virtualColumn in virtualColumns"
            :key="rows[virtualRow.index].getAllCells()[virtualColumn.index].id"
            :class="$style.td"
            :data-row-index="virtualRow.index"
            :data-column-id="
              rows[virtualRow.index].getAllCells()[virtualColumn.index].column.id
            "
            :style="{
              width: `${rows[virtualRow.index]
                .getAllCells()
                [virtualColumn.index].column.getSize()}px`,
            }"
          >
            <FlexRender
              :cell="rows[virtualRow.index].getAllCells()[virtualColumn.index]"
            />
          </td>
          <td
            v-if="virtualPaddingRight"
            :class="$style.td"
            :style="{ width: `${virtualPaddingRight}px` }"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<!-- Plain styling - TanStack Table is headless, so the markup and the styles
     are ours. Kept close to the official "virtualized-columns" example. -->
<style module>
.container {
  flex: 1;
  min-height: 0;
  /* the scrollable table container */
  overflow: auto;
  /* needed for the sticky header */
  position: relative;
  border: 1px solid lightgray;
  font-family: arial, sans-serif;
  font-size: 14px;
}

.table {
  display: grid;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}

.thead {
  display: grid;
  position: sticky;
  top: 0;
  z-index: 1;
  background: lightgray;
}

.tbody {
  display: grid;
  /* needed for the absolute positioning of the rows */
  position: relative;
}

.tr {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid lightgray;
}

.bodyRow {
  position: absolute;
}

.th,
.td {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  flex: none;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 6px;
  text-align: left;
}

.th {
  border-right: 1px solid lightgray;
  font-weight: bold;
}

.sortable {
  cursor: pointer;
  user-select: none;
  /* the whole header cell is the click target */
  flex: 1;
  align-self: stretch;
  display: flex;
  align-items: center;
}
</style>
