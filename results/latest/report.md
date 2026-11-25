# AG Grid vs TanStack Table vs PrimeVue DataTable vs Element Plus Table V2 vs Infinite Table — benchmark report

- Run: `ci` · 2026-11-25T02:19:03.684Z
- AG Grid 36.3.0 · TanStack Table 9.3.1 · PrimeVue DataTable 4.5.5 · Element Plus Table V2 2.14.8 · Infinite Table 10.2.1
- 300,000 rows (data checksum `300000:72377c6e`) · 1,000,000 rows (data checksum `1000000:19e5eebe`) × 20 columns, identical data for every grid
- Chrome 136.0.7103.25 · headless · CPU throttling 1× · viewport 1400×1000
- 7 measured runs per grid per scenario (+1 warmup, discarded), interleaved, fresh browser context per run
- Linux 7.0.0-1017-azure x64 · INTEL(R) XEON(R) PLATINUM 8573C × 4
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
| Time to first rows painted (lower is better) | 972 ms (±7.17) | 280 ms (±3.15) | 663 ms (±16.6) | 56.6 ms (±0.72) | 273 ms (±6.51) | 0.28 × (0.27–0.29) **Infinite** | 0.97 × (0.95–1.00) ≈ | 0.41 × (0.40–0.43) **Infinite** | 4.82 × (4.68–4.97) **Element Plus** |
| Time until settled (lower is better) | 1076 ms (±7.05) | 280 ms (±3.15) | 663 ms (±16.6) | 56.6 ms (±0.72) | 288 ms (±6.04) | 0.27 × (0.26–0.28) **Infinite** | 1.03 × (1.01–1.06) **TanStack** | 0.43 × (0.42–0.45) **Infinite** | 5.10 × (4.97–5.23) **Element Plus** |
| Main thread: layout (lower is better) | 9.08 ms (±0.21) | 6.00 ms (±0.95) | 16.7 ms (±2.90) | 5.58 ms (±0.12) | 4.25 ms (±0.18) | 0.47 × (0.45–0.48) **Infinite** | 0.71 × (0.62–0.88) **Infinite** | 0.25 × (0.25–0.37) **Infinite** | 0.76 × (0.74–0.80) **Infinite** |
| Main thread: style recalc (lower is better) | 13.6 ms (±0.40) | 2.92 ms (±0.11) | 12.4 ms (±1.90) | 3.36 ms (±0.05) | 7.59 ms (±0.48) | 0.56 × (0.53–0.62) **Infinite** | 2.60 × (2.51–2.93) **TanStack** | 0.61 × (0.57–0.79) **Infinite** | 2.26 × (2.23–2.51) **Element Plus** |
| Main thread: all tasks (lower is better) | 981 ms (±7.41) | 282 ms (±3.21) | 689 ms (±18.3) | 94.9 ms (±0.98) | 299 ms (±6.91) | 0.31 × (0.30–0.32) **Infinite** | 1.06 × (1.04–1.09) **TanStack** | 0.43 × (0.43–0.46) **Infinite** | 3.15 × (3.11–3.25) **Element Plus** |
| JS heap retained by grid (lower is better) | 204 MB (±0.05) | 87.2 MB (±0.05) | 21.5 MB (±0.01) | 2.77 MB (±0.00) | 36.7 MB (±0.00) | 0.18 × (0.18–0.18) **Infinite** | 0.42 × (0.42–0.42) **Infinite** | 1.70 × (1.70–1.70) **PrimeVue** | 13.3 × (13.3–13.3) **Element Plus** |
| DOM elements in grid (lower is better) | 637 (±0.00) | 352 (±0.00) | 1028 (±0.00) | 992 (±0.00) | 608 (±0.00) | 0.95 × (0.95–0.95) **Infinite** | 1.73 × (1.73–1.73) **TanStack** | 0.59 × (0.59–0.59) **Infinite** | 0.61 × (0.61–0.61) **Infinite** |

