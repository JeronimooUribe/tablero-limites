// "Desde 0": la escalera de bases que necesitan los límites.
// Parte de lo que Jerónimo ya sabe (sumar, multiplicar, dividir, fracciones, simplificar)
// y sube peldaño a peldaño hasta factorizar, conjugados y lo mínimo de trigonometría.
(() => {
  const T = String.raw;
  const ent = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const noCero = (a, b) => { let n; do { n = ent(a, b); } while (n === 0); return n; };
  const uno = arr => arr[Math.floor(Math.random() * arr.length)];
  const par = n => (n < 0 ? `(${n})` : `${n}`);
  const sg = n => (n < 0 ? `- ${-n}` : `+ ${n}`);

  const lecciones = [
    {
      id: 'signos', n: 1, titulo: 'Signos: positivos y negativos', icono: 'ph-plus-minus', color: '#4C8DFF',
      idea: 'Casi todos los errores en límites son de signos. Aquí se dominan.',
      explica: [
        'Piensa en dinero: un número positivo es plata que tienes y uno negativo es plata que debes.',
        'Sumar con signos distintos: resta los números y quédate con el signo del más grande. $-7+3=-4$ (debes 7, pagas 3: sigues debiendo 4).',
        'Sumar con signos iguales: suma y conserva el signo. $-2-5=-7$.',
        'Multiplicar o dividir (ley de signos): signos iguales dan +, signos distintos dan −.',
        'Restar un negativo es sumar: $5-(-3)=5+3=8$.',
      ],
      tabla: [['(+)(+)', '+'], ['(−)(−)', '+'], ['(+)(−)', '−'], ['(−)(+)', '−']],
      ejemplos: [
        { e: T`(-3)(-4)`, pasos: [['Signos iguales (− y −) → positivo.', ''], ['3 × 4 = 12.', '']], r: '12' },
        { e: T`-2-5`, pasos: [['Los dos son negativos: se suman y queda negativo.', '']], r: '-7' },
        { e: T`\frac{-12}{3}`, pasos: [['Signos distintos → negativo.', ''], ['12 ÷ 3 = 4.', '']], r: '-4' },
      ],
      gen() {
        const a = noCero(-9, 9), b = noCero(-9, 9), v = ent(1, 4);
        if (v === 1) return { e: T`${par(a)}\cdot${par(b)}`, r: String(a * b), sol: `Ley de signos: ${a * b < 0 ? 'distintos → negativo' : 'iguales → positivo'}. Resultado: ${a * b}.` };
        if (v === 2) return { e: T`${a} ${sg(b)}`, r: String(a + b), sol: `Resultado: ${a + b}.` };
        if (v === 3) return { e: T`${a} - ${par(b)}`, r: String(a - b), sol: `Restar ${par(b)} es sumar ${-b}. Resultado: ${a - b}.` };
        const k = noCero(-6, 6), d = noCero(-5, 5);
        return { e: T`\frac{${k * d}}{${d}}`, r: String(k), sol: `Ley de signos y divide. Resultado: ${k}.` };
      },
    },
    {
      id: 'potencias', n: 2, titulo: 'Potencias', icono: 'ph-text-superscript', color: '#22C9A6',
      idea: 'x², x³… aparecen en todos los límites. Hay que calcularlas sin dudar.',
      explica: [
        'Una potencia es multiplicar un número por sí mismo: $3^2=3\\cdot3=9$ y $2^3=2\\cdot2\\cdot2=8$.',
        'Con negativos, el paréntesis importa: $(-2)^2=(-2)(-2)=4$, pero $-2^2=-(2\\cdot2)=-4$.',
        'Un negativo elevado a un número par da positivo; a un número impar, negativo: $(-1)^4=1$ y $(-1)^3=-1$.',
        'Todo número elevado a 0 da 1, y elevado a 1 se queda igual.',
      ],
      ejemplos: [
        { e: T`(-3)^2`, pasos: [['(−3)(−3) → signos iguales:', T`9`]], r: '9' },
        { e: T`(-2)^3`, pasos: [['(−2)(−2)(−2): exponente impar → negativo:', T`-8`]], r: '-8' },
        { e: T`3(2)^2`, pasos: [['Primero la potencia: 2² = 4.', ''], ['Luego multiplica: 3 · 4.', '']], r: '12' },
      ],
      gen() {
        const a = noCero(-5, 5), n = ent(2, 3), c = noCero(-4, 4);
        if (Math.random() < 0.6) return { e: T`${par(a)}^{${n}}`, r: String(a ** n), sol: `Multiplica ${a} por sí mismo ${n} veces: ${a ** n}.` };
        return { e: T`${c}\cdot${par(a)}^{2}`, r: String(c * a * a), sol: `Primero la potencia: ${par(a)}² = ${a * a}. Luego ${c} · ${a * a} = ${c * a * a}.` };
      },
    },
    {
      id: 'evaluar', n: 3, titulo: 'Sustituir: reemplazar x por un número', icono: 'ph-arrows-left-right', color: '#FFB020',
      idea: 'Este es EL primer paso de todo límite. Si lo dominas, ya resuelves el tipo 1.',
      explica: [
        'La x es una cajita vacía. Sustituir es poner un número en la cajita.',
        'Pon SIEMPRE el número entre paréntesis, sobre todo si es negativo: si x = −2, entonces $x^2=(-2)^2=4$.',
        'Orden de operaciones: primero potencias, luego multiplicaciones y divisiones, y al final sumas y restas.',
        '$f(x)$ se lee "f de x": es el nombre de la expresión. $f(2)$ significa "reemplaza x por 2".',
      ],
      ejemplos: [
        { e: T`f(x)=2x^2-3x+1,\quad f(-2)`, pasos: [['Pon −2 entre paréntesis:', T`2(-2)^2-3(-2)+1`], ['Potencia: (−2)² = 4:', T`2(4)-3(-2)+1`], ['Multiplica:', T`8+6+1`]], r: '15' },
        { e: T`\frac{x+3}{x-1},\quad x=3`, pasos: [['Reemplaza:', T`\frac{3+3}{3-1}`], ['Opera:', T`\frac{6}{2}`]], r: '3' },
      ],
      gen() {
        const a = ent(-3, 3), p = noCero(-3, 3), q = noCero(-5, 5), r = noCero(-6, 6);
        const v = p * a * a + q * a + r;
        const pol = `${p === 1 ? '' : p === -1 ? '-' : p}x^2 ${q < 0 ? '-' : '+'} ${Math.abs(q)}x ${r < 0 ? '-' : '+'} ${Math.abs(r)}`;
        return { e: T`f(x)=${pol},\quad f(${a})`, r: String(v), sol: `Reemplaza x por (${a}): ${p}(${a})² + (${q})(${a}) + (${r}) = ${p * a * a} + ${q * a} + ${r} = ${v}.` };
      },
    },
    {
      id: 'expresiones', n: 4, titulo: 'Multiplicar expresiones (distributiva)', icono: 'ph-x', color: '#B07CFF',
      idea: 'Para factorizar hay que saber hacer el camino contrario: multiplicar.',
      explica: [
        'Términos semejantes: solo se suman los que tienen la misma letra y el mismo exponente: $3x+5x=8x$, pero $x^2+x$ no se junta.',
        'Distributiva: el de afuera multiplica a cada uno de adentro: $3(x+2)=3x+6$.',
        'Dos paréntesis: cada término del primero por cada uno del segundo: $(x+2)(x+3)=x^2+3x+2x+6=x^2+5x+6$.',
        'Truco: en $(x+a)(x+b)$ el número del medio es $a+b$ y el del final es $a\\cdot b$.',
      ],
      ejemplos: [
        { e: T`(x+2)(x+3)`, pasos: [['x·x + x·3 + 2·x + 2·3:', T`x^2+3x+2x+6`], ['Junta las x:', T`x^2+5x+6`]], r: T`x^2+5x+6` },
        { e: T`(x-4)(x+4)`, pasos: [['x² + 4x − 4x − 16: las x se cancelan.', T`x^2-16`]], r: T`x^2-16` },
      ],
      gen() {
        const a = noCero(-6, 6), b = noCero(-6, 6);
        const tA = a < 0 ? `x - ${-a}` : `x + ${a}`, tB = b < 0 ? `x - ${-b}` : `x + ${b}`;
        if (Math.random() < 0.5) return { e: T`(${tA})(${tB}) = x^2 + \square\,x + \dots`, r: String(a + b), pide: 'el número del medio', sol: `El del medio es la suma: ${a} + (${b}) = ${a + b}.` };
        return { e: T`(${tA})(${tB}) = x^2 + \dots + \square`, r: String(a * b), pide: 'el número del final', sol: `El del final es el producto: ${a} · (${b}) = ${a * b}.` };
      },
    },
    {
      id: 'factorcomun', n: 5, titulo: 'Factorizar 1: factor común', icono: 'ph-arrow-u-up-left', color: '#2EC5FF',
      idea: 'Factorizar = convertir una suma en una multiplicación. El primer truco: sacar lo que se repite.',
      explica: [
        'Factorizar es deshacer la distributiva: $3x+6=3(x+2)$.',
        'Busca lo que está en TODOS los términos y sácalo: $x^2-5x=x(x-5)$, porque los dos tienen x.',
        'Verifica siempre multiplicando de vuelta.',
      ],
      ejemplos: [
        { e: T`x^2-5x`, pasos: [['Los dos términos tienen x: sácala.', T`x(x-5)`]], r: T`x(x-5)` },
        { e: T`4x+12`, pasos: [['Los dos son múltiplos de 4:', T`4(x+3)`]], r: T`4(x+3)` },
      ],
      gen() {
        const a = noCero(-9, 9);
        return { e: T`x^2 ${a < 0 ? '+' : '-'} ${Math.abs(a)}x = x(x - \square)`, r: String(a), pide: 'el número del cuadrito', sol: `Saca la x: x² − (${a})x = x(x − (${a})). El cuadrito es ${a}.` };
      },
    },
    {
      id: 'difcuadrados', n: 6, titulo: 'Factorizar 2: diferencia de cuadrados', icono: 'ph-squares-four', color: '#FF5C7A',
      idea: 'El caso que MÁS sale en los límites 0/0.',
      explica: [
        'Si ves algo al cuadrado MENOS un número cuadrado perfecto, es diferencia de cuadrados: $x^2-a^2=(x-a)(x+a)$.',
        'Cuadrados perfectos para reconocer: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.',
        'Ejemplo: $x^2-9=(x-3)(x+3)$, porque 9 = 3².',
        'OJO: $x^2+9$ (con +) NO se factoriza así.',
      ],
      ejemplos: [
        { e: T`x^2-25`, pasos: [['25 = 5²:', T`(x-5)(x+5)`]], r: T`(x-5)(x+5)` },
        { e: T`x^2-1`, pasos: [['1 = 1²:', T`(x-1)(x+1)`]], r: T`(x-1)(x+1)` },
      ],
      gen() {
        const a = ent(1, 10);
        return { e: T`x^2-${a * a}=(x-\square)(x+\square)`, r: String(a), pide: 'el número del cuadrito', sol: `${a * a} = ${a}². Entonces x² − ${a * a} = (x − ${a})(x + ${a}).` };
      },
    },
    {
      id: 'trinomio', n: 7, titulo: 'Factorizar 3: trinomio x² + bx + c', icono: 'ph-magnifying-glass', color: '#FF8A3D',
      idea: 'El juego de "dos números que sumen b y multipliquen c".',
      explica: [
        'Para $x^2+bx+c$ busca dos números que SUMADOS den b y MULTIPLICADOS den c.',
        'Ejemplo: $x^2+5x+6$: suman 5 y multiplican 6 → 2 y 3. Queda $(x+2)(x+3)$.',
        'Con negativos: $x^2-5x+6$ → −2 y −3 (suman −5 y multiplican 6). Queda $(x-2)(x-3)$.',
        'Si c es negativo, los números tienen signos distintos: $x^2+x-6$ → 3 y −2.',
        'Empieza por los pares que multiplicados dan c y prueba cuál suma b.',
      ],
      ejemplos: [
        { e: T`x^2+7x+12`, pasos: [['Pares que multiplican 12: (1,12), (2,6), (3,4).', ''], ['¿Cuál suma 7? → 3 y 4.', T`(x+3)(x+4)`]], r: T`(x+3)(x+4)` },
        { e: T`x^2-x-6`, pasos: [['Multiplican −6 y suman −1 → −3 y 2.', T`(x-3)(x+2)`]], r: T`(x-3)(x+2)` },
      ],
      gen() {
        let p, q; do { p = noCero(-7, 7); q = noCero(-7, 7); } while (p + q === 0);
        const b = p + q, c = p * q;
        return { e: T`x^2 ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}`, r: `${p},${q}`, par: true,
          pide: 'los dos números (ej. 2,3)', sol: `Suman ${b} y multiplican ${c}: ${p} y ${q}. Queda (x ${p < 0 ? '-' : '+'} ${Math.abs(p)})(x ${q < 0 ? '-' : '+'} ${Math.abs(q)}).` };
      },
    },
    {
      id: 'simplificar', n: 8, titulo: 'Simplificar fracciones con x', icono: 'ph-scissors', color: '#7CE38B',
      idea: 'Lo mismo que simplificar 6/8 = 3/4, pero con factores. Es el corazón del 0/0.',
      explica: [
        'Tú ya sabes que $\\frac{6}{8}=\\frac{2\\cdot3}{2\\cdot4}=\\frac{3}{4}$: se cancela lo que MULTIPLICA arriba y abajo.',
        'Con x es igual: primero factoriza, después cancela el paréntesis repetido.',
        '$\\frac{x^2-9}{x-3}=\\frac{(x-3)(x+3)}{x-3}=x+3$.',
        'Regla de oro: solo se cancelan FACTORES (paréntesis completos que multiplican), nunca términos sueltos de una suma.',
      ],
      ejemplos: [
        { e: T`\frac{x^2-4}{x-2}`, pasos: [['Factoriza arriba:', T`\frac{(x-2)(x+2)}{x-2}`], ['Cancela (x − 2):', T`x+2`]], r: T`x+2` },
        { e: T`\frac{x^2+5x+6}{x+2}`, pasos: [['Trinomio:', T`\frac{(x+2)(x+3)}{x+2}`], ['Cancela:', T`x+3`]], r: T`x+3` },
      ],
      gen() {
        const a = ent(1, 8), x0 = ent(-3, 5);
        return { e: T`\frac{x^2-${a * a}}{x-${a}}\ \text{ simplificada, evaluada en } x=${x0}`, r: String(x0 + a), pide: 'el valor',
          sol: `Simplifica: (x − ${a})(x + ${a})/(x − ${a}) = x + ${a}. En x = ${x0}: ${x0} + ${a} = ${x0 + a}.` };
      },
    },
    {
      id: 'raices', n: 9, titulo: 'Raíces y el conjugado', icono: 'ph-radical', color: '#E5D34B',
      idea: 'Para los límites con raíz (tipo 3) solo necesitas esto.',
      explica: [
        'La raíz cuadrada es la operación contraria a elevar al cuadrado: $\\sqrt{25}=5$ porque $5^2=25$.',
        'Conjugado: es la misma expresión con el signo del medio cambiado. El de $\\sqrt{x}-3$ es $\\sqrt{x}+3$.',
        'La magia: $(\\sqrt{A}-B)(\\sqrt{A}+B)=A-B^2$. La raíz desaparece.',
        'Ejemplo: $(\\sqrt{x}-3)(\\sqrt{x}+3)=x-9$.',
      ],
      ejemplos: [
        { e: T`(\sqrt{x}-4)(\sqrt{x}+4)`, pasos: [['A − B² con A = x y B = 4:', T`x-16`]], r: T`x-16` },
        { e: T`(\sqrt{x+5}-2)(\sqrt{x+5}+2)`, pasos: [['A − B² con A = x + 5 y B = 2:', T`(x+5)-4=x+1`]], r: T`x+1` },
      ],
      gen() {
        if (Math.random() < 0.5) { const k = ent(2, 12); return { e: T`\sqrt{${k * k}}`, r: String(k), sol: `${k}² = ${k * k}, entonces √${k * k} = ${k}.` }; }
        const b = ent(1, 9);
        return { e: T`(\sqrt{x}-${b})(\sqrt{x}+${b}) = x - \square`, r: String(b * b), pide: 'el número del cuadrito', sol: `Queda x − ${b}² = x − ${b * b}.` };
      },
    },
    {
      id: 'cero', n: 10, titulo: 'Dividir entre 0 y números gigantes', icono: 'ph-infinity', color: '#8B9BB8',
      idea: 'Entender 0/0, k/0 y qué pasa con 1/x cuando x es enorme.',
      explica: [
        'No se puede dividir entre 0. En límites lo usamos como SEÑAL:',
        '0/0 → "indeterminado": hay que simplificar (factorizar o racionalizar).',
        'k/0 con k ≠ 0 → el resultado se dispara a $+\\infty$ o $-\\infty$.',
        'Un número fijo dividido entre algo gigante es casi 0: $\\frac{1}{1000}=0.001$. Por eso $\\frac{k}{x}\\to0$ cuando $x\\to\\infty$.',
        'Un número dividido entre algo diminuto es gigante: $\\frac{1}{0.001}=1000$.',
      ],
      ejemplos: [
        { e: T`\frac{1}{1000}`, pasos: [['Uno entre algo enorme:', T`0.001`]], r: '0.001' },
        { e: T`\frac{2}{0.01}`, pasos: [['Dos entre algo diminuto:', T`200`]], r: '200' },
      ],
      gen() {
        const k = ent(1, 9), p = uno([10, 100, 1000]);
        if (Math.random() < 0.5) return { e: T`\frac{${k}}{${p}}`, r: String(k / p), sol: `${k} ÷ ${p} = ${k / p}: entre más grande abajo, más cerca de 0.` };
        return { e: T`\frac{${k}}{${1 / p}}`, r: String(k * p), sol: `${k} ÷ ${1 / p} = ${k * p}: entre más chiquito abajo, más grande el resultado.` };
      },
    },
    {
      id: 'trig', n: 11, titulo: 'Trigonometría mínima', icono: 'ph-wave-sine', color: '#FF6B9A',
      idea: 'Para los límites trigonométricos solo necesitas 4 datos.',
      explica: [
        'sen, cos y tan son funciones de ángulos. En límites, los ángulos van en radianes (la calculadora en modo RAD).',
        '$\\sin 0=0$, $\\cos 0=1$ y $\\tan 0=0$.',
        '$\\tan x=\\frac{\\sin x}{\\cos x}$.',
        'Y la llave de los límites: cuando x se acerca a 0, $\\frac{\\sin x}{x}$ se acerca a 1.',
      ],
      ejemplos: [
        { e: T`\cos 0+\sin 0`, pasos: [['cos 0 = 1 y sen 0 = 0:', T`1+0`]], r: '1' },
      ],
      gen() {
        const v = ent(1, 3);
        if (v === 1) return { e: T`\sin 0`, r: '0', sol: 'sen 0 = 0.' };
        if (v === 2) { const k = ent(2, 9); return { e: T`${k}\cos 0`, r: String(k), sol: `cos 0 = 1, entonces ${k} · 1 = ${k}.` }; }
        return { e: T`\frac{\sin 0}{\cos 0}`, r: '0', sol: '0 / 1 = 0 (es tan 0).' };
      },
    },
    {
      id: 'puente', n: 12, titulo: 'Puente: tu primer límite', icono: 'ph-bridge', color: '#3B6CF6',
      idea: 'Juntas todo: sustituir, ver 0/0, factorizar, cancelar y volver a sustituir.',
      explica: [
        'Ya tienes todas las piezas. Un límite 0/0 típico es: sustituir (lección 3), ver que da 0/0 (10), factorizar (5, 6 o 7), cancelar (8) y sustituir otra vez (3).',
        'Cuando aciertes estos, pasa al tablero de límites: árbol de decisión y tipos 1 a 4.',
      ],
      ejemplos: [
        { e: T`\lim_{x\to5}\frac{x^2-25}{x-5}`, pasos: [['Sustituye: 0/0.', T`\frac{25-25}{5-5}`], ['Diferencia de cuadrados y cancela:', T`\frac{(x-5)(x+5)}{x-5}=x+5`], ['Sustituye x = 5:', T`5+5`]], r: '10' },
      ],
      gen() {
        const a = ent(1, 9);
        return { e: T`\lim_{x\to ${a}}\frac{x^2-${a * a}}{x-${a}}`, r: String(2 * a), sol: `0/0 → (x − ${a})(x + ${a})/(x − ${a}) = x + ${a} → ${a} + ${a} = ${2 * a}.` };
      },
    },
  ];

  // Compara respuestas: números (incluye fracciones y decimales) o pares sin importar el orden.
  function correcto(entrada, ej) {
    const limpio = String(entrada).replace(/\s+/g, '').replace(/y/gi, ',');
    if (ej.par) {
      const a = limpio.split(/[,;]/).map(Number).filter(Number.isFinite).sort((x, y) => x - y);
      const b = ej.r.split(',').map(Number).sort((x, y) => x - y);
      return a.length === 2 && a[0] === b[0] && a[1] === b[1];
    }
    return window.GEN.correcto(limpio, ej.r) || Math.abs(Number(limpio) - Number(ej.r)) < 1e-9;
  }

  window.BASES = { lecciones, correcto };
})();
