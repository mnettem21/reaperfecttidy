// Sorting art: patterned socks, rolled pairs, stickers, glue and sponges for the bin, decorative bits.
(() => {
const A = (w, h, svg) => ({ w, h, svg });
const ART = window.ART;
const dots = (list, fill) => list.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
const sockPattern = (kind, id) => kind === 'stripe' ? [0, 1, 2, 3].map((i) => `<rect x="0" y="${20 + i * 12}" width="60" height="5" fill="#fff" opacity=".85"/>`).join('')
  : kind === 'dots' ? dots([[20, 22, 3.5], [36, 32, 3.5], [20, 44, 3.5], [36, 54, 3.5], [48, 22, 3.5]], '#fff')
  : kind === 'heart' ? [[26, 26], [38, 44]].map(([x, y]) => `<path d="M${x} ${y + 8} C${x - 12} ${y - 2} ${x - 2} ${y - 10} ${x} ${y - 3} C${x + 2} ${y - 10} ${x + 12} ${y - 2} ${x} ${y + 8}Z" fill="#fff"/>`).join('') : '';

ART.sockP = (kind, c) => A(60, 70, `<defs><clipPath id="sk-${kind}-${c.slice(1)}"><path d="M14 2 H40 V32 L58 44 Q62 58 48 60 L20 58 Q8 56 12 44 L14 34Z"/></clipPath></defs>
  <path d="M14 2 H40 V32 L58 44 Q62 58 48 60 L20 58 Q8 56 12 44 L14 34Z" fill="${c}"/>
  <g clip-path="url(#sk-${kind}-${c.slice(1)})">${sockPattern(kind)}</g><rect x="14" y="2" width="26" height="9" fill="#fff" opacity=".4"/>`);
ART.pairBall = (kind, c) => A(64, 64, `<defs><clipPath id="pb-${kind}-${c.slice(1)}"><circle cx="32" cy="32" r="28"/></clipPath></defs>
  <circle cx="32" cy="32" r="28" fill="${c}"/><g clip-path="url(#pb-${kind}-${c.slice(1)})" transform="translate(-2 -6)">${sockPattern(kind)}</g>
  <path d="M10 40 Q32 56 54 40" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/><circle cx="32" cy="32" r="28" fill="none" stroke="#0002" stroke-width="2"/>`);
ART.sticker = (kind, c) => A(60, 60, kind === 'star'
  ? `<path d="M30 3 L37 22 L57 23 L41 36 L47 56 L30 44 L13 56 L19 36 L3 23 L23 22Z" fill="${c}" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>`
  : kind === 'heart' ? `<path d="M30 54 C2 34 12 6 30 20 C48 6 58 34 30 54Z" fill="${c}" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>`
  : `${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="30" cy="14" rx="9" ry="13" fill="${c}" transform="rotate(${i * 72} 30 30)" stroke="#fff" stroke-width="2"/>`).join('')}<circle cx="30" cy="30" r="9" fill="#f6d36b" stroke="#fff" stroke-width="2"/>`);
ART.glue = () => A(34, 84, `<rect x="6" y="30" width="22" height="52" rx="5" fill="#d6584a"/><rect x="9" y="14" width="16" height="18" rx="3" fill="#f1ece2"/><rect x="6" y="48" width="22" height="14" fill="#fff" opacity=".6"/>`);
ART.sponge = () => A(64, 40, `<rect x="2" y="4" width="60" height="32" rx="8" fill="#e8c14a"/>${dots([[16, 14, 3], [34, 22, 3.5], [50, 12, 3], [24, 28, 2.5], [46, 28, 3]], '#c79a22')}`);
ART.eggCarton = () => A(200, 48, `<path d="M4 12 H196 L188 46 H12Z" fill="#cdb89a"/>${[0, 1, 2, 3, 4, 5].map((i) => `<ellipse cx="${30 + i * 28}" cy="13" rx="12" ry="15" fill="#f4ead7"/>`).join('')}<path d="M4 22 H196 L188 46 H12Z" fill="#b9a27f"/>`);
ART.cup = (c) => A(70, 84, `<path d="M6 6 H64 L58 80 H12Z" fill="${c}"/><ellipse cx="35" cy="6" rx="29" ry="6" fill="#000" opacity=".25"/><path d="M12 30 H58" stroke="#fff" stroke-width="3" opacity=".4"/>`);
ART.hangerBar = () => A(10, 10, '');
})();
