# Crystal VR

Static educational SC, BCC and FCC explorer for Meta Quest 2 (WebXR), desktop and iPhone touch. **No build step.** Uses pinned [A-Frame 1.7.1](https://aframe.io/releases/1.7.1/aframe.min.js) and its bundled THREE; no separate THREE version or runtime dependencies. Requires internet access to the pinned CDN.

## Publication status
Repository: https://github.com/Jomcabe/crystal-vr

**Pages has not been enabled or verified live.** Expected address after setup: https://jomcabe.github.io/crystal-vr/ . This is not currently a confirmed live app. The available GitHub tools cannot configure Pages, and the browser session is not authenticated for repository settings.

### Exact GitHub Pages setup (owner)
1. Open https://github.com/Jomcabe/crystal-vr/settings/pages while signed in as the owner.
2. Under **Build and deployment → Source**, select **Deploy from a branch**.
3. Under **Branch**, select **main**, directory **/(root)**, then **Save**.
4. Wait for the **pages build and deployment** action to finish (usually a few minutes), then refresh Pages settings and use **Visit site**.
5. Confirm HTTPS is enabled. Open https://jomcabe.github.io/crystal-vr/ on desktop and in Meta Quest Browser. If the deployment fails, inspect the Actions run; if the URL returns 404, confirm branch/root selection and wait for deployment.

`.nojekyll` is included. GitHub copies the static files; there is no compilation or dependency install. No workflow token, API key, secret, environment file or server is needed. Pages settings require repository administration rights; content write permission alone does not establish those rights.

## Local setup
Clone/download the repository, then from its root run:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 . Do not open `index.html` using `file://`: ES modules need HTTP. Desktop rendering works on localhost; immersive WebXR requires a compatible browser and secure context. Opening an HTTP LAN IP on a Quest is not a secure context; use the HTTPS Pages URL instead.

Optional geometry tests: Node.js 20+; `npm test` (no npm install needed). `tests/geometry-checks.js` also exports the same validation for browser execution. See TESTING.md for executed checks and hardware gaps.

## Controls
- **Structure:** SC, BCC, FCC. Repeat slider selects 1×1×1 through 5×5×5; block is automatically fitted to the same extent.
- **Rotate:** X/Y/Z buttons change 15° per click. Desktop mouse drag / one-finger touch drag rotates X/Y.
- **Scale:** +/− buttons, mouse wheel or two-finger pinch; limited to 0.4–1.8×. Scroll outside the canvas to scroll the mobile page.
- **Reset view:** restores initial rotation and 1× size, preserving structure/repeat choices.
- **Quest 2:** load in Meta Quest Browser, select Enter VR and accept permission. Both controller rays target the floating menu; aim and press trigger to switch structure, change cells, rotate, scale or reset. Menu is world-fixed in front-left of the starting position, not head-locked. Turn back toward the starting direction if you lose it. Use the browser/system VR exit to leave immersive mode. No locomotion or controller grabbing in v1.
- HTML buttons work with keyboard, mouse and touch; structure select and range have labels. The 3D scene itself has no screen-reader geometry representation; the live facts panel provides its scientific summary.
- iPhone: touch 3D mode, not immersive VR. VR entry is intentionally disabled when immersive-vr is unsupported.

## Scientific model
Conventional cubic cells use unit lattice constant. Corner coordinates are integers; BCC adds (½,½,½); FCC adds (0,½,½), (½,0,½), (½,½,0) and translations. Integer half-lattice keys prevent floating-point duplicates. The block is centered for display only.

| Structure | Atoms per conventional cell | Unique spheres in n³ cells | n=1 | n=5 |
|---|---:|---|---:|---:|
| SC | 1 | (n+1)³ | 8 | 216 |
| BCC | 2 | (n+1)³+n³ | 9 | 341 |
| FCC | 4 | (n+1)³+3n²(n+1) | 14 | 666 |

The renderer shows full spheres, including boundary atoms. Fractional contribution is a different count: corners contribute ⅛ and face centers ½ **per conventional cell**. The panel reports both the number of unique visible sphere centers and the fractionally assigned total n³×(1,2,4). This is an ideal periodic-lattice bookkeeping convention, not a claim that a finite physical nanoparticle contains a fractional number of atoms.

One InstancedMesh draws all atoms; one LineSegments mesh draws the conventional-cell grid without duplicate collinear segments. Rebuilding disposes previous GPU resources. Small non-touching spheres and colors are schematic and distinguish site types, **not different elements**, physical radii, packing fractions or bonds. No lattice dynamics, diffraction, chemical species, free surface relaxation or crystallographic file import in v1.

## Quest 2 acceptance checklist (hardware testing still required)
- [ ] Page loads over HTTPS; CDN accessible; no blank scene.
- [ ] Enter/exit VR succeeds, stereo depth and floor-relative camera are comfortable; head tracking works.
- [ ] Left and right controller rays appear; trigger click and hover feedback work independently.
- [ ] Menu text is readable, reachable by ray, does not obscure the crystal and remains findable after turning.
- [ ] Cycle all 3 structures; repeat from 1 to 5 and back; counts match the table.
- [ ] All axis ± buttons, size ± and reset work in VR; reset retains structure/repeat.
- [ ] Exit/re-enter VR; menu and HTML controls recover; permissions denial is handled.
- [ ] FCC 5×5×5 remains comfortable during rotation and repeated structure switching; inspect frame rate on actual hardware, not desktop draw-call counts.
- [ ] No accumulating stalls/memory growth after repeated rebuilding; test suspend/resume and controller reconnect.
- [ ] Use seated/stationary guardian clearance; no physical reaching or walking is needed.

## Known limitations / handoff
Desktop checks cannot establish Quest performance, controller ergonomics or native iOS Safari gesture behavior. Browser WebGL warnings from the software test GPU are not headset performance measurements. There is no offline cache, build system, telemetry or backend. A CDN failure prevents 3D loading. Full CSP/SRI hardening and CDN vendoring are future work. See PLAN.md and TESTING.md before continuing.
