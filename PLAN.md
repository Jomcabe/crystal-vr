# Implementation and handoff

1. [x] Public repository and plan committed.
2. [x] Minimal pinned A-Frame 1.7.1 static scene committed.
3. [ ] Crystal generation, instanced atoms, scientific counts and input controls.
4. [ ] GitHub Pages publication.
5. [ ] Automated geometry and Playwright tests; fix issues and record results.

Design: integer half-lattice coordinates deduplicate shared atoms; separate unique rendered sphere count from fractional conventional-cell occupancy (1/2/4). One instanced atom mesh; grid line segments. Separate accessible HTML controls and ray-operated VR menu. Node built-in geometry tests; no build required. User performs Quest 2 hardware acceptance tests. Never commit credentials or environment files.
