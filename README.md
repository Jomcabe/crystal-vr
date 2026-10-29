# Crystal VR

Static educational SC, BCC and FCC explorer for Meta Quest 2 (WebXR), desktop and iPhone touch. **No build step.** Uses pinned [A-Frame 1.7.1](https://aframe.io/releases/1.7.1/aframe.min.js) and its bundled THREE, not a second THREE release. Internet access to the pinned CDN is required.

## Live app

**https://jocabe.com/crystal-vr/**

Repository: https://github.com/Jomcabe/crystal-vr

GitHub Pages is enabled and deployment succeeded. The default https://jomcabe.github.io/crystal-vr/ redirects to the account's custom domain, **jocabe.com**. HTTPS returned 200 and the published app passed Playwright desktop checks. Deployment metadata reports an HTTP environment URL; **use the tested HTTPS address above for WebXR**. See TESTING.md for evidence and untested hardware items.

### Hosting settings / recovery
Under [Settings → Pages](https://github.com/Jomcabe/crystal-vr/settings/pages), use **Deploy from a branch**, **main**, **/(root)**. `.nojekyll` is included. GitHub copies the static files; no compilation or dependency installation is required. Wait for **pages build and deployment** to succeed after a commit. A newly enabled site may temporarily return 404 while deployment runs. No custom-domain settings were modified by this implementation.

No workflow token, API key, environment file, server or secret is needed. Repository administration access is required to change Pages settings; content-write access alone is not sufficient.

## Local setup
Clone/download the repository, then from its root run:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 . Do not use `file://`: ES modules need HTTP. Desktop rendering works on localhost; immersive WebXR requires a compatible browser and secure context. An HTTP LAN IP on Quest is not a secure context; use the HTTPS Pages URL instead.

Geometry tests: Node.js 20+; `npm test` (no npm install needed). Browser regression instructions are in TESTING.md. Test tooling is optional and does not participate in deployment.

## Controls
- **Structure:** SC, BCC, FCC. Repeat slider selects 1×1×1 through 5×5×5; the block is fitted to the same overall extent when repeat changes.
- **Rotate:** X/Y/Z buttons change 15° per click. Mouse drag / one-finger touch drag rotates X/Y.
- **Scale:** +/− buttons, wheel or two-finger pinch; limited to 0.4–1.8×. Scroll outside the canvas to scroll the mobile page.
- **Reset view:** restores initial rotation and 1× size, preserving structure/repeat choices.
- **Quest 2:** open the HTTPS app in Meta Quest Browser, select Enter VR and accept permission. Either controller ray can target the floating menu; aim and press trigger to switch structure, repeat cells, rotate, scale or reset. The menu is world-fixed in front-left of the starting position, not head-locked. Turn toward the starting direction if you lose it. Use the browser/system VR exit to leave. No locomotion or controller grabbing in v1.
- HTML buttons support keyboard, mouse and touch. Select and range have labels. The live facts panel summarizes the scientific state; there is no screen-reader geometry representation.
- **iPhone:** touch 3D mode, not immersive VR. VR entry is disabled when immersive-vr is unsupported. Real iPhone Safari validation remains outstanding.

## Scientific model
Conventional cubic cells use unit lattice constant. Corner coordinates are integers; BCC adds (½,½,½); FCC adds (0,½,½), (½,0,½), (½,½,0) and translations. Integer half-lattice keys prevent floating-point duplicates. The block is centered for display only.

| Structure | Atoms per conventional cell | Unique spheres in n³ cells | n=1 | n=5 |
|---|---:|---|---:|---:|
| SC | 1 | (n+1)³ | 8 | 216 |
| BCC | 2 | (n+1)³+n³ | 9 | 341 |
| FCC | 4 | (n+1)³+3n²(n+1) | 14 | 666 |

The renderer shows full spheres, including boundary atoms. Fractional contribution is a different count: corners contribute ⅛ and face centers ½ **per conventional cell**. The panel reports both unique visible sphere centers and the fractionally assigned total n³×(1,2,4). This is ideal periodic-lattice bookkeeping, not a claim that a finite physical nanoparticle contains fractional atoms.

One InstancedMesh draws all atoms; one LineSegments mesh draws the conventional-cell grid without duplicate coincident edges. Rebuilding disposes previous GPU resources. Small non-touching spheres and colors are schematic and distinguish site types, **not different elements**, physical radii, packing fractions or bonds. No lattice dynamics, diffraction, chemical species, surface relaxation or crystallographic file import in v1.

## Quest 2 acceptance checklist — not yet hardware-tested
- [ ] Page loads over HTTPS; CDN accessible; no blank scene.
- [ ] Enter/exit VR succeeds; stereo depth and floor-relative camera comfortable; head tracking works.
- [ ] Both controller rays appear; trigger click and hover feedback work independently.
- [ ] Menu readable, targetable, does not obscure crystal, findable after turning.
- [ ] Cycle all structures; repeat 1 to 5 and back; counts match table.
- [ ] All axis ±, size ±, reset work; reset retains structure/repeat.
- [ ] Exit/re-enter VR; menu and HTML controls recover; permission denial handled.
- [ ] FCC 5×5×5 comfortable during rotation and repeated switching; measure actual headset frame rate.
- [ ] No accumulating stalls after repeated rebuilding; test suspend/resume and controller reconnect.
- [ ] Use stationary/seated guardian clearance; no walking or physical reaching required.

## Known limitations / handoff
Desktop checks cannot establish Quest performance, tracking, controller ergonomics or native iOS Safari behavior. Logical VR menu event tests are **not** controller tests. Two desktop draw calls are not a headset frame-rate guarantee. Initial software-GPU ReadPixels warnings occurred in automation, not app JavaScript failures. No offline cache, build system, telemetry or backend; a CDN failure prevents 3D loading. Full CSP/SRI hardening and CDN vendoring are future work. See PLAN.md and TESTING.md before continuing.
