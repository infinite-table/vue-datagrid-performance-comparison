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
 */
import { shallowRef } from 'vue';
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

const props = defineProps<{ data: BenchRow[]; width: number; height: number }>();

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
const rows = shallowRef(props.data);
const sortBy = shallowRef<Partial<SortBy>>({});

// a new column is sorted ascending, and the next click on it reverses the
// order - what the other grids do
function onColumnSort({ key }: SortBy) {
  const field = key as keyof BenchRow;
  const order =
    sortBy.value.key === key && sortBy.value.order === 'asc' ? 'desc' : 'asc';
  const dir = order === 'asc' ? 1 : -1;
  sortBy.value = { key, order } as SortBy;
  rows.value = [...props.data].sort((a, b) => {
    const x = a[field];
    const y = b[field];
    return x < y ? -dir : x > y ? dir : 0;
  });
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
