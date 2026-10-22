(() => {
'use strict';
const W = 1000, H = 700;
const LEVELS = window.LEVELS, CHARS = window.CHARS, ART = window.ART;
const CATS = ['Cooking', 'Unpacking', 'Organizing'];
const $ = (s) => document.querySelector(s);
const stage = $('#stage'), world = $('#world');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DEF_ROWS = [{ x0: 40, x1: 960, y: 692 }];

const read = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} };
const done = read('tidy-snap-v3', {});                  // level id -> best stars
const friends = new Set(read('tidy-snap-friends', []));
let room = Math.min(Math.max(0, read('tidy-snap-room', 0) | 0), LEVELS.length - 1);
let cat = LEVELS[room].cat;

let k = 1;
function fit() { k = stage.clientWidth / W; world.style.transform = `scale(${k})`; }
new ResizeObserver(fit).observe(stage);
const svgWrap = (a) => `<svg viewBox="0 0 ${a.w} ${a.h}" aria-hidden="true">${a.svg}</svg>`;
const el = (cls, html = '') => { const d = document.createElement('div'); d.className = cls; if (html) d.innerHTML = html; return d; };

/* ---------- sound + haptics ---------- */
let actx = null, muted = false;
function tone(f, dur, type = 'sine', vol = .12, when = 0) {
  if (muted) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime + when, o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + .02);
  } catch (_) {}
}
const SFX = {
  drag: () => tone(540, .06, 'triangle', .09),          // dragData.DragSound
  cancel: () => tone(210, .14, 'sine', .1),             // dragData.CancelDragSound
  snap: () => { tone(660, .07, 'triangle', .11); tone(990, .1, 'triangle', .1, .06); },   // dropData.SnapSound
  sizzle: () => { tone(320, .18, 'sawtooth', .04); tone(1200, .12, 'triangle', .05, .1); },
  ding: () => { tone(1320, .2, 'sine', .1); tone(1760, .3, 'sine', .08, .08); },
  pop: () => tone(780, .07, 'sine', .08),
  scrub: () => tone(260 + Math.random() * 80, .05, 'triangle', .035),
  chop: () => { tone(180, .06, 'square', .06); tone(90, .09, 'square', .05, .02); },
  bin: () => { tone(160, .12, 'triangle', .1); tone(120, .16, 'triangle', .08, .08); },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .22, 'triangle', .1, i * .11)),
};
const haptic = () => { try { if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return; navigator.vibrate && navigator.vibrate(12); } catch (_) {} };   // MMVibrationManager.Haptic(4)

/* ---------- tweens (DOTween stand-ins) ---------- */
const outBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2; };   // Ease 27
const outQuad = (t) => 1 - (1 - t) * (1 - t);                                                                 // DOTween default
function tween(dur, ease, step, end) {
  const h = { killed: false };
  if (dur <= 0 || reduceMotion) { step(1); end && end(); return h; }
  const t0 = performance.now();
  (function frame(now) {
    if (h.killed) return;
    const t = Math.min(1, (now - t0) / (dur * 1000));
    step(ease(t));
    t < 1 ? requestAnimationFrame(frame) : end && end();
  })(t0);
  return h;
}
const kill = (h) => { if (h) h.killed = true; };

