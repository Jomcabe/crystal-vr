# Verification record

## Published URL and deployment
- App: **https://jocabe.com/crystal-vr/** — HTTPS 200, title `Crystal VR — Crystal explorer`.
- https://jomcabe.github.io/crystal-vr/ redirects to the URL above because the account uses a custom domain.
- GitHub `pages build and deployment` run [40806784300](https://github.com/Jomcabe/crystal-vr/actions/runs/40806784300) completed successfully for `ba498cf7845ebf6b88f2b6d2d4d98d5a41f1f8f7`.
- Deployment 7402519684 for `fbf4fe12a5ddbcfd68ec0538d50ee8b7968f38ab` also reported success. Its environment metadata uses `http://jocabe.com/crystal-vr/`; we explicitly tested and recommend **HTTPS** for WebXR.
- Tests below ran against the real published app, with no response interception or mocked library/XR API. An earlier routed preview only checked initial loading; it is not the evidence for published behavior.

## Executed checks — PASS
The committed `tests/desktop-checks.cjs` was loaded from commit `fbf4fe12a5ddbcfd68ec0538d50ee8b7968f38ab` and executed through Playwright against the HTTPS app.

- Geometry validator: **15 cases, 5,659 assertions**. All SC/BCC/FCC repeats 1–5; unique counts; coordinate bounds and basis parity; independent fractional occupancy weighting at exterior planes; axis-aligned, deduplicated outline segments; invalid input rejection. The same validator is used by the Node test entry point. The Node runner itself was not executed in this session.
- Desktop select and keyboard-operated slider: all 15 combinations match expected visible sphere counts and InstancedMesh counts; scientific labels update.
- Six X/Y/Z ± buttons: exact ±15° changes.
- Scale up/down, mouse drag, mouse wheel; lower 0.4× and upper 1.8× bounds.
- Keyboard Enter on Reset: restores orientation/size without changing FCC / 5×5×5 selection.
- VR menu **logical events only**: structure/repeat/rotation/size/reset actions connected; 12 target planes; both controller raycaster selectors target `.vr-button`. No real controller or XR session used.
- Forty additional structure rebuilds: renderer reports **2 geometries, 2 draw calls** afterward. This is a limited resource-regression check, not a GPU memory profile or performance benchmark.
- Chromium narrow viewport **390×844**, real CDP touch-event injection: one-finger rotation, two-finger pinch (1.00× → 1.625×), mobile reset; no horizontal overflow (document width 390).
- Final committed-suite result: **zero page/console errors, zero failed network requests, zero warnings captured on that run**. Earlier first-load runs emitted four software-GPU `ReadPixels` performance warnings; no A-Frame/application errors. Do not infer Quest GPU behavior from these warnings or their absence.

## Reproduce
Geometry only, Node 20+ (no install/build):

```sh
npm test
```

Optional browser tooling, pinned independently of the app:

```sh
npm install --no-save --package-lock=false playwright@1.56.1
npx playwright install chromium
node tests/run-desktop.mjs https://jocabe.com/crystal-vr/
```

For local HTTP testing, serve repository root with `python3 -m http.server 8000` and pass `http://localhost:8000/` to the runner. The runner uses Chromium-specific CDP for touch emulation. Playwright tooling is not loaded by the app and is not required by GitHub Pages. The hosted runner is not executable in the page; run it locally with Node.

## Issues discovered / resolution
- Initial default Pages address redirected to the account custom domain and temporarily returned 404 during deployment. Waited for successful deployment; verified HTTPS 200. No DNS/domain settings were changed.
- README initially claimed Pages was not enabled and gave only the default candidate URL. Corrected to the observed custom-domain URL and confirmed live status.
- No application JavaScript defects were found by the executed published-site suite; no application changes were needed to achieve these passing checks.

## Explicitly untested
- Quest 2 immersive session, tracking, stereo comfort, controller hardware, real ray-hit/trigger behavior, headset frame rate, resume/reconnect and permissions-denial handling.
- Real iPhone / native Safari touch and WebGL behavior (Chromium emulation is not Safari).
- Offline operation, CDN failure fallback, exhaustive accessibility review, other desktop browsers and long-duration memory profiling.

Owner should run the unchecked Quest list in README.md. Another agent can rerun the saved checks, inspect current Pages deployment, and continue from PLAN.md without relying on chat history.
