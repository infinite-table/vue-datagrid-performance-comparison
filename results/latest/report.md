# TanStack Table vs AG Grid vs PrimeVue DataTable vs Element Plus Table V2 vs Infinite Table — benchmark report

- Run: `ci` · 2026-11-25T11:09:26.142Z
- TanStack Table 9.3.1 · AG Grid 36.3.0 · PrimeVue DataTable 4.5.5 · Element Plus Table V2 2.14.8 · Infinite Table 10.2.1
- 300,000 rows (data checksum `300000:72377c6e`) · 1,000,000 rows (data checksum `1000000:19e5eebe`) × 20 columns, identical data for every grid
- Chrome 136.0.7103.25 · headless · CPU throttling 1× · viewport 1400×1000
- 7 measured runs per grid per scenario (+1 warmup, discarded), interleaved, fresh browser context per run
- Linux 7.0.0-1014-aws x64 · Intel(R) Xeon(R) 6975P-C × 4
- Served from http://localhost:5570/
- Grid body: 759-760 px high, with the same number of rows in view in every grid (to get there, the setup made the boxes taller: TanStack +2 px, AG Grid +3 px, Infinite +24 px)

The "Infinite vs ..." columns compare Infinite Table with one other grid: the ratio of the medians (Infinite / other, so < 1 means Infinite has the lower value), its 95% bootstrap confidence interval, and the grid that does better. A grid is only named when the interval excludes 1; "≈" means no significant difference. When the other grid has zeros among its values (e.g. 0% blank samples) a ratio means nothing, so the difference of the medians (Infinite − other) and its interval are shown instead, and a grid is only named when that interval excludes 0.

# 300,000 rows

Scroll range - browsers cap element sizes (Chrome ~16.7M-33.5M px, depending on the version), so a grid has to map the scrollbar onto the rows when the content is taller than that. One that doesn't can't reach its last rows: its scrolling results are for the rows it can reach, and the same wheel gesture goes over fewer rows in it.

| | TanStack | AG Grid | PrimeVue | Element Plus | Infinite |
|---|---:|---:|---:|---:|---:|
| Last row reachable with the scrollbar | yes (300,000) | yes (300,000) | yes (300,000) | yes (300,000) | yes (300,000) |
| Native scroll range | 11,999,240 px | 11,999,241 px | 11,999,240 px | 11,999,240 px | 11,999,240 px |
| Content px per scrollbar px | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 |

## mount - 300,000 rows

Mount the grid with all the rows (data already in memory). "Visible" = from setState to the end of the first frame committed with the whole viewport (first/last visible row and column) showing the right content. "Settled" = until the first frame committed after the grid's last DOM mutation. Memory is the JS heap retained by the grid after GC (heap after mount - heap before mount).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Time to first rows painted (lower is better) | 215 ms (±0.56) | 747 ms (±4.99) | 481 ms (±17.0) | 43.3 ms (±1.72) | 229 ms (±5.53) | 1.06 × (1.02–1.07) **TanStack** | 0.31 × (0.29–0.31) **Infinite** | 0.48 × (0.44–0.48) **Infinite** | 5.28 × (4.91–5.37) **Element Plus** |
| Time until settled (lower is better) | 215 ms (±0.56) | 850 ms (±5.17) | 481 ms (±17.0) | 43.3 ms (±1.72) | 238 ms (±5.49) | 1.11 × (1.07–1.12) **TanStack** | 0.28 × (0.27–0.28) **Infinite** | 0.50 × (0.46–0.51) **Infinite** | 5.50 × (5.13–5.60) **Element Plus** |
| Main thread: layout (lower is better) | 7.51 ms (±1.05) | 7.45 ms (±0.60) | 9.04 ms (±2.19) | 4.65 ms (±0.28) | 3.30 ms (±0.08) | 0.44 × (0.41–0.57) **Infinite** | 0.44 × (0.41–0.48) **Infinite** | 0.37 × (0.24–0.38) **Infinite** | 0.71 × (0.69–0.76) **Infinite** |
| Main thread: style recalc (lower is better) | 2.41 ms (±0.47) | 10.6 ms (±0.09) | 7.07 ms (±1.51) | 2.47 ms (±0.03) | 5.92 ms (±0.27) | 2.46 × (2.29–2.87) **TanStack** | 0.56 × (0.55–0.59) **Infinite** | 0.84 × (0.63–0.99) **Infinite** | 2.40 × (2.35–2.56) **Element Plus** |
| Main thread: all tasks (lower is better) | 217 ms (±0.52) | 759 ms (±5.28) | 492 ms (±18.1) | 72.8 ms (±1.79) | 236 ms (±5.18) | 1.09 × (1.06–1.10) **TanStack** | 0.31 × (0.30–0.32) **Infinite** | 0.48 × (0.44–0.49) **Infinite** | 3.24 × (3.13–3.30) **Element Plus** |
| JS heap retained by grid (lower is better) | 87.2 MB (±0.00) | 204 MB (±0.00) | 21.6 MB (±0.01) | 2.77 MB (±0.00) | 36.7 MB (±0.00) | 0.42 × (0.42–0.42) **Infinite** | 0.18 × (0.18–0.18) **Infinite** | 1.70 × (1.70–1.70) **PrimeVue** | 13.3 × (13.3–13.3) **Element Plus** |
| DOM elements in grid (lower is better) | 352 (±0.00) | 637 (±0.00) | 1028 (±0.00) | 992 (±0.00) | 608 (±0.00) | 1.73 × (1.73–1.73) **TanStack** | 0.95 × (0.95–0.95) **Infinite** | 0.59 × (0.59–0.59) **Infinite** | 0.61 × (0.61–0.61) **Infinite** |

## sort-string - 300,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 998 ms (±42.9) | 1013 ms (±57.3) | 2590 ms (±46.3) | 244 ms (±9.69) | 411 ms (±8.39) | 0.41 × (0.40–0.45) **Infinite** | 0.41 × (0.40–0.45) **Infinite** | 0.16 × (0.15–0.16) **Infinite** | 1.68 × (1.63–1.79) **Element Plus** |
| Ascending: click to settled (lower is better) | 998 ms (±42.9) | 1013 ms (±57.3) | 2590 ms (±46.3) | 244 ms (±9.69) | 413 ms (±8.29) | 0.41 × (0.41–0.45) **Infinite** | 0.41 × (0.40–0.46) **Infinite** | 0.16 × (0.15–0.16) **Infinite** | 1.69 × (1.64–1.80) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 975 ms (±43.4) | 979 ms (±54.8) | 2624 ms (±44.4) | 250 ms (±5.68) | 403 ms (±12.4) | 0.41 × (0.40–0.44) **Infinite** | 0.41 × (0.40–0.46) **Infinite** | 0.15 × (0.15–0.16) **Infinite** | 1.61 × (1.56–1.68) **Element Plus** |
| Descending: click to settled (lower is better) | 975 ms (±43.4) | 979 ms (±54.8) | 2624 ms (±44.4) | 250 ms (±5.68) | 403 ms (±12.4) | 0.41 × (0.40–0.44) **Infinite** | 0.41 × (0.40–0.46) **Infinite** | 0.15 × (0.15–0.16) **Infinite** | 1.61 × (1.56–1.68) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 1000 ms (±43.0) | 1018 ms (±57.4) | 2603 ms (±46.3) | 302 ms (±10.5) | 441 ms (±6.82) | 0.44 × (0.43–0.48) **Infinite** | 0.43 × (0.42–0.49) **Infinite** | 0.17 × (0.16–0.17) **Infinite** | 1.46 × (1.43–1.56) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 976 ms (±43.5) | 985 ms (±55.1) | 2636 ms (±44.4) | 304 ms (±6.26) | 397 ms (±12.7) | 0.41 × (0.39–0.43) **Infinite** | 0.40 × (0.39–0.45) **Infinite** | 0.15 × (0.15–0.16) **Infinite** | 1.31 × (1.28–1.36) **Element Plus** |

## sort-number - 300,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 806 ms (±46.1) | 1014 ms (±37.4) | 2296 ms (±37.4) | 171 ms (±2.60) | 231 ms (±7.25) | 0.29 × (0.26–0.30) **Infinite** | 0.23 × (0.22–0.24) **Infinite** | 0.10 × (0.10–0.10) **Infinite** | 1.35 × (1.32–1.42) **Element Plus** |
| Ascending: click to settled (lower is better) | 806 ms (±46.1) | 1014 ms (±37.4) | 2296 ms (±37.4) | 171 ms (±2.60) | 234 ms (±7.32) | 0.29 × (0.26–0.31) **Infinite** | 0.23 × (0.22–0.25) **Infinite** | 0.10 × (0.10–0.11) **Infinite** | 1.37 × (1.33–1.44) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 754 ms (±39.5) | 999 ms (±51.9) | 2306 ms (±25.1) | 178 ms (±4.32) | 210 ms (±8.65) | 0.28 × (0.26–0.30) **Infinite** | 0.21 × (0.20–0.23) **Infinite** | 0.09 × (0.09–0.10) **Infinite** | 1.18 × (1.13–1.25) **Element Plus** |
| Descending: click to settled (lower is better) | 754 ms (±39.5) | 999 ms (±51.9) | 2306 ms (±25.1) | 178 ms (±4.32) | 210 ms (±8.65) | 0.28 × (0.26–0.30) **Infinite** | 0.21 × (0.20–0.23) **Infinite** | 0.09 × (0.09–0.10) **Infinite** | 1.18 × (1.13–1.25) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 937 ms (±53.0) | 1019 ms (±37.4) | 2309 ms (±37.7) | 226 ms (±4.79) | 259 ms (±11.1) | 0.28 × (0.26–0.30) **Infinite** | 0.25 × (0.25–0.28) **Infinite** | 0.11 × (0.11–0.12) **Infinite** | 1.14 × (1.11–1.24) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 755 ms (±38.0) | 1005 ms (±51.9) | 2318 ms (±24.6) | 230 ms (±12.5) | 210 ms (±8.43) | 0.28 × (0.26–0.30) **Infinite** | 0.21 × (0.20–0.23) **Infinite** | 0.09 × (0.09–0.09) **Infinite** | 0.91 × (0.88–0.99) **Infinite** |