/* ---------- layout of unplaced items along rows ---------- */
function rng(seed) { return () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function layout(items, rows, rot, rand) {
  const gap = 12; let i = 0;
  rows.forEach((row, ri) => {
    const span = row.x1 - row.x0, last = ri === rows.length - 1, take = [];
    let wsum = 0;
    while (i < items.length) {
      const next = wsum + (take.length ? gap : 0) + items[i].art.w;
      if (!last && take.length && next > span * 1.12) break;
      take.push(items[i]); wsum = next; i++;
    }
    if (!take.length) return;
    let xs;
    if (wsum <= span) { let x = row.x0 + (span - wsum) / 2; xs = take.map((it) => { const c = x + it.art.w / 2; x += it.art.w + gap; return c; }); }
    else {
      const a = row.x0 + take[0].art.w / 2, b = row.x1 - take[take.length - 1].art.w / 2;
      xs = take.map((_, j) => take.length === 1 ? (row.x0 + row.x1) / 2 : a + (b - a) * j / (take.length - 1));
    }
    take.forEach((it, j) => {
      it.x = xs[j];
      it.y = row.y - it.art.h / 2;
      it.r = (rand() * 2 - 1) * (row.rot ?? rot);
    });
  });
}

/* ---------- level state ---------- */
const SNAP_TIME = .25, CD_TIME = .15;
let L = null;
const logEl = $('#log');
function log(text, kind = '') {
  const li = document.createElement('li'); li.textContent = text; if (kind) li.className = kind;
  logEl.prepend(li); while (logEl.children.length > 40) logEl.lastChild.remove();
}
function place(node, x, y, w, h, r = 0, s = 1) { node.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${r}deg) scale(${s})`; }
const later = (ms, fn) => { const tok = L; setTimeout(() => { if (L === tok) fn(); }, ms); };
const popIn = (node, x, y, w, h, r = 0, dur = .3) => tween(dur, outBack, (p) => place(node, x, y, w, h, r, Math.max(.001, p)));
const stars = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);

function renderPicker() {
  const cats = $('#cats'); cats.innerHTML = '';
  CATS.forEach((c) => {
    const list = LEVELS.filter((l) => l.cat === c);
    const b = document.createElement('button'); b.type = 'button'; b.id = 'cat-' + c.toLowerCase();
    b.innerHTML = `${c}<small>${list.filter((l) => done[l.id]).length}/${list.length}</small>`;
    b.setAttribute('aria-pressed', String(c === cat));
    b.onclick = () => { cat = c; renderPicker(); };
    cats.append(b);
  });
  const chips = $('#chips'); chips.innerHTML = '';
  LEVELS.forEach((l, i) => {
    if (l.cat !== cat) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip' + (done[l.id] ? ' done' : ''); b.id = 'lvl-' + l.id;
    b.innerHTML = `<span class="n">${i + 1}</span>${l.name}${done[l.id] ? `<span class="st" aria-hidden="true">${'★'.repeat(done[l.id])}</span>` : ''}`;
    b.setAttribute('aria-current', String(i === room));
    if (done[l.id]) b.setAttribute('aria-label', `${l.name}, finished with ${done[l.id]} stars`);
    b.onclick = () => { room = i; load(); };
    chips.append(b);
  });
  $('#tally').textContent = `${Object.keys(done).length} of ${LEVELS.length} levels finished`;
  renderFriends();
}
function renderFriends() {
  $('#friends').innerHTML = Object.entries(CHARS).map(([key, c]) => {
    const got = friends.has(key);
    return `<span class="friend${got ? '' : ' locked'}" title="${got ? `${c.name} the ${c.kind}` : 'Finish a level to meet a new friend'}"><svg viewBox="0 20 220 200" aria-hidden="true">${c.svg}</svg><span class="sr">${got ? c.name : 'locked friend'}</span></span>`;
  }).join('');
}

function load() {
  const def = LEVELS[room];
  cat = def.cat; store('tidy-snap-room', room);
  renderPicker();
  stage.querySelectorAll('.finale').forEach((c) => c.remove());
  document.querySelectorAll('.fin-card').forEach((c) => c.remove());
  world.innerHTML = `<svg class="scene" viewBox="0 0 ${W} ${H}">${def.scene}</svg>`;
  L = { def, state: 'Playing', blocked: false, phase: 1, items: [], slots: [], tasks: [], stations: [], remaining: new Set(), pendingTasks: new Set(), pendingStations: new Set(),
    mistakes: 0, t0: performance.now(), z: 100, busy: 0, ending: false };
  logEl.innerHTML = '';
  $('#roomName').textContent = def.name;
  const ph = (x) => x.phase || 1;
  L.maxPhase = Math.max(def.phases?.length || 1, ...def.slots.map(ph), ...def.items.map(ph), ...(def.tasks || []).map(ph), ...(def.stations || []).map(ph));

  def.slots.forEach((s, i) => {
    const node = el('slot' + (s.show ? ' tinted' : '')); node.style.width = s.art.w + 'px'; node.style.height = s.art.h + 'px'; node.innerHTML = svgWrap(s.art);
    place(node, s.x, s.y, s.art.w, s.art.h, 0, .001);
    world.append(node);
    L.slots.push({ ...s, i, el: node, phase: ph(s), canSnap: false, isSnap: false, landed: false, shown: false, isCanSnapMultipleTimes: false });
  });
  (def.stations || []).forEach((s) => {
    const st = { ...s, phase: ph(s), fired: false, done: false, slots: L.slots.filter((x) => x.st === s.id) };
    L.stations.push(st); L.pendingStations.add(st);
  });
  (def.tasks || []).forEach((t, i) => createTask(t, i));

  const rand = rng(room * 7919 + 13);
  const defs = def.items.map((d) => ({ ...d, phase: ph(d) }));
  const buckets = new Map();
  defs.forEach((d) => { if (d.x == null) { const key = (d.inside ? 'in|' + d.inside : 'ph|' + d.phase); if (!buckets.has(key)) buckets.set(key, []); buckets.get(key).push(d); } });
  buckets.forEach((list, key) => {
    const [kind, ref] = key.split('|');
    const opener = kind === 'in' ? (def.tasks || []).find((t) => t.id === ref) : null;
    layout(list, opener?.rows || (kind === 'ph' ? def.phases?.[ref - 1]?.rows : null) || def.rows || DEF_ROWS, def.rot ?? 6, rand);
  });
  defs.forEach((d) => createItem(d, false));

  if (def.fg) world.insertAdjacentHTML('beforeend', `<svg class="fg" viewBox="0 0 ${W} ${H}">${def.fg}</svg>`);
  world.insertAdjacentHTML('beforeend', `<svg id="overlay" viewBox="0 0 ${W} ${H}"></svg>`);
  startPhase(true);
  renderSearch(null); drawOverlay(null);
  log(`${def.name}: ${L.maxPhase} phases`, 'level');
}

/* ---------- items ---------- */
function groupDist(g) { return L.def.groups?.[g]?.dist ?? 70; }
function createItem(d, spawn) {
  const node = el('item'); node.tabIndex = 0;
  node.setAttribute('role', 'button'); node.setAttribute('aria-label', `${d.label || d.group}, press Enter to put it away`);
  if (d.label) node.title = d.label;
  const item = {
    ...d, i: L.items.length, el: node, r: d.r || 0, home: { x: d.x, y: d.y, r: d.r || 0 },
    dist: groupDist(d.group), sqrDistanceToSnap: groupDist(d.group) ** 2,     // Awake(): sqr = DistanceToSnap²
    snapPoints: L.slots.filter((s) => s.group === d.group),
    IsCheckSnap: true, isDragging: false, cdUntil: 0, actionTween: null, current: null, last: null, locked: false, revealed: false, cooked: false,
  };
  if (d.rot) node.classList.add('rot');
  paintItem(item);
  bindItem(item);
  world.append(node); L.items.push(item); L.remaining.add(item);
  if (spawn || (!d.inside && d.phase <= L.phase)) { item.revealed = true; if (spawn) popIn(node, item.x, item.y, item.art.w, item.art.h, item.r); }
  else node.classList.add('hidden');
  if (item.revealed && item.phase > L.phase) node.classList.add('wait');
  return item;
}
function paintItem(item) {
  const a = item.art;
  item.el.style.width = a.w + 'px'; item.el.style.height = a.h + 'px';
  item.el.innerHTML = svgWrap(a) + `<svg class="center" viewBox="0 0 ${a.w} ${a.h}"><circle cx="${a.w / 2}" cy="${a.h / 2}" r="4" fill="var(--accent)"/></svg>`
    + (item.rot ? '<svg class="stink" viewBox="0 0 40 30" aria-hidden="true"><path d="M8 28 q-6 -8 0 -14 q6 -6 0 -12 M20 28 q-6 -8 0 -14 q6 -6 0 -12 M32 28 q-6 -8 0 -14 q6 -6 0 -12"/></svg>' : '');
  place(item.el, item.x, item.y, a.w, a.h, item.r);
}
function revealItem(it) {
  if (it.revealed) return;
  it.revealed = true; it.el.classList.remove('hidden');
  if (it.phase > L.phase) it.el.classList.add('wait');
  popIn(it.el, it.x, it.y, it.art.w, it.art.h, it.r);
}
const itemActive = (it) => it.revealed && it.phase <= L.phase;

/* ---------- slots, gates, phases ---------- */
function refreshGates(initial) {
  const opened = [];
  L.slots.forEach((s) => {
    const want = s.phase <= L.phase && (s.needs == null || L.slots[s.needs].landed);
    if (want && !s.canSnap) { s.canSnap = true; opened.push(s); }   // KAPSnapPoint.ChangeCanSnap(true)
  });
  opened.forEach((s, n) => later((initial ? 120 : 0) + n * (initial ? 40 : 60), () => showSlot(s)));
  if (!initial && opened.some((s) => !s.sink)) { SFX.pop(); log(`ChangeCanSnap(true) + Show() on ${opened.filter((s) => !s.sink).length} point(s)`); }
  refreshTasks();
}
function showSlot(s) {   // KAPSnapPoint.Show(): SetActive(true), scale from zero back to its own scale over 0.3s
  if (s.shown) return; s.shown = true;
  tween(.3, outQuad, (p) => place(s.el, s.x, s.y, s.art.w, s.art.h, 0, Math.max(.001, p)));
}
function pendingCount(p) {
  let n = 0;
  for (const it of L.remaining) if ((it.until ?? it.phase) <= p) n++;
  for (const t of L.pendingTasks) if (t.phase <= p) n++;
  for (const st of L.pendingStations) if (st.phase <= p) n++;
  return n;
}
function checkPhase() {
  if (L.state !== 'Playing' || L.ending) return;
  if (pendingCount(L.phase) > 0) return;
  if (L.phase < L.maxPhase) { L.phase++; log(`Phase ${L.phase}: ${L.def.phases?.[L.phase - 1]?.title || ''}`, 'level'); SFX.ding(); startPhase(false); checkPhase(); }
  else onEndGame();
}
function startPhase(first) {
  L.items.forEach((it) => {
    if (it.phase <= L.phase) {
      if (!it.revealed && !it.inside) revealItem(it);
      it.el.classList.remove('wait');
    }
  });
  refreshGates(first);
  setPill(); renderProgress();
  const ph = L.def.phases?.[L.phase - 1];
  $('#tip').innerHTML = ph ? `<b>${L.maxPhase > 1 ? `Step ${L.phase} of ${L.maxPhase}: ` : ''}${ph.title}.</b> ${ph.tip || ''}` : (L.def.tip ? `<b>Tip:</b> ${L.def.tip}` : '');
}

/* ---------- the decompiled mechanic ---------- */
// NSnapPoint.IsSnap setter: a single-use point that is already filled ignores every write.
function setIsSnap(p, value) {
  if (!p.isCanSnapMultipleTimes && p.isSnap) return;
  p.isSnap = value;
  p.el.classList.toggle('filled', value);
}
const sqr2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;   // DistanceToInSqrVec2: z is ignored
const free = (p) => p.canSnap && (p.sink || !p.isSnap);

// MouseInteractNSnap.CanSnap getter: nearest point that can snap, is free, and is inside DistanceToSnap.
function canSnap(item) {
  let best = Infinity, idx = -1;
  item.snapPoints.forEach((p, i) => {
    if (!free(p)) return;
    const d = sqr2(p, item);
    if (d < item.sqrDistanceToSnap && d < best) { best = d; idx = i; }
  });
  return idx;
}
// FindNearestSnapPoint(checkIsSnap, checkCanSnap): same filter, no distance limit. Used by ForceSnap.
function findNearestSnapPoint(item) {
  let best = Infinity, idx = -1;
  item.snapPoints.forEach((p, i) => { if (!free(p)) return; const d = sqr2(p, item); if (d < best) { best = d; idx = i; } });
  return idx;
}

function toWorld(e) { const r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k }; }
const isAllowInteract = () => !L.blocked && L.state === 'Playing';   // LevelBase.IsAllowInteract

function onMouseDown(item, e) {
  if (item.locked || !itemActive(item) || performance.now() < item.cdUntil || !isAllowInteract() || item.isDragging) return;
  item.isDragging = true;
  item.last = toWorld(e);
  kill(item.actionTween);
  item.el.classList.add('dragging'); item.el.style.zIndex = ++L.z;
  SFX.drag(); haptic();
  if (item.IsCheckSnap && item.current) setIsSnap(item.current, false);
  renderSearch(item); drawOverlay(item);
}
function onMouseDrag(item, e) {
  if (!item.isDragging) return;
  const w = toWorld(e);
  item.x += w.x - item.last.x; item.y += w.y - item.last.y;   // move by the pointer delta, keeping the grab offset
  item.last = w;
  place(item.el, item.x, item.y, item.art.w, item.art.h, item.r);
  renderSearch(item); drawOverlay(item);
}
function onMouseUp(item) {
  if (!item.isDragging) return;
  item.isDragging = false;
  item.el.classList.remove('dragging');
  const idx = canSnap(item);
  if (idx >= 0) {
    log(`CanSnap → ${idx}, d²=${Math.round(sqr2(item.snapPoints[idx], item))} < ${item.sqrDistanceToSnap}`);
    snapToSnapPoint(item, idx);
  } else {
    const wrong = L.slots.find((s) => free(s) && s.group !== item.group && sqr2(s, item) < 100 * 100);
    if (wrong) bounce(item, wrong);
    else { SFX.cancel(); log(`CanSnap → -1: no free point within ${item.dist}`, 'cancel'); }
  }
  item.cdUntil = performance.now() + CD_TIME * 1000;   // cdTimer.Start(cdTime)
  renderSearch(null); drawOverlay(null);
}
function bounce(item, wrong) {   // design choice: dropping on the wrong kind of spot sends the item home and costs a slip
  L.mistakes++; renderProgress();
  SFX.cancel(); log(`wrong spot: ${item.group} doesn't go on ${wrong.sink ? 'the bin' : wrong.group}`, 'cancel');
  stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake');
  const fx = item.x, fy = item.y, fr = item.r;
  kill(item.actionTween);
  item.actionTween = tween(.35, outBack, (t) => {
    item.x = fx + (item.home.x - fx) * t; item.y = fy + (item.home.y - fy) * t; item.r = fr + (item.home.r - fr) * t;
    place(item.el, item.x, item.y, item.art.w, item.art.h, item.r);
  });
}

