// Tidy Snap levels, part 2: furniture and unpacking.
// Every room follows the same story: unbox (a big box with a small box inside it, plus drawers), build things from parts
// (stations), then dress the room. Whoever you finish for walks in at the end.
(() => {
const { A, R, wall, floor, windowPane, tiles, shelf, binScene, S, I, P, N, scrub, chop, open, tap, station } = window.LV;
const add = (l) => window.LEVELS.push(l);
const bench = (x0, x1, y) => R(x0, y, x1 - x0, 14, 's-wood', 4) + R(x0 + 12, y + 14, 12, 70, 's-wooddk') + R(x1 - 24, y + 14, 12, 70, 's-wooddk');
const box1 = (o = {}) => open('box1', 880, 575, A.cardboard(190, 130, false), A.cardboard(190, 130, true), { hint: 'Tap to open the big box', rows: [{ x0: 30, x1: 960, y: 692 }], ...o });
const box2 = (x, y, o = {}) => open('box2', x, y, A.cardboard(120, 86, false), A.cardboard(120, 86, true), { inside: 'box1', hint: 'Tap to open the small box', rows: [{ x0: 30, x1: 960, y: 604 }], ...o });
const junkSlot = (push, x, yb) => push('junk', A.none(100, 130), x, yb - 58, { sink: true });
const bubble = (o = {}) => I('junk', A.bubbleWrap(), { label: 'bubble wrap', inside: 'box1', ...o });
const peanuts = (o = {}) => I('junk', A.peanuts(), { label: 'packing peanuts', inside: 'box1', ...o });
const builder = () => { const list = []; const push = (group, art, x, y, o = {}) => { list.push(S(group, art, x, y, o)); return list.length - 1; }; return { list, push }; };

/* ---------------------------------- Bedroom ---------------------------------- */
{
  const { list, push } = builder();
  const duvet = push('duvet', A.duvet('#8fb3d9'), 285, 440, { phase: 2, z: 1 });
  push('pillow', A.scale(A.pillow('#c9d8ee'), .6), 125, 398, { phase: 2, needs: duvet, z: 2 });
  push('pillow', A.scale(A.pillow('#c9d8ee'), .6), 210, 398, { phase: 2, needs: duvet, z: 2 });
  push('teddy', A.teddy(), 410, 369, { phase: 2, needs: duvet, z: 2 });
  push('slipper', A.slipper(), 130, 578, { phase: 2 }); push('slipper', A.slipper(), 222, 583, { phase: 2 });
  push('lampBase', A.lampBase(), 765, 410, { phase: 2, st: 'lamp' }); push('lampShade', A.lampShade(), 830, 414, { phase: 2, st: 'lamp' });
  push('photo', A.photo(), 895, 422, { phase: 2, st: 'frame' }); push('picFrame', A.picFrame(), 950, 414, { phase: 2, st: 'frame' });
  junkSlot(push, 690, 560);
  push('lamp', A.lampFull(), 606, 365, { phase: 3 }); push('clock', A.alarm(), 540, 393, { phase: 3 }); push('framed', A.framedPhoto(), 300, 185, { phase: 3 });
  add({
    id: 'bedroom', cat: 'Unpacking', name: 'Cozy bedroom',
    scene: wall() + windowPane(540, 60, 160, 120) + floor(520)
      + R(50, 330, 26, 190, 's-wooddk', 6) + R(50, 470, 440, 36, 's-wooddk', 8) + R(60, 504, 14, 22, 's-wooddk') + R(466, 504, 14, 22, 's-wooddk') + R(76, 452, 408, 20, 's-fabric', 6)
      + R(520, 430, 110, 90, 's-wood', 6) + R(530, 441, 90, 3, 's-wooddk') + bench(730, 980, 440) + binScene(690, 560) + `<circle class="s-wooddk" cx="300" cy="150" r="5"/>`,
    groups: { duvet: { dist: 150 }, pillow: { dist: 60 }, teddy: { dist: 60 }, slipper: { dist: 60 }, lampBase: { dist: 40 }, lampShade: { dist: 45 }, photo: { dist: 40 }, picFrame: { dist: 45 }, lamp: { dist: 60 }, clock: { dist: 60 }, framed: { dist: 70 }, junk: { dist: 90 } },
    phases: [
      P('Unbox', 'Open the big box, the small box inside it and the nightstand drawer. Sweep the cobweb, wipe the dust and bin the packing'),
      P('Make the bed & build', 'Duvet first, then pillows and teddy. Put the lamp base and shade together, and the photo in its frame'),
      P('Finishing touches', 'Hang the picture on the nail, set the lamp and clock on the nightstand'),
    ],
    slots: list,
    items: [
      bubble(), peanuts(),
      I('duvet', A.duvet('#8fb3d9'), { label: 'duvet', inside: 'box1', phase: 2 }), ...N(2, () => I('pillow', A.scale(A.pillow('#c9d8ee'), .6), { label: 'pillow', inside: 'box1', phase: 2 })),
      I('teddy', A.teddy(), { label: 'teddy bear', inside: 'box1', phase: 2 }), ...N(2, () => I('slipper', A.slipper(), { label: 'slipper', inside: 'box1', phase: 2 })),
      I('lampBase', A.lampBase(), { label: 'lamp base', inside: 'box2', phase: 2 }), I('lampShade', A.lampShade(), { label: 'lamp shade', inside: 'box2', phase: 2 }),
      I('picFrame', A.picFrame(), { label: 'picture frame', inside: 'box2', phase: 2 }), I('clock', A.alarm(), { label: 'alarm clock', inside: 'box2', phase: 3 }),
      I('photo', A.photo(), { label: 'photo', inside: 'drawer', phase: 2, x: 575, y: 492 }),
    ],
    tasks: [
      box1(), box2(640, 560),
      open('drawer', 575, 490, A.drawer(90, 44, false), A.drawer(90, 44, true), { hint: 'Tap to open the drawer' }),
      scrub('Sweep', 60, 62, 96, 74, '#b9b5ac', { base: A.cobweb() }), scrub('Dust', 575, 430, 110, 14, '#cfc8b8'),
    ],
    stations: [
      station('lamp', 797, 384, { phase: 2, title: 'Lamp', makes: [{ group: 'lamp', art: A.lampFull(), label: 'lamp', phase: 3, until: 3 }] }),
      station('frame', 922, 384, { phase: 2, title: 'Framed photo', makes: [{ group: 'framed', art: A.framedPhoto(), label: 'framed photo', phase: 3, until: 3 }] }),
    ],
    finale: { who: 'fawn', title: 'Cozy bedroom', line: 'Soft bed, warm lamp. Time for a nap!' },
  });
}

/* --------------------------------- Living room --------------------------------- */
{
  const { list, push } = builder();
  const rug = push('rug', A.rug(), 265, 548, { phase: 2, z: 1 });
  const table = push('ctable', A.coffeeTable(), 265, 520, { phase: 2, needs: rug, z: 2 });
  push('vase', A.vase(), 235, 436, { phase: 2, needs: table, z: 3 }); push('remote', A.remote(), 325, 478, { phase: 2, needs: table, z: 3 });
  push('tv', A.tv(), 780, 345, { phase: 2 });
  push('sprout', A.sprout(), 690, 540, { phase: 2, st: 'plant' }); push('pot', A.pot(), 790, 548, { phase: 2, st: 'plant' });
  push('cush-stripe', A.cushionP('stripe', '#d6584a'), 150, 382, { phase: 3, show: true }); push('cush-dots', A.cushionP('dots', '#3f7cc9'), 265, 382, { phase: 3, show: true });
  push('cush-plain', A.cushionP('plain', '#e0a93b'), 380, 382, { phase: 3, show: true });
  push('bigplant', A.bigPlant(), 935, 435, { phase: 3 }); push('clock', A.wallClock(), 330, 120, { phase: 3 }); push('poster', A.poster(), 150, 160, { phase: 3 });
  junkSlot(push, 545, 560);
  add({
    id: 'living', cat: 'Unpacking', name: 'Living room',
    scene: wall() + windowPane(430, 60, 200, 140) + floor(520)
      + R(70, 350, 390, 120, 's-fabric2', 30) + R(70, 430, 390, 66, 's-fabric2', 16) + R(50, 380, 50, 124, 's-fabric2', 20) + R(430, 380, 50, 124, 's-fabric2', 20) + R(84, 496, 12, 24, 's-wooddk') + R(434, 496, 12, 24, 's-wooddk')
      + R(640, 430, 280, 16, 's-wood', 4) + R(652, 446, 12, 74, 's-wooddk') + R(896, 446, 12, 74, 's-wooddk') + R(664, 460, 232, 50, 's-wood', 4) + binScene(545, 560),
    groups: { rug: { dist: 140 }, ctable: { dist: 90 }, vase: { dist: 60 }, remote: { dist: 55 }, tv: { dist: 110 }, sprout: { dist: 60 }, pot: { dist: 55 }, 'cush-stripe': { dist: 70 }, 'cush-dots': { dist: 70 }, 'cush-plain': { dist: 70 }, bigplant: { dist: 90 }, clock: { dist: 60 }, poster: { dist: 60 }, junk: { dist: 90 } },
    phases: [
      P('Unbox', 'Open the big box and the small box inside. Wipe the TV table and bin the packing'),
      P('Set up', 'Rug, then coffee table, then the vase and remote. Put the TV on its table. Pot the plant: sprout and pot together, then pat down the soil'),
      P('Style the room', 'Match each cushion to its pattern on the sofa. Plant in the corner, clock and poster on the wall'),
    ],
    slots: list,
    items: [
      bubble(), I('junk', A.paperBall(), { label: 'packing paper', inside: 'box1' }),
      I('rug', A.rug(), { label: 'rug', inside: 'box1', phase: 2 }), I('ctable', A.coffeeTable(), { label: 'coffee table', inside: 'box1', phase: 2 }), I('tv', A.tv(), { label: 'TV', inside: 'box1', phase: 2 }),
      I('vase', A.vase(), { label: 'vase', inside: 'box2', phase: 2 }), I('remote', A.remote(), { label: 'remote', inside: 'box2', phase: 2 }),
      I('sprout', A.sprout(), { label: 'sprout', inside: 'box2', phase: 2 }), I('pot', A.pot(), { label: 'plant pot', inside: 'box2', phase: 2 }),
      I('cush-dots', A.cushionP('dots', '#3f7cc9'), { label: 'dotted cushion', inside: 'box2', phase: 3 }), I('cush-plain', A.cushionP('plain', '#e0a93b'), { label: 'plain cushion', inside: 'box2', phase: 3 }),
      I('cush-stripe', A.cushionP('stripe', '#d6584a'), { label: 'striped cushion', inside: 'box2', phase: 3 }),
      I('clock', A.wallClock(), { label: 'wall clock', inside: 'box2', phase: 3 }), I('poster', A.poster(), { label: 'poster', inside: 'box2', phase: 3 }),
    ],
    tasks: [box1(), box2(650, 560), scrub('Wipe', 780, 432, 250, 14, '#cfc8b8')],
    stations: [station('plant', 740, 520, { phase: 2, title: 'Potted plant', process: { kind: 'scrub', verb: 'Pat down', w: 110, h: 30, color: '#6b4a3a' },
      makes: [{ group: 'bigplant', art: A.bigPlant(), label: 'potted plant', phase: 3, until: 3, dy: -40 }] })],
    finale: { who: 'cub', title: 'Living room', line: 'So comfy! Can I have the big cushion?' },
  });
}

/* ---------------------------------- New kitchen ---------------------------------- */
{
  const { list, push } = builder();
  push('fork', A.fork(), 150, 450, { phase: 2 }); push('spoon', A.spoon(), 195, 450, { phase: 2 }); push('knife', A.knife(), 240, 450, { phase: 2 });
  const l = push('plateL', A.plate(), 540, 487, { phase: 2, z: 1 });
  const m = push('plateM', A.scale(A.plate(), .8), 540, 467, { phase: 2, needs: l, z: 2 });
  push('plateS', A.scale(A.plate(), .6), 540, 451, { phase: 2, needs: m, z: 3 });
  push('mug-stripe', A.mugP('stripe', '#3f7cc9'), 690, 468, { phase: 3, show: true }); push('mug-dots', A.mugP('dots', '#d6584a'), 750, 468, { phase: 3, show: true });
  push('mug-plain', A.mugP('plain', '#4c9a6a'), 810, 468, { phase: 3, show: true });
  push('kettle', A.kettle(), 925, 445, { phase: 3 }); push('toaster', A.toaster(), 392, 458, { phase: 3 });
  junkSlot(push, 55, 500);
  add({
    id: 'kitchen', cat: 'Unpacking', name: 'New kitchen',
    scene: window.LV.kitchen(500) + R(100, 476, 170, 22, 's-pan', 4) + R(106, 480, 50, 14, 's-wall2', 2) + R(162, 480, 50, 14, 's-wall2', 2) + R(218, 480, 46, 14, 's-wall2', 2) + binScene(55, 500),
    groups: { fork: { dist: 40 }, spoon: { dist: 40 }, knife: { dist: 40 }, plateL: { dist: 100 }, plateM: { dist: 90 }, plateS: { dist: 80 }, 'mug-stripe': { dist: 55 }, 'mug-dots': { dist: 55 }, 'mug-plain': { dist: 55 }, kettle: { dist: 70 }, toaster: { dist: 70 }, junk: { dist: 90 } },
    phases: [
      P('Unbox', 'Open the big box, the box of dishes inside it and the cutlery drawer. Wipe the counter and bin the packing'),
      P('Cutlery & plates', 'Fork, spoon and knife each go in their own slot. Stack the plates biggest first'),
      P('Finish the counter', 'Match each mug to its pattern. Kettle and toaster go on the counter'),
    ],
    slots: list,
    items: [
      bubble(), peanuts(), I('toaster', A.toaster(), { label: 'toaster', inside: 'box1', phase: 3 }), I('kettle', A.kettle(), { label: 'kettle', inside: 'box1', phase: 3 }),
      I('plateS', A.scale(A.plate(), .6), { label: 'small plate', inside: 'box2', phase: 2 }), I('plateL', A.plate(), { label: 'big plate', inside: 'box2', phase: 2 }), I('plateM', A.scale(A.plate(), .8), { label: 'medium plate', inside: 'box2', phase: 2 }),
      I('mug-plain', A.mugP('plain', '#4c9a6a'), { label: 'plain mug', inside: 'box2', phase: 3 }), I('mug-stripe', A.mugP('stripe', '#3f7cc9'), { label: 'striped mug', inside: 'box2', phase: 3 }),
      I('mug-dots', A.mugP('dots', '#d6584a'), { label: 'dotted mug', inside: 'box2', phase: 3 }),
      I('knife', A.knife(), { label: 'knife', inside: 'drawer', phase: 2, x: 130, y: 572 }), I('fork', A.fork(), { label: 'fork', inside: 'drawer', phase: 2, x: 180, y: 572 }), I('spoon', A.spoon(), { label: 'spoon', inside: 'drawer', phase: 2, x: 230, y: 572 }),
    ],
    tasks: [box1(), box2(640, 560), open('drawer', 180, 575, A.drawer(200, 60, false), A.drawer(200, 60, true), { hint: 'Tap to open the drawer' }), scrub('Wipe', 760, 490, 220, 20, '#cfc8b8')],
    finale: { who: 'piglet', title: 'New kitchen', line: 'Oink! Everything has its place!' },
  });
}

/* ----------------------------------- Bathroom ----------------------------------- */
{
  const { list, push } = builder();
  push('rollHolder', A.rollHolder(), 745, 424, { phase: 2, st: 'roll' }); push('roll', A.roll(), 830, 400, { phase: 2, st: 'roll' });
  push('soapDish', A.soapDish(), 885, 432, { phase: 2, st: 'soap' }); push('soapBar', A.soapBar(), 950, 425, { phase: 2, st: 'soap' });
  push('towel-blue', A.towel('#7fb7c9'), 500, 235, { phase: 3, show: true }); push('towel-pink', A.towel('#f2a7b8'), 640, 235, { phase: 3, show: true }); push('towel-yellow', A.towel('#f2d36b'), 780, 235, { phase: 3, show: true });
  push('mat', A.mat(), 200, 590, { phase: 3 }); push('cup', A.toothCup(), 130, 334, { phase: 3 }); push('duck', A.duck(), 290, 353, { phase: 3 });
  push('soapFull', A.soapOnDish(), 215, 360, { phase: 3 }); push('rollFull', A.rollOnHolder(), 930, 330, { phase: 3 });
  junkSlot(push, 420, 560);
  add({
    id: 'bathroom', cat: 'Unpacking', name: 'Bathroom',
    scene: tiles(0, 0, 1000, 520) + floor(520) + R(70, 40, 160, 210, 's-wooddk', 22) + R(80, 50, 140, 190, 's-glass', 14)
      + R(40, 380, 280, 16, 's-counter', 4) + R(52, 396, 256, 124, 's-cab') + `<path class="s-cabline" d="M180 396 V520"/><ellipse class="s-basin" cx="130" cy="382" rx="62" ry="6"/>`
      + R(430, 150, 420, 8, 's-metal', 4) + R(440, 150, 8, 24, 's-metal') + R(832, 150, 8, 24, 's-metal') + bench(700, 980, 440) + binScene(420, 560),
    groups: { rollHolder: { dist: 50 }, roll: { dist: 50 }, soapDish: { dist: 50 }, soapBar: { dist: 50 }, 'towel-blue': { dist: 90 }, 'towel-pink': { dist: 90 }, 'towel-yellow': { dist: 90 }, mat: { dist: 120 }, cup: { dist: 50 }, duck: { dist: 50 }, soapFull: { dist: 60 }, rollFull: { dist: 60 }, junk: { dist: 90 } },
    phases: [
      P('Unbox', 'Open the big box and the small one inside it. Wipe the foggy mirror and bin the packing'),
      P('Build', 'Put the roll on its holder, and the soap on its dish'),
      P('Finish the bathroom', 'Match each towel to its colour on the rail. Soap on the sink, roll on the wall, duck and cup in place'),
    ],
    slots: list,
    items: [
      bubble(), peanuts(),
      I('towel-pink', A.towel('#f2a7b8'), { label: 'pink towel', inside: 'box1', phase: 3 }), I('towel-yellow', A.towel('#f2d36b'), { label: 'yellow towel', inside: 'box1', phase: 3 }), I('towel-blue', A.towel('#7fb7c9'), { label: 'blue towel', inside: 'box1', phase: 3 }),
      I('mat', A.mat(), { label: 'bath mat', inside: 'box1', phase: 3 }),
      I('rollHolder', A.rollHolder(), { label: 'roll holder', inside: 'box2', phase: 2 }), I('roll', A.roll(), { label: 'toilet roll', inside: 'box2', phase: 2 }),
      I('soapDish', A.soapDish(), { label: 'soap dish', inside: 'box2', phase: 2 }), I('soapBar', A.soapBar(), { label: 'soap', inside: 'box2', phase: 2 }),
      I('cup', A.toothCup(), { label: 'toothbrush cup', inside: 'box2', phase: 3 }), I('duck', A.duck(), { label: 'rubber duck', inside: 'box2', phase: 3 }),
    ],
    tasks: [box1(), box2(640, 560), scrub('Wipe', 150, 145, 140, 180, '#e9f3f6', { shape: 'disc' })],
    stations: [
      station('roll', 790, 395, { phase: 2, title: 'Roll holder', makes: [{ group: 'rollFull', art: A.rollOnHolder(), label: 'roll on holder', phase: 3, until: 3 }] }),
      station('soap', 918, 395, { phase: 2, title: 'Soap dish', makes: [{ group: 'soapFull', art: A.soapOnDish(), label: 'soap on dish', phase: 3, until: 3 }] }),
    ],
    finale: { who: 'chick', title: 'Bathroom', line: 'Cheep! Squeaky clean and so shiny!' },
  });
}

/* ---------------------------------- Kids' room ---------------------------------- */
{
  const { list, push } = builder();
  const a = push('blkA', A.block('#d6584a', 'A'), 130, 494, { phase: 2, show: true, z: 1 });
  const b = push('blkB', A.block('#3f7cc9', 'B'), 130, 442, { phase: 2, show: true, needs: a, z: 2 });
  const c = push('blkC', A.block('#e0a93b', 'C'), 130, 390, { phase: 2, show: true, needs: b, z: 3 });
  push('blkD', A.block('#4c9a6a', 'D'), 130, 338, { phase: 2, show: true, needs: c, z: 4 });
  push('paper', A.paperSheet(), 760, 420, { phase: 2, st: 'draw' }); push('crayon', A.crayon('#d6584a'), 840, 410, { phase: 2, st: 'draw' });
  push('drawing', A.drawing(), 400, 160, { phase: 3 });
  push('ball-s', A.scale(A.ball(), .6), 340, 478, { phase: 3 }); push('ball-m', A.scale(A.ball(), .8), 430, 470, { phase: 3 }); push('ball-l', A.ball(), 530, 462, { phase: 3 });
  push('rocket', A.rocket(), 430, 340, { phase: 3 }); push('teddy', A.teddy(), 560, 330, { phase: 3 });
  junkSlot(push, 680, 560);
  add({
    id: 'kids', cat: 'Unpacking', name: "Kids' room",
    scene: wall('s-wallkid') + floor(520) + windowPane(700, 60, 150, 120)
      + R(290, 290, 320, 232, 's-wooddk', 8) + R(302, 302, 296, 208, 's-wall2') + R(302, 400, 296, 8, 's-wood') + R(302, 306, 296, 6, 's-wood')
      + `<path class="s-grain" d="M20 300 q40 -30 80 0 t80 0" style="stroke-width:5;opacity:.5"/>` + bench(720, 980, 440) + binScene(680, 560),
    groups: { blkA: { dist: 60 }, blkB: { dist: 60 }, blkC: { dist: 60 }, blkD: { dist: 60 }, paper: { dist: 60 }, crayon: { dist: 50 }, drawing: { dist: 70 }, 'ball-s': { dist: 50 }, 'ball-m': { dist: 50 }, 'ball-l': { dist: 60 }, rocket: { dist: 70 }, teddy: { dist: 70 }, junk: { dist: 90 } },
    phases: [
      P('Unbox', 'Open the toy chest and the box inside it. Scrub the scribbles off the wall and bin the packing'),
      P('Tower & drawing', 'Build the tower in order: A, B, C, D. Put the paper and crayon together and scribble a picture'),
      P('Tidy the toys', 'Hang the drawing. Balls go on the shelf smallest to biggest. Rocket and teddy on top'),
    ],
    slots: list,
    items: [
      I('junk', A.bubbleWrap(), { label: 'bubble wrap', inside: 'box1' }), I('junk', A.paperBall(), { label: 'packing paper', inside: 'box1' }),
      I('blkC', A.block('#e0a93b', 'C'), { label: 'block C', inside: 'box1', phase: 2 }), I('blkA', A.block('#d6584a', 'A'), { label: 'block A', inside: 'box1', phase: 2 }),
      I('blkD', A.block('#4c9a6a', 'D'), { label: 'block D', inside: 'box1', phase: 2 }), I('blkB', A.block('#3f7cc9', 'B'), { label: 'block B', inside: 'box1', phase: 2 }),
      I('paper', A.paperSheet(), { label: 'paper', inside: 'box1', phase: 2 }), I('crayon', A.crayon('#d6584a'), { label: 'crayon', inside: 'box1', phase: 2 }),
      I('ball-l', A.ball(), { label: 'big ball', inside: 'box2', phase: 3 }), I('ball-s', A.scale(A.ball(), .6), { label: 'small ball', inside: 'box2', phase: 3 }), I('ball-m', A.scale(A.ball(), .8), { label: 'medium ball', inside: 'box2', phase: 3 }),
      I('rocket', A.rocket(), { label: 'rocket', inside: 'box2', phase: 3 }), I('teddy', A.teddy(), { label: 'teddy', inside: 'box2', phase: 3 }),
    ],
    tasks: [
      open('box1', 880, 575, A.toyChest(190, 130, false), A.toyChest(190, 130, true), { hint: 'Tap to open the toy chest', rows: [{ x0: 30, x1: 960, y: 692 }] }),
      box2(640, 560), scrub('Scrub', 110, 250, 190, 60, '#e0707a', { z: 22 }),
    ],
    stations: [station('draw', 800, 395, { phase: 2, title: 'Drawing', process: { kind: 'scrub', verb: 'Scribble', w: 110, h: 70, color: '#f2a7b8', shape: 'disc' },
      makes: [{ group: 'drawing', art: A.drawing(), label: 'drawing', phase: 3, until: 3 }] })],
    finale: { who: 'monkey', title: "Kids' room", line: 'Ooh ooh! Can we play with everything now?' },
  });
}

/* ---------------------------------- Home office ---------------------------------- */
{
  const { list, push } = builder();
  push('monitor', A.monitor(), 330, 360, { phase: 2 });
  push('keyboard', A.keyboard(), 330, 410, { phase: 2 }); push('mouse', A.mouse(), 440, 408, { phase: 2 });
  push('lampBase', A.lampBase(), 740, 410, { phase: 2, st: 'dlamp' }); push('lampShade', A.lampShade('#4f7aa8'), 810, 414, { phase: 2, st: 'dlamp' });
  push('dlamp', A.scale(A.lampFull('#4f7aa8'), .8), 200, 372, { phase: 3 }); push('pens', A.penCup(), 520, 392, { phase: 3 }); push('stapler', A.stapler(), 150, 414, { phase: 3 });
  push('bk1', A.bookH('#d6584a', 90), 640, 232, { phase: 3, show: true }); push('bk2', A.bookH('#3f7cc9', 120), 686, 217, { phase: 3, show: true });
  push('bk3', A.bookH('#e0a93b', 150), 732, 202, { phase: 3, show: true }); push('bk4', A.bookH('#4c9a6a', 180), 778, 187, { phase: 3, show: true });
  push('plant', A.plant(), 880, 195, { phase: 3 });
  junkSlot(push, 600, 560);
  add({
    id: 'office', cat: 'Unpacking', name: 'Home office',
    scene: wall() + windowPane(80, 70, 170, 130) + floor(520)
      + R(60, 430, 520, 16, 's-wood', 4) + R(76, 446, 14, 74, 's-wooddk') + R(550, 446, 14, 74, 's-wooddk') + R(380, 446, 150, 56, 's-wooddk', 4)
      + shelf(610, 960, 242) + bench(700, 980, 440) + binScene(600, 560),
    groups: { monitor: { dist: 100 }, keyboard: { dist: 80 }, mouse: { dist: 50 }, lampBase: { dist: 40 }, lampShade: { dist: 45 }, dlamp: { dist: 60 }, pens: { dist: 55 }, stapler: { dist: 55 }, bk1: { dist: 40 }, bk2: { dist: 40 }, bk3: { dist: 40 }, bk4: { dist: 40 }, plant: { dist: 60 }, junk: { dist: 90 } },
    phases: [
      P('Unbox', 'Open the big box and the small one inside. Wipe the dust off the desk and bin the tangled cables and packing'),
      P('Set up the desk', 'Monitor, keyboard and mouse. Put the lamp base and shade together'),
      P('Finish the desk', 'Lamp, pens and stapler on the desk. Books go on the shelf shortest to tallest, then the plant'),
    ],
    slots: list,
    items: [
      bubble(), I('junk', A.cables(), { label: 'tangled cables', inside: 'box1' }),
      I('monitor', A.monitor(), { label: 'monitor', inside: 'box1', phase: 2 }), I('keyboard', A.keyboard(), { label: 'keyboard', inside: 'box1', phase: 2 }), I('mouse', A.mouse(), { label: 'mouse', inside: 'box1', phase: 2 }),
      I('lampBase', A.lampBase(), { label: 'lamp base', inside: 'box2', phase: 2 }), I('lampShade', A.lampShade('#4f7aa8'), { label: 'lamp shade', inside: 'box2', phase: 2 }),
      I('pens', A.penCup(), { label: 'pen cup', inside: 'box2', phase: 3 }), I('stapler', A.stapler(), { label: 'stapler', inside: 'box2', phase: 3 }),
      I('bk3', A.bookH('#e0a93b', 150), { label: 'tall book', inside: 'box2', phase: 3 }), I('bk1', A.bookH('#d6584a', 90), { label: 'short book', inside: 'box2', phase: 3 }),
      I('bk4', A.bookH('#4c9a6a', 180), { label: 'tallest book', inside: 'box2', phase: 3 }), I('bk2', A.bookH('#3f7cc9', 120), { label: 'medium book', inside: 'box2', phase: 3 }),
      I('plant', A.plant(), { label: 'plant', inside: 'box2', phase: 3 }),
    ],
    tasks: [box1(), box2(640, 560), scrub('Wipe', 320, 432, 480, 14, '#cfc8b8')],
    stations: [station('dlamp', 775, 384, { phase: 2, title: 'Desk lamp', makes: [{ group: 'dlamp', art: A.scale(A.lampFull('#4f7aa8'), .8), label: 'desk lamp', phase: 3, until: 3 }] })],
    finale: { who: 'bunny', title: 'Home office', line: 'Hop hop! A cosy place to work!' },
  });
}
})();
