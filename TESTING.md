# Verification record

## Actual published URL
**https://jocabe.com/crystal-vr/** — HTTPS 200, secure context, title `Crystal VR — Crystal explorer`.

The default https://jomcabe.github.io/crystal-vr/ redirects to this custom-domain URL. GitHub deployment metadata reports `http://jocabe.com/crystal-vr/`; use the explicitly tested **HTTPS** address for WebXR. No DNS/domain settings were changed by the agent.

The favicon-fix commit **69ad95015d079ad3422b0c51bc7fc922fe47f323** deployed successfully in [Pages run 40807491368](https://github.com/Jomcabe/crystal-vr/actions/runs/40807491368). The final checks used the canonical URL without a query string, after clearing Chromium's browser cache and disabling its cache during the test. The suite itself was fetched from the published site, not a mock. See tests/results/published-desktop.json.

## Executed checks — PASS
- Geometry validator: **15 cases, 5,659 assertions**. SC/BCC/FCC repeats 1–5; unique counts; coordinate bounds and basis parity; independent fractional occupancy weighting at exterior planes; axis-aligned deduplicated outlines; invalid input rejection. This same validator is used by the Node entry point. The Node runner itself was not executed in this session.
- Structure select and keyboard-operated repeat slider: all 15 combinations match scientific labels and actual InstancedMesh counts.
- All six axis ± buttons: exact ±15° rotation.
- Size buttons, mouse drag and wheel, upper 1.8× and lower 0.4× limits.
- Keyboard Enter on Reset restores initial rotation/size while preserving FCC / 5×5×5 selection.
- VR menu **logical events only**: structure/repeat/rotation/size/reset actions wired, 12 targets, both controller raycaster selectors target `.vr-button`. Not a real controller or XR test.
- Forty additional structure switches: **2 renderer geometries, 2 draw calls** afterward. Limited resource regression check, not GPU memory profiling or headset benchmarking.
- Chromium **390×844** and CDP-injected touch: one-finger rotation, two-finger pinch (1.00× → 1.625×), mobile reset; no horizontal overflow (document width 390).
- Final canonical, browser-cache-cleared run: **zero page/console errors, zero failed network requests, zero warnings captured**. Earlier initial software-GPU runs emitted four `ReadPixels` performance warnings; not headset performance evidence.
- Canonical HTML contains the inline SVG favicon; HTTPS confirmed as a secure context.

## Discovered issues and fixes
1. First Pages requests redirected to the account's custom domain and returned 404 during deployment. Waited for successful publication, confirmed HTTPS 200, corrected stale README publication status and URL.
2. A warm-session run passed, but a subsequent fresh browser found **`https://jocabe.com/favicon.ico` returning 404**. Added an explicit inline SVG favicon to index.html in commit 69ad950; no dependency on root-domain assets remains for the icon.
3. Browser/Pages caches briefly served the old HTML after the fix. Verified the deployed HTML with a version query, then cleared browser cache and reran the complete suite at the **unmodified canonical URL**. All checks passed. If a user sees the old page immediately after deployment, hard-refresh or wait for the Pages cache (`max-age=600`).

Some long combined automation calls exceeded the tool's timeout while retrying; these were not counted as passing runs. The successful final run is recorded separately. No other application JavaScript defects were found by these checks.

## Reproduce
Geometry only, Node 20+, no install/build:

```sh
npm test
```

Optional browser tooling (pinned independently from app):

```sh
npm install --no-save --package-lock=false playwright@1.56.1
npx playwright install chromium
node tests/run-desktop.mjs https://jocabe.com/crystal-vr/
```

The runner launches a new browser. `tests/desktop-checks.cjs` can also be used with an existing Playwright page, but clear browser cache for cold-load regressions. Test tooling is not loaded by the app and is not required by Pages. CDP touch checks require Chromium.

Local testing: serve root with `python3 -m http.server 8000`, pass `http://localhost:8000/` to the runner. An earlier routed preview only checked initial loading; it is not the evidence for published behavior.

## Explicitly untested
- Quest 2 immersive sessions, tracking, stereo comfort, physical controller rays/triggers, headset frame rate, resume/reconnect, permission-denial behavior.
- Real iPhone / native Safari WebGL and gestures. Chromium emulation is not Safari.
- Offline fallback, exhaustive accessibility review, other desktop browsers and long-duration memory profiling.

Owner should run the unchecked Quest checklist in README.md. Continue from PLAN.md; preserve the separate visible-sphere and fractional-occupancy counts.