function snapToSnapPoint(item, index) {
  const p = item.snapPoints[index];
  item.current = p;
  if (!p.sink) setIsSnap(p, item.IsCheckSnap);   // the point is claimed immediately, before the tween finishes
  kill(item.actionTween);
  const fx = item.x, fy = item.y, fr = item.r;
  item.locked = true;
  item.el.style.zIndex = 24 + (p.z ?? 1);
  log(`SnapToSnapPoint(${index}): DOMove ${SNAP_TIME}s OutBack`);
  item.actionTween = tween(SNAP_TIME, outBack, (t) => {
    item.x = fx + (p.x - fx) * t; item.y = fy + (p.y - fy) * t; item.r = fr * (1 - Math.min(1, t));
    place(item.el, item.x, item.y, item.art.w, item.art.h, item.r);
  }, () => {
    item.x = p.x; item.y = p.y; item.r = 0;
    place(item.el, item.x, item.y, item.art.w, item.art.h, 0);
    haptic();
    onSnap(item, p);                // dropData._OnSnap, raised after the move completes
  });
}
function forceSnap(item) {          // MouseInteractNSnap.ForceSnap
  if (item.locked || !itemActive(item) || !isAllowInteract()) return false;
  const idx = findNearestSnapPoint(item);
  if (idx < 0) return false;
  log(`ForceSnap → FindNearestSnapPoint = ${idx}`); snapToSnapPoint(item, idx);
  return true;
}

