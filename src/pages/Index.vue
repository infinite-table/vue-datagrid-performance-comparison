<script setup lang="ts">
import { BENCH_SIZES } from '../benchmark/data';
import type { BenchSize } from '../benchmark/data';

// the installed versions - defined in vite.config.ts
const GRIDS = [
  {
    id: 'tanstack',
    name: 'TanStack Table',
    version: __TANSTACK_TABLE_VERSION__,
  },
  { id: 'ag-grid', name: 'AG Grid', version: __AG_GRID_VERSION__ },
  { id: 'primevue', name: 'PrimeVue DataTable', version: __PRIMEVUE_VERSION__ },
  {
    id: 'element-plus',
    name: 'Element Plus Table V2',
    version: __ELEMENT_PLUS_VERSION__,
  },
  { id: 'infinite', name: 'Infinite Table', version: __INFINITE_VERSION__ },
];

const sizes = Object.keys(BENCH_SIZES) as BenchSize[];
</script>

<!-- the pages the benchmark measures - open them to scroll the grids yourself -->
<template>
  <main
    style="
      padding: 32px;
      font:
        16px/1.6 system-ui,
        sans-serif;
      color: #1b1b1b;
    "
  >
    <h1 style="font-size: 24px">
      TanStack Table, AG Grid, PrimeVue DataTable, Element Plus Table V2 and
      Infinite Table for Vue - benchmark pages
    </h1>
    <p>
      Each page renders one grid with the same generated data. The benchmark
      measures exactly these pages - see the README.
    </p>
    <ul>
      <template v-for="size in sizes" :key="size">
        <li v-for="grid in GRIDS" :key="`${grid.id}-${size}`">
          <a :href="`/benchmark/${grid.id}-${size}`">
            {{ grid.name }} {{ grid.version }} -
            {{ BENCH_SIZES[size].toLocaleString('en-US') }} rows
          </a>
        </li>
      </template>
    </ul>
  </main>
</template>
