// Generador infinito de ejercicios de límites.
// Cada ejercicio trae: tipo, enunciado (LaTeX), respuesta y pasos de la solución.
// Las fórmulas de las respuestas se verificaron con sympy (40 combinaciones al azar por fórmula).
(() => {
  const T = String.raw;
  const ent = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const uno = arr => arr[Math.floor(Math.random() * arr.length)];
  const noCero = (a, b) => { let n; do { n = ent(a, b); } while (n === 0); return n; };
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));

  // Fracciones exactas como texto: '3/2', '-1', '0'.
  const frac = (n, d = 1) => {
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d) || 1; n /= g; d /= g;
    return d === 1 ? String(n) : `${n}/${d}`;
  };
  const tex = r => {
    if (r === 'inf') return T`+\infty`;
    if (r === '-inf') return T`-\infty`;
    if (r === 'no existe') return T`\text{no existe}`;
    const [n, d] = r.split('/');
    if (!d) return n;
    return n.startsWith('-') ? T`-\frac{${n.slice(1)}}{${d}}` : T`\frac{${n}}{${d}}`;
  };
  // Polinomio bonito: coef(x^2) + coef(x) + c
  const poli = terms => {
    let s = '';
    terms.forEach(([c, e]) => {
      if (c === 0) return;
      const signo = c < 0 ? '-' : (s ? '+' : '');
      const abs = Math.abs(c);
      const coef = e === 0 ? abs : (abs === 1 ? '' : abs);
      const vari = e === 0 ? '' : e === 1 ? 'x' : `x^{${e}}`;
      s += `${signo}${coef}${vari}`;
    });
    return s || '0';
  };
  const xm = a => (a === 0 ? 'x' : a > 0 ? `x-${a}` : `x+${-a}`);   // (x − a)
  const xp = b => (b === 0 ? 'x' : b > 0 ? `x+${b}` : `x-${-b}`);   // (x + b)

  const G = {
    sustitucion() {
      if (Math.random() < 0.5) {
        const a = ent(-3, 3), p = noCero(-4, 4), q = ent(-5, 5), r = ent(-6, 6);
        const v = p * a * a + q * a + r;
        return { tipo: 'sustitucion', tex: T`\lim_{x\to ${a}}\left(${poli([[p, 2], [q, 1], [r, 0]])}\right)`, resp: frac(v),
          pasos: [`Sale un número al sustituir x = ${a}:`, T`${p}(${a})^2+(${q})(${a})+(${r})=${v}`] };
      }
      let a, b, c;
      do { a = ent(-3, 4); b = ent(-5, 5); c = ent(-5, 5); } while (a + c === 0 || a + b === 0);
      return { tipo: 'sustitucion', tex: T`\lim_{x\to ${a}}\frac{${xp(b)}}{${xp(c)}}`, resp: frac(a + b, a + c),
        pasos: [`El denominador no es 0 en x = ${a}. Sustituye:`, T`\frac{${a}+(${b})}{${a}+(${c})}=${tex(frac(a + b, a + c))}`] };
    },
    factorizacion() {
      const A = noCero(-6, 6);
      const v = ent(1, 4);
      if (v === 1) return { tipo: 'factorizacion', tex: T`\lim_{x\to ${A}}\frac{x^2-${A * A}}{${xm(A)}}`, resp: frac(2 * A),
        pasos: ['0/0. Diferencia de cuadrados y cancela:', T`\frac{(${xm(A)})(${xp(A)})}{${xm(A)}}=${xp(A)}`, `Sustituye x = ${A}:`, T`${A}+(${A})=${2 * A}`] };
      if (v === 2) {
        let B; do { B = noCero(-6, 6); } while (B === -A);
        return { tipo: 'factorizacion', tex: T`\lim_{x\to ${A}}\frac{${poli([[1, 2], [B - A, 1], [-A * B, 0]])}}{${xm(A)}}`, resp: frac(A + B),
          pasos: ['0/0. Factoriza el trinomio:', T`\frac{(${xm(A)})(${xp(B)})}{${xm(A)}}=${xp(B)}`, `Sustituye x = ${A}:`, T`${A}+(${B})=${A + B}`] };
      }
      if (v === 3) {
        const a = ent(1, 4);
        return { tipo: 'factorizacion', tex: T`\lim_{x\to ${a}}\frac{x^3-${a ** 3}}{x-${a}}`, resp: frac(3 * a * a),
          pasos: ['0/0. Diferencia de cubos:', T`\frac{(x-${a})(x^2+${a}x+${a * a})}{x-${a}}=x^2+${a}x+${a * a}`, `Sustituye x = ${a}:`, T`${a * a}+${a * a}+${a * a}=${3 * a * a}`] };
      }
      let B; do { B = noCero(-6, 6); } while (B === A || B === -A);
      return { tipo: 'factorizacion', tex: T`\lim_{x\to ${A}}\frac{${poli([[1, 2], [-(A + B), 1], [A * B, 0]])}}{x^2-${A * A}}`, resp: frac(A - B, 2 * A),
        pasos: ['0/0. Factoriza arriba y abajo:', T`\frac{(${xm(A)})(${xm(B)})}{(${xm(A)})(${xp(A)})}=\frac{${xm(B)}}{${xp(A)}}`, `Sustituye x = ${A}:`, T`\frac{${A}-(${B})}{${A}+(${A})}=${tex(frac(A - B, 2 * A))}`] };
    },
    racionalizacion() {
      const K = ent(1, 6), v = ent(1, 3);
      if (v === 1) return { tipo: 'racionalizacion', tex: T`\lim_{x\to 0}\frac{\sqrt{x+${K * K}}-${K}}{x}`, resp: frac(1, 2 * K),
        pasos: ['0/0 con raíz. Conjugado:', T`\frac{(x+${K * K})-${K * K}}{x(\sqrt{x+${K * K}}+${K})}=\frac{1}{\sqrt{x+${K * K}}+${K}}`, 'Sustituye x = 0:', T`\frac{1}{${K}+${K}}=${tex(frac(1, 2 * K))}`] };
      if (v === 2) return { tipo: 'racionalizacion', tex: T`\lim_{x\to ${K * K}}\frac{\sqrt{x}-${K}}{x-${K * K}}`, resp: frac(1, 2 * K),
        pasos: ['0/0 con raíz. Conjugado arriba y abajo:', T`\frac{x-${K * K}}{(x-${K * K})(\sqrt{x}+${K})}=\frac{1}{\sqrt{x}+${K}}`, `Sustituye x = ${K * K}:`, T`\frac{1}{${K}+${K}}=${tex(frac(1, 2 * K))}`] };
      return { tipo: 'racionalizacion', tex: T`\lim_{x\to ${K * K}}\frac{x-${K * K}}{\sqrt{x}-${K}}`, resp: frac(2 * K),
        pasos: ['0/0 con raíz. Conjugado:', T`\frac{(x-${K * K})(\sqrt{x}+${K})}{x-${K * K}}=\sqrt{x}+${K}`, `Sustituye x = ${K * K}:`, T`${K}+${K}=${2 * K}`] };
    },
    laterales() {
      const a = ent(-2, 4), m1 = noCero(-3, 3), b1 = ent(-5, 5), m2 = noCero(-3, 3);
      const izq = m1 * a + b1;
      const iguales = Math.random() < 0.55;
      const b2 = iguales ? izq - m2 * a : izq - m2 * a + noCero(-4, 4);
      const der = m2 * a + b2;
      const f1 = poli([[m1, 1], [b1, 0]]), f2 = poli([[m2, 1], [b2, 0]]);
      const resp = izq === der ? frac(izq) : 'no existe';
      return { tipo: 'laterales', tex: T`f(x)=\begin{cases}${f1} & x<${a}\\ ${f2} & x\ge ${a}\end{cases}\quad \lim_{x\to ${a}}f(x)`, resp,
        pasos: ['Izquierda con la primera fórmula:', T`${izq}`, 'Derecha con la segunda:', T`${der}`, izq === der ? 'Iguales → existe.' : 'Distintos → no existe.'] };
    },
    infinitos() {
      const a = ent(-3, 4), k = noCero(-6, 6);
      if (Math.random() < 0.3) {
        const r = k > 0 ? 'inf' : '-inf';
        return { tipo: 'infinitos', tex: T`\lim_{x\to ${a}}\frac{${k}}{(${xm(a)})^2}`, resp: r,
          pasos: ['k/0 con el denominador al cuadrado: siempre positivo.', T`\frac{${k}}{0^+}=${tex(r)}`] };
      }
      const lado = uno(['+', '-', '']);
      const signo = lado === '' ? 0 : (lado === '+' ? 1 : -1) * Math.sign(k);
      const r = lado === '' ? 'no existe' : signo > 0 ? 'inf' : '-inf';
      return { tipo: 'infinitos', tex: T`\lim_{x\to ${a}${lado ? `^${lado}` : ''}}\frac{${k}}{${xm(a)}}`, resp: r,
        pasos: lado ? [`k/0. Por ${lado === '+' ? 'la derecha' : 'la izquierda'} el denominador es 0${lado}:`, T`\frac{${k}}{0^${lado}}=${tex(r)}`]
          : ['Derecha y izquierda dan infinitos de distinto signo:', T`\frac{${k}}{0^+}\ne\frac{${k}}{0^-}`, 'No existe.'] };
    },
    alinfinito() {
      const n = ent(1, 3), m = ent(1, 3), A = noCero(-6, 6), B = ent(1, 6), c = ent(-5, 5), d = ent(1, 7);
      const arriba = poli([[A, n], [c, 0]]), abajo = poli([[B, m], [d, 0]]);
      let resp, regla;
      if (n < m) { resp = '0'; regla = 'Grado arriba < grado abajo → 0.'; }
      else if (n === m) { resp = frac(A, B); regla = 'Grados iguales → cociente de coeficientes principales.'; }
      else { resp = A / B > 0 ? 'inf' : '-inf'; regla = 'Grado arriba > grado abajo → infinito; el signo lo dan los coeficientes.'; }
      return { tipo: 'alinfinito', tex: T`\lim_{x\to\infty}\frac{${arriba}}{${abajo}}`, resp,
        pasos: [`Grado arriba ${n}, grado abajo ${m}.`, regla, T`${tex(resp)}`] };
    },
    raizinfinito() {
      if (Math.random() < 0.6) {
        const B = noCero(-6, 6) * 2;
        return { tipo: 'raizinfinito', tex: T`\lim_{x\to\infty}\left(\sqrt{${poli([[1, 2], [B, 1]])}}-x\right)`, resp: frac(B, 2),
          pasos: ['∞ − ∞: conjugado y divide entre x:', T`\frac{${B}x}{\sqrt{${poli([[1, 2], [B, 1]])}}+x}\to\frac{${B}}{1+1}`, T`=${tex(frac(B, 2))}`] };
      }
      const A = ent(1, 5), C = ent(1, 6);
      return { tipo: 'raizinfinito', tex: T`\lim_{x\to\infty}\frac{\sqrt{${A === 1 ? '' : A * A}x^2+1}}{x+${C}}`, resp: frac(A),
        pasos: ['Divide entre x (dentro de la raíz entre x²):', T`\frac{\sqrt{${A * A}+\frac{1}{x^2}}}{1+\frac{${C}}{x}}\to\sqrt{${A * A}}=${A}`] };
    },
    trigonometricos() {
      const K = ent(2, 9), M = ent(2, 9), v = ent(1, 5);
      if (v === 1) return { tipo: 'trigonometricos', tex: T`\lim_{x\to0}\frac{\sin(${K}x)}{x}`, resp: frac(K),
        pasos: ['Multiplica y divide por el número:', T`${K}\cdot\frac{\sin ${K}x}{${K}x}\to ${K}\cdot1=${K}`] };
      if (v === 2) return { tipo: 'trigonometricos', tex: T`\lim_{x\to0}\frac{\sin(${K}x)}{\sin(${M}x)}`, resp: frac(K, M),
        pasos: ['Cociente de senos → k/m:', T`\frac{${K}}{${M}}=${tex(frac(K, M))}`] };
      if (v === 3) return { tipo: 'trigonometricos', tex: T`\lim_{x\to0}\frac{\tan(${K}x)}{x}`, resp: frac(K),
        pasos: ['tan = sen/cos y cos 0 = 1:', T`${K}\cdot\frac{\sin ${K}x}{${K}x}\cdot\frac{1}{\cos ${K}x}\to ${K}`] };
      if (v === 4) return { tipo: 'trigonometricos', tex: T`\lim_{x\to0}\frac{\sin(${K}x)}{${M}x}`, resp: frac(K, M),
        pasos: ['Saca el número de abajo:', T`\frac{1}{${M}}\cdot\frac{\sin ${K}x}{x}\to\frac{${K}}{${M}}=${tex(frac(K, M))}`] };
      return { tipo: 'trigonometricos', tex: T`\lim_{x\to0}\frac{1-\cos x}{x}`, resp: '0',
        pasos: ['Límite notable:', T`\frac{1-\cos x}{x}\to 0`] };
    },
    continuidad() {
      const A = noCero(-3, 3), B = ent(-5, 5);
      if (Math.random() < 0.5) {
        return { tipo: 'continuidad', tex: T`f(x)=\begin{cases}kx${B < 0 ? '' : '+'}${B} & x<${A}\\ x^2 & x\ge ${A}\end{cases}\quad\text{halle }k`, resp: frac(A * A - B, A),
          pasos: [`Iguala los trozos en x = ${A}:`, T`${A}k+(${B})=${A * A}`, T`k=${tex(frac(A * A - B, A))}`] };
      }
      const C = noCero(-4, 4), D = ent(-5, 5);
      return { tipo: 'continuidad', tex: T`f(x)=\begin{cases}x+k & x<${A}\\ ${poli([[C, 1], [D, 0]])} & x\ge ${A}\end{cases}\quad\text{halle }k`, resp: frac(C * A + D - A),
        pasos: [`Iguala en x = ${A}:`, T`${A}+k=${C * A + D}`, T`k=${C * A + D - A}`] };
    },
  };

  // Interpreta lo que escribe el estudiante.
  function leer(s) {
    s = String(s).trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
    if (!s) return null;
    if (/^(no(existe)?|ne|dne)$/.test(s)) return 'no existe';
    if (/^(\+?(inf|infinito|∞|oo))$/.test(s)) return 'inf';
    if (/^(-(inf|infinito|∞|oo)|menosinfinito)$/.test(s)) return '-inf';
    const f = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
    if (f) return Number(f[1]) / Number(f[2]);
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  function valor(r) { if (['inf', '-inf', 'no existe'].includes(r)) return r; const [n, d] = r.split('/'); return Number(n) / Number(d || 1); }
  function correcto(entrada, resp) {
    const a = leer(entrada), b = valor(resp);
    if (a === null) return false;
    if (typeof a === 'string' || typeof b === 'string') return a === b;
    return Math.abs(a - b) < 1e-6;
  }

  window.GEN = {
    tipos: Object.keys(G),
    crear(tipo) { return (G[tipo] || G[uno(Object.keys(G))])(); },
    mezcla() { return G[uno(Object.keys(G))](); },
    correcto, tex, leer,
  };
})();