/* ---------- what happens after a snap ---------- */
function onSnap(item, p) {
  p.landed = true;
  if (p.sink) {                      // the bin takes any number of items (isCanSnapMultipleTimes behaviour)
    SFX.bin(); log(`binned ${item.label || item.group}`, 'snap');
    tween(.25, outQuad, (t) => place(item.el, item.x, item.y + 30 * t, item.art.w, item.art.h, 0, 1 - t), () => item.el.classList.add('hidden'));
    L.remaining.delete(item); renderProgress(); refreshGates(false); checkPhase();
    return;
  }
  SFX.snap();
  if (p.cook && item.then) { startCook(item, p); return; }
  item.el.classList.add('locked'); item.el.tabIndex = -1;
  if (item.after) { item.art = item.after; paintItem(item); SFX.sizzle(); }
  L.remaining.delete(item);
  log(`_OnSnap: ${item.label || item.group} → point #${p.i}`, 'snap');
  renderProgress();
  if (p.st) stationLanded(p.st);
  refreshGates(false);
  checkPhase();
}

/* cooking slots: the item cooks for a few seconds, changes, and has to be lifted out again */
function timerBadge(x, y, secs, text, cb) {
  const b = el('timer');
  b.style.transform = `translate(${x - 34}px, ${y - 34}px)`;
  b.innerHTML = `<svg viewBox="0 0 68 68"><circle cx="34" cy="34" r="28" class="bg"/><circle cx="34" cy="34" r="28" class="fg" style="animation-duration:${secs}s"/></svg><span>${text}</span>`;
  world.append(b); L.busy++;
  SFX.sizzle();
  later(secs * 1000, () => { L.busy--; b.remove(); cb(); });
  return b;
}
function startCook(item, p) {
  log(`${item.label || item.group} is cooking (${p.cook}s)`);
  timerBadge(p.x, p.y - Math.min(40, item.art.h / 2), p.cook, p.cookText || 'cooking', () => {
    item.art = item.after || item.art; item.group = item.then;
    item.dist = groupDist(item.group); item.sqrDistanceToSnap = item.dist ** 2;
    item.snapPoints = L.slots.filter((s) => s.group === item.group);
    paintItem(item);
    p.isSnap = false; p.landed = false; p.el.classList.remove('filled');
    item.current = null; item.locked = false; item.cooked = true; item.el.classList.remove('locked'); item.el.tabIndex = 0;
    const pop = p.pop || 0, y0 = item.y;
    item.home = { x: item.x, y: y0 - pop, r: 0 };
    tween(.3, outBack, (t) => { item.y = y0 - pop * t; place(item.el, item.x, item.y, item.art.w, item.art.h, 0); });
    SFX.ding(); log(`${item.label || item.group} is ready: lift it out`, 'level');
  });
}

