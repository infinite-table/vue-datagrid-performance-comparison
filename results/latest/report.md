# AG Grid vs TanStack Table vs PrimeVue DataTable vs Element Plus Table V2 vs Infinite Table — benchmark report

- Run: `ci` · 2026-11-17T09:12:38.475Z
- AG Grid 36.3.0 · TanStack Table 9.3.1 · PrimeVue DataTable 5.0.5 · Element Plus Table V2 2.14.8 · Infinite Table 10.1.5
- 300,000 rows (data checksum `300000:72377c6e`) · 1,000,000 rows (data checksum `1000000:19e5eebe`) × 20 columns, identical data for every grid
- Chrome 136.0.7103.25 · headless · CPU throttling 1× · viewport 1400×1000
- 7 measured runs per grid per scenario (+1 warmup, discarded), interleaved, fresh browser context per run
- Linux 7.0.0-1017-azure x64 · AMD EPYC 9V74 80-Core Processor × 2
- Served from http://localhost:5570/
- Grid body: 759-760 px high, with the same number of rows in view in every grid (to get there, the setup made the boxes taller: AG Grid +3 px, TanStack +2 px)

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
| Time to first rows painted (lower is better) | 1016 ms (±10.1) | 327 ms (±17.8) | 466 ms (±7.58) | 61.3 ms (±1.69) | 271 ms (±6.15) | 0.27 × (0.26–0.27) **Infinite** | 0.83 × (0.74–0.85) **Infinite** | 0.58 × (0.56–0.60) **Infinite** | 4.42 × (4.27–4.56) **Element Plus** |
| Time until settled (lower is better) | 1119 ms (±10.2) | 327 ms (±17.8) | 466 ms (±7.58) | 61.3 ms (±1.69) | 285 ms (±6.14) | 0.25 × (0.25–0.26) **Infinite** | 0.87 × (0.79–0.89) **Infinite** | 0.61 × (0.60–0.63) **Infinite** | 4.65 × (4.55–4.80) **Element Plus** |
| Main thread: layout (lower is better) | 7.22 ms (±0.10) | 3.99 ms (±0.74) | 33.9 ms (±12.6) | 4.83 ms (±0.12) | 3.39 ms (±0.60) | 0.47 × (0.46–0.49) **Infinite** | 0.85 × (0.72–0.89) **Infinite** | 0.10 × (0.09–0.25) **Infinite** | 0.70 × (0.69–0.73) **Infinite** |
| Main thread: style recalc (lower is better) | 12.4 ms (±0.45) | 3.25 ms (±1.14) | 16.1 ms (±6.05) | 3.07 ms (±0.12) | 7.74 ms (±1.22) | 0.62 × (0.57–0.72) **Infinite** | 2.38 × (2.25–3.29) **TanStack** | 0.48 × (0.42–0.82) **Infinite** | 2.52 × (2.34–2.93) **Element Plus** |
| Main thread: all tasks (lower is better) | 1026 ms (±10.0) | 329 ms (±17.8) | 498 ms (±15.3) | 112 ms (±2.08) | 279 ms (±7.54) | 0.27 × (0.27–0.28) **Infinite** | 0.85 × (0.77–0.88) **Infinite** | 0.56 × (0.55–0.61) **Infinite** | 2.49 × (2.42–2.59) **Element Plus** |
| JS heap retained by grid (lower is better) | 204 MB (±0.05) | 87.2 MB (±0.00) | 22.0 MB (±0.01) | 2.77 MB (±0.00) | 36.7 MB (±0.00) | 0.18 × (0.18–0.18) **Infinite** | 0.42 × (0.42–0.42) **Infinite** | 1.67 × (1.67–1.67) **PrimeVue** | 13.2 × (13.2–13.2) **Element Plus** |
| DOM elements in grid (lower is better) | 637 (±0.00) | 352 (±0.00) | 968 (±0.00) | 992 (±0.00) | 606 (±0.00) | 0.95 × (0.95–0.95) **Infinite** | 1.72 × (1.72–1.72) **TanStack** | 0.63 × (0.63–0.63) **Infinite** | 0.61 × (0.61–0.61) **Infinite** |

