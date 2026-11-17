// TanStack Table + TanStack Virtual, 1,000,000 rows
import { defineComponent, h } from 'vue';

import TanStackBenchmark from '../../benchmark/TanStackBenchmark.vue';
import { BENCH_SIZES } from '../../benchmark/data';

export default defineComponent(
  () => () => h(TanStackBenchmark, { rowCount: BENCH_SIZES['1m'] }),
);
