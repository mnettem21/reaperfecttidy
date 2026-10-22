// Tidy Snap levels, part 3: organizing. Nothing here is "put it anywhere". Every item belongs to one exact spot,
// decided by colour (rainbow shelves, shirts, crayons, lipsticks), design (socks, cushions, stickers) or size (jars, shoes, books).
(() => {
const { A, R, wall, floor, tiles, shelf, windowPane, counter, binScene, S, I, P, N, scrub, chop, open, tap, station } = window.LV;
const add = (l) => window.LEVELS.push(l);
const builder = () => { const list = []; const push = (group, art, x, y, o = {}) => { list.push(S(group, art, x, y, o)); return list.length - 1; }; return { list, push }; };
const bin = (push, x, yb) => push('junk', A.none(100, 130), x, yb - 58, { sink: true });
const box = (id, x, y, rows, o = {}) => open(id, x, y, A.cardboard(190, 130, false), A.cardboard(190, 130, true), { hint: 'Tap to open the box', rows, ...o });
const bench = (x0, x1, y) => R(x0, y, x1 - x0, 14, 's-wood', 4) + R(x0 + 12, y + 14, 12, 70, 's-wooddk') + R(x1 - 24, y + 14, 12, 70, 's-wooddk');
const rot = (o) => ({ rot: true, ...o });

/* -------------------------------- Rainbow bookshelf -------------------------------- */
{
  const { list, push } = builder();
  const colors = [['red', '#d6584a'], ['orange', '#e8903a'], ['yellow', '#e0b83a'], ['green', '#4c9a6a'], ['blue', '#3f7cc9'], ['purple', '#8a5cc0']];
  colors.forEach(([n, c], i) => { [0, 1].forEach((k) => push('bk-' + n, A.book(c), 198 + ((i % 3) * 2 + k) * 48, i < 3 ? 225 : 425, { phase: 2, show: true })); });
  push('vase-s', A.scale(A.vase(), .6), 700, 297, { phase: 3, show: true }); push('vase-m', A.scale(A.vase(), .8), 780, 285, { phase: 3, show: true }); push('vase-l', A.vase(), 860, 274, { phase: 3, show: true });
  bin(push, 600, 545);
  const order = [4, 1, 3, 0, 5, 2, 1, 4, 0, 3, 2, 5];
  add({
    id: 'bookshelf', cat: 'Organizing', name: 'Rainbow bookshelf',
    scene: wall() + floor(545) + windowPane(660, 60, 200, 150)
      + R(118, 96, 404, 440, 's-wooddk', 6) + R(134, 112, 372, 400, 's-wood') + R(134, 300, 372, 12, 's-wooddk') + R(134, 500, 372, 20, 's-wooddk')
      + R(640, 330, 280, 10, 's-wood', 3) + R(660, 340, 8, 16, 's-wooddk') + R(892, 340, 8, 16, 's-wooddk') + binScene(600, 545),
    groups: Object.fromEntries([...colors.map(([n]) => ['bk-' + n, { dist: 45 }]), ['vase-s', { dist: 50 }], ['vase-m', { dist: 50 }], ['vase-l', { dist: 55 }], ['junk', { dist: 90 }]]),
    phases: [
      P('Clear up', 'Wipe the dust off the top and bin the old newspaper, paper and cobweb'),
      P('Rainbow order', 'Every book has a colour spot: red, orange and yellow on the top shelf; green, blue and purple below'),
      P('Vases by size', 'Smallest on the left, biggest on the right'),
    ],
    slots: list,
    items: [
      I('junk', A.newspaper(), { label: 'old newspaper' }), I('junk', A.paperBall(), { label: 'scrap paper' }), I('junk', A.cobweb(), { label: 'cobweb' }),
      ...order.map((ci, k) => I('bk-' + colors[ci][0], A.book(colors[ci][1]), { label: colors[ci][0] + ' book', phase: 2 })),
      I('vase-l', A.vase(), { label: 'big vase', phase: 3 }), I('vase-s', A.scale(A.vase(), .6), { label: 'small vase', phase: 3 }), I('vase-m', A.scale(A.vase(), .8), { label: 'medium vase', phase: 3 }),
    ],
    tasks: [scrub('Dust', 320, 102, 380, 14, '#cfc8b8')],
    finale: { who: 'monkey', title: 'Rainbow bookshelf', line: 'Ooh ooh! A rainbow made of books!' },
  });
}

/* ----------------------------------- Sock drawer ----------------------------------- */
{
  const { list, push } = builder();
  const designs = [['stripe', '#d6584a'], ['dots', '#3f7cc9'], ['heart', '#e98a9a'], ['plain', '#4c9a6a']];
  designs.forEach(([k, c], i) => { push('sock-' + k, A.sockP(k, c), 170 + i * 130, 155, { phase: 2, show: true, st: 'pair-' + k }); push('sock-' + k, A.sockP(k, c), 230 + i * 130, 155, { phase: 2, show: true, st: 'pair-' + k }); });
  designs.forEach(([k, c], i) => push('pair-' + k, A.pairBall(k, c), 192 + i * 125, 396, { phase: 3, show: true }));
  bin(push, 770, 560);
  const order = [2, 0, 3, 1, 0, 2, 1, 3];
  add({
    id: 'socks', cat: 'Organizing', name: 'Sock drawer',
    scene: wall() + floor(560) + R(100, 190, 580, 16, 's-wood', 4) + R(110, 206, 560, 354, 's-wooddk', 10) + R(130, 222, 520, 104, 's-wood', 6) + R(130, 336, 520, 110, 's-wall2', 6)
      + [1, 2, 3].map((i) => R(130 + i * 125 - 3, 336, 6, 110, 's-wooddk')).join('') + R(130, 456, 520, 90, 's-wood', 6) + R(380, 490, 80, 8, 's-metal', 4) + binScene(770, 560) + windowPane(740, 60, 180, 110),
    groups: Object.fromEntries([...designs.flatMap(([k]) => [['sock-' + k, { dist: 50 }], ['pair-' + k, { dist: 60 }]]), ['junk', { dist: 90 }]]),
    phases: [
      P('Empty the drawer', 'Open the top drawer, wipe the dust on top and bin the two holey socks'),
      P('Match the pairs', 'Put the two socks with the same design next to each other and they roll up into a pair'),
      P('File by design', 'Each rolled pair goes in the compartment with its own design'),
    ],
    slots: list,
    items: [
      ...N(2, () => I('junk', A.sock(), { label: 'holey sock', inside: 'drawer' })),
      ...order.map((di) => I('sock-' + designs[di][0], A.sockP(designs[di][0], designs[di][1]), { label: designs[di][0] + ' sock', inside: 'drawer', phase: 2 })),
    ],
    tasks: [
      open('drawer', 390, 274, A.drawer(520, 100, false), A.drawer(520, 100, true), { hint: 'Tap to open the top drawer', rows: [{ x0: 140, x1: 660, y: 306 }] }),
      scrub('Dust', 390, 198, 560, 12, '#cfc8b8'),
    ],
    stations: designs.map(([k, c], i) => station('pair-' + k, 200 + i * 130, 150, { phase: 2, title: k + ' pair', makes: [{ group: 'pair-' + k, art: A.pairBall(k, c), label: k + ' pair', phase: 3, until: 3, dy: -4 }] })),
    finale: { who: 'piglet', title: 'Sock drawer', line: 'Oink! Every sock has a buddy!' },
  });
}

/* -------------------------------------- Closet -------------------------------------- */
{
  const { list, push } = builder();
  [['blue', '#3f7cc9'], ['red', '#d6584a'], ['yellow', '#e0b83a']].forEach(([n, c], i) => { [0, 1].forEach((k) => push('sh-' + n, A.shirt(c), 145 + (i * 2 + k) * 115, 232, { phase: 2, show: true })); });
  [['s', .6, 115, 195], ['m', .8, 290, 395], ['l', 1, 520, 650]].forEach(([n, s, a, b]) => {
    const art = A.scale(A.shoe(), s); const y = 430 - art.h / 2;
    push('shoe-' + n, art, a, y, { phase: 3, show: true }); push('shoe-' + n, art, b, y, { phase: 3, show: true });
  });
  push('hat', A.hat(), 400, 88, { phase: 3 });
  bin(push, 850, 560);
  const sh = [['red', '#d6584a'], ['blue', '#3f7cc9'], ['yellow', '#e0b83a'], ['blue', '#3f7cc9'], ['yellow', '#e0b83a'], ['red', '#d6584a']];
  add({
    id: 'closet', cat: 'Organizing', name: 'Closet',
    scene: wall() + floor(560) + R(60, 60, 720, 500, 's-wooddk', 10) + R(72, 72, 696, 476, 's-wall2') + R(90, 160, 660, 8, 's-metal', 4) + R(72, 120, 696, 10, 's-wood') + R(72, 430, 696, 12, 's-wood')
      + R(72, 442, 696, 106, 's-wall', 0, 'opacity=".4"') + binScene(850, 560),
    groups: { 'sh-blue': { dist: 80 }, 'sh-red': { dist: 80 }, 'sh-yellow': { dist: 80 }, 'shoe-s': { dist: 50 }, 'shoe-m': { dist: 55 }, 'shoe-l': { dist: 65 }, hat: { dist: 70 }, junk: { dist: 90 } },
    phases: [
      P('Unpack', 'Open the suitcase and the shoebox. Wipe the dust off the shelf and bin the old tag and the holey sock'),
      P('Hang by colour', 'Each shirt hangs in a spot of its own colour: blue, red and yellow pairs'),
      P('Shoes by size', 'Shoes sit smallest to biggest, left to right. The hat goes on the top shelf'),
    ],
    slots: list,
    items: [
      I('junk', A.paperBall(), { label: 'old tag', inside: 'shoebox' }), I('junk', A.sock(), { label: 'holey sock', inside: 'shoebox' }),
      ...sh.map(([n, c]) => I('sh-' + n, A.shirt(c), { label: n + ' shirt', inside: 'suit', phase: 2 })),
      ...[['l', 1], ['s', .6], ['m', .8], ['m', .8], ['l', 1], ['s', .6]].map(([n, s]) => I('shoe-' + n, A.scale(A.shoe(), s), { label: { s: 'small', m: 'medium', l: 'big' }[n] + ' shoe', inside: 'shoebox', phase: 3 })),
      I('hat', A.hat(), { label: 'hat', inside: 'shoebox', phase: 3 }),
    ],
    tasks: [
      open('suit', 890, 455, A.bagzip(190, 140, false), A.bagzip(190, 140, true), { hint: 'Tap to open the suitcase', rows: [{ x0: 30, x1: 960, y: 692 }] }),
      open('shoebox', 890, 570, A.cardboard(150, 100, false), A.cardboard(150, 100, true), { hint: 'Tap to open the shoebox', rows: [{ x0: 30, x1: 800, y: 600 }] }),
      scrub('Dust', 420, 424, 600, 10, '#cfc8b8'),
    ],
    finale: { who: 'fawn', title: 'Closet', line: 'A rainbow of shirts and tidy shoes!' },
  });
}

/* ---------------------------------- Makeup bag ---------------------------------- */
{
  const { list, push } = builder();
  [['red', ['#c8102e', '#d6334a']], ['pink', ['#e5a0b4', '#f06292']], ['nude', ['#c9a07a', '#b8896a']]].forEach(([n, cs], i) => { [0, 1].forEach((k) => push('lip-' + n, A.lipstick(cs[0]), 100 + (i * 2 + k) * 45 + i * 8, 379, { phase: 2, show: true })); });
  [['s', .7, 570], ['m', .85, 597], ['l', 1, 624]].forEach(([n, s, x]) => { const art = A.scale(A.brush('#d9b25a'), s); push('br-' + n, art, x, 395 - art.h / 2, { phase: 3, show: true }); });
  push('compact', A.scale(A.compact(), .6), 440, 405, { phase: 3 }); push('palette', A.scale(A.palette(), .5), 510, 404, { phase: 3 });
  bin(push, 930, 558);
  add({
    id: 'makeup', cat: 'Organizing', name: 'Makeup bag',
    scene: wall() + `<ellipse class="s-wood" cx="320" cy="190" rx="168" ry="176"/><ellipse class="s-glass" cx="320" cy="190" rx="154" ry="162"/><path d="M210 120 L300 40" stroke="#fff" stroke-width="10" opacity=".5" stroke-linecap="round"/>`
      + R(40, 430, 920, 18, 's-wood', 4) + R(60, 448, 880, 110, 's-wooddk') + floor(558) + R(60, 390, 310, 40, 's-pan', 8) + R(550, 395, 90, 35, 's-cup', 8) + binScene(930, 558),
    groups: { 'lip-red': { dist: 40 }, 'lip-pink': { dist: 40 }, 'lip-nude': { dist: 40 }, 'br-s': { dist: 35 }, 'br-m': { dist: 35 }, 'br-l': { dist: 40 }, compact: { dist: 45 }, palette: { dist: 55 }, junk: { dist: 90 } },
    phases: [
      P('Empty the bag', 'Unzip the bag, wipe up the spilled powder and bin the dried-up mascara and old sponge'),
      P('Lipsticks by shade', 'Two reds, two pinks and two nudes. Each shade has its own spot in the tray'),
      P('Brushes & the rest', 'Brushes go in the cup shortest to longest. Compact and palette on the table'),
      P('Zip it up', 'Close the bag'),
    ],
    slots: list,
    items: [
      I('junk', A.mascara(), rot({ label: 'dried-up mascara', inside: 'bag' })), I('junk', A.sponge(), { label: 'old sponge', inside: 'bag' }),
      I('lip-nude', A.lipstick('#c9a07a'), { label: 'nude lipstick', inside: 'bag', phase: 2 }), I('lip-red', A.lipstick('#c8102e'), { label: 'red lipstick', inside: 'bag', phase: 2 }), I('lip-pink', A.lipstick('#e5a0b4'), { label: 'pink lipstick', inside: 'bag', phase: 2 }),
      I('lip-pink', A.lipstick('#f06292'), { label: 'pink lipstick', inside: 'bag', phase: 2 }), I('lip-red', A.lipstick('#d6334a'), { label: 'red lipstick', inside: 'bag', phase: 2 }), I('lip-nude', A.lipstick('#b8896a'), { label: 'nude lipstick', inside: 'bag', phase: 2 }),
      I('br-l', A.brush('#d9b25a'), { label: 'long brush', inside: 'bag', phase: 3 }), I('br-s', A.scale(A.brush('#d9b25a'), .7), { label: 'short brush', inside: 'bag', phase: 3 }), I('br-m', A.scale(A.brush('#d9b25a'), .85), { label: 'medium brush', inside: 'bag', phase: 3 }),
      I('palette', A.scale(A.palette(), .5), { label: 'eyeshadow palette', inside: 'bag', phase: 3 }), I('compact', A.scale(A.compact(), .6), { label: 'compact', inside: 'bag', phase: 3 }),
    ],
    tasks: [
      open('bag', 810, 330, A.bagzip(300, 200, false), A.bagzip(300, 200, true), { hint: 'Tap to unzip the bag', rows: [{ x0: 30, x1: 960, y: 692 }] }),
      scrub('Wipe', 430, 436, 260, 14, '#e9c3b0'),
      tap(810, 490, 'Zip it up', 'All zipped!', { phase: 4 }),
    ],
    finale: { who: 'bunny', title: 'Makeup bag', line: 'Hop hop! Everything sparkles in its place!' },
  });
}

/* ------------------------------------- Fridge ------------------------------------- */
{
  const { list, push } = builder();
  push('eggs', A.eggCarton(), 200, 197, { phase: 2, show: true }); push('cheese', A.cheeseWedge(), 420, 189, { phase: 2 });
  push('yog-pink', A.yogurt('#f2a7b8'), 130, 349, { phase: 2, show: true }); push('yog-green', A.yogurt('#9fd17a'), 200, 349, { phase: 2, show: true });
  push('jam', A.jam(), 300, 339, { phase: 2 }); push('butter', A.butterDish(), 420, 359, { phase: 2 });
  push('veg-green', A.lettuceHead(), 140, 614, { phase: 2, show: true }); push('veg-green', A.broccoli(), 235, 616, { phase: 2, show: true });
  push('veg-warm', A.tomato(), 345, 618, { phase: 2, show: true }); push('veg-warm', A.tomato(), 415, 618, { phase: 2, show: true }); push('veg-warm', A.scale(A.carrot(), .6), 475, 612, { phase: 2, show: true });
  push('bot-l', A.milk(), 590, 174, { phase: 2, show: true }); push('bot-m', A.scale(A.juice(), .8), 590, 347, { phase: 2, show: true }); push('bot-s', A.scale(A.sauce(), .6), 590, 529, { phase: 2, show: true });
  bin(push, 850, 640);
  add({
    id: 'fridge', cat: 'Organizing', name: 'Fridge',
    scene: wall() + tiles(660, 0, 340, 640) + counter(640, 670, 1000) + shelf(690, 980, 180) + shelf(690, 980, 330) + shelf(690, 980, 480) + binScene(850, 640)
      + R(50, 20, 620, 670, 's-app', 24) + R(80, 50, 440, 620, 's-fridgein', 10) + R(80, 220, 440, 8, 's-glassdk') + R(80, 380, 440, 8, 's-glassdk') + R(110, 212, 200, 6, 's-plate', 3)
      + R(530, 50, 120, 620, 's-app2', 10) + R(536, 240, 108, 8, 's-glassdk') + R(536, 400, 108, 8, 's-glassdk') + R(536, 560, 108, 8, 's-glassdk') + R(292, 570, 6, 100, 's-glassdk'),
    fg: R(90, 566, 420, 100, 's-glass', 10, 'opacity=".55"'),
    groups: { eggs: { dist: 70 }, cheese: { dist: 60 }, 'yog-pink': { dist: 45 }, 'yog-green': { dist: 45 }, jam: { dist: 50 }, butter: { dist: 55 }, 'veg-green': { dist: 55 }, 'veg-warm': { dist: 50 }, 'bot-l': { dist: 60 }, 'bot-m': { dist: 60 }, 'bot-s': { dist: 55 }, junk: { dist: 90 } },
    phases: [
      P('Clear out', 'Wipe up the spill and bin the three spoiled things that smell'),
      P('Restock by zone', 'The egg carton and cheese on top, pink and green yogurt, jam and butter in the middle. Greens left and reds and oranges right in the drawer. Bottles on the door, tallest at the top'),
      P('Close the door', 'Shut it before the cold gets out'),
    ],
    slots: list,
    items: [
      I('junk', A.milk(), rot({ label: 'spoiled milk', x: 150, y: 154 })), I('junk', A.cheeseWedge(), rot({ label: 'mouldy cheese', x: 320, y: 189 })), I('junk', A.tomato(), rot({ label: 'squishy tomato', x: 250, y: 349 })),
      I('bot-s', A.scale(A.sauce(), .6), { label: 'small sauce bottle', phase: 2 }), I('veg-warm', A.tomato(), { label: 'tomato', phase: 2 }), I('yog-pink', A.yogurt('#f2a7b8'), { label: 'strawberry yogurt', phase: 2 }),
      I('bot-l', A.milk(), { label: 'milk', phase: 2 }), I('veg-green', A.lettuceHead(), { label: 'lettuce', phase: 2 }), I('cheese', A.cheeseWedge(), { label: 'cheese', phase: 2 }),
      I('bot-m', A.scale(A.juice(), .8), { label: 'juice', phase: 2 }), I('veg-warm', A.scale(A.carrot(), .6), { label: 'carrot', phase: 2 }), I('yog-green', A.yogurt('#9fd17a'), { label: 'kiwi yogurt', phase: 2 }),
      I('jam', A.jam(), { label: 'jam', phase: 2 }), I('veg-green', A.broccoli(), { label: 'broccoli', phase: 2 }), I('butter', A.butterDish(), { label: 'butter', phase: 2 }),
      I('veg-warm', A.tomato(), { label: 'tomato', phase: 2 }), I('eggs', A.eggCarton(), { label: 'egg carton', phase: 2 }),
    ],
    rows: [{ x0: 690, x1: 980, y: 190 }, { x0: 690, x1: 980, y: 340 }, { x0: 690, x1: 980, y: 490 }],
    tasks: [scrub('Wipe', 300, 372, 300, 16, '#a8c9a0', { shape: 'disc' }), tap(300, 40, 'Close the door', 'Closed!', { phase: 3 })],
    finale: { who: 'cub', title: 'Fridge', line: 'Everything is sorted! I am hungry now...' },
  });
}

/* ----------------------------------- Spice rack ----------------------------------- */
{
  const { list, push } = builder();
  const rows = [['red', '#c8432f', 250], ['yellow', '#e8b520', 400], ['green', '#4c9a3a', 550]];
  rows.forEach(([n, c, y]) => [['s', .7, 270], ['m', .85, 380], ['l', 1, 490]].forEach(([sz, s, x]) => { const art = A.scale(A.spiceJar(c), s); push(`${n}-${sz}`, art, x, y - art.h / 2, { phase: 2, show: true }); }));
  const t1 = push('tin-l', A.can('#8a8f93'), 720, 574, { phase: 3, z: 1, show: true });
  const t2 = push('tin-m', A.scale(A.can('#8a8f93'), .8), 720, 491, { phase: 3, needs: t1, z: 2, show: true });
  push('tin-s', A.scale(A.can('#8a8f93'), .6), 720, 427, { phase: 3, needs: t2, z: 3, show: true });
  bin(push, 100, 620);
  const jars = []; rows.forEach(([n, c]) => [['s', .7], ['m', .85], ['l', 1]].forEach(([sz, s]) => jars.push([n, c, sz, s])));
  const mix = [4, 0, 7, 2, 8, 5, 1, 6, 3];
  add({
    id: 'spices', cat: 'Organizing', name: 'Spice rack',
    scene: wall() + tiles(0, 0, 1000, 620) + counter(620) + R(180, 90, 14, 490, 's-wooddk', 4) + R(606, 90, 14, 490, 's-wooddk', 4)
      + rows.map(([, , y]) => R(190, y, 420, 12, 's-wood', 3)).join('') + binScene(100, 620)
      + rows.map(([, c, y]) => `<circle cx="210" cy="${y - 20}" r="9" fill="${c}"/>`).join(''),
    groups: { ...Object.fromEntries(rows.flatMap(([n]) => ['s', 'm', 'l'].map((sz) => [`${n}-${sz}`, { dist: 45 }]))), 'tin-l': { dist: 80 }, 'tin-m': { dist: 70 }, 'tin-s': { dist: 60 }, junk: { dist: 90 } },
    phases: [
      P('Unbox', 'Open the pantry box, wipe the sticky shelf and bin the two expired jars'),
      P('Colour & size', 'Red on the top shelf, yellow in the middle, green on the bottom. On each shelf the smallest jar goes on the left'),
      P('Stack the tins', 'Biggest tin at the bottom, smallest on top'),
    ],
    slots: list,
    items: [
      ...N(2, () => I('junk', A.spiceJar('#8a7a4a'), rot({ label: 'expired jar', inside: 'box1' }))),
      ...mix.map((k) => I(`${jars[k][0]}-${jars[k][2]}`, A.scale(A.spiceJar(jars[k][1]), jars[k][3]), { label: `${jars[k][2] === 's' ? 'small' : jars[k][2] === 'm' ? 'medium' : 'big'} ${jars[k][0]} jar`, inside: 'box1', phase: 2 })),
      I('tin-s', A.scale(A.can('#8a8f93'), .6), { label: 'small tin', inside: 'box1', phase: 3 }), I('tin-l', A.can('#8a8f93'), { label: 'big tin', inside: 'box1', phase: 3 }), I('tin-m', A.scale(A.can('#8a8f93'), .8), { label: 'medium tin', inside: 'box1', phase: 3 }),
    ],
    tasks: [box('box1', 880, 575, [{ x0: 200, x1: 960, y: 692 }]), scrub('Wipe', 400, 258, 420, 12, '#8a6f4a')],
    finale: { who: 'chick', title: 'Spice rack', line: 'Cheep! A rainbow of spices, smallest to biggest!' },
  });
}

/* ------------------------------------ Craft corner ------------------------------------ */
{
  const { list, push } = builder();
  const cols = [['red', '#d6584a'], ['blue', '#3f7cc9'], ['green', '#4c9a3a'], ['yellow', '#e8b520']];
  cols.forEach(([n, c], i) => { [0, 1].forEach((k) => push('cr-' + n, A.crayon(c), 132 + i * 120 + k * 18, 382, { phase: 2, show: true })); });
  [['s', .6, 610], ['m', .8, 640], ['l', 1, 670]].forEach(([n, s, x]) => { const art = A.scale(A.pencil('#e0a93b'), s); push('pen-' + n, art, x, 415 - art.h / 2, { phase: 3, show: true }); });
  [['star', '#f2c14e'], ['heart', '#e0507a'], ['flower', '#e98ac8']].forEach(([k, c], i) => { [0, 1].forEach((j) => push('st-' + k, A.sticker(k, c), 810 + j * 68, 280 + i * 62, { phase: 3, show: true })); });
  bin(push, 60, 558);
  const order = [3, 0, 2, 1, 0, 3, 1, 2];
  add({
    id: 'craft', cat: 'Organizing', name: 'Craft corner',
    scene: wall('s-wallkid') + floor(558) + R(60, 430, 900, 18, 's-wood', 4) + R(76, 448, 14, 110, 's-wooddk') + R(930, 448, 14, 110, 's-wooddk')
      + cols.map(([, c], i) => `<path d="M${110 + i * 120} 346 H${190 + i * 120} L${184 + i * 120} 430 H${116 + i * 120}Z" fill="${c}"/><ellipse cx="${150 + i * 120}" cy="346" rx="40" ry="7" fill="#000" opacity=".25"/>`).join('')
      + `<path d="M590 380 H700 L694 430 H596Z" class="s-cup"/><ellipse cx="645" cy="380" rx="55" ry="7" fill="#000" opacity=".25"/>` + R(770, 230, 200, 200, 's-card', 10) + R(780, 240, 180, 180, 's-label', 6) + binScene(60, 558),
    groups: { ...Object.fromEntries(cols.map(([n]) => ['cr-' + n, { dist: 40 }])), 'pen-s': { dist: 35 }, 'pen-m': { dist: 35 }, 'pen-l': { dist: 40 }, 'st-star': { dist: 45 }, 'st-heart': { dist: 45 }, 'st-flower': { dist: 45 }, junk: { dist: 90 } },
    phases: [
      P('Open the craft box', 'Open the big box and the sticker box inside it. Wipe up the paint and bin the dried-up glue and scrap paper'),
      P('Crayons by colour', 'Each colour has its own cup: red, blue, green and yellow'),
      P('Pencils & stickers', 'Pencils go in the cup shortest to longest. Stickers go on the album page next to their own design'),
    ],
    slots: list,
    items: [
      I('junk', A.glue(), rot({ label: 'dried-up glue', inside: 'box1' })), I('junk', A.paperBall(), { label: 'scrap paper', inside: 'box1' }),
      ...order.map((ci) => I('cr-' + cols[ci][0], A.crayon(cols[ci][1]), { label: cols[ci][0] + ' crayon', inside: 'box1', phase: 2 })),
      I('pen-l', A.pencil('#e0a93b'), { label: 'long pencil', inside: 'box1', phase: 3 }), I('pen-s', A.scale(A.pencil('#e0a93b'), .6), { label: 'short pencil', inside: 'box1', phase: 3 }), I('pen-m', A.scale(A.pencil('#e0a93b'), .8), { label: 'medium pencil', inside: 'box1', phase: 3 }),
      ...[['flower', '#e98ac8'], ['star', '#f2c14e'], ['heart', '#e0507a'], ['star', '#f2c14e'], ['flower', '#e98ac8'], ['heart', '#e0507a']].map(([k, c]) => I('st-' + k, A.sticker(k, c), { label: k + ' sticker', inside: 'box2', phase: 3 })),
    ],
    tasks: [
      box('box1', 880, 575, [{ x0: 120, x1: 960, y: 692 }]),
      open('box2', 560, 565, A.cardboard(120, 86, false), A.cardboard(120, 86, true), { inside: 'box1', hint: 'Tap to open the sticker box', rows: [{ x0: 120, x1: 960, y: 604 }] }),
      scrub('Wipe', 330, 436, 280, 14, '#6ea8d9'),
    ],
    finale: { who: 'piglet', title: 'Craft corner', line: 'Oink! Now we can make something beautiful!' },
  });
}
})();
