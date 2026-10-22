// Finished dishes for the cooking finales, plus a few recipe ingredients. Dishes are 320 x 240.
(() => {
const A = (w, h, svg) => ({ w, h, svg });
const ART = window.ART;
const dots = (list, fill, extra = '') => list.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`).join('');
const plate = (cx = 160, cy = 190, rx = 150, ry = 34) => `<ellipse cx="${cx}" cy="${cy + 8}" rx="${rx}" ry="${ry}" fill="#000" opacity=".12"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fbfbf8"/><ellipse cx="${cx}" cy="${cy - 2}" rx="${rx * .78}" ry="${ry * .62}" fill="#eceee9"/>`;

ART.scale = (a, s) => A(Math.round(a.w * s), Math.round(a.h * s), `<g transform="scale(${s})">${a.svg}</g>`);

/* ---- ingredients made along the way ---- */
ART.sauceBowl = () => A(80, 38, `<path d="M3 8 H77 Q73 36 40 36 Q7 36 3 8Z" fill="#e7e1d6"/><ellipse cx="40" cy="9" rx="36" ry="8" fill="#d6584a"/><ellipse cx="34" cy="8" rx="14" ry="3" fill="#f08a8a"/>`);
ART.sauceLayer = () => A(150, 14, `<path d="M4 8 Q20 -2 40 6 T80 6 T120 6 T146 8 Q140 14 120 12 T80 13 T40 12 T4 8Z" fill="#e0574a"/>`);
ART.dough = () => A(92, 70, `<path d="M8 40 Q4 10 44 8 Q86 6 86 40 Q88 66 46 66 Q10 68 8 40Z" fill="#f1dcae"/><ellipse cx="34" cy="26" rx="16" ry="8" fill="#fff6dc" opacity=".7"/>`);
ART.oilBottle = (c = '#e0c95a') => A(40, 104, `<rect x="14" y="2" width="12" height="14" rx="3" fill="#5c6166"/><path d="M14 16 H26 L36 42 V98 Q36 102 32 102 H8 Q4 102 4 98 V42Z" fill="${c}" opacity=".92"/><rect x="6" y="58" width="28" height="26" fill="#fbfaf5"/><circle cx="20" cy="71" r="6" fill="#6aa74a"/>`);
ART.omelette = () => A(130, 62, `<path d="M6 40 Q4 8 60 6 Q124 6 124 38 Q122 58 64 58 Q10 60 6 40Z" fill="#f6cf4a"/><path d="M12 36 Q60 12 118 36" fill="none" stroke="#e8b72a" stroke-width="3"/>${dots([[38, 30, 3], [70, 26, 3], [96, 34, 3]], '#fff4c0')}`);
ART.lemon = () => A(56, 44, `<ellipse cx="28" cy="22" rx="24" ry="18" fill="#f6d94a"/><path d="M4 22 l-4 -2 M52 22 l4 -2" stroke="#e8c52a" stroke-width="4" stroke-linecap="round"/><ellipse cx="22" cy="16" rx="8" ry="4" fill="#fff7b8" opacity=".7"/>`);

/* ---- finished dishes ---- */
const sandwichHalf = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})">
  <rect x="-62" y="0" width="124" height="24" rx="9" fill="#b5763a"/><rect x="-58" y="3" width="116" height="15" rx="7" fill="#e8bf80"/>
  <path d="M-66 2 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 V-4 H-66Z" fill="#6dbb4c"/>
  <rect x="-62" y="-20" width="124" height="14" rx="7" fill="#e98a9a"/><rect x="-60" y="-34" width="120" height="16" rx="3" fill="#f2c14e"/>
  <path d="M-60 -18 l14 12 l14 -12 l14 12 l14 -12 l14 12 l14 -12" fill="none" stroke="#d9a531" stroke-width="2"/>
  ${[[-34, -42], [0, -44], [34, -42]].map(([cx, cy]) => `<ellipse cx="${cx}" cy="${cy}" rx="16" ry="6" fill="#d8392f"/><ellipse cx="${cx}" cy="${cy}" rx="11" ry="3.5" fill="#f2735f"/>`).join('')}
  <path d="M-66 -46 V-56 Q-66 -76 -30 -76 H30 Q66 -76 66 -56 V-46Z" fill="#b5763a"/><path d="M-60 -48 V-56 Q-60 -68 -30 -68 H30 Q60 -68 60 -56 V-48Z" fill="#e8bf80"/>
  <path d="M36 -86 V4" stroke="#c9a56a" stroke-width="3" stroke-linecap="round"/><path d="M36 -86 l16 4 l-16 6Z" fill="#d6584a"/></g>`;
ART.dishSandwich = () => A(320, 240, `${plate()}${sandwichHalf(98, 150, -4)}${sandwichHalf(222, 156, 6)}`);

ART.dishPizza = () => A(320, 240, `<ellipse cx="160" cy="146" rx="152" ry="92" fill="#b98a5e"/><ellipse cx="160" cy="138" rx="146" ry="88" fill="#c99a6a"/>
  <ellipse cx="160" cy="130" rx="130" ry="80" fill="#dba35a"/><ellipse cx="160" cy="130" rx="116" ry="70" fill="#f4c95d"/>
  ${[[100, 100], [160, 88], [220, 104], [86, 142], [140, 128], [206, 142], [120, 170], [186, 170], [244, 130]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="17" ry="10" fill="#b8322c"/><ellipse cx="${x - 3}" cy="${y - 2}" rx="8" ry="3.5" fill="#d9574a"/>`).join('')}
  ${[[130, 108], [190, 120], [110, 150], [168, 160], [226, 92]].map(([x, y]) => `<path d="M${x - 11} ${y} Q${x - 11} ${y - 12} ${x} ${y - 12} Q${x + 11} ${y - 12} ${x + 11} ${y}Z" fill="#e9d8c4"/><rect x="${x - 3}" y="${y}" width="6" height="6" fill="#cdb193"/>`).join('')}
  ${[[150, 140], [96, 122], [200, 100], [240, 150], [136, 182]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.5" fill="none" stroke="#2b2b2b" stroke-width="3"/>`).join('')}
  ${[[172, 108], [112, 128], [214, 156]].map(([x, y]) => `<path d="M${x - 10} ${y} Q${x} ${y - 14} ${x + 10} ${y} Q${x} ${y + 8} ${x - 10} ${y}Z" fill="#3e8a3e"/>`).join('')}
  <path d="M160 130 L292 96 Q300 130 276 164Z" fill="#b98a5e"/><path d="M168 134 L284 104 Q290 130 270 158Z" fill="#f8d870" transform="translate(10 -6)"/>`);

ART.dishCupcakes = () => A(320, 240, `<ellipse cx="160" cy="206" rx="62" ry="10" fill="#d6cfc2"/><rect x="150" y="150" width="20" height="56" fill="#e7e1d6"/><ellipse cx="160" cy="156" rx="142" ry="22" fill="#000" opacity=".1" transform="translate(0 8)"/><ellipse cx="160" cy="152" rx="142" ry="22" fill="#fbfbf8"/><ellipse cx="160" cy="150" rx="116" ry="14" fill="#eceee9"/>
  ${[[78, 124], [160, 116], [242, 124]].map(([x, y]) => `<path d="M${x - 32} ${y} L${x + 32} ${y} L${x + 25} ${y + 32} L${x - 25} ${y + 32}Z" fill="#7cc1e8"/><path d="M${x - 16} ${y} l2 32 M${x} ${y} v32 M${x + 16} ${y} l-2 32" stroke="#5aa4cf" stroke-width="3"/><path d="M${x - 34} ${y + 2} Q${x - 34} ${y - 26} ${x} ${y - 26} Q${x + 34} ${y - 26} ${x + 34} ${y + 2}Z" fill="#c98a4b"/>
  <ellipse cx="${x}" cy="${y - 14}" rx="38" ry="12" fill="#f5a3c0"/><ellipse cx="${x}" cy="${y - 28}" rx="27" ry="11" fill="#f7b5cd"/><ellipse cx="${x}" cy="${y - 41}" rx="17" ry="9" fill="#f9c6d9"/><circle cx="${x}" cy="${y - 52}" r="10" fill="#c8102e"/><circle cx="${x - 3}" cy="${y - 55}" r="3" fill="#fff" opacity=".6"/><path d="M${x} ${y - 61} Q${x + 4} ${y - 72} ${x + 12} ${y - 74}" stroke="#4c7a2c" stroke-width="3" fill="none"/>`).join('')}`);

ART.dishSalad = () => A(320, 240, `<ellipse cx="160" cy="214" rx="104" ry="12" fill="#000" opacity=".12"/><path d="M34 112 Q40 206 160 210 Q280 206 286 112Z" fill="#e9dccb"/><path d="M60 170 Q160 190 262 170" fill="none" stroke="#cbb69a" stroke-width="3"/>
  <ellipse cx="160" cy="112" rx="128" ry="42" fill="#cbb69a"/>
  ${[[70, 104, 38, 22, -20], [120, 90, 42, 22, 10], [180, 88, 44, 22, -8], [240, 100, 40, 22, 22], [100, 118, 40, 20, 14], [160, 112, 42, 22, -4], [218, 120, 40, 20, -16]].map(([x, y, rx, ry, r]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})" fill="#6dbb4c"/><path d="M${x - rx * .7} ${y} H${x + rx * .7}" stroke="#a6dc7f" stroke-width="3" transform="rotate(${r} ${x} ${y})"/>`).join('')}
  ${[[96, 92], [150, 80], [204, 94], [130, 116], [190, 118], [244, 108], [64, 112]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#e0473c"/><circle cx="${x - 4}" cy="${y - 4}" r="4" fill="#fff" opacity=".45"/>`).join('')}
  ${[[116, 98], [172, 100], [222, 82], [80, 96], [226, 124]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="#3e8a3e"/><circle cx="${x}" cy="${y}" r="9" fill="#b8e08f"/>`).join('')}
  <path d="M120 60 q20 20 40 6 q20 -14 40 4" fill="none" stroke="#d8e08a" stroke-width="5" stroke-linecap="round" opacity=".8"/>`);

ART.dishPancakes = () => A(320, 240, `${plate(160, 196, 148, 32)}
  ${[0, 1, 2, 3].map((i) => `<rect x="${72 + (i % 2) * 4}" y="${140 - i * 30}" width="176" height="30" rx="15" fill="#c98a4b"/><rect x="${78 + (i % 2) * 4}" y="${140 - i * 30}" width="164" height="14" rx="7" fill="#e8bc78"/>`).join('')}
  <ellipse cx="160" cy="52" rx="84" ry="14" fill="#e8bc78"/><rect x="138" y="28" width="46" height="24" rx="4" fill="#f7e08a"/><rect x="138" y="28" width="46" height="9" rx="4" fill="#fbeeb4"/>
  <path d="M80 54 Q160 28 240 54 Q246 80 236 96 Q228 112 222 96 Q220 78 208 78 Q198 90 194 110 Q190 124 184 108 Q182 84 160 84 Q130 86 128 110 Q124 126 118 110 Q116 90 106 84 Q94 90 92 108 Q86 114 84 98 Q78 82 80 54Z" fill="#a35d1f" opacity=".95"/>
  ${[[100, 176], [236, 180]].map(([x, y]) => `<path d="M${x} ${y + 20} Q${x - 18} ${y + 4} ${x - 14} ${y - 6} Q${x - 8} ${y - 14} ${x} ${y - 10} Q${x + 8} ${y - 14} ${x + 14} ${y - 6} Q${x + 18} ${y + 4} ${x} ${y + 20}Z" fill="#d6334a"/><path d="M${x - 10} ${y - 8} L${x} ${y - 16} L${x + 10} ${y - 8}Z" fill="#4c9a3a"/>`).join('')}`);

ART.dishFryup = () => A(320, 240, `${plate(160, 140, 150, 80)}
  <path d="M60 128 Q56 76 130 72 Q200 70 204 120 Q204 164 130 168 Q64 172 60 128Z" fill="#f6cf4a"/><path d="M72 124 Q130 82 192 126" fill="none" stroke="#e8b72a" stroke-width="4"/>${dots([[100, 118, 5], [140, 106, 5], [168, 128, 5], [122, 138, 4]], '#fff4c0')}
  <path d="M206 72 Q232 66 260 80 Q286 94 270 110 Q250 104 230 96 Q210 88 206 72Z" fill="#b5523b"/><path d="M214 78 Q240 76 262 90" fill="none" stroke="#e9a07a" stroke-width="4"/>
  <path d="M200 112 Q226 104 258 120 Q280 134 262 148 Q240 138 218 132 Q198 126 200 112Z" fill="#b5523b"/><path d="M208 118 Q232 112 256 128" fill="none" stroke="#e9a07a" stroke-width="4"/>
  <path d="M104 170 L140 158 L152 196 L112 202Z" fill="#9c5b2a"/><path d="M108 172 L137 163 L146 192 L116 197Z" fill="#d99a4f"/>
  <path d="M158 168 L194 158 L206 196 L166 202Z" fill="#9c5b2a"/><path d="M162 171 L191 163 L200 192 L170 197Z" fill="#d99a4f"/>
  <circle cx="82" cy="164" r="14" fill="#e0473c"/><circle cx="78" cy="160" r="4" fill="#fff" opacity=".45"/>`);

ART.dishSushi = () => A(320, 240, `<rect x="14" y="52" width="292" height="150" rx="16" fill="#8a6240"/><rect x="22" y="60" width="276" height="134" rx="12" fill="#a87d4c"/><path d="M22 90 H298 M22 120 H298 M22 150 H298 M22 176 H298" stroke="#8a6240" stroke-width="2" opacity=".5"/>
  ${[[80, 118], [150, 118]].map(([x, y]) => `<rect x="${x - 36}" y="${y}" width="72" height="30" rx="13" fill="#fbfaf5"/><path d="M${x - 40} ${y + 4} Q${x} ${y - 28} ${x + 40} ${y + 4} Q${x} ${y + 14} ${x - 40} ${y + 4}Z" fill="#f28a5a"/><path d="M${x - 20} ${y - 6} l5 12 M${x} ${y - 10} l2 14 M${x + 20} ${y - 6} l-3 14" stroke="#fbd1b8" stroke-width="3"/>`).join('')}
  ${[[222, 110], [262, 140], [222, 164]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="21" fill="#1f3b2f"/><circle cx="${x}" cy="${y}" r="16" fill="#fbfaf5"/><circle cx="${x}" cy="${y}" r="6" fill="#f08a4b"/><circle cx="${x - 4}" cy="${y + 4}" r="2.6" fill="#6dbb4c"/>`).join('')}
  <rect x="62" y="168" width="68" height="20" rx="9" fill="#fbfaf5"/><rect x="66" y="156" width="60" height="16" rx="6" fill="#4c9a4a"/><rect x="70" y="159" width="52" height="5" rx="2" fill="#b8e08f"/>
  <ellipse cx="170" cy="176" rx="24" ry="10" fill="#e7e1d6"/><ellipse cx="170" cy="175" rx="17" ry="6" fill="#3a2418"/><ellipse cx="198" cy="186" rx="8" ry="4" fill="#9fd17a"/>
  <rect x="30" y="196" width="130" height="5" rx="2.5" fill="#d9b88a" transform="rotate(-4 30 196)"/><rect x="34" y="204" width="130" height="5" rx="2.5" fill="#e6c89a" transform="rotate(-4 34 204)"/>`);
})();
