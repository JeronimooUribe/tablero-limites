// Tablero de Límites — navegación por hash, entrenador, identificador y simulacro.
(() => {
  const L = window.LIM, G = window.GEN;
  const $ = s => document.querySelector(s);
  const vista = $('#vista');
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const m = (tex, bloque = true) => { try { return katex.renderToString(tex, { displayMode: bloque, throwOnError: false }); } catch { return esc(tex); } };
  // Texto con fórmulas en línea entre $…$
  const txt = s => String(s).split(/(\$[^$]+\$)/g).map(p => p.startsWith('$') ? m(p.slice(1, -1), false) : esc(p)).join('');
  const tipo = id => L.tipos.find(t => t.id === id);
  const conGen = L.tipos.filter(t => t.gen);
  const mezclar = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);

  // ---------- Progreso (solo en este navegador) ----------
  const CLAVE = 'limites-progreso-v1';
  let prog = { tipos: {}, ident: { ok: 0, n: 0 } };
  try { prog = { ...prog, ...JSON.parse(localStorage.getItem(CLAVE) || '{}') }; } catch { /* sin almacenamiento */ }
  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(prog)); } catch { /* sin almacenamiento */ } };
  const anotar = (id, ok) => { const p = prog.tipos[id] || (prog.tipos[id] = { ok: 0, n: 0 }); p.n++; if (ok) p.ok++; guardar(); };
  const pct = id => { const p = prog.tipos[id]; return p && p.n ? Math.round((100 * p.ok) / p.n) : 0; };

  // ---------- Vistas ----------
  function inicio() {
    return `<section class="entra">
      <h1>Límites</h1>
      <p class="bajada">${esc(L.examen)}. Aquí no se memoriza teoría: se aprende a <b>resolver</b>.</p>
      <div class="panel"><h3>El método (siempre igual)</h3><div class="metodo">${L.regla.map(([a, b], i) => `<div><b>${i + 1}</b><strong>${esc(a.replace(/^\d\.\s*/, ''))}</strong><span>${esc(b)}</span></div>`).join('')}</div></div>
      <div class="atajos">
        <a class="atajo" href="#/arbol" style="--c:#3B6CF6"><i class="ph-bold ph-tree-structure"></i><b>Árbol de decisión</b><span>¿Qué hago con este ejercicio?</span></a>
        <a class="atajo" href="#/entrenar" style="--c:#0E9F6E"><i class="ph-bold ph-barbell"></i><b>Entrenar</b><span>Ejercicios infinitos con corrección</span></a>
        <a class="atajo" href="#/identificar" style="--c:#B07CFF"><i class="ph-bold ph-target"></i><b>¿Qué tipo es?</b><span>Reconoce el método en 3 segundos</span></a>
        <a class="atajo" href="#/simulacro" style="--c:#FF8A3D"><i class="ph-bold ph-timer"></i><b>Simulacro</b><span>10 ejercicios, 20 minutos, nota</span></a>
        <a class="atajo" href="#/formulas" style="--c:#2EC5FF"><i class="ph-bold ph-function"></i><b>Fórmulas</b><span>Factorizaciones y límites notables</span></a>
        <a class="atajo" href="#/trampas" style="--c:#E0475E"><i class="ph-bold ph-warning"></i><b>Trampas</b><span>Los errores que quitan puntos</span></a>
      </div>
      <h2>Los tipos, en orden</h2>
      <div class="tipos">${L.tipos.map(t => `
        <a class="tipo-fila" href="#/tipo/${t.id}" style="--c:${t.color}">
          <span class="ico"><i class="ph-bold ${t.icono}"></i></span>
          <span><b>${t.n}. ${esc(t.titulo)}</b><small>${esc(t.corto)}</small>${t.gen ? `<div class="barra"><i style="width:${pct(t.id)}%"></i></div>` : ''}</span>
          <span class="pct">${t.gen ? `${pct(t.id)}%` : ''}</span>
        </a>`).join('')}</div>
      <p class="bajada" style="margin-top:16px">Videos: <a href="${L.lista}" target="_blank" rel="noopener">lista "Límites de funciones" de Julioprofe</a> (49 videos).</p>
    </section>`;
  }

  function arbol() {
    return `<section class="entra">
      <h1>Árbol de decisión</h1>
      <p class="bajada">Frente a cualquier límite, haz esto. Toca una rama para ver la receta.</p>
      <div class="inicio-arbol">1. Sustituye x por el valor</div>
      <div class="flecha-abajo"><i class="ph-bold ph-arrow-down"></i></div>
      <p class="bajada" style="text-align:center;margin:0 0 10px"><b>2. ¿Qué salió?</b></p>
      ${L.arbol.map(r => { const t = tipo(r.tipo); return `<a class="rama" href="#/tipo/${t.id}" style="--c:${t.color}"><span class="si">${esc(r.si)}</span><i class="ph-bold ph-caret-right"></i><span class="haz">${esc(r.haz)}</span></a>`; }).join('')}
      <div class="flecha-abajo"><i class="ph-bold ph-arrow-down"></i></div>
      <div class="inicio-arbol" style="background:var(--ok)">3. Después de simplificar, sustituye otra vez</div>
      <a class="btn primario ancho" href="#/identificar"><i class="ph-bold ph-target"></i>Practicar reconocer el tipo</a>
    </section>`;
  }

  function vistaTipo(id) {
    const t = tipo(id);
    if (!t) return inicio();
    const ejemplo = (e, i) => `<div class="ejemplo" data-ej="${i}">
      <div class="enunciado">${m(e.lim)}</div>
      ${e.pasos.map(([a, b]) => `<div class="paso">${a ? `<p>${txt(a)}</p>` : ''}${b ? m(b) : ''}</div>`).join('')}
      <div class="respuesta">Respuesta: ${m(G.tex(e.resp), false)}</div>
      <button class="btn ancho" data-siguiente><i class="ph-bold ph-eye"></i>Ver el siguiente paso</button>
    </div>`;
    const inc = t.incompleto;
    return `<section class="entra" style="--c:${t.color}">
      <div class="cab-tipo"><span class="ico"><i class="ph-bold ${t.icono}"></i></span><div><h1>${esc(t.titulo)}</h1><span class="bajada">${esc(t.corto)}</span></div></div>
      <div class="cuando"><i class="ph-bold ph-signpost"></i> Cuándo: ${txt(t.cuando)}</div>
      <div class="panel"><h3>Lo esencial</h3><ul class="lista">${t.esencial.map(x => `<li>${txt(x)}</li>`).join('')}</ul></div>
      <div class="panel"><h3>La receta</h3><ol class="receta">${t.receta.map(x => `<li>${txt(x)}</li>`).join('')}</ol></div>
      <div class="panel"><h3>Ejemplos resueltos (piensa antes de cada paso)</h3>${t.ejemplos.map(ejemplo).join('')}</div>
      ${inc ? `<div class="panel" data-incompleto><h3>Complétalo tú</h3><div class="ejemplo">
        <div class="enunciado">${m(inc.lim)}</div>
        ${inc.pasos.map(([a, b]) => `<div class="paso ver">${a ? `<p>${txt(a)}</p>` : ''}${b === '?' ? '<p style="text-align:center;font-size:22px">?</p>' : b ? m(b) : ''}</div>`).join('')}
        <div class="campo"><input data-resp="${esc(inc.resp)}" placeholder="Tu respuesta" inputmode="text" autocomplete="off"><button class="btn primario" data-comprobar-inc>Comprobar</button></div>
        <div class="veredicto"></div></div></div>` : ''}
      <div class="panel"><h3>Trampas</h3>${t.trampas.map(x => `<div class="trampa"><i class="ph-fill ph-warning-circle"></i><span>${txt(x)}</span></div>`).join('')}</div>
      ${t.videos.length ? `<div class="panel"><h3>Videos (Julioprofe)</h3>${t.videos.map(v => `<a class="video" href="${v.url}" target="_blank" rel="noopener"><i class="ph-fill ph-youtube-logo"></i>${esc(v.t)}</a>`).join('')}</div>` : ''}
      ${t.gen ? `<a class="btn primario ancho" href="#/entrenar/${t.id}"><i class="ph-bold ph-barbell"></i>Entrenar este tipo (ejercicios infinitos)</a>` : ''}
    </section>`;
  }

  function enlazarTipo() {
    vista.querySelectorAll('.ejemplo[data-ej]').forEach(ej => {
      const b = ej.querySelector('[data-siguiente]');
      b.onclick = () => {
        const sig = ej.querySelector('.paso:not(.ver)');
        if (sig) { sig.classList.add('ver'); if (!ej.querySelector('.paso:not(.ver)')) b.innerHTML = '<i class="ph-bold ph-flag-checkered"></i>Ver la respuesta'; }
        else { ej.querySelector('.respuesta').classList.add('ver'); b.remove(); }
      };
    });
    const inc = vista.querySelector('[data-incompleto]');
    if (inc) {
      const inp = inc.querySelector('input'), ver = inc.querySelector('.veredicto');
      const probar = () => {
        const ok = G.correcto(inp.value, inp.dataset.resp);
        ver.className = `veredicto ${ok ? 'ok' : 'mal'}`;
        ver.innerHTML = ok ? '¡Correcto!' : `No. La respuesta es ${m(G.tex(inp.dataset.resp), false)}`;
      };
      inc.querySelector('[data-comprobar-inc]').onclick = probar;
      inp.onkeydown = e => { if (e.key === 'Enter') probar(); };
    }
  }

  // ---------- Entrenador ----------
  const ent = { filtro: null, actual: null, cola: [], racha: 0, ok: 0, n: 0, respondido: false };
  function nuevoEjercicio() {
    const debido = ent.cola.findIndex(c => c.turnos <= 0 && (!ent.filtro || c.e.tipo === ent.filtro));
    ent.cola.forEach(c => c.turnos--);
    if (debido >= 0) { ent.actual = ent.cola.splice(debido, 1)[0].e; ent.actual.repaso = true; }
    else ent.actual = ent.filtro ? G.crear(ent.filtro) : G.mezcla();
    ent.respondido = false;
  }
  function entrenar(id) {
    if (id !== undefined) { ent.filtro = id || null; }
    if (!ent.actual || (ent.filtro && ent.actual.tipo !== ent.filtro)) nuevoEjercicio();
    const e = ent.actual, t = tipo(e.tipo);
    return `<section class="entra" style="--c:${t.color}">
      <h1>Entrenar</h1>
      <div class="filtro">${[['', 'Mezclado'], ...conGen.map(x => [x.id, x.titulo])].map(([k, n]) => `<button data-filtro="${k}" class="${(ent.filtro || '') === k ? 'activo' : ''}">${esc(n)}</button>`).join('')}</div>
      <div class="marcador"><span>Aciertos <b>${ent.ok}/${ent.n}</b></span><span>Racha <b>${ent.racha}</b></span><span>Para repasar <b>${ent.cola.length}</b></span></div>
      <div class="panel ejercicio">
        <span class="etiqueta">${e.repaso ? '<i class="ph-bold ph-arrow-counter-clockwise"></i>Repaso · ' : ''}${ent.filtro ? esc(t.titulo) : '¿Qué tipo es?'}</span>
        <div class="enunciado">${m(e.tex)}</div>
        <div class="campo"><input id="resp" placeholder="Tu respuesta (ej. 3/2)" autocomplete="off" inputmode="text"><button class="btn primario" id="comprobar">Comprobar</button></div>
        <div class="teclas">${['∞', '-∞', 'no existe', '/', '-'].map(k => `<button data-tecla="${k}">${k}</button>`).join('')}</div>
        <div class="veredicto" id="veredicto"></div>
        <div class="solucion" id="solucion"><h3>Solución · ${esc(t.titulo)}</h3>${e.pasos.map(p => p.startsWith('\\') || /[\\^_{}]/.test(p) ? m(p) : `<p>${txt(p)}</p>`).join('')}</div>
        <div class="btns"><button class="btn" id="pista"><i class="ph-bold ph-lightbulb"></i>Pista</button><button class="btn" id="versol"><i class="ph-bold ph-eye"></i>Solución</button><button class="btn primario" id="siguiente"><i class="ph-bold ph-arrow-right"></i>Otro</button></div>
      </div>
      ${ent.filtro ? `<a class="btn ancho" href="#/tipo/${t.id}"><i class="ph-bold ph-book-open"></i>Ver la receta de «${esc(t.titulo)}»</a>`
        : '<a class="btn ancho" href="#/arbol"><i class="ph-bold ph-tree-structure"></i>¿No sabes por dónde empezar? Mira el árbol</a>'}
    </section>`;
  }
  function enlazarEntrenar() {
    const inp = $('#resp'), ver = $('#veredicto'), sol = $('#solucion');
    inp.focus({ preventScroll: true });
    vista.querySelectorAll('[data-filtro]').forEach(b => b.onclick = () => { ent.filtro = b.dataset.filtro || null; ent.actual = null; location.hash = ent.filtro ? `#/entrenar/${ent.filtro}` : '#/entrenar'; pintar(); });
    vista.querySelectorAll('[data-tecla]').forEach(b => b.onclick = () => {
      const k = b.dataset.tecla;
      inp.value = ['∞', '-∞', 'no existe'].includes(k) ? (k === '∞' ? 'inf' : k === '-∞' ? '-inf' : 'no existe') : inp.value + k;
      inp.focus();
    });
    const comprobar = () => {
      if (ent.respondido || !inp.value.trim()) return;
      const ok = G.correcto(inp.value, ent.actual.resp);
      ent.respondido = true; ent.n++;
      if (ok) { ent.ok++; ent.racha++; } else { ent.racha = 0; ent.cola.push({ e: { ...ent.actual, repaso: false }, turnos: 3 }); }
      anotar(ent.actual.tipo, ok);
      ver.className = `veredicto ${ok ? 'ok' : 'mal'}`;
      ver.innerHTML = ok ? `¡Correcto! ${m(G.tex(ent.actual.resp), false)}` : `No. Era ${m(G.tex(ent.actual.resp), false)}. Mira la solución; este volverá en 3 ejercicios.`;
      if (!ok) sol.classList.add('ver');
      $('.marcador').innerHTML = `<span>Aciertos <b>${ent.ok}/${ent.n}</b></span><span>Racha <b>${ent.racha}</b></span><span>Para repasar <b>${ent.cola.length}</b></span>`;
    };
    $('#comprobar').onclick = comprobar;
    inp.onkeydown = e => { if (e.key === 'Enter') { ent.respondido ? $('#siguiente').click() : comprobar(); } };
    $('#pista').onclick = () => { const t = tipo(ent.actual.tipo); ver.className = 'veredicto ok'; ver.style.color = 'var(--texto)'; ver.innerHTML = `Pista: ${txt(t.cuando)} → ${txt(t.receta[1] || t.receta[0])}`; };
    $('#versol').onclick = () => sol.classList.toggle('ver');
    $('#siguiente').onclick = () => { nuevoEjercicio(); pintar(); };
  }

  // ---------- ¿Qué tipo es? ----------
  const idt = { e: null, hecho: false, racha: 0 };
  function identificar() {
    if (!idt.e || idt.hecho) { idt.e = G.mezcla(); idt.hecho = false; }
    const bueno = idt.e.tipo;
    const otras = mezclar(conGen.filter(t => t.id !== bueno)).slice(0, 3).map(t => t.id);
    const ops = mezclar([bueno, ...otras]);
    return `<section class="entra">
      <h1>¿Qué tipo es?</h1>
      <p class="bajada">No lo resuelvas: solo reconoce qué método usar. Esto es lo que más rápido te hace ganar.</p>
      <div class="marcador"><span>Aciertos <b>${prog.ident.ok}/${prog.ident.n}</b></span><span>Racha <b>${idt.racha}</b></span></div>
      <div class="panel ejercicio"><div class="enunciado">${m(idt.e.tex)}</div>
        <div class="opciones">${ops.map(id => { const t = tipo(id); return `<button data-op="${id}" style="--c:${t.color}"><i class="ph-bold ${t.icono}"></i>${esc(t.titulo)}</button>`; }).join('')}</div>
        <div class="veredicto" id="v-id"></div>
        <button class="btn primario ancho" id="otro-id" style="display:none"><i class="ph-bold ph-arrow-right"></i>Otro</button>
      </div>
    </section>`;
  }
  function enlazarIdentificar() {
    vista.querySelectorAll('[data-op]').forEach(b => b.onclick = () => {
      if (idt.hecho) return;
      idt.hecho = true;
      const ok = b.dataset.op === idt.e.tipo, t = tipo(idt.e.tipo);
      prog.ident.n++; if (ok) { prog.ident.ok++; idt.racha++; } else idt.racha = 0; guardar();
      vista.querySelectorAll('[data-op]').forEach(x => { if (x.dataset.op === idt.e.tipo) x.classList.add('bien'); else if (x === b) x.classList.add('malo'); });
      const v = $('#v-id'); v.className = `veredicto ${ok ? 'ok' : 'mal'}`;
      v.innerHTML = `${ok ? '¡Exacto!' : `Era «${esc(t.titulo)}».`} ${txt(t.cuando)}`;
      $('#otro-id').style.display = '';
    });
    $('#otro-id').onclick = () => { idt.hecho = true; pintar(); };
  }

  // ---------- Simulacro ----------
  const sim = { lista: null, i: 0, resp: [], fin: 0, timer: null };
  function simulacro() {
    if (!sim.lista) {
      return `<section class="entra"><h1>Simulacro</h1>
        <p class="bajada">10 ejercicios mezclados, como en el examen. 20 minutos. Al final te doy la nota sobre 5.0 y la solución de cada uno.</p>
        <div class="panel"><ul class="lista"><li>Hazlo en papel y escribe solo el resultado.</li><li>Si no sabes uno, pasa al siguiente.</li><li>Escribe ∞, −∞ o "no existe" con las teclas.</li></ul></div>
        <button class="btn primario ancho" id="empezar"><i class="ph-bold ph-play"></i>Empezar</button></section>`;
    }
    if (sim.i >= sim.lista.length) {
      const bien = sim.lista.filter((e, i) => G.correcto(sim.resp[i] || '', e.resp)).length;
      const nota = (5 * bien / sim.lista.length).toFixed(1);
      return `<section class="entra"><h1>Resultado</h1>
        <div class="panel" style="text-align:center"><div class="nota" style="--c:${bien >= 6 ? 'var(--ok)' : 'var(--mal)'}">${nota}</div><p class="bajada">${bien} de ${sim.lista.length} correctos</p></div>
        <div class="panel"><h3>Revisión</h3>${sim.lista.map((e, i) => { const ok = G.correcto(sim.resp[i] || '', e.resp); return `<div class="repaso-item">${m(e.tex)}<p>${ok ? '✅' : '❌'} Tu respuesta: <b>${esc(sim.resp[i] || '—')}</b> · Correcta: ${m(G.tex(e.resp), false)} · <a href="#/tipo/${e.tipo}">${esc(tipo(e.tipo).titulo)}</a></p></div>`; }).join('')}</div>
        <button class="btn primario ancho" id="otra-vez"><i class="ph-bold ph-arrow-counter-clockwise"></i>Otro simulacro</button></section>`;
    }
    const e = sim.lista[sim.i];
    return `<section class="entra"><h1>Simulacro</h1>
      <div class="reloj" id="reloj">20:00</div>
      <div class="marcador"><span>Ejercicio <b>${sim.i + 1}/${sim.lista.length}</b></span></div>
      <div class="panel ejercicio"><div class="enunciado">${m(e.tex)}</div>
        <div class="campo"><input id="resp-sim" placeholder="Resultado" autocomplete="off" value="${esc(sim.resp[sim.i] || '')}"><button class="btn primario" id="sig-sim">${sim.i === sim.lista.length - 1 ? 'Terminar' : 'Siguiente'}</button></div>
        <div class="teclas">${['∞', '-∞', 'no existe', '/', '-'].map(k => `<button data-tecla="${k}">${k}</button>`).join('')}</div>
      </div></section>`;
  }
  function enlazarSimulacro() {
    const empezar = $('#empezar');
    if (empezar) empezar.onclick = () => {
      // Al menos un ejercicio de 8 tipos distintos, más 2 al azar.
      sim.lista = mezclar([...mezclar(conGen).slice(0, 8).map(t => G.crear(t.gen)), G.mezcla(), G.mezcla()]);
      sim.i = 0; sim.resp = []; sim.fin = Date.now() + 20 * 60 * 1000; pintar();
    };
    const otra = $('#otra-vez');
    if (otra) otra.onclick = () => { sim.lista = null; pintar(); };
    const inp = $('#resp-sim');
    if (inp) {
      inp.focus({ preventScroll: true });
      vista.querySelectorAll('[data-tecla]').forEach(b => b.onclick = () => { const k = b.dataset.tecla; inp.value = k === '∞' ? 'inf' : k === '-∞' ? '-inf' : k === 'no existe' ? 'no existe' : inp.value + k; inp.focus(); });
      const sig = () => { sim.resp[sim.i] = inp.value.trim(); sim.i++; pintar(); };
      $('#sig-sim').onclick = sig;
      inp.onkeydown = e => { if (e.key === 'Enter') sig(); };
      clearInterval(sim.timer);
      const tick = () => {
        const r = Math.max(0, sim.fin - Date.now());
        const el = $('#reloj'); if (!el) return clearInterval(sim.timer);
        el.textContent = `${Math.floor(r / 60000)}:${String(Math.floor((r % 60000) / 1000)).padStart(2, '0')}`;
        el.style.color = r < 3 * 60000 ? 'var(--mal)' : '';
        if (r === 0) { clearInterval(sim.timer); sim.i = sim.lista.length; pintar(); }
      };
      tick(); sim.timer = setInterval(tick, 500);
    }
  }

  function formulas() {
    return `<section class="entra"><h1>Fórmulas</h1><p class="bajada">Todo lo que tienes que tener en la cabeza.</p>
      <div class="panel">${L.formulas.map(([a, b]) => `<div class="formula"><b>${esc(a)}</b>${m(b)}</div>`).join('')}</div></section>`;
  }
  function trampas() {
    return `<section class="entra"><h1>Trampas</h1><p class="bajada">Los errores que más quitan puntos, por tipo.</p>
      ${L.tipos.filter(t => t.trampas.length).map(t => `<div class="panel" style="--c:${t.color}"><h3>${esc(t.titulo)}</h3>${t.trampas.map(x => `<div class="trampa"><i class="ph-fill ph-warning-circle"></i><span>${txt(x)}</span></div>`).join('')}</div>`).join('')}</section>`;
  }

  // ---------- Router ----------
  function pintar() {
    const [ruta, arg] = location.hash.replace(/^#\/?/, '').split('/');
    document.querySelectorAll('.pestanas a').forEach(a => a.classList.toggle('activa', a.dataset.ruta === (ruta || 'inicio')));
    if (ruta !== 'simulacro') clearInterval(sim.timer);
    let html, enlazar;
    switch (ruta) {
      case 'arbol': html = arbol(); break;
      case 'tipo': html = vistaTipo(arg); enlazar = enlazarTipo; break;
      case 'entrenar': if ((arg || null) !== ent.filtro) { ent.filtro = arg || null; ent.actual = null; } html = entrenar(); enlazar = enlazarEntrenar; break;
      case 'identificar': html = identificar(); enlazar = enlazarIdentificar; break;
      case 'simulacro': html = simulacro(); enlazar = enlazarSimulacro; break;
      case 'formulas': html = formulas(); break;
      case 'trampas': html = trampas(); break;
      default: html = inicio();
    }
    vista.innerHTML = html;
    if (enlazar) enlazar();
  }
  addEventListener('hashchange', () => { pintar(); scrollTo(0, 0); });
  pintar();
})();