## sort-string - 300,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 1134 ms (±51.9) | 1169 ms (±15.7) | 3418 ms (±138) | 299 ms (±6.38) | 501 ms (±12.5) | 0.44 × (0.44–0.46) **Infinite** | 0.43 × (0.42–0.44) **Infinite** | 0.15 × (0.14–0.15) **Infinite** | 1.68 × (1.65–1.74) **Element Plus** |
| Ascending: click to settled (lower is better) | 1134 ms (±51.9) | 1169 ms (±15.7) | 3418 ms (±138) | 299 ms (±6.38) | 504 ms (±12.8) | 0.44 × (0.44–0.46) **Infinite** | 0.43 × (0.42–0.45) **Infinite** | 0.15 × (0.14–0.15) **Infinite** | 1.69 × (1.66–1.75) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 1113 ms (±41.4) | 1148 ms (±22.8) | 3434 ms (±39.3) | 301 ms (±4.73) | 516 ms (±4.38) | 0.46 × (0.46–0.47) **Infinite** | 0.45 × (0.44–0.46) **Infinite** | 0.15 × (0.15–0.15) **Infinite** | 1.72 × (1.70–1.75) **Element Plus** |
| Descending: click to settled (lower is better) | 1113 ms (±41.4) | 1148 ms (±22.8) | 3434 ms (±39.3) | 301 ms (±4.73) | 516 ms (±4.38) | 0.46 × (0.46–0.47) **Infinite** | 0.45 × (0.44–0.46) **Infinite** | 0.15 × (0.15–0.15) **Infinite** | 1.72 × (1.70–1.75) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 1140 ms (±52.0) | 1171 ms (±15.5) | 3438 ms (±139) | 361 ms (±6.48) | 542 ms (±9.27) | 0.48 × (0.47–0.49) **Infinite** | 0.46 × (0.45–0.47) **Infinite** | 0.16 × (0.15–0.16) **Infinite** | 1.50 × (1.46–1.55) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 1119 ms (±42.1) | 1149 ms (±22.8) | 3453 ms (±38.3) | 360 ms (±4.88) | 513 ms (±6.03) | 0.46 × (0.46–0.47) **Infinite** | 0.45 × (0.44–0.46) **Infinite** | 0.15 × (0.15–0.15) **Infinite** | 1.42 × (1.41–1.46) **Element Plus** |

## sort-number - 300,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 1177 ms (±37.6) | 1069 ms (±16.2) | 3053 ms (±86.1) | 226 ms (±2.04) | 282 ms (±5.82) | 0.24 × (0.23–0.25) **Infinite** | 0.26 × (0.26–0.27) **Infinite** | 0.09 × (0.09–0.09) **Infinite** | 1.25 × (1.24–1.29) **Element Plus** |
| Ascending: click to settled (lower is better) | 1177 ms (±37.6) | 1069 ms (±16.2) | 3053 ms (±86.1) | 226 ms (±2.04) | 287 ms (±5.83) | 0.24 × (0.23–0.25) **Infinite** | 0.27 × (0.26–0.28) **Infinite** | 0.09 × (0.09–0.10) **Infinite** | 1.27 × (1.26–1.30) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 1186 ms (±27.7) | 937 ms (±13.6) | 3104 ms (±98.8) | 233 ms (±6.06) | 260 ms (±10.3) | 0.22 × (0.21–0.23) **Infinite** | 0.28 × (0.26–0.29) **Infinite** | 0.08 × (0.08–0.09) **Infinite** | 1.11 × (1.05–1.16) **Element Plus** |
| Descending: click to settled (lower is better) | 1186 ms (±27.7) | 937 ms (±13.6) | 3104 ms (±98.8) | 233 ms (±6.06) | 260 ms (±10.3) | 0.22 × (0.21–0.23) **Infinite** | 0.28 × (0.26–0.29) **Infinite** | 0.08 × (0.08–0.09) **Infinite** | 1.11 × (1.05–1.16) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 1182 ms (±37.7) | 1213 ms (±24.9) | 3074 ms (±86.1) | 288 ms (±10.2) | 321 ms (±7.87) | 0.27 × (0.26–0.28) **Infinite** | 0.26 × (0.26–0.28) **Infinite** | 0.10 × (0.10–0.11) **Infinite** | 1.12 × (1.09–1.21) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 1193 ms (±28.2) | 937 ms (±14.4) | 3119 ms (±101) | 294 ms (±12.1) | 259 ms (±9.63) | 0.22 × (0.20–0.23) **Infinite** | 0.28 × (0.26–0.28) **Infinite** | 0.08 × (0.08–0.09) **Infinite** | 0.88 × (0.83–0.91) **Infinite** |