## scroll-jump - 300,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 12.2 ms (±0.74) | 23.5 ms (±0.43) | 254 ms (±4.08) | 33.3 ms (±0.50) | 30.5 ms (±1.01) | 2.49 × (2.28–2.63) **TanStack** | 1.30 × (1.25–1.33) **AG Grid** | 0.12 × (0.12–0.12) **Infinite** | 0.92 × (0.89–0.94) **Infinite** |
| Jump to rows painted (worst jump) (lower is better) | 24.3 ms (±1.53) | 41.8 ms (±1.78) | 337 ms (±7.15) | 47.5 ms (±1.45) | 45.5 ms (±4.54) | 1.87 × (1.72–2.11) **TanStack** | 1.09 × (1.01–1.13) **AG Grid** | 0.14 × (0.12–0.14) **Infinite** | 0.96 × (0.89–1.01) ≈ |
| Jump to settled (median of jumps) (lower is better) | 12.2 ms (±0.74) | 23.5 ms (±0.43) | 254 ms (±4.08) | 33.3 ms (±0.50) | 30.5 ms (±1.01) | 2.49 × (2.28–2.63) **TanStack** | 1.30 × (1.25–1.33) **AG Grid** | 0.12 × (0.12–0.12) **Infinite** | 0.92 × (0.89–0.94) **Infinite** |
| Main thread, all tasks (all jumps) (lower is better) | 226 ms (±3.45) | 366 ms (±2.68) | 2895 ms (±26.4) | 384 ms (±3.81) | 378 ms (±7.88) | 1.67 × (1.61–1.72) **TanStack** | 1.03 × (1.00–1.05) **AG Grid** | 0.13 × (0.13–0.13) **Infinite** | 0.99 × (0.95–1.01) ≈ |

## scroll-vertical - 300,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 100 % (±0.00) | 100 % (±21.1) | 14.2 % (±0.38) | 50.1 % (±0.00) | 61.6 % (±1.80) | 0.62 × (0.61–0.64) **TanStack** | 0.62 × (0.61–1.08) ≈ | 4.33 × (4.26–4.61) **Infinite** | 1.23 × (1.22–1.28) **Infinite** |
| Frames presented without main-thread update (lower is better) | 0.00 % (±0.00) | 0.00 % (±21.0) | 80.3 % (±0.50) | 49.6 % (±0.00) | 38.4 % (±1.80) | +38.4 (+35.8 to +38.6) **TanStack** | +38.4 (-4.43 to +38.6) ≈ | 0.48 × (0.45–0.48) **Infinite** | 0.77 × (0.72–0.78) **Infinite** |
| Frames dropped (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.12) | 5.77 % (±0.68) | 0.27 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 6.30 fps (±0.18) | 60.0 fps (±0.00) | 59.0 fps (±0.37) | 0.98 × (0.97–0.98) **TanStack** | 0.98 × (0.97–0.98) **AG Grid** | 9.37 × (9.18–9.79) **Infinite** | 0.98 × (0.97–0.98) **Element Plus** |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 283 ms (±6.46) | 16.7 ms (±0.05) | 16.8 ms (±0.05) | 1.01 × (0.99–1.01) ≈ | 1.01 × (0.99–1.01) ≈ | 0.06 × (0.06–0.06) **Infinite** | 1.01 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 317 ms (±13.1) | 16.8 ms (±0.00) | 50.0 ms (±6.28) | 2.98 × (2.98–2.98) **TanStack** | 2.98 × (2.98–2.98) **AG Grid** | 0.16 × (0.15–0.16) **Infinite** | 2.98 × (2.98–2.98) **Element Plus** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 57.1 % (±3.70) | 0.00 % (±0.00) | 1.10 % (±0.53) | +1.10 (+1.09 to +2.21) **TanStack** | +1.10 (+1.09 to +2.21) **AG Grid** | 0.02 × (0.02–0.04) **Infinite** | +1.10 (+1.09 to +2.21) **Element Plus** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 2287 ms (±27.7) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 70.3 ms (±3.88) | 201 ms (±2.80) | 96.0 ms (±5.74) | 102 ms (±2.95) | 54.6 ms (±1.55) | 0.78 × (0.72–0.80) **Infinite** | 0.27 × (0.26–0.28) **Infinite** | 0.57 × (0.55–0.62) **Infinite** | 0.54 × (0.51–0.55) **Infinite** |
| Main thread: style recalc (lower is better) | 35.1 ms (±1.85) | 102 ms (±4.97) | 57.5 ms (±0.93) | 91.0 ms (±3.09) | 162 ms (±4.53) | 4.61 × (4.30–4.87) **TanStack** | 1.58 × (1.48–1.64) **AG Grid** | 2.81 × (2.71–2.90) **PrimeVue** | 1.78 × (1.73–1.85) **Element Plus** |
| Main thread: all tasks (lower is better) | 770 ms (±28.8) | 1024 ms (±28.5) | 3247 ms (±68.3) | 2023 ms (±44.7) | 1287 ms (±29.3) | 1.67 × (1.58–1.71) **TanStack** | 1.26 × (1.21–1.31) **AG Grid** | 0.40 × (0.39–0.41) **Infinite** | 0.64 × (0.61–0.65) **Infinite** |

## scroll-horizontal - 300,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 80.3 % (±3.22) | 100 % (±0.00) | 96.8 % (±0.42) | 80.4 % (±3.94) | 90.4 % (±2.66) | 1.13 × (1.12–1.19) **Infinite** | 0.90 × (0.90–0.95) **AG Grid** | 0.93 × (0.92–0.98) **PrimeVue** | 1.12 × (1.12–1.19) **Infinite** |
| Frames presented without main-thread update (lower is better) | 19.0 % (±2.96) | 0.00 % (±0.00) | 3.20 % (±0.42) | 18.9 % (±3.75) | 9.59 % (±2.66) | 0.50 × (0.26–0.54) **Infinite** | +9.59 (+4.86 to +10.3) **AG Grid** | 3.00 × (1.51–4.18) **PrimeVue** | 0.51 × (0.26–0.54) **Infinite** |
| Frames dropped (lower is better) | 0.70 % (±0.36) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.68 % (±0.19) | 0.00 % (±0.00) | -0.70 (-0.70 to -0.70) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 16.8 ms (±0.05) | 16.8 ms (±0.05) | 16.8 ms (±0.05) | 1.01 × (0.99–1.01) ≈ | 1.01 × (1.00–1.01) ≈ | 1.00 × (0.99–1.01) ≈ | 1.00 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 47.2 ms (±2.03) | 66.9 ms (±4.74) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 21.4 ms (±0.77) | 0.45 × (0.43–0.47) **Infinite** | 0.32 × (0.30–0.35) **Infinite** | +21.4 (+20.4 to +22.0) **PrimeVue** | +21.4 (+20.4 to +22.0) **Element Plus** |
| Main thread: style recalc (lower is better) | 14.4 ms (±0.70) | 33.2 ms (±0.63) | 0.00 ms (±0.00) | 8.80 ms (±1.35) | 27.9 ms (±1.19) | 1.94 × (1.84–2.06) **TanStack** | 0.84 × (0.80–0.88) **Infinite** | +27.9 (+26.8 to +28.7) **PrimeVue** | 3.18 × (2.62–3.77) **Element Plus** |
| Main thread: all tasks (lower is better) | 427 ms (±13.8) | 507 ms (±18.0) | 38.6 ms (±4.00) | 937 ms (±29.0) | 359 ms (±13.9) | 0.84 × (0.80–0.89) **Infinite** | 0.71 × (0.68–0.75) **Infinite** | 9.30 × (8.14–10.2) **PrimeVue** | 0.38 × (0.36–0.41) **Infinite** |

## correctness-vertical - 300,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 2.86 % (±0.67) | 1.77 % (±0.72) | 0.00 % (±0.00) | 2.05 % (±0.88) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 14.3 % (±3.37) | 8.86 % (±3.59) | 0.00 % (±0.00) | 10.3 % (±4.41) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Worst frame: correct samples (higher is better) | 80.0 % (±0.00) | 80.0 % (±0.00) | 100 % (±0.00) | 80.0 % (±0.00) | 100 % (±0.00) | 1.25 × (1.25–1.25) **Infinite** | 1.25 × (1.25–1.25) **Infinite** | 1.00 × (1.00–1.00) ≈ | 1.25 × (1.25–1.25) **Infinite** |

## correctness-horizontal - 300,000 rows

Same kind of horizontal wheel gesture. After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: correct samples (higher is better) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |

## visual-blank-vertical - 300,000 rows

