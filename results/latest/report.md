# AG Grid vs TanStack Table vs PrimeVue DataTable vs Element Plus Table V2 vs Infinite Table — benchmark report

- Run: `ci` · 2026-11-17T21:36:30.786Z
- AG Grid 36.3.0 · TanStack Table 9.3.1 · PrimeVue DataTable 4.5.5 · Element Plus Table V2 2.14.8 · Infinite Table 10.2.0
- 300,000 rows (data checksum `300000:72377c6e`) · 1,000,000 rows (data checksum `1000000:19e5eebe`) × 20 columns, identical data for every grid
- Chrome 136.0.7103.25 · headless · CPU throttling 1× · viewport 1400×1000
- 7 measured runs per grid per scenario (+1 warmup, discarded), interleaved, fresh browser context per run
- Linux 7.0.0-1017-azure x64 · AMD EPYC 9V45 96-Core Processor × 4
- Served from http://localhost:5570/
- Grid body: 759-760 px high, with the same number of rows in view in every grid (to get there, the setup made the boxes taller: AG Grid +3 px, TanStack +2 px, Infinite +24 px)

The "Infinite vs ..." columns compare Infinite Table with one other grid: the ratio of the medians (Infinite / other, so < 1 means Infinite has the lower value), its 95% bootstrap confidence interval, and the grid that does better. A grid is only named when the interval excludes 1; "≈" means no significant difference. When the other grid has zeros among its values (e.g. 0% blank samples) a ratio means nothing, so the difference of the medians (Infinite − other) and its interval are shown instead, and a grid is only named when that interval excludes 0.

# 300,000 rows

Scroll range - browsers cap element sizes (Chrome ~16.7M-33.5M px, depending on the version), so a grid has to map the scrollbar onto the rows when the content is taller than that. One that doesn't can't reach its last rows: its scrolling results are for the rows it can reach, and the same wheel gesture goes over fewer rows in it.

| | AG Grid | TanStack | PrimeVue | Element Plus | Infinite |
|---|---:|---:|---:|---:|---:|
| Last row reachable with the scrollbar | yes (300,000) | yes (300,000) | yes (300,000) | yes (300,000) | yes (300,000) |
| Native scroll range | 11,999,241 px | 11,999,240 px | 11,999,240 px | 11,999,240 px | 11,999,240 px |
| Content px per scrollbar px | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 |

## mount - 300,000 rows

Mount the grid with all the rows (data already in memory). "Visible" = from setState to the end of the first frame committed with the whole viewport (first/last visible row and column) showing the right content. "Settled" = until the first frame committed after the grid's last DOM mutation. Memory is the JS heap retained by the grid after GC (heap after mount - heap before mount).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Time to first rows painted (lower is better) | 730 ms (±50.8) | 191 ms (±3.87) | 437 ms (±21.9) | 41.6 ms (±3.93) | 203 ms (±9.39) | 0.28 × (0.26–0.31) **Infinite** | 1.06 × (1.03–1.11) **TanStack** | 0.46 × (0.44–0.50) **Infinite** | 4.88 × (4.10–5.15) **Element Plus** |
| Time until settled (lower is better) | 833 ms (±51.0) | 191 ms (±3.87) | 437 ms (±21.9) | 41.6 ms (±3.93) | 213 ms (±9.67) | 0.26 × (0.25–0.28) **Infinite** | 1.12 × (1.09–1.17) **TanStack** | 0.49 × (0.46–0.53) **Infinite** | 5.13 × (4.30–5.42) **Element Plus** |
| Main thread: layout (lower is better) | 6.73 ms (±2.19) | 3.69 ms (±0.07) | 12.0 ms (±1.88) | 4.17 ms (±0.16) | 3.33 ms (±0.20) | 0.49 × (0.37–0.54) **Infinite** | 0.90 × (0.84–0.94) **Infinite** | 0.28 × (0.25–0.37) **Infinite** | 0.80 × (0.75–0.86) **Infinite** |
| Main thread: style recalc (lower is better) | 10.6 ms (±3.05) | 1.62 ms (±0.27) | 10.3 ms (±1.50) | 2.69 ms (±0.07) | 6.16 ms (±0.50) | 0.58 × (0.50–0.64) **Infinite** | 3.81 × (2.86–4.10) **TanStack** | 0.60 × (0.51–0.76) **Infinite** | 2.29 × (2.02–2.43) **Element Plus** |
| Main thread: all tasks (lower is better) | 738 ms (±63.3) | 194 ms (±4.05) | 459 ms (±22.0) | 67.2 ms (±4.84) | 209 ms (±10.9) | 0.28 × (0.26–0.31) **Infinite** | 1.08 × (1.02–1.14) **TanStack** | 0.46 × (0.43–0.49) **Infinite** | 3.11 × (2.79–3.28) **Element Plus** |
| JS heap retained by grid (lower is better) | 204 MB (±0.01) | 87.2 MB (±0.06) | 21.6 MB (±0.00) | 2.77 MB (±0.00) | 36.7 MB (±0.00) | 0.18 × (0.18–0.18) **Infinite** | 0.42 × (0.42–0.42) **Infinite** | 1.70 × (1.70–1.70) **PrimeVue** | 13.3 × (13.3–13.3) **Element Plus** |
| DOM elements in grid (lower is better) | 637 (±0.00) | 352 (±0.00) | 1028 (±0.00) | 992 (±0.00) | 608 (±0.00) | 0.95 × (0.95–0.95) **Infinite** | 1.73 × (1.73–1.73) **TanStack** | 0.59 × (0.59–0.59) **Infinite** | 0.61 × (0.61–0.61) **Infinite** |

