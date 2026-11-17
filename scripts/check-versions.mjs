/**
 * Used by .github/workflows/benchmark.yml: decides which versions of the
 * grids to measure, and whether there is anything to do.
 *
 * A scheduled run looks for a new version of any of the five grids.
 *
 * Env:
 *   EVENT_NAME      schedule | workflow_dispatch | repository_dispatch
 *   AG_GRID         version of ag-grid-vue3 + ag-grid-community ("" or "latest" = latest on npm)
 *   TANSTACK        version of @tanstack/vue-table (same)
 *   PRIMEVUE        version of primevue ("" or "latest" = latest 4.x on npm,
 *                   its `v4-stable` tag - see "License keys" in the README)
 *   ELEMENT_PLUS    version of element-plus (same)
 *   INFINITE        version of @infinite-table/infinite-vue (same)
 *   GH_TOKEN        to look for an open "benchmark failed" issue
 *
 * Outputs (GITHUB_OUTPUT): run, ag_grid, tanstack, primevue, element_plus,
 * infinite, newest, branch, title
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const pkg = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);
const current = {
  agGrid: pkg.dependencies['ag-grid-vue3'],
  tanstack: pkg.dependencies['@tanstack/vue-table'],
  primevue: pkg.dependencies['primevue'],
  elementPlus: pkg.dependencies['element-plus'],
  infinite: pkg.dependencies['@infinite-table/infinite-vue'],
};

const scheduled = process.env.EVENT_NAME === 'schedule';

async function published(name, version) {
  const res = await fetch(
    `https://registry.npmjs.org/${name.replace('/', '%2f')}/${version}`,
  );
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`npm registry: ${res.status} for ${name}@${version}`);
  }
  return (await res.json()).version;
}

async function resolve(name, wanted) {
  const version = await published(name, wanted || 'latest');
  if (!version) {
    throw new Error(`${name}@${wanted} is not on npm`);
  }
  return version;
}

function output(values) {
  const lines = Object.entries(values).map(([key, value]) => `${key}=${value}`);
  console.log(lines.join('\n'));
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, lines.join('\n') + '\n');
  }
}

// numeric, so 10.10.0 is newer than 10.9.0
const compare = (a, b) => a.localeCompare(b, 'en', { numeric: true });

// what a run is called: in its commit message and in its "failed" issue
const describe = (v) =>
  `TanStack Table ${v.tanstack}, AG Grid ${v.agGrid}, PrimeVue ${v.primevue}, Element Plus ${v.elementPlus}, Infinite Table ${v.infinite}`;
const failureTitle = (versions) => `Benchmark failed: ${describe(versions)}`;

function hasOpenFailureIssue(title) {
  if (!process.env.GH_TOKEN) {
    return false;
  }
  const titles = execFileSync(
    'gh',
    [
      'issue',
      'list',
      '--state',
      'open',
      '--label',
      'benchmark-failed',
      '--limit',
      '200',
      '--json',
      'title',
      '--jq',
      '.[].title',
    ],
    { encoding: 'utf8' },
  );
  return titles.split('\n').includes(title);
}

const agGrid = await resolve('ag-grid-vue3', process.env.AG_GRID);
const tanstack = await resolve('@tanstack/vue-table', process.env.TANSTACK);
// PrimeVue 5 asks for a license key, so the benchmark stays on the newest 4.x
const PRIMEVUE_TAG = 'v4-stable';
const wantedPrimevue = process.env.PRIMEVUE;
const primevue = await resolve(
  'primevue',
  !wantedPrimevue || wantedPrimevue === 'latest' ? PRIMEVUE_TAG : wantedPrimevue,
);
const elementPlus = await resolve('element-plus', process.env.ELEMENT_PLUS);
const infinite = await resolve(
  '@infinite-table/infinite-vue',
  process.env.INFINITE,
);
const versions = { agGrid, tanstack, primevue, elementPlus, infinite };
const names = Object.keys(versions);
let run = true;
let reason = 'asked for';

// the two AG Grid packages are published one after the other
if (!(await published('ag-grid-community', agGrid))) {
  if (!scheduled) {
    throw new Error(`ag-grid-community@${agGrid} is not on npm`);
  }
  run = false;
  reason = `ag-grid-community@${agGrid} is not on npm yet`;
} else if (scheduled) {
  if (names.every((name) => versions[name] === current[name])) {
    run = false;
    reason = 'no new versions';
  } else if (hasOpenFailureIssue(failureTitle(versions))) {
    run = false;
    reason = 'these versions failed before - close the issue to try again';
  } else {
    reason = 'new versions';
  }
}

// only the newest versions go to results/latest on master; older ones get
// their branch and their rows in the history table
const newest = names.every(
  (name) => compare(versions[name], current[name]) >= 0,
);

console.log(
  `installed: ${describe(current)}\n` +
    `to measure: ${describe(versions)}\n` +
    `${run ? 'running' : 'not running'}: ${reason}\n`,
);
output({
  run,
  ag_grid: agGrid,
  tanstack,
  primevue,
  element_plus: elementPlus,
  infinite,
  newest,
  // the same name as versionBranch() in scripts/update-results.ts
  branch: `versions/ag-grid-${agGrid}_tanstack-${tanstack}_primevue-${primevue}_element-plus-${elementPlus}_infinite-${infinite}`,
  title: describe(versions),
});
