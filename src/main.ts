import { createApp } from 'vue';
import type { App, Component } from 'vue';

import './global.css';

// Kept minimal on purpose: nothing is rendered next to the grids, and no
// grid is imported here - each page is a chunk of its own, so it loads only
// the code and the stylesheet of its grid.
//
// /benchmark/<grid>-<size> -> src/pages/benchmark/<grid>-<size>.ts
type PageModule = {
  default: Component;
  /** what the grid of the page needs installed in the app - e.g. a plugin */
  install?: (app: App) => void;
};
const pages = import.meta.glob<PageModule>('./pages/benchmark/*.ts');

const path = window.location.pathname.replace(/\/+$/, '');
const match = /^\/benchmark\/([a-z0-9-]+)$/.exec(path);
const load = match ? pages[`./pages/benchmark/${match[1]}.ts`] : undefined;

const index = (): Promise<PageModule> => import('./pages/Index.vue');

(load ?? index)().then((page) => {
  const app = createApp(page.default);
  page.install?.(app);
  app.mount('#app');
});
