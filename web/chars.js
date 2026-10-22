// Cute friends who walk in when a level is finished. Each is drawn in a 220 x 220 box, feet near y=205.
(() => {
const eye = (x, y, r = 9) => `<g class="blink"><circle cx="${x}" cy="${y}" r="${r}" fill="#2a2320"/><circle cx="${x + r * .32}" cy="${y - r * .36}" r="${r * .38}" fill="#fff"/><circle cx="${x - r * .3}" cy="${y + r * .34}" r="${r * .18}" fill="#fff" opacity=".8"/></g>`;
const cheeks = (a, b, y, c = '#f59aa8') => `<ellipse cx="${a}" cy="${y}" rx="11" ry="7" fill="${c}" opacity=".6"/><ellipse cx="${b}" cy="${y}" rx="11" ry="7" fill="${c}" opacity=".6"/>`;
const shadow = '<ellipse cx="110" cy="208" rx="62" ry="8" fill="#000" opacity=".16"/>';
const smile = (x, y, w = 14) => `<path d="M${x - w} ${y} Q${x} ${y + 12} ${x + w} ${y}" fill="none" stroke="#2a2320" stroke-width="3.5" stroke-linecap="round"/>`;

const chick = () => `${shadow}
  <ellipse cx="46" cy="140" rx="17" ry="28" transform="rotate(24 46 140)" fill="#f2c23a"/><ellipse cx="174" cy="140" rx="17" ry="28" transform="rotate(-24 174 140)" fill="#f2c23a"/>
  <circle cx="110" cy="128" r="74" fill="#f8d84e"/><ellipse cx="110" cy="158" rx="46" ry="36" fill="#fbe98e"/>
  <path d="M100 56 Q96 38 106 30 M112 54 Q114 34 126 30 M124 58 Q134 44 144 44" fill="none" stroke="#f2c23a" stroke-width="7" stroke-linecap="round"/>
  ${cheeks(74, 146, 128)}${eye(86, 108)}${eye(134, 108)}
  <path d="M97 120 L123 120 L110 138Z" fill="#f08a2c" stroke="#f08a2c" stroke-width="4" stroke-linejoin="round"/>
  <path d="M90 200 l-8 8 M90 200 l0 10 M90 200 l8 8 M130 200 l-8 8 M130 200 l0 10 M130 200 l8 8" stroke="#f08a2c" stroke-width="5" stroke-linecap="round"/>`;

const piglet = () => `${shadow}
  <path d="M158 168 q22 -6 18 -22 q-4 -12 -16 -6" fill="none" stroke="#f09bb0" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="110" cy="166" rx="54" ry="40" fill="#f7b9c8"/><rect x="76" y="188" width="18" height="18" rx="7" fill="#f09bb0"/><rect x="126" y="188" width="18" height="18" rx="7" fill="#f09bb0"/>
  <ellipse cx="58" cy="62" rx="22" ry="30" transform="rotate(-30 58 62)" fill="#f09bb0"/><ellipse cx="162" cy="62" rx="22" ry="30" transform="rotate(30 162 62)" fill="#f09bb0"/>
  <ellipse cx="60" cy="66" rx="11" ry="17" transform="rotate(-30 60 66)" fill="#f9c9d4"/><ellipse cx="160" cy="66" rx="11" ry="17" transform="rotate(30 160 66)" fill="#f9c9d4"/>
  <circle cx="110" cy="108" r="64" fill="#f9bfcd"/>
  ${cheeks(62, 158, 124)}${eye(82, 98)}${eye(138, 98)}
  <ellipse cx="110" cy="124" rx="28" ry="20" fill="#f58aa6"/><ellipse cx="100" cy="124" rx="4.5" ry="7" fill="#9c3f5a"/><ellipse cx="120" cy="124" rx="4.5" ry="7" fill="#9c3f5a"/>`;

const fawn = () => `${shadow}
  <rect x="78" y="172" width="12" height="34" rx="6" fill="#c98c52"/><rect x="130" y="172" width="12" height="34" rx="6" fill="#c98c52"/>
  <ellipse cx="110" cy="164" rx="54" ry="38" fill="#dba56a"/>${[[82, 150, 5], [108, 144, 5.5], [136, 152, 5], [96, 170, 4.5], [124, 172, 4.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff4e0"/>`).join('')}
  <ellipse cx="42" cy="66" rx="16" ry="36" transform="rotate(-48 42 66)" fill="#dba56a"/><ellipse cx="178" cy="66" rx="16" ry="36" transform="rotate(48 178 66)" fill="#dba56a"/>
  <ellipse cx="44" cy="68" rx="8" ry="24" transform="rotate(-48 44 68)" fill="#f6b6b8"/><ellipse cx="176" cy="68" rx="8" ry="24" transform="rotate(48 176 68)" fill="#f6b6b8"/>
  <ellipse cx="110" cy="100" rx="56" ry="50" fill="#e4b27a"/><circle cx="110" cy="52" r="5" fill="#fff4e0"/><circle cx="96" cy="58" r="4" fill="#fff4e0"/><circle cx="124" cy="58" r="4" fill="#fff4e0"/>
  ${cheeks(66, 154, 118)}${eye(82, 94, 10)}${eye(138, 94, 10)}
  <ellipse cx="110" cy="116" rx="30" ry="21" fill="#f6dfbf"/><ellipse cx="110" cy="108" rx="10" ry="7" fill="#5a3b2a"/>${smile(110, 120, 9)}`;

const cub = () => `${shadow}
  <ellipse cx="110" cy="166" rx="56" ry="42" fill="#a86f3e"/><ellipse cx="110" cy="172" rx="34" ry="28" fill="#dcb98a"/>
  <rect x="70" y="188" width="24" height="18" rx="8" fill="#96602f"/><rect x="126" y="188" width="24" height="18" rx="8" fill="#96602f"/>
  <circle cx="58" cy="54" r="22" fill="#b57c47"/><circle cx="162" cy="54" r="22" fill="#b57c47"/><circle cx="58" cy="56" r="12" fill="#e9c9a0"/><circle cx="162" cy="56" r="12" fill="#e9c9a0"/>
  <circle cx="110" cy="102" r="58" fill="#b9814b"/>
  ${cheeks(62, 158, 118, '#f09aa0')}${eye(84, 90)}${eye(136, 90)}
  <ellipse cx="110" cy="118" rx="30" ry="22" fill="#ecd3ae"/><ellipse cx="110" cy="108" rx="10" ry="7" fill="#3a2a22"/><path d="M110 115 V122" stroke="#3a2a22" stroke-width="3.5" stroke-linecap="round"/>${smile(110, 122, 10)}`;

const monkey = () => `${shadow}
  <path d="M158 176 q42 -2 36 -42 q-4 -22 -22 -18" fill="none" stroke="#7a4d2b" stroke-width="12" stroke-linecap="round"/>
  <ellipse cx="110" cy="166" rx="52" ry="40" fill="#8a5a34"/><ellipse cx="110" cy="172" rx="32" ry="28" fill="#e9c79a"/>
  <rect x="72" y="188" width="24" height="18" rx="8" fill="#7a4d2b"/><rect x="124" y="188" width="24" height="18" rx="8" fill="#7a4d2b"/>
  <circle cx="46" cy="96" r="24" fill="#8a5a34"/><circle cx="174" cy="96" r="24" fill="#8a5a34"/><circle cx="46" cy="98" r="14" fill="#f1d2a8"/><circle cx="174" cy="98" r="14" fill="#f1d2a8"/>
  <circle cx="110" cy="92" r="56" fill="#8a5a34"/>
  <circle cx="90" cy="108" r="30" fill="#f1d2a8"/><circle cx="130" cy="108" r="30" fill="#f1d2a8"/><ellipse cx="110" cy="124" rx="34" ry="24" fill="#f1d2a8"/>
  <path d="M84 56 Q110 44 136 56" fill="none" stroke="#6c4224" stroke-width="5" stroke-linecap="round"/>
  ${cheeks(70, 150, 124)}${eye(92, 100)}${eye(128, 100)}
  <circle cx="104" cy="116" r="2.6" fill="#5a3b2a"/><circle cx="116" cy="116" r="2.6" fill="#5a3b2a"/>${smile(110, 128, 14)}
  <path d="M156 150 q22 -16 30 8 q-6 12 -26 6Z" fill="#f6d04a" stroke="#e0b52e" stroke-width="3" stroke-linejoin="round"/>`;

const bunny = () => `${shadow}
  <ellipse cx="78" cy="48" rx="17" ry="48" transform="rotate(-10 78 48)" fill="#f7f2ee"/><ellipse cx="142" cy="48" rx="17" ry="48" transform="rotate(10 142 48)" fill="#f7f2ee"/>
  <ellipse cx="78" cy="52" rx="8" ry="34" transform="rotate(-10 78 52)" fill="#f7b9c6"/><ellipse cx="142" cy="52" rx="8" ry="34" transform="rotate(10 142 52)" fill="#f7b9c6"/>
  <circle cx="168" cy="184" r="16" fill="#fff"/><ellipse cx="110" cy="166" rx="52" ry="40" fill="#f7f2ee"/>
  <rect x="74" y="188" width="26" height="18" rx="8" fill="#e9e2dc"/><rect x="120" y="188" width="26" height="18" rx="8" fill="#e9e2dc"/>
  <circle cx="110" cy="110" r="56" fill="#fbf7f3"/>
  ${cheeks(66, 154, 124)}${eye(86, 102)}${eye(134, 102)}
  <path d="M102 116 L118 116 L110 126Z" fill="#f08aa0" stroke="#f08aa0" stroke-width="3" stroke-linejoin="round"/><path d="M110 126 V132 M110 132 Q100 140 94 134 M110 132 Q120 140 126 134" fill="none" stroke="#2a2320" stroke-width="3" stroke-linecap="round"/>`;

window.CHARS = {
  chick: { name: 'Pip', kind: 'chick', svg: chick() },
  piglet: { name: 'Pudding', kind: 'piglet', svg: piglet() },
  fawn: { name: 'Dot', kind: 'baby deer', svg: fawn() },
  cub: { name: 'Bruno', kind: 'bear cub', svg: cub() },
  monkey: { name: 'Momo', kind: 'baby monkey', svg: monkey() },
  bunny: { name: 'Biscuit', kind: 'bunny', svg: bunny() },
};
})();
