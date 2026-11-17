// PrimeVue DataTable, 1,000,000 rows
import { defineComponent, h } from 'vue';

import PrimeVueBenchmark from '../../benchmark/PrimeVueBenchmark.vue';
import { BENCH_SIZES } from '../../benchmark/data';

// PrimeVue needs its plugin, with a theme preset - see primevue.ts
export { install } from '../../benchmark/primevue';

export default defineComponent(
  () => () => h(PrimeVueBenchmark, { rowCount: BENCH_SIZES['1m'] }),
);
