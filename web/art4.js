// Furniture and home art: bedding, lamp parts, frames, cushions, cutlery, toys, desk things.
(() => {
const A = (w, h, svg) => ({ w, h, svg });
const ART = window.ART;
const dots = (list, fill) => list.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');

ART.duvet = (c = '#8fb3d9') => A(400, 44, `<rect x="2" y="2" width="396" height="40" rx="18" fill="${c}"/><path d="M40 6 Q70 40 100 6 M150 6 Q180 40 210 6 M260 6 Q290 40 320 6" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/><rect x="2" y="2" width="396" height="12" rx="8" fill="#fff" opacity=".25"/>`);
ART.lampBase = () => A(40, 60, `<rect x="17" y="2" width="6" height="40" fill="#8a8f93"/><ellipse cx="20" cy="50" rx="18" ry="8" fill="#5c6166"/><rect x="2" y="44" width="36" height="10" rx="5" fill="#5c6166"/>`);
ART.lampShade = (c = '#f2c14e') => A(64, 50, `<path d="M14 2 H50 L62 46 H2Z" fill="${c}"/><path d="M14 2 H50 L56 22 H8Z" fill="#fff" opacity=".25"/>`);
ART.lampFull = (c = '#f2c14e') => A(80, 130, `<path d="M18 4 H62 L76 52 H4Z" fill="${c}"/><path d="M18 4 H62 L69 28 H11Z" fill="#fff" opacity=".25"/><rect x="37" y="52" width="6" height="62" fill="#8a8f93"/><rect x="18" y="112" width="44" height="14" rx="6" fill="#5c6166"/>`);
ART.photo = () => A(46, 36, `<rect x="1" y="1" width="44" height="34" rx="2" fill="#fbfaf5"/><rect x="5" y="5" width="36" height="26" fill="#bfe3f2"/><path d="M5 31 L16 18 L24 26 L31 20 L41 31Z" fill="#5aae78"/><circle cx="33" cy="12" r="4" fill="#f6d36b"/>`);
ART.picFrame = (c = '#8a6240') => A(62, 50, `<rect x="2" y="2" width="58" height="46" rx="3" fill="${c}"/><rect x="9" y="9" width="44" height="32" fill="none" stroke="#0004" stroke-width="2"/><rect x="9" y="9" width="44" height="32" fill="#000" opacity=".12"/>`);
ART.framedPhoto = () => A(90, 74, `<rect x="2" y="2" width="86" height="70" rx="4" fill="#8a6240"/><rect x="10" y="10" width="70" height="54" fill="#bfe3f2"/><path d="M10 64 L32 36 L48 52 L60 42 L80 64Z" fill="#5aae78"/><circle cx="64" cy="24" r="7" fill="#f6d36b"/>`);
ART.poster = () => A(80, 104, `<rect x="2" y="2" width="76" height="100" rx="3" fill="#fbfaf5"/><rect x="9" y="9" width="62" height="86" fill="#f6c9a8"/><circle cx="40" cy="46" r="18" fill="#f2748f"/><path d="M9 95 L26 70 L42 84 L56 66 L71 95Z" fill="#4c9a6a"/>`);
ART.cushionP = (kind, c = '#d6584a') => {
  const pat = kind === 'stripe' ? [0, 1, 2, 3, 4].map((i) => `<rect x="${4 + i * 22}" y="4" width="11" height="92" fill="#fff" opacity=".55"/>`).join('')
    : kind === 'dots' ? dots([[26, 24, 6], [56, 24, 6], [86, 24, 6], [40, 50, 6], [70, 50, 6], [26, 76, 6], [56, 76, 6], [86, 76, 6]], '#fff') : '';
  return A(110, 100, `<rect x="4" y="4" width="102" height="92" rx="22" fill="${c}"/>${pat ? `<g opacity=".85">${pat}</g>` : ''}<circle cx="55" cy="50" r="5" fill="#0003"/>`);
};
ART.sprout = () => A(80, 100, `<path d="M40 98 V50" stroke="#4c9a3a" stroke-width="5" fill="none"/><ellipse cx="22" cy="42" rx="20" ry="11" transform="rotate(-30 22 42)" fill="#5aae78"/><ellipse cx="58" cy="34" rx="20" ry="11" transform="rotate(30 58 34)" fill="#4c9a6a"/><ellipse cx="40" cy="16" rx="12" ry="16" fill="#79c25a"/><ellipse cx="40" cy="92" rx="22" ry="7" fill="#6b4a3a"/>`);
ART.pot = () => A(70, 64, `<path d="M8 6 H62 L54 62 H16Z" fill="#c4683f"/><rect x="2" y="2" width="66" height="12" rx="4" fill="#a9532f"/><ellipse cx="35" cy="8" rx="28" ry="4" fill="#6b4a3a"/>`);
ART.coffeeTable = () => A(150, 56, `<rect x="2" y="2" width="146" height="14" rx="6" style="fill:var(--wood)"/><rect x="14" y="16" width="10" height="38" style="fill:var(--wood-dk)"/><rect x="126" y="16" width="10" height="38" style="fill:var(--wood-dk)"/>`);
ART.fork = () => A(22, 98, `<path d="M4 2 V30 M11 2 V30 M18 2 V30" stroke="#b9c3c8" stroke-width="3.5" stroke-linecap="round"/><path d="M3 28 Q11 40 19 28 L14 44 H8Z" fill="#b9c3c8"/><rect x="8" y="42" width="6" height="54" rx="3" fill="#b9c3c8"/>`);
ART.spoon = () => A(22, 98, `<ellipse cx="11" cy="16" rx="9" ry="14" fill="#b9c3c8"/><rect x="8" y="28" width="6" height="68" rx="3" fill="#b9c3c8"/>`);
ART.knife = () => A(20, 100, `<path d="M4 2 Q18 6 16 44 H4Z" fill="#b9c3c8"/><rect x="4" y="42" width="8" height="56" rx="4" fill="#8a6240"/>`);
ART.mugP = (kind, c = '#3f7cc9') => {
  const pat = kind === 'stripe' ? [0, 1, 2].map((i) => `<rect x="8" y="${10 + i * 14}" width="44" height="6" fill="${c}"/>`).join('')
    : kind === 'dots' ? dots([[16, 18, 4], [30, 24, 4], [44, 18, 4], [16, 40, 4], [30, 46, 4], [44, 40, 4]], c) : `<rect x="8" y="26" width="44" height="12" fill="${c}"/>`;
  return A(70, 60, `<path d="M52 16 q16 0 16 14 q0 14 -16 14" fill="none" stroke="#e7e1d6" stroke-width="7"/><rect x="6" y="4" width="48" height="54" rx="7" fill="#f1ece2"/>${pat}`);
};
ART.paperSheet = () => A(90, 70, `<rect x="2" y="2" width="86" height="66" rx="3" fill="#fbfaf5"/><path d="M12 22 H78 M12 36 H78 M12 50 H60" stroke="#d9d4cc" stroke-width="2"/>`);
ART.crayon = (c) => A(16, 90, `<rect x="2" y="14" width="12" height="74" rx="2" fill="${c}"/><path d="M2 14 L8 0 L14 14Z" fill="${c}"/><rect x="2" y="30" width="12" height="20" fill="#fff" opacity=".35"/>`);
ART.drawing = () => A(100, 76, `<rect x="2" y="2" width="96" height="72" rx="3" fill="#fbfaf5"/><path d="M20 62 V38 L40 22 L60 38 V62Z" fill="#f2c14e"/><path d="M16 40 L40 18 L64 40Z" fill="#d6584a"/><rect x="34" y="46" width="12" height="16" fill="#8a6240"/><circle cx="78" cy="20" r="9" fill="#f6d36b"/><path d="M66 62 H92" stroke="#4c9a3a" stroke-width="4"/><path d="M12 28 q6 -8 12 0 q6 -8 12 0" stroke="#3f7cc9" stroke-width="3" fill="none"/>`);
ART.penCup = () => A(56, 76, `<path d="M16 38 L12 4 M26 38 L28 0 M36 38 L44 8" stroke-width="5" stroke-linecap="round" stroke="#d6584a"/><path d="M26 38 L22 8" stroke="#3f7cc9" stroke-width="5" stroke-linecap="round"/><rect x="6" y="36" width="44" height="38" rx="6" fill="#7a8a96"/><rect x="6" y="46" width="44" height="6" fill="#fff" opacity=".2"/>`);
ART.rollHolder = () => A(72, 22, `<rect x="2" y="8" width="68" height="6" rx="3" fill="#b9c3c8"/><rect x="2" y="2" width="8" height="18" rx="3" fill="#8a8f93"/><rect x="62" y="2" width="8" height="18" rx="3" fill="#8a8f93"/>`);
ART.rollOnHolder = () => A(72, 66, `<circle cx="36" cy="34" r="28" fill="#fbfaf5"/><circle cx="36" cy="34" r="9" fill="#c9b79c"/><rect x="2" y="30" width="68" height="6" rx="3" fill="#b9c3c8"/><rect x="2" y="24" width="8" height="18" rx="3" fill="#8a8f93"/><rect x="62" y="24" width="8" height="18" rx="3" fill="#8a8f93"/>`);
ART.soapBar = () => A(44, 26, `<rect x="2" y="2" width="40" height="22" rx="10" fill="#f2a7b8"/><rect x="10" y="7" width="12" height="5" rx="2.5" fill="#fff" opacity=".6"/>`);
ART.soapDish = () => A(76, 20, `<path d="M2 6 H74 L66 18 H10Z" fill="#cfe3ea"/><path d="M12 8 H64" stroke="#9cc6d6" stroke-width="2"/>`);
ART.soapOnDish = () => A(76, 40, `<rect x="16" y="2" width="44" height="26" rx="10" fill="#f2a7b8"/><rect x="24" y="7" width="12" height="5" rx="2.5" fill="#fff" opacity=".6"/><path d="M2 24 H74 L66 38 H10Z" fill="#cfe3ea"/>`);
ART.mirror = () => A(150, 190, `<rect x="2" y="2" width="146" height="186" rx="22" style="fill:var(--wooddk, #8a6240)" fill-opacity="0"/><rect x="2" y="2" width="146" height="186" rx="22" style="fill:var(--wood-dk)"/><rect x="12" y="12" width="126" height="166" rx="14" style="fill:var(--glass)"/><path d="M30 40 L70 20 M26 70 L84 30" stroke="#fff" stroke-width="6" opacity=".55" stroke-linecap="round"/>`);
ART.bookH = (c, h, w = 40) => A(w, h, `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="4" fill="${c}"/><rect x="1" y="${h * .12}" width="${w - 2}" height="5" fill="#0003"/><rect x="1" y="${h * .84}" width="${w - 2}" height="5" fill="#0003"/><rect x="${w * .25}" y="${h * .34}" width="${w * .5}" height="${h * .24}" rx="2" fill="#fff5"/>`);
ART.toyChest = (w, h, open) => open
  ? A(w, h, `<path d="M4 ${h * .3} L${w * .08} 2 H${w * .92} L${w - 4} ${h * .3}Z" fill="#4f7aa8"/><rect x="2" y="${h * .3}" width="${w - 4}" height="${h * .7 - 2}" rx="8" fill="#3f7cc9"/><rect x="8" y="${h * .34}" width="${w - 16}" height="${h * .16}" fill="#000" opacity=".5"/><rect x="2" y="${h * .62}" width="${w - 4}" height="8" fill="#f6c91c"/>`)
  : A(w, h, `<path d="M4 ${h * .34} Q${w / 2} -2 ${w - 4} ${h * .34}Z" fill="#4f7aa8"/><rect x="2" y="${h * .3}" width="${w - 4}" height="${h * .7 - 2}" rx="8" fill="#3f7cc9"/><rect x="2" y="${h * .62}" width="${w - 4}" height="8" fill="#f6c91c"/><circle cx="${w / 2}" cy="${h * .5}" r="7" fill="#f6c91c"/>`);
ART.wallShelf = (w = 260) => A(w, 22, `<rect x="2" y="2" width="${w - 4}" height="10" rx="3" style="fill:var(--wood)"/><rect x="12" y="12" width="8" height="8" style="fill:var(--wood-dk)"/><rect x="${w - 20}" y="12" width="8" height="8" style="fill:var(--wood-dk)"/>`);
})();
