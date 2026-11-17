<script setup lang="ts">
/**
 * PrimeVue DataTable with defaults (the Aura theme preset), except for what
 * makes the setup match the other grids:
 *  - `scrollable` + `scrollHeight="flex"` + `virtualScrollerOptions`: its
 *    virtual scroller mode, with the row height as the item size
 *  - same row height / header height / column widths (the columns get their
 *    width and the cells their height through `style`, as in the "Virtual
 *    Scroll" example of its documentation)
 */
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

defineProps<{ data: BenchRow[] }>();

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
    :value="data"
    dataKey="id"
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
