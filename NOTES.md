# Snap mechanic: reconstruction notes

Target: `unzipped/lib/arm64-v8a/libil2cpp.so` (arm64 ELF, sha256 `d9a679c1…3bffe`).

**Address shift:** the dump's `RVA`/`Offset` values are file offsets. The r-x LOAD segment maps file
`0x3D3BBBC` to vaddr `0x3D3FBBC`, so **real VA = dump value + 0x4000**. Every method below was
disassembled at the shifted address (each one starts on a prologue there, and not at the unshifted one).

Hopper (REA's only pseudocode provider here) timed out on initial analysis of the 179 MB library, so the
C# below is hand-decompiled from `objdump` disassembly. Calls into Unity/DOTween were named from the dump's
RVA table; a few names are inferred from context (noted).

## Field layout used

| Object | Offset | Field |
|---|---|---|
| MouseInteractNSnap | 0x28 / 0x30 | dragData / dropData |
| | 0x40 | initSnapPoints |
| | 0x48 / 0x4C | cdTime / snapTime |
| | 0x50 | cdTimer (STimer, running flag at +0x58) |
| | 0x58 | _lastPosition (Vector2) |
| | 0x60 | _level (LevelBase) |
| | 0x70 | _actionTween |
| | 0x88 | sqrDistanceToSnap |
| | 0x90 | currentSnapPoint |
| DropData | 0x38 / 0x48 / 0x4C | SnapPoints / IsCheckSnap / DistanceToSnap |
| SnapPoint | 0x28 / 0x29 | canSnap / isSnap |
| NSnapPoint | 0x30 / 0x38 / 0x40 | _OnSnap / _OnUnSnap / isCanSnapMultipleTimes |

## Reconstructed C#

```csharp
// KAPSnapPoint
void ChangeCanSnap(bool snap)  => canSnap = snap;     // 0x5979448
void ForceChangeSnap(bool snap) => isSnap = snap;     // 0x597943C
void OnSnap() { }                                     // 0x5979438, empty
void Show() {                                         // 0x5979360
    gameObject.SetActive(true);
    var s = Tf.localScale;
    Tf.localScale = Vector3.zero;
    Tf.DOScale(s, 0.3f);                              // const read from 0x1CF0A48
}

// NSnapPoint.IsSnap setter (0x61D8894)
set {
    if (!isCanSnapMultipleTimes && isSnap) return;    // a filled single-use point cannot be cleared
    isSnap = value;
    (value ? _OnSnap : _OnUnSnap)?.Invoke();
}

// MouseInteractNSnap
void Awake() {                                        // 0x61D8584
    _cam = Camera.main;
    sqrDistanceToSnap = dropData.DistanceToSnap * dropData.DistanceToSnap;
    if (cdTime > 0) cdTimer = STimerPool.Pop();       // pool type inferred
}
void Start() => _level = LevelBase.instance;          // 0x61D8654
void OnEnable() {                                     // 0x61D86A8
    currentSnapPoint = null;
    if (isFindFirstSnapPoint) FindCurrentSnapPoint();
}

int CanSnap {                                         // 0x61D8110
    get {
        float best = float.MaxValue; int idx = -1;
        for (int i = 0; i < dropData.SnapPoints.Length; i++) {
            var p = dropData.SnapPoints[i];
            if (p == null || !p.canSnap || p.isSnap) continue;
            float d = ((Vector2)p.Tf.position - (Vector2)Tf.position).sqrMagnitude;
            if (d < sqrDistanceToSnap && d < best) { best = d; idx = i; }
        }
        return idx;
    }
}

int FindNearestSnapPoint(bool checkIsSnap = false, bool checkCanSnap = true,
                         bool checkInitSnapPoints = false) {   // 0x61D8280
    // Same loop as CanSnap without the distance limit; filters are optional.
    // With checkInitSnapPoints it also scans initSnapPoints and returns SnapPoints.Length + j.
}

void OnMouseDown() {                                  // 0x61D88CC
    if (!enabled || (cdTimer != null && cdTimer.IsRunning)) return;
    if (!dragData.Use || !_level.IsAllowInteract || dragData.IsDragging) return;
    dragData.IsDragging = true;
    _lastPosition = _cam.ScreenToWorldPoint(Input.mousePosition);
    dragData._OnDrag?.Invoke();
    _actionTween?.Kill(); _rotateTween?.Kill();
    PlaySFX(dragData.DragSound, 1f);
    MMVibrationManager.Haptic((HapticTypes)4);
    if (dropData.IsCheckSnap && currentSnapPoint != null)
        currentSnapPoint.IsSnap = false;              // inlined setter
}

void OnMouseDrag() {                                  // 0x61D8A94
    if (!enabled || !dragData.Use || dropData == null || !dragData.IsDragging) return;
    Vector2 w = _cam.ScreenToWorldPoint(Input.mousePosition);
    Tf.position += (Vector3)(w - _lastPosition);      // delta move keeps the grab offset
    _lastPosition = w;
}

void OnMouseUp() {                                    // 0x61D8B58
    if (!enabled || !dropData.Use || !dragData.IsDragging) return;
    dragData.IsDragging = false;
    if (dropData.DistanceToSnap > 0) {
        int idx = CanSnap;
        if (idx >= 0) { SnapToSnapPoint(idx); dropData._OnDrop?.Invoke(); }
        else          { CancelDragging(); dragData._OnCancelDrag?.Invoke(); }
    } else dropData._OnCancelDrop?.Invoke();
    cdTimer?.Start(cdTime);
}

void CancelDragging() {                               // 0x61D8C08, does not move the item back
    dragData.IsDragging = false;
    PlaySFX(dragData.CancelDragSound, 1f);
}

void SnapToSnapPoint(int index) {                     // 0x61D8C30
    currentSnapPoint = dropData.SnapPoints[index];
    currentSnapPoint.IsSnap = dropData.IsCheckSnap;   // claimed before the tween
    if (snapTime > 0) {
        _actionTween?.Kill();
        _actionTween = Tf.DOMove(currentSnapPoint.Tf.position, snapTime)
                         .SetEase(Ease.OutBack)       // enum value 27
                         .OnComplete(() => RaiseSnap(index));   // <SnapToSnapPoint>b__0, 0x61D8FDC
    } else {
        Tf.position = currentSnapPoint.Tf.position;
        RaiseSnap(index);
    }
}
void RaiseSnap(int index) {                           // shown as a helper; inlined twice in the binary
    dropData._OnSnap?.Invoke();
    PlaySFX(dropData.SnapSound, 1f);
    if (index < dropData._OnSnaps.Length) dropData._OnSnaps[index]?.Invoke();
}

void ForceSnap() {                                    // 0x61D8F68
    int i = FindNearestSnapPoint(true, true, false);
    if (i >= 0) SnapToSnapPoint(i);
}
```

## How the level knows it is done

`MouseInteractNSnap` never touches the level beyond reading `_level.IsAllowInteract`. Completion is
assembled in each level's scene: the inspector wires `_OnSnap` / `_OnSnaps[i]` / `NSnapPoint._OnSnap`
to a level script. Example, `LevelRubbishBeach`:

```csharp
void CheckSnapDecorator(NSnapObject so) {             // 0x64B42A0
    if (decorSnapObjects.Remove(so) && decorSnapObjects.Count == 0) OnEndGame();
}
void OnEndGame() {                                    // 0x64B432C
    endParticle.Play();
    PlaySFX(endSound, volume);
    this.WaitToDo(1.5f, EndGame);                     // virtual slot inferred as EndGame
}
// LevelBase.EndGame (0x63C1DC4)
if (IsInEndGameState) return;                         // states 2..6, mask 0x7C
ChangePlayState(LevelPlayState.Begin_Win);            // adds BlockPlayerInteract + StopTime modifiers
... fire win callbacks, HProcess.InvokeActionByKey(3, ...) ...
StartCoroutine(CorWaitEndGame());
```

Once `Begin_Win` is set, `IsAllowInteract` (0x63BE6D4: `BlockPlayerInteractModifiers.Count == 0`)
is false, so `OnMouseDown` rejects every further drag.

## Web rebuild

Files: `tidy-snap.html` (page and styles), `game.js` (engine), `levels.js` / `levels2.js` / `levels3.js` (20 levels),
`art*.js` (all drawings), `chars.js` (the six friends).

**Kept from the binary:** `CanSnap`'s rules (nearest free open point inside `DistanceToSnap`, 2D distance), the delta drag,
single-use points that cannot be cleared once filled, a point being claimed before the 0.25 s `OutBack` move, events raised only
after the move, the cooldown after each drop, items staying where dropped on a miss, `KAPSnapPoint.Show()`'s 0.3 s scale-in,
`ChangeCanSnap`, `ForceSnap` (the Help button), and the remove from list, 1.5 s, `EndGame`, block-input flow. The bin uses
the "can snap multiple times" behaviour.

**Added for the level design (not in the binary):**

| Idea | How it works |
|---|---|
| Phases | Slots, items and tasks carry a phase. A phase opens when everything in the previous one is done. Slots open with `ChangeCanSnap(true)` + `Show()` |
| Stacks | `needs` = another slot that must be filled first (sandwich, pancakes, bed, plates, tins) |
| Stations | Fill every slot of a station and the items are consumed and turn into something new (flour + eggs + butter + sugar → batter cups) |
| Processes | After combining: scrub to whisk or knead, or wait on a timer (steam, bake) |
| Cooking slots | The item cooks for a few seconds, changes how it looks and group, and has to be lifted out again |
| Tasks | scrub (rub across a stain or mixture), chop (swipe across an ingredient to make pieces), open (tap a box, drawer, door) |
| Hidden items | Items can sit inside a box, and a small box can sit inside a big one |
| Exact spots | Every item has its own group, so sorting is by colour, design or size. `show` previews the right look in the slot |
| Junk | Bin items, some marked rotten. Dropping an item on the wrong kind of spot bounces it home and costs a slip |
| Stars | 3 for 0-1 slips, 2 for up to 3, otherwise 1 |
| Friends | Finishing a level introduces its character, saved in the browser |

Automated play-testing: `window.__tidy.step()` does the next legal action (the same logic as the Help button), so every level
can be played to its finale in a loop.
