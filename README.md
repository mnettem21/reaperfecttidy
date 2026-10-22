# perfecttidyrea

A reverse-engineering study of the snap mechanic in *Perfect Tidy*, rebuilt as a small web game.

## What is here

- `NOTES.md`: how items decide to snap (`MouseInteractNSnap`, `KAPSnapPoint`) and how a level knows it is done, decompiled from the arm64 `libil2cpp.so` with REA and `objdump`. Includes the address-shift finding (dump RVAs are file offsets, real address = value + `0x4000`).
- `web/`: **Tidy Snap**, a plain HTML/JS game with 20 levels (cooking recipes, unpacking and building rooms, sorting by colour, design and size) and six animal friends who visit when you finish a level.

No game binaries, assets or decompiled dumps are included; all art is drawn from scratch in SVG.

## Run it

```bash
cd web
python3 -m http.server 8000
```

Then open http://localhost:8000. Progress and friends are saved in the browser.

## Layout

| File | Purpose |
|---|---|
| `web/index.html` | page, styles |
| `web/game.js` | engine: snapping, phases, stations, tasks, finale |
| `web/levels.js`, `levels2.js`, `levels3.js` | cooking, furniture, organizing levels |
| `web/art*.js`, `web/chars.js` | drawings and the characters |

For automated play-testing, `window.__tidy.step()` performs the next legal action.
