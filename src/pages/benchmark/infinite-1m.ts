// Infinite Table, 1,000,000 rows
import { defineComponent, h } from 'vue';

import InfiniteBenchmark from '../../benchmark/InfiniteBenchmark.vue';
import { BENCH_SIZES } from '../../benchmark/data';

export default defineComponent(
  () => () => h(InfiniteBenchmark, { rowCount: BENCH_SIZES['1m'] }),
);
