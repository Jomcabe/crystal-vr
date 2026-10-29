# Implementation and handoff

## Completed
1. [x] Public repository created and plan committed.
2. [x] Minimal pinned A-Frame 1.7.1 static scene committed separately.
3. [x] SC/BCC/FCC, exact integer-half-lattice generation, shared-boundary deduplication, instanced rendering, grid outline, scientific counts and explanations.
4. [x] HTML keyboard/mouse/touch controls and in-world controller-ray menus.
5. [x] Pages enabled manually by owner. Successful deployment and actual HTTPS custom-domain URL verified: https://jocabe.com/crystal-vr/ . No domain changes made by agent.
6. [x] Published desktop Playwright suite passes; 5,659 geometry assertions across 15 cases; touch emulation passes. No application runtime errors found, so no speculative application-code changes were made. Fixed stale README publication status after discovering the custom-domain redirect.
7. [x] Reproducible checks and handoff saved in tests/, README.md and TESTING.md.

## Still requires the owner / hardware
- Execute README Quest 2 acceptance checklist: immersive entry, tracking, actual controller rays/triggers, usability, frame rate, suspend/resume.
- Execute native iPhone Safari touch testing; Chromium touch emulation is not Safari.
- Optional future work: vendor pinned assets for offline use, CSP/SRI, materials/packing models, CIF import, controller grabbing, automated XR simulation.

## Design invariants
- SC 1, BCC 2, FCC 4 fractionally assigned atoms per conventional cell.
- Visible full sphere counts differ from fractional occupancy. Maintain separate labels and tests.
- Single atom InstancedMesh + grid LineSegments; dispose replaced GPU objects.
- Browser tests in tests/desktop-checks.cjs operate against the published site without request mocks.
- Node built-in geometry tests require no dependencies; browser tooling is optional, not a build step.
- No credentials, tokens or environment files may be committed.
