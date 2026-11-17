// Element Plus Table V2, 1,000,000 rows
import { defineComponent, h } from 'vue';

import ElementPlusBenchmark from '../../benchmark/ElementPlusBenchmark.vue';
import { BENCH_SIZES } from '../../benchmark/data';

export default defineComponent(
  () => () => h(ElementPlusBenchmark, { rowCount: BENCH_SIZES['1m'] }),
);