## sort-string - 300,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 899 ms (±22.3) | 1043 ms (±93.8) | 2412 ms (±139) | 244 ms (±11.8) | 431 ms (±29.0) | 0.48 × (0.45–0.53) **Infinite** | 0.41 × (0.37–0.48) **Infinite** | 0.18 × (0.16–0.20) **Infinite** | 1.76 × (1.61–1.92) **Element Plus** |
| Ascending: click to settled (lower is better) | 899 ms (±22.3) | 1043 ms (±93.8) | 2412 ms (±139) | 244 ms (±11.8) | 434 ms (±29.1) | 0.48 × (0.45–0.53) **Infinite** | 0.42 × (0.37–0.49) **Infinite** | 0.18 × (0.16–0.20) **Infinite** | 1.78 × (1.62–1.94) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 893 ms (±76.9) | 996 ms (±101) | 2356 ms (±110) | 255 ms (±19.7) | 444 ms (±25.7) | 0.50 × (0.43–0.53) **Infinite** | 0.45 × (0.38–0.49) **Infinite** | 0.19 × (0.17–0.20) **Infinite** | 1.74 × (1.57–1.97) **Element Plus** |
| Descending: click to settled (lower is better) | 893 ms (±76.9) | 996 ms (±101) | 2356 ms (±110) | 255 ms (±19.7) | 444 ms (±25.7) | 0.50 × (0.43–0.53) **Infinite** | 0.45 × (0.38–0.49) **Infinite** | 0.19 × (0.17–0.20) **Infinite** | 1.74 × (1.57–1.97) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 904 ms (±22.5) | 1045 ms (±93.6) | 2429 ms (±138) | 296 ms (±15.9) | 482 ms (±25.8) | 0.53 × (0.49–0.55) **Infinite** | 0.46 × (0.40–0.51) **Infinite** | 0.20 × (0.18–0.21) **Infinite** | 1.62 × (1.47–1.74) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 894 ms (±77.2) | 998 ms (±101) | 2372 ms (±110) | 306 ms (±21.8) | 440 ms (±26.1) | 0.49 × (0.42–0.52) **Infinite** | 0.44 × (0.37–0.49) **Infinite** | 0.19 × (0.16–0.20) **Infinite** | 1.44 × (1.30–1.62) **Element Plus** |

## sort-number - 300,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 879 ms (±107) | 657 ms (±152) | 1938 ms (±120) | 152 ms (±18.7) | 320 ms (±58.9) | 0.36 × (0.33–0.43) **Infinite** | 0.49 × (0.34–0.54) **Infinite** | 0.17 × (0.15–0.18) **Infinite** | 2.11 × (1.75–2.22) **Element Plus** |
| Ascending: click to settled (lower is better) | 879 ms (±107) | 657 ms (±152) | 1938 ms (±120) | 152 ms (±18.7) | 323 ms (±59.1) | 0.37 × (0.34–0.44) **Infinite** | 0.49 × (0.35–0.54) **Infinite** | 0.17 × (0.15–0.18) **Infinite** | 2.13 × (1.76–2.24) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 870 ms (±126) | 723 ms (±126) | 1911 ms (±155) | 158 ms (±20.3) | 319 ms (±36.0) | 0.37 × (0.32–0.46) **Infinite** | 0.44 × (0.37–0.56) **Infinite** | 0.17 × (0.16–0.21) **Infinite** | 2.02 × (1.95–2.51) **Element Plus** |
| Descending: click to settled (lower is better) | 870 ms (±126) | 723 ms (±126) | 1911 ms (±155) | 158 ms (±20.3) | 319 ms (±36.0) | 0.37 × (0.32–0.46) **Infinite** | 0.44 × (0.37–0.56) **Infinite** | 0.17 × (0.16–0.21) **Infinite** | 2.02 × (1.95–2.51) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 884 ms (±108) | 765 ms (±168) | 1955 ms (±120) | 197 ms (±17.6) | 342 ms (±60.2) | 0.39 × (0.35–0.47) **Infinite** | 0.45 × (0.32–0.49) **Infinite** | 0.17 × (0.16–0.19) **Infinite** | 1.73 × (1.42–1.93) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 875 ms (±126) | 724 ms (±126) | 1926 ms (±155) | 198 ms (±24.6) | 312 ms (±36.7) | 0.36 × (0.31–0.45) **Infinite** | 0.43 × (0.36–0.55) **Infinite** | 0.16 × (0.15–0.20) **Infinite** | 1.58 × (1.46–2.03) **Element Plus** |