## scroll-jump - 300,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 30.2 ms (±1.16) | 15.8 ms (±0.84) | 356 ms (±4.94) | 43.4 ms (±1.12) | 38.9 ms (±0.63) | 1.29 × (1.26–1.33) **AG Grid** | 2.46 × (2.33–2.55) **TanStack** | 0.11 × (0.11–0.11) **Infinite** | 0.90 × (0.87–0.91) **Infinite** |
| Jump to rows painted (worst jump) (lower is better) | 52.1 ms (±1.57) | 30.5 ms (±1.79) | 450 ms (±13.0) | 68.6 ms (±3.21) | 59.8 ms (±5.31) | 1.15 × (1.00–1.27) ≈ | 1.96 × (1.71–2.23) **TanStack** | 0.13 × (0.12–0.15) **Infinite** | 0.87 × (0.78–0.98) **Infinite** |
| Jump to settled (median of jumps) (lower is better) | 30.2 ms (±1.16) | 15.8 ms (±0.84) | 356 ms (±4.94) | 43.4 ms (±1.12) | 38.9 ms (±0.63) | 1.29 × (1.26–1.33) **AG Grid** | 2.46 × (2.33–2.55) **TanStack** | 0.11 × (0.11–0.11) **Infinite** | 0.90 × (0.87–0.91) **Infinite** |
| Main thread, all tasks (all jumps) (lower is better) | 459 ms (±12.1) | 279 ms (±9.88) | 3982 ms (±47.9) | 507 ms (±11.6) | 486 ms (±7.87) | 1.06 × (1.02–1.08) **AG Grid** | 1.74 × (1.64–1.79) **TanStack** | 0.12 × (0.12–0.12) **Infinite** | 0.96 × (0.92–0.98) **Infinite** |

## scroll-vertical - 300,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 51.1 % (±2.70) | 53.1 % (±26.3) | 10.8 % (±0.46) | 49.3 % (±0.15) | 67.9 % (±0.90) | 1.33 × (1.19–1.35) **Infinite** | 1.28 × (0.67–1.36) ≈ | 6.29 × (5.85–6.53) **Infinite** | 1.38 × (1.35–1.39) **Infinite** |
| Frames presented without main-thread update (lower is better) | 48.6 % (±2.64) | 46.9 % (±26.1) | 81.0 % (±0.55) | 48.7 % (±0.15) | 32.1 % (±0.90) | 0.66 × (0.65–0.76) **Infinite** | -14.8 (-17.6 to +33.1) ≈ | 0.40 × (0.39–0.41) **Infinite** | 0.66 × (0.65–0.68) **Infinite** |
| Frames dropped (lower is better) | 0.28 % (±0.11) | 0.00 % (±0.31) | 8.53 % (±0.80) | 1.95 % (±0.30) | 0.00 % (±0.00) | -0.28 (-0.28 to -0.28) **Infinite** | 0.00 (-0.28 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.24) | 4.98 fps (±0.26) | 58.1 fps (±0.34) | 54.8 fps (±0.56) | 0.91 × (0.91–0.92) **AG Grid** | 0.91 × (0.91–0.92) **TanStack** | 11.0 × (10.3–11.2) **Infinite** | 0.94 × (0.94–0.96) **Element Plus** |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 419 ms (±5.94) | 16.8 ms (±0.00) | 33.3 ms (±7.85) | 1.99 × (1.00–1.99) **AG Grid** | 1.99 × (1.00–1.99) **TanStack** | 0.08 × (0.04–0.08) **Infinite** | 1.98 × (1.00–1.98) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±12.5) | 433 ms (±8.92) | 33.4 ms (±6.27) | 66.7 ms (±0.06) | 3.97 × (3.97–3.97) **AG Grid** | 3.97 × (3.97–3.97) **TanStack** | 0.15 × (0.15–0.16) **Infinite** | 2.00 × (2.00–2.00) **Element Plus** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.21) | 55.6 % (±4.30) | 3.31 % (±0.73) | 5.92 % (±0.94) | +5.92 (+4.65 to +6.51) **AG Grid** | +5.92 (+4.65 to +6.51) **TanStack** | 0.11 × (0.08–0.12) **Infinite** | 1.79 × (1.35–2.17) **Element Plus** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 2555 ms (±104) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 271 ms (±3.70) | 91.3 ms (±2.09) | 84.3 ms (±3.47) | 133 ms (±2.52) | 68.9 ms (±1.37) | 0.25 × (0.25–0.26) **Infinite** | 0.75 × (0.72–0.77) **Infinite** | 0.82 × (0.80–0.84) **Infinite** | 0.52 × (0.50–0.53) **Infinite** |
| Main thread: style recalc (lower is better) | 150 ms (±3.52) | 48.0 ms (±1.30) | 56.5 ms (±1.45) | 128 ms (±3.15) | 205 ms (±3.79) | 1.37 × (1.34–1.43) **AG Grid** | 4.28 × (4.19–4.42) **TanStack** | 3.63 × (3.57–3.75) **PrimeVue** | 1.60 × (1.57–1.70) **Element Plus** |
| Main thread: all tasks (lower is better) | 1337 ms (±24.6) | 943 ms (±41.2) | 3269 ms (±36.2) | 2644 ms (±48.8) | 1659 ms (±26.0) | 1.24 × (1.20–1.26) **AG Grid** | 1.76 × (1.66–1.84) **TanStack** | 0.51 × (0.49–0.51) **Infinite** | 0.63 × (0.61–0.64) **Infinite** |

