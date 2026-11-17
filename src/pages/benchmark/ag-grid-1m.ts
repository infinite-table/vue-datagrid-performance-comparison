// AG Grid, 1,000,000 rows
import { defineComponent, h } from 'vue';

import AgGridBenchmark from '../../benchmark/AgGridBenchmark.vue';
import { BENCH_SIZES } from '../../benchmark/data';

export default defineComponent(
  () => () => h(AgGridBenchmark, { rowCount: BENCH_SIZES['1m'] }),
);
