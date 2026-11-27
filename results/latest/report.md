# TanStack Table vs AG Grid vs PrimeVue DataTable vs Element Plus Table V2 vs Infinite Table — benchmark report

- Run: `ci` · 2026-11-27T21:30:46.738Z
- TanStack Table 9.3.1 · AG Grid 36.3.0 · PrimeVue DataTable 4.5.5 · Element Plus Table V2 2.14.9 · Infinite Table 11.0.1
- 1,000,000 rows (data checksum `1000000:19e5eebe`) × 20 columns, identical data for every grid
- Chrome 136.0.7103.25 · headless · CPU throttling 1× · viewport 1400×1000
- 5 measured runs per grid per scenario (+1 warmup, discarded), interleaved, fresh browser context per run
- Linux 7.0.0-1020-azure x64 · AMD EPYC 9V45 96-Core Processor × 4
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
| Time to first rows painted (lower is better) | 537 ms (±25.2) | 2266 ms (±25.8) | 782 ms (±19.7) | 44.7 ms (±4.98) | 502 ms (±55.8) | 0.93 × (0.86–1.13) ≈ | 0.22 × (0.21–0.27) **Infinite** | 0.64 × (0.60–0.78) **Infinite** | 11.2 × (9.15–13.6) **Element Plus** |
| Time until settled (lower is better) | 537 ms (±25.2) | 2370 ms (±25.8) | 782 ms (±19.7) | 44.7 ms (±4.98) | 513 ms (±56.5) | 0.96 × (0.88–1.16) ≈ | 0.22 × (0.20–0.26) **Infinite** | 0.66 × (0.61–0.79) **Infinite** | 11.5 × (9.36–13.9) **Element Plus** |
| Main thread: layout (lower is better) | 3.81 ms (±0.10) | 7.17 ms (±0.57) | 14.0 ms (±1.78) | 4.44 ms (±0.08) | 3.70 ms (±0.15) | 0.97 × (0.94–1.05) ≈ | 0.52 × (0.44–0.56) **Infinite** | 0.26 × (0.26–0.37) **Infinite** | 0.83 × (0.81–0.90) **Infinite** |
| Main thread: style recalc (lower is better) | 1.69 ms (±0.12) | 11.2 ms (±0.40) | 11.1 ms (±2.17) | 3.00 ms (±0.12) | 6.47 ms (±0.33) | 3.83 × (3.65–4.46) **TanStack** | 0.58 × (0.54–0.63) **Infinite** | 0.58 × (0.51–0.94) **Infinite** | 2.16 × (2.07–2.40) **Element Plus** |
| Main thread: all tasks (lower is better) | 540 ms (±25.6) | 2279 ms (±29.4) | 825 ms (±29.2) | 47.3 ms (±5.86) | 535 ms (±57.9) | 0.99 × (0.90–1.19) ≈ | 0.23 × (0.22–0.28) **Infinite** | 0.65 × (0.58–0.78) **Infinite** | 11.3 × (8.92–13.6) **Element Plus** |
| JS heap retained by grid (lower is better) | 287 MB (±0.00) | 670 MB (±0.01) | 21.6 MB (±0.01) | 2.77 MB (±0.00) | 90.8 MB (±0.00) | 0.32 × (0.32–0.32) **Infinite** | 0.14 × (0.14–0.14) **Infinite** | 4.20 × (4.20–4.20) **PrimeVue** | 32.8 × (32.8–32.8) **Element Plus** |
| DOM elements in grid (lower is better) | 352 (±0.00) | 637 (±0.00) | 1028 (±0.00) | 992 (±0.00) | 608 (±0.00) | 1.73 × (1.73–1.73) **TanStack** | 0.95 × (0.95–0.95) **Infinite** | 0.59 × (0.59–0.59) **Infinite** | 0.61 × (0.61–0.61) **Infinite** |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 3617 ms (±475) | 3771 ms (±297) | 8898 ms (±500) | 904 ms (±103) | 1391 ms (±122) | 0.38 × (0.31–0.47) **Infinite** | 0.37 × (0.34–0.47) **Infinite** | 0.16 × (0.14–0.18) **Infinite** | 1.54 × (1.30–1.90) **Element Plus** |
| Ascending: click to settled (lower is better) | 3617 ms (±475) | 3771 ms (±297) | 8898 ms (±500) | 904 ms (±103) | 1394 ms (±122) | 0.39 × (0.32–0.47) **Infinite** | 0.37 × (0.34–0.47) **Infinite** | 0.16 × (0.14–0.18) **Infinite** | 1.54 × (1.30–1.90) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 3541 ms (±450) | 3547 ms (±255) | 8540 ms (±550) | 894 ms (±62.7) | 1524 ms (±156) | 0.43 × (0.34–0.50) **Infinite** | 0.43 × (0.37–0.49) **Infinite** | 0.18 × (0.16–0.21) **Infinite** | 1.70 × (1.51–2.02) **Element Plus** |
| Descending: click to settled (lower is better) | 3541 ms (±450) | 3547 ms (±255) | 8540 ms (±550) | 894 ms (±62.7) | 1524 ms (±156) | 0.43 × (0.34–0.50) **Infinite** | 0.43 × (0.37–0.49) **Infinite** | 0.18 × (0.16–0.21) **Infinite** | 1.70 × (1.51–2.02) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 3618 ms (±475) | 3776 ms (±298) | 8916 ms (±500) | 977 ms (±158) | 1417 ms (±124) | 0.39 × (0.32–0.48) **Infinite** | 0.38 × (0.35–0.47) **Infinite** | 0.16 × (0.15–0.19) **Infinite** | 1.45 × (1.18–1.78) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 3542 ms (±450) | 3550 ms (±256) | 8557 ms (±550) | 984 ms (±96.9) | 1519 ms (±156) | 0.43 × (0.34–0.50) **Infinite** | 0.43 × (0.37–0.49) **Infinite** | 0.18 × (0.16–0.21) **Infinite** | 1.54 × (1.35–1.91) **Element Plus** |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 3464 ms (±222) | 4309 ms (±203) | 8094 ms (±522) | 651 ms (±24.8) | 522 ms (±17.3) | 0.15 × (0.14–0.16) **Infinite** | 0.12 × (0.11–0.13) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.80 × (0.76–0.85) **Infinite** |
| Ascending: click to settled (lower is better) | 3464 ms (±222) | 4309 ms (±203) | 8094 ms (±522) | 651 ms (±24.8) | 525 ms (±17.3) | 0.15 × (0.14–0.16) **Infinite** | 0.12 × (0.11–0.13) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.81 × (0.76–0.86) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 3340 ms (±215) | 4187 ms (±299) | 7705 ms (±386) | 678 ms (±25.7) | 593 ms (±50.2) | 0.18 × (0.15–0.19) **Infinite** | 0.14 × (0.11–0.15) **Infinite** | 0.08 × (0.06–0.08) **Infinite** | 0.87 × (0.72–0.90) **Infinite** |
| Descending: click to settled (lower is better) | 3340 ms (±215) | 4187 ms (±299) | 7705 ms (±386) | 678 ms (±25.7) | 593 ms (±50.2) | 0.18 × (0.15–0.19) **Infinite** | 0.14 × (0.11–0.15) **Infinite** | 0.08 × (0.06–0.08) **Infinite** | 0.87 × (0.72–0.90) **Infinite** |
| Ascending: main thread, all tasks (lower is better) | 3616 ms (±389) | 4315 ms (±203) | 8121 ms (±521) | 736 ms (±63.4) | 550 ms (±18.7) | 0.15 × (0.13–0.17) **Infinite** | 0.13 × (0.12–0.14) **Infinite** | 0.07 × (0.06–0.08) **Infinite** | 0.75 × (0.65–0.79) **Infinite** |
| Descending: main thread, all tasks (lower is better) | 3341 ms (±214) | 4190 ms (±299) | 7764 ms (±381) | 784 ms (±67.3) | 591 ms (±51.5) | 0.18 × (0.15–0.19) **Infinite** | 0.14 × (0.11–0.15) **Infinite** | 0.08 × (0.06–0.08) **Infinite** | 0.75 × (0.62–0.80) **Infinite** |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 13.0 ms (±0.34) | 26.0 ms (±0.47) | 233 ms (±5.76) | 32.7 ms (±1.59) | 29.9 ms (±1.22) | 2.29 × (2.14–2.39) **TanStack** | 1.15 × (1.07–1.20) **AG Grid** | 0.13 × (0.12–0.13) **Infinite** | 0.91 × (0.84–0.97) **Infinite** |
| Jump to rows painted (worst jump) (lower is better) | 34.5 ms (±6.75) | 58.2 ms (±2.32) | 353 ms (±14.1) | 51.5 ms (±2.61) | 53.3 ms (±8.84) | 1.55 × (1.09–2.02) **TanStack** | 0.92 × (0.83–1.17) ≈ | 0.15 × (0.14–0.20) **Infinite** | 1.03 × (0.95–1.33) ≈ |
| Jump to settled (median of jumps) (lower is better) | 13.0 ms (±0.34) | 26.0 ms (±0.47) | 233 ms (±5.76) | 32.7 ms (±1.59) | 29.9 ms (±1.22) | 2.29 × (2.14–2.39) **TanStack** | 1.15 × (1.07–1.20) **AG Grid** | 0.13 × (0.12–0.13) **Infinite** | 0.91 × (0.84–0.97) **Infinite** |
| Main thread, all tasks (all jumps) (lower is better) | 182 ms (±6.53) | 299 ms (±10.5) | 2665 ms (±53.0) | 433 ms (±17.1) | 430 ms (±13.0) | 2.36 × (2.24–2.48) **TanStack** | 1.44 × (1.34–1.48) **AG Grid** | 0.16 × (0.15–0.17) **Infinite** | 0.99 × (0.94–1.05) ≈ |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 93.4 % (±19.1) | 50.6 % (±6.54) | 15.3 % (±0.61) | 50.0 % (±0.08) | 83.0 % (±1.20) | 0.89 × (0.83–1.34) ≈ | 1.64 × (1.27–1.69) **Infinite** | 5.42 × (5.37–5.93) **Infinite** | 1.66 × (1.66–1.71) **Infinite** |
| Frames presented without main-thread update (lower is better) | 6.12 % (±19.1) | 48.5 % (±6.85) | 80.7 % (±1.03) | 49.5 % (±0.08) | 16.4 % (±1.24) | +10.3 (-21.5 to +17.0) ≈ | 0.34 × (0.30–0.49) **Infinite** | 0.20 × (0.18–0.22) **Infinite** | 0.33 × (0.29–0.35) **Infinite** |
| Frames dropped (lower is better) | 0.55 % (±0.12) | 1.13 % (±0.42) | 5.26 % (±1.14) | 0.55 % (±0.15) | 0.00 % (±0.32) | 0.00 × (0.00–1.15) ≈ | 0.00 × (0.00–0.70) **Infinite** | 0.00 × (0.00–0.15) **Infinite** | 0.00 × (0.00–1.07) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.14) | 59.0 fps (±0.37) | 6.70 fps (±0.35) | 59.7 fps (±0.18) | 52.6 fps (±1.78) | 0.88 × (0.87–0.94) **TanStack** | 0.89 × (0.88–0.96) **AG Grid** | 7.85 × (7.47–8.63) **Infinite** | 0.88 × (0.88–0.95) **Element Plus** |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.8 ms (±0.04) | 266 ms (±30.7) | 16.8 ms (±0.04) | 33.3 ms (±7.38) | 1.99 × (1.01–1.99) **TanStack** | 1.98 × (1.00–1.99) **AG Grid** | 0.13 × (0.06–0.13) **Infinite** | 1.98 × (1.00–1.99) **Element Plus** |
| Worst rAF frame interval (lower is better) | 16.8 ms (±7.38) | 50.0 ms (±9.12) | 283 ms (±36.1) | 33.4 ms (±0.05) | 117 ms (±14.8) | 6.95 × (3.50–6.95) **TanStack** | 2.33 × (1.67–3.50) **AG Grid** | 0.41 × (0.29–0.44) **Infinite** | 3.49 × (2.50–3.50) **Element Plus** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.24) | 1.09 % (±0.55) | 60.0 % (±3.07) | 0.54 % (±0.30) | 8.59 % (±2.47) | +8.59 (+3.43 to +9.26) **TanStack** | 7.86 × (3.14–17.0) **AG Grid** | 0.14 × (0.06–0.16) **Infinite** | 16.0 × (6.38–17.2) **Element Plus** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.79 ms (±1.49) | 2228 ms (±62.2) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | -0.79 (-3.61 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 83.6 ms (±6.66) | 366 ms (±15.8) | 109 ms (±6.26) | 112 ms (±7.53) | 76.6 ms (±5.53) | 0.92 × (0.82–1.07) ≈ | 0.21 × (0.19–0.23) **Infinite** | 0.70 × (0.64–0.81) **Infinite** | 0.68 × (0.58–0.75) **Infinite** |
| Main thread: style recalc (lower is better) | 41.3 ms (±2.40) | 132 ms (±7.90) | 73.8 ms (±2.81) | 108 ms (±9.81) | 213 ms (±13.1) | 5.16 × (4.80–5.78) **TanStack** | 1.62 × (1.51–1.83) **AG Grid** | 2.89 × (2.68–3.17) **PrimeVue** | 1.98 × (1.76–2.22) **Element Plus** |
| Main thread: all tasks (lower is better) | 894 ms (±49.6) | 1621 ms (±72.6) | 3071 ms (±42.8) | 2051 ms (±125) | 1609 ms (±116) | 1.80 × (1.67–2.06) **TanStack** | 0.99 × (0.93–1.12) ≈ | 0.52 × (0.49–0.58) **Infinite** | 0.78 × (0.68–0.87) **Infinite** |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 100 % (±5.80) | 100 % (±4.54) | 96.7 % (±0.00) | 80.3 % (±0.06) | 95.8 % (±2.96) | 0.96 × (0.90–1.10) ≈ | 0.96 × (0.90–1.06) ≈ | 0.99 × (0.93–1.00) **PrimeVue** | 1.19 × (1.12–1.20) **Infinite** |
| Frames presented without main-thread update (lower is better) | 0.00 % (±5.46) | 0.00 % (±4.11) | 3.28 % (±0.00) | 19.0 % (±0.06) | 4.20 % (±2.86) | +4.20 (-8.02 to +10.5) ≈ | +4.20 (-4.82 to +10.5) ≈ | 1.28 × (1.07–3.20) **PrimeVue** | 0.22 × (0.18–0.55) **Infinite** |
| Frames dropped (lower is better) | 0.00 % (±0.34) | 0.00 % (±0.46) | 0.00 % (±0.00) | 0.68 % (±0.00) | 0.00 % (±0.60) | 0.00 (-0.76 to +1.34) ≈ | 0.00 (-0.85 to +1.34) ≈ | 0.00 (0.00 to +1.34) ≈ | 0.00 × (0.00–1.97) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.8 ms (±0.04) | 16.8 ms (±0.05) | 16.7 ms (±0.04) | 16.8 ms (±0.05) | 16.7 ms (±0.00) | 0.99 × (0.99–1.00) ≈ | 0.99 × (0.99–1.00) **Infinite** | 1.00 × (0.99–1.00) ≈ | 1.00 × (0.99–1.00) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 51.8 ms (±4.80) | 70.3 ms (±4.88) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 23.8 ms (±1.64) | 0.46 × (0.40–0.58) **Infinite** | 0.34 × (0.29–0.36) **Infinite** | +23.8 (+20.5 to +24.5) **PrimeVue** | +23.8 (+20.5 to +24.5) **Element Plus** |
| Main thread: style recalc (lower is better) | 15.2 ms (±2.24) | 34.9 ms (±2.85) | 0.00 ms (±0.00) | 11.0 ms (±1.54) | 29.4 ms (±2.14) | 1.93 × (1.55–2.32) **TanStack** | 0.84 × (0.72–0.88) **Infinite** | +29.4 (+25.3 to +30.4) **PrimeVue** | 2.68 × (2.21–3.14) **Element Plus** |
| Main thread: all tasks (lower is better) | 381 ms (±33.9) | 437 ms (±37.8) | 36.1 ms (±6.77) | 981 ms (±47.7) | 444 ms (±24.8) | 1.17 × (1.02–1.40) **TanStack** | 1.02 × (0.87–1.05) ≈ | 12.3 × (10.5–16.7) **PrimeVue** | 0.45 × (0.40–0.48) **Infinite** |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 2.53 % (±0.94) | 2.70 % (±0.61) | 0.00 % (±0.00) | 2.08 % (±0.54) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 12.7 % (±4.69) | 13.5 % (±3.06) | 0.00 % (±0.00) | 10.4 % (±2.70) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
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
| Captured frames with blank rows (lower is better) | 10.0 % (±2.33) | 18.5 % (±2.78) | 94.7 % (±0.59) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 2.33 % (±0.96) | 7.69 % (±1.53) | 90.3 % (±0.10) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 10.0 rows (±3.05) | 18.0 rows (±1.30) | 18.0 rows (±0.00) | 0.00 rows (±0.00) | 0.00 rows (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Captured frames (higher is better) | 67.0 (±4.06) | 54.0 (±2.00) | 74.0 (±0.55) | 61.0 (±2.55) | 72.0 (±1.14) | 1.07 × (1.03–1.20) **Infinite** | 1.33 × (1.24–1.37) **Infinite** | 0.97 × (0.96–1.00) ≈ | 1.18 × (1.13–1.25) **Infinite** |

## updates-low - 1,000,000 rows

Live updates, low frequency. The grid shows the rows in the order of the data. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 372 ms (±19.9) | 88.0 ms (±3.84) | 665 ms (±29.4) | 19.7 ms (±1.82) | 283 ms (±32.8) | 0.76 × (0.68–0.92) **Infinite** | 3.22 × (2.94–3.89) **AG Grid** | 0.43 × (0.39–0.52) **Infinite** | 14.4 × (12.6–17.4) **Element Plus** |
| Update to rows painted (worst update) (lower is better) | 561 ms (±15.3) | 104 ms (±1.40) | 755 ms (±26.3) | 28.4 ms (±8.40) | 421 ms (±50.1) | 0.75 × (0.59–0.79) **Infinite** | 4.04 × (3.17–4.27) **AG Grid** | 0.56 × (0.44–0.60) **Infinite** | 14.8 × (9.01–16.2) **Element Plus** |
| Update to settled (median of updates) (lower is better) | 372 ms (±19.9) | 88.0 ms (±3.84) | 665 ms (±29.4) | 19.7 ms (±1.82) | 283 ms (±32.8) | 0.76 × (0.68–0.92) **Infinite** | 3.22 × (2.94–3.89) **AG Grid** | 0.43 × (0.39–0.52) **Infinite** | 14.4 × (12.6–17.4) **Element Plus** |
| Main thread: layout (all updates) (lower is better) | 4.28 ms (±0.11) | 3.17 ms (±0.15) | 10.1 ms (±2.16) | 6.02 ms (±1.97) | 2.22 ms (±0.04) | 0.52 × (0.50–0.54) **Infinite** | 0.70 × (0.64–0.72) **Infinite** | 0.22 × (0.16–0.25) **Infinite** | 0.37 × (0.22–0.39) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 0.00 ms (±0.00) | 1.50 ms (±0.07) | 0.00 ms (±0.00) | 0.92 ms (±0.08) | 17.6 ms (±0.34) | +17.6 (+17.6 to +18.4) **TanStack** | 11.7 × (10.8–12.2) **AG Grid** | +17.6 (+17.6 to +18.4) **PrimeVue** | 19.2 × (16.3–20.0) **Element Plus** |
| Main thread: all tasks (all updates) (lower is better) | 2080 ms (±45.4) | 452 ms (±13.0) | 3374 ms (±142) | 173 ms (±5.14) | 1556 ms (±175) | 0.75 × (0.64–0.86) **Infinite** | 3.44 × (2.97–3.97) **AG Grid** | 0.46 × (0.40–0.53) **Infinite** | 8.98 × (7.74–10.4) **Element Plus** |

## updates-low-sorted - 1,000,000 rows

Live updates, low frequency. The grid shows sorted by salary, highest first - the updates change the salaries, so rows move. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 4350 ms (±339) | 4460 ms (±195) | 7065 ms (±689) | 608 ms (±13.2) | 431 ms (±21.3) | 0.10 × (0.09–0.12) **Infinite** | 0.10 × (0.09–0.10) **Infinite** | 0.06 × (0.05–0.07) **Infinite** | 0.71 × (0.66–0.74) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 4670 ms (±362) | 4749 ms (±396) | 7295 ms (±866) | 624 ms (±51.8) | 512 ms (±45.1) | 0.11 × (0.10–0.14) **Infinite** | 0.11 × (0.09–0.12) **Infinite** | 0.07 × (0.06–0.08) **Infinite** | 0.82 × (0.70–0.94) **Infinite** |
| Update to settled (median of updates) (lower is better) | 4350 ms (±339) | 4460 ms (±195) | 7065 ms (±689) | 608 ms (±13.2) | 431 ms (±21.3) | 0.10 × (0.09–0.12) **Infinite** | 0.10 × (0.09–0.10) **Infinite** | 0.06 × (0.05–0.07) **Infinite** | 0.71 × (0.66–0.74) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 6.61 ms (±11.6) | 15.5 ms (±0.83) | 14.9 ms (±0.81) | 11.3 ms (±0.75) | 8.86 ms (±0.20) | 1.34 × (0.31–1.38) ≈ | 0.57 × (0.54–0.63) **Infinite** | 0.59 × (0.55–0.64) **Infinite** | 0.79 × (0.73–0.87) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 5.05 ms (±5.79) | 0.14 ms (±0.00) | 17.5 ms (±1.38) | 9.08 ms (±0.64) | 18.7 ms (±0.54) | 3.70 × (1.18–4.02) **TanStack** | 134 × (128–139) **AG Grid** | 1.07 × (0.93–1.13) ≈ | 2.06 × (1.90–2.32) **Element Plus** |
| Main thread: all tasks (all updates) (lower is better) | 21849 ms (±1061) | 23525 ms (±1078) | 35127 ms (±3428) | 3221 ms (±76.2) | 2240 ms (±116) | 0.10 × (0.09–0.11) **Infinite** | 0.10 × (0.09–0.10) **Infinite** | 0.06 × (0.05–0.07) **Infinite** | 0.70 × (0.64–0.72) **Infinite** |

## updates-low-filtered - 1,000,000 rows

Live updates, low frequency. The grid shows filtered to a salary of at least 115,000 (about half of the rows) - the updates change the salaries, so rows go in and out of the filter. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 1345 ms (±31.4) | 279 ms (±7.78) | 484 ms (±21.4) | 34.8 ms (±2.36) | 205 ms (±9.87) | 0.15 × (0.14–0.16) **Infinite** | 0.73 × (0.69–0.79) **Infinite** | 0.42 × (0.38–0.45) **Infinite** | 5.88 × (5.19–6.32) **Element Plus** |
| Update to rows painted (worst update) (lower is better) | 1488 ms (±77.7) | 291 ms (±6.34) | 602 ms (±13.6) | 43.2 ms (±1.72) | 281 ms (±8.96) | 0.19 × (0.17–0.19) **Infinite** | 0.97 × (0.91–0.99) **Infinite** | 0.47 × (0.44–0.48) **Infinite** | 6.49 × (6.14–6.96) **Element Plus** |
| Update to settled (median of updates) (lower is better) | 1345 ms (±31.4) | 279 ms (±7.78) | 484 ms (±21.4) | 34.8 ms (±2.36) | 205 ms (±9.87) | 0.15 × (0.14–0.16) **Infinite** | 0.73 × (0.69–0.79) **Infinite** | 0.42 × (0.38–0.45) **Infinite** | 5.88 × (5.19–6.32) **Element Plus** |
| Main thread: layout (all updates) (lower is better) | 4.23 ms (±0.16) | 5.46 ms (±2.75) | 10.8 ms (±4.98) | 5.93 ms (±0.19) | 4.18 ms (±0.16) | 0.99 × (0.94–1.07) ≈ | 0.77 × (0.36–0.82) **Infinite** | 0.39 × (0.19–0.43) **Infinite** | 0.71 × (0.67–0.76) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 1.32 ms (±0.09) | 0.63 ms (±0.10) | 6.95 ms (±0.28) | 1.41 ms (±0.12) | 17.7 ms (±0.80) | 13.5 × (12.2–14.9) **TanStack** | 28.3 × (22.8–32.5) **AG Grid** | 2.55 × (2.43–2.74) **PrimeVue** | 12.6 × (11.4–14.3) **Element Plus** |
| Main thread: all tasks (all updates) (lower is better) | 6288 ms (±168) | 1720 ms (±50.1) | 2553 ms (±77.9) | 332 ms (±35.0) | 1094 ms (±47.2) | 0.17 × (0.16–0.19) **Infinite** | 0.64 × (0.61–0.69) **Infinite** | 0.43 × (0.40–0.46) **Infinite** | 3.29 × (3.11–4.21) **Element Plus** |

## updates-low-grouped - 1,000,000 rows

Live updates, low frequency. The grid shows grouped by department (10 collapsed groups), with the sum of the salaries of each group - the updates change the salaries, so the sums change. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | Infinite median (sd) | Infinite vs TanStack |
|---|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 1658 ms (±16.7) | 824 ms (±22.2) | 0.50 × (0.48–0.52) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 2043 ms (±56.0) | 964 ms (±41.3) | 0.47 × (0.46–0.52) **Infinite** |
| Update to settled (median of updates) (lower is better) | 1658 ms (±16.7) | 824 ms (±22.2) | 0.50 × (0.48–0.52) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 2.25 ms (±0.09) | 1.26 ms (±0.01) | 0.56 × (0.54–0.59) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 0.00 ms (±0.00) | 10.3 ms (±0.35) | +10.3 (+9.97 to +10.8) **TanStack** |
| Main thread: all tasks (all updates) (lower is better) | 8865 ms (±202) | 4288 ms (±118) | 0.48 × (0.48–0.51) **Infinite** |

## updates-high - 1,000,000 rows

Live updates, high frequency. The grid shows the rows in the order of the data. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 807 ms (±104) | 162 ms (±3.48) | 884 ms (±218) | 25.5 ms (±9.07) | 479 ms (±108) | 0.59 × (0.34–0.78) **Infinite** | 2.95 × (1.70–3.13) **AG Grid** | 0.54 × (0.30–0.74) **Infinite** | 18.8 × (9.79–34.2) **Element Plus** |
| Update delay, p95 (lower is better) | 453 ms (±19.1) | 87.0 ms (±5.62) | 595 ms (±47.0) | 15.0 ms (±0.66) | 287 ms (±29.8) | 0.63 × (0.58–0.75) **Infinite** | 3.30 × (2.89–4.03) **AG Grid** | 0.48 × (0.42–0.57) **Infinite** | 19.1 × (17.5–22.8) **Element Plus** |
| Frames committed per second (higher is better) | 2.26 fps (±0.08) | 11.1 fps (±0.52) | 1.43 fps (±0.11) | 58.2 fps (±0.54) | 3.81 fps (±0.45) | 1.69 × (1.38–1.94) **Infinite** | 0.34 × (0.28–0.39) **AG Grid** | 2.66 × (2.18–3.15) **Infinite** | 0.07 × (0.05–0.07) **Element Plus** |
| Gap between frames, p95 (lower is better) | 756 ms (±17.1) | 150 ms (±11.6) | 1124 ms (±96.4) | 27.4 ms (±0.69) | 378 ms (±31.5) | 0.50 × (0.48–0.59) **Infinite** | 2.53 × (2.37–3.18) **AG Grid** | 0.34 × (0.29–0.40) **Infinite** | 13.8 × (13.2–16.2) **Element Plus** |
| Longest gap between frames (lower is better) | 896 ms (±12.2) | 190 ms (±3.71) | 1340 ms (±96.8) | 78.2 ms (±8.34) | 396 ms (±38.4) | 0.44 × (0.43–0.53) **Infinite** | 2.08 × (2.02–2.51) **AG Grid** | 0.30 × (0.26–0.36) **Infinite** | 5.06 × (4.19–6.11) **Element Plus** |
| Long tasks: total blocking time (lower is better) | 4208 ms (±84.1) | 1786 ms (±106) | 4485 ms (±219) | 28.2 ms (±13.2) | 3504 ms (±183) | 0.83 × (0.77–0.88) **Infinite** | 1.96 × (1.77–2.14) **AG Grid** | 0.78 × (0.72–0.83) **Infinite** | 124 × (84.0–317) **Element Plus** |
| Main thread: layout (lower is better) | 8.00 ms (±0.37) | 27.2 ms (±1.26) | 12.0 ms (±2.52) | 145 ms (±18.3) | 7.02 ms (±0.49) | 0.88 × (0.76–0.97) **Infinite** | 0.26 × (0.22–0.27) **Infinite** | 0.59 × (0.41–0.65) **Infinite** | 0.05 × (0.04–0.05) **Infinite** |
| Main thread: style recalc (lower is better) | 0.00 ms (±0.00) | 13.1 ms (±0.55) | 0.00 ms (±0.00) | 24.1 ms (±4.67) | 52.8 ms (±4.16) | +52.8 (+44.7 to +55.2) **TanStack** | 4.05 × (3.42–4.33) **AG Grid** | +52.8 (+44.7 to +55.2) **PrimeVue** | 2.19 × (1.60–2.54) **Element Plus** |
| Main thread: all tasks (lower is better) | 4800 ms (±101) | 4142 ms (±4.69) | 4865 ms (±219) | 2338 ms (±151) | 4462 ms (±109) | 0.93 × (0.88–0.97) **Infinite** | 1.08 × (1.03–1.08) **AG Grid** | 0.92 × (0.85–0.96) **Infinite** | 1.91 × (1.68–1.96) **Element Plus** |

## updates-high-sorted - 1,000,000 rows

Live updates, high frequency. The grid shows sorted by salary, highest first - the updates change the salaries, so rows move. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 5189 ms (±1761) | 6529 ms (±856) | 13358 ms (±1162) | 956 ms (±172) | 761 ms (±137) | 0.15 × (0.09–0.19) **Infinite** | 0.12 × (0.09–0.15) **Infinite** | 0.06 × (0.04–0.07) **Infinite** | 0.80 × (0.61–1.19) ≈ |
| Update delay, p95 (lower is better) | 3954 ms (±123) | 4817 ms (±451) | 8725 ms (±565) | 641 ms (±43.8) | 525 ms (±57.3) | 0.13 × (0.12–0.16) **Infinite** | 0.11 × (0.10–0.13) **Infinite** | 0.06 × (0.06–0.08) **Infinite** | 0.82 × (0.70–0.97) **Infinite** |
| Frames committed per second (higher is better) | 0.11 fps (±0.02) | 0.10 fps (±0.01) | 0.06 fps (±0.00) | 1.27 fps (±0.09) | 1.90 fps (±0.17) | 16.7 × (12.1–18.1) **Infinite** | 20.0 × (16.4–22.4) **Infinite** | 32.9 × (27.6–35.6) **Infinite** | 1.50 × (1.28–1.65) **Infinite** |
| Gap between frames, p95 (lower is better) | 8791 ms (±585) | 10509 ms (±856) | 17338 ms (±1162) | 1274 ms (±81.6) | 652 ms (±67.4) | 0.07 × (0.06–0.09) **Infinite** | 0.06 × (0.05–0.07) **Infinite** | 0.04 × (0.03–0.04) **Infinite** | 0.51 × (0.44–0.59) **Infinite** |
| Longest gap between frames (lower is better) | 8791 ms (±526) | 10509 ms (±856) | 17338 ms (±1162) | 1481 ms (±74.0) | 704 ms (±65.5) | 0.08 × (0.07–0.09) **Infinite** | 0.07 × (0.05–0.08) **Infinite** | 0.04 × (0.03–0.05) **Infinite** | 0.48 × (0.40–0.52) **Infinite** |
| Long tasks: total blocking time (lower is better) | 9069 ms (±1738) | 10409 ms (±856) | 17238 ms (±1162) | 4536 ms (±169) | 4196 ms (±135) | 0.46 × (0.33–0.50) **Infinite** | 0.40 × (0.37–0.46) **Infinite** | 0.24 × (0.23–0.28) **Infinite** | 0.93 × (0.89–0.99) **Infinite** |
| Main thread: layout (lower is better) | 2.35 ms (±0.60) | 6.48 ms (±0.66) | 7.87 ms (±0.27) | 16.4 ms (±0.92) | 15.9 ms (±1.04) | 6.76 × (4.40–7.51) **TanStack** | 2.45 × (1.98–2.64) **AG Grid** | 2.02 × (1.84–2.18) **PrimeVue** | 0.97 × (0.87–1.05) ≈ |
| Main thread: style recalc (lower is better) | 1.66 ms (±0.40) | 0.03 ms (±0.00) | 4.95 ms (±0.33) | 13.4 ms (±0.64) | 32.9 ms (±2.40) | 19.8 × (13.7–24.3) **TanStack** | 1028 × (934–1219) **AG Grid** | 6.65 × (5.84–7.30) **PrimeVue** | 2.46 × (2.20–2.70) **Element Plus** |
| Main thread: all tasks (lower is better) | 9186 ms (±1620) | 10512 ms (±856) | 17481 ms (±1090) | 5027 ms (±137) | 4742 ms (±137) | 0.52 × (0.37–0.53) **Infinite** | 0.45 × (0.41–0.51) **Infinite** | 0.27 × (0.26–0.31) **Infinite** | 0.94 × (0.91–1.00) ≈ |

## updates-high-filtered - 1,000,000 rows

Live updates, high frequency. The grid shows filtered to a salary of at least 115,000 (about half of the rows) - the updates change the salaries, so rows go in and out of the filter. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | AG Grid median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs TanStack | Infinite vs AG Grid | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 2224 ms (±131) | 448 ms (±70.1) | 675 ms (±113) | 80.8 ms (±30.2) | 354 ms (±129) | 0.16 × (0.10–0.25) **Infinite** | 0.79 × (0.50–1.23) ≈ | 0.52 × (0.33–0.82) **Infinite** | 4.38 × (2.72–10.7) **Element Plus** |
| Update delay, p95 (lower is better) | 1275 ms (±29.6) | 270 ms (±25.3) | 500 ms (±15.3) | 30.7 ms (±1.19) | 224 ms (±10.6) | 0.18 × (0.17–0.19) **Infinite** | 0.83 × (0.70–0.89) **Infinite** | 0.45 × (0.43–0.49) **Infinite** | 7.30 × (6.92–7.94) **Element Plus** |
| Frames committed per second (higher is better) | 0.64 fps (±0.01) | 3.39 fps (±0.19) | 1.72 fps (±0.04) | 31.8 fps (±0.50) | 4.55 fps (±0.16) | 7.05 × (6.56–7.38) **Infinite** | 1.34 × (1.25–1.51) **Infinite** | 2.65 × (2.46–2.74) **Infinite** | 0.14 × (0.13–0.15) **Element Plus** |
| Gap between frames, p95 (lower is better) | 2177 ms (±68.2) | 491 ms (±29.1) | 915 ms (±23.2) | 35.8 ms (±2.53) | 313 ms (±23.7) | 0.14 × (0.13–0.15) **Infinite** | 0.64 × (0.54–0.69) **Infinite** | 0.34 × (0.30–0.36) **Infinite** | 8.75 × (7.38–9.49) **Element Plus** |
| Longest gap between frames (lower is better) | 2298 ms (±74.4) | 522 ms (±22.6) | 1121 ms (±33.6) | 72.6 ms (±13.7) | 349 ms (±17.9) | 0.15 × (0.14–0.17) **Infinite** | 0.67 × (0.62–0.73) **Infinite** | 0.31 × (0.29–0.34) **Infinite** | 4.81 × (3.37–5.25) **Element Plus** |
| Long tasks: total blocking time (lower is better) | 5943 ms (±133) | 3625 ms (±65.6) | 4204 ms (±113) | 18.8 ms (±35.0) | 3200 ms (±83.7) | 0.54 × (0.51–0.56) **Infinite** | 0.88 × (0.86–0.92) **Infinite** | 0.76 × (0.74–0.80) **Infinite** | 170 × (34.3–392) **Element Plus** |
| Main thread: layout (lower is better) | 3.31 ms (±0.10) | 14.7 ms (±1.02) | 18.6 ms (±0.97) | 131 ms (±6.78) | 13.4 ms (±0.58) | 4.06 × (3.80–4.29) **TanStack** | 0.91 × (0.83–1.01) ≈ | 0.72 × (0.67–0.76) **Infinite** | 0.10 × (0.09–0.11) **Infinite** |
| Main thread: style recalc (lower is better) | 1.18 ms (±0.04) | 1.83 ms (±0.37) | 9.90 ms (±0.55) | 27.0 ms (±0.71) | 63.2 ms (±2.59) | 53.5 × (50.7–57.8) **TanStack** | 34.5 × (24.6–36.6) **AG Grid** | 6.38 × (5.79–6.89) **PrimeVue** | 2.34 × (2.19–2.46) **Element Plus** |
| Main thread: all tasks (lower is better) | 6204 ms (±131) | 4429 ms (±70.1) | 4658 ms (±113) | 4172 ms (±41.6) | 4399 ms (±140) | 0.71 × (0.68–0.73) **Infinite** | 0.99 × (0.95–1.03) ≈ | 0.94 × (0.90–0.99) **Infinite** | 1.05 × (1.01–1.09) **Element Plus** |

## updates-high-grouped - 1,000,000 rows

Live updates, high frequency. The grid shows grouped by department (10 collapsed groups), with the sum of the salaries of each group - the updates change the salaries, so the sums change. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | Infinite median (sd) | Infinite vs TanStack |
|---|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 2820 ms (±176) | 1571 ms (±92.6) | 0.56 × (0.49–0.63) **Infinite** |
| Update delay, p95 (lower is better) | 1629 ms (±127) | 868 ms (±16.2) | 0.53 × (0.45–0.55) **Infinite** |
| Frames committed per second (higher is better) | 0.44 fps (±0.01) | 1.08 fps (±0.02) | 2.45 × (2.36–2.58) **Infinite** |
| Gap between frames, p95 (lower is better) | 3282 ms (±152) | 1053 ms (±38.4) | 0.32 × (0.29–0.34) **Infinite** |
| Longest gap between frames (lower is better) | 3460 ms (±169) | 1064 ms (±41.8) | 0.31 × (0.28–0.33) **Infinite** |
| Long tasks: total blocking time (lower is better) | 6600 ms (±176) | 5225 ms (±92.9) | 0.79 × (0.75–0.82) **Infinite** |
| Main thread: layout (lower is better) | 1.30 ms (±0.02) | 1.51 ms (±0.04) | 1.17 × (1.13–1.21) **TanStack** |
| Main thread: style recalc (lower is better) | 0.00 ms (±0.00) | 11.5 ms (±0.35) | +11.5 (+11.2 to +12.0) **TanStack** |
| Main thread: all tasks (lower is better) | 6801 ms (±175) | 5562 ms (±91.6) | 0.82 × (0.78–0.85) **Infinite** |