## scroll-horizontal - 300,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 94.1 % (±6.25) | 72.8 % (±0.23) | 96.7 % (±0.30) | 70.8 % (±1.57) | 87.6 % (±3.94) | 0.93 × (0.87–1.03) ≈ | 1.20 × (1.19–1.23) **Infinite** | 0.91 × (0.90–0.92) **PrimeVue** | 1.24 × (1.22–1.30) **Infinite** |
| Frames presented without main-thread update (lower is better) | 5.08 % (±5.79) | 25.9 % (±0.20) | 3.31 % (±0.30) | 28.0 % (±1.45) | 12.4 % (±3.94) | +7.34 (-0.72 to +13.0) ≈ | 0.48 × (0.41–0.50) **Infinite** | 3.76 × (3.22–3.97) **PrimeVue** | 0.44 × (0.38–0.47) **Infinite** |
| Frames dropped (lower is better) | 0.85 % (±0.92) | 1.27 % (±0.24) | 0.00 % (±0.00) | 1.20 % (±0.29) | 0.00 % (±0.00) | -0.85 (-1.55 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.18) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.18) | 60.0 fps (±0.19) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.8 ms (±0.05) | 16.7 ms (±0.04) | 16.7 ms (±0.04) | 16.8 ms (±0.05) | 16.7 ms (±0.05) | 0.99 × (0.99–1.01) ≈ | 1.00 × (1.00–1.01) ≈ | 1.00 × (1.00–1.01) ≈ | 0.99 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±6.20) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±6.27) | 16.8 ms (±6.24) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.31) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.30) | 0.00 % (±0.31) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 82.4 ms (±3.46) | 55.4 ms (±0.94) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 24.0 ms (±0.35) | 0.29 × (0.28–0.31) **Infinite** | 0.43 × (0.42–0.44) **Infinite** | +24.0 (+23.6 to +24.3) **PrimeVue** | +24.0 (+23.6 to +24.3) **Element Plus** |
| Main thread: style recalc (lower is better) | 39.8 ms (±0.70) | 15.9 ms (±0.34) | 0.00 ms (±0.00) | 9.01 ms (±0.56) | 32.3 ms (±0.67) | 0.81 × (0.79–0.83) **Infinite** | 2.03 × (1.98–2.08) **TanStack** | +32.3 (+32.0 to +32.8) **PrimeVue** | 3.58 × (3.36–3.74) **Element Plus** |
| Main thread: all tasks (lower is better) | 599 ms (±17.7) | 516 ms (±5.38) | 35.1 ms (±2.42) | 1212 ms (±20.1) | 435 ms (±8.10) | 0.73 × (0.71–0.75) **Infinite** | 0.84 × (0.83–0.86) **Infinite** | 12.4 × (11.9–13.6) **PrimeVue** | 0.36 × (0.35–0.37) **Infinite** |

