<script lang="ts">
import type { BenchAdapter } from './harness';
import BenchmarkPage from './BenchmarkPage.vue';
import ElementPlusGrid from './ElementPlusGrid.vue';

import { BENCH_COLUMNS } from './data';

const root = () =>
  document.querySelector<HTMLElement>(
    '[data-benchmark-grid="element-plus"] .el-table-v2',
  );

// the element that is scrolled, on both axes. It has `overflow: hidden`:
// Table V2 handles the wheel events itself, sets scrollTop / scrollLeft on
// this element and draws its own scrollbars over it
const scroller = () =>
  root()?.querySelector<HTMLElement>(
    '.el-table-v2__main .el-table-v2__body > div',
  ) ?? null;

// the columns are not virtualized: a row always has a cell for each of them,
// in order
const columnIndex = (field: string) =>
  BENCH_COLUMNS.findIndex((c) => c.field === field);

const ROW = '.el-table-v2__row';
const CELL = '.el-table-v2__row-cell';

const adapter: BenchAdapter = {
  grid: 'element-plus',
  version: __ELEMENT_PLUS_VERSION__,
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
      scroller()?.querySelectorAll<HTMLElement>(
        `${ROW} > ${CELL}:nth-child(${columnIndex(field) + 1})`,
      ) ?? [],
    ),
  getRenderedRowCells: (rowIndex) =>
    Array.from(
      scroller()?.querySelectorAll<HTMLElement>(
        `${ROW}[data-row-index="${rowIndex}"] > ${CELL}`,
      ) ?? [],
    ),
  getCellRowIndex: (cell) =>
    Number(cell.closest(ROW)?.getAttribute('data-row-index') ?? -1),
  getCellColumnId: (cell) =>
    BENCH_COLUMNS[Array.prototype.indexOf.call(cell.parentElement!.children, cell)]
      ?.field ?? '',
  getCell: (rowIndex, field) =>
    scroller()?.querySelector<HTMLElement>(
      `${ROW}[data-row-index="${rowIndex}"] > ${CELL}:nth-child(${
        columnIndex(field) + 1
      })`,
    ) ?? null,
  getHeaderCell: (field) =>
    root()?.querySelector<HTMLElement>(
      `.el-table-v2__main .el-table-v2__header-cell[data-key="${field}"]`,
    ) ?? null,
};
</script>

<script setup lang="ts">
defineProps<{ rowCount: number }>();
</script>

<template>
  <BenchmarkPage
    :title="`Element Plus Table V2 ${adapter.version}`"
    :rowCount="rowCount"
    :adapter="adapter"
    v-slot="{ data, width, height, view, onUpdater }"
  >
    <ElementPlusGrid
      :data="data"
      :width="width"
      :height="height"
      :view="view"
      :onUpdater="onUpdater"
    />
  </BenchmarkPage>
</template>