## sort-string - 300,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 882 ms (±22.3) | 1045 ms (±21.0) | 2821 ms (±68.8) | 267 ms (±9.03) | 538 ms (±16.7) | 0.61 × (0.59–0.64) **Infinite** | 0.51 × (0.50–0.54) **Infinite** | 0.19 × (0.18–0.20) **Infinite** | 2.01 × (1.96–2.12) **Element Plus** |
| Ascending: click to settled (lower is better) | 882 ms (±22.3) | 1045 ms (±21.0) | 2821 ms (±68.8) | 267 ms (±9.03) | 541 ms (±16.7) | 0.61 × (0.59–0.64) **Infinite** | 0.52 × (0.50–0.54) **Infinite** | 0.19 × (0.19–0.20) **Infinite** | 2.03 × (1.98–2.14) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 910 ms (±28.2) | 996 ms (±25.7) | 2894 ms (±49.1) | 252 ms (±7.78) | 568 ms (±13.6) | 0.62 × (0.61–0.66) **Infinite** | 0.57 × (0.55–0.59) **Infinite** | 0.20 × (0.19–0.21) **Infinite** | 2.25 × (2.20–2.34) **Element Plus** |
| Descending: click to settled (lower is better) | 910 ms (±28.2) | 996 ms (±25.7) | 2894 ms (±49.1) | 252 ms (±7.78) | 568 ms (±13.6) | 0.62 × (0.61–0.66) **Infinite** | 0.57 × (0.55–0.59) **Infinite** | 0.20 × (0.19–0.21) **Infinite** | 2.25 × (2.20–2.34) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 891 ms (±21.6) | 1049 ms (±21.0) | 2861 ms (±43.2) | 365 ms (±11.0) | 542 ms (±17.2) | 0.61 × (0.58–0.63) **Infinite** | 0.52 × (0.50–0.54) **Infinite** | 0.19 × (0.18–0.20) **Infinite** | 1.48 × (1.43–1.54) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 917 ms (±28.2) | 997 ms (±26.3) | 2927 ms (±25.5) | 343 ms (±15.7) | 563 ms (±15.0) | 0.61 × (0.59–0.65) **Infinite** | 0.56 × (0.54–0.59) **Infinite** | 0.19 × (0.19–0.20) **Infinite** | 1.64 × (1.60–1.72) **Element Plus** |

## sort-number - 300,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 920 ms (±29.5) | 813 ms (±26.8) | 2442 ms (±38.3) | 183 ms (±1.80) | 458 ms (±10.2) | 0.50 × (0.48–0.53) **Infinite** | 0.56 × (0.54–0.59) **Infinite** | 0.19 × (0.18–0.20) **Infinite** | 2.50 × (2.46–2.60) **Element Plus** |
| Ascending: click to settled (lower is better) | 920 ms (±29.5) | 813 ms (±26.8) | 2442 ms (±38.3) | 183 ms (±1.80) | 461 ms (±10.5) | 0.50 × (0.48–0.53) **Infinite** | 0.57 × (0.55–0.60) **Infinite** | 0.19 × (0.19–0.20) **Infinite** | 2.51 × (2.48–2.62) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 889 ms (±40.4) | 734 ms (±34.8) | 2383 ms (±70.1) | 195 ms (±7.51) | 463 ms (±12.8) | 0.52 × (0.51–0.53) **Infinite** | 0.63 × (0.58–0.64) **Infinite** | 0.19 × (0.18–0.20) **Infinite** | 2.38 × (2.33–2.47) **Element Plus** |
| Descending: click to settled (lower is better) | 889 ms (±40.4) | 734 ms (±34.8) | 2383 ms (±70.1) | 195 ms (±7.51) | 463 ms (±12.8) | 0.52 × (0.51–0.53) **Infinite** | 0.63 × (0.58–0.64) **Infinite** | 0.19 × (0.18–0.20) **Infinite** | 2.38 × (2.33–2.47) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 925 ms (±29.6) | 1102 ms (±52.9) | 2483 ms (±46.6) | 283 ms (±3.51) | 461 ms (±10.4) | 0.50 × (0.48–0.53) **Infinite** | 0.42 × (0.40–0.45) **Infinite** | 0.19 × (0.18–0.20) **Infinite** | 1.63 × (1.60–1.69) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 896 ms (±40.5) | 735 ms (±35.6) | 2497 ms (±12.3) | 283 ms (±16.3) | 458 ms (±12.6) | 0.51 × (0.50–0.52) **Infinite** | 0.62 × (0.58–0.63) **Infinite** | 0.18 × (0.18–0.19) **Infinite** | 1.62 × (1.55–1.65) **Element Plus** |

## scroll-jump - 300,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 27.7 ms (±0.31) | 15.0 ms (±1.00) | 320 ms (±5.27) | 45.4 ms (±0.81) | 55.0 ms (±1.89) | 1.99 × (1.95–2.01) **AG Grid** | 3.66 × (3.29–3.69) **TanStack** | 0.17 × (0.17–0.17) **Infinite** | 1.21 × (1.19–1.22) **Element Plus** |
| Jump to rows painted (worst jump) (lower is better) | 59.1 ms (±3.26) | 51.0 ms (±8.34) | 482 ms (±4.04) | 70.8 ms (±1.07) | 71.7 ms (±1.37) | 1.21 × (1.10–1.24) **AG Grid** | 1.41 × (1.34–1.81) **TanStack** | 0.15 × (0.14–0.15) **Infinite** | 1.01 × (0.98–1.04) ≈ |
| Jump to settled (median of jumps) (lower is better) | 27.7 ms (±0.31) | 15.0 ms (±1.00) | 320 ms (±5.27) | 45.4 ms (±0.81) | 55.0 ms (±1.89) | 1.99 × (1.95–2.01) **AG Grid** | 3.66 × (3.29–3.69) **TanStack** | 0.17 × (0.17–0.17) **Infinite** | 1.21 × (1.19–1.22) **Element Plus** |
| Main thread, all tasks (all jumps) (lower is better) | 513 ms (±9.77) | 333 ms (±5.02) | 3592 ms (±25.6) | 540 ms (±8.09) | 651 ms (±10.7) | 1.27 × (1.26–1.31) **AG Grid** | 1.96 × (1.94–2.02) **TanStack** | 0.18 × (0.18–0.19) **Infinite** | 1.21 × (1.19–1.23) **Element Plus** |

