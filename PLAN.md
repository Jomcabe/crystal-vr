# Implementation and handoff

## Steps
1. [x] Create public repository and record plan.
2. [ ] Minimal pinned A-Frame scene, static assets, no build.
3. [ ] SC/BCC/FCC generators; shared-boundary deduplication; instanced rendering; desktop, touch and VR controls.
4. [ ] Publish GitHub Pages if authorized, otherwise document manual setup.
5. [ ] Playwright checks and fixes; document evidence.

## Design
- A-Frame 1.7.1 (bundled THREE), WebXR, static ES modules.
- Integer half-lattice coordinates avoid floating-point deduplication errors.
- Distinguish unique displayed full spheres from fractional conventional-cell occupancy (SC 1, BCC 2, FCC 4).
- One instanced atom mesh, unit-cell line segments, repeat range 1–5.
- Accessible HTML controls and separate controller-ray-operated VR menu.
- Geometry tests run without browser using Node's built-in test runner. No build step.

## Verification boundary
Desktop browser tests are not headset validation. User will test Quest 2 tracking, controller usability and performance. No credentials, tokens or environment files may be committed.
