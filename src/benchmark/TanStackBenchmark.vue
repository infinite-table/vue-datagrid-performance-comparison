<script lang="ts">
import type { BenchAdapter } from './harness';
import BenchmarkPage from './BenchmarkPage.vue';
// TanStack Table is headless - the markup is in TanStackGrid.vue
import TanStackGrid from './TanStackGrid.vue';

const root = () =>
  document.querySelector<HTMLElement>('[data-benchmark-grid="tanstack"] table');

const scroller = () => root()?.parentElement ?? null;

const body = () => root()?.querySelector<HTMLElement>('tbody') ?? null;

const adapter: BenchAdapter = {
  grid: 'tanstack',
  version: __TANSTACK_TABLE_VERSION__,
  getRoot: () => scroller(),
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
      body()?.querySelectorAll<HTMLElement>(`td[data-column-id="${field}"]`) ??
        [],
    ),
  getRenderedRowCells: (rowIndex) =>
    Array.from(
      body()?.querySelectorAll<HTMLElement>(
        `td[data-row-index="${rowIndex}"]`,
      ) ?? [],
    ),
  getCellRowIndex: (cell) => Number(cell.getAttribute('data-row-index') ?? -1),
  getCellColumnId: (cell) => cell.getAttribute('data-column-id') ?? '',
  getCell: (rowIndex, field) =>
    body()?.querySelector<HTMLElement>(
      `td[data-row-index="${rowIndex}"][data-column-id="${field}"]`,
    ) ?? null,
  getHeaderCell: (field) =>
    root()?.querySelector<HTMLElement>(`th[data-column-id="${field}"]`) ?? null,
};

const title = `TanStack Table ${__TANSTACK_TABLE_VERSION__} + TanStack Virtual ${__TANSTACK_VIRTUAL_VERSION__}`;
</script>

<script setup lang="ts">
defineProps<{ rowCount: number }>();
</script>

<template>
  <BenchmarkPage
    :title="title"
    :rowCount="rowCount"
    :adapter="adapter"
    v-slot="{ data }"
  >
    <TanStackGrid :data="data" />
  </BenchmarkPage>
</template>