Fast vertical wheel gesture (20000px/s) while recording what the compositor actually displays (CDP screencast). Each frame is checked for blank areas: vertical runs of the body with no text where rows should be. Unlike the correctness probe, this also catches the compositor scrolling ahead of the main thread. Screencast capture skips frames under load and adds overhead - compare the grids, not absolute numbers.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Captured frames with blank rows (lower is better) | 2.82 % (±2.44) | 4.35 % (±2.02) | 94.6 % (±0.04) | 0.00 % (±0.00) | 0.00 % (±0.00) | -2.82 (-4.23 to 0.00) ≈ | -4.35 (-4.48 to -1.47) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 0.15 % (±0.25) | 0.78 % (±0.63) | 90.2 % (±0.07) | 0.00 % (±0.00) | 0.00 % (±0.00) | -0.15 (-0.44 to 0.00) ≈ | -0.78 (-1.61 to -0.24) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 1.00 rows (±2.16) | 6.00 rows (±4.14) | 18.0 rows (±0.00) | 0.00 rows (±0.00) | 0.00 rows (±0.00) | -1.00 (-5.00 to 0.00) ≈ | -6.00 (-11.0 to -3.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Captured frames (higher is better) | 71.0 (±1.27) | 68.0 (±0.90) | 74.0 (±0.53) | 65.0 (±1.77) | 74.0 (±0.38) | 1.04 × (1.03–1.04) **Infinite** | 1.09 × (1.07–1.10) **Infinite** | 1.00 × (0.99–1.00) ≈ | 1.14 × (1.10–1.16) **Infinite** |

## updates-low - 300,000 rows

Live updates, low frequency. The grid shows the rows in the order of the data. 10 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 136 ms (±6.95) | 33.8 ms (±1.51) | 266 ms (±3.97) | 14.8 ms (±0.71) | 99.7 ms (±2.52) | 0.73 × (0.71–0.75) **Infinite** | 2.95 × (2.80–2.99) **AG Grid** | 0.37 × (0.37–0.38) **Infinite** | 6.73 × (6.28–6.81) **Element Plus** |
| Update to rows painted (worst update) (lower is better) | 223 ms (±11.2) | 44.9 ms (±2.03) | 324 ms (±6.01) | 27.3 ms (±0.99) | 137 ms (±2.14) | 0.61 × (0.60–0.63) **Infinite** | 3.05 × (2.93–3.20) **AG Grid** | 0.42 × (0.41–0.44) **Infinite** | 5.01 × (4.82–5.16) **Element Plus** |
| Update to settled (median of updates) (lower is better) | 136 ms (±6.95) | 33.8 ms (±1.51) | 266 ms (±3.97) | 14.8 ms (±0.71) | 99.7 ms (±2.52) | 0.73 × (0.71–0.75) **Infinite** | 2.95 × (2.80–2.99) **AG Grid** | 0.37 × (0.37–0.38) **Infinite** | 6.73 × (6.28–6.81) **Element Plus** |
| Main thread: layout (all updates) (lower is better) | 8.21 ms (±0.40) | 5.48 ms (±0.52) | 18.1 ms (±1.35) | 11.8 ms (±0.86) | 4.18 ms (±0.14) | 0.51 × (0.48–0.52) **Infinite** | 0.76 × (0.68–0.77) **Infinite** | 0.23 × (0.21–0.24) **Infinite** | 0.36 × (0.33–0.38) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 0.00 ms (±0.00) | 2.93 ms (±0.12) | 0.00 ms (±0.00) | 1.97 ms (±0.08) | 31.8 ms (±1.02) | +31.8 (+31.5 to +33.4) **TanStack** | 10.8 × (10.3–11.6) **AG Grid** | +31.8 (+31.5 to +33.4) **PrimeVue** | 16.1 × (15.6–17.5) **Element Plus** |
| Main thread: all tasks (all updates) (lower is better) | 1514 ms (±35.7) | 453 ms (±17.3) | 2726 ms (±27.4) | 234 ms (±5.68) | 1147 ms (±39.0) | 0.76 × (0.72–0.79) **Infinite** | 2.53 × (2.35–2.60) **AG Grid** | 0.42 × (0.40–0.43) **Infinite** | 4.90 × (4.55–5.01) **Element Plus** |

## updates-low-sorted - 300,000 rows

Live updates, low frequency. The grid shows sorted by salary, highest first - the updates change the salaries, so rows move. 10 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 833 ms (±44.5) | 1062 ms (±84.1) | 2075 ms (±68.4) | 161 ms (±5.94) | 160 ms (±4.10) | 0.19 × (0.18–0.20) **Infinite** | 0.15 × (0.14–0.16) **Infinite** | 0.08 × (0.07–0.08) **Infinite** | 0.99 × (0.93–1.02) ≈ |
| Update to rows painted (worst update) (lower is better) | 957 ms (±39.1) | 1126 ms (±103) | 2234 ms (±71.0) | 172 ms (±5.23) | 202 ms (±7.59) | 0.21 × (0.19–0.21) **Infinite** | 0.18 × (0.16–0.18) **Infinite** | 0.09 × (0.09–0.09) **Infinite** | 1.17 × (1.11–1.19) **Element Plus** |
| Update to settled (median of updates) (lower is better) | 833 ms (±44.5) | 1062 ms (±84.1) | 2075 ms (±68.4) | 161 ms (±5.94) | 160 ms (±4.10) | 0.19 × (0.18–0.20) **Infinite** | 0.15 × (0.14–0.16) **Infinite** | 0.08 × (0.07–0.08) **Infinite** | 0.99 × (0.93–1.02) ≈ |
| Main thread: layout (all updates) (lower is better) | 12.9 ms (±0.56) | 26.9 ms (±1.43) | 26.4 ms (±0.41) | 19.6 ms (±0.64) | 16.0 ms (±0.47) | 1.24 × (1.22–1.35) **TanStack** | 0.60 × (0.58–0.63) **Infinite** | 0.61 × (0.60–0.63) **Infinite** | 0.82 × (0.78–0.85) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 9.45 ms (±0.55) | 0.30 ms (±0.01) | 36.7 ms (±1.07) | 14.3 ms (±1.20) | 36.4 ms (±1.59) | 3.85 × (3.55–4.06) **TanStack** | 123 × (114–131) **AG Grid** | 0.99 × (0.93–1.03) ≈ | 2.54 × (2.27–2.80) **Element Plus** |
| Main thread: all tasks (all updates) (lower is better) | 8571 ms (±439) | 10796 ms (±846) | 21143 ms (±642) | 1809 ms (±52.5) | 1714 ms (±51.5) | 0.20 × (0.19–0.21) **Infinite** | 0.16 × (0.14–0.17) **Infinite** | 0.08 × (0.08–0.08) **Infinite** | 0.95 × (0.88–0.98) **Infinite** |

## updates-low-filtered - 300,000 rows

Live updates, low frequency. The grid shows filtered to a salary of at least 115,000 (about half of the rows) - the updates change the salaries, so rows go in and out of the filter. 10 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 301 ms (±7.35) | 77.9 ms (±1.38) | 242 ms (±3.01) | 24.3 ms (±0.70) | 93.1 ms (±1.23) | 0.31 × (0.30–0.32) **Infinite** | 1.19 × (1.17–1.22) **AG Grid** | 0.38 × (0.38–0.40) **Infinite** | 3.83 × (3.73–3.95) **Element Plus** |
| Update to rows painted (worst update) (lower is better) | 459 ms (±8.37) | 97.0 ms (±3.10) | 317 ms (±5.15) | 35.8 ms (±0.62) | 135 ms (±4.08) | 0.29 × (0.28–0.30) **Infinite** | 1.39 × (1.31–1.45) **AG Grid** | 0.43 × (0.41–0.44) **Infinite** | 3.78 × (3.64–3.89) **Element Plus** |
| Update to settled (median of updates) (lower is better) | 301 ms (±7.35) | 77.9 ms (±1.38) | 242 ms (±3.01) | 24.3 ms (±0.70) | 93.1 ms (±1.23) | 0.31 × (0.30–0.32) **Infinite** | 1.19 × (1.17–1.22) **AG Grid** | 0.38 × (0.38–0.40) **Infinite** | 3.83 × (3.73–3.95) **Element Plus** |
| Main thread: layout (all updates) (lower is better) | 8.38 ms (±2.18) | 8.56 ms (±0.18) | 19.5 ms (±0.64) | 12.4 ms (±0.48) | 6.99 ms (±0.20) | 0.84 × (0.79–0.92) **Infinite** | 0.82 × (0.79–0.86) **Infinite** | 0.36 × (0.34–0.37) **Infinite** | 0.56 × (0.53–0.59) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 1.49 ms (±0.14) | 1.67 ms (±0.07) | 8.93 ms (±0.43) | 2.55 ms (±0.05) | 33.8 ms (±1.80) | 22.8 × (19.8–24.7) **TanStack** | 20.2 × (19.2–21.3) **AG Grid** | 3.78 × (3.52–3.98) **PrimeVue** | 13.3 × (12.6–13.7) **Element Plus** |
| Main thread: all tasks (all updates) (lower is better) | 3315 ms (±37.2) | 977 ms (±39.7) | 2515 ms (±33.3) | 359 ms (±4.85) | 1019 ms (±15.9) | 0.31 × (0.30–0.32) **Infinite** | 1.04 × (1.01–1.07) **AG Grid** | 0.41 × (0.40–0.42) **Infinite** | 2.84 × (2.81–2.93) **Element Plus** |

## updates-low-grouped - 300,000 rows

Live updates, low frequency. The grid shows grouped by department (10 collapsed groups), with the sum of the salaries of each group - the updates change the salaries, so the sums change. 10 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | Infinite median (sd) | Infinite vs TanStack |
|---|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 455 ms (±38.2) | 223 ms (±3.97) | 0.49 × (0.43–0.51) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 604 ms (±45.1) | 325 ms (±5.85) | 0.54 × (0.49–0.56) **Infinite** |
| Update to settled (median of updates) (lower is better) | 455 ms (±38.2) | 223 ms (±3.97) | 0.49 × (0.43–0.51) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 4.26 ms (±0.21) | 2.62 ms (±0.06) | 0.61 × (0.60–0.63) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 0.00 ms (±0.00) | 21.2 ms (±0.64) | +21.2 (+20.5 to +21.3) **TanStack** |
| Main thread: all tasks (all updates) (lower is better) | 4779 ms (±346) | 2503 ms (±25.8) | 0.52 × (0.48–0.54) **Infinite** |

## updates-high - 300,000 rows

Live updates, high frequency. The grid shows the rows in the order of the data. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 246 ms (±63.7) | 34.1 ms (±5.58) | 408 ms (±39.7) | 24.3 ms (±0.70) | 151 ms (±44.3) | 0.61 × (0.43–1.05) ≈ | 4.43 × (3.05–6.87) **AG Grid** | 0.37 × (0.26–0.50) **Infinite** | 6.22 × (4.51–8.37) **Element Plus** |
| Update delay, p95 (lower is better) | 156 ms (±6.73) | 20.5 ms (±1.53) | 257 ms (±5.37) | 14.8 ms (±1.14) | 104 ms (±0.94) | 0.66 × (0.63–0.68) **Infinite** | 5.05 × (4.85–5.11) **AG Grid** | 0.40 × (0.40–0.41) **Infinite** | 6.99 × (6.34–7.51) **Element Plus** |
| Frames committed per second (higher is better) | 6.85 fps (±0.09) | 46.3 fps (±1.28) | 3.42 fps (±0.03) | 59.9 fps (±0.01) | 9.81 fps (±0.11) | 1.43 × (1.41–1.46) **Infinite** | 0.21 × (0.21–0.22) **AG Grid** | 2.87 × (2.85–2.93) **Infinite** | 0.16 × (0.16–0.17) **Element Plus** |
| Gap between frames, p95 (lower is better) | 231 ms (±8.90) | 25.5 ms (±1.19) | 414 ms (±9.82) | 25.9 ms (±0.80) | 136 ms (±4.68) | 0.59 × (0.55–0.62) **Infinite** | 5.34 × (5.07–5.84) **AG Grid** | 0.33 × (0.31–0.35) **Infinite** | 5.26 × (5.02–5.54) **Element Plus** |
| Longest gap between frames (lower is better) | 315 ms (±4.13) | 65.3 ms (±2.57) | 601 ms (±9.90) | 38.7 ms (±2.95) | 144 ms (±3.72) | 0.46 × (0.45–0.48) **Infinite** | 2.20 × (2.09–2.32) **AG Grid** | 0.24 × (0.23–0.25) **Infinite** | 3.71 × (3.42–3.96) **Element Plus** |
| Long tasks: total blocking time (lower is better) | 2706 ms (±54.4) | 0.00 ms (±0.00) | 3587 ms (±40.7) | 0.00 ms (±0.00) | 1844 ms (±23.8) | 0.68 × (0.66–0.70) **Infinite** | +1844 (+1833 to +1880) **AG Grid** | 0.51 × (0.51–0.53) **Infinite** | +1844 (+1833 to +1880) **Element Plus** |
| Main thread: layout (lower is better) | 21.5 ms (±0.79) | 73.2 ms (±3.61) | 24.0 ms (±0.38) | 145 ms (±11.5) | 17.0 ms (±0.30) | 0.79 × (0.78–0.85) **Infinite** | 0.23 × (0.23–0.25) **Infinite** | 0.71 × (0.70–0.73) **Infinite** | 0.12 × (0.11–0.13) **Infinite** |
| Main thread: style recalc (lower is better) | 0.00 ms (±0.00) | 38.0 ms (±1.71) | 0.00 ms (±0.00) | 21.4 ms (±2.63) | 125 ms (±2.76) | +125 (+123 to +129) **TanStack** | 3.29 × (3.22–3.57) **AG Grid** | +125 (+123 to +129) **PrimeVue** | 5.83 × (5.07–6.32) **Element Plus** |
| Main thread: all tasks (lower is better) | 4226 ms (±68.0) | 3998 ms (±12.9) | 4394 ms (±40.8) | 2045 ms (±117) | 4156 ms (±46.0) | 0.98 × (0.97–1.02) ≈ | 1.04 × (1.03–1.05) **AG Grid** | 0.95 × (0.93–0.96) **Infinite** | 2.03 × (1.91–2.15) **Element Plus** |

## updates-high-sorted - 300,000 rows

Live updates, high frequency. The grid shows sorted by salary, highest first - the updates change the salaries, so rows move. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 1686 ms (±365) | 2510 ms (±192) | 2899 ms (±87.7) | 275 ms (±46.1) | 216 ms (±42.6) | 0.13 × (0.10–0.21) **Infinite** | 0.09 × (0.07–0.10) **Infinite** | 0.07 × (0.06–0.09) **Infinite** | 0.78 × (0.59–0.98) **Infinite** |
| Update delay, p95 (lower is better) | 940 ms (±25.7) | 1243 ms (±42.2) | 2201 ms (±30.5) | 174 ms (±2.87) | 162 ms (±4.53) | 0.17 × (0.17–0.18) **Infinite** | 0.13 × (0.13–0.14) **Infinite** | 0.07 × (0.07–0.08) **Infinite** | 0.93 × (0.92–0.98) **Infinite** |
| Frames committed per second (higher is better) | 0.84 fps (±0.04) | 0.62 fps (±0.02) | 0.29 fps (±0.00) | 5.31 fps (±0.11) | 5.98 fps (±0.06) | 7.10 × (6.75–7.60) **Infinite** | 9.71 × (9.46–9.94) **Infinite** | 20.6 × (20.2–20.8) **Infinite** | 1.13 × (1.10–1.16) **Infinite** |
| Gap between frames, p95 (lower is better) | 1765 ms (±84.0) | 2372 ms (±74.9) | 4489 ms (±54.5) | 222 ms (±14.3) | 215 ms (±4.79) | 0.12 × (0.11–0.13) **Infinite** | 0.09 × (0.09–0.10) **Infinite** | 0.05 × (0.05–0.05) **Infinite** | 0.97 × (0.93–1.00) ≈ |
| Longest gap between frames (lower is better) | 1948 ms (±72.7) | 2553 ms (±86.4) | 4603 ms (±56.2) | 422 ms (±5.96) | 223 ms (±9.57) | 0.11 × (0.11–0.12) **Infinite** | 0.09 × (0.09–0.09) **Infinite** | 0.05 × (0.05–0.05) **Infinite** | 0.53 × (0.51–0.53) **Infinite** |
| Long tasks: total blocking time (lower is better) | 5365 ms (±342) | 6238 ms (±192) | 6713 ms (±87.6) | 3097 ms (±41.2) | 2720 ms (±31.0) | 0.51 × (0.48–0.56) **Infinite** | 0.44 × (0.42–0.45) **Infinite** | 0.41 × (0.40–0.41) **Infinite** | 0.88 × (0.87–0.90) **Infinite** |
| Main thread: layout (lower is better) | 8.59 ms (±2.97) | 21.5 ms (±0.90) | 12.3 ms (±0.25) | 52.1 ms (±1.39) | 40.7 ms (±0.77) | 4.74 × (4.52–5.43) **TanStack** | 1.90 × (1.75–1.94) **AG Grid** | 3.32 × (3.22–3.41) **PrimeVue** | 0.78 × (0.76–0.81) **Infinite** |
| Main thread: style recalc (lower is better) | 4.72 ms (±2.62) | 0.12 ms (±0.01) | 8.23 ms (±0.24) | 34.8 ms (±0.60) | 86.0 ms (±1.89) | 18.2 × (17.5–20.4) **TanStack** | 729 × (696–769) **AG Grid** | 10.5 × (10.1–11.0) **PrimeVue** | 2.47 × (2.40–2.58) **Element Plus** |
| Main thread: all tasks (lower is better) | 5684 ms (±373) | 6495 ms (±192) | 6885 ms (±87.0) | 4255 ms (±46.0) | 4204 ms (±42.4) | 0.74 × (0.70–0.82) **Infinite** | 0.65 × (0.63–0.66) **Infinite** | 0.61 × (0.60–0.62) **Infinite** | 0.99 × (0.97–1.00) **Infinite** |

## updates-high-filtered - 300,000 rows

Live updates, high frequency. The grid shows filtered to a salary of at least 115,000 (about half of the rows) - the updates change the salaries, so rows go in and out of the filter. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 493 ms (±94.3) | 121 ms (±24.4) | 275 ms (±102) | 34.4 ms (±4.98) | 149 ms (±36.1) | 0.30 × (0.22–0.41) **Infinite** | 1.24 × (0.92–1.64) ≈ | 0.54 × (0.29–0.67) **Infinite** | 4.35 × (3.64–6.07) **Element Plus** |
| Update delay, p95 (lower is better) | 392 ms (±7.51) | 71.1 ms (±5.85) | 236 ms (±2.79) | 16.8 ms (±1.57) | 90.6 ms (±1.80) | 0.23 × (0.23–0.24) **Infinite** | 1.28 × (1.13–1.34) **AG Grid** | 0.38 × (0.38–0.39) **Infinite** | 5.39 × (4.88–5.53) **Element Plus** |
| Frames committed per second (higher is better) | 2.68 fps (±0.06) | 13.4 fps (±1.00) | 3.76 fps (±0.03) | 52.6 fps (±0.81) | 10.7 fps (±0.20) | 3.99 × (3.85–4.07) **Infinite** | 0.80 × (0.76–0.91) **AG Grid** | 2.85 × (2.77–2.87) **Infinite** | 0.20 × (0.20–0.21) **Element Plus** |
| Gap between frames, p95 (lower is better) | 611 ms (±7.81) | 85.5 ms (±6.43) | 335 ms (±9.44) | 33.6 ms (±0.73) | 129 ms (±3.81) | 0.21 × (0.21–0.22) **Infinite** | 1.51 × (1.37–1.61) **AG Grid** | 0.39 × (0.38–0.41) **Infinite** | 3.84 × (3.75–4.03) **Element Plus** |
| Longest gap between frames (lower is better) | 754 ms (±6.11) | 174 ms (±11.0) | 568 ms (±6.22) | 57.4 ms (±2.18) | 134 ms (±1.83) | 0.18 × (0.18–0.18) **Infinite** | 0.77 × (0.71–0.82) **Infinite** | 0.24 × (0.23–0.24) **Infinite** | 2.34 × (2.23–2.40) **Element Plus** |
| Long tasks: total blocking time (lower is better) | 3822 ms (±94.2) | 1311 ms (±208) | 3403 ms (±77.2) | 0.00 ms (±0.00) | 1633 ms (±47.1) | 0.43 × (0.41–0.45) **Infinite** | 1.25 × (1.01–1.38) **AG Grid** | 0.48 × (0.46–0.50) **Infinite** | +1633 (+1595 to +1692) **Element Plus** |
| Main thread: layout (lower is better) | 9.19 ms (±0.34) | 37.2 ms (±2.45) | 32.7 ms (±1.27) | 165 ms (±3.65) | 25.8 ms (±0.52) | 2.81 × (2.70–2.90) **TanStack** | 0.69 × (0.65–0.72) **Infinite** | 0.79 × (0.76–0.82) **Infinite** | 0.16 × (0.16–0.16) **Infinite** |
| Main thread: style recalc (lower is better) | 1.77 ms (±0.22) | 8.93 ms (±0.87) | 13.3 ms (±1.06) | 27.7 ms (±0.97) | 137 ms (±3.17) | 77.1 × (71.5–92.9) **TanStack** | 15.3 × (13.9–16.3) **AG Grid** | 10.3 × (9.31–11.0) **PrimeVue** | 4.93 × (4.83–5.14) **Element Plus** |
| Main thread: all tasks (lower is better) | 4474 ms (±94.3) | 4142 ms (±64.1) | 4255 ms (±101) | 3809 ms (±35.8) | 4129 ms (±37.8) | 0.92 × (0.90–0.94) **Infinite** | 1.00 × (0.98–1.02) ≈ | 0.97 × (0.92–0.98) **Infinite** | 1.08 × (1.07–1.10) **Element Plus** |

## updates-high-grouped - 300,000 rows

Live updates, high frequency. The grid shows grouped by department (10 collapsed groups), with the sum of the salaries of each group - the updates change the salaries, so the sums change. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | Infinite median (sd) | Infinite vs TanStack |
|---|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 917 ms (±84.6) | 482 ms (±52.0) | 0.53 × (0.47–0.61) **Infinite** |
| Update delay, p95 (lower is better) | 540 ms (±14.2) | 246 ms (±5.70) | 0.46 × (0.45–0.48) **Infinite** |
| Frames committed per second (higher is better) | 1.63 fps (±0.03) | 4.03 fps (±0.05) | 2.47 × (2.41–2.50) **Infinite** |
| Gap between frames, p95 (lower is better) | 962 ms (±16.8) | 318 ms (±6.77) | 0.33 × (0.33–0.35) **Infinite** |
| Longest gap between frames (lower is better) | 1113 ms (±16.1) | 329 ms (±6.36) | 0.30 × (0.29–0.30) **Infinite** |
| Long tasks: total blocking time (lower is better) | 4446 ms (±84.6) | 3492 ms (±51.4) | 0.79 × (0.77–0.81) **Infinite** |
| Main thread: layout (lower is better) | 3.22 ms (±0.12) | 4.53 ms (±0.08) | 1.41 × (1.35–1.45) **TanStack** |
| Main thread: style recalc (lower is better) | 0.00 ms (±0.00) | 32.6 ms (±1.44) | +32.6 (+32.3 to +33.3) **TanStack** |
| Main thread: all tasks (lower is better) | 4915 ms (±85.3) | 4464 ms (±49.7) | 0.91 × (0.90–0.93) **Infinite** |

# 1,000,000 rows

Scroll range - browsers cap element sizes (Chrome ~16.7M-33.5M px, depending on the version), so a grid has to map the scrollbar onto the rows when the content is taller than that. One that doesn't can't reach its last rows: its scrolling results are for the rows it can reach, and the same wheel gesture goes over fewer rows in it.

| | TanStack | AG Grid | PrimeVue | Element Plus | Infinite |
|---|---:|---:|---:|---:|---:|
| Last row reachable with the scrollbar | **no** - stops at row 838,860 | yes (1,000,000) | **no** - stops at row 838,881 | **no** - stops at row 838,861 | yes (1,000,000) |
| Native scroll range | 33,553,630 px | 31,999,240 px | 33,553,632 px | 33,553,668 px | 31,999,240 px |
| Content px per scrollbar px | 1.000 | 1.250 | 1.000 | 1.000 | 1.250 |

## mount - 1,000,000 rows

Mount the grid with all the rows (data already in memory). "Visible" = from setState to the end of the first frame committed with the whole viewport (first/last visible row and column) showing the right content. "Settled" = until the first frame committed after the grid's last DOM mutation. Memory is the JS heap retained by the grid after GC (heap after mount - heap before mount).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Time to first rows painted (lower is better) | 614 ms (±8.47) | 2382 ms (±26.6) | 891 ms (±22.7) | 48.6 ms (±2.12) | 527 ms (±22.9) | 0.86 × (0.83–0.89) **Infinite** | 0.22 × (0.22–0.23) **Infinite** | 0.59 × (0.57–0.63) **Infinite** | 10.8 × (10.2–11.2) **Element Plus** |
| Time until settled (lower is better) | 614 ms (±8.47) | 2486 ms (±26.7) | 891 ms (±22.7) | 48.6 ms (±2.12) | 539 ms (±23.3) | 0.88 × (0.85–0.91) **Infinite** | 0.22 × (0.21–0.22) **Infinite** | 0.61 × (0.59–0.65) **Infinite** | 11.1 × (10.4–11.5) **Element Plus** |
| Main thread: layout (lower is better) | 3.67 ms (±0.14) | 7.88 ms (±0.37) | 13.7 ms (±2.43) | 4.76 ms (±0.51) | 3.60 ms (±0.25) | 0.98 × (0.92–1.07) ≈ | 0.46 × (0.43–0.50) **Infinite** | 0.26 × (0.24–0.40) **Infinite** | 0.76 × (0.63–0.88) **Infinite** |
| Main thread: style recalc (lower is better) | 1.40 ms (±0.24) | 10.9 ms (±0.22) | 10.5 ms (±2.89) | 2.52 ms (±0.04) | 6.51 ms (±0.28) | 4.66 × (3.61–5.00) **TanStack** | 0.60 × (0.57–0.61) **Infinite** | 0.62 × (0.52–0.99) **Infinite** | 2.58 × (2.51–2.64) **Element Plus** |
| Main thread: all tasks (lower is better) | 616 ms (±9.07) | 2406 ms (±28.6) | 941 ms (±30.7) | 52.2 ms (±1.83) | 551 ms (±18.4) | 0.89 × (0.87–0.92) **Infinite** | 0.23 × (0.22–0.23) **Infinite** | 0.59 × (0.56–0.61) **Infinite** | 10.6 × (10.2–11.1) **Element Plus** |
| JS heap retained by grid (lower is better) | 287 MB (±0.05) | 670 MB (±0.01) | 21.6 MB (±0.05) | 2.77 MB (±0.00) | 90.8 MB (±0.00) | 0.32 × (0.32–0.32) **Infinite** | 0.14 × (0.14–0.14) **Infinite** | 4.20 × (4.19–4.20) **PrimeVue** | 32.8 × (32.8–32.8) **Element Plus** |
| DOM elements in grid (lower is better) | 352 (±0.00) | 637 (±0.00) | 1028 (±0.00) | 992 (±0.00) | 608 (±0.00) | 1.73 × (1.73–1.73) **TanStack** | 0.95 × (0.95–0.95) **Infinite** | 0.59 × (0.59–0.59) **Infinite** | 0.61 × (0.61–0.61) **Infinite** |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 3833 ms (±132) | 4140 ms (±229) | 9962 ms (±308) | 934 ms (±31.9) | 1449 ms (±24.2) | 0.38 × (0.37–0.39) **Infinite** | 0.35 × (0.34–0.39) **Infinite** | 0.15 × (0.14–0.15) **Infinite** | 1.55 × (1.51–1.63) **Element Plus** |
| Ascending: click to settled (lower is better) | 3833 ms (±132) | 4140 ms (±229) | 9962 ms (±308) | 934 ms (±31.9) | 1451 ms (±24.3) | 0.38 × (0.37–0.39) **Infinite** | 0.35 × (0.34–0.39) **Infinite** | 0.15 × (0.14–0.15) **Infinite** | 1.55 × (1.51–1.64) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 3767 ms (±93.2) | 4140 ms (±105) | 9967 ms (±207) | 1001 ms (±29.1) | 1510 ms (±40.5) | 0.40 × (0.39–0.42) **Infinite** | 0.36 × (0.36–0.38) **Infinite** | 0.15 × (0.15–0.16) **Infinite** | 1.51 × (1.46–1.58) **Element Plus** |
| Descending: click to settled (lower is better) | 3767 ms (±93.2) | 4140 ms (±105) | 9967 ms (±207) | 1001 ms (±29.1) | 1510 ms (±40.5) | 0.40 × (0.39–0.42) **Infinite** | 0.36 × (0.36–0.38) **Infinite** | 0.15 × (0.15–0.16) **Infinite** | 1.51 × (1.46–1.58) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 3835 ms (±132) | 4145 ms (±230) | 9976 ms (±309) | 1065 ms (±62.3) | 1474 ms (±27.4) | 0.38 × (0.37–0.40) **Infinite** | 0.36 × (0.34–0.39) **Infinite** | 0.15 × (0.14–0.15) **Infinite** | 1.38 × (1.28–1.46) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 3768 ms (±93.2) | 4144 ms (±105) | 9980 ms (±207) | 1135 ms (±48.9) | 1512 ms (±39.8) | 0.40 × (0.39–0.42) **Infinite** | 0.36 × (0.35–0.38) **Infinite** | 0.15 × (0.15–0.16) **Infinite** | 1.33 × (1.26–1.41) **Element Plus** |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 3356 ms (±94.8) | 4514 ms (±154) | 8885 ms (±282) | 626 ms (±20.6) | 569 ms (±9.90) | 0.17 × (0.16–0.17) **Infinite** | 0.13 × (0.12–0.13) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.91 × (0.88–0.95) **Infinite** |
| Ascending: click to settled (lower is better) | 3356 ms (±94.8) | 4514 ms (±154) | 8885 ms (±282) | 626 ms (±20.6) | 573 ms (±9.93) | 0.17 × (0.16–0.17) **Infinite** | 0.13 × (0.12–0.13) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.92 × (0.88–0.95) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 3417 ms (±179) | 4489 ms (±157) | 9070 ms (±258) | 695 ms (±20.4) | 576 ms (±31.2) | 0.17 × (0.17–0.19) **Infinite** | 0.13 × (0.12–0.14) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.83 × (0.81–0.90) **Infinite** |
| Descending: click to settled (lower is better) | 3417 ms (±179) | 4489 ms (±157) | 9070 ms (±258) | 695 ms (±20.4) | 576 ms (±31.2) | 0.17 × (0.17–0.19) **Infinite** | 0.13 × (0.12–0.14) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.83 × (0.81–0.90) **Infinite** |
| Ascending: main thread, all tasks (lower is better) | 3782 ms (±131) | 4519 ms (±154) | 8909 ms (±281) | 801 ms (±54.5) | 603 ms (±14.0) | 0.16 × (0.15–0.17) **Infinite** | 0.13 × (0.13–0.14) **Infinite** | 0.07 × (0.06–0.07) **Infinite** | 0.75 × (0.71–0.84) **Infinite** |
| Descending: main thread, all tasks (lower is better) | 3418 ms (±179) | 4493 ms (±157) | 9090 ms (±258) | 881 ms (±26.2) | 577 ms (±33.0) | 0.17 × (0.16–0.19) **Infinite** | 0.13 × (0.12–0.14) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.66 × (0.64–0.72) **Infinite** |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 13.5 ms (±0.32) | 26.9 ms (±0.81) | 262 ms (±2.96) | 32.6 ms (±0.92) | 32.0 ms (±0.71) | 2.37 × (2.32–2.47) **TanStack** | 1.19 × (1.15–1.24) **AG Grid** | 0.12 × (0.12–0.12) **Infinite** | 0.98 × (0.93–0.99) **Infinite** |
| Jump to rows painted (worst jump) (lower is better) | 30.3 ms (±2.15) | 60.7 ms (±3.42) | 404 ms (±14.3) | 53.4 ms (±1.47) | 55.0 ms (±3.21) | 1.82 × (1.66–1.95) **TanStack** | 0.91 × (0.86–0.99) **Infinite** | 0.14 × (0.13–0.14) **Infinite** | 1.03 × (0.97–1.06) ≈ |
| Jump to settled (median of jumps) (lower is better) | 13.5 ms (±0.32) | 26.9 ms (±0.81) | 262 ms (±2.96) | 32.6 ms (±0.92) | 32.0 ms (±0.71) | 2.37 × (2.32–2.47) **TanStack** | 1.19 × (1.15–1.24) **AG Grid** | 0.12 × (0.12–0.12) **Infinite** | 0.98 × (0.93–0.99) **Infinite** |
| Main thread, all tasks (all jumps) (lower is better) | 176 ms (±3.82) | 314 ms (±11.4) | 2914 ms (±34.6) | 442 ms (±4.67) | 472 ms (±6.31) | 2.68 × (2.62–2.72) **TanStack** | 1.50 × (1.44–1.53) **AG Grid** | 0.16 × (0.16–0.16) **Infinite** | 1.07 × (1.05–1.09) **Element Plus** |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 100 % (±0.00) | 64.9 % (±8.27) | 13.3 % (±0.34) | 50.0 % (±0.16) | 80.7 % (±2.96) | 0.81 × (0.80–0.83) **TanStack** | 1.24 × (1.22–1.64) **Infinite** | 6.08 × (5.98–6.37) **Infinite** | 1.61 × (1.60–1.66) **Infinite** |
| Frames presented without main-thread update (lower is better) | 0.00 % (±0.00) | 33.7 % (±8.31) | 79.7 % (±1.32) | 49.5 % (±0.15) | 18.7 % (±2.80) | +18.7 (+17.3 to +20.2) **TanStack** | 0.56 × (0.36–0.60) **Infinite** | 0.23 × (0.22–0.25) **Infinite** | 0.38 × (0.35–0.41) **Infinite** |
| Frames dropped (lower is better) | 0.00 % (±0.00) | 1.71 % (±0.76) | 7.08 % (±1.61) | 0.55 % (±0.31) | 0.57 % (±0.31) | +0.57 (0.00 to +0.58) ≈ | 0.33 × (0.00–0.79) **Infinite** | 0.08 × (0.00–0.09) **Infinite** | 1.04 × (0.00–1.05) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 58.7 fps (±0.78) | 5.97 fps (±0.15) | 59.7 fps (±0.36) | 54.5 fps (±1.72) | 0.91 × (0.87–0.92) **TanStack** | 0.93 × (0.87–0.95) **AG Grid** | 9.13 × (8.66–9.51) **Infinite** | 0.91 × (0.87–0.93) **Element Plus** |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.8 ms (±0.04) | 337 ms (±22.8) | 16.8 ms (±0.03) | 33.3 ms (±8.83) | 1.99 × (1.00–1.99) ≈ | 1.98 × (1.00–1.98) ≈ | 0.10 × (0.05–0.11) **Infinite** | 1.98 × (1.00–1.99) **Element Plus** |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 66.7 ms (±30.2) | 400 ms (±34.5) | 33.3 ms (±0.05) | 117 ms (±6.28) | 6.95 × (6.94–6.95) **TanStack** | 1.75 × (1.40–3.51) **AG Grid** | 0.29 × (0.28–0.30) **Infinite** | 3.50 × (3.49–3.51) **Element Plus** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 1.10 % (±0.44) | 60.0 % (±3.08) | 0.54 % (±0.61) | 5.95 % (±2.67) | +5.95 (+4.07 to +9.32) **TanStack** | +4.85 (+2.96 to +8.78) **AG Grid** | 0.10 × (0.07–0.16) **Infinite** | 11.1 × (4.35–17.3) **Element Plus** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 15.7 ms (±16.5) | 2359 ms (±90.3) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | -15.7 (-25.9 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 69.7 ms (±7.59) | 363 ms (±14.3) | 88.6 ms (±4.50) | 111 ms (±5.65) | 69.5 ms (±3.85) | 1.00 × (0.83–1.07) ≈ | 0.19 × (0.18–0.20) **Infinite** | 0.78 × (0.72–0.84) **Infinite** | 0.63 × (0.59–0.68) **Infinite** |
| Main thread: style recalc (lower is better) | 35.6 ms (±3.93) | 114 ms (±4.58) | 60.5 ms (±2.97) | 97.4 ms (±5.55) | 204 ms (±8.31) | 5.71 × (4.92–6.59) **TanStack** | 1.78 × (1.63–1.85) **AG Grid** | 3.37 × (3.17–3.48) **PrimeVue** | 2.09 × (1.84–2.21) **Element Plus** |
| Main thread: all tasks (lower is better) | 798 ms (±58.6) | 1490 ms (±54.9) | 3186 ms (±69.5) | 2088 ms (±116) | 1624 ms (±68.7) | 2.04 × (1.74–2.15) **TanStack** | 1.09 × (1.00–1.17) **AG Grid** | 0.51 × (0.47–0.53) **Infinite** | 0.78 × (0.71–0.82) **Infinite** |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 80.3 % (±11.1) | 100 % (±0.00) | 96.8 % (±0.02) | 80.3 % (±0.10) | 95.8 % (±3.29) | 1.19 × (0.90–1.20) ≈ | 0.96 × (0.90–0.96) **AG Grid** | 0.99 × (0.93–0.99) **PrimeVue** | 1.19 × (1.12–1.19) **Infinite** |
| Frames presented without main-thread update (lower is better) | 19.0 % (±10.7) | 0.00 % (±0.00) | 3.23 % (±0.02) | 19.0 % (±0.10) | 4.20 % (±3.29) | -14.8 (-15.0 to +9.72) ≈ | +4.20 (+4.11 to +10.3) **AG Grid** | 1.30 × (1.26–3.21) **PrimeVue** | 0.22 × (0.22–0.54) **Infinite** |
| Frames dropped (lower is better) | 0.70 % (±0.44) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.68 % (±0.00) | 0.00 % (±0.00) | -0.70 (-0.71 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 1.00 × (0.99–1.01) ≈ | 1.00 × (0.99–1.01) ≈ | 1.00 × (1.00–1.01) ≈ | 1.00 × (1.00–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 40.0 ms (±4.88) | 56.2 ms (±4.33) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 19.1 ms (±1.37) | 0.48 × (0.40–0.52) **Infinite** | 0.34 × (0.30–0.39) **Infinite** | +19.1 (+17.7 to +20.4) **PrimeVue** | +19.1 (+17.7 to +20.4) **Element Plus** |
| Main thread: style recalc (lower is better) | 12.0 ms (±1.17) | 30.2 ms (±0.93) | 0.00 ms (±0.00) | 6.19 ms (±1.20) | 25.1 ms (±1.51) | 2.08 × (1.95–2.25) **TanStack** | 0.83 × (0.77–0.89) **Infinite** | +25.1 (+23.6 to +26.3) **PrimeVue** | 4.05 × (3.04–4.32) **Element Plus** |
| Main thread: all tasks (lower is better) | 335 ms (±25.9) | 381 ms (±23.2) | 29.2 ms (±3.04) | 887 ms (±33.4) | 402 ms (±15.5) | 1.20 × (1.14–1.27) **TanStack** | 1.06 × (1.01–1.18) **AG Grid** | 13.8 × (11.8–14.7) **PrimeVue** | 0.45 × (0.42–0.47) **Infinite** |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 2.31 % (±0.52) | 2.06 % (±0.90) | 0.00 % (±0.00) | 2.11 % (±0.75) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 11.5 % (±2.62) | 10.3 % (±4.52) | 0.00 % (±0.00) | 10.5 % (±3.73) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Worst frame: correct samples (higher is better) | 80.0 % (±0.00) | 80.0 % (±0.00) | 100 % (±0.00) | 80.0 % (±0.00) | 100 % (±0.00) | 1.25 × (1.25–1.25) **Infinite** | 1.25 × (1.25–1.25) **Infinite** | 1.00 × (1.00–1.00) ≈ | 1.25 × (1.25–1.25) **Infinite** |

## correctness-horizontal - 1,000,000 rows

Same kind of horizontal wheel gesture. After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: correct samples (higher is better) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |

## visual-blank-vertical - 1,000,000 rows

Fast vertical wheel gesture (20000px/s) while recording what the compositor actually displays (CDP screencast). Each frame is checked for blank areas: vertical runs of the body with no text where rows should be. Unlike the correctness probe, this also catches the compositor scrolling ahead of the main thread. Screencast capture skips frames under load and adds overhead - compare the grids, not absolute numbers.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Captured frames with blank rows (lower is better) | 7.81 % (±1.54) | 15.4 % (±1.66) | 94.5 % (±0.71) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 2.25 % (±0.82) | 10.3 % (±2.25) | 89.2 % (±0.57) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 10.0 rows (±2.94) | 18.0 rows (±0.49) | 18.0 rows (±0.00) | 0.00 rows (±0.00) | 0.00 rows (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Captured frames (higher is better) | 66.0 (±1.90) | 52.0 (±0.79) | 74.0 (±0.69) | 60.0 (±1.35) | 73.0 (±0.98) | 1.11 × (1.07–1.14) **Infinite** | 1.40 × (1.36–1.40) **Infinite** | 0.99 × (0.96–0.99) **PrimeVue** | 1.22 × (1.16–1.24) **Infinite** |

## updates-low - 1,000,000 rows

Live updates, low frequency. The grid shows the rows in the order of the data. 10 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 463 ms (±6.13) | 124 ms (±2.56) | 684 ms (±20.1) | 18.1 ms (±0.65) | 366 ms (±47.8) | 0.79 × (0.74–0.95) **Infinite** | 2.96 × (2.75–3.54) **AG Grid** | 0.53 × (0.49–0.64) **Infinite** | 20.2 × (18.9–24.6) **Element Plus** |
| Update to rows painted (worst update) (lower is better) | 651 ms (±7.99) | 139 ms (±2.59) | 887 ms (±20.3) | 29.6 ms (±15.9) | 439 ms (±90.7) | 0.67 × (0.63–0.91) **Infinite** | 3.17 × (3.00–4.34) **AG Grid** | 0.49 × (0.47–0.68) **Infinite** | 14.8 × (10.4–20.6) **Element Plus** |
| Update to settled (median of updates) (lower is better) | 463 ms (±6.13) | 124 ms (±2.56) | 684 ms (±20.1) | 18.1 ms (±0.65) | 366 ms (±47.8) | 0.79 × (0.74–0.95) **Infinite** | 2.96 × (2.75–3.54) **AG Grid** | 0.53 × (0.49–0.64) **Infinite** | 20.2 × (18.9–24.6) **Element Plus** |
| Main thread: layout (all updates) (lower is better) | 7.98 ms (±3.64) | 5.37 ms (±0.20) | 18.3 ms (±0.73) | 13.4 ms (±1.89) | 4.51 ms (±0.12) | 0.57 × (0.53–0.58) **Infinite** | 0.84 × (0.80–0.86) **Infinite** | 0.25 × (0.23–0.26) **Infinite** | 0.34 × (0.28–0.35) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 0.00 ms (±0.00) | 2.89 ms (±0.16) | 0.00 ms (±0.00) | 2.11 ms (±1.49) | 34.2 ms (±1.05) | +34.2 (+33.4 to +34.9) **TanStack** | 11.8 × (11.3–12.7) **AG Grid** | +34.2 (+33.4 to +34.9) **PrimeVue** | 16.2 × (15.2–16.8) **Element Plus** |
| Main thread: all tasks (all updates) (lower is better) | 5044 ms (±82.7) | 1513 ms (±26.4) | 7089 ms (±192) | 282 ms (±12.0) | 3837 ms (±461) | 0.76 × (0.72–0.90) **Infinite** | 2.54 × (2.39–2.98) **AG Grid** | 0.54 × (0.51–0.65) **Infinite** | 13.6 × (12.2–16.1) **Element Plus** |

## updates-low-sorted - 1,000,000 rows

Live updates, low frequency. The grid shows sorted by salary, highest first - the updates change the salaries, so rows move. 10 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 4077 ms (±188) | 5611 ms (±264) | 8962 ms (±304) | 671 ms (±41.9) | 536 ms (±16.8) | 0.13 × (0.12–0.14) **Infinite** | 0.10 × (0.09–0.10) **Infinite** | 0.06 × (0.06–0.06) **Infinite** | 0.80 × (0.71–0.83) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 4392 ms (±359) | 6069 ms (±171) | 9502 ms (±388) | 691 ms (±31.9) | 745 ms (±35.5) | 0.17 × (0.15–0.19) **Infinite** | 0.12 × (0.12–0.13) **Infinite** | 0.08 × (0.08–0.08) **Infinite** | 1.08 × (0.98–1.14) ≈ |
| Update to settled (median of updates) (lower is better) | 4077 ms (±188) | 5611 ms (±264) | 8962 ms (±304) | 671 ms (±41.9) | 536 ms (±16.8) | 0.13 × (0.12–0.14) **Infinite** | 0.10 × (0.09–0.10) **Infinite** | 0.06 × (0.06–0.06) **Infinite** | 0.80 × (0.71–0.83) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 13.1 ms (±0.93) | 31.0 ms (±8.60) | 28.6 ms (±1.10) | 22.0 ms (±0.79) | 16.8 ms (±0.34) | 1.28 × (1.16–1.36) **TanStack** | 0.54 × (0.37–0.61) **Infinite** | 0.59 × (0.54–0.60) **Infinite** | 0.76 × (0.74–0.82) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 9.04 ms (±0.80) | 0.32 ms (±0.02) | 36.2 ms (±1.50) | 16.1 ms (±1.30) | 36.8 ms (±1.46) | 4.07 × (3.80–4.35) **TanStack** | 114 × (103–125) **AG Grid** | 1.02 × (1.00–1.07) ≈ | 2.28 × (2.13–2.50) **Element Plus** |
| Main thread: all tasks (all updates) (lower is better) | 44600 ms (±1048) | 57246 ms (±2820) | 89652 ms (±2929) | 7160 ms (±431) | 5636 ms (±151) | 0.13 × (0.12–0.13) **Infinite** | 0.10 × (0.09–0.11) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.79 × (0.72–0.82) **Infinite** |

## updates-low-filtered - 1,000,000 rows

Live updates, low frequency. The grid shows filtered to a salary of at least 115,000 (about half of the rows) - the updates change the salaries, so rows go in and out of the filter. 10 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 1472 ms (±81.2) | 280 ms (±11.1) | 568 ms (±9.81) | 46.2 ms (±0.49) | 310 ms (±16.2) | 0.21 × (0.20–0.22) **Infinite** | 1.11 × (1.03–1.22) **AG Grid** | 0.55 × (0.51–0.58) **Infinite** | 6.72 × (6.21–7.06) **Element Plus** |
| Update to rows painted (worst update) (lower is better) | 1614 ms (±32.8) | 301 ms (±15.2) | 722 ms (±27.9) | 57.3 ms (±0.97) | 420 ms (±22.2) | 0.26 × (0.24–0.27) **Infinite** | 1.40 × (1.31–1.54) **AG Grid** | 0.58 × (0.53–0.61) **Infinite** | 7.33 × (6.86–7.65) **Element Plus** |
| Update to settled (median of updates) (lower is better) | 1472 ms (±81.2) | 280 ms (±11.1) | 568 ms (±9.81) | 46.2 ms (±0.49) | 310 ms (±16.2) | 0.21 × (0.20–0.22) **Infinite** | 1.11 × (1.03–1.22) **AG Grid** | 0.55 × (0.51–0.58) **Infinite** | 6.72 × (6.21–7.06) **Element Plus** |
| Main thread: layout (all updates) (lower is better) | 8.08 ms (±0.49) | 8.39 ms (±0.30) | 20.3 ms (±0.60) | 12.0 ms (±0.67) | 7.03 ms (±0.20) | 0.87 × (0.82–0.92) **Infinite** | 0.84 × (0.80–0.89) **Infinite** | 0.35 × (0.33–0.36) **Infinite** | 0.58 × (0.56–0.62) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 1.57 ms (±0.13) | 1.61 ms (±0.08) | 9.33 ms (±0.21) | 2.70 ms (±0.15) | 34.3 ms (±1.21) | 21.8 × (20.2–24.6) **TanStack** | 21.3 × (20.0–22.3) **AG Grid** | 3.67 × (3.54–3.86) **PrimeVue** | 12.7 × (12.3–14.1) **Element Plus** |
| Main thread: all tasks (all updates) (lower is better) | 13787 ms (±191) | 3091 ms (±119) | 5864 ms (±111) | 670 ms (±10.4) | 3342 ms (±165) | 0.24 × (0.23–0.25) **Infinite** | 1.08 × (1.01–1.18) **AG Grid** | 0.57 × (0.54–0.60) **Infinite** | 4.99 × (4.69–5.24) **Element Plus** |

## updates-low-grouped - 1,000,000 rows

Live updates, low frequency. The grid shows grouped by department (10 collapsed groups), with the sum of the salaries of each group - the updates change the salaries, so the sums change. 10 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | Infinite median (sd) | Infinite vs TanStack |
|---|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 1850 ms (±43.5) | 813 ms (±29.8) | 0.44 × (0.42–0.45) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 2272 ms (±55.8) | 1057 ms (±37.1) | 0.47 × (0.43–0.47) **Infinite** |
| Update to settled (median of updates) (lower is better) | 1850 ms (±43.5) | 813 ms (±29.8) | 0.44 × (0.42–0.45) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 4.29 ms (±0.22) | 2.50 ms (±0.05) | 0.58 × (0.56–0.60) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 0.00 ms (±0.00) | 21.0 ms (±0.45) | +21.0 (+20.7 to +21.6) **TanStack** |
| Main thread: all tasks (all updates) (lower is better) | 19562 ms (±431) | 8426 ms (±211) | 0.43 × (0.41–0.44) **Infinite** |

## updates-high - 1,000,000 rows

Live updates, high frequency. The grid shows the rows in the order of the data. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 699 ms (±112) | 174 ms (±45.1) | 1175 ms (±133) | 27.6 ms (±4.26) | 558 ms (±95.6) | 0.80 × (0.70–1.09) ≈ | 3.20 × (2.31–4.63) **AG Grid** | 0.48 × (0.39–0.60) **Infinite** | 20.2 × (16.3–24.7) **Element Plus** |
| Update delay, p95 (lower is better) | 564 ms (±13.4) | 123 ms (±2.02) | 702 ms (±21.2) | 17.6 ms (±1.14) | 411 ms (±13.1) | 0.73 × (0.71–0.77) **Infinite** | 3.34 × (3.26–3.52) **AG Grid** | 0.59 × (0.56–0.62) **Infinite** | 23.4 × (21.8–25.2) **Element Plus** |
| Frames committed per second (higher is better) | 1.71 fps (±0.04) | 7.54 fps (±0.06) | 1.16 fps (±0.03) | 57.1 fps (±0.27) | 2.40 fps (±0.06) | 1.41 × (1.34–1.43) **Infinite** | 0.32 × (0.31–0.32) **AG Grid** | 2.06 × (1.99–2.14) **Infinite** | 0.04 × (0.04–0.04) **Element Plus** |
| Gap between frames, p95 (lower is better) | 985 ms (±20.1) | 193 ms (±11.6) | 1369 ms (±19.1) | 29.8 ms (±1.34) | 508 ms (±23.8) | 0.52 × (0.50–0.55) **Infinite** | 2.64 × (2.47–2.94) **AG Grid** | 0.37 × (0.35–0.39) **Infinite** | 17.0 × (16.3–18.0) **Element Plus** |
| Longest gap between frames (lower is better) | 1139 ms (±29.4) | 265 ms (±4.10) | 1585 ms (±17.4) | 147 ms (±22.4) | 562 ms (±38.5) | 0.49 × (0.45–0.52) **Infinite** | 2.12 × (1.93–2.24) **AG Grid** | 0.35 × (0.32–0.38) **Infinite** | 3.81 × (3.48–4.26) **Element Plus** |
| Long tasks: total blocking time (lower is better) | 4228 ms (±112) | 2548 ms (±29.9) | 4804 ms (±133) | 82.3 ms (±20.1) | 3899 ms (±81.2) | 0.92 × (0.90–0.97) **Infinite** | 1.53 × (1.50–1.58) **AG Grid** | 0.81 × (0.78–0.84) **Infinite** | 47.4 × (41.2–54.6) **Element Plus** |
| Main thread: layout (lower is better) | 5.77 ms (±0.15) | 16.0 ms (±2.39) | 9.97 ms (±0.49) | 169 ms (±12.9) | 4.87 ms (±0.23) | 0.84 × (0.81–0.87) **Infinite** | 0.31 × (0.24–0.31) **Infinite** | 0.49 × (0.45–0.51) **Infinite** | 0.03 × (0.03–0.03) **Infinite** |
| Main thread: style recalc (lower is better) | 0.00 ms (±0.00) | 8.66 ms (±2.71) | 0.00 ms (±0.00) | 27.5 ms (±1.63) | 35.4 ms (±8.86) | +35.4 (+33.7 to +51.1) **TanStack** | 4.08 × (2.52–6.05) **AG Grid** | +35.4 (+33.7 to +51.1) **PrimeVue** | 1.29 × (1.17–1.96) **Element Plus** |
| Main thread: all tasks (lower is better) | 4680 ms (±115) | 4155 ms (±46.2) | 5156 ms (±133) | 2663 ms (±39.3) | 4539 ms (±93.5) | 0.97 × (0.95–1.01) ≈ | 1.09 × (1.07–1.13) **AG Grid** | 0.88 × (0.85–0.91) **Infinite** | 1.70 × (1.68–1.77) **Element Plus** |

## updates-high-sorted - 1,000,000 rows

Live updates, high frequency. The grid shows sorted by salary, highest first - the updates change the salaries, so rows move. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 5262 ms (±2333) | 7669 ms (±449) | 15156 ms (±639) | 1228 ms (±159) | 984 ms (±156) | 0.19 × (0.10–0.23) **Infinite** | 0.13 × (0.11–0.14) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.80 × (0.62–0.90) **Infinite** |
| Update delay, p95 (lower is better) | 3768 ms (±368) | 5423 ms (±182) | 9325 ms (±338) | 731 ms (±24.3) | 620 ms (±38.8) | 0.16 × (0.13–0.17) **Infinite** | 0.11 × (0.10–0.12) **Infinite** | 0.07 × (0.06–0.07) **Infinite** | 0.85 × (0.78–0.91) **Infinite** |
| Frames committed per second (higher is better) | 0.12 fps (±0.02) | 0.09 fps (±0.00) | 0.05 fps (±0.00) | 1.15 fps (±0.03) | 1.61 fps (±0.05) | 13.3 × (10.4–14.4) **Infinite** | 18.8 × (18.0–20.0) **Infinite** | 30.8 × (30.1–31.8) **Infinite** | 1.40 × (1.36–1.48) **Infinite** |
| Gap between frames, p95 (lower is better) | 8247 ms (±461) | 11649 ms (±449) | 19136 ms (±639) | 1415 ms (±45.8) | 768 ms (±31.4) | 0.09 × (0.09–0.10) **Infinite** | 0.07 × (0.06–0.07) **Infinite** | 0.04 × (0.04–0.04) **Infinite** | 0.54 × (0.53–0.56) **Infinite** |
| Longest gap between frames (lower is better) | 8370 ms (±399) | 11649 ms (±449) | 19136 ms (±639) | 1635 ms (±57.8) | 791 ms (±37.4) | 0.09 × (0.09–0.10) **Infinite** | 0.07 × (0.06–0.07) **Infinite** | 0.04 × (0.04–0.04) **Infinite** | 0.48 × (0.46–0.51) **Infinite** |
| Long tasks: total blocking time (lower is better) | 9142 ms (±2307) | 11549 ms (±449) | 19036 ms (±639) | 4857 ms (±159) | 4488 ms (±156) | 0.49 × (0.34–0.54) **Infinite** | 0.39 × (0.36–0.40) **Infinite** | 0.24 × (0.23–0.24) **Infinite** | 0.92 × (0.87–0.95) **Infinite** |
| Main thread: layout (lower is better) | 2.01 ms (±0.51) | 7.12 ms (±0.50) | 6.96 ms (±2.18) | 15.6 ms (±0.22) | 13.9 ms (±0.34) | 6.93 × (4.79–7.10) **TanStack** | 1.95 × (1.88–2.17) **AG Grid** | 2.00 × (1.86–2.07) **PrimeVue** | 0.89 × (0.86–0.90) **Infinite** |
| Main thread: style recalc (lower is better) | 1.23 ms (±0.34) | 0.03 ms (±0.00) | 4.54 ms (±0.59) | 10.7 ms (±0.31) | 28.2 ms (±2.84) | 22.9 × (16.5–26.2) **TanStack** | 1008 × (825–1055) **AG Grid** | 6.21 × (5.42–6.56) **PrimeVue** | 2.65 × (2.55–2.72) **Element Plus** |
| Main thread: all tasks (lower is better) | 9243 ms (±2168) | 11652 ms (±450) | 19161 ms (±601) | 5209 ms (±209) | 4968 ms (±156) | 0.54 × (0.37–0.57) **Infinite** | 0.43 × (0.40–0.44) **Infinite** | 0.26 × (0.25–0.27) **Infinite** | 0.95 × (0.88–0.98) **Infinite** |

## updates-high-filtered - 1,000,000 rows

Live updates, high frequency. The grid shows filtered to a salary of at least 115,000 (about half of the rows) - the updates change the salaries, so rows go in and out of the filter. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 1224 ms (±103) | 430 ms (±49.3) | 774 ms (±50.2) | 56.5 ms (±6.94) | 422 ms (±92.5) | 0.34 × (0.26–0.44) **Infinite** | 0.98 × (0.68–1.24) ≈ | 0.54 × (0.39–0.66) **Infinite** | 7.46 × (5.17–9.46) **Element Plus** |
| Update delay, p95 (lower is better) | 1426 ms (±27.8) | 285 ms (±33.1) | 570 ms (±3.48) | 40.7 ms (±1.33) | 309 ms (±20.6) | 0.22 × (0.20–0.22) **Infinite** | 1.08 × (0.89–1.16) ≈ | 0.54 × (0.49–0.55) **Infinite** | 7.59 × (6.74–7.98) **Element Plus** |
| Frames committed per second (higher is better) | 0.58 fps (±0.01) | 3.37 fps (±0.15) | 1.47 fps (±0.02) | 23.8 fps (±0.60) | 3.12 fps (±0.19) | 5.41 × (5.30–5.98) **Infinite** | 0.93 × (0.91–1.03) ≈ | 2.12 × (2.10–2.35) **Infinite** | 0.13 × (0.13–0.14) **Element Plus** |
| Gap between frames, p95 (lower is better) | 2464 ms (±48.0) | 501 ms (±31.8) | 1099 ms (±4.69) | 47.1 ms (±2.24) | 399 ms (±25.0) | 0.16 × (0.15–0.17) **Infinite** | 0.80 × (0.71–0.84) **Infinite** | 0.36 × (0.34–0.38) **Infinite** | 8.48 × (7.38–8.88) **Element Plus** |
| Longest gap between frames (lower is better) | 2559 ms (±51.2) | 534 ms (±22.1) | 1311 ms (±6.78) | 100 ms (±2.85) | 431 ms (±26.6) | 0.17 × (0.16–0.18) **Infinite** | 0.81 × (0.74–0.85) **Infinite** | 0.33 × (0.30–0.34) **Infinite** | 4.30 × (3.81–4.50) **Element Plus** |
| Long tasks: total blocking time (lower is better) | 5004 ms (±103) | 3625 ms (±30.8) | 4353 ms (±50.1) | 46.5 ms (±8.97) | 3556 ms (±105) | 0.71 × (0.70–0.75) **Infinite** | 0.98 × (0.96–1.02) ≈ | 0.82 × (0.80–0.85) **Infinite** | 76.4 × (69.1–96.4) **Element Plus** |
| Main thread: layout (lower is better) | 2.45 ms (±0.12) | 13.7 ms (±0.79) | 15.9 ms (±0.34) | 97.4 ms (±5.88) | 9.99 ms (±0.43) | 4.07 × (3.85–4.40) **TanStack** | 0.73 × (0.71–0.77) **Infinite** | 0.63 × (0.61–0.67) **Infinite** | 0.10 × (0.10–0.11) **Infinite** |
| Main thread: style recalc (lower is better) | 0.95 ms (±0.02) | 1.91 ms (±0.11) | 10.2 ms (±0.17) | 18.6 ms (±1.98) | 44.3 ms (±1.78) | 46.8 × (45.9–49.5) **TanStack** | 23.2 × (22.4–24.7) **AG Grid** | 4.33 × (4.23–4.62) **PrimeVue** | 2.38 × (2.27–3.00) **Element Plus** |
| Main thread: all tasks (lower is better) | 5206 ms (±103) | 4411 ms (±48.9) | 4755 ms (±50.1) | 4030 ms (±6.67) | 4403 ms (±92.7) | 0.85 × (0.82–0.87) **Infinite** | 1.00 × (0.97–1.02) ≈ | 0.93 × (0.90–0.95) **Infinite** | 1.09 × (1.07–1.11) **Element Plus** |

## updates-high-grouped - 1,000,000 rows

Live updates, high frequency. The grid shows grouped by department (10 collapsed groups), with the sum of the salaries of each group - the updates change the salaries, so the sums change. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | Infinite median (sd) | Infinite vs TanStack |
|---|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 2063 ms (±640) | 1789 ms (±149) | 0.87 × (0.73–0.92) **Infinite** |
| Update delay, p95 (lower is better) | 1939 ms (±43.6) | 901 ms (±49.5) | 0.46 × (0.44–0.48) **Infinite** |
| Frames committed per second (higher is better) | 0.33 fps (±0.02) | 1.04 fps (±0.03) | 3.13 × (3.07–3.29) **Infinite** |
| Gap between frames, p95 (lower is better) | 3990 ms (±112) | 1097 ms (±39.3) | 0.27 × (0.26–0.28) **Infinite** |
| Longest gap between frames (lower is better) | 4097 ms (±82.6) | 1110 ms (±42.5) | 0.27 × (0.26–0.28) **Infinite** |
| Long tasks: total blocking time (lower is better) | 5893 ms (±622) | 5432 ms (±146) | 0.92 × (0.87–0.94) **Infinite** |
| Main thread: layout (lower is better) | 0.84 ms (±0.22) | 1.55 ms (±0.02) | 1.85 × (1.74–1.97) **TanStack** |
| Main thread: style recalc (lower is better) | 0.00 ms (±0.00) | 11.4 ms (±0.14) | +11.4 (+11.3 to +11.5) **TanStack** |
| Main thread: all tasks (lower is better) | 6044 ms (±640) | 5780 ms (±148) | 0.96 × (0.91–0.97) **Infinite** |
