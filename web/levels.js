// Tidy Snap levels, part 1: shared helpers and the seven recipe levels.
//
// A level is a chain of phases. Things you can meet inside a phase:
//   slot     an exact spot. group = what fits. needs = another slot (by index) that must be filled first. cook = seconds
//            an item cooks there before it changes and has to be lifted out. sink = the bin. st = part of a station.
//   item     something to drag. then/after = group and look it takes after cooking. until = phase it must be placed by.
//   task     scrub (rub across it), chop (swipe across it), open (tap it; secs = takes time).
//   station  put every ingredient slot of the station together and they turn into something new (makes),
//            optionally after a process (stir by hand or wait for a timer).
(() => {
const A = window.ART;
const R = (x, y, w, h, cls, rx = 0, extra = '') => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${extra}/>`;
const wall = (cls = 's-wall') => R(0, 0, 1000, 700, cls);
const floor = (y = 560) => R(0, y, 1000, 700 - y, 's-floor');
const tiles = (x, y, w, h) => `<defs><pattern id="tile" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" class="s-tile"/><path d="M44 0H0V44" fill="none" class="s-tileline" stroke-width="2"/></pattern></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#tile)"/>`;
const counter = (y, x0 = 0, x1 = 1000) => R(x0, y, x1 - x0, 18, 's-counter', 3) + R(x0 + 10, y + 18, x1 - x0 - 20, 700 - y - 18, 's-cab')
  + Array.from({ length: Math.floor((x1 - x0) / 200) }, (_, i) => `<path class="s-cabline" d="M${x0 + 10 + (i + 1) * 200} ${y + 18} V700"/>`).join('');
const shelf = (x0, x1, y) => R(x0, y, x1 - x0, 10, 's-wood', 2) + R(x0 + 16, y + 10, 8, 16, 's-wooddk') + R(x1 - 24, y + 10, 8, 16, 's-wooddk');
const windowPane = (x, y, w, h) => R(x - 8, y - 8, w + 16, h + 16, 's-wooddk', 10) + R(x, y, w, h, 's-sky', 4) + R(x + w / 2 - 4, y, 8, h, 's-wooddk') + R(x, y + h / 2 - 4, w, 8, 's-wooddk');
const jarRow = (x, y, n) => Array.from({ length: n }, (_, i) => `<rect class="s-glass" x="${x + i * 38}" y="${y - 34 - (i % 3) * 6}" width="28" height="${34 + (i % 3) * 6}" rx="6"/><rect class="s-wooddk" x="${x + i * 38 + 2}" y="${y - 38 - (i % 3) * 6}" width="24" height="6" rx="2"/>`).join('');
const kitchenDecor = (cy) => (cy < 460 ? '' : windowPane(640, 60, 150, 120) + R(628, 52, 174, 12, 's-wooddk', 4)
  + shelf(60, 330, 170) + jarRow(84, 170, 6)
  + `<circle class="s-wooddk" cx="480" cy="110" r="38"/><circle class="s-wall" cx="480" cy="110" r="32"/><path class="s-cabline" d="M480 110 V88 M480 110 L496 118"/>`
  + `<path d="M60 62 H320" style="stroke:var(--metal);fill:none" stroke-width="5" stroke-linecap="round"/>` + [90, 150, 210, 270].map((x, i) => `<path d="M${x} 62 v${22 + (i % 2) * 10}" style="stroke:var(--metal);fill:none" stroke-width="3"/><ellipse class="s-metal" cx="${x}" cy="${92 + (i % 2) * 12}" rx="${10 + (i % 2) * 4}" ry="12"/>`).join(''));
const kitchen = (cy = 500, x1 = 1000) => wall() + tiles(0, 0, 1000, cy) + kitchenDecor(cy) + counter(cy, 0, x1);
const binScene = (x, yb, w = 86, h = 116) => `<path class="s-metal" d="M${x - w / 2} ${yb - h + 14} H${x + w / 2} L${x + w / 2 - 8} ${yb} H${x - w / 2 + 8}Z"/><rect class="s-pan" x="${x - w / 2 - 6}" y="${yb - h}" width="${w + 12}" height="16" rx="6"/><path class="s-cabline" d="M${x - 14} ${yb - h + 26} V${yb - 10} M${x} ${yb - h + 26} V${yb - 10} M${x + 14} ${yb - h + 26} V${yb - 10}"/>`;
const binSlot = (x, yb, o = {}) => S('junk', A.none(100, 130), x, yb - 58, { sink: true, ...o });
const bowlScene = (x, y, rx = 110) => `<ellipse class="s-bowl" cx="${x}" cy="${y}" rx="${rx}" ry="${rx * .14}"/><ellipse class="s-bowlin" cx="${x}" cy="${y - 2}" rx="${rx - 10}" ry="${rx * .1}"/>`;
const panScene = (x, y, rx = 100) => `<rect class="s-pan" x="${x + rx - 6}" y="${y - 6}" width="70" height="10" rx="5"/><ellipse class="s-pan" cx="${x}" cy="${y}" rx="${rx}" ry="${rx * .17}"/><ellipse class="s-panin" cx="${x}" cy="${y - 3}" rx="${rx - 12}" ry="${rx * .12}"/>`;
const plateScene = (x, y, rx = 140) => `<ellipse class="s-plate" cx="${x}" cy="${y}" rx="${rx}" ry="${rx * .07}"/>`;

const S = (group, art, x, y, o = {}) => ({ group, art, x, y, ...o });
const I = (group, art, o = {}) => ({ group, art, ...o });
const P = (title, tip) => ({ title, tip });
const N = (n, f) => Array.from({ length: n }, (_, i) => f(i));
const scrub = (verb, x, y, w, h, color, o = {}) => ({ type: 'scrub', verb, x, y, w, h, color, ...o });
const chop = (x, y, art, cuts, yields, o = {}) => ({ type: 'chop', verb: 'Chopped', x, y, art, cuts, yields, ...o });
const open = (id, x, y, art, openArt, o = {}) => ({ type: 'open', verb: 'Opened', id, x, y, art, openArt, ...o });
const tap = (x, y, label, done, o = {}) => open(null, x, y, A.label(150, 56, label), A.label(150, 56, done, '#2e8b57'), { verb: label, ...o });
const station = (id, x, y, o = {}) => ({ id, x, y, ...o });

window.LV = { A, R, wall, floor, tiles, counter, shelf, windowPane, kitchen, binScene, binSlot, bowlScene, panScene, plateScene, S, I, P, N, scrub, chop, open, tap, station };
const LEVELS = window.LEVELS = [];
const add = (l) => LEVELS.push(l);

/* ================================ COOKING ================================ */

add({
  id: 'sandwich', cat: 'Cooking', name: 'Club sandwich',
  scene: kitchen(500) + plateScene(520, 498) + R(270, 494, 100, 8, 's-wood', 3) + bowlScene(790, 497, 70) + binScene(60, 500),
  fg: R(128, 420, 124, 80, 's-metal', 16) + R(146, 420, 40, 6, 's-pan', 3) + R(196, 420, 40, 6, 's-pan', 3) + R(236, 452, 16, 8, 's-pan', 3),
  groups: { toaster: { dist: 60 }, bottom: { dist: 90 }, top: { dist: 90 }, sauce: { dist: 70 }, lettuce: { dist: 80 }, ham: { dist: 80 }, tomato: { dist: 40 }, cheese: { dist: 80 }, mayo: { dist: 50 }, ketchup: { dist: 50 }, junk: { dist: 90 } },
  phases: [
    P('Prep', 'Wipe the counter, slice the tomato by swiping across it, toast both slices of bread and bin the napkin'),
    P('Make the sauce', 'Put the mayo and ketchup in the bowl, then stir them together'),
    P('Build it', 'Stack from the bottom: toast, sauce, lettuce, ham, two tomato slices, cheese, toast'),
    P('Serve', 'Skewer it and cut it in half'),
  ],
  slots: [
    S('toaster', A.breadSlice(false), 158, 418, { cook: 3, pop: 34, cookText: 'toasting' }), S('toaster', A.breadSlice(false), 224, 418, { cook: 3, pop: 34, cookText: 'toasting' }),
    binSlot(60, 500),
    S('mayo', A.shortJar('#f6f1e4'), 750, 465, { st: 'sauce', phase: 2 }), S('ketchup', A.sauce(), 825, 446, { st: 'sauce', phase: 2 }),
    S('bottom', A.breadBottom(), 520, 480, { phase: 3 }), S('sauce', A.sauceLayer(), 520, 456, { phase: 3, needs: 5 }),
    S('lettuce', A.lettuce(), 520, 436, { phase: 3, needs: 6 }), S('ham', A.ham(), 520, 413, { phase: 3, needs: 7 }),
    S('tomato', A.tomatoSlice(), 478, 394, { phase: 3, needs: 8 }), S('tomato', A.tomatoSlice(), 562, 394, { phase: 3, needs: 9 }),
    S('cheese', A.cheeseSlice(), 520, 374, { phase: 3, needs: 10 }), S('top', A.breadTop(), 520, 343, { phase: 3, needs: 11 }),
  ],
  items: [
    I('toaster', A.breadSlice(false), { label: 'bread', after: A.breadBottom(), then: 'bottom', until: 3 }),
    I('toaster', A.breadSlice(false), { label: 'bread', after: A.breadTop(), then: 'top', until: 3 }),
    I('junk', A.paperBall(), { label: 'napkin' }),
    I('mayo', A.shortJar('#f6f1e4'), { label: 'mayo', phase: 2 }), I('ketchup', A.sauce(), { label: 'ketchup', phase: 2 }),
    I('lettuce', A.lettuce(), { phase: 3 }), I('ham', A.ham(), { phase: 3 }), I('cheese', A.cheeseSlice(), { phase: 3 }),
  ],
  tasks: [
    scrub('Wipe', 900, 490, 110, 22, '#b08a5a'),
    chop(320, 466, A.tomato(), 2, [{ group: 'tomato', art: A.tomatoSlice(), label: 'tomato slice', dx: -28, dy: -34, phase: 3, until: 3 }, { group: 'tomato', art: A.tomatoSlice(), label: 'tomato slice', dx: 28, dy: -34, phase: 3, until: 3 }]),
    tap(520, 600, 'Skewer & cut', 'Yum!', { phase: 4 }),
  ],
  stations: [station('sauce', 790, 480, { phase: 2, title: 'Secret sauce', process: { kind: 'scrub', verb: 'Stir', w: 110, h: 34, color: '#e98a9a' },
    makes: [{ group: 'sauce', art: A.sauceBowl(), label: 'secret sauce', after: A.sauceLayer(), phase: 3, until: 3, dy: -8 }] })],
  finale: { who: 'cub', dish: A.dishSandwich(), title: 'Club sandwich', line: 'Crunchy, saucy and stacked just right!' },
});

add({
  id: 'pizza', cat: 'Cooking', name: 'Pizza night',
  scene: kitchen(520) + `<circle class="s-wood" cx="330" cy="385" r="158"/><circle class="s-wooddk" cx="330" cy="385" r="152"/>` + bowlScene(760, 510, 105) + binScene(55, 520),
  groups: { dough: { dist: 130 }, flour: { dist: 55 }, water: { dist: 55 }, oil: { dist: 55 }, cheese: { dist: 140 }, pep: { dist: 45 }, mush: { dist: 45 }, olive: { dist: 40 }, basil: { dist: 45 }, junk: { dist: 90 } },
  phases: [
    P('Make the dough', 'Put flour, water and oil in the bowl and knead it. Chop the pepperoni by swiping across it'),
    P('Shape the base', 'Put the dough on the board, then spread the sauce by rubbing across it'),
    P('Top it', 'Cheese first, then pepperoni, mushrooms, olives and basil. The gummy bear goes in the bin'),
    P('Bake', 'Slide it into the oven'),
  ],
  slots: [
    S('dough', A.disc(280, 280, '#e9c58c'), 330, 385, { phase: 2 }),
    binSlot(55, 520),
    S('flour', A.shortJar('#f1ece2'), 710, 463, { st: 'dough' }), S('water', A.glassCup(), 775, 455, { st: 'dough' }), S('oil', A.oilBottle(), 828, 445, { st: 'dough' }),
    S('cheese', A.cheeseLayer(), 330, 385, { phase: 3, z: 3 }),
    ...[[270, 325], [390, 325], [270, 445], [390, 445]].map(([x, y]) => S('pep', A.pepperoni(), x, y, { phase: 3, needs: 5, z: 4 })),
    ...[[330, 305], [235, 392], [425, 392]].map(([x, y]) => S('mush', A.mushroom(), x, y, { phase: 3, needs: 5, z: 4 })),
    ...[[330, 385], [292, 458], [368, 458]].map(([x, y]) => S('olive', A.olive(), x, y, { phase: 3, needs: 5, z: 4 })),
    S('basil', A.basil(), 282, 392, { phase: 3, needs: 5, z: 4 }), S('basil', A.basil(), 380, 372, { phase: 3, needs: 5, z: 4 }),
  ],
  items: [
    I('flour', A.shortJar('#f1ece2'), { label: 'flour' }), I('water', A.glassCup(), { label: 'water' }), I('oil', A.oilBottle(), { label: 'olive oil' }), I('junk', A.gummy(), { label: 'gummy bear' }),
    I('cheese', A.cheeseLayer(), { label: 'cheese', phase: 3 }),
    ...N(3, () => I('mush', A.mushroom(), { label: 'mushroom', phase: 3 })), ...N(3, () => I('olive', A.olive(), { label: 'olive', phase: 3 })), ...N(2, () => I('basil', A.basil(), { label: 'basil', phase: 3 })),
  ],
  tasks: [
    chop(600, 496, A.pepLog(), 3, N(4, (i) => ({ group: 'pep', art: A.pepperoni(), label: 'pepperoni', dx: -66 + i * 44, dy: -34, phase: 3, until: 3 }))),
    scrub('Spread', 330, 385, 250, 250, '#c8432f', { shape: 'disc', grow: true, phase: 2, afterSlot: 0, z: 26 }),
    tap(330, 610, 'Bake', 'Ready!', { phase: 4, secs: 4, timerText: 'baking' }),
  ],
  stations: [station('dough', 760, 498, { title: 'Pizza dough', process: { kind: 'scrub', verb: 'Knead', w: 150, h: 40, color: '#efdcb0' },
    makes: [{ group: 'dough', art: A.dough(), label: 'dough', after: A.disc(280, 280, '#e9c58c'), phase: 2, dy: -26 }] })],
  finale: { who: 'piglet', dish: A.dishPizza(), title: 'Pizza night', line: 'Hot, cheesy and perfectly round!' },
});

add({
  id: 'cupcakes', cat: 'Cooking', name: 'Cupcakes',
  scene: kitchen(520) + bowlScene(240, 510, 125) + R(640, 290, 262, 230, 's-app', 18) + R(668, 330, 206, 160, 's-pan', 10) + R(668, 306, 206, 8, 's-metal', 4) + binScene(55, 520),
  groups: { egg: { dist: 50 }, butter: { dist: 50 }, sugar: { dist: 55 }, oven: { dist: 60 }, rack: { dist: 60 }, frost: { dist: 55 }, cherry: { dist: 45 }, junk: { dist: 90 } },
  phases: [
    P('Mix the batter', 'Put two eggs, butter and sugar in the bowl, then whisk it'),
    P('Bake', 'Put each batter cup in the oven, wait for the ding, then lift it onto the cooling rack'),
    P('Decorate', 'Frosting first, then a cherry on top'),
    P('Serve', 'Present the cupcakes'),
  ],
  slots: [
    S('egg', A.egg(), 175, 452, { st: 'mix' }), S('egg', A.egg(), 230, 448, { st: 'mix' }), S('butter', A.butter(), 290, 470, { st: 'mix' }), S('sugar', A.shortJar('#f6f1e4'), 345, 466, { st: 'mix' }),
    ...[[710, 380], [810, 380], [710, 455], [810, 455]].map(([x, y]) => S('oven', A.cupcakeRaw(), x, y, { phase: 2, cook: 3, cookText: 'baking' })),
    ...N(4, (i) => S('rack', A.cupcake(), 400 + i * 70, 486, { phase: 2 })),
    ...N(4, (i) => S('frost', A.frosting(), 400 + i * 70, 442, { phase: 3, needs: 8 + i, z: 3 })),
    ...N(4, (i) => S('cherry', A.cherry(), 400 + i * 70, 410, { phase: 3, needs: 12 + i, z: 4 })),
    binSlot(55, 520),
  ],
  items: [
    ...N(2, () => I('egg', A.egg(), { label: 'egg' })), I('butter', A.butter(), { label: 'butter' }), I('sugar', A.shortJar('#f6f1e4'), { label: 'sugar' }), I('junk', A.paperBall(), { label: 'wrapper' }),
    ...N(4, () => I('frost', A.frosting(), { label: 'frosting', phase: 3 })), ...N(4, () => I('cherry', A.cherry(), { label: 'cherry', phase: 3 })),
  ],
  tasks: [tap(520, 600, 'Present', 'Ta-da!', { phase: 4 })],
  stations: [station('mix', 240, 490, { title: 'Cupcake batter', process: { kind: 'scrub', verb: 'Whisk', w: 210, h: 38, color: '#f6dfa0' },
    makes: N(4, (i) => ({ group: 'oven', art: A.cupcakeRaw(), label: 'batter cup', after: A.cupcake(), then: 'rack', phase: 2, dx: -90 + i * 60, dy: -30 })) })],
  finale: { who: 'chick', dish: A.dishCupcakes(), title: 'Cupcakes', line: 'Cheep cheep! Sweet and fluffy!' },
});

add({
  id: 'fryup', cat: 'Cooking', name: 'Big breakfast',
  scene: wall() + tiles(0, 0, 1000, 500) + counter(500, 0, 780) + shelf(40, 520, 250) + panScene(170, 490, 110) + panScene(430, 490, 100) + plateScene(700, 498, 76)
    + R(805, 250, 150, 340, 's-app', 12),
  fg: R(528, 420, 124, 80, 's-metal', 16) + R(548, 420, 40, 6, 's-pan', 3) + R(596, 420, 40, 6, 's-pan', 3),
  groups: { egg: { dist: 50 }, cheese: { dist: 60 }, pan: { dist: 55 }, toaster: { dist: 55 }, plateOm: { dist: 70 }, plateBacon: { dist: 50 }, plateToast: { dist: 45 }, jam: { dist: 60 }, mug: { dist: 55 }, butterDish: { dist: 60 } },
  phases: [
    P('Get ready', 'Scrub the stove and open the fridge'),
    P('Cook', 'Eggs and cheese go in the left pan and become an omelette. Bacon goes in the right pan, bread in the toaster. Lift everything onto the plate when it is ready'),
    P('Set the table', 'Put the jam, mug and butter on the shelf'),
  ],
  slots: [
    S('egg', A.egg(), 140, 454, { st: 'omelette', phase: 2 }), S('egg', A.egg(), 200, 454, { st: 'omelette', phase: 2 }), S('cheese', A.cheeseWedge(), 268, 452, { st: 'omelette', phase: 2 }),
    S('pan', A.bacon(false), 400, 458, { phase: 2, cook: 3, cookText: 'frying' }), S('pan', A.bacon(false), 400, 480, { phase: 2, cook: 3, cookText: 'frying' }),
    S('toaster', A.breadSlice(false), 560, 412, { phase: 2, cook: 3, pop: 34, cookText: 'toasting' }), S('toaster', A.breadSlice(false), 626, 412, { phase: 2, cook: 3, pop: 34, cookText: 'toasting' }),
    S('plateOm', A.omelette(), 696, 482, { phase: 2 }),
    S('plateBacon', A.bacon(true), 742, 468, { phase: 2 }), S('plateBacon', A.bacon(true), 742, 488, { phase: 2 }),
    S('plateToast', A.scale(A.breadSlice(true), .55), 662, 466, { phase: 2 }), S('plateToast', A.scale(A.breadSlice(true), .55), 676, 472, { phase: 2 }),
    S('jam', A.jam(), 110, 209, { phase: 3 }), S('mug', A.mug(), 225, 220, { phase: 3 }), S('butterDish', A.butterDish(), 340, 229, { phase: 3 }),
  ],
  items: [
    ...N(2, (i) => I('pan', A.bacon(false), { label: 'bacon', inside: 'fridge', phase: 2, x: 880, y: 305 + i * 32, after: A.bacon(true), then: 'plateBacon' })),
    ...N(2, (i) => I('egg', A.egg(), { label: 'egg', inside: 'fridge', phase: 2, x: 905 + i * 32, y: 452 })),
    I('cheese', A.cheeseWedge(), { label: 'cheese', inside: 'fridge', phase: 2, x: 845, y: 445 }),
    ...N(2, (i) => I('toaster', A.breadSlice(false), { label: 'bread', inside: 'fridge', phase: 2, x: 840 + i * 80, y: 545, after: A.scale(A.breadSlice(true), .55), then: 'plateToast' })),
    I('jam', A.jam(), { label: 'jam', phase: 3 }), I('mug', A.mug('#f2c14e', '#d6584a'), { label: 'mug', phase: 3 }), I('butterDish', A.butterDish(), { label: 'butter', phase: 3 }),
  ],
  tasks: [
    scrub('Scrub', 300, 497, 320, 22, '#6b5b3a'),
    open('fridge', 880, 420, A.fridgeDoor(150, 340, false), A.fridgeDoor(150, 340, true), { hint: 'Tap to open the fridge' }),
  ],
  stations: [station('omelette', 200, 470, { phase: 2, title: 'Omelette', process: { kind: 'timer', secs: 3, text: 'cooking' },
    makes: [{ group: 'plateOm', art: A.omelette(), label: 'omelette', phase: 2, dy: -8 }] })],
  finale: { who: 'monkey', dish: A.dishFryup(), title: 'Big breakfast', line: 'Ooh ooh! Eggs, bacon AND toast!' },
});

add({
  id: 'pancakes', cat: 'Cooking', name: 'Pancake stack',
  scene: kitchen(520) + bowlScene(210, 508, 125) + panScene(585, 492, 100) + panScene(790, 492, 95) + plateScene(400, 500, 105),
  groups: { flour: { dist: 55 }, milk: { dist: 60 }, egg: { dist: 50 }, pan: { dist: 90 }, stack: { dist: 80 }, butter: { dist: 45 }, syrup: { dist: 80 }, berry: { dist: 45 } },
  phases: [
    P('Mix the batter', 'Put flour, milk and an egg in the bowl, then whisk'),
    P('Fry & stack', 'Pour each batter into a pan, wait for the ding, then flip it onto the plate'),
    P('Top it', 'Butter, then syrup, then berries'),
    P('Serve', 'Bring it to the table'),
  ],
  slots: [
    S('flour', A.shortJar('#f1ece2'), 150, 462, { st: 'batter' }), S('milk', A.milk(), 225, 454, { st: 'batter' }), S('egg', A.egg(), 292, 468, { st: 'batter' }),
    S('pan', A.batter(), 585, 470, { phase: 2, cook: 3, cookText: 'frying' }), S('pan', A.batter(), 790, 470, { phase: 2, cook: 3, cookText: 'frying' }),
    S('stack', A.pancake(), 400, 484, { phase: 2, z: 1 }), S('stack', A.pancake(), 402, 458, { phase: 2, needs: 5, z: 2 }), S('stack', A.pancake(), 398, 432, { phase: 2, needs: 6, z: 3 }),
    S('butter', A.butter(), 400, 405, { phase: 3, needs: 7, z: 4 }), S('syrup', A.syrup(), 400, 420, { phase: 3, needs: 8, z: 5 }),
    ...[[345, 392], [400, 378], [455, 392]].map(([x, y]) => S('berry', A.strawberry(), x, y, { phase: 3, needs: 9, z: 6 })),
  ],
  items: [
    I('flour', A.shortJar('#f1ece2'), { label: 'flour' }), I('milk', A.milk(), { label: 'milk' }), I('egg', A.egg(), { label: 'egg' }),
    I('butter', A.butter(), { label: 'butter', phase: 3 }), I('syrup', A.syrup(), { label: 'syrup', phase: 3 }), ...N(3, () => I('berry', A.strawberry(), { label: 'strawberry', phase: 3 })),
  ],
  tasks: [tap(400, 600, 'Serve', 'Breakfast!', { phase: 4 })],
  stations: [station('batter', 210, 490, { title: 'Pancake batter', process: { kind: 'scrub', verb: 'Whisk', w: 190, h: 36, color: '#f6e6b8' },
    makes: N(3, (i) => ({ group: 'pan', art: A.batter(), label: 'batter', after: A.pancake(), then: 'stack', phase: 2, dx: -70 + i * 70, dy: -36 })) })],
  finale: { who: 'fawn', dish: A.dishPancakes(), title: 'Pancake stack', line: 'Fluffy pancakes! Can I have the strawberries?' },
});

add({
  id: 'salad', cat: 'Cooking', name: 'Crunchy salad',
  scene: kitchen(520) + `<ellipse class="s-basin" cx="150" cy="512" rx="86" ry="12"/><rect class="s-metal" x="142" y="440" width="14" height="48" rx="5"/><path class="s-metal" d="M142 442 Q150 424 176 430" fill="none" stroke-width="8"/>` + bowlScene(450, 510, 110) + bowlScene(730, 508, 70),
  groups: { leaf: { dist: 70 }, tom: { dist: 40 }, cuc: { dist: 40 }, oil: { dist: 55 }, lemon: { dist: 55 }, dressing: { dist: 80 } },
  phases: [
    P('Prep', 'Rub the lettuce clean under the tap. Swipe across the tomato and cucumber to chop them'),
    P('Build the salad', 'Leaves go in the bowl first, then the tomatoes and cucumber on top'),
    P('Dressing', 'Put oil and lemon in the little bowl, whisk, then pour it over the salad'),
    P('Toss', 'Mix it all together'),
  ],
  slots: [
    S('leaf', A.leaf(), 390, 478, { phase: 2 }), S('leaf', A.leaf(), 450, 470, { phase: 2 }), S('leaf', A.leaf(), 510, 478, { phase: 2 }),
    ...[[392, 438], [512, 438], [452, 424]].map(([x, y]) => S('tom', A.cherryTomato(), x, y, { phase: 2, needs: 2 })),
    ...[[418, 456], [484, 456], [452, 450]].map(([x, y]) => S('cuc', A.cucumber(), x, y, { phase: 2, needs: 5 })),
    S('oil', A.oilBottle('#c9d65a'), 700, 450, { st: 'dress', phase: 3 }), S('lemon', A.lemon(), 765, 478, { st: 'dress', phase: 3 }),
    S('dressing', A.shortJar('#d8e08a'), 452, 392, { phase: 3, needs: 8 }),
  ],
  items: [I('oil', A.oilBottle('#c9d65a'), { label: 'olive oil', phase: 3 }), I('lemon', A.lemon(), { label: 'lemon', phase: 3 })],
  tasks: [
    scrub('Wash', 150, 468, 100, 70, '#7a5a3a', { base: A.lettuceHead(), yields: N(3, (i) => ({ group: 'leaf', art: A.leaf(), label: 'lettuce leaf', dx: -64 + i * 64, dy: -30, phase: 2, until: 2 })) }),
    chop(620, 466, A.tomato(), 2, N(3, (i) => ({ group: 'tom', art: A.cherryTomato(), label: 'tomato', dx: -40 + i * 40, dy: -50, phase: 2, until: 2 }))),
    chop(830, 498, A.cucLong(), 2, N(3, (i) => ({ group: 'cuc', art: A.cucumber(), label: 'cucumber', dx: -50 + i * 50, dy: -50, phase: 2, until: 2 }))),
    tap(450, 600, 'Toss it', 'Delicious!', { phase: 4 }),
  ],
  stations: [station('dress', 730, 486, { phase: 3, title: 'Dressing', process: { kind: 'scrub', verb: 'Whisk', w: 100, h: 30, color: '#d8e08a' },
    makes: [{ group: 'dressing', art: A.shortJar('#d8e08a'), label: 'dressing', phase: 3, dy: -14 }] })],
  finale: { who: 'bunny', dish: A.dishSalad(), title: 'Crunchy salad', line: 'Crunch crunch! Fresh from the garden!' },
});

add({
  id: 'sushi', cat: 'Cooking', name: 'Sushi platter',
  scene: kitchen(520) + R(690, 492, 290, 28, 's-wood', 8) + `<ellipse class="s-pan" cx="175" cy="514" rx="82" ry="14"/><rect class="s-pan" x="100" y="460" width="150" height="54" rx="14"/><rect class="s-metal" x="110" y="468" width="130" height="8" rx="4"/>`,
  groups: { riceJar: { dist: 55 }, water: { dist: 55 }, rice: { dist: 45 }, salmon: { dist: 45 }, cuke: { dist: 45 }, soy: { dist: 55 }, chop: { dist: 70 } },
  phases: [
    P('Cook the rice', 'Put rice and water in the cooker and wait for it to steam. Swipe across the salmon and cucumber to cut them'),
    P('Roll', 'Rice goes on the board first. Put salmon on two, cucumber on the other two'),
    P('Serve', 'Add the soy sauce and chopsticks'),
    P('Present', 'Bring the platter out'),
  ],
  slots: [
    S('riceJar', A.shortJar('#fbfaf5'), 140, 436, { st: 'rice' }), S('water', A.glassCup(), 214, 428, { st: 'rice' }),
    ...N(4, (i) => S('rice', A.riceMound(), 730 + i * 70, 484, { phase: 2 })),
    S('salmon', A.salmonSlice(), 730, 462, { phase: 2, needs: 2 }), S('salmon', A.salmonSlice(), 800, 462, { phase: 2, needs: 3 }),
    S('cuke', A.cukeStick(), 870, 466, { phase: 2, needs: 4 }), S('cuke', A.cukeStick(), 940, 466, { phase: 2, needs: 5 }),
    S('soy', A.soyDish(), 640, 500, { phase: 3 }), S('chop', A.chopsticks(), 520, 508, { phase: 3 }),
  ],
  items: [I('riceJar', A.shortJar('#fbfaf5'), { label: 'rice' }), I('water', A.glassCup(), { label: 'water' }), I('soy', A.soyDish(), { label: 'soy sauce', phase: 3 }), I('chop', A.chopsticks(), { label: 'chopsticks', phase: 3 })],
  tasks: [
    chop(380, 496, A.salmonBlock(), 2, N(2, (i) => ({ group: 'salmon', art: A.salmonSlice(), label: 'salmon', dx: -30 + i * 60, dy: -36, phase: 2, until: 2 }))),
    chop(560, 498, A.cucLong(), 1, N(2, (i) => ({ group: 'cuke', art: A.cukeStick(), label: 'cucumber', dx: -40 + i * 80, dy: -36, phase: 2, until: 2 }))),
    tap(500, 600, 'Serve', 'Itadakimasu!', { phase: 4 }),
  ],
  stations: [station('rice', 175, 470, { title: 'Sushi rice', process: { kind: 'timer', secs: 3, text: 'steaming' },
    makes: N(4, (i) => ({ group: 'rice', art: A.riceMound(), label: 'sushi rice', phase: 2, dx: -75 + i * 50, dy: -34 })) })],
  finale: { who: 'cub', dish: A.dishSushi(), title: 'Sushi platter', line: 'Roll, slice, yum! Best sushi ever!' },
});
})();