## scroll-jump - 300,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 23.3 ms (±1.55) | 12.2 ms (±0.75) | 234 ms (±8.50) | 33.6 ms (±2.61) | 30.2 ms (±2.27) | 1.30 × (1.18–1.40) **AG Grid** | 2.48 × (2.27–2.70) **TanStack** | 0.13 × (0.12–0.14) **Infinite** | 0.90 × (0.80–0.99) **Infinite** |
| Jump to rows painted (worst jump) (lower is better) | 40.2 ms (±5.86) | 20.8 ms (±1.46) | 319 ms (±21.5) | 50.4 ms (±4.73) | 44.7 ms (±3.06) | 1.11 × (0.93–1.22) ≈ | 2.14 × (1.97–2.31) **TanStack** | 0.14 × (0.13–0.16) **Infinite** | 0.89 × (0.82–1.08) ≈ |
| Jump to settled (median of jumps) (lower is better) | 23.3 ms (±1.55) | 12.2 ms (±0.75) | 234 ms (±8.50) | 33.6 ms (±2.61) | 30.2 ms (±2.27) | 1.30 × (1.18–1.40) **AG Grid** | 2.48 × (2.27–2.70) **TanStack** | 0.13 × (0.12–0.14) **Infinite** | 0.90 × (0.80–0.99) **Infinite** |
| Main thread, all tasks (all jumps) (lower is better) | 351 ms (±18.7) | 225 ms (±11.4) | 2706 ms (±95.0) | 388 ms (±26.6) | 378 ms (±21.4) | 1.08 × (0.97–1.15) ≈ | 1.68 × (1.57–1.83) **TanStack** | 0.14 × (0.13–0.15) **Infinite** | 0.98 × (0.89–1.10) ≈ |

## scroll-vertical - 300,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 56.5 % (±0.27) | 100 % (±19.6) | 15.2 % (±0.81) | 50.1 % (±0.09) | 63.0 % (±2.72) | 1.11 × (1.09–1.15) **Infinite** | 0.63 × (0.62–0.86) **TanStack** | 4.15 × (3.80–4.37) **Infinite** | 1.26 × (1.23–1.30) **Infinite** |
| Frames presented without main-thread update (lower is better) | 43.2 % (±0.34) | 0.00 % (±19.3) | 78.4 % (±0.95) | 49.6 % (±0.07) | 37.0 % (±2.79) | 0.86 × (0.80–0.89) **Infinite** | +37.0 (+10.8 to +38.4) **TanStack** | 0.47 × (0.44–0.49) **Infinite** | 0.75 × (0.69–0.78) **Infinite** |
| Frames dropped (lower is better) | 0.31 % (±0.21) | 0.00 % (±0.24) | 6.16 % (±1.70) | 0.27 % (±0.10) | 0.00 % (±0.21) | -0.31 (-0.31 to 0.00) ≈ | 0.00 (-0.41 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.12) | 60.0 fps (±0.12) | 6.60 fps (±0.34) | 60.0 fps (±0.12) | 59.0 fps (±0.56) | 0.98 × (0.97–0.98) **AG Grid** | 0.98 × (0.97–0.98) **TanStack** | 8.94 × (8.34–9.08) **Infinite** | 0.98 × (0.97–0.98) **Element Plus** |
| p95 rAF frame interval (lower is better) | 16.8 ms (±0.05) | 16.8 ms (±0.05) | 263 ms (±16.1) | 16.7 ms (±0.04) | 16.8 ms (±0.05) | 1.00 × (0.99–1.01) ≈ | 1.00 × (1.00–1.01) ≈ | 0.06 × (0.06–0.07) **Infinite** | 1.01 × (1.00–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±6.27) | 16.8 ms (±6.27) | 267 ms (±21.2) | 16.8 ms (±6.24) | 50.0 ms (±6.27) | 2.98 × (2.98–2.98) **AG Grid** | 2.98 × (2.98–2.98) **TanStack** | 0.19 × (0.18–0.19) **Infinite** | 2.98 × (2.98–2.98) **Element Plus** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.20) | 0.00 % (±0.20) | 63.6 % (±2.29) | 0.00 % (±0.20) | 1.09 % (±0.95) | +1.09 (+1.09 to +2.78) **AG Grid** | +1.09 (+1.09 to +2.78) **TanStack** | 0.02 × (0.02–0.04) **Infinite** | +1.09 (+1.09 to +2.78) **Element Plus** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 2089 ms (±59.9) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 224 ms (±14.3) | 76.6 ms (±5.88) | 105 ms (±3.84) | 118 ms (±4.82) | 62.9 ms (±4.12) | 0.28 × (0.27–0.31) **Infinite** | 0.82 × (0.75–0.90) **Infinite** | 0.60 × (0.58–0.66) **Infinite** | 0.53 × (0.52–0.61) **Infinite** |
| Main thread: style recalc (lower is better) | 126 ms (±14.0) | 41.9 ms (±3.01) | 71.9 ms (±2.34) | 119 ms (±7.38) | 171 ms (±12.0) | 1.36 × (1.18–1.59) **AG Grid** | 4.09 × (4.00–4.78) **TanStack** | 2.38 × (2.33–2.60) **PrimeVue** | 1.44 × (1.41–1.71) **Element Plus** |
| Main thread: all tasks (lower is better) | 1155 ms (±98.2) | 811 ms (±76.7) | 3155 ms (±71.3) | 2233 ms (±104) | 1490 ms (±100) | 1.29 × (1.16–1.45) **AG Grid** | 1.84 × (1.70–2.03) **TanStack** | 0.47 × (0.46–0.51) **Infinite** | 0.67 × (0.64–0.76) **Infinite** |

