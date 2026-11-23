<script lang="ts">
import {
  DataSource,
  GroupRowsState,
  InfiniteTable,
} from '@infinite-table/infinite-vue';
import type {
  DataSourceApi,
  DataSourcePropAggregationReducers,
  DataSourcePropFilterValue,
  DataSourcePropGroupBy,
  DataSourcePropSortInfo,
  InfiniteTablePropColumns,
} from '@infinite-table/infinite-vue';
import '@infinite-table/infinite-vue/index.css';

import {
  BENCH_COLUMNS,
  BENCH_COLUMN_WIDTH,
  BENCH_HEADER_HEIGHT,
  BENCH_ROW_HEIGHT,
} from './data';
import type { BenchRow } from './data';
import type { BenchAdapter } from './harness';
import BenchmarkPage from './BenchmarkPage.vue';
import {
  BENCH_AGGREGATE_FIELD,
  BENCH_FILTER_FIELD,
  BENCH_FILTER_MIN,
  BENCH_GROUP_FIELD,
  BENCH_SORT_DIR,
  BENCH_SORT_FIELD,
} from './updates';

const columns: InfiniteTablePropColumns<BenchRow> = Object.fromEntries(
  BENCH_COLUMNS.map((c) => [
    c.field,
    {
      field: c.field,
      header: c.header,
      type: c.type === 'number' ? 'number' : 'string',
    },
  ]),
);

const CELL = '.InfiniteColumnCell:not(.InfiniteDetachedCell)';

const root = () =>
  document.querySelector<HTMLElement>(
    '[data-benchmark-grid="infinite"] .Infinite',
  );

const scroller = () =>
  root()?.querySelector<HTMLElement>('.InfiniteVirtualScrollContainer') ?? null;

const adapter: BenchAdapter = {
  grid: 'infinite',
  version: __INFINITE_VERSION__,
  getRoot: root,
  getVerticalScroller: scroller,
  getHorizontalScroller: scroller,
  getBodyRect: () => {
    const el = scroller();
    if (!el) {
      return null;
    }
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + el.clientLeft,
      top: rect.top + el.clientTop,
      width: el.clientWidth,
      height: el.clientHeight,
    };
  },
  getRenderedColumnCells: (field) =>
    Array.from(
      root()?.querySelectorAll<HTMLElement>(
        `${CELL}[data-column-id="${field}"]`,
      ) ?? [],
    ),
  getRenderedRowCells: (rowIndex) =>
    Array.from(
      root()?.querySelectorAll<HTMLElement>(
        `${CELL}[data-row-index="${rowIndex}"]`,
      ) ?? [],
    ),
  getCellRowIndex: (cell) => Number(cell.getAttribute('data-row-index') ?? -1),
  getCellColumnId: (cell) => cell.getAttribute('data-column-id') ?? '',
  getCell: (rowIndex, field) =>
    root()?.querySelector<HTMLElement>(
      `${CELL}[data-row-index="${rowIndex}"][data-column-id="${field}"]`,
    ) ?? null,
  getHeaderCell: (field) =>
    root()?.querySelector<HTMLElement>(
      `.InfiniteHeaderCell[data-column-id="${field}"]`,
    ) ?? null,
};

const domProps = { style: { flex: 1, minHeight: 0 } };

// the views of the live-update scenarios - see updates.ts
const sortInfo: DataSourcePropSortInfo<BenchRow> = {
  field: BENCH_SORT_FIELD,
  dir: BENCH_SORT_DIR,
  // a sortInfo for a field (not a column) compares strings by default
  type: 'number',
};
const filterValue: DataSourcePropFilterValue<BenchRow> = [
  {
    field: BENCH_FILTER_FIELD,
    filter: { type: 'number', operator: 'gte', value: BENCH_FILTER_MIN },
  },
];
const groupBy: DataSourcePropGroupBy<BenchRow> = [{ field: BENCH_GROUP_FIELD }];
const aggregationReducers: DataSourcePropAggregationReducers<BenchRow> = {
  [BENCH_AGGREGATE_FIELD]: {
    field: BENCH_AGGREGATE_FIELD,
    initialValue: 0,
    reducer: (sum: number, value: number) => sum + value,
  },
};
const collapsedGroups = new GroupRowsState({
  expandedRows: [],
  collapsedRows: true,
});

const dataSourceReady =
  (onUpdater: (update: (rows: BenchRow[]) => void) => void) =>
  (api: DataSourceApi<BenchRow>) =>
    onUpdater((rows) => {
      api.updateDataArray(rows);
    });
</script>

<script setup lang="ts">
/**
 * Infinite Table with defaults - only row height / header height / column
 * widths are set, to match the other grids.
 *
 * Rows are changed with `dataSourceApi.updateDataArray`, the API Infinite
 * Table documents for live updates. In the filtered view the column filters
 * are not shown in the header (`showColumnFilters: false`), so the header has
 * the same height as in the other grids.
 */
defineProps<{ rowCount: number }>();
</script>

<template>
  <BenchmarkPage
    :title="`Infinite Table ${adapter.version}`"
    :rowCount="rowCount"
    :adapter="adapter"
    v-slot="{ data, view, onUpdater }"
  >
    <DataSource
      :data="data"
      primaryKey="id"
      :onReady="dataSourceReady(onUpdater)"
      :defaultSortInfo="view === 'sorted' ? sortInfo : undefined"
      :defaultFilterValue="view === 'filtered' ? filterValue : undefined"
      :groupBy="view === 'grouped' ? groupBy : undefined"
      :aggregationReducers="
        view === 'grouped' ? aggregationReducers : undefined
      "
      :defaultGroupRowsState="view === 'grouped' ? collapsedGroups : undefined"
    >
      <InfiniteTable
        :columns="columns"
        :rowHeight="BENCH_ROW_HEIGHT"
        :columnHeaderHeight="BENCH_HEADER_HEIGHT"
        :columnDefaultWidth="BENCH_COLUMN_WIDTH"
        :domProps="domProps"
        :showColumnFilters="view === 'filtered' ? false : undefined"
      />
    </DataSource>
  </BenchmarkPage>
</template>