## correctness-vertical - 300,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 1.87 % (±0.82) | 2.78 % (±1.07) | 0.00 % (±0.00) | 2.30 % (±1.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 9.33 % (±4.10) | 13.9 % (±5.37) | 0.00 % (±0.00) | 11.5 % (±5.02) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
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
| Captured frames with blank rows (lower is better) | 12.1 % (±2.48) | 5.71 % (±2.79) | 94.6 % (±0.04) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 5.20 % (±1.11) | 1.23 % (±0.67) | 90.2 % (±0.08) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 17.0 rows (±3.15) | 8.00 rows (±2.70) | 18.0 rows (±0.00) | 0.00 rows (±0.00) | 0.00 rows (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Captured frames (higher is better) | 59.0 (±1.57) | 68.0 (±1.50) | 74.0 (±0.53) | 39.0 (±2.87) | 72.0 (±0.90) | 1.22 × (1.20–1.29) **Infinite** | 1.06 × (1.01–1.07) **Infinite** | 0.97 × (0.95–0.99) **PrimeVue** | 1.85 × (1.69–1.89) **Infinite** |

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
| Time to first rows painted (lower is better) | 3047 ms (±20.9) | 779 ms (±11.6) | 1176 ms (±21.5) | 65.7 ms (±3.26) | 622 ms (±11.6) | 0.20 × (0.20–0.21) **Infinite** | 0.80 × (0.78–0.82) **Infinite** | 0.53 × (0.52–0.55) **Infinite** | 9.47 × (9.04–9.99) **Element Plus** |
| Time until settled (lower is better) | 3152 ms (±20.9) | 779 ms (±11.6) | 1176 ms (±21.5) | 65.7 ms (±3.26) | 636 ms (±11.8) | 0.20 × (0.20–0.20) **Infinite** | 0.82 × (0.80–0.84) **Infinite** | 0.54 × (0.53–0.56) **Infinite** | 9.68 × (9.26–10.2) **Element Plus** |
| Main thread: layout (lower is better) | 9.24 ms (±2.33) | 4.51 ms (±0.10) | 18.6 ms (±3.91) | 5.63 ms (±0.05) | 4.33 ms (±0.32) | 0.47 × (0.44–0.49) **Infinite** | 0.96 × (0.91–0.99) **Infinite** | 0.23 × (0.23–0.39) **Infinite** | 0.77 × (0.76–0.80) **Infinite** |
| Main thread: style recalc (lower is better) | 14.5 ms (±0.51) | 1.90 ms (±0.40) | 13.6 ms (±3.30) | 3.38 ms (±0.07) | 8.02 ms (±0.15) | 0.55 × (0.54–0.59) **Infinite** | 4.21 × (3.07–4.52) **TanStack** | 0.59 × (0.53–0.98) **Infinite** | 2.37 × (2.25–2.41) **Element Plus** |
| Main thread: all tasks (lower is better) | 3072 ms (±19.6) | 785 ms (±7.50) | 1236 ms (±41.1) | 70.1 ms (±3.31) | 670 ms (±11.9) | 0.22 × (0.21–0.22) **Infinite** | 0.85 × (0.84–0.86) **Infinite** | 0.54 × (0.52–0.56) **Infinite** | 9.56 × (9.37–10.4) **Element Plus** |
| JS heap retained by grid (lower is better) | 670 MB (±0.01) | 287 MB (±0.01) | 21.6 MB (±0.02) | 2.77 MB (±0.00) | 90.8 MB (±0.00) | 0.14 × (0.14–0.14) **Infinite** | 0.32 × (0.32–0.32) **Infinite** | 4.19 × (4.19–4.20) **PrimeVue** | 32.8 × (32.8–32.8) **Element Plus** |
| DOM elements in grid (lower is better) | 637 (±0.00) | 352 (±0.00) | 1028 (±0.00) | 992 (±0.00) | 608 (±0.00) | 0.95 × (0.95–0.95) **Infinite** | 1.73 × (1.73–1.73) **TanStack** | 0.59 × (0.59–0.59) **Infinite** | 0.61 × (0.61–0.61) **Infinite** |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 5226 ms (±66.6) | 5240 ms (±79.1) | 13580 ms (±166) | 1163 ms (±17.1) | 1811 ms (±24.0) | 0.35 × (0.34–0.35) **Infinite** | 0.35 × (0.34–0.35) **Infinite** | 0.13 × (0.13–0.14) **Infinite** | 1.56 × (1.52–1.58) **Element Plus** |
| Ascending: click to settled (lower is better) | 5226 ms (±66.6) | 5240 ms (±79.1) | 13580 ms (±166) | 1163 ms (±17.1) | 1815 ms (±24.0) | 0.35 × (0.34–0.35) **Infinite** | 0.35 × (0.34–0.35) **Infinite** | 0.13 × (0.13–0.14) **Infinite** | 1.56 × (1.52–1.59) **Element Plus** |
| Descending: click to sorted rows painted (lower is better) | 5262 ms (±91.4) | 5197 ms (±76.8) | 13586 ms (±102) | 1217 ms (±11.0) | 1975 ms (±71.1) | 0.38 × (0.36–0.39) **Infinite** | 0.38 × (0.36–0.40) **Infinite** | 0.15 × (0.14–0.15) **Infinite** | 1.62 × (1.56–1.68) **Element Plus** |
| Descending: click to settled (lower is better) | 5262 ms (±91.4) | 5197 ms (±76.8) | 13586 ms (±102) | 1217 ms (±11.0) | 1975 ms (±71.1) | 0.38 × (0.36–0.39) **Infinite** | 0.38 × (0.36–0.40) **Infinite** | 0.15 × (0.14–0.15) **Infinite** | 1.62 × (1.56–1.68) **Element Plus** |
| Ascending: main thread, all tasks (lower is better) | 5232 ms (±66.7) | 5242 ms (±79.1) | 13601 ms (±166) | 1378 ms (±58.4) | 1846 ms (±23.6) | 0.35 × (0.35–0.36) **Infinite** | 0.35 × (0.35–0.36) **Infinite** | 0.14 × (0.13–0.14) **Infinite** | 1.34 × (1.31–1.46) **Element Plus** |
| Descending: main thread, all tasks (lower is better) | 5265 ms (±91.4) | 5198 ms (±76.8) | 13605 ms (±102) | 1421 ms (±52.2) | 1980 ms (±69.3) | 0.38 × (0.36–0.39) **Infinite** | 0.38 × (0.36–0.39) **Infinite** | 0.15 × (0.14–0.15) **Infinite** | 1.39 × (1.33–1.52) **Element Plus** |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 5226 ms (±117) | 4583 ms (±130) | 12088 ms (±552) | 882 ms (±19.8) | 703 ms (±18.2) | 0.13 × (0.13–0.14) **Infinite** | 0.15 × (0.15–0.16) **Infinite** | 0.06 × (0.06–0.06) **Infinite** | 0.80 × (0.77–0.83) **Infinite** |
| Ascending: click to settled (lower is better) | 5226 ms (±117) | 4583 ms (±130) | 12088 ms (±552) | 882 ms (±19.8) | 707 ms (±18.4) | 0.14 × (0.13–0.14) **Infinite** | 0.15 × (0.15–0.16) **Infinite** | 0.06 × (0.06–0.06) **Infinite** | 0.80 × (0.78–0.83) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 5261 ms (±194) | 4340 ms (±180) | 12157 ms (±213) | 901 ms (±17.8) | 757 ms (±62.6) | 0.14 × (0.13–0.16) **Infinite** | 0.17 × (0.16–0.19) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.84 × (0.75–0.91) **Infinite** |
| Descending: click to settled (lower is better) | 5261 ms (±194) | 4340 ms (±180) | 12157 ms (±213) | 901 ms (±17.8) | 757 ms (±62.6) | 0.14 × (0.13–0.16) **Infinite** | 0.17 × (0.16–0.19) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.84 × (0.75–0.91) **Infinite** |
| Ascending: main thread, all tasks (lower is better) | 5232 ms (±117) | 5139 ms (±209) | 12108 ms (±551) | 1079 ms (±51.8) | 743 ms (±14.8) | 0.14 × (0.14–0.15) **Infinite** | 0.14 × (0.14–0.15) **Infinite** | 0.06 × (0.06–0.06) **Infinite** | 0.69 × (0.66–0.74) **Infinite** |
| Descending: main thread, all tasks (lower is better) | 5264 ms (±194) | 4341 ms (±180) | 12176 ms (±213) | 1111 ms (±59.6) | 762 ms (±60.8) | 0.14 × (0.13–0.16) **Infinite** | 0.18 × (0.16–0.19) **Infinite** | 0.06 × (0.06–0.07) **Infinite** | 0.69 × (0.61–0.79) **Infinite** |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 34.4 ms (±0.65) | 16.9 ms (±0.36) | 363 ms (±5.33) | 43.3 ms (±1.07) | 42.4 ms (±1.41) | 1.23 × (1.17–1.27) **AG Grid** | 2.51 × (2.39–2.58) **TanStack** | 0.12 × (0.11–0.12) **Infinite** | 0.98 × (0.91–1.01) ≈ |
| Jump to rows painted (worst jump) (lower is better) | 78.5 ms (±7.84) | 41.0 ms (±2.46) | 546 ms (±10.5) | 70.9 ms (±1.51) | 69.7 ms (±5.80) | 0.89 × (0.76–0.95) **Infinite** | 1.70 × (1.46–1.86) **TanStack** | 0.13 × (0.11–0.14) **Infinite** | 0.98 × (0.89–1.07) ≈ |
| Jump to settled (median of jumps) (lower is better) | 34.4 ms (±0.65) | 16.9 ms (±0.36) | 363 ms (±5.33) | 43.3 ms (±1.07) | 42.4 ms (±1.41) | 1.23 × (1.17–1.27) **AG Grid** | 2.51 × (2.39–2.58) **TanStack** | 0.12 × (0.11–0.12) **Infinite** | 0.98 × (0.91–1.01) ≈ |
| Main thread, all tasks (all jumps) (lower is better) | 398 ms (±10.9) | 223 ms (±3.53) | 4075 ms (±44.4) | 582 ms (±8.65) | 614 ms (±10.1) | 1.54 × (1.50–1.58) **AG Grid** | 2.75 × (2.68–2.79) **TanStack** | 0.15 × (0.15–0.15) **Infinite** | 1.05 × (1.03–1.07) **Element Plus** |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 48.3 % (±0.81) | 61.2 % (±5.90) | 10.1 % (±0.07) | 49.0 % (±0.11) | 64.8 % (±4.51) | 1.34 × (1.23–1.37) **Infinite** | 1.06 × (0.99–1.30) ≈ | 6.39 × (5.94–6.47) **Infinite** | 1.32 × (1.23–1.34) **Infinite** |
| Frames presented without main-thread update (lower is better) | 47.7 % (±0.79) | 38.5 % (±6.03) | 79.3 % (±0.66) | 48.5 % (±0.11) | 35.2 % (±4.51) | 0.74 × (0.71–0.83) **Infinite** | 0.91 × (0.70–1.03) ≈ | 0.44 × (0.43–0.50) **Infinite** | 0.73 × (0.71–0.82) **Infinite** |
| Frames dropped (lower is better) | 4.05 % (±1.60) | 0.33 % (±0.28) | 10.6 % (±0.73) | 2.52 % (±0.22) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 55.8 fps (±1.75) | 60.0 fps (±0.37) | 4.93 fps (±0.13) | 57.4 fps (±0.24) | 29.8 fps (±2.95) | 0.53 × (0.47–0.55) **AG Grid** | 0.50 × (0.45–0.51) **TanStack** | 6.06 × (5.32–6.21) **Infinite** | 0.52 × (0.47–0.53) **Element Plus** |
| p95 rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.7 ms (±0.05) | 423 ms (±6.44) | 16.8 ms (±0.93) | 50.0 ms (±5.33) | 2.98 × (2.98–2.98) **AG Grid** | 2.99 × (2.98–3.00) **TanStack** | 0.12 × (0.12–0.12) **Infinite** | 2.98 × (2.98–2.98) **Element Plus** |
| Worst rAF frame interval (lower is better) | 83.4 ms (±19.2) | 16.8 ms (±18.9) | 500 ms (±8.92) | 33.4 ms (±8.87) | 150 ms (±8.86) | 1.80 × (1.33–2.25) **AG Grid** | 8.92 × (7.94–8.93) **TanStack** | 0.30 × (0.26–0.30) **Infinite** | 4.49 × (2.67–4.49) **Element Plus** |
| rAF intervals > 25ms (lower is better) | 2.91 % (±1.32) | 0.00 % (±0.21) | 52.9 % (±3.14) | 3.91 % (±0.55) | 77.2 % (±15.4) | 26.5 × (15.8–34.8) **AG Grid** | +77.2 (+74.5 to +88.1) **TanStack** | 1.46 × (1.41–1.76) **PrimeVue** | 19.7 × (16.6–22.7) **Element Plus** |
| Long animation frames: total blocking (lower is better) | 51.6 ms (±29.0) | 0.00 ms (±0.00) | 2777 ms (±30.3) | 0.00 ms (±0.00) | 5.39 ms (±7.44) | 0.10 × (0.07–0.31) **Infinite** | +5.39 (+4.14 to +6.55) **TanStack** | 0.00 × (0.00–0.00) **Infinite** | +5.39 (+4.14 to +6.55) **Element Plus** |
| Main thread: layout (lower is better) | 488 ms (±22.5) | 101 ms (±4.29) | 88.0 ms (±3.47) | 141 ms (±6.51) | 84.1 ms (±1.83) | 0.17 × (0.16–0.18) **Infinite** | 0.83 × (0.80–0.87) **Infinite** | 0.96 × (0.93–0.98) **Infinite** | 0.60 × (0.57–0.61) **Infinite** |
| Main thread: style recalc (lower is better) | 157 ms (±8.26) | 52.0 ms (±2.47) | 58.9 ms (±0.62) | 138 ms (±7.02) | 231 ms (±8.32) | 1.47 × (1.36–1.58) **AG Grid** | 4.44 × (4.27–4.71) **TanStack** | 3.92 × (3.82–4.17) **PrimeVue** | 1.68 × (1.63–1.78) **Element Plus** |
| Main thread: all tasks (lower is better) | 1938 ms (±38.3) | 1140 ms (±32.7) | 3344 ms (±31.0) | 2731 ms (±53.6) | 1917 ms (±31.9) | 0.99 × (0.97–1.02) ≈ | 1.68 × (1.62–1.72) **TanStack** | 0.57 × (0.56–0.58) **Infinite** | 0.70 × (0.68–0.71) **Infinite** |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 80.9 % (±8.97) | 80.3 % (±0.00) | 96.7 % (±0.30) | 80.1 % (±2.78) | 86.3 % (±3.88) | 1.07 × (0.94–1.10) ≈ | 1.07 × (1.07–1.10) **Infinite** | 0.89 × (0.89–0.91) **PrimeVue** | 1.08 × (1.07–1.18) **Infinite** |
| Frames presented without main-thread update (lower is better) | 17.6 % (±8.66) | 19.0 % (±0.00) | 3.28 % (±0.30) | 18.5 % (±2.59) | 13.5 % (±3.83) | -4.12 (-7.42 to +6.45) ≈ | 0.71 × (0.61–0.73) **Infinite** | 4.13 × (3.53–4.29) **PrimeVue** | 0.73 × (0.55–0.76) **Infinite** |
| Frames dropped (lower is better) | 0.73 % (±0.51) | 0.70 % (±0.00) | 0.00 % (±0.00) | 1.37 % (±0.18) | 0.00 % (±0.43) | -0.73 (-0.83 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 59.5 fps (±0.00) | 60.0 fps (±0.19) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.01 × (1.01–1.01) **Infinite** |
| p95 rAF frame interval (lower is better) | 16.8 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.03) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 0.99 × (0.99–1.01) ≈ | 1.00 × (0.99–1.01) ≈ | 1.00 × (1.00–1.01) ≈ | 1.00 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 33.3 ms (±0.04) | 16.8 ms (±6.24) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 0.50 × (0.50–0.50) **Infinite** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.79 % (±0.00) | 0.00 % (±0.31) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: layout (lower is better) | 87.1 ms (±3.13) | 57.3 ms (±2.38) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 25.4 ms (±0.44) | 0.29 × (0.28–0.30) **Infinite** | 0.44 × (0.43–0.47) **Infinite** | +25.4 (+25.1 to +25.9) **PrimeVue** | +25.4 (+25.1 to +25.9) **Element Plus** |
| Main thread: style recalc (lower is better) | 41.5 ms (±1.37) | 16.3 ms (±0.62) | 0.00 ms (±0.00) | 10.6 ms (±1.10) | 33.8 ms (±0.81) | 0.82 × (0.80–0.88) **Infinite** | 2.08 × (2.02–2.16) **TanStack** | +33.8 (+33.3 to +34.7) **PrimeVue** | 3.19 × (2.76–3.49) **Element Plus** |
| Main thread: all tasks (lower is better) | 536 ms (±19.2) | 472 ms (±15.4) | 41.9 ms (±3.39) | 1262 ms (±40.6) | 564 ms (±15.2) | 1.05 × (1.01–1.11) **AG Grid** | 1.20 × (1.14–1.26) **TanStack** | 13.5 × (12.8–15.3) **PrimeVue** | 0.45 × (0.42–0.45) **Infinite** |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | TanStack median (sd) | PrimeVue median (sd) | Element Plus median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack | Infinite vs PrimeVue | Infinite vs Element Plus |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 2.46 % (±1.15) | 2.78 % (±1.03) | 0.00 % (±0.00) | 2.81 % (±1.49) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 12.3 % (±4.20) | 13.9 % (±5.15) | 0.00 % (±0.00) | 14.0 % (±7.46) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Worst frame: correct samples (higher is better) | 80.0 % (±42.8) | 80.0 % (±0.00) | 100 % (±0.00) | 80.0 % (±0.00) | 100 % (±0.00) | +20.0 (+20.0 to +100) **Infinite** | 1.25 × (1.25–1.25) **Infinite** | 1.00 × (1.00–1.00) ≈ | 1.25 × (1.25–1.25) **Infinite** |

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
| Captured frames with blank rows (lower is better) | 39.0 % (±6.17) | 17.5 % (±4.80) | 94.5 % (±0.08) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 16.0 % (±1.29) | 6.38 % (±3.11) | 90.1 % (±0.33) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 18.0 rows (±0.00) | 18.0 rows (±0.00) | 18.0 rows (±0.00) | 0.00 rows (±0.00) | 0.00 rows (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Captured frames (higher is better) | 41.0 (±1.53) | 57.0 (±1.63) | 73.0 (±1.00) | 39.0 (±0.98) | 66.0 (±2.43) | 1.61 × (1.48–1.72) **Infinite** | 1.16 × (1.09–1.22) **Infinite** | 0.90 × (0.84–0.93) **PrimeVue** | 1.69 × (1.59–1.72) **Infinite** |