## scroll-horizontal - 300,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 100 % (±3.40) | 86.3 % (±6.95) | 98.3 % (±0.62) | 80.3 % (±5.91) | 89.4 % (±2.63) | 0.89 × (0.89–0.95) **AG Grid** | 1.04 × (1.02–1.11) **Infinite** | 0.91 × (0.90–0.92) **PrimeVue** | 1.11 × (1.10–1.19) **Infinite** |
| Frames presented without main-thread update (lower is better) | 0.00 % (±2.13) | 12.9 % (±6.89) | 1.69 % (±0.62) | 19.0 % (±3.34) | 10.6 % (±2.63) | +10.6 (+6.97 to +11.2) **AG Grid** | -2.24 (-8.60 to -0.26) **Infinite** | 6.28 × (4.17–6.60) **PrimeVue** | 0.56 × (0.44–0.59) **Infinite** |
| Frames dropped (lower is better) | 0.00 % (±1.64) | 0.70 % (±0.82) | 0.00 % (±0.00) | 0.68 % (±2.76) | 0.00 % (±0.00) | 0.00 (-3.45 to 0.00) ≈ | -0.70 (-1.54 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.24) | 60.0 fps (±0.18) | 60.0 fps (±0.00) | 60.0 fps (±1.92) | 60.0 fps (±0.00) | 1.00 × (1.00–1.01) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.8 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±6.27) | 16.7 ms (±0.05) | 0.99 × (0.99–1.01) ≈ | 1.00 × (0.99–1.01) ≈ | 1.00 × (0.99–1.01) ≈ | 1.00 × (1.00–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±8.10) | 16.8 ms (±6.24) | 16.8 ms (±0.00) | 16.8 ms (±12.5) | 16.8 ms (±0.00) | 1.00 × (0.50–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.40) | 0.00 % (±0.31) | 0.00 % (±0.00) | 0.00 % (±2.86) | 0.00 % (±0.00) | 0.00 (-0.82 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 68.5 ms (±1.66) | 50.5 ms (±4.26) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 21.5 ms (±0.89) | 0.31 × (0.31–0.34) **Infinite** | 0.43 × (0.39–0.49) **Infinite** | +21.5 (+21.2 to +22.8) **PrimeVue** | +21.5 (+21.2 to +22.8) **Element Plus** |
| Main thread: style recalc (lower is better) | 34.6 ms (±1.29) | 14.9 ms (±0.95) | 0.00 ms (±0.00) | 11.9 ms (±1.16) | 26.8 ms (±1.58) | 0.78 × (0.73–0.85) **Infinite** | 1.80 × (1.69–2.09) **TanStack** | +26.8 (+25.8 to +29.0) **PrimeVue** | 2.24 × (2.04–2.50) **Element Plus** |
| Main thread: all tasks (lower is better) | 509 ms (±14.0) | 416 ms (±35.2) | 27.2 ms (±4.07) | 992 ms (±127) | 350 ms (±15.7) | 0.69 × (0.67–0.75) **Infinite** | 0.84 × (0.75–0.95) **Infinite** | 12.9 × (11.6–14.9) **PrimeVue** | 0.35 × (0.33–0.39) **Infinite** |

## correctness-vertical - 300,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 2.28 % (±1.05) | 2.31 % (±0.43) | 0.00 % (±0.00) | 2.34 % (±0.88) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 11.4 % (±5.26) | 11.5 % (±2.14) | 0.00 % (±0.00) | 11.7 % (±4.40) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Worst frame: correct samples (higher is better) | 80.0 % (±0.00) | 80.0 % (±0.00) | 100 % (±0.00) | 80.0 % (±0.00) | 100 % (±0.00) | 1.25 × (1.25–1.25) **Infinite** | 1.25 × (1.25–1.25) **Infinite** | 1.00 × (1.00–1.00) ≈ | 1.25 × (1.25–1.25) **Infinite** |

## correctness-horizontal - 300,000 rows

Same kind of horizontal wheel gesture. After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: correct samples (higher is better) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |

## visual-blank-vertical - 300,000 rows

Fast vertical wheel gesture (20000px/s) while recording what the compositor actually displays (CDP screencast). Each frame is checked for blank areas: vertical runs of the body with no text where rows should be. Unlike the correctness probe, this also catches the compositor scrolling ahead of the main thread. Screencast capture skips frames under load and adds overhead - compare the grids, not absolute numbers.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Captured frames with blank rows (lower is better) | 4.41 % (±1.83) | 1.47 % (±1.90) | 94.5 % (±1.21) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | -1.47 (-2.90 to -1.43) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 1.11 % (±0.58) | 0.16 % (±0.56) | 90.1 % (±1.17) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | -0.16 (-0.69 to -0.08) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 8.00 rows (±3.91) | 1.00 rows (±4.02) | 18.0 rows (±0.00) | 0.00 rows (±0.00) | 0.00 rows (±0.00) | 0.00 × (0.00–0.00) **Infinite** | -1.00 (-9.00 to -1.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Captured frames (higher is better) | 68.0 (±1.00) | 69.0 (±2.29) | 74.0 (±0.98) | 64.0 (±2.06) | 73.0 (±1.25) | 1.07 × (1.06–1.12) **Infinite** | 1.06 × (1.03–1.10) **Infinite** | 0.99 × (0.97–1.01) ≈ | 1.14 × (1.11–1.19) **Infinite** |

# 1,000,000 rows

Scroll range - browsers cap element sizes (Chrome ~16.7M-33.5M px, depending on the version), so a grid has to map the scrollbar onto the rows when the content is taller than that. One that doesn't can't reach its last rows: its scrolling results are for the rows it can reach, and the same wheel gesture goes over fewer rows in it.

| | AG Grid | TanStack | PrimeVue | Element Plus | Infinite |
|---|---:|---:|---:|---:|---:|
| Last row reachable with the scrollbar | yes (1,000,000) | **no** - stops at row 838,860 | **no** - stops at row 838,881 | **no** - stops at row 838,861 | yes (1,000,000) |
| Native scroll range | 31,999,240 px | 33,553,630 px | 33,553,632 px | 33,553,668 px | 31,999,240 px |
| Content px per scrollbar px | 1.250 | 1.000 | 1.000 | 1.000 | 1.250 |

## mount - 1,000,000 rows

Mount the grid with all the rows (data already in memory). "Visible" = from setState to the end of the first frame committed with the whole viewport (first/last visible row and column) showing the right content. "Settled" = until the first frame committed after the grid's last DOM mutation. Memory is the JS heap retained by the grid after GC (heap after mount - heap before mount).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Time to first rows painted (lower is better) | 2221 ms (±72.9) | 512 ms (±25.2) | 731 ms (±39.5) | 41.5 ms (±2.16) | 488 ms (±63.4) | 0.22 × (0.20–0.25) **Infinite** | 0.95 × (0.87–1.06) ≈ | 0.67 × (0.59–0.74) **Infinite** | 11.8 × (10.5–13.2) **Element Plus** |
| Time until settled (lower is better) | 2324 ms (±72.2) | 512 ms (±25.2) | 731 ms (±39.5) | 41.5 ms (±2.16) | 500 ms (±64.2) | 0.22 × (0.19–0.24) **Infinite** | 0.98 × (0.89–1.09) ≈ | 0.68 × (0.60–0.76) **Infinite** | 12.0 × (10.8–13.5) **Element Plus** |
| Main thread: layout (lower is better) | 6.92 ms (±0.25) | 3.64 ms (±2.83) | 14.2 ms (±0.91) | 4.32 ms (±0.21) | 3.68 ms (±0.16) | 0.53 × (0.49–0.54) **Infinite** | 1.01 × (0.89–1.03) ≈ | 0.26 × (0.23–0.27) **Infinite** | 0.85 × (0.79–0.91) **Infinite** |
| Main thread: style recalc (lower is better) | 10.9 ms (±0.42) | 1.65 ms (±0.25) | 10.6 ms (±0.52) | 2.74 ms (±0.09) | 6.19 ms (±0.18) | 0.57 × (0.54–0.60) **Infinite** | 3.76 × (3.08–4.03) **TanStack** | 0.59 × (0.55–0.61) **Infinite** | 2.26 × (2.21–2.38) **Element Plus** |
| Main thread: all tasks (lower is better) | 2234 ms (±74.9) | 522 ms (±28.3) | 801 ms (±41.6) | 45.4 ms (±3.01) | 496 ms (±57.2) | 0.22 × (0.20–0.25) **Infinite** | 0.95 × (0.87–1.05) ≈ | 0.62 × (0.56–0.69) **Infinite** | 10.9 × (9.62–12.2) **Element Plus** |
| JS heap retained by grid (lower is better) | 670 MB (±0.00) | 287 MB (±0.01) | 21.7 MB (±0.01) | 2.77 MB (±0.00) | 90.8 MB (±0.00) | 0.14 × (0.14–0.14) **Infinite** | 0.32 × (0.32–0.32) **Infinite** | 4.19 × (4.19–4.19) **PrimeVue** | 32.8 × (32.8–32.8) **Element Plus** |
| DOM elements in grid (lower is better) | 637 (±0.00) | 352 (±0.00) | 1028 (±0.00) | 992 (±0.00) | 608 (±0.00) | 0.95 × (0.95–0.95) **Infinite** | 1.73 × (1.73–1.73) **TanStack** | 0.59 × (0.59–0.59) **Infinite** | 0.61 × (0.61–0.61) **Infinite** |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 4250 ms (±546) | 3520 ms (±389) | 8643 ms (±993) | 920 ms (±101) | 1540 ms (±127) | 0.36 × (0.33–0.49) **Infinite** | 0.44 × (0.36–0.47) **Infinite** | 0.18 × (0.15–0.20) **Infinite** | 1.68 × (1.37–1.82) **Element Plus** |
| Ascending: click to settled (lower is better) | 4250 ms (±546) | 3520 ms (±389) | 8643 ms (±993) | 920 ms (±101) | 1544 ms (±127) | 0.36 × (0.33–0.49) **Infinite** | 0.44 × (0.36–0.47) **Infinite** | 0.18 × (0.15–0.20) **Infinite** | 1.68 × (1.38–1.82) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 3668 ms (±448) | 3934 ms (±372) | 9183 ms (±932) | 936 ms (±129) | 1668 ms (±212) | 0.45 × (0.37–0.55) **Infinite** | 0.42 × (0.38–0.54) **Infinite** | 0.18 × (0.16–0.22) **Infinite** | 1.78 × (1.45–2.13) **Element Plus** |
| Descending: click to settled (lower is better) | 3668 ms (±448) | 3934 ms (±372) | 9183 ms (±932) | 936 ms (±129) | 1668 ms (±212) | 0.45 × (0.37–0.55) **Infinite** | 0.42 × (0.38–0.54) **Infinite** | 0.18 × (0.16–0.22) **Infinite** | 1.78 × (1.45–2.13) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 4255 ms (±546) | 3523 ms (±389) | 8661 ms (±991) | 1066 ms (±66.9) | 1571 ms (±129) | 0.37 × (0.34–0.49) **Infinite** | 0.45 × (0.36–0.47) **Infinite** | 0.18 × (0.15–0.20) **Infinite** | 1.47 × (1.30–1.57) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 3671 ms (±448) | 3935 ms (±373) | 9201 ms (±933) | 1110 ms (±167) | 1662 ms (±213) | 0.45 × (0.37–0.54) **Infinite** | 0.42 × (0.38–0.53) **Infinite** | 0.18 × (0.16–0.22) **Infinite** | 1.50 × (1.22–1.91) **Element Plus** |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 4171 ms (±311) | 3446 ms (±181) | 8133 ms (±647) | 653 ms (±59.7) | 1339 ms (±71.0) | 0.32 × (0.30–0.37) **Infinite** | 0.39 × (0.36–0.42) **Infinite** | 0.16 × (0.15–0.18) **Infinite** | 2.05 × (1.94–2.38) **Element Plus** |
| Ascending: click to settled (lower is better) | 4171 ms (±311) | 3446 ms (±181) | 8133 ms (±647) | 653 ms (±59.7) | 1342 ms (±71.1) | 0.32 × (0.30–0.37) **Infinite** | 0.39 × (0.36–0.42) **Infinite** | 0.16 × (0.15–0.18) **Infinite** | 2.05 × (1.95–2.38) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 4161 ms (±226) | 3329 ms (±243) | 8570 ms (±409) | 644 ms (±27.4) | 1328 ms (±77.0) | 0.32 × (0.30–0.34) **Infinite** | 0.40 × (0.36–0.43) **Infinite** | 0.15 × (0.15–0.17) **Infinite** | 2.06 × (1.97–2.24) **Element Plus** |
| Descending: click to settled (lower is better) | 4161 ms (±226) | 3329 ms (±243) | 8570 ms (±409) | 644 ms (±27.4) | 1328 ms (±77.0) | 0.32 × (0.30–0.34) **Infinite** | 0.40 × (0.36–0.43) **Infinite** | 0.15 × (0.15–0.17) **Infinite** | 2.06 × (1.97–2.24) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 4176 ms (±311) | 3964 ms (±385) | 8403 ms (±675) | 764 ms (±45.9) | 1364 ms (±71.5) | 0.33 × (0.31–0.37) **Infinite** | 0.34 × (0.32–0.41) **Infinite** | 0.16 × (0.15–0.18) **Infinite** | 1.79 × (1.65–1.94) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 4164 ms (±228) | 3330 ms (±244) | 8618 ms (±410) | 813 ms (±60.5) | 1326 ms (±75.8) | 0.32 × (0.29–0.34) **Infinite** | 0.40 × (0.36–0.43) **Infinite** | 0.15 × (0.15–0.17) **Infinite** | 1.63 × (1.57–1.93) **Element Plus** |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 24.4 ms (±0.58) | 13.3 ms (±0.94) | 229 ms (±4.27) | 31.1 ms (±1.56) | 31.2 ms (±1.04) | 1.28 × (1.21–1.33) **AG Grid** | 2.34 × (2.14–2.57) **TanStack** | 0.14 × (0.13–0.14) **Infinite** | 1.00 × (0.96–1.10) ≈ |
| Jump to rows painted (worst jump) (lower is better) | 53.0 ms (±1.78) | 29.8 ms (±3.34) | 337 ms (±11.0) | 48.3 ms (±2.78) | 47.9 ms (±3.43) | 0.90 × (0.83–0.96) **Infinite** | 1.61 × (1.41–1.74) **TanStack** | 0.14 × (0.13–0.16) **Infinite** | 0.99 × (0.89–1.11) ≈ |
| Jump to settled (median of jumps) (lower is better) | 24.4 ms (±0.58) | 13.3 ms (±0.94) | 229 ms (±4.27) | 31.1 ms (±1.56) | 31.2 ms (±1.04) | 1.28 × (1.21–1.33) **AG Grid** | 2.34 × (2.14–2.57) **TanStack** | 0.14 × (0.13–0.14) **Infinite** | 1.00 × (0.96–1.10) ≈ |
| Main thread, all tasks (all jumps) (lower is better) | 283 ms (±10.8) | 175 ms (±12.0) | 2598 ms (±29.6) | 441 ms (±28.3) | 429 ms (±13.2) | 1.52 × (1.45–1.62) **AG Grid** | 2.45 × (2.23–2.67) **TanStack** | 0.16 × (0.16–0.17) **Infinite** | 0.97 × (0.91–1.09) ≈ |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 54.7 % (±6.48) | 90.1 % (±20.1) | 15.4 % (±0.57) | 49.9 % (±0.11) | 83.3 % (±3.46) | 1.52 × (1.27–1.71) **Infinite** | 0.92 × (0.81–1.35) ≈ | 5.41 × (4.97–5.67) **Infinite** | 1.67 × (1.60–1.74) **Infinite** |
| Frames presented without main-thread update (lower is better) | 44.4 % (±7.04) | 9.41 % (±20.1) | 80.1 % (±0.49) | 49.3 % (±0.11) | 16.7 % (±3.57) | 0.38 × (0.26–0.54) **Infinite** | +7.31 (-21.5 to +19.8) ≈ | 0.21 × (0.16–0.25) **Infinite** | 0.34 × (0.26–0.40) **Infinite** |
| Frames dropped (lower is better) | 0.84 % (±1.18) | 0.34 % (±0.22) | 4.33 % (±0.90) | 0.83 % (±0.22) | 0.00 % (±0.22) | 0.00 × (0.00–0.00) **Infinite** | -0.34 (-0.50 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 59.4 fps (±1.00) | 60.0 fps (±0.00) | 6.80 fps (±0.27) | 59.4 fps (±0.25) | 52.3 fps (±2.50) | 0.88 × (0.87–0.90) **AG Grid** | 0.87 × (0.87–0.89) **TanStack** | 7.69 × (7.26–7.91) **Infinite** | 0.88 × (0.87–0.90) **Element Plus** |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 267 ms (±17.2) | 16.7 ms (±0.05) | 33.3 ms (±6.26) | 1.99 × (1.98–2.00) **AG Grid** | 1.99 × (1.98–2.00) **TanStack** | 0.12 × (0.12–0.13) **Infinite** | 1.99 × (1.98–2.00) **Element Plus** |
| Worst rAF frame interval (lower is better) | 33.4 ms (±23.3) | 16.8 ms (±0.00) | 317 ms (±26.2) | 33.3 ms (±6.26) | 100 ms (±8.93) | 2.99 × (2.00–6.95) **AG Grid** | 5.95 × (5.95–6.95) **TanStack** | 0.32 × (0.32–0.44) **Infinite** | 3.00 × (2.99–3.50) **Element Plus** |
| rAF intervals > 25ms (lower is better) | 0.54 % (±0.70) | 0.00 % (±0.00) | 63.6 % (±2.11) | 1.08 % (±0.43) | 7.45 % (±2.88) | +6.91 (+5.72 to +9.89) **AG Grid** | +7.45 (+7.27 to +10.4) **TanStack** | 0.12 × (0.11–0.17) **Infinite** | +6.37 (+6.19 to +9.89) **Element Plus** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±16.2) | 0.00 ms (±0.00) | 2121 ms (±33.3) | 0.00 ms (±0.00) | 0.00 ms (±2.04) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 359 ms (±19.7) | 78.4 ms (±7.42) | 105 ms (±8.23) | 113 ms (±5.19) | 74.1 ms (±2.80) | 0.21 × (0.19–0.22) **Infinite** | 0.95 × (0.85–0.99) **Infinite** | 0.71 × (0.65–0.77) **Infinite** | 0.65 × (0.62–0.70) **Infinite** |
| Main thread: style recalc (lower is better) | 128 ms (±8.14) | 40.3 ms (±7.89) | 71.6 ms (±4.87) | 108 ms (±8.36) | 204 ms (±12.6) | 1.59 × (1.44–1.73) **AG Grid** | 5.05 × (4.28–5.61) **TanStack** | 2.84 × (2.52–3.01) **PrimeVue** | 1.88 × (1.62–2.04) **Element Plus** |
| Main thread: all tasks (lower is better) | 1589 ms (±90.3) | 860 ms (±73.2) | 3086 ms (±40.8) | 2124 ms (±92.2) | 1781 ms (±91.1) | 1.12 × (1.04–1.17) **AG Grid** | 2.07 × (1.79–2.21) **TanStack** | 0.58 × (0.54–0.60) **Infinite** | 0.84 × (0.76–0.88) **Infinite** |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 100 % (±8.25) | 100 % (±7.45) | 96.7 % (±0.30) | 80.3 % (±0.57) | 89.5 % (±7.23) | 0.90 × (0.86–0.96) **AG Grid** | 0.90 × (0.86–0.96) **TanStack** | 0.93 × (0.88–0.99) **PrimeVue** | 1.12 × (1.07–1.19) **Infinite** |
| Frames presented without main-thread update (lower is better) | 0.00 % (±7.72) | 0.00 % (±7.19) | 3.28 % (±0.30) | 19.0 % (±0.33) | 10.5 % (±6.80) | +10.5 (+4.17 to +13.8) **AG Grid** | +10.5 (+4.17 to +13.8) **TanStack** | 3.20 × (1.27–4.22) **PrimeVue** | 0.55 × (0.22–0.73) **Infinite** |
| Frames dropped (lower is better) | 0.00 % (±0.53) | 0.00 % (±0.27) | 0.00 % (±0.00) | 0.68 % (±0.24) | 0.00 % (±0.47) | 0.00 (0.00 to +0.63) ≈ | 0.00 (0.00 to +0.63) ≈ | 0.00 (0.00 to +0.63) ≈ | 0.00 × (0.00–0.92) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 1.00 × (0.99–1.01) ≈ | 1.00 × (0.99–1.01) ≈ | 1.00 × (0.99–1.01) ≈ | 1.00 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 72.0 ms (±4.74) | 48.4 ms (±5.13) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 23.6 ms (±1.62) | 0.33 × (0.31–0.37) **Infinite** | 0.49 × (0.47–0.59) **Infinite** | +23.6 (+23.2 to +25.3) **PrimeVue** | +23.6 (+23.2 to +25.3) **Element Plus** |
| Main thread: style recalc (lower is better) | 34.0 ms (±1.40) | 14.4 ms (±1.25) | 0.00 ms (±0.00) | 12.2 ms (±0.67) | 28.8 ms (±1.68) | 0.85 × (0.80–0.91) **Infinite** | 2.01 × (1.92–2.35) **TanStack** | +28.8 (+27.6 to +30.6) **PrimeVue** | 2.36 × (2.18–2.53) **Element Plus** |
| Main thread: all tasks (lower is better) | 465 ms (±37.7) | 357 ms (±33.3) | 36.3 ms (±10.6) | 1019 ms (±33.3) | 440 ms (±24.1) | 0.95 × (0.87–1.05) ≈ | 1.23 × (1.14–1.47) **TanStack** | 12.1 × (10.9–17.2) **PrimeVue** | 0.43 × (0.40–0.46) **Infinite** |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 2.90 % (±0.77) | 2.78 % (±0.58) | 0.00 % (±0.00) | 2.08 % (±1.11) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 14.5 % (±3.87) | 13.9 % (±2.91) | 0.00 % (±0.00) | 10.4 % (±5.57) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Worst frame: correct samples (higher is better) | 80.0 % (±0.00) | 80.0 % (±0.00) | 100 % (±0.00) | 80.0 % (±0.00) | 100 % (±0.00) | 1.25 × (1.25–1.25) **Infinite** | 1.25 × (1.25–1.25) **Infinite** | 1.00 × (1.00–1.00) ≈ | 1.25 × (1.25–1.25) **Infinite** |

## correctness-horizontal - 1,000,000 rows

Same kind of horizontal wheel gesture. After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: correct samples (higher is better) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |

## visual-blank-vertical - 1,000,000 rows

Fast vertical wheel gesture (20000px/s) while recording what the compositor actually displays (CDP screencast). Each frame is checked for blank areas: vertical runs of the body with no text where rows should be. Unlike the correctness probe, this also catches the compositor scrolling ahead of the main thread. Screencast capture skips frames under load and adds overhead - compare the grids, not absolute numbers.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Captured frames with blank rows (lower is better) | 17.0 % (±3.33) | 6.56 % (±3.15) | 94.7 % (±0.92) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 10.7 % (±1.72) | 2.18 % (±1.37) | 90.2 % (±0.59) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 18.0 rows (±0.49) | 10.0 rows (±5.30) | 18.0 rows (±0.00) | 0.00 rows (±0.00) | 0.00 rows (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Captured frames (higher is better) | 53.0 (±2.21) | 65.0 (±1.99) | 75.0 (±0.38) | 58.0 (±4.91) | 72.0 (±2.45) | 1.36 × (1.28–1.41) **Infinite** | 1.11 × (1.05–1.14) **Infinite** | 0.96 × (0.91–0.97) **PrimeVue** | 1.24 × (1.15–1.36) **Infinite** |
