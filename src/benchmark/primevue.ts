import type { App } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

/**
 * PrimeVue is styled through its plugin: the Aura preset is the one its
 * documentation starts with. `darkModeSelector: false` keeps the light
 * colours whatever the system setting is, like in the other pages.
 */
export function install(app: App) {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: { darkModeSelector: false },
    },
  });
}
