<script setup lang="ts">
/**
 * Element Plus Table V2 (the virtualized table) with defaults, except for
 * what makes the setup match the other grids:
 *  - same row height / header height / column widths
 *  - `fixed`: the columns keep their widths, and the table scrolls
 *    horizontally (by default the columns shrink to fit the width)
 *
 * and a `data-row-index` attribute on the rows (`row-props`), for the harness.
 *
 * Table V2 takes its size in px, and it does not sort: it draws the sort
 * indicator, and emits `column-sort` when a sortable header is clicked. The
 * page keeps the sort state and sorts a copy of the rows, as in the "Sortable"
 * example of its documentation.
 *
 * It does not filter either: for the live-update scenarios (see updates.ts)
 * the page filters the rows in the filtered view, and sorts them in the sorted
 * view - again when rows change. Table V2 has no grouping, so there is no
 * `grouped` view. Rows are changed through `data`: a new array.
 */
import { computed, shallowRef } from 'vue';
import { ElTableV2 } from 'element-plus';
import type { Column, SortBy } from 'element-plus';
import 'element-plus/es/components/table-v2/style/css';

import {
  BENCH_COLUMNS,
  BENCH_COLUMN_WIDTH,
  BENCH_HEADER_HEIGHT,
  BENCH_ROW_HEIGHT,
} from './data';
import type { BenchRow } from './data';
import {
  BENCH_SORT_DIR,
  BENCH_SORT_FIELD,
  applyBenchUpdates,
  passesBenchFilter,
} from './updates';
import type { BenchView } from './updates';

const props = defineProps<{
  data: BenchRow[];
  width: number;
  height: number;
  view: BenchView;
  onUpdater: (update: (rows: BenchRow[]) => void) => void;
}>();

if (props.view === 'grouped') {
  throw new Error('Element Plus Table V2 has no row grouping');
}

const columns: Column<BenchRow>[] = BENCH_COLUMNS.map((c) => ({
  key: c.field,
  dataKey: c.field,
  title: c.header,
  width: BENCH_COLUMN_WIDTH,
  sortable: true,
}));

// for the harness: the rows have no attribute with their index
const rowProps = ({ rowIndex }: { rowIndex: number }) => ({
  'data-row-index': rowIndex,
});

// shallowRef: the rows stay plain objects
const data = shallowRef(props.data);
const sortBy = shallowRef<Partial<SortBy>>(
  props.view === 'sorted'
    ? ({
        key: BENCH_SORT_FIELD,
        order: BENCH_SORT_DIR === -1 ? 'desc' : 'asc',
      } as SortBy)
    : {},
);
props.onUpdater((changed) => {
  data.value = applyBenchUpdates(data.value, changed);
});

// what the table shows: the rows (filtered in the filtered view), sorted by
// the column that was clicked
const rows = computed(() => {
  const all =
    props.view === 'filtered'
      ? data.value.filter(passesBenchFilter)
      : data.value;
  const { key, order } = sortBy.value;
  if (!key) {
    return all;
  }
  const field = key as keyof BenchRow;
  const dir = order === 'asc' ? 1 : -1;
  return [...all].sort((a, b) => {
    const x = a[field];
    const y = b[field];
    return x < y ? -dir : x > y ? dir : 0;
  });
});

// a new column is sorted ascending, and the next click on it reverses the
// order - what the other grids do
function onColumnSort({ key }: SortBy) {
  const order =
    sortBy.value.key === key && sortBy.value.order === 'asc' ? 'desc' : 'asc';
  sortBy.value = { key, order } as SortBy;
}
</script>

<template>
  <ElTableV2
    :columns="columns"
    :data="rows"
    :width="width"
    :height="height"
    :row-height="BENCH_ROW_HEIGHT"
    :header-height="BENCH_HEADER_HEIGHT"
    :sort-by="sortBy as SortBy"
    :fixed="true"
    :row-props="rowProps"
    @column-sort="onColumnSort"
  />
</template>