## scroll-vertical - 300,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 49.4 % (±2.27) | 50.3 % (±0.27) | 11.8 % (±0.41) | 48.0 % (±0.25) | 65.7 % (±4.22) | 1.33 × (1.18–1.39) **Infinite** | 1.31 × (1.17–1.37) **Infinite** | 5.57 × (4.96–6.05) **Infinite** | 1.37 × (1.23–1.44) **Infinite** |
| Frames presented without main-thread update (lower is better) | 48.2 % (±2.28) | 49.5 % (±0.27) | 80.0 % (±0.40) | 47.4 % (±0.25) | 32.8 % (±4.62) | 0.68 × (0.63–0.86) **Infinite** | 0.66 × (0.62–0.83) **Infinite** | 0.41 × (0.38–0.51) **Infinite** | 0.69 × (0.64–0.87) **Infinite** |
| Frames dropped (lower is better) | 2.21 % (±0.31) | 0.27 % (±0.54) | 8.10 % (±0.66) | 4.57 % (±0.50) | 0.71 % (±0.55) | 0.32 × (0.00–0.37) **Infinite** | 2.59 × (0.00–2.64) ≈ | 0.09 × (0.00–0.09) **Infinite** | 0.16 × (0.00–0.18) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 58.1 fps (±0.36) | 60.0 fps (±0.63) | 5.35 fps (±0.16) | 55.2 fps (±0.53) | 30.6 fps (±2.65) | 0.53 × (0.46–0.56) **AG Grid** | 0.51 × (0.44–0.54) **TanStack** | 5.73 × (4.95–6.06) **Infinite** | 0.56 × (0.48–0.59) **Element Plus** |
| p95 rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.7 ms (±0.05) | 386 ms (±6.42) | 33.3 ms (±0.04) | 66.6 ms (±6.26) | 3.97 × (3.96–3.97) **AG Grid** | 3.99 × (3.97–3.99) **TanStack** | 0.17 × (0.17–0.18) **Infinite** | 2.00 × (2.00–2.00) **Element Plus** |
| Worst rAF frame interval (lower is better) | 33.4 ms (±8.10) | 16.8 ms (±20.8) | 417 ms (±12.6) | 66.6 ms (±8.88) | 133 ms (±15.8) | 3.99 × (2.67–4.49) **AG Grid** | 7.94 × (2.67–8.93) **TanStack** | 0.32 × (0.32–0.38) **Infinite** | 2.00 × (2.00–2.99) **Element Plus** |
| rAF intervals > 25ms (lower is better) | 3.33 % (±0.57) | 0.00 % (±0.69) | 55.6 % (±1.43) | 6.40 % (±0.94) | 67.4 % (±13.9) | 20.2 × (15.6–27.1) **AG Grid** | +67.4 (+61.0 to +90.2) **TanStack** | 1.21 × (1.10–1.62) **PrimeVue** | 10.5 × (8.85–15.6) **Element Plus** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 2383 ms (±100) | 0.00 ms (±6.22) | 36.3 ms (±6.68) | +36.3 (+33.6 to +38.4) **AG Grid** | +36.3 (+33.6 to +38.4) **TanStack** | 0.02 × (0.01–0.02) **Infinite** | +36.3 (+22.1 to +38.4) **Element Plus** |
| Main thread: layout (lower is better) | 277 ms (±12.3) | 95.9 ms (±3.48) | 93.5 ms (±5.70) | 124 ms (±4.67) | 81.3 ms (±3.25) | 0.29 × (0.29–0.31) **Infinite** | 0.85 × (0.81–0.91) **Infinite** | 0.87 × (0.85–0.98) **Infinite** | 0.66 × (0.63–0.69) **Infinite** |
| Main thread: style recalc (lower is better) | 151 ms (±3.79) | 51.5 ms (±5.46) | 80.9 ms (±6.39) | 123 ms (±2.06) | 162 ms (±7.81) | 1.07 × (1.02–1.13) **AG Grid** | 3.15 × (2.84–3.56) **TanStack** | 2.01 × (1.89–2.13) **PrimeVue** | 1.32 × (1.29–1.42) **Element Plus** |
| Main thread: all tasks (lower is better) | 1388 ms (±17.6) | 1083 ms (±23.8) | 3213 ms (±49.6) | 2730 ms (±33.6) | 1991 ms (±23.3) | 1.43 × (1.39–1.46) **AG Grid** | 1.84 × (1.78–1.87) **TanStack** | 0.62 × (0.60–0.63) **Infinite** | 0.73 × (0.72–0.74) **Infinite** |

