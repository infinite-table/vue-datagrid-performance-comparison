# TanStack Table vs AG Grid vs PrimeVue DataTable vs Element Plus Table V2 vs Infinite Table — benchmark report

- Run: `ci` · 2026-11-26T21:47:47.248Z
- TanStack Table 9.3.1 · AG Grid 36.3.0 · PrimeVue DataTable 4.5.5 · Element Plus Table V2 2.14.8 · Infinite Table 11.0.0
- 1,000,000 rows (data checksum `1000000:19e5eebe`) × 20 columns, identical data for every grid
- Chrome 136.0.7103.25 · headless · CPU throttling 1× · viewport 1400×1000
- 5 measured runs per grid per scenario (+1 warmup, discarded), interleaved, fresh browser context per run
- Linux 7.0.0-1014-aws x64 · Intel(R) Xeon(R) 6975P-C × 4
- Served from http://localhost:5570/
- Grid body: 759-760 px high, with the same number of rows in view in every grid (to get there, the setup made the boxes taller: TanStack +2 px, AG Grid +3 px, Infinite +24 px)

The "Infinite vs ..." columns compare Infinite Table with one other grid: the ratio of the medians (Infinite / other, so < 1 means Infinite has the lower value), its 95% bootstrap confidence interval, and the grid that does better. A grid is only named when the interval excludes 1; "≈" means no significant difference. When the other grid has zeros among its values (e.g. 0% blank samples) a ratio means nothing, so the difference of the medians (Infinite − other) and its interval are shown instead, and a grid is only named when that interval excludes 0.

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
| Time to first rows painted (lower is better) | 592 ms (±4.50) | 2169 ms (±15.4) | 830 ms (±27.8) | 48.8 ms (±1.55) | 458 ms (±7.02) | 0.77 × (0.76–0.80) **Infinite** | 0.21 × (0.21–0.22) **Infinite** | 0.55 × (0.52–0.57) **Infinite** | 9.38 × (9.29–10.1) **Element Plus** |
| Time until settled (lower is better) | 592 ms (±4.50) | 2272 ms (±15.4) | 830 ms (±27.8) | 48.8 ms (±1.55) | 476 ms (±8.48) | 0.80 × (0.79–0.82) **Infinite** | 0.21 × (0.20–0.21) **Infinite** | 0.57 × (0.54–0.59) **Infinite** | 9.75 × (9.53–10.5) **Element Plus** |
| Main thread: layout (lower is better) | 3.74 ms (±0.11) | 8.09 ms (±0.81) | 13.2 ms (±2.01) | 4.40 ms (±0.66) | 4.79 ms (±0.94) | 1.28 × (0.99–1.67) ≈ | 0.59 × (0.46–0.77) **Infinite** | 0.36 × (0.28–0.54) **Infinite** | 1.09 × (0.82–1.42) ≈ |
| Main thread: style recalc (lower is better) | 1.51 ms (±0.18) | 10.2 ms (±0.21) | 10.0 ms (±1.93) | 2.46 ms (±0.03) | 7.66 ms (±0.97) | 5.09 × (3.93–6.12) **TanStack** | 0.75 × (0.58–0.82) **Infinite** | 0.76 × (0.59–1.29) ≈ | 3.11 × (2.40–3.41) **Element Plus** |
| Main thread: all tasks (lower is better) | 594 ms (±4.47) | 2177 ms (±16.0) | 916 ms (±10.3) | 50.7 ms (±1.34) | 494 ms (±11.3) | 0.83 × (0.82–0.87) **Infinite** | 0.23 × (0.22–0.24) **Infinite** | 0.54 × (0.53–0.56) **Infinite** | 9.75 × (9.47–10.2) **Element Plus** |
| JS heap retained by grid (lower is better) | 287 MB (±0.06) | 670 MB (±0.00) | 21.6 MB (±0.02) | 2.77 MB (±0.06) | 90.8 MB (±0.00) | 0.32 × (0.32–0.32) **Infinite** | 0.14 × (0.14–0.14) **Infinite** | 4.20 × (4.20–4.20) **PrimeVue** | 32.8 × (32.8–34.4) **Element Plus** |
| DOM elements in grid (lower is better) | 352 (±0.00) | 637 (±0.00) | 1028 (±0.00) | 992 (±0.00) | 608 (±0.00) | 1.73 × (1.73–1.73) **TanStack** | 0.95 × (0.95–0.95) **Infinite** | 0.59 × (0.59–0.59) **Infinite** | 0.61 × (0.61–0.61) **Infinite** |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 3314 ms (±76.2) | 3305 ms (±194) | 8862 ms (±187) | 801 ms (±11.4) | 1229 ms (±23.7) | 0.37 × (0.36–0.39) **Infinite** | 0.37 × (0.33–0.39) **Infinite** | 0.14 × (0.13–0.14) **Infinite** | 1.53 × (1.50–1.59) **Element Plus** |
| Ascending: click to settled (lower is better) | 3314 ms (±76.2) | 3305 ms (±194) | 8862 ms (±187) | 801 ms (±11.4) | 1231 ms (±23.7) | 0.37 × (0.36–0.39) **Infinite** | 0.37 × (0.33–0.39) **Infinite** | 0.14 × (0.13–0.14) **Infinite** | 1.54 × (1.51–1.59) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 3234 ms (±37.2) | 3356 ms (±203) | 9019 ms (±200) | 839 ms (±18.1) | 1323 ms (±31.8) | 0.41 × (0.39–0.42) **Infinite** | 0.39 × (0.35–0.40) **Infinite** | 0.15 × (0.14–0.15) **Infinite** | 1.58 × (1.51–1.62) **Element Plus** |
| Descending: click to settled (lower is better) | 3234 ms (±37.2) | 3356 ms (±203) | 9019 ms (±200) | 839 ms (±18.1) | 1323 ms (±31.8) | 0.41 × (0.39–0.42) **Infinite** | 0.39 × (0.35–0.40) **Infinite** | 0.15 × (0.14–0.15) **Infinite** | 1.58 × (1.51–1.62) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 3315 ms (±76.1) | 3309 ms (±194) | 8874 ms (±187) | 900 ms (±28.9) | 1249 ms (±24.7) | 0.38 × (0.36–0.39) **Infinite** | 0.38 × (0.33–0.39) **Infinite** | 0.14 × (0.14–0.15) **Infinite** | 1.39 × (1.31–1.44) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 3235 ms (±37.3) | 3358 ms (±203) | 9032 ms (±199) | 939 ms (±31.9) | 1319 ms (±31.7) | 0.41 × (0.39–0.42) **Infinite** | 0.39 × (0.35–0.40) **Infinite** | 0.15 × (0.14–0.15) **Infinite** | 1.40 × (1.31–1.45) **Element Plus** |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 2750 ms (±115) | 3483 ms (±191) | 7834 ms (±83.9) | 551 ms (±18.4) | 515 ms (±11.6) | 0.19 × (0.17–0.19) **Infinite** | 0.15 × (0.13–0.15) **Infinite** | 0.07 × (0.06–0.07) **Infinite** | 0.94 × (0.91–1.00) **Infinite** |
| Ascending: click to settled (lower is better) | 2750 ms (±115) | 3483 ms (±191) | 7834 ms (±83.9) | 551 ms (±18.4) | 518 ms (±11.6) | 0.19 × (0.17–0.19) **Infinite** | 0.15 × (0.13–0.15) **Infinite** | 0.07 × (0.06–0.07) **Infinite** | 0.94 × (0.91–1.00) ≈ |
| Descending: click to sorted rows painted (lower is better) | 2626 ms (±36.6) | 3622 ms (±204) | 7943 ms (±122) | 621 ms (±46.0) | 525 ms (±30.0) | 0.20 × (0.18–0.21) **Infinite** | 0.15 × (0.13–0.16) **Infinite** | 0.07 × (0.06–0.07) **Infinite** | 0.85 × (0.75–0.93) **Infinite** |
| Descending: click to settled (lower is better) | 2626 ms (±36.6) | 3622 ms (±204) | 7943 ms (±122) | 621 ms (±46.0) | 525 ms (±30.0) | 0.20 × (0.18–0.21) **Infinite** | 0.15 × (0.13–0.16) **Infinite** | 0.07 × (0.06–0.07) **Infinite** | 0.85 × (0.75–0.93) **Infinite** |
| Ascending: main thread, all tasks (lower is better) | 3110 ms (±153) | 3487 ms (±192) | 7857 ms (±81.4) | 652 ms (±42.2) | 537 ms (±14.7) | 0.17 × (0.17–0.19) **Infinite** | 0.15 × (0.14–0.16) **Infinite** | 0.07 × (0.07–0.07) **Infinite** | 0.82 × (0.74–0.89) **Infinite** |
| Descending: main thread, all tasks (lower is better) | 2627 ms (±36.7) | 3623 ms (±204) | 7957 ms (±123) | 715 ms (±84.6) | 525 ms (±31.8) | 0.20 × (0.18–0.21) **Infinite** | 0.14 × (0.13–0.16) **Infinite** | 0.07 × (0.06–0.07) **Infinite** | 0.73 × (0.59–0.79) **Infinite** |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 12.4 ms (±0.61) | 24.9 ms (±0.69) | 248 ms (±2.21) | 32.1 ms (±1.43) | 29.6 ms (±1.11) | 2.39 × (2.17–2.55) **TanStack** | 1.19 × (1.11–1.24) **AG Grid** | 0.12 × (0.11–0.12) **Infinite** | 0.92 × (0.86–1.01) ≈ |
| Jump to rows painted (worst jump) (lower is better) | 30.4 ms (±1.98) | 56.9 ms (±5.41) | 379 ms (±14.6) | 53.5 ms (±2.02) | 51.2 ms (±3.87) | 1.68 × (1.49–1.94) **TanStack** | 0.90 × (0.76–1.04) ≈ | 0.13 × (0.12–0.15) **Infinite** | 0.96 × (0.85–1.06) ≈ |
| Jump to settled (median of jumps) (lower is better) | 12.4 ms (±0.61) | 24.9 ms (±0.69) | 248 ms (±2.21) | 32.1 ms (±1.43) | 29.6 ms (±1.11) | 2.39 × (2.17–2.55) **TanStack** | 1.19 × (1.11–1.24) **AG Grid** | 0.12 × (0.11–0.12) **Infinite** | 0.92 × (0.86–1.01) ≈ |
| Main thread, all tasks (all jumps) (lower is better) | 162 ms (±1.63) | 286 ms (±8.23) | 2792 ms (±17.4) | 435 ms (±7.63) | 439 ms (±10.4) | 2.71 × (2.65–2.84) **TanStack** | 1.53 × (1.49–1.61) **AG Grid** | 0.16 × (0.15–0.16) **Infinite** | 1.01 × (0.99–1.06) ≈ |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 100 % (±21.1) | 65.4 % (±6.74) | 13.4 % (±0.58) | 50.1 % (±0.00) | 78.3 % (±6.17) | 0.78 × (0.65–1.29) ≈ | 1.20 × (0.99–1.56) ≈ | 5.84 × (4.85–5.98) **Infinite** | 1.56 × (1.30–1.59) **Infinite** |
| Frames presented without main-thread update (lower is better) | 0.00 % (±21.0) | 33.5 % (±6.54) | 79.6 % (±0.79) | 49.6 % (±0.00) | 21.7 % (±6.17) | +21.7 (-17.3 to +35.0) ≈ | 0.65 × (0.45–1.05) ≈ | 0.27 × (0.25–0.44) **Infinite** | 0.44 × (0.41–0.71) **Infinite** |
| Frames dropped (lower is better) | 0.00 % (±0.18) | 1.10 % (±0.59) | 7.08 % (±1.08) | 0.27 % (±0.00) | 0.00 % (±0.00) | 0.00 (-0.34 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 59.4 fps (±0.61) | 6.00 fps (±0.22) | 60.0 fps (±0.00) | 56.1 fps (±0.37) | 0.94 × (0.92–0.94) **TanStack** | 0.95 × (0.93–0.96) **AG Grid** | 9.35 × (8.73–9.49) **Infinite** | 0.94 × (0.92–0.94) **Element Plus** |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.04) | 16.8 ms (±0.04) | 321 ms (±34.1) | 16.7 ms (±0.05) | 16.8 ms (±0.00) | 1.01 × (1.00–1.01) **TanStack** | 1.00 × (1.00–1.01) ≈ | 0.05 × (0.05–0.06) **Infinite** | 1.01 × (1.00–1.01) **Element Plus** |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 50.0 ms (±21.7) | 367 ms (±41.8) | 16.8 ms (±0.00) | 117 ms (±14.9) | 6.95 × (4.96–6.95) **TanStack** | 2.33 × (1.40–3.50) **AG Grid** | 0.32 × (0.23–0.37) **Infinite** | 6.95 × (4.96–6.95) **Element Plus** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 1.09 % (±0.31) | 61.9 % (±3.37) | 0.00 % (±0.00) | 2.89 % (±0.27) | +2.89 (+2.86 to +3.49) **TanStack** | 2.66 × (2.59–5.38) **AG Grid** | 0.05 × (0.04–0.06) **Infinite** | +2.89 (+2.86 to +3.49) **Element Plus** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 3.47 ms (±10.3) | 2343 ms (±45.2) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | -3.47 (-24.1 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 62.0 ms (±0.37) | 343 ms (±4.65) | 88.8 ms (±5.80) | 98.1 ms (±0.80) | 59.6 ms (±1.75) | 0.96 × (0.95–1.02) ≈ | 0.17 × (0.17–0.18) **Infinite** | 0.67 × (0.60–0.71) **Infinite** | 0.61 × (0.60–0.64) **Infinite** |
| Main thread: style recalc (lower is better) | 30.7 ms (±0.44) | 106 ms (±3.87) | 58.8 ms (±2.06) | 89.5 ms (±0.47) | 182 ms (±2.28) | 5.92 × (5.77–6.04) **TanStack** | 1.72 × (1.61–1.78) **AG Grid** | 3.09 × (2.88–3.16) **PrimeVue** | 2.03 × (2.01–2.07) **Element Plus** |
| Main thread: all tasks (lower is better) | 743 ms (±12.5) | 1379 ms (±22.3) | 3172 ms (±63.1) | 1881 ms (±31.3) | 1474 ms (±13.1) | 1.98 × (1.93–2.01) **TanStack** | 1.07 × (1.05–1.09) **AG Grid** | 0.46 × (0.46–0.48) **Infinite** | 0.78 × (0.76–0.79) **Infinite** |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 80.3 % (±0.25) | 100 % (±4.03) | 96.8 % (±0.01) | 80.5 % (±0.12) | 90.3 % (±3.27) | 1.12 × (1.12–1.19) **Infinite** | 0.90 × (0.90–0.99) **AG Grid** | 0.93 × (0.93–0.99) **PrimeVue** | 1.12 × (1.11–1.19) **Infinite** |
| Frames presented without main-thread update (lower is better) | 19.0 % (±0.06) | 0.00 % (±3.67) | 3.23 % (±0.01) | 18.8 % (±0.11) | 9.72 % (±3.27) | 0.51 × (0.22–0.54) **Infinite** | +9.72 (+1.53 to +10.3) **AG Grid** | 3.01 × (1.27–3.21) **PrimeVue** | 0.52 × (0.22–0.55) **Infinite** |
| Frames dropped (lower is better) | 0.70 % (±0.31) | 0.00 % (±0.37) | 0.00 % (±0.00) | 0.67 % (±0.00) | 0.00 % (±0.00) | -0.70 (-0.70 to 0.00) ≈ | 0.00 (-0.82 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.00) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 16.7 ms (±0.04) | 16.7 ms (±0.04) | 1.00 × (1.00–1.01) ≈ | 1.00 × (0.99–1.01) ≈ | 1.00 × (0.99–1.01) ≈ | 1.00 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 32.9 ms (±2.59) | 50.7 ms (±3.86) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 16.9 ms (±1.51) | 0.51 × (0.45–0.61) **Infinite** | 0.33 × (0.29–0.39) **Infinite** | +16.9 (+16.4 to +20.0) **PrimeVue** | +16.9 (+16.4 to +20.0) **Element Plus** |
| Main thread: style recalc (lower is better) | 10.0 ms (±0.77) | 28.6 ms (±1.86) | 0.00 ms (±0.00) | 5.85 ms (±1.30) | 22.9 ms (±1.66) | 2.28 × (1.98–2.64) **TanStack** | 0.80 × (0.73–0.93) **Infinite** | +22.9 (+22.4 to +26.5) **PrimeVue** | 3.92 × (2.67–4.52) **Element Plus** |
| Main thread: all tasks (lower is better) | 299 ms (±14.8) | 343 ms (±22.3) | 27.7 ms (±3.97) | 902 ms (±35.5) | 397 ms (±16.5) | 1.33 × (1.21–1.44) **TanStack** | 1.16 × (1.03–1.26) **AG Grid** | 14.3 × (11.7–16.4) **PrimeVue** | 0.44 × (0.41–0.48) **Infinite** |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 2.82 % (±0.56) | 1.54 % (±1.29) | 0.00 % (±0.00) | 2.63 % (±0.77) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 14.1 % (±2.82) | 7.69 % (±6.46) | 0.00 % (±0.00) | 13.2 % (±3.84) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
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
| Captured frames with blank rows (lower is better) | 5.71 % (±3.73) | 12.5 % (±3.28) | 94.6 % (±0.04) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 1.00 % (±0.70) | 5.48 % (±1.43) | 90.2 % (±0.52) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 6.00 rows (±6.47) | 18.0 rows (±0.00) | 18.0 rows (±0.00) | 0.00 rows (±0.00) | 0.00 rows (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Captured frames (higher is better) | 70.0 (±2.68) | 56.0 (±1.52) | 74.0 (±0.55) | 65.0 (±2.07) | 74.0 (±1.14) | 1.06 × (1.03–1.16) **Infinite** | 1.32 × (1.28–1.37) **Infinite** | 1.00 × (0.97–1.01) ≈ | 1.14 × (1.09–1.19) **Infinite** |

## updates-low - 1,000,000 rows

Live updates, low frequency. The grid shows the rows in the order of the data. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 454 ms (±7.89) | 128 ms (±3.78) | 657 ms (±10.2) | 21.4 ms (±1.51) | 322 ms (±3.04) | 0.71 × (0.69–0.72) **Infinite** | 2.51 × (2.48–2.66) **AG Grid** | 0.49 × (0.48–0.51) **Infinite** | 15.1 × (13.4–16.1) **Element Plus** |
| Update to rows painted (worst update) (lower is better) | 639 ms (±4.04) | 140 ms (±4.17) | 805 ms (±13.8) | 37.9 ms (±19.8) | 392 ms (±14.6) | 0.61 × (0.61–0.66) **Infinite** | 2.80 × (2.71–3.07) **AG Grid** | 0.49 × (0.47–0.53) **Infinite** | 10.4 × (5.07–13.9) **Element Plus** |
| Update to settled (median of updates) (lower is better) | 454 ms (±7.89) | 128 ms (±3.78) | 657 ms (±10.2) | 21.4 ms (±1.51) | 322 ms (±3.04) | 0.71 × (0.69–0.72) **Infinite** | 2.51 × (2.48–2.66) **AG Grid** | 0.49 × (0.48–0.51) **Infinite** | 15.1 × (13.4–16.1) **Element Plus** |
| Main thread: layout (all updates) (lower is better) | 3.89 ms (±0.17) | 2.37 ms (±0.26) | 8.19 ms (±0.69) | 6.25 ms (±2.23) | 2.12 ms (±0.09) | 0.54 × (0.51–0.59) **Infinite** | 0.89 × (0.75–0.97) **Infinite** | 0.26 × (0.22–0.28) **Infinite** | 0.34 × (0.19–0.37) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 0.00 ms (±0.00) | 1.34 ms (±0.08) | 0.00 ms (±0.00) | 1.10 ms (±2.00) | 17.0 ms (±0.53) | +17.0 (+16.3 to +17.6) **TanStack** | 12.7 × (11.5–13.5) **AG Grid** | +17.0 (+16.3 to +17.6) **PrimeVue** | 15.4 × (3.56–17.9) **Element Plus** |
| Main thread: all tasks (all updates) (lower is better) | 2476 ms (±33.3) | 652 ms (±16.0) | 3410 ms (±43.7) | 208 ms (±10.5) | 1702 ms (±20.7) | 0.69 × (0.67–0.70) **Infinite** | 2.61 × (2.55–2.73) **AG Grid** | 0.50 × (0.49–0.50) **Infinite** | 8.17 × (7.69–8.66) **Element Plus** |

## updates-low-sorted - 1,000,000 rows

Live updates, low frequency. The grid shows sorted by salary, highest first - the updates change the salaries, so rows move. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 3532 ms (±168) | 4772 ms (±246) | 7958 ms (±288) | 622 ms (±31.9) | 496 ms (±13.6) | 0.14 × (0.13–0.15) **Infinite** | 0.10 × (0.10–0.11) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.80 × (0.75–0.87) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 3684 ms (±60.8) | 4919 ms (±181) | 8107 ms (±333) | 647 ms (±47.1) | 602 ms (±31.2) | 0.16 × (0.15–0.17) **Infinite** | 0.12 × (0.11–0.13) **Infinite** | 0.07 × (0.07–0.08) **Infinite** | 0.93 × (0.85–1.04) ≈ |
| Update to settled (median of updates) (lower is better) | 3532 ms (±168) | 4772 ms (±246) | 7958 ms (±288) | 622 ms (±31.9) | 496 ms (±13.6) | 0.14 × (0.13–0.15) **Infinite** | 0.10 × (0.10–0.11) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.80 × (0.75–0.87) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 6.95 ms (±11.7) | 15.7 ms (±0.57) | 14.5 ms (±0.88) | 11.1 ms (±0.51) | 8.31 ms (±0.32) | 1.20 × (0.30–1.42) ≈ | 0.53 × (0.50–0.56) **Infinite** | 0.57 × (0.51–0.61) **Infinite** | 0.75 × (0.72–0.84) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 5.22 ms (±7.48) | 0.16 ms (±0.01) | 16.4 ms (±1.35) | 7.67 ms (±0.37) | 18.8 ms (±0.60) | 3.60 × (0.92–4.87) ≈ | 121 × (112–134) **AG Grid** | 1.14 × (0.97–1.18) ≈ | 2.45 × (2.24–2.52) **Element Plus** |
| Main thread: all tasks (all updates) (lower is better) | 19052 ms (±1329) | 24173 ms (±1230) | 39847 ms (±1520) | 3347 ms (±160) | 2616 ms (±70.5) | 0.14 × (0.13–0.16) **Infinite** | 0.11 × (0.10–0.12) **Infinite** | 0.07 × (0.06–0.07) **Infinite** | 0.78 × (0.72–0.84) **Infinite** |

## updates-low-filtered - 1,000,000 rows

Live updates, low frequency. The grid shows filtered to a salary of at least 115,000 (about half of the rows) - the updates change the salaries, so rows go in and out of the filter. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 1354 ms (±8.67) | 266 ms (±9.49) | 554 ms (±11.3) | 45.4 ms (±2.17) | 262 ms (±7.16) | 0.19 × (0.19–0.20) **Infinite** | 0.99 × (0.96–1.06) ≈ | 0.47 × (0.46–0.50) **Infinite** | 5.78 × (5.66–6.41) **Element Plus** |
| Update to rows painted (worst update) (lower is better) | 1468 ms (±13.5) | 278 ms (±15.7) | 671 ms (±12.0) | 53.1 ms (±2.91) | 337 ms (±18.9) | 0.23 × (0.22–0.25) **Infinite** | 1.21 × (1.14–1.34) **AG Grid** | 0.50 × (0.48–0.56) **Infinite** | 6.35 × (5.67–7.02) **Element Plus** |
| Update to settled (median of updates) (lower is better) | 1354 ms (±8.67) | 266 ms (±9.49) | 554 ms (±11.3) | 45.4 ms (±2.17) | 262 ms (±7.16) | 0.19 × (0.19–0.20) **Infinite** | 0.99 × (0.96–1.06) ≈ | 0.47 × (0.46–0.50) **Infinite** | 5.78 × (5.66–6.41) **Element Plus** |
| Main thread: layout (all updates) (lower is better) | 4.38 ms (±0.04) | 4.90 ms (±0.10) | 9.35 ms (±0.13) | 5.60 ms (±0.47) | 3.90 ms (±0.05) | 0.89 × (0.88–0.91) **Infinite** | 0.80 × (0.77–0.82) **Infinite** | 0.42 × (0.41–0.43) **Infinite** | 0.70 × (0.66–0.82) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 1.28 ms (±0.07) | 0.62 ms (±0.04) | 6.82 ms (±0.35) | 1.32 ms (±0.16) | 16.4 ms (±0.38) | 12.8 × (11.9–13.7) **TanStack** | 26.7 × (24.4–29.2) **AG Grid** | 2.41 × (2.18–2.49) **PrimeVue** | 12.5 × (10.9–15.3) **Element Plus** |
| Main thread: all tasks (all updates) (lower is better) | 6065 ms (±46.0) | 1602 ms (±56.9) | 2884 ms (±52.5) | 326 ms (±10.4) | 1372 ms (±36.2) | 0.23 × (0.22–0.24) **Infinite** | 0.86 × (0.84–0.93) **Infinite** | 0.48 × (0.46–0.50) **Infinite** | 4.21 × (4.14–4.62) **Element Plus** |

## updates-low-grouped - 1,000,000 rows

Live updates, low frequency. The grid shows grouped by department (10 collapsed groups), with the sum of the salaries of each group - the updates change the salaries, so the sums change. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | Infinite median (sd) | Infinite vs TanStack |
|---|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 1452 ms (±34.4) | 741 ms (±11.4) | 0.51 × (0.49–0.52) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 1811 ms (±11.5) | 903 ms (±8.48) | 0.50 × (0.49–0.51) **Infinite** |
| Update to settled (median of updates) (lower is better) | 1452 ms (±34.4) | 741 ms (±11.4) | 0.51 × (0.49–0.52) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 1.97 ms (±0.22) | 1.22 ms (±0.06) | 0.62 × (0.53–0.68) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 0.00 ms (±0.00) | 10.3 ms (±0.56) | +10.3 (+9.36 to +10.8) **TanStack** |
| Main thread: all tasks (all updates) (lower is better) | 7886 ms (±32.4) | 3862 ms (±34.4) | 0.49 × (0.48–0.50) **Infinite** |

## updates-high - 1,000,000 rows

Live updates, high frequency. The grid shows the rows in the order of the data. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 578 ms (±98.6) | 133 ms (±25.8) | 713 ms (±268) | 24.3 ms (±0.50) | 475 ms (±45.9) | 0.82 × (0.67–1.24) ≈ | 3.58 × (2.90–5.25) **AG Grid** | 0.67 × (0.37–0.72) **Infinite** | 19.5 × (15.8–20.7) **Element Plus** |
| Update delay, p95 (lower is better) | 521 ms (±10.0) | 96.0 ms (±6.11) | 638 ms (±12.9) | 14.1 ms (±1.11) | 312 ms (±7.42) | 0.60 × (0.58–0.62) **Infinite** | 3.25 × (2.94–3.47) **AG Grid** | 0.49 × (0.47–0.51) **Infinite** | 22.1 × (19.0–23.0) **Element Plus** |
| Frames committed per second (higher is better) | 1.97 fps (±0.04) | 10.9 fps (±0.29) | 1.29 fps (±0.04) | 58.4 fps (±0.40) | 3.14 fps (±0.03) | 1.59 × (1.52–1.62) **Infinite** | 0.29 × (0.28–0.30) **AG Grid** | 2.43 × (2.31–2.48) **Infinite** | 0.05 × (0.05–0.05) **Element Plus** |
| Gap between frames, p95 (lower is better) | 881 ms (±11.4) | 149 ms (±10.9) | 1243 ms (±47.0) | 26.9 ms (±0.40) | 405 ms (±12.2) | 0.46 × (0.44–0.48) **Infinite** | 2.72 × (2.53–3.03) **AG Grid** | 0.33 × (0.31–0.35) **Infinite** | 15.1 × (14.4–15.6) **Element Plus** |
| Longest gap between frames (lower is better) | 1046 ms (±13.5) | 214 ms (±12.9) | 1438 ms (±32.2) | 78.2 ms (±31.4) | 456 ms (±28.4) | 0.44 × (0.39–0.46) **Infinite** | 2.13 × (1.91–2.27) **AG Grid** | 0.32 × (0.28–0.34) **Infinite** | 5.82 × (3.24–7.13) **Element Plus** |
| Long tasks: total blocking time (lower is better) | 4057 ms (±98.6) | 1821 ms (±56.5) | 4342 ms (±241) | 19.6 ms (±36.0) | 3673 ms (±45.8) | 0.91 × (0.88–0.95) **Infinite** | 2.02 × (1.92–2.08) **AG Grid** | 0.85 × (0.76–0.86) **Infinite** | +3653 (+3561 to +3687) **Element Plus** |
| Main thread: layout (lower is better) | 6.30 ms (±0.08) | 22.6 ms (±1.72) | 8.93 ms (±0.34) | 137 ms (±1.84) | 5.52 ms (±0.08) | 0.88 × (0.87–0.91) **Infinite** | 0.24 × (0.22–0.26) **Infinite** | 0.62 × (0.58–0.63) **Infinite** | 0.04 × (0.04–0.04) **Infinite** |
| Main thread: style recalc (lower is better) | 0.00 ms (±0.00) | 11.3 ms (±0.24) | 0.00 ms (±0.00) | 19.8 ms (±0.25) | 41.6 ms (±0.39) | +41.6 (+41.4 to +42.3) **TanStack** | 3.68 × (3.63–3.83) **AG Grid** | +41.6 (+41.4 to +42.3) **PrimeVue** | 2.10 × (2.09–2.16) **Element Plus** |
| Main thread: all tasks (lower is better) | 4559 ms (±98.8) | 4116 ms (±26.6) | 4694 ms (±276) | 2268 ms (±22.9) | 4460 ms (±47.4) | 0.98 × (0.96–1.02) ≈ | 1.08 × (1.06–1.10) **AG Grid** | 0.95 × (0.85–0.96) **Infinite** | 1.97 × (1.92–1.98) **Element Plus** |

## updates-high-sorted - 1,000,000 rows

Live updates, high frequency. The grid shows sorted by salary, highest first - the updates change the salaries, so rows move. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 5693 ms (±1212) | 5584 ms (±1162) | 12257 ms (±492) | 1190 ms (±296) | 769 ms (±112) | 0.14 × (0.10–0.20) **Infinite** | 0.14 × (0.10–0.16) **Infinite** | 0.06 × (0.05–0.07) **Infinite** | 0.65 × (0.51–1.29) ≈ |
| Update delay, p95 (lower is better) | 3395 ms (±374) | 4375 ms (±288) | 7906 ms (±213) | 618 ms (±53.3) | 530 ms (±13.0) | 0.16 × (0.13–0.18) **Infinite** | 0.12 × (0.12–0.14) **Infinite** | 0.07 × (0.07–0.07) **Infinite** | 0.86 × (0.77–0.98) **Infinite** |
| Frames committed per second (higher is better) | 0.19 fps (±0.03) | 0.11 fps (±0.03) | 0.06 fps (±0.00) | 1.35 fps (±0.09) | 1.89 fps (±0.05) | 9.84 × (8.83–14.9) **Infinite** | 17.8 × (11.2–18.5) **Infinite** | 30.8 × (28.8–31.9) **Infinite** | 1.40 × (1.24–1.46) **Infinite** |
| Gap between frames, p95 (lower is better) | 6740 ms (±693) | 9396 ms (±827) | 16237 ms (±492) | 1156 ms (±69.0) | 653 ms (±12.3) | 0.10 × (0.08–0.11) **Infinite** | 0.07 × (0.07–0.09) **Infinite** | 0.04 × (0.04–0.04) **Infinite** | 0.56 × (0.53–0.63) **Infinite** |
| Longest gap between frames (lower is better) | 6911 ms (±637) | 9396 ms (±749) | 16237 ms (±492) | 1385 ms (±70.0) | 686 ms (±20.8) | 0.10 × (0.09–0.11) **Infinite** | 0.07 × (0.07–0.09) **Infinite** | 0.04 × (0.04–0.05) **Infinite** | 0.49 × (0.48–0.55) **Infinite** |
| Long tasks: total blocking time (lower is better) | 9523 ms (±1194) | 9464 ms (±1140) | 16137 ms (±492) | 4770 ms (±295) | 4217 ms (±111) | 0.44 × (0.39–0.54) **Infinite** | 0.45 × (0.36–0.48) **Infinite** | 0.26 × (0.25–0.28) **Infinite** | 0.88 × (0.85–1.01) ≈ |
| Main thread: layout (lower is better) | 3.60 ms (±0.71) | 6.57 ms (±1.69) | 6.61 ms (±0.07) | 17.8 ms (±0.40) | 14.3 ms (±0.23) | 3.97 × (3.43–6.08) **TanStack** | 2.17 × (1.40–2.33) **AG Grid** | 2.16 × (2.12–2.24) **PrimeVue** | 0.80 × (0.79–0.84) **Infinite** |
| Main thread: style recalc (lower is better) | 2.00 ms (±0.42) | 0.03 ms (±0.01) | 4.40 ms (±2.32) | 12.0 ms (±0.48) | 31.3 ms (±0.69) | 15.7 × (12.3–22.2) **TanStack** | 978 × (579–1159) **AG Grid** | 7.11 × (3.30–7.87) **PrimeVue** | 2.61 × (2.42–2.70) **Element Plus** |
| Main thread: all tasks (lower is better) | 10112 ms (±1339) | 9567 ms (±1161) | 16258 ms (±410) | 5318 ms (±261) | 4751 ms (±112) | 0.47 × (0.41–0.61) **Infinite** | 0.50 × (0.40–0.54) **Infinite** | 0.29 × (0.28–0.31) **Infinite** | 0.89 × (0.86–1.00) **Infinite** |

## updates-high-filtered - 1,000,000 rows

Live updates, high frequency. The grid shows filtered to a salary of at least 115,000 (about half of the rows) - the updates change the salaries, so rows go in and out of the filter. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 2332 ms (±20.7) | 295 ms (±20.5) | 640 ms (±33.7) | 58.9 ms (±9.33) | 430 ms (±33.8) | 0.18 × (0.17–0.20) **Infinite** | 1.46 × (1.27–1.65) **AG Grid** | 0.67 × (0.59–0.73) **Infinite** | 7.29 × (6.35–10.5) **Element Plus** |
| Update delay, p95 (lower is better) | 1351 ms (±10.3) | 280 ms (±6.06) | 548 ms (±6.51) | 38.2 ms (±1.28) | 268 ms (±2.36) | 0.20 × (0.20–0.20) **Infinite** | 0.96 × (0.92–0.97) **Infinite** | 0.49 × (0.47–0.49) **Infinite** | 7.00 × (6.78–7.43) **Element Plus** |
| Frames committed per second (higher is better) | 0.63 fps (±0.00) | 3.27 fps (±0.02) | 1.52 fps (±0.01) | 25.5 fps (±0.20) | 3.63 fps (±0.03) | 5.73 × (5.67–5.79) **Infinite** | 1.11 × (1.10–1.12) **Infinite** | 2.39 × (2.37–2.43) **Infinite** | 0.14 × (0.14–0.14) **Element Plus** |
| Gap between frames, p95 (lower is better) | 2259 ms (±14.9) | 505 ms (±4.80) | 1054 ms (±12.1) | 44.1 ms (±1.20) | 352 ms (±2.24) | 0.16 × (0.15–0.16) **Infinite** | 0.70 × (0.68–0.70) **Infinite** | 0.33 × (0.33–0.34) **Infinite** | 7.98 × (7.62–8.20) **Element Plus** |
| Longest gap between frames (lower is better) | 2386 ms (±16.2) | 555 ms (±7.40) | 1257 ms (±17.3) | 101 ms (±1.83) | 392 ms (±21.5) | 0.16 × (0.15–0.17) **Infinite** | 0.71 × (0.64–0.72) **Infinite** | 0.31 × (0.28–0.32) **Infinite** | 3.90 × (3.53–4.06) **Element Plus** |
| Long tasks: total blocking time (lower is better) | 6062 ms (±20.7) | 3522 ms (±20.6) | 4219 ms (±33.7) | 37.2 ms (±3.44) | 3505 ms (±32.5) | 0.58 × (0.57–0.58) **Infinite** | 1.00 × (0.98–1.01) ≈ | 0.83 × (0.82–0.84) **Infinite** | 94.1 × (91.7–117) **Element Plus** |
| Main thread: layout (lower is better) | 3.17 ms (±0.17) | 12.2 ms (±0.36) | 15.3 ms (±0.22) | 81.3 ms (±0.95) | 10.9 ms (±0.10) | 3.43 × (3.21–3.63) **TanStack** | 0.89 × (0.86–0.93) **Infinite** | 0.71 × (0.70–0.73) **Infinite** | 0.13 × (0.13–0.14) **Infinite** |
| Main thread: style recalc (lower is better) | 1.02 ms (±0.03) | 1.97 ms (±0.18) | 9.74 ms (±0.40) | 13.0 ms (±0.23) | 48.9 ms (±0.53) | 48.1 × (45.4–49.7) **TanStack** | 24.9 × (22.5–28.5) **AG Grid** | 5.02 × (4.98–5.52) **PrimeVue** | 3.76 × (3.66–3.85) **Element Plus** |
| Main thread: all tasks (lower is better) | 6313 ms (±20.8) | 4279 ms (±20.7) | 4621 ms (±33.7) | 4030 ms (±9.23) | 4411 ms (±34.7) | 0.70 × (0.69–0.70) **Infinite** | 1.03 × (1.02–1.04) **AG Grid** | 0.95 × (0.94–0.96) **Infinite** | 1.09 × (1.08–1.10) **Element Plus** |

## updates-high-grouped - 1,000,000 rows

Live updates, high frequency. The grid shows grouped by department (10 collapsed groups), with the sum of the salaries of each group - the updates change the salaries, so the sums change. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | Infinite median (sd) | Infinite vs TanStack |
|---|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 3260 ms (±83.1) | 1110 ms (±18.6) | 0.34 × (0.33–0.35) **Infinite** |
| Update delay, p95 (lower is better) | 1761 ms (±29.8) | 777 ms (±8.20) | 0.44 × (0.43–0.45) **Infinite** |
| Frames committed per second (higher is better) | 0.41 fps (±0.00) | 1.18 fps (±0.00) | 2.84 × (2.81–2.89) **Infinite** |
| Gap between frames, p95 (lower is better) | 3482 ms (±49.6) | 984 ms (±11.7) | 0.28 × (0.27–0.29) **Infinite** |
| Longest gap between frames (lower is better) | 3674 ms (±54.4) | 999 ms (±18.0) | 0.27 × (0.26–0.28) **Infinite** |
| Long tasks: total blocking time (lower is better) | 7040 ms (±83.1) | 4760 ms (±18.7) | 0.68 × (0.66–0.69) **Infinite** |
| Main thread: layout (lower is better) | 1.17 ms (±0.06) | 1.45 ms (±0.02) | 1.24 × (1.15–1.32) **TanStack** |
| Main thread: style recalc (lower is better) | 0.00 ms (±0.00) | 11.4 ms (±1.84) | +11.4 (+11.1 to +15.5) **TanStack** |
| Main thread: all tasks (lower is better) | 7242 ms (±83.1) | 5102 ms (±19.7) | 0.70 × (0.69–0.71) **Infinite** |