/* stations: put the right ingredients together, then they become something new */
function stationLanded(id) {
  const st = L.stations.find((s) => s.id === id);
  if (!st || st.fired || !st.slots.every((s) => s.landed)) return;
  st.fired = true; L.busy++;
  later(350, () => {
    L.busy--;
    L.items.forEach((it) => { if (it.current && it.current.st === id && it.locked) tween(.3, outQuad, (t) => place(it.el, it.x, it.y, it.art.w, it.art.h, 0, 1 - t), () => it.el.classList.add('hidden')); });
    log(`${st.title || st.id}: ingredients combined`, 'level'); SFX.pop();
    const pr = st.process;
    if (!pr) return finishStation(st);
    if (pr.kind === 'timer') return timerBadge(st.x, st.y, pr.secs, pr.text || 'cooking', () => finishStation(st));
    const t = createTask({ type: 'scrub', verb: pr.verb, x: st.x, y: st.y, w: pr.w, h: pr.h, color: pr.color, grow: true, shape: pr.shape, phase: st.phase, internal: true, onDone: () => finishStation(st) }, L.tasks.length);
    showTask(t);
  });
}
function finishStation(st) {
  st.done = true; L.pendingStations.delete(st);
  spawn(st.makes || [], st.x, st.y, st.phase);
  log(`${st.title || st.id}: made ${(st.makes || []).map((m) => m.label || m.group).join(', ')}`, 'level');
  SFX.ding(); refreshGates(false); checkPhase();
}
function spawn(list, x, y, phase) {
  list.forEach((m) => createItem({ ...m, phase: m.phase ?? Math.max(phase, L.phase), x: x + (m.dx || 0), y: y + (m.dy || 0), r: m.r || 0 }, true));
}