## scroll-horizontal - 300,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 76.0 % (±7.20) | 71.8 % (±3.97) | 96.7 % (±0.60) | 66.3 % (±1.45) | 85.6 % (±0.49) | 1.13 × (1.00–1.13) **Infinite** | 1.19 × (1.18–1.33) **Infinite** | 0.88 × (0.88–0.89) **PrimeVue** | 1.29 × (1.28–1.33) **Infinite** |
| Frames presented without main-thread update (lower is better) | 21.5 % (±7.71) | 25.6 % (±3.29) | 3.25 % (±0.60) | 29.9 % (±0.96) | 14.4 % (±0.49) | 0.67 × (0.64–1.25) ≈ | 0.56 × (0.45–0.58) **Infinite** | 4.44 × (4.35–4.58) **PrimeVue** | 0.48 × (0.47–0.49) **Infinite** |
| Frames dropped (lower is better) | 2.08 % (±0.58) | 2.56 % (±0.85) | 0.00 % (±0.00) | 4.07 % (±0.64) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 59.5 fps (±0.38) | 59.0 fps (±0.44) | 60.0 fps (±0.00) | 57.7 fps (±0.37) | 57.1 fps (±0.19) | 0.96 × (0.96–0.97) **AG Grid** | 0.97 × (0.96–0.97) **TanStack** | 0.95 × (0.95–0.95) **PrimeVue** | 0.99 × (0.98–1.00) **Element Plus** |
| p95 rAF frame interval (lower is better) | 16.8 ms (±0.05) | 16.8 ms (±0.05) | 16.8 ms (±0.05) | 16.8 ms (±0.00) | 16.8 ms (±0.04) | 1.00 × (1.00–1.01) ≈ | 1.00 × (1.00–1.01) ≈ | 1.00 × (1.00–1.01) **PrimeVue** | 1.00 × (1.00–1.00) ≈ |
| Worst rAF frame interval (lower is better) | 33.4 ms (±0.05) | 33.4 ms (±8.11) | 16.8 ms (±0.00) | 50.0 ms (±8.89) | 83.3 ms (±8.16) | 2.49 × (1.99–2.50) **AG Grid** | 2.49 × (1.67–2.50) **TanStack** | 4.96 × (3.96–4.96) **PrimeVue** | 1.67 × (1.33–2.49) **Element Plus** |
| rAF intervals > 25ms (lower is better) | 0.82 % (±0.66) | 0.83 % (±0.66) | 0.00 % (±0.00) | 4.07 % (±0.65) | 2.59 % (±0.02) | 3.16 × (1.56–3.21) **AG Grid** | 3.13 × (1.56–3.21) **TanStack** | +2.59 (+2.56 to +2.61) **PrimeVue** | 0.64 × (0.63–0.81) **Infinite** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 83.6 ms (±3.76) | 57.3 ms (±1.83) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 23.3 ms (±0.44) | 0.28 × (0.27–0.29) **Infinite** | 0.41 × (0.39–0.42) **Infinite** | +23.3 (+23.1 to +23.6) **PrimeVue** | +23.3 (+23.1 to +23.6) **Element Plus** |
| Main thread: style recalc (lower is better) | 42.1 ms (±3.37) | 16.5 ms (±2.73) | 0.00 ms (±0.00) | 8.34 ms (±0.94) | 30.4 ms (±0.80) | 0.72 × (0.66–0.78) **Infinite** | 1.84 × (1.62–2.12) **TanStack** | +30.4 (+30.0 to +31.7) **PrimeVue** | 3.64 × (3.07–3.92) **Element Plus** |
| Main thread: all tasks (lower is better) | 700 ms (±31.3) | 565 ms (±8.55) | 33.6 ms (±1.60) | 1286 ms (±21.6) | 526 ms (±6.78) | 0.75 × (0.72–0.78) **Infinite** | 0.93 × (0.91–0.94) **Infinite** | 15.6 × (15.0–16.5) **PrimeVue** | 0.41 × (0.41–0.41) **Infinite** |

