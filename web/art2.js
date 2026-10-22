// Extra art: containers, junk, tools, raw/cooked ingredients, buttons. Extends window.ART from art.js.
(() => {
const A = (w, h, svg) => ({ w, h, svg });
const ART = window.ART;
const dots = (list, fill) => list.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');

ART.none = (w, h) => A(w, h, '');
ART.label = (w, h, text, fill = '#d6584a') => A(w, h, `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="${h / 2.4}" fill="${fill}"/><text x="${w / 2}" y="${h / 2 + 6}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${Math.min(20, h * .32)}" fill="#fff">${text}</text>`);

// A stain or a mixture: an irregular blob that fades as you scrub (or fills as you stir).
ART.blob = (w, h, color, o = .92) => A(w, h, `<g fill="${color}" opacity="${o}"><ellipse cx="${w * .5}" cy="${h * .5}" rx="${w * .46}" ry="${h * .42}"/><ellipse cx="${w * .28}" cy="${h * .4}" rx="${w * .26}" ry="${h * .36}"/><ellipse cx="${w * .74}" cy="${h * .58}" rx="${w * .24}" ry="${h * .34}"/><circle cx="${w * .08}" cy="${h * .72}" r="${Math.max(4, h * .09)}"/><circle cx="${w * .94}" cy="${h * .26}" r="${Math.max(4, h * .08)}"/></g>`);
ART.disc = (w, h, color) => A(w, h, `<ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2 - 1}" ry="${h / 2 - 1}" fill="${color}"/>`);

// Containers
ART.cardboard = (w, h, open) => open
  ? A(w, h, `<path d="M2 ${h * .3} L${-w * .1} ${h * .02} L${w * .32} 0 L${w * .4} ${h * .3}Z" style="fill:var(--card-dk)"/><path d="M${w - 2} ${h * .3} L${w * 1.1} ${h * .02} L${w * .68} 0 L${w * .6} ${h * .3}Z" style="fill:var(--card-dk)"/><rect x="2" y="${h * .3}" width="${w - 4}" height="${h * .7 - 2}" rx="4" style="fill:var(--card)"/><rect x="2" y="${h * .3}" width="${w - 4}" height="${h * .1}" fill="#0005"/><rect x="${w * .08}" y="${h * .56}" width="${w * .26}" height="${h * .18}" rx="2" style="fill:var(--label)"/>`)
  : A(w, h, `<rect x="2" y="${h * .16}" width="${w - 4}" height="${h * .84 - 2}" rx="4" style="fill:var(--card)"/><rect x="2" y="${h * .16}" width="${w - 4}" height="${h * .14}" style="fill:var(--card-dk)" opacity=".5"/><rect x="${w / 2 - 14}" y="${h * .16}" width="28" height="${h * .84 - 2}" style="fill:var(--card-dk)" opacity=".5"/><rect x="${w * .08}" y="${h * .54}" width="${w * .26}" height="${h * .18}" rx="2" style="fill:var(--label)"/>`);
ART.drawer = (w, h, open) => open
  ? A(w, h, `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="5" style="fill:var(--wood-dk)"/><rect x="7" y="7" width="${w - 14}" height="${h - 22}" rx="3" fill="#000" opacity=".55"/><rect x="1" y="${h - 14}" width="${w - 2}" height="13" rx="4" style="fill:var(--wood)"/>`)
  : A(w, h, `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="5" style="fill:var(--wood)"/><rect x="6" y="6" width="${w - 12}" height="${h - 12}" rx="3" fill="none" stroke="#0003" stroke-width="2"/><rect x="${w / 2 - 22}" y="${h / 2 - 4}" width="44" height="8" rx="4" style="fill:var(--metal)"/>`);
ART.fridgeDoor = (w, h, open) => open
  ? A(w, h, `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="10" style="fill:var(--fridge-in)"/><rect x="6" y="${h * .36}" width="${w - 12}" height="6" style="fill:var(--glass-dk)"/><rect x="6" y="${h * .68}" width="${w - 12}" height="6" style="fill:var(--glass-dk)"/>`)
  : A(w, h, `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="10" style="fill:var(--app)"/><rect x="${w - 22}" y="${h * .3}" width="9" height="${h * .22}" rx="4" style="fill:var(--metal)"/><rect x="1" y="${h * .62}" width="${w - 2}" height="4" fill="#0002"/>`);
ART.toolbox = (w, h, open) => open
  ? A(w, h, `<path d="M6 ${h * .34} L${w * .02} 4 H${w * .98} L${w - 6} ${h * .34}Z" fill="#a83c31"/><rect x="2" y="${h * .34}" width="${w - 4}" height="${h * .66 - 2}" rx="6" fill="#c24c3f"/><rect x="8" y="${h * .38}" width="${w - 16}" height="${h * .16}" fill="#000" opacity=".5"/>`)
  : A(w, h, `<path d="M${w * .3} ${h * .2} Q${w / 2} -4 ${w * .7} ${h * .2}" fill="none" stroke="#5c6166" stroke-width="7"/><rect x="2" y="${h * .2}" width="${w - 4}" height="${h * .78}" rx="8" fill="#c24c3f"/><rect x="2" y="${h * .2}" width="${w - 4}" height="${h * .2}" rx="6" fill="#a83c31"/><rect x="${w / 2 - 12}" y="${h * .34}" width="24" height="16" rx="3" fill="#d9b25a"/>`);
ART.bagzip = (w, h, open) => open
  ? A(w, h, `<rect x="2" y="${h * .2}" width="${w - 4}" height="${h * .78}" rx="24" style="fill:var(--bag)"/><ellipse cx="${w / 2}" cy="${h * .22}" rx="${w * .44}" ry="${h * .14}" style="fill:var(--bag-in)"/><ellipse cx="${w / 2}" cy="${h * .24}" rx="${w * .38}" ry="${h * .09}" fill="#000" opacity=".4"/>`)
  : A(w, h, `<rect x="2" y="${h * .2}" width="${w - 4}" height="${h * .78}" rx="24" style="fill:var(--bag)"/><path d="M${w * .08} ${h * .3} H${w * .92}" style="stroke:var(--band)" stroke-width="6" stroke-dasharray="4 4"/><circle cx="${w * .92}" cy="${h * .3}" r="7" style="fill:var(--band)"/>`);

// Junk for the bin
ART.paperBall = () => A(44, 44, `<circle cx="22" cy="22" r="19" fill="#e7e1d6"/><path d="M8 18 L20 12 L30 20 M12 30 L24 24 L34 32" stroke="#b8b0a2" stroke-width="2" fill="none"/>`);
ART.bubbleWrap = () => A(84, 58, `<rect x="2" y="2" width="80" height="54" rx="10" fill="#cfe7f0" opacity=".75"/>${Array.from({ length: 15 }, (_, i) => `<circle cx="${14 + (i % 5) * 14}" cy="${14 + Math.floor(i / 5) * 15}" r="5" fill="#fff" opacity=".8"/>`).join('')}`);
ART.peanuts = () => A(72, 38, `${[[12, 24], [28, 14], [44, 26], [58, 14], [22, 32], [50, 32]].map(([x, y]) => `<rect x="${x - 9}" y="${y - 6}" width="18" height="12" rx="6" fill="#fbfaf5" stroke="#d6cfc2" stroke-width="2"/>`).join('')}`);
ART.sock = () => A(70, 58, `<path d="M18 2 H42 V30 L64 40 Q68 52 54 54 L22 52 Q10 50 14 38 L18 30Z" fill="#9aa4a8"/><rect x="18" y="2" width="24" height="9" fill="#d6584a"/>`);
ART.gummy = () => A(38, 48, `<circle cx="9" cy="9" r="7" fill="#6dbb4c"/><circle cx="29" cy="9" r="7" fill="#6dbb4c"/><circle cx="19" cy="17" r="12" fill="#6dbb4c"/><rect x="8" y="24" width="22" height="18" rx="8" fill="#6dbb4c"/><circle cx="15" cy="15" r="1.8" fill="#234"/><circle cx="23" cy="15" r="1.8" fill="#234"/>`);
ART.newspaper = () => A(104, 78, `<rect x="2" y="4" width="100" height="70" rx="3" fill="#e9e5da"/><rect x="10" y="12" width="84" height="12" fill="#6c6a64"/>${[34, 44, 54, 64].map((y) => `<path d="M10 ${y} H94" stroke="#a9a69c" stroke-width="3"/>`).join('')}`);
ART.cables = () => A(86, 56, `<path d="M6 40 Q20 4 36 34 T70 22 Q84 18 80 40" fill="none" stroke="#2b2f33" stroke-width="5"/><path d="M10 48 Q40 56 76 46" fill="none" stroke="#d9d4cc" stroke-width="4"/><rect x="2" y="34" width="10" height="14" rx="2" fill="#555"/>`);
ART.cobweb = () => A(70, 60, `<path d="M4 4 L66 56 M4 56 L66 4 M35 2 V58 M2 30 H68" stroke="#b9b5ac" stroke-width="2"/><ellipse cx="35" cy="30" rx="22" ry="18" fill="none" stroke="#b9b5ac" stroke-width="2"/>`);

// Raw and cooked
ART.pepLog = () => A(132, 40, `<rect x="2" y="4" width="128" height="32" rx="15" fill="#b8322c"/>${dots([[22, 14, 3], [46, 24, 3], [72, 13, 3], [96, 25, 3], [118, 15, 2.5]], '#8e221d')}`);
ART.cucLong = () => A(184, 36, `<rect x="2" y="3" width="180" height="30" rx="15" fill="#3e8a3e"/><path d="M14 12 H168 M14 24 H168" stroke="#6cb26c" stroke-width="3"/>`);
ART.salmonBlock = () => A(112, 46, `<rect x="2" y="4" width="108" height="38" rx="9" fill="#f08a5d"/><path d="M12 14 L96 10 M12 24 L98 20 M12 34 L90 31" stroke="#fbd1b8" stroke-width="3"/>`);
ART.salmonSlice = () => A(84, 22, `<path d="M2 8 Q42 -4 82 8 L78 20 H6Z" fill="#f08a5d"/><path d="M12 11 L70 10 M14 16 L64 15" stroke="#fbd1b8" stroke-width="2.5"/>`);
ART.cukeStick = () => A(84, 18, `<rect x="2" y="2" width="80" height="14" rx="6" fill="#4c9a4a"/><rect x="4" y="5" width="76" height="4" rx="2" fill="#b8e08f"/>`);
ART.riceMound = () => A(70, 30, `<path d="M4 28 Q4 4 35 4 Q66 4 66 28Z" fill="#fbfaf5"/><path d="M16 22 H54" stroke="#e4e1d6" stroke-width="2"/>`);
ART.soyDish = () => A(64, 26, `<ellipse cx="32" cy="14" rx="30" ry="11" fill="#e7e1d6"/><ellipse cx="32" cy="13" rx="22" ry="7" fill="#3a2418"/>`);
ART.chopsticks = () => A(116, 16, `<rect x="2" y="2" width="112" height="5" rx="2.5" fill="#8a6240"/><rect x="2" y="9" width="112" height="5" rx="2.5" fill="#a87d4c"/>`);
ART.cupcakeRaw = () => A(76, 70, `<path d="M8 34 L68 34 L60 68 L16 68Z" fill="#7cc1e8"/><path d="M22 34 L24 68 M36 34 L36 68 M50 34 L48 68" stroke="#5aa4cf" stroke-width="3"/><path d="M6 36 Q6 10 38 10 Q70 10 70 36Z" fill="#f3e3b0"/>`);
ART.batter = () => A(180, 30, `<rect x="2" y="4" width="176" height="24" rx="12" fill="#f4ead0"/><rect x="10" y="7" width="150" height="8" rx="4" fill="#fffaea"/>`);
ART.monitor = () => A(176, 140, `<rect x="2" y="2" width="172" height="104" rx="8" fill="#1f2326"/><rect x="10" y="10" width="156" height="88" rx="3" fill="#3b5f8a"/><path d="M10 98 L60 52 L100 82 L124 62 L166 98Z" fill="#4f7aa8"/><rect x="76" y="106" width="24" height="22" fill="#2b2f33"/><rect x="48" y="126" width="80" height="12" rx="5" fill="#2b2f33"/>`);
ART.keyboard = () => A(150, 40, `<rect x="2" y="2" width="146" height="36" rx="6" fill="#2b2f33"/>${Array.from({ length: 3 }, (_, r) => Array.from({ length: 11 }, (_, c) => `<rect x="${8 + c * 12.4}" y="${7 + r * 10}" width="9" height="7" rx="1.5" fill="#6c777b"/>`).join('')).join('')}`);
ART.mouse = () => A(34, 50, `<rect x="2" y="2" width="30" height="46" rx="15" fill="#2b2f33"/><path d="M17 4 V22" stroke="#6c777b" stroke-width="2"/>`);
ART.stapler = () => A(86, 34, `<path d="M4 16 Q4 4 18 4 H80 V16Z" fill="#d6584a"/><rect x="2" y="16" width="80" height="14" rx="4" fill="#2b2f33"/>`);
ART.rug = () => A(260, 44, `<rect x="2" y="4" width="256" height="36" rx="16" fill="#c9806a"/><rect x="14" y="12" width="232" height="20" rx="10" fill="none" stroke="#f3d9c9" stroke-width="3" stroke-dasharray="14 8"/>`);
ART.jarSpoon = () => A(40, 100, `<path d="M20 4 V70" stroke="#c9ccd0" stroke-width="5"/>`);
})();
