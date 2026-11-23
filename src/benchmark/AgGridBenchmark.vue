<script lang="ts">
import { AgGridVue } from 'ag-grid-vue3';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import type {
  ColDef,
  GetRowIdParams,
  GridReadyEvent,
  GridState,
} from 'ag-grid-community';

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
  BENCH_FILTER_FIELD,
  BENCH_FILTER_MIN,
  BENCH_SORT_DIR,
  BENCH_SORT_FIELD,
} from './updates';
import type { BenchView } from './updates';

ModuleRegistry.registerModules([AllCommunityModule]);

const columnDefs: ColDef<BenchRow>[] = BENCH_COLUMNS.map((c) => ({
  field: c.field,
  headerName: c.header,
  cellDataType: c.type === 'number' ? 'number' : 'text',
  width: BENCH_COLUMN_WIDTH,
  sortable: true,
}));

// the filtered view: the salary column has AG Grid's number filter (columns
// have no filter by default)
const filteredColumnDefs: ColDef<BenchRow>[] = columnDefs.map((c) =>
  c.field === BENCH_FILTER_FIELD ? { ...c, filter: 'agNumberColumnFilter' } : c,
);

// the views of the live-update scenarios - see updates.ts. AG Grid
// Community has no row grouping or aggregation: it has no `grouped` view
const initialStates: Partial<Record<BenchView, GridState>> = {
  sorted: {
    sort: {
      sortModel: [
        { colId: BENCH_SORT_FIELD, sort: BENCH_SORT_DIR === -1 ? 'desc' : 'asc' },
      ],
    },
  },
  filtered: {
    filter: {
      filterModel: {
        [BENCH_FILTER_FIELD]: {
          filterType: 'number',
          type: 'greaterThanOrEqual',
          filter: BENCH_FILTER_MIN,
        },
      },
    },
  },
};

const gridReady =
  (onUpdater: (update: (rows: BenchRow[]) => void) => void) =>
  ({ api }: GridReadyEvent<BenchRow>) =>
    onUpdater((rows) => {
      api.applyTransaction({ update: rows });
    });

const getRowId = (params: GetRowIdParams<BenchRow>) => String(params.data.id);

const root = () =>
  document.querySelector<HTMLElement>(
    '[data-benchmark-grid="ag-grid"] .ag-root-wrapper',
  );

// AG Grid 36: one native scroller (.ag-grid-viewport) for both axes, with a
// sticky header inside it and the body rows in .ag-grid-scrolling-rows
const viewport = () =>
  root()?.querySelector<HTMLElement>('.ag-grid-viewport') ?? null;

const centerRows = () =>
  root()?.querySelector<HTMLElement>('.ag-grid-scrolling-rows') ?? null;

const adapter: BenchAdapter = {
  grid: 'ag-grid',
  version: __AG_GRID_VERSION__,
  getRoot: root,
  getVerticalScroller: viewport,
  getHorizontalScroller: viewport,
  getBodyRect: () => {
    const el = viewport();
    const header = root()?.querySelector<HTMLElement>('.ag-header');
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
      centerRows()?.querySelectorAll<HTMLElement>(
        `.ag-row .ag-cell[col-id="${field}"]`,
      ) ?? [],
    ),
  getRenderedRowCells: (rowIndex) =>
    Array.from(
      centerRows()?.querySelectorAll<HTMLElement>(
        `.ag-row[row-index="${rowIndex}"] .ag-cell`,
      ) ?? [],
    ),
  getCellRowIndex: (cell) =>
    Number(cell.closest('.ag-row')?.getAttribute('row-index') ?? -1),
  getCellColumnId: (cell) => cell.getAttribute('col-id') ?? '',
  getCell: (rowIndex, field) =>
    centerRows()?.querySelector<HTMLElement>(
      `.ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${field}"]`,
    ) ?? null,
  getHeaderCell: (field) =>
    root()?.querySelector<HTMLElement>(`.ag-header-cell[col-id="${field}"]`) ??
    null,
};

const style = { flex: 1, minHeight: 0 };
</script>

<script setup lang="ts">
/**
 * AG Grid with defaults, except for the settings below, which only make the
 * setup match the other grids:
 *  - same row height / header height / column widths
 *  - animateRows: false - the other grids don't animate row moves on sort,
 *    and the animation would make "sorted rows visible" ambiguous
 *  - getRowId - the other grids have a row id too
 *
 * Rows are changed with `api.applyTransaction({ update })`, the transaction
 * API AG Grid documents for updating rows.
 */
defineProps<{ rowCount: number }>();
</script>

<template>
  <BenchmarkPage
    :title="`AG Grid ${adapter.version}`"
    :rowCount="rowCount"
    :adapter="adapter"
    v-slot="{ data, view, onUpdater }"
  >
    <AgGridVue
      :style="style"
      :theme="themeQuartz"
      :initialState="initialStates[view]"
      @grid-ready="gridReady(onUpdater)($event)"
      :rowData="data"
      :columnDefs="view === 'filtered' ? filteredColumnDefs : columnDefs"
      :getRowId="getRowId"
      :rowHeight="BENCH_ROW_HEIGHT"
      :headerHeight="BENCH_HEADER_HEIGHT"
      :animateRows="false"
    />
  </BenchmarkPage>
</template>