/* ---------- tasks: scrub / chop / open ---------- */
function createTask(def, i) {
  const t = { phase: 1, ...def, i, done: false, shown: false };
  const node = el('task ' + t.type + ' hidden'); node.tabIndex = 0; node.setAttribute('role', 'button');
  let w, h;
  if (t.type === 'scrub') {
    w = t.w; h = t.h;
    node.innerHTML = (t.base ? `<div class="tbase">${svgWrap(t.base)}</div>` : '') + `<div class="tblob" style="opacity:${t.grow ? .12 : 1}">${svgWrap(t.shape === 'disc' ? ART.disc(w, h, t.color) : ART.blob(w, h, t.color))}</div>`;
    t.cols = Math.max(4, Math.min(9, Math.round(w / 38))); t.rows = Math.max(2, Math.min(5, Math.round(h / 38)));
    t.cells = new Set(); t.verbText = `${t.verb}: rub across it`;
  } else {
    w = t.art.w; h = t.art.h;
    node.innerHTML = svgWrap(t.art) + '<svg class="cuts" viewBox="0 0 ' + w + ' ' + h + '"></svg>';
    t.cuts = t.cuts || 0; t.n = 0; t.verbText = t.type === 'chop' ? `Swipe to cut (${t.cuts})` : (t.hint || 'Tap to open');
  }
  node.setAttribute('aria-label', t.verbText);
  node.style.width = w + 'px'; node.style.height = h + 'px';
  if (t.z != null) node.style.zIndex = t.z;
  t.w = w; t.h = h; t.el = node;
  const lab = el('tlabel', t.verbText); node.append(lab); t.lab = lab;
  place(node, t.x, t.y, w, h, 0, .001);
  world.append(node);
  L.tasks.push(t); L.pendingTasks.add(t);

  const active = () => t.shown && !t.done && !t.busy && isAllowInteract();
  if (t.type === 'scrub') {
    let down = false;
    const mark = (e) => {
      const p = toWorld(e);
      const lx = (p.x - (t.x - w / 2)) / w, ly = (p.y - (t.y - h / 2)) / h;
      const cx = Math.min(t.cols - 1, Math.max(0, Math.floor(lx * t.cols))), cy = Math.min(t.rows - 1, Math.max(0, Math.floor(ly * t.rows)));
      if (lx < -.2 || lx > 1.2 || ly < -.3 || ly > 1.3) return;
      const before = t.cells.size; t.cells.add(cx + ',' + cy);
      if (t.cells.size !== before) {
        const prog = t.cells.size / (t.cols * t.rows);
        node.querySelector('.tblob').style.opacity = t.grow ? .12 + .88 * prog : Math.max(0, 1 - prog * 1.05);
        if (Math.random() < .5) SFX.scrub();
        if (prog >= .8) finishTask(t);
      }
    };
    node.addEventListener('pointerdown', (e) => { if (!active()) return; e.preventDefault(); down = true; node.setPointerCapture(e.pointerId); mark(e); });
    node.addEventListener('pointermove', (e) => { if (down && active()) mark(e); });
    const up = () => { down = false; };
    node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
  } else if (t.type === 'chop') {
    let down = false, last = null, travel = 0;
    node.addEventListener('pointerdown', (e) => { if (!active()) return; e.preventDefault(); down = true; last = toWorld(e); travel = 0; node.setPointerCapture(e.pointerId); });
    node.addEventListener('pointermove', (e) => {
      if (!down || !active()) return;
      const p = toWorld(e); travel += Math.hypot(p.x - last.x, p.y - last.y); last = p;
      if (travel > 70) { travel = 0; chopOnce(t); }
    });
    const up = () => { down = false; };
    node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
  } else {
    node.addEventListener('click', () => { if (active()) finishTask(t); });
  }
  node.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && active()) { e.preventDefault(); if (t.type === 'chop') { while (!t.done) chopOnce(t); } else finishTask(t); } });
  return t;
}
function showTask(t) {
  if (t.shown) return; t.shown = true;
  t.el.classList.remove('hidden');
  popIn(t.el, t.x, t.y, t.w, t.h);
}
function refreshTasks() {
  L.tasks.forEach((t) => {
    if (!t.shown && !t.done && !t.inside && t.phase <= L.phase && (t.afterSlot == null || L.slots[t.afterSlot].landed)) showTask(t);
  });
}
function chopOnce(t) {
  if (t.done) return;
  t.n++; SFX.chop();
  const cuts = t.el.querySelector('.cuts');
  const x = t.w * t.n / (t.cuts + 1);
  cuts.insertAdjacentHTML('beforeend', `<path d="M${x} -4 L${x + 6} ${t.h + 4}" stroke="var(--bg)" stroke-width="4" stroke-linecap="round"/>`);
  t.lab.textContent = `Swipe to cut (${Math.max(0, t.cuts - t.n)})`;
  if (t.n >= t.cuts) finishTask(t);
}
function finishTask(t) {
  if (t.done || t.busy) return;
  const complete = () => {
    t.done = true; L.pendingTasks.delete(t);
    t.lab.remove();
    if (t.type === 'scrub') {
      t.el.classList.add('finished');
      if (!t.grow || t.internal) tween(.4, outQuad, (p) => { t.el.style.opacity = 1 - p; }, () => t.el.classList.add('hidden'));
    } else if (t.type === 'chop') {
      tween(.2, outQuad, (p) => place(t.el, t.x, t.y, t.w, t.h, 0, 1 - p), () => t.el.classList.add('hidden'));
    } else {
      if (t.openArt) { t.el.innerHTML = svgWrap(t.openArt); t.el.classList.add('finished'); }
      else t.el.classList.add('hidden');
    }
    L.items.forEach((it) => { if (it.inside === t.id && t.id) revealItem(it); });
    L.tasks.forEach((o) => { if (o.inside === t.id && t.id) { o.inside = null; if (o.phase <= L.phase) showTask(o); } });
    if (t.yields) spawn(t.yields, t.x, t.y, t.phase);
    SFX.ding(); log(`${t.verb || (t.type === 'open' ? 'Opened' : 'Chopped')} done`, 'level');
    t.onDone && t.onDone();
    refreshGates(false); checkPhase();
  };
  if (t.type === 'open' && t.secs) {
    t.busy = true;
    timerBadge(t.x, t.y - 8, t.secs, t.timerText || 'baking', complete);
    return;
  }
  complete();
}

