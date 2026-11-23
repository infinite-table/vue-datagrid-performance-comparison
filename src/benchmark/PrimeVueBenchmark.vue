<script lang="ts">
import type { BenchAdapter } from './harness';
import BenchmarkPage from './BenchmarkPage.vue';
import PrimeVueGrid from './PrimeVueGrid.vue';

import { BENCH_COLUMNS } from './data';

const root = () =>
  document.querySelector<HTMLElement>(
    '[data-benchmark-grid="primevue"] .p-datatable',
  );

// one native scroller for both axes, with the (sticky) header inside it
const scroller = () =>
  root()?.querySelector<HTMLElement>('.p-virtualscroller') ?? null;

const body = () =>
  root()?.querySelector<HTMLElement>('tbody.p-datatable-tbody') ?? null;

// the columns are not virtualized: a row always has a cell for each of them,
// in order
const columnIndex = (field: string) =>
  BENCH_COLUMNS.findIndex((c) => c.field === field);

const adapter: BenchAdapter = {
  grid: 'primevue',
  version: __PRIMEVUE_VERSION__,
  getRoot: root,
  getVerticalScroller: scroller,
  getHorizontalScroller: scroller,
  getBodyRect: () => {
    const el = scroller();
    const header = root()?.querySelector<HTMLElement>('thead');
    if (!el || !header) {
      return null;
    }
    const rect = el.getBoundingClientRect();
    const top = header.getBoundingClientRect().bottom;
    return {
      left: rect.left + el.clientLeft,
      top,
      width: el.clientWidth,
      height: rect.top + el.clientTop + el.clientHeight - top,
    };
  },
  getRenderedColumnCells: (field) =>
    Array.from(
      body()?.querySelectorAll<HTMLElement>(
        `tr > td:nth-child(${columnIndex(field) + 1})`,
      ) ?? [],
    ),
  getRenderedRowCells: (rowIndex) =>
    Array.from(
      body()?.querySelectorAll<HTMLElement>(
        `tr[data-p-index="${rowIndex}"] > td`,
      ) ?? [],
    ),
  getCellRowIndex: (cell) =>
    Number(cell.closest('tr')?.getAttribute('data-p-index') ?? -1),
  getCellColumnId: (cell) =>
    BENCH_COLUMNS[(cell as HTMLTableCellElement).cellIndex]?.field ?? '',
  getCell: (rowIndex, field) =>
    body()?.querySelector<HTMLElement>(
      `tr[data-p-index="${rowIndex}"] > td:nth-child(${columnIndex(field) + 1})`,
    ) ?? null,
  getHeaderCell: (field) =>
    root()?.querySelector<HTMLElement>(
      `thead th:nth-child(${columnIndex(field) + 1})`,
    ) ?? null,
};
</script>

<script setup lang="ts">
defineProps<{ rowCount: number }>();
</script>

<template>
  <BenchmarkPage
    :title="`PrimeVue DataTable ${adapter.version}`"
    :rowCount="rowCount"
    :adapter="adapter"
    v-slot="{ data, view, onUpdater }"
  >
    <PrimeVueGrid :data="data" :view="view" :onUpdater="onUpdater" />
  </BenchmarkPage>
</template>
