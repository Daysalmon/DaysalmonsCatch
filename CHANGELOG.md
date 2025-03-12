# Changelog

All notable changes to the DaysalmonsCatch minigame hub will be documented here.

## [Unreleased]
- (Future changes go here)

## [2025-03-11]
- **Cube Collector:** Fixed sphere spawn bounds (x: ±9, y: ±7) to ensure all are reachable by the cube on both PC and mobile.
- **Site:** Renamed repository from `CubeCollector` to `DaysalmonsCatch` to reflect multi-game hub vision.
- **Site:** Moved Cube Collector game from root `index.html` to `cube-collector/index.html` subfolder.
- **Site:** Added hub landing page at root `index.html` with link to Cube Collector.
- **Site:** Created `CHANGELOG.md` at root to track project-wide changes.

## [2025-03-10]
- **Cube Collector:** Increased mobile swipe speed multiplier to 0.1 (from 0.05) for better responsiveness on Android/Chrome.
- **Cube Collector:** Added mobile touch support with swipe movement (initial multiplier 0.005, then 0.02, finally 0.1).

## [2025-03-09]
- **Cube Collector:** Adjusted sphere spawn logic to fix initial out-of-bounds issues (early tweak before final fix).
- **Site:** Set up initial hub structure with landing page at root and Cube Collector at `/cube-collector/`.

## [2025-03-08]
- **Cube Collector:** Initial release of 3D game—green cube collects red spheres with arrow key movement, score system implemented.
- **Site:** Published game on GitHub Pages under `CubeCollector` repo (originally at root `game.html`, later moved).