/* ---------- level end ---------- */
function onEndGame() {
  if (L.ending) return;
  L.ending = true;
  log('Everything is done: end effects, EndGame in 1.5s', 'level');
  SFX.win(); burst();
  later(1500, showFinale);
}
function showFinale() {               // LevelBase.EndGame
  L.state = 'Begin_Win'; L.blocked = true; setPill();   // ChangePlayState(3) adds BlockPlayerInteract
  log('ChangePlayState(Begin_Win): input blocked', 'level');
  const f = L.def.finale || { who: 'cub', title: L.def.name, line: 'Thank you!' };
  const ch = CHARS[f.who] || CHARS.cub;
  const n = L.mistakes <= 1 ? 3 : L.mistakes <= 3 ? 2 : 1;
  done[L.def.id] = Math.max(done[L.def.id] || 0, n); store('tidy-snap-v3', done);
  const isNew = !friends.has(f.who); friends.add(f.who); store('tidy-snap-friends', [...friends]);
  const secs = Math.round((performance.now() - L.t0) / 1000);
  const next = LEVELS.findIndex((l, i) => i > room && !done[l.id]);
  const target = next >= 0 ? next : LEVELS.findIndex((l) => !done[l.id]);
  const node = el('finale' + (f.dish ? ' with-dish' : ''));
  node.innerHTML = `${f.dish ? `<div class="fin-dish">${svgWrap(f.dish)}</div>` : ''}
    <div class="fin-who"><svg viewBox="0 0 220 220" aria-hidden="true">${ch.svg}</svg></div>
    <div class="fin-bubble">${f.line}</div>
    ${Array.from({ length: 7 }, (_, i) => `<svg class="heart" style="--i:${i}" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21 C-6 8 6 -4 12 5 C18 -4 30 8 12 21Z" fill="#f2748f"/></svg>`).join('')}
  `;
  const card = el('fin-card');
  card.innerHTML = `<h2>${f.title}</h2>
      <p>${ch.name} the ${ch.kind} ${isNew ? 'is your new friend!' : 'says hi again.'}</p>
      <div class="stars" role="img" aria-label="${n} of 3 stars">${stars(n)}</div>
      <p class="meta">${L.mistakes} slip${L.mistakes === 1 ? '' : 's'} · ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</p>
      <button type="button" id="next">${target >= 0 ? `Next: ${LEVELS[target].name}` : 'Play again'}</button>`;
  document.querySelector('.stage-col').append(card);
  stage.append(node);
  renderPicker();
  const btn = card.querySelector('#next');
  btn.onclick = () => { room = target >= 0 ? target : (room + 1) % LEVELS.length; load(); };
  later(2300, () => card.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' }));
  later(800, () => { if (L.state === 'Begin_Win') { L.state = 'Winned'; setPill(); } });
}

/* ---------- UI ---------- */
function bindItem(item) {
  const node = item.el;
  node.addEventListener('pointerdown', (e) => { e.preventDefault(); onMouseDown(item, e); if (item.isDragging) node.setPointerCapture(e.pointerId); });
  node.addEventListener('pointermove', (e) => onMouseDrag(item, e));
  node.addEventListener('pointerup', () => onMouseUp(item));
  node.addEventListener('pointercancel', () => onMouseUp(item));
  node.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); forceSnap(item); } });
}
function renderProgress() {
  const pips = Array.from({ length: L.maxPhase }, (_, i) => `<i class="${i + 1 < L.phase || L.ending ? 'on' : i + 1 === L.phase ? 'now' : ''}"></i>`).join('');
  const left = [...L.remaining].filter((it) => it.phase <= L.phase).length;
  $('#progress').innerHTML = `<b>Step ${Math.min(L.phase, L.maxPhase)}</b> of ${L.maxPhase}<span class="pips">${pips}</span> · ${left} item${left === 1 ? '' : 's'} to place · ${L.mistakes} slip${L.mistakes === 1 ? '' : 's'}`;
}
function setPill() {
  const p = $('#statePill');
  p.textContent = L.state === 'Playing' ? `Playing · phase ${L.phase}/${L.maxPhase}` : L.state;
  p.className = 'pill ' + (L.state === 'Playing' ? 'playing' : 'win');
}
function slotStatus(p, i, item, win, d) {
  if (p.sink) return d >= item.sqrDistanceToSnap ? 'out of range' : i === win ? 'binned here' : 'in range';
  if (p.isSnap) return 'filled';
  if (!p.canSnap) return p.needs != null && !L.slots[p.needs].landed ? `after #${p.needs}` : `phase ${p.phase}`;
  if (d >= item.sqrDistanceToSnap) return 'out of range';
  return i === win ? 'snaps here' : 'in range';
}
function renderSearch(item) {
  const box = $('#search');
  if (!item) { box.innerHTML = '<p class="empty">Pick up an item to see every snap point it is checking, the squared distance to each, and which one wins.</p>'; return; }
  const win = canSnap(item);
  box.innerHTML = `<p class="mono" style="margin:0 0 6px">${item.label || item.group} · DistanceToSnap ${item.dist} → sqr ${item.sqrDistanceToSnap}</p>
    <table class="mono"><thead><tr><th>point</th><th class="num">d²</th><th>status</th></tr></thead><tbody>${
    item.snapPoints.map((p, i) => {
      const d = Math.round(sqr2(p, item)), status = slotStatus(p, i, item, win, d);
      return `<tr class="${i === win ? 'winner' : status === 'in range' ? '' : 'out'}"><td>#${p.i}</td><td class="num">${d.toLocaleString()}</td><td>${status}</td></tr>`;
    }).join('')}</tbody></table>`;
}
function drawOverlay(item) {
  const ov = $('#overlay'); if (!ov) return;
  if (!$('#radius').checked) { ov.innerHTML = ''; return; }
  const win = item ? canSnap(item) : -1;
  const pts = (item ? item.snapPoints : L.slots).filter((p) => p.canSnap && !p.landed || p.sink);
  ov.innerHTML = pts.map((p) => {
    const r = groupDist(p.group);
    const cls = item && item.snapPoints[win] === p ? 'win' : '';
    return `<circle class="r ${cls}" cx="${p.x}" cy="${p.y}" r="${r}"/><circle class="c" cx="${p.x}" cy="${p.y}" r="3"/>`;
  }).join('');
}
function burst() {
  if (reduceMotion) return;
  const colors = ['var(--accent)', 'var(--ok)', '#e0a93b', '#d6584a'];
  for (let i = 0; i < 46; i++) {
    const s = el('spark');
    s.style.background = colors[i % colors.length]; s.style.left = '500px'; s.style.top = '330px';
    world.append(s);
    const a = Math.random() * Math.PI * 2, v = 160 + Math.random() * 320;
    s.animate([
      { transform: 'translate(0,0) rotate(0)', opacity: 1 },
      { transform: `translate(${Math.cos(a) * v}px, ${Math.sin(a) * v + 140}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
    ], { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => s.remove();
  }
}

