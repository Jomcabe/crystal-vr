# Implementation and handoff

## Completed
1. [x] Public repository created and plan committed.
2. [x] Minimal pinned A-Frame 1.7.1 static scene committed separately.
3. [x] SC/BCC/FCC, exact integer-half-lattice generation, boundary deduplication, instanced atoms, grid outline and scientific explanations/counts.
4. [x] HTML keyboard/mouse/touch controls and in-world controller-ray menu.
5. [x] Pages enabled manually by owner. Actual HTTPS custom-domain app verified: https://jocabe.com/crystal-vr/ . No domain settings changed by agent.
6. [x] Published Playwright tests, including 5,659 geometry assertions / 15 cases and Chromium touch emulation.
7. [x] Found cold-load favicon 404 at the custom-domain root; fixed with self-contained inline crystal SVG in commit 69ad95015d079ad3422b0c51bc7fc922fe47f323. Waited for deployment success, cleared browser cache, reran canonical URL: full suite passes with zero errors/failed requests.
8. [x] README corrected to actual live URL; reproducible checks and evidence saved in tests/ and TESTING.md.

## Still requires owner / hardware
- Execute README Quest 2 checklist: immersive entry, head tracking, actual controller rays/triggers, stereo/menu usability, frame rate, suspend/resume.
- Execute native iPhone Safari touch tests; Chromium touch emulation is not Safari.
- Future options: offline vendored assets, CSP/SRI, packing/material models, CIF import, grabbing, XR simulation.

## Design invariants
- SC 1, BCC 2, FCC 4 fractionally assigned atoms per conventional cell; distinguish full visible sphere count.
- Single atom InstancedMesh plus grid LineSegments; dispose replaced GPU objects.
- tests/desktop-checks.cjs runs against real published site without response mocks. Use fresh browser/cache-cleared checks as well as warm tests.
- Node geometry tests require no dependencies; optional browser tooling is not a build step.
- Never commit credentials, tokens or environment files.
