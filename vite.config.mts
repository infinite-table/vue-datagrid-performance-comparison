// Vite is only the bundler and the server here: one small app, where each
// URL loads one grid - see README.md
import fs from 'node:fs';
import path from 'node:path';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// the versions that are actually installed - shown on the pages and written
// to the report
function readPackageVersion(name: string) {
  try {
    const pkg = path.resolve(import.meta.dirname, 'node_modules', name, 'package.json');
    return JSON.parse(fs.readFileSync(pkg, 'utf8')).version as string;
  } catch (ex) {
    return 'unknown';
  }
}

export default defineConfig(({ command, mode }) => ({
  plugins: [vue()],
  define: {
    // the spec refuses to measure a development build
    __DEV__: JSON.stringify(command !== 'build'),
    'process.env.NODE_ENV': JSON.stringify(
      command === 'build' ? 'production' : mode,
    ),
    __AG_GRID_VERSION__: JSON.stringify(readPackageVersion('ag-grid-community')),
    __TANSTACK_TABLE_VERSION__: JSON.stringify(
      readPackageVersion('@tanstack/vue-table'),
    ),
    __TANSTACK_VIRTUAL_VERSION__: JSON.stringify(
      readPackageVersion('@tanstack/vue-virtual'),
    ),
    __PRIMEVUE_VERSION__: JSON.stringify(readPackageVersion('primevue')),
    __ELEMENT_PLUS_VERSION__: JSON.stringify(
      readPackageVersion('element-plus'),
    ),
    __INFINITE_VERSION__: JSON.stringify(
      readPackageVersion('@infinite-table/infinite-vue'),
    ),
  },
  build: {
    // every page is a chunk of its own, with its own stylesheet
    cssCodeSplit: true,
    chunkSizeWarningLimit: 5000,
  },
}));
