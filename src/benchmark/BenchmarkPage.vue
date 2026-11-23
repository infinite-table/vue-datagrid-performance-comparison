<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';

import {
  BENCH_GRID_HEIGHT,
  BENCH_GRID_WIDTH,
  generateBenchData,
} from './data';
import type { BenchRow } from './data';
import { installBenchmark } from './harness';
import type { BenchAdapter } from './harness';
import { getBenchView } from './updates';
import type { BenchView } from './updates';

/**
 * Identical shell for every grid: generates the data (outside of any
 * measurement), installs `window.__bench` and renders the grid (the default
 * slot) in a fixed size box only when asked to.
 *
 * `?autoMount=0` - used by the benchmark spec, which calls
 * `window.__bench.mount()` itself, so mounting is measured. Without it the
 * grid mounts right away, for looking at the demo in the browser.
 *
 * `?extraHeight=N` - makes the box N px taller. The spec uses it to give
 * all the grids a body of the same height (so they render the same number of
 * rows) when one of them shows something the others don't - e.g. the footer
 * Infinite Table renders when it has no license key.
 *
 * `?view=sorted` (`filtered`, `grouped`) - the grid mounts with that
 * sorting / filter / grouping, for the scenarios with live updates. The grid
 * gets the view in the slot props, and gives the page the function that hands
 * it changed rows with `onUpdater`.
 */
const props = defineProps<{
  title: string;
  rowCount: number;
  adapter: BenchAdapter;
}>();

defineSlots<{
  default(props: {
    /** the rows, in the order of the data (by id) */
    data: BenchRow[];
    width: number;
    height: number;
    /** sorting / filter / grouping to mount with - see updates.ts */
    view: BenchView;
    /**
     * the grid gives the page the function that hands it changed rows (new
     * objects, in place of the ones with the same id), once it can take them
     */
    onUpdater: (update: (rows: BenchRow[]) => void) => void;
  }): any;
}>();

// shallowRef: the rows are plain objects and stay that way - a `ref` would
// have Vue wrap all of them in reactive proxies, in every grid
const data = shallowRef<BenchRow[] | null>(null);
const mounted = ref(false);
let isMounted = false;
const info = ref('generating data...');
const extraHeight = ref(0);
const view = ref<BenchView>('plain');
let updater: ((rows: BenchRow[]) => void) | null = null;
const onUpdater = (update: (rows: BenchRow[]) => void) => {
  updater = update;
};
let uninstall: (() => void) | null = null;

onMounted(() => {
  const start = performance.now();
  const rows = generateBenchData(props.rowCount);
  const dataGenerationTime = performance.now() - start;
  const params = new URLSearchParams(window.location.search);
  view.value = getBenchView(window.location.search);

  uninstall = installBenchmark(
    props.adapter,
    {
      mount: () => {
        isMounted = true;
        mounted.value = true;
      },
      isMounted: () => isMounted,
      view: view.value,
      update: (rows) => {
        if (!updater) {
          throw new Error('The grid cannot take updates yet');
        }
        updater(rows);
      },
    },
    rows,
    dataGenerationTime,
  );

  info.value = `${props.title} · ${rows.length.toLocaleString('en-US')} rows${
    view.value === 'plain' ? '' : ` · ${view.value}`
  } · data generated in ${Math.round(dataGenerationTime)}ms · ${
    process.env.NODE_ENV
  } build${__DEV__ ? ' · __DEV__ on' : ''}`;
  data.value = rows;

  // set before the grid mounts, so mounting is not followed by a resize
  extraHeight.value = Math.max(0, Number(params.get('extraHeight')) || 0);

  const autoMount = params.get('autoMount') !== '0';
  if (autoMount) {
    isMounted = true;
    mounted.value = true;
  }
});

onBeforeUnmount(() => uninstall?.());
</script>

<template>
  <div
    :data-benchmark-grid="adapter.grid"
    :style="{
      position: 'fixed',
      top: 0,
      left: 0,
      width: `${BENCH_GRID_WIDTH}px`,
      height: `${BENCH_GRID_HEIGHT + extraHeight}px`,
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      color: 'black',
    }"
  >
    <slot
      v-if="mounted && data"
      :data="data"
      :width="BENCH_GRID_WIDTH"
      :height="BENCH_GRID_HEIGHT + extraHeight"
      :view="view"
      :onUpdater="onUpdater"
    />
  </div>
  <div
    :style="{
      position: 'fixed',
      top: `${BENCH_GRID_HEIGHT + extraHeight + 8}px`,
      left: '8px',
      font: '13px system-ui, sans-serif',
      color: 'gray',
    }"
  >
    {{ info }}
  </div>
</template>