/* help: do the next thing for the player */
function help() {
  if (!L || !isAllowInteract()) return false;
  for (const it of L.items) if (L.remaining.has(it) && !it.locked && itemActive(it) && forceSnap(it)) return true;
  for (const t of L.tasks) if (t.shown && !t.done && !t.busy) { finishTask(t); return true; }
  return false;
}
$('#reset').onclick = load;
$('#hint').onclick = help;
$('#mute').onclick = (e) => { muted = !muted; e.currentTarget.textContent = muted ? 'Sound off' : 'Sound on'; e.currentTarget.setAttribute('aria-pressed', String(muted)); };
$('#radius').onchange = () => { stage.classList.toggle('show-radius', $('#radius').checked); drawOverlay(null); };

// handle for automated play-testing
window.__tidy = {
  step() { if (!L) return 'none'; if (L.state !== 'Playing' || L.ending) return 'end'; if (help()) return 'did'; return L.busy > 0 || [...L.items].some((i) => i.isDragging || i.actionTween && !i.locked) ? 'wait' : 'stuck'; },
  get state() { return L && { phase: L.phase, max: L.maxPhase, st: L.state, busy: L.busy, left: [...L.remaining].map((i) => i.label || i.group), tasks: [...L.pendingTasks].map((t) => t.verb || t.type), stations: [...L.pendingStations].map((s) => s.id), ending: L.ending, mistakes: L.mistakes }; },
  load(i) { room = i; load(); },
};

fit(); renderFriends(); load();
})();
