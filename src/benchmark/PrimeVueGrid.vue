<script setup lang="ts">
/**
 * PrimeVue DataTable with defaults (the Aura theme preset), except for what
 * makes the setup match the other grids:
 *  - `scrollable` + `scrollHeight="flex"` + `virtualScrollerOptions`: its
 *    virtual scroller mode, with the row height as the item size
 *  - same row height / header height / column widths (the columns get their
 *    width and the cells their height through `style`, as in the "Virtual
 *    Scroll" example of its documentation)
 *
 * For the live-update scenarios (see updates.ts): the sorted view sets
 * `sortField` / `sortOrder`, the filtered view `filters` (with no filter UI in
 * the header). PrimeVue groups rows only for display - the aggregations are
 * left to the page - so it has no `grouped` view. Rows are changed through
 * `value`: a new array, with the changed rows in it.
 */
import { shallowRef } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import {
  BENCH_COLUMNS,
  BENCH_COLUMN_WIDTH,
  BENCH_GRID_WIDTH,
  BENCH_HEADER_HEIGHT,
  BENCH_ROW_HEIGHT,
} from './data';
import type { BenchRow } from './data';
import {
  BENCH_FILTER_FIELD,
  BENCH_FILTER_MIN,
  BENCH_SORT_DIR,
  BENCH_SORT_FIELD,
  applyBenchUpdates,
} from './updates';
import type { BenchView } from './updates';

const props = defineProps<{
  data: BenchRow[];
  view: BenchView;
  onUpdater: (update: (rows: BenchRow[]) => void) => void;
}>();

if (props.view === 'grouped') {
  throw new Error('PrimeVue DataTable does not aggregate rows');
}

// shallowRef: the rows stay plain objects
const rows = shallowRef(props.data);
props.onUpdater((changed) => {
  rows.value = applyBenchUpdates(rows.value, changed);
});

const filters =
  props.view === 'filtered'
    ? { [BENCH_FILTER_FIELD]: { value: BENCH_FILTER_MIN, matchMode: 'gte' } }
    : undefined;

const virtualScrollerOptions = { itemSize: BENCH_ROW_HEIGHT };

const tableStyle = {
  tableLayout: 'fixed',
  width: `${BENCH_COLUMNS.length * BENCH_COLUMN_WIDTH}px`,
};
const cellStyle = {
  width: `${BENCH_COLUMN_WIDTH}px`,
  height: `${BENCH_ROW_HEIGHT}px`,
  padding: '0 1rem',
  boxSizing: 'border-box',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};
const headerStyle = { ...cellStyle, height: `${BENCH_HEADER_HEIGHT}px` };
</script>

<template>
  <DataTable
    :value="rows"
    dataKey="id"
    :sortField="view === 'sorted' ? BENCH_SORT_FIELD : undefined"
    :sortOrder="view === 'sorted' ? BENCH_SORT_DIR : undefined"
    :filters="filters"
    :scrollable="true"
    scrollHeight="flex"
    :virtualScrollerOptions="virtualScrollerOptions"
    :tableStyle="tableStyle"
    :style="{ flex: 1, minHeight: 0, width: `${BENCH_GRID_WIDTH}px` }"
  >
    <Column
      v-for="column in BENCH_COLUMNS"
      :key="column.field"
      :field="column.field"
      :header="column.header"
      :sortable="true"
      :headerStyle="headerStyle"
      :bodyStyle="cellStyle"
    />
  </DataTable>
</template>