## correctness-vertical - 300,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 2.15 % (±1.94) | 2.19 % (±0.86) | 0.00 % (±0.00) | 1.82 % (±0.58) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 10.8 % (±9.72) | 11.0 % (±4.28) | 0.00 % (±0.00) | 9.09 % (±2.92) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
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
| Captured frames with blank rows (lower is better) | 39.4 % (±8.43) | 29.3 % (±4.05) | 95.1 % (±0.71) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 17.6 % (±1.85) | 14.0 % (±2.20) | 89.7 % (±0.77) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 18.0 rows (±0.00) | 18.0 rows (±0.00) | 18.0 rows (±0.00) | 0.00 rows (±0.00) | 0.00 rows (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Captured frames (higher is better) | 34.0 (±0.38) | 44.0 (±1.38) | 61.0 (±2.48) | 30.0 (±0.82) | 50.0 (±2.31) | 1.47 × (1.47–1.50) **Infinite** | 1.14 × (1.14–1.21) **Infinite** | 0.82 × (0.81–0.89) **PrimeVue** | 1.67 × (1.61–1.76) **Infinite** |

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
| Time to first rows painted (lower is better) | 3147 ms (±18.0) | 936 ms (±27.9) | 610 ms (±55.5) | 74.0 ms (±6.05) | 614 ms (±36.7) | 0.20 × (0.19–0.20) **Infinite** | 0.66 × (0.65–0.68) **Infinite** | 1.01 × (0.96–1.20) ≈ | 8.29 × (7.61–9.09) **Element Plus** |
| Time until settled (lower is better) | 3251 ms (±17.9) | 936 ms (±27.9) | 610 ms (±55.5) | 74.0 ms (±6.05) | 628 ms (±36.8) | 0.19 × (0.19–0.20) **Infinite** | 0.67 × (0.67–0.70) **Infinite** | 1.03 × (0.98–1.23) ≈ | 8.49 × (7.81–9.31) **Element Plus** |
| Main thread: layout (lower is better) | 7.18 ms (±0.16) | 4.13 ms (±0.24) | 12.5 ms (±27.7) | 4.86 ms (±0.12) | 3.45 ms (±0.08) | 0.48 × (0.46–0.49) **Infinite** | 0.83 × (0.77–0.88) **Infinite** | 0.28 × (0.09–0.30) **Infinite** | 0.71 × (0.67–0.72) **Infinite** |
| Main thread: style recalc (lower is better) | 12.3 ms (±0.09) | 2.36 ms (±0.18) | 10.3 ms (±17.9) | 3.06 ms (±0.05) | 13.3 ms (±3.76) | 1.08 × (0.60–1.24) ≈ | 5.65 × (2.96–6.79) **TanStack** | 1.29 × (0.17–1.47) ≈ | 4.35 × (2.39–4.99) **Element Plus** |
| Main thread: all tasks (lower is better) | 3156 ms (±25.2) | 944 ms (±23.0) | 649 ms (±35.9) | 78.8 ms (±6.29) | 629 ms (±37.4) | 0.20 × (0.20–0.21) **Infinite** | 0.67 × (0.65–0.69) **Infinite** | 0.97 × (0.89–1.02) ≈ | 7.98 × (7.33–8.80) **Element Plus** |
| JS heap retained by grid (lower is better) | 670 MB (±0.00) | 287 MB (±0.00) | 22.0 MB (±0.01) | 2.77 MB (±0.00) | 90.7 MB (±0.00) | 0.14 × (0.14–0.14) **Infinite** | 0.32 × (0.32–0.32) **Infinite** | 4.12 × (4.12–4.12) **PrimeVue** | 32.8 × (32.8–32.8) **Element Plus** |
| DOM elements in grid (lower is better) | 637 (±0.00) | 352 (±0.00) | 968 (±0.00) | 992 (±0.00) | 606 (±0.00) | 0.95 × (0.95–0.95) **Infinite** | 1.72 × (1.72–1.72) **TanStack** | 0.63 × (0.63–0.63) **Infinite** | 0.61 × (0.61–0.61) **Infinite** |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 3950 ms (±48.1) | 4292 ms (±81.0) | 10592 ms (±279) | 1003 ms (±15.9) | 1894 ms (±19.7) | 0.48 × (0.47–0.48) **Infinite** | 0.44 × (0.43–0.44) **Infinite** | 0.18 × (0.18–0.19) **Infinite** | 1.89 × (1.88–1.90) **Element Plus** |
| Ascending: click to settled (lower is better) | 3950 ms (±48.1) | 4292 ms (±81.0) | 10592 ms (±279) | 1003 ms (±15.9) | 1898 ms (±19.6) | 0.48 × (0.47–0.48) **Infinite** | 0.44 × (0.43–0.44) **Infinite** | 0.18 × (0.18–0.19) **Infinite** | 1.89 × (1.88–1.90) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 3982 ms (±48.7) | 4166 ms (±53.2) | 10558 ms (±135) | 1021 ms (±11.1) | 2207 ms (±125) | 0.55 × (0.54–0.57) **Infinite** | 0.53 × (0.51–0.55) **Infinite** | 0.21 × (0.20–0.22) **Infinite** | 2.16 × (2.10–2.24) **Element Plus** |
| Descending: click to settled (lower is better) | 3982 ms (±48.7) | 4166 ms (±53.2) | 10558 ms (±135) | 1021 ms (±11.1) | 2207 ms (±125) | 0.55 × (0.54–0.57) **Infinite** | 0.53 × (0.51–0.55) **Infinite** | 0.21 × (0.20–0.22) **Infinite** | 2.16 × (2.10–2.24) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 3956 ms (±47.6) | 4294 ms (±80.8) | 10593 ms (±159) | 1349 ms (±16.4) | 1896 ms (±19.6) | 0.48 × (0.47–0.48) **Infinite** | 0.44 × (0.43–0.44) **Infinite** | 0.18 × (0.18–0.18) **Infinite** | 1.41 × (1.39–1.41) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 3985 ms (±48.2) | 4167 ms (±53.2) | 10916 ms (±160) | 1362 ms (±16.2) | 2203 ms (±126) | 0.55 × (0.54–0.57) **Infinite** | 0.53 × (0.51–0.55) **Infinite** | 0.20 × (0.20–0.21) **Infinite** | 1.62 × (1.56–1.68) **Element Plus** |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 3866 ms (±141) | 3487 ms (±49.6) | 8536 ms (±223) | 649 ms (±8.52) | 1427 ms (±28.7) | 0.37 × (0.35–0.37) **Infinite** | 0.41 × (0.40–0.41) **Infinite** | 0.17 × (0.16–0.17) **Infinite** | 2.20 × (2.15–2.26) **Element Plus** |
| Ascending: click to settled (lower is better) | 3866 ms (±141) | 3487 ms (±49.6) | 8536 ms (±223) | 649 ms (±8.52) | 1431 ms (±28.6) | 0.37 × (0.35–0.37) **Infinite** | 0.41 × (0.40–0.41) **Infinite** | 0.17 × (0.16–0.17) **Infinite** | 2.20 × (2.16–2.27) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 3933 ms (±35.8) | 3307 ms (±68.5) | 8901 ms (±121) | 737 ms (±18.8) | 1590 ms (±115) | 0.40 × (0.40–0.42) **Infinite** | 0.48 × (0.47–0.50) **Infinite** | 0.18 × (0.17–0.19) **Infinite** | 2.16 × (2.10–2.25) **Element Plus** |
| Descending: click to settled (lower is better) | 3933 ms (±35.8) | 3307 ms (±68.5) | 8901 ms (±121) | 737 ms (±18.8) | 1590 ms (±115) | 0.40 × (0.40–0.42) **Infinite** | 0.48 × (0.47–0.50) **Infinite** | 0.18 × (0.17–0.19) **Infinite** | 2.16 × (2.10–2.25) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 3871 ms (±140) | 4203 ms (±397) | 8878 ms (±145) | 995 ms (±72.0) | 1428 ms (±28.2) | 0.37 × (0.35–0.37) **Infinite** | 0.34 × (0.33–0.41) **Infinite** | 0.16 × (0.16–0.16) **Infinite** | 1.43 × (1.41–1.47) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 3936 ms (±35.8) | 3308 ms (±68.6) | 9262 ms (±112) | 1085 ms (±21.4) | 1585 ms (±115) | 0.40 × (0.39–0.42) **Infinite** | 0.48 × (0.47–0.50) **Infinite** | 0.17 × (0.17–0.18) **Infinite** | 1.46 × (1.41–1.51) **Element Plus** |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 32.1 ms (±1.22) | 16.4 ms (±0.31) | 328 ms (±3.27) | 44.2 ms (±0.68) | 53.1 ms (±3.78) | 1.65 × (1.58–1.75) **AG Grid** | 3.23 × (3.11–3.39) **TanStack** | 0.16 × (0.16–0.17) **Infinite** | 1.20 × (1.17–1.26) **Element Plus** |
| Jump to rows painted (worst jump) (lower is better) | 112 ms (±19.5) | 67.0 ms (±6.81) | 645 ms (±23.2) | 89.8 ms (±3.47) | 94.0 ms (±6.61) | 0.84 × (0.69–0.97) **Infinite** | 1.40 × (1.31–1.57) **TanStack** | 0.15 × (0.14–0.16) **Infinite** | 1.05 × (0.99–1.15) ≈ |
| Jump to settled (median of jumps) (lower is better) | 32.1 ms (±1.22) | 16.4 ms (±0.31) | 328 ms (±3.27) | 44.2 ms (±0.68) | 53.1 ms (±3.78) | 1.65 × (1.58–1.75) **AG Grid** | 3.23 × (3.11–3.39) **TanStack** | 0.16 × (0.16–0.17) **Infinite** | 1.20 × (1.17–1.26) **Element Plus** |
| Main thread, all tasks (all jumps) (lower is better) | 423 ms (±18.0) | 243 ms (±4.27) | 3611 ms (±26.7) | 639 ms (±11.4) | 804 ms (±45.1) | 1.90 × (1.81–2.09) **AG Grid** | 3.31 × (3.23–3.62) **TanStack** | 0.22 × (0.22–0.24) **Infinite** | 1.26 × (1.24–1.38) **Element Plus** |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 44.8 % (±0.27) | 47.1 % (±0.17) | 11.8 % (±0.53) | 47.6 % (±0.25) | 40.2 % (±3.29) | 0.90 × (0.85–1.01) ≈ | 0.85 × (0.82–0.97) **TanStack** | 3.39 × (3.26–3.85) **Infinite** | 0.84 × (0.81–0.95) **Element Plus** |
| Frames presented without main-thread update (lower is better) | 44.0 % (±0.26) | 46.2 % (±0.17) | 80.1 % (±1.84) | 47.0 % (±0.25) | 59.0 % (±2.84) | 1.34 × (1.24–1.39) **AG Grid** | 1.28 × (1.18–1.32) **TanStack** | 0.74 × (0.68–0.76) **Infinite** | 1.25 × (1.16–1.29) **Element Plus** |
| Frames dropped (lower is better) | 11.1 % (±0.52) | 6.73 % (±0.33) | 8.06 % (±2.31) | 5.48 % (±0.50) | 0.00 % (±0.86) | 0.00 × (0.00–0.16) **Infinite** | 0.00 × (0.00–0.26) **Infinite** | 0.00 × (0.00–0.22) **Infinite** | 0.00 × (0.00–0.34) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 48.7 fps (±0.49) | 52.9 fps (±0.34) | 5.32 fps (±0.25) | 54.2 fps (±0.52) | 16.1 fps (±1.39) | 0.33 × (0.32–0.38) **AG Grid** | 0.30 × (0.30–0.35) **TanStack** | 3.03 × (2.81–3.52) **Infinite** | 0.30 × (0.29–0.34) **Element Plus** |
| p95 rAF frame interval (lower is better) | 33.3 ms (±12.0) | 16.8 ms (±0.00) | 372 ms (±41.2) | 33.3 ms (±3.14) | 100 ms (±19.4) | 3.00 × (2.24–4.88) **AG Grid** | 5.95 × (5.56–7.54) **TanStack** | 0.27 × (0.24–0.34) **Infinite** | 3.00 × (2.81–3.81) **Element Plus** |
| Worst rAF frame interval (lower is better) | 133 ms (±17.8) | 183 ms (±18.6) | 533 ms (±31.5) | 83.3 ms (±8.11) | 300 ms (±13.6) | 2.25 × (2.00–2.57) **AG Grid** | 1.64 × (1.50–1.90) **TanStack** | 0.56 × (0.53–0.63) **Infinite** | 3.60 × (3.40–4.50) **Element Plus** |
| rAF intervals > 25ms (lower is better) | 5.96 % (±0.74) | 3.05 % (±0.49) | 52.6 % (±2.13) | 5.92 % (±1.09) | 88.0 % (±0.95) | 14.8 × (13.4–17.0) **AG Grid** | 28.9 × (28.6–36.5) **TanStack** | 1.67 × (1.58–1.70) **PrimeVue** | 14.9 × (12.3–15.2) **Element Plus** |
| Long animation frames: total blocking (lower is better) | 233 ms (±29.5) | 203 ms (±6.75) | 2437 ms (±99.6) | 35.7 ms (±11.3) | 225 ms (±89.1) | 0.97 × (0.78–1.66) ≈ | 1.11 × (1.05–1.90) **TanStack** | 0.09 × (0.09–0.16) **Infinite** | 6.33 × (5.58–14.2) **Element Plus** |
| Main thread: layout (lower is better) | 472 ms (±15.7) | 128 ms (±18.3) | 119 ms (±23.7) | 134 ms (±5.66) | 80.8 ms (±3.60) | 0.17 × (0.17–0.18) **Infinite** | 0.63 × (0.57–0.71) **Infinite** | 0.68 × (0.54–0.76) **Infinite** | 0.60 × (0.58–0.66) **Infinite** |
| Main thread: style recalc (lower is better) | 130 ms (±10.00) | 75.4 ms (±9.49) | 94.4 ms (±5.19) | 128 ms (±4.40) | 198 ms (±15.3) | 1.52 × (1.37–1.76) **AG Grid** | 2.63 × (2.27–3.05) **TanStack** | 2.10 × (1.95–2.50) **PrimeVue** | 1.55 × (1.44–1.73) **Element Plus** |
| Main thread: all tasks (lower is better) | 1941 ms (±29.7) | 1310 ms (±22.1) | 3464 ms (±133) | 2733 ms (±9.45) | 2406 ms (±70.2) | 1.24 × (1.19–1.28) **AG Grid** | 1.84 × (1.78–1.89) **TanStack** | 0.69 × (0.67–0.75) **Infinite** | 0.88 × (0.86–0.90) **Infinite** |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 80.3 % (±7.19) | 74.7 % (±4.70) | 96.8 % (±0.41) | 66.3 % (±1.83) | 86.5 % (±3.87) | 1.08 × (1.02–1.26) **Infinite** | 1.16 × (1.05–1.27) **Infinite** | 0.89 × (0.86–0.93) **PrimeVue** | 1.31 × (1.27–1.36) **Infinite** |
| Frames presented without main-thread update (lower is better) | 19.0 % (±6.94) | 24.0 % (±4.54) | 3.20 % (±0.41) | 27.2 % (±1.93) | 12.5 % (±3.95) | 0.66 × (0.35–0.95) **Infinite** | 0.52 × (0.31–0.79) **Infinite** | 3.91 × (2.70–6.02) **PrimeVue** | 0.46 × (0.32–0.56) **Infinite** |
| Frames dropped (lower is better) | 1.25 % (±0.45) | 1.23 % (±0.28) | 0.00 % (±0.00) | 6.51 % (±0.81) | 0.96 % (±0.38) | 0.77 × (0.60–1.32) ≈ | 0.78 × (0.70–1.35) ≈ | +0.96 (+0.90 to +0.97) **PrimeVue** | 0.15 × (0.13–0.16) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 56.3 fps (±0.50) | 57.1 fps (±1.29) | 0.95 × (0.94–0.96) **AG Grid** | 0.95 × (0.94–0.96) **TanStack** | 0.95 × (0.94–0.96) **PrimeVue** | 1.01 × (1.01–1.04) **Infinite** |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 16.7 ms (±0.04) | 33.3 ms (±0.31) | 16.8 ms (±6.24) | 1.01 × (1.00–1.01) **AG Grid** | 1.01 × (1.00–1.01) **TanStack** | 1.01 × (1.01–1.01) **PrimeVue** | 0.50 × (0.50–0.51) **Infinite** |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 33.4 ms (±8.89) | 50.0 ms (±9.64) | 2.98 × (2.97–2.98) **AG Grid** | 2.98 × (2.97–2.98) **TanStack** | 2.98 × (2.97–2.98) **PrimeVue** | 1.50 × (1.00–1.50) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 6.56 % (±0.97) | 4.24 % (±1.35) | +4.24 (+3.36 to +4.27) **AG Grid** | +4.24 (+3.36 to +4.27) **TanStack** | +4.24 (+3.36 to +4.27) **PrimeVue** | 0.65 × (0.45–0.73) **Infinite** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 73.5 ms (±6.87) | 50.3 ms (±0.94) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 29.7 ms (±2.89) | 0.40 × (0.38–0.45) **Infinite** | 0.59 × (0.56–0.64) **Infinite** | +29.7 (+28.3 to +31.9) **PrimeVue** | +29.7 (+28.3 to +31.9) **Element Plus** |
| Main thread: style recalc (lower is better) | 38.8 ms (±2.05) | 14.5 ms (±1.26) | 0.00 ms (±0.00) | 8.49 ms (±0.99) | 35.0 ms (±3.56) | 0.90 × (0.78–1.03) ≈ | 2.41 × (2.15–2.74) **TanStack** | +35.0 (+31.5 to +39.6) **PrimeVue** | 4.12 × (3.21–4.79) **Element Plus** |
| Main thread: all tasks (lower is better) | 496 ms (±26.7) | 437 ms (±5.63) | 32.6 ms (±2.60) | 1358 ms (±23.0) | 674 ms (±10.4) | 1.36 × (1.26–1.40) **AG Grid** | 1.54 × (1.50–1.57) **TanStack** | 20.7 × (18.3–21.8) **PrimeVue** | 0.50 × (0.49–0.51) **Infinite** |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 8.24 % (±3.43) | 1.82 % (±0.49) | 0.00 % (±0.00) | 1.22 % (±0.61) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 17.6 % (±5.29) | 9.09 % (±2.43) | 0.00 % (±0.00) | 6.12 % (±3.05) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Worst frame: correct samples (higher is better) | 0.00 % (±30.2) | 80.0 % (±0.00) | 100 % (±0.00) | 80.0 % (±0.00) | 100 % (±0.00) | +100 (+100 to +100) **Infinite** | 1.25 × (1.25–1.25) **Infinite** | 1.00 × (1.00–1.00) ≈ | 1.25 × (1.25–1.25) **Infinite** |

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
| Captured frames with blank rows (lower is better) | 83.3 % (±5.90) | 27.3 % (±6.89) | 94.7 % (±0.46) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 35.4 % (±2.63) | 14.2 % (±2.55) | 89.3 % (±0.49) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 18.0 rows (±0.00) | 18.0 rows (±0.00) | 18.0 rows (±0.00) | 0.00 rows (±0.00) | 0.00 rows (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Captured frames (higher is better) | 30.0 (±1.13) | 33.0 (±0.49) | 58.0 (±2.93) | 27.0 (±1.27) | 43.0 (±1.63) | 1.43 × (1.40–1.54) **Infinite** | 1.30 × (1.24–1.33) **Infinite** | 0.74 × (0.70–0.78) **PrimeVue** | 1.59 × (1.50–1.72) **Infinite** |
