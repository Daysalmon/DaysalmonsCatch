# Changelog

All notable changes to the DaysalmonsCatch minigame hub will be documented here.

## [Unreleased]
- (Future changes go here)

## [2025-03-12]
- **Cube Collector:** Tweaked vertical mobile speed and bounds visibility.
  - *Details:*
    - Vertical swipe speed: `0.07` (was `0.05`), matches landscape.
    - Vertical sphere x-range: `±5` (was `±6`) for better visibility.
    - Vertical camera: `z = 25` (was `20`) to fit `x: ±10` bounds.
## [2025-03-12] - Hub Page Revamp
- Redesigned index.html with fisherman theme (sea gradient, wood tones)
- Added game cards with hover effects
- Introduced mock "Buy Blaster" button linking to /payments/coming-soon.html
- Updated styling for responsive, chill vibe
## [0.1.0] - 2025-03-12
### Added
- Initial BattleTank game setup with Three.js at BattleTank/index.html
- Basic tank movement (WASD) and shooting (Space)
- Low-poly tank and ground visuals
 ## [2025-03-12] - Added BattleTank
- Added BattleTank game link to index.html
- Included mock "Buy Tank Shells" button linking to /payments/coming-soon.html

## [2025-03-11]
- **Cube Collector:** Fixed sphere spawn bounds (x: ±9, y: ±7) to ensure all are reachable by the cube on both PC and mobile.
- **Site:** Renamed repository from `CubeCollector` to `DaysalmonsCatch` for multi-game hub vision.
- **Site:** Moved Cube Collector game from root `index.html` to `cube-collector/index.html` subfolder.
- **Site:** Added hub landing page at root `index.html` with link to Cube Collector.
- **Site:** Created `CHANGELOG.md` at root to track project-wide changes.
- **Cube Collector:** Added vertical mobile support with dynamic camera adjustment (FOV and position).
  - *Details:* 
    - Added `updateCamera()` function:
      - Vertical (aspect < 1): `fov = 50`, `z = 20`—zooms out to fit `x: ±9`.
      - Landscape (aspect > 1): `fov = 75`, `z = 15`—original immersive view.
    - Added resize listener to call `updateCamera()` on window resize/orientation change—keeps it responsive.
    - Retained existing bounds: speed (`0.1`), cube (`x: ±10`, `y: ±8`), spheres (`x: ±9`, `y: ±7`).
- **Cube Collector:** Adjusted mobile swipe speed and sphere spawn for better vertical/landscape play.
  - *Details:*
    - Swipe speed: Vertical `0.05`, Landscape `0.07` (was `0.1` for both).
    - Sphere x-range: Vertical `±6`, Landscape `±9` (was `±9` for both).
    - Used aspect ratio to dynamically set speed and spawn bounds.
- **Cube Collector:** Adjusted horizontal speed and vertical bounds/size for mobile.
  - *Details:*
    - Horizontal swipe speed: `0.1` (was `0.07`).
    - Vertical sphere x-range: `±4` (was `±5`) for visibility.
    - Vertical camera: `fov = 45` (was `50`), `z = 30` (was `25`) to fit `x: ±10` and balance object size.
## [2025-03-10]
- **Cube Collector:** Increased mobile swipe speed to 0.1 multiplier (from 0.05) for better responsiveness on Android/Chrome.
- **Cube Collector:** Added mobile touch support with swipe movement (initial multiplier 0.005, then 0.02, finally 0.1).

## [2025-03-09]
- **Cube Collector:** Adjusted sphere spawn logic to fix initial out-of-bounds issues (early tweak before final fix).
- **Site:** Set up initial hub structure with landing page at root and Cube Collector at `/cube-collector/`.

## [2025-03-08]
- **Cube Collector:** Initial release of 3D game—green cube collects red spheres with arrow key movement, score system implemented.
- **Site:** Published game on GitHub Pages under `CubeCollector` repo (originally at root `game.html`, later moved).
