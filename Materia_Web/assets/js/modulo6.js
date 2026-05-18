/* ═══════════════════════════════════════════
   PAI3 · Módulo 6 · Paralelismo
═══════════════════════════════════════════ */

/* Force blue accent — overrides campus.js */
(function () {
  const r = document.documentElement;
  r.style.setProperty('--accent',        '#38bdf8');
  r.style.setProperty('--accent-sub',    'rgba(56,189,248,0.13)');
  r.style.setProperty('--accent-border', 'rgba(56,189,248,0.38)');
  r.style.setProperty('--accent-mid',    'rgba(56,189,248,0.55)');
})();

/* ─── Reading progress ───────────────────── */
const readProgress = document.getElementById('readProgress');
if (readProgress) {
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    readProgress.style.width = docH > 0 ? `${(window.scrollY / docH) * 100}%` : '0%';
  }, { passive: true });
}

/* ─── Scroll reveal ──────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Cursor glow ────────────────────────── */
const mglow = document.getElementById('mglow');
if (mglow) {
  window.addEventListener('mousemove', e => {
    mglow.style.transform = `translate(${e.clientX - 140}px, ${e.clientY - 140}px)`;
  }, { passive: true });
}

/* ─── Animated counters ──────────────────── */
function animateCounter(el, target) {
  if (!el) return;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    anime({
      targets: { val: 0 }, val: target, round: 1,
      duration: 1800, easing: 'easeOutQuart',
      update(a) { el.textContent = Math.round(a.animations[0].currentValue); },
      complete() { el.textContent = target; }
    });
  }, { threshold: 0.5 });
  obs.observe(el);
}
animateCounter(document.getElementById('counter1'), 128);
animateCounter(document.getElementById('counter2'), 10);
animateCounter(document.getElementById('counter3'), 3);

/* ─── Code tabs ──────────────────────────── */
function switchTab6(btn, panelId) {
  document.querySelectorAll('.m6codeTab').forEach(t => t.classList.remove('m6codeTabActive'));
  document.querySelectorAll('.m6codePanel').forEach(p => p.classList.add('m6codePanelHidden'));
  btn.classList.add('m6codeTabActive');
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.remove('m6codePanelHidden');
    if (window.Prism) Prism.highlightAllUnder(panel);
  }
}

/* ─── Lab code copy ──────────────────────── */
const LAB_CODE = `import java.util.concurrent.*;
import java.util.stream.LongStream;

public class SumaParalela {
    static final int UMBRAL = 50_000;

    static class SumTask extends RecursiveTask<Long> {
        final long[] arr;
        final int desde, hasta;

        SumTask(long[] arr, int desde, int hasta) {
            this.arr = arr; this.desde = desde; this.hasta = hasta;
        }

        @Override
        protected Long compute() {
            if (hasta - desde <= UMBRAL) {
                long sum = 0;
                for (int i = desde; i < hasta; i++) sum += arr[i];
                return sum;
            }
            int mid = (desde + hasta) / 2;
            SumTask izq = new SumTask(arr, desde, mid);
            SumTask der = new SumTask(arr, mid, hasta);
            izq.fork();
            return der.compute() + izq.join();
        }
    }

    public static void main(String[] args) {
        int N = 1_000_000;
        long[] arr = new long[N];
        for (int i = 0; i < N; i++) arr[i] = i + 1L;
        long esperado = (long) N * (N + 1) / 2;

        // 1. Secuencial
        long t0 = System.currentTimeMillis();
        long sumSeq = 0;
        for (long x : arr) sumSeq += x;
        long tSeq = System.currentTimeMillis() - t0;

        // 2. ForkJoin
        t0 = System.currentTimeMillis();
        long sumFJ = ForkJoinPool.commonPool().invoke(new SumTask(arr, 0, N));
        long tFJ = System.currentTimeMillis() - t0;

        // 3. Parallel Stream
        t0 = System.currentTimeMillis();
        long sumPS = LongStream.of(arr).parallel().sum();
        long tPS = System.currentTimeMillis() - t0;

        System.out.println("Esperado:         " + esperado);
        System.out.println("Secuencial:       " + sumSeq + " (" + tSeq + "ms)");
        System.out.println("ForkJoin:         " + sumFJ + " (" + tFJ + "ms)");
        System.out.println("ParallelStream:   " + sumPS + " (" + tPS + "ms)");
        System.out.println("Cores disponibles: " + Runtime.getRuntime().availableProcessors());
        if (tSeq > 0)
            System.out.printf("Speedup FJ: %.2fx%n", (double) tSeq / Math.max(tFJ, 1));
    }
}`;

function copyLabCode() {
  navigator.clipboard.writeText(LAB_CODE).then(() => {
    const btn = document.querySelector('[onclick="copyLabCode()"]');
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="ph-bold ph-check"></i> ¡Copiado!';
    setTimeout(() => { btn.innerHTML = orig; }, 2200);
  });
}

/* ═══════════════════════════════════════════
   SIMULADOR: AMDAHL'S LAW INTERACTIVE
═══════════════════════════════════════════ */
const CORES_MAP = [1, 2, 4, 8, 16, 32, 64];

const M6_SCENARIOS = [
  { P: 75, N: 2, desc: 'Redimensionar 10M de fotos — cada imagen es independiente. Caso casi ideal para paralelismo.' },
  { P: 92, N: 3, desc: 'Encodear video a 15 resoluciones — cada frame es una tarea independiente. El mejor caso posible.' },
  { P: 25, N: 2, desc: 'Validar transacciones bancarias — las reglas de negocio deben ejecutarse en orden estricto.' },
  { P: 65, N: 3, desc: 'Merge sort con 1M de elementos — los chunks se ordenan en paralelo, pero el merge final es serial.' },
];

function m6setScenario(idx) {
  document.querySelectorAll('.m6sScBtn').forEach((b, i) => {
    b.classList.toggle('m6sScBtnActive', i === idx);
  });
  const desc = document.getElementById('m6sScDesc');
  if (idx >= 0 && idx < M6_SCENARIOS.length) {
    const s = M6_SCENARIOS[idx];
    document.getElementById('amdahlP').value = s.P;
    document.getElementById('amdahlN').value = s.N;
    if (desc) desc.textContent = s.desc;
  } else {
    if (desc) desc.textContent = 'Modo libre — configurá tu propio escenario con los sliders.';
  }
  updateAmdahl();
}

function amdahlSpeedup(P, N) {
  return 1 / ((1 - P) + P / N);
}

function updateAmdahl() {
  const P    = parseInt(document.getElementById('amdahlP').value) / 100;
  const nIdx = parseInt(document.getElementById('amdahlN').value);
  const N    = CORES_MAP[nIdx];

  const speedup   = amdahlSpeedup(P, N);
  const maxS      = P < 1 ? 1 / (1 - P) : null;
  const efficiency = (speedup / N) * 100;
  const serialPct   = Math.round((1 - P) * 100);
  const parallelPct = Math.round(P * 100);

  document.getElementById('amdahlPLabel').textContent = parallelPct + '%';
  document.getElementById('amdahlNLabel').textContent = N;
  document.getElementById('amdahlSpeedup').textContent = '×' + speedup.toFixed(2);
  document.getElementById('amdahlMax').textContent     = maxS ? '×' + maxS.toFixed(1) : '×∞';
  document.getElementById('amdahlEff').textContent     = Math.round(efficiency) + '%';

  // Bar
  document.getElementById('amdahlBarSerial').style.setProperty('--w', serialPct + '%');
  document.getElementById('amdahlBarSerialLbl').textContent   = 'serial (' + serialPct + '%)';
  document.getElementById('amdahlBarParallelLbl').textContent = 'paralelo (' + parallelPct + '%)';

  // Chart
  drawAmdahlChart(P, N);
  drawAmdahlTimeline(P, N);

  // Insight
  const insight = document.getElementById('amdahlInsight');
  if (P === 0) {
    insight.textContent  = '⛔ 0% paralelo: el código es completamente serial. Agregar cores no cambia nada — speedup siempre ×1.';
    insight.className    = 'm6simInsight m6simInsightWarn';
  } else if (P >= 0.99 && N >= 32) {
    insight.textContent  = '🚀 Zona óptima: casi todo el código es paralelizable y tenés muchos cores. El overhead de coordinación empieza a importar más que el beneficio.';
    insight.className    = 'm6simInsight m6simInsightGood';
  } else if (efficiency < 25) {
    insight.textContent  = '⚠️ Eficiencia baja (' + Math.round(efficiency) + '%): los ' + N + ' cores no se aprovechan bien. La parte serial del ' + serialPct + '% limita el speedup a ×' + maxS.toFixed(1) + ' teórico.';
    insight.className    = 'm6simInsight m6simInsightWarn';
  } else if (maxS && speedup >= maxS * 0.88) {
    insight.textContent  = '📉 Rendimientos decrecientes: con ' + N + ' cores ya estás al ' + Math.round(speedup / maxS * 100) + '% del límite teórico (×' + maxS.toFixed(1) + '). Más cores no ayudan significativamente.';
    insight.className    = 'm6simInsight m6simInsightWarn';
  } else {
    const gap = maxS ? ' (máx teórico: ×' + maxS.toFixed(1) + ')' : '';
    insight.textContent  = '💡 Speedup ×' + speedup.toFixed(2) + ' con ' + N + ' cores y ' + parallelPct + '% de código paralelo' + gap + '. Eficiencia: ' + Math.round(efficiency) + '%.';
    insight.className    = 'm6simInsight';
  }
}

function drawAmdahlChart(P, N) {
  const svg = document.getElementById('amdahlSvg');
  if (!svg) return;

  const W = 520, H = 270;
  const PAD = { top: 28, right: 28, bottom: 44, left: 52 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top  - PAD.bottom;

  // Y axis max: 20% above theoretical max, capped at 70
  const maxS  = P < 1 ? 1 / (1 - P) : CORES_MAP[CORES_MAP.length - 1];
  const maxY  = Math.min(maxS * 1.25 + 1, 70);

  function xPos(n)  { return PAD.left + (Math.log2(n) / Math.log2(64)) * cW; }
  function yPos(s)  { return PAD.top  + cH - (Math.min(s, maxY) / maxY) * cH; }

  let html = '';

  // Grid lines (horizontal)
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const y   = PAD.top + (i / yTicks) * cH;
    const val = maxY * (1 - i / yTicks);
    html += `<line x1="${PAD.left}" y1="${y.toFixed(1)}" x2="${W - PAD.right}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
    html += `<text x="${PAD.left - 7}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="10" fill="rgba(255,255,255,0.3)">×${val.toFixed(val < 10 ? 1 : 0)}</text>`;
  }

  // X axis ticks & labels
  CORES_MAP.forEach(c => {
    const x = xPos(c);
    html += `<line x1="${x.toFixed(1)}" y1="${PAD.top}" x2="${x.toFixed(1)}" y2="${(PAD.top + cH).toFixed(1)}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>`;
    html += `<text x="${x.toFixed(1)}" y="${(H - PAD.bottom + 16).toFixed(1)}" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.3)">${c}</text>`;
  });

  // Axis labels
  html += `<text x="${(PAD.left + cW / 2).toFixed(1)}" y="${(H - 4).toFixed(1)}" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.35)">Núcleos (N)</text>`;
  html += `<text x="14" y="${(PAD.top + cH / 2).toFixed(1)}" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.35)" transform="rotate(-90,14,${(PAD.top + cH / 2).toFixed(1)})">Speedup</text>`;

  // Ideal linear speedup (dashed grey)
  const linearPts = CORES_MAP.map(c => `${xPos(c).toFixed(1)},${yPos(Math.min(c, maxY)).toFixed(1)}`).join(' ');
  html += `<polyline points="${linearPts}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-dasharray="3,4"/>`;
  html += `<text x="${(W - PAD.right - 4).toFixed(1)}" y="${(yPos(Math.min(64, maxY)) - 5).toFixed(1)}" text-anchor="end" font-size="9" fill="rgba(255,255,255,0.25)">ideal</text>`;

  // Theoretical max line (dashed accent)
  if (P > 0 && P < 1) {
    const yMax = yPos(maxS);
    if (yMax >= PAD.top && yMax <= PAD.top + cH) {
      html += `<line x1="${PAD.left}" y1="${yMax.toFixed(1)}" x2="${(W - PAD.right).toFixed(1)}" y2="${yMax.toFixed(1)}" stroke="rgba(56,189,248,0.3)" stroke-width="1.5" stroke-dasharray="5,4"/>`;
      html += `<text x="${(W - PAD.right - 4).toFixed(1)}" y="${(yMax - 5).toFixed(1)}" text-anchor="end" font-size="9" fill="rgba(56,189,248,0.55)">máx ×${maxS.toFixed(1)}</text>`;
    }
  }

  // Amdahl curve for current P
  const curvePts = CORES_MAP.map(c => `${xPos(c).toFixed(1)},${yPos(amdahlSpeedup(P, c)).toFixed(1)}`).join(' ');
  html += `<polyline points="${curvePts}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;

  // Fill under the curve (subtle)
  const fillPts = CORES_MAP.map(c => `${xPos(c).toFixed(1)},${yPos(amdahlSpeedup(P, c)).toFixed(1)}`).join(' ');
  const baseY = (PAD.top + cH).toFixed(1);
  html += `<polygon points="${xPos(1).toFixed(1)},${baseY} ${fillPts} ${xPos(64).toFixed(1)},${baseY}" fill="rgba(56,189,248,0.07)"/>`;

  // Current point highlight
  const cx = xPos(N);
  const cy = yPos(amdahlSpeedup(P, N));
  html += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="7" fill="#38bdf8" stroke="#fff" stroke-width="2"/>`;
  const labelX = cx > W - PAD.right - 60 ? cx - 8 : cx + 8;
  const anchor = cx > W - PAD.right - 60 ? 'end' : 'start';
  html += `<text x="${labelX.toFixed(1)}" y="${(cy - 10).toFixed(1)}" text-anchor="${anchor}" font-size="12" font-weight="bold" fill="#38bdf8">×${amdahlSpeedup(P, N).toFixed(2)}</text>`;

  svg.innerHTML = html;
}

function drawAmdahlTimeline(P, N) {
  const container = document.getElementById('amdahlTimeline');
  if (!container) return;

  const serial   = 1 - P;
  const parChunk = N > 0 ? P / N : 0;
  const totalT   = serial + parChunk;

  const pct = v => (Math.min(v, 1) * 100).toFixed(2) + '%';

  // Phase header bar
  const phaseHeader = serial > 0.005
    ? `<div class="m6sPhaseBar">
        <div class="m6sPhaseSerial" style="width:${pct(serial)}">⚠ ${Math.round(serial * 100)}% serial — cuello de botella</div>
        <div class="m6sPhaseParallel">${Math.round(P * 100)}% paralelo — todos los cores</div>
      </div>`
    : `<div class="m6sPhaseBar"><div class="m6sPhaseParallel" style="flex:1">100% paralelo — speedup lineal</div></div>`;

  // Core rows
  const displayN = Math.min(N, 8);
  const extra    = N - displayN;
  let rows = '';

  for (let i = 0; i < displayN; i++) {
    const lbl    = i === 0 ? 'Core 0' : `Core ${i}`;
    const isMain = i === 0;
    let blocks   = '';

    if (isMain && serial > 0.001)
      blocks += `<div class="m6tlBlock m6tlSerial" style="left:0;width:${pct(serial)}"></div>`;
    if (!isMain && serial > 0.001) {
      blocks += `<div class="m6tlBlock m6tlIdle" style="left:0;width:${pct(serial)}"></div>`;
      if (i === 1 && serial > 0.08)
        blocks += `<div class="m6sIdleAnno" style="width:${pct(serial)}">⏸ esperando</div>`;
    }
    if (parChunk > 0.001)
      blocks += `<div class="m6tlBlock m6tlParallel" style="left:${pct(serial)};width:${pct(parChunk)}"></div>`;

    blocks += `<div class="m6tlMarker m6tlTotal" style="left:${pct(totalT)}"></div>`;
    blocks += `<div class="m6tlMarker m6tlBaseline" style="left:calc(100% - 1px)"></div>`;

    rows += `<div class="m6tlRow"><div class="m6tlCoreLabel">${lbl}</div><div class="m6tlTrack">${blocks}</div></div>`;
  }

  if (extra > 0) {
    rows += `<div class="m6tlRow">
      <div class="m6tlCoreLabel" style="color:rgba(255,255,255,0.18)">+${extra}</div>
      <div style="flex:1;font-size:10px;color:rgba(255,255,255,0.2);padding:0 8px;line-height:26px">cores adicionales — mismo patrón (idle → paralelo)</div>
    </div>`;
  }

  const serialPct = Math.round(serial * 100);
  const sLbl = serial > 0.02 && parChunk > 0.08
    ? `<span class="m6tlAxisMark" style="left:${pct(serial)};color:rgba(248,113,113,0.7);transform:translateX(-50%)">${serialPct}% serial</span>`
    : '';
  const totalPct  = parseFloat((totalT * 100).toFixed(2));
  const tLblStyle = totalPct > 60
    ? `right:${(100 - totalPct).toFixed(2)}%;transform:translateX(50%)`
    : `left:${totalPct.toFixed(2)}%;transform:translateX(-50%)`;
  const tLbl = `<span class="m6tlAxisMark" style="${tLblStyle};color:#facc15">×${(1/totalT).toFixed(2)} speedup</span>`;

  container.innerHTML = `
    ${phaseHeader}
    <div class="m6tlRows">${rows}</div>
    <div class="m6tlAxisRow">
      <div class="m6tlAxisSpacer"></div>
      <div class="m6tlAxisTrack">
        <span class="m6tlAxisTick" style="left:0">t=0</span>
        ${sLbl}
        ${tLbl}
        <span class="m6tlAxisTick" style="right:0">t=1.0 original</span>
      </div>
    </div>
    <div class="m6tlLegend">
      <div class="m6tlLegItem"><div class="m6tlLegDot m6tlSerial"></div> Serial — 1 core</div>
      <div class="m6tlLegItem"><div class="m6tlLegDot m6tlParallel"></div> Paralelo — N cores</div>
      <div class="m6tlLegItem"><div class="m6tlLegDot m6tlIdle"></div> Inactivo</div>
      <div class="m6tlLegItem"><div class="m6tlLegDot m6tlTotal"></div> Fin paralelo</div>
    </div>`;
}

// Init on load — set default scenario
document.addEventListener('DOMContentLoaded', () => m6setScenario(0));

/* ═══════════════════════════════════════════
   JUEGO: ¿PARALELO O SERIE?
═══════════════════════════════════════════ */
const SCENARIOS = [
  {
    icon: 'ph-image',
    title: 'Galería de 10 millones de fotos',
    desc: 'Tenés 10M de fotos de usuarios para redimensionar a miniatura. Cada foto es completamente independiente — no comparte estado con las demás.',
    answer: 'si',
    explanation: '✅ <strong>SÍ, paralelizá.</strong> Caso ideal: "embarrassingly parallel". Cada foto es completamente independiente → paralelismo perfecto. Speedup casi lineal hasta llenar todos los cores disponibles.'
  },
  {
    icon: 'ph-sort-ascending',
    title: 'Ordenar una lista de 8 nombres',
    desc: 'Necesitás ordenar 8 strings en orden alfabético para mostrarlos en pantalla.',
    answer: 'no',
    explanation: '❌ <strong>NO paralelices.</strong> El trabajo es mínimo (56 comparaciones máximo). El overhead de crear y sincronizar threads supera con creces el costo real del sort. Usá Arrays.sort() directamente.'
  },
  {
    icon: 'ph-trend-up',
    title: 'Secuencia de Fibonacci clásica',
    desc: 'Calculás Fibonacci iterativo: cada F[i] = F[i-1] + F[i-2]. Necesitás los 1000 primeros términos.',
    answer: 'no',
    explanation: '❌ <strong>NO paralelices (con este algoritmo).</strong> Dependencia secuencial estricta: F[i] no puede calcularse sin F[i-1]. Sin rediseño del algoritmo (ej: multiplicación de matrices) no hay paralelismo posible.'
  },
  {
    icon: 'ph-video',
    title: '500 frames de video, cada uno independiente',
    desc: 'Renderizás 500 frames de una animación 3D. Cada frame usa su propio estado y no depende de los demás.',
    answer: 'si',
    explanation: '✅ <strong>SÍ, paralelizá.</strong> Cada frame es una unidad de trabajo independiente → se divide naturalmente entre N cores. Speedup casi lineal. Herramientas como FFmpeg usan exactamente este patrón.'
  },
  {
    icon: 'ph-bank',
    title: 'Debitar el saldo de una cuenta bancaria',
    desc: 'Un cliente confirma un pago: debés restar el monto del saldo. Es una operación atómica sobre un registro único.',
    answer: 'no',
    explanation: '❌ <strong>NO paralelices esta operación.</strong> Es atómica y requiere consistencia estricta. Paralelizarla introduciría condiciones de carrera. El acceso debe ser serializado con locks o transacciones.'
  },
  {
    icon: 'ph-magnifying-glass',
    title: 'Búsqueda del máximo en 100 millones de números',
    desc: 'Tenés un array de 100M de enteros y querés encontrar el valor máximo lo más rápido posible.',
    answer: 'si',
    explanation: '✅ <strong>SÍ, paralelizá.</strong> Divide el array en N chunks → cada thread encuentra su máximo local → reducción final (comparar N valores). El costo de reducción es O(N cores), despreciable vs el beneficio.'
  }
];

let gameIdx   = 0;
let gameScore = 0;
let gameAnswered = false;

function gameRender() {
  const s = SCENARIOS[gameIdx];
  document.getElementById('gameCounter').textContent = `Escenario ${gameIdx + 1} de ${SCENARIOS.length}`;
  document.getElementById('gameScore').textContent   = gameScore;
  document.getElementById('gameIcon').innerHTML      = `<i class="ph-bold ${s.icon}"></i>`;
  document.getElementById('gameTitle').textContent   = s.title;
  document.getElementById('gameDesc').textContent    = s.desc;

  const fb = document.getElementById('gameFeedback');
  const nx = document.getElementById('gameNext');
  fb.style.display = 'none'; nx.style.display = 'none';
  document.querySelectorAll('.m6gameOpt').forEach(o => {
    o.classList.remove('correct', 'wrong', 'disabled');
  });
  gameAnswered = false;
}

function gameAnswer(choice) {
  if (gameAnswered) return;
  gameAnswered = true;
  const s       = SCENARIOS[gameIdx];
  const correct = choice === s.answer;
  if (correct) gameScore++;

  document.getElementById('gameScore').textContent = gameScore;

  // Style buttons
  document.querySelectorAll('.m6gameOpt').forEach(btn => {
    const btnChoice = btn.getAttribute('onclick').includes("'si'") ? 'si' : 'no';
    btn.classList.add('disabled');
    if (btnChoice === s.answer)    btn.classList.add('correct');
    if (btnChoice === choice && !correct) btn.classList.add('wrong');
  });

  // Feedback
  const fb = document.getElementById('gameFeedback');
  fb.innerHTML   = s.explanation;
  fb.className   = 'm6gameFeedback ' + (correct ? 'correct' : 'wrong');
  fb.style.display = 'block';

  // Next / finish
  const nx = document.getElementById('gameNext');
  nx.style.display = 'flex';
  if (gameIdx === SCENARIOS.length - 1) {
    nx.innerHTML = '<i class="ph-bold ph-flag"></i> Ver resultados';
  } else {
    nx.innerHTML = 'Siguiente escenario <i class="ph-bold ph-arrow-right"></i>';
  }
}

function gameNext() {
  if (gameIdx < SCENARIOS.length - 1) {
    gameIdx++;
    gameRender();
  } else {
    // Show result
    document.getElementById('gameCard').style.display   = 'none';
    document.getElementById('gameResult').style.display = 'block';
    document.getElementById('gameResultNum').textContent = `${gameScore} / ${SCENARIOS.length}`;
    const pct  = gameScore / SCENARIOS.length;
    const msgs = [
      'Revisá los conceptos de overhead y dependencias secuenciales. ¡Intentá de nuevo!',
      'Vas bien. Recordá: el overhead de threads y las dependencias secuenciales son los dos grandes enemigos del paralelismo.',
      '¡Muy bien! Entendés cuándo el paralelismo ayuda y cuándo perjudica.',
      '¡Perfecto! Pensás como un compilador paralelo.'
    ];
    const msgIdx = pct < 0.5 ? 0 : pct < 0.67 ? 1 : pct < 1 ? 2 : 3;
    document.getElementById('gameResultMsg').textContent = msgs[msgIdx];
  }
}

function gameRestart() {
  gameIdx = 0; gameScore = 0;
  document.getElementById('gameResult').style.display = 'none';
  document.getElementById('gameCard').style.display   = 'block';
  gameRender();
}

/* ═══════════════════════════════════════════
   QUIZ
═══════════════════════════════════════════ */
const QUIZ = [
  {
    q: '¿Qué predice la Ley de Amdahl?',
    opts: [
      'El tiempo máximo de respuesta de una red bajo carga',
      'El speedup máximo teórico al paralelizar una fracción P del código',
      'La cantidad máxima de threads que soporta la JVM',
      'El consumo energético óptimo de un cluster HPC'
    ],
    a: 1,
    exp: '<strong>Amdahl</strong> define S(N) = 1/((1−P) + P/N). La fracción serial (1−P) es el límite infranqueable: si el 30% del código es serial, el speedup máximo con ∞ cores es solo ×3.3 — sin importar cuántos cores agregues.'
  },
  {
    q: 'Un programa tiene 80% de código paralelizable. ¿Cuál es el speedup máximo posible con cores ilimitados?',
    opts: ['×8.0', '×5.0', '×10.0', '×80.0'],
    a: 1,
    exp: 'Con P = 0.80 y N → ∞: <strong>S = 1/(1−0.80) = 1/0.20 = ×5.0</strong>. No importa cuántos cores agregues — la parte serial (20%) siempre tarda lo mismo y domina el tiempo total.'
  },
  {
    q: 'En la taxonomía de Flynn, ¿qué caracteriza a SIMD?',
    opts: [
      'Un dato procesado por múltiples instrucciones distintas',
      'La misma instrucción aplicada simultáneamente a múltiples datos',
      'Múltiples programas independientes corriendo en paralelo',
      'Una CPU single-core con pipeline profundo'
    ],
    a: 1,
    exp: '<strong>SIMD</strong> (Single Instruction Multiple Data) es el modelo de las GPUs y las instrucciones vectoriales de CPU (AVX, NEON): una sola operación se aplica a N datos en paralelo en el mismo ciclo de clock.'
  },
  {
    q: '¿Qué clase Java extiende una tarea ForkJoin que retorna un resultado?',
    opts: ['Runnable', 'Thread', 'RecursiveTask&lt;V&gt;', 'Callable&lt;V&gt;'],
    a: 2,
    exp: '<strong>RecursiveTask&lt;V&gt;</strong> (java.util.concurrent) es la clase base para tareas divide-y-vencerás que retornan un valor. Si la tarea no retorna nada (operación in-place), se usa RecursiveAction.'
  },
  {
    q: '¿En qué situación el paralelismo puede empeorar el rendimiento respecto a la versión secuencial?',
    opts: [
      'Cuando hay más de 8 núcleos disponibles',
      'Cuando el overhead de crear/sincronizar threads supera el beneficio del trabajo paralelo',
      'Cuando el programa está escrito en Java en vez de C++',
      'Cuando el sistema operativo es Linux'
    ],
    a: 1,
    exp: 'El <strong>overhead</strong> de creación de threads, context switch y sincronización tiene costo fijo. Para tareas pequeñas (sort de 5 elementos, suma de 10 números), ese costo supera la ganancia. Por eso ForkJoin usa un UMBRAL mínimo.'
  },
  {
    q: 'P = 50%, N = 4 cores. ¿Cuál es el speedup según Amdahl?',
    opts: ['×4.0', '×1.6', '×2.0', '×3.0'],
    a: 1,
    exp: 'S = 1/((1−0.5) + 0.5/4) = 1/(0.5 + 0.125) = <strong>1/0.625 = ×1.6</strong>. Con solo el 50% paralelizable, 4 cores dan solo ×1.6 — lejos del ×4 ideal. Esto ilustra perfectamente el muro serial.'
  },
  {
    q: '¿Qué tipo de paralelismo usa una GPU al procesar píxeles de una imagen?',
    opts: ['MIMD', 'SISD', 'SIMD', 'MISD'],
    a: 2,
    exp: 'Las GPUs son el ejemplo canónico de <strong>SIMD</strong>: aplican la misma operación (transformación de color, filtro) a miles de píxeles simultáneamente usando miles de cores simples que ejecutan la misma instrucción.'
  },
  {
    q: '¿Qué mide la "eficiencia" en el contexto de sistemas paralelos?',
    opts: [
      'El porcentaje de código paralelizable (P)',
      'Speedup / N — qué fracción de los cores se aprovecha realmente',
      'La cantidad de threads activos en el ForkJoinPool',
      'El tiempo de comunicación entre cores'
    ],
    a: 1,
    exp: '<strong>Eficiencia = Speedup / N</strong>. Con 8 cores y speedup ×4, la eficiencia es 4/8 = 50% — solo aprovechamos la mitad del hardware. El ideal es 100% (speedup = N). La eficiencia baja indica overhead o parte serial dominante.'
  }
];

let quizIdx   = 0;
let quizScore = 0;
let quizAnswered = false;

function quizRender() {
  const q   = QUIZ[quizIdx];
  const pct = ((quizIdx + 1) / QUIZ.length * 100).toFixed(0);
  document.getElementById('quizProgressBar').style.width = pct + '%';
  document.getElementById('quizProgressLabel').textContent = `Pregunta ${quizIdx + 1} de ${QUIZ.length}`;
  document.getElementById('quizQuestion').textContent = q.q;

  const optsEl = document.getElementById('quizOptions');
  optsEl.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'm6quizOpt';
    btn.innerHTML = opt;
    btn.onclick = () => quizAnswer(i);
    optsEl.appendChild(btn);
  });

  document.getElementById('quizFeedback').style.display = 'none';
  document.getElementById('quizNextBtn').style.display  = 'none';
  quizAnswered = false;
}

function quizAnswer(chosen) {
  if (quizAnswered) return;
  quizAnswered = true;
  const q = QUIZ[quizIdx];
  const correct = chosen === q.a;
  if (correct) quizScore++;

  document.querySelectorAll('.m6quizOpt').forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === q.a) btn.classList.add('correct');
    if (i === chosen && !correct) btn.classList.add('wrong');
  });

  const fb = document.getElementById('quizFeedback');
  fb.innerHTML = (correct ? '✅ ' : '❌ ') + q.exp;
  fb.className = 'm6quizFeedback ' + (correct ? 'correct' : 'wrong');
  fb.style.display = 'block';

  const nx = document.getElementById('quizNextBtn');
  nx.style.display = 'flex';
  nx.textContent   = quizIdx < QUIZ.length - 1 ? 'Siguiente' : 'Ver resultados';
  if (quizIdx === QUIZ.length - 1) nx.innerHTML += ' <i class="ph-bold ph-flag"></i>';
  else nx.innerHTML += ' <i class="ph-bold ph-arrow-right"></i>';
}

function quizNext() {
  if (quizIdx < QUIZ.length - 1) {
    quizIdx++;
    quizRender();
  } else {
    document.getElementById('quizWrap')   && (document.getElementById('quizQuestion').style.display = 'none');
    document.getElementById('quizOptions').style.display  = 'none';
    document.getElementById('quizFeedback').style.display = 'none';
    document.getElementById('quizNextBtn').style.display  = 'none';
    document.getElementById('quizProgressLabel').style.display = 'none';
    const res = document.getElementById('quizResult');
    res.style.display = 'block';
    document.getElementById('quizResultNum').textContent = `${quizScore} / ${QUIZ.length}`;
    const pct = quizScore / QUIZ.length;
    const msgs = [
      'Repasá la Ley de Amdahl y la taxonomía de Flynn. ¡Vas a poder!',
      'Bien encaminado. Revisá los conceptos de eficiencia y overhead.',
      '¡Muy bien! Dominás los conceptos centrales del módulo.',
      '¡Perfecto! Entendés el paralelismo como un profesional.'
    ];
    document.getElementById('quizResultMsg').textContent = msgs[pct < 0.5 ? 0 : pct < 0.75 ? 1 : pct < 1 ? 2 : 3];
  }
}

function quizRestart() {
  quizIdx = 0; quizScore = 0;
  document.getElementById('quizResult').style.display   = 'none';
  document.getElementById('quizQuestion').style.display = 'block';
  document.getElementById('quizOptions').style.display  = 'flex';
  document.getElementById('quizProgressLabel').style.display = 'block';
  quizRender();
}

/* ─── Init ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  gameRender();
  quizRender();
  updateAmdahl();
  if (window.Prism) Prism.highlightAll();
  cmpReset();
  streamReset();
  lbReset();
});

/* ═══════════════════════════════════════════
   COMPARADOR VISUAL: SECUENCIAL vs PARALELO
═══════════════════════════════════════════ */
const CMP_TASKS = [
  { label: 'Frame A', units: 6 },
  { label: 'Frame B', units: 4 },
  { label: 'Frame C', units: 8 },
  { label: 'Frame D', units: 3 },
  { label: 'Frame E', units: 7 },
  { label: 'Frame F', units: 5 },
  { label: 'Frame G', units: 6 },
  { label: 'Frame H', units: 4 }
];
const CMP_UNIT_MS  = 120; // each work unit = 120ms animation
const CMP_INTERVAL =  50; // refresh every 50ms

let cmpWorkers    = 2;
let cmpRunning    = false;
let cmpIntervalId = null;

function cmpBuildHTML(prefix, isPar) {
  return CMP_TASKS.map((t, i) =>
    `<div class="m6cmpTask" id="${prefix}${i}">` +
      `<div class="m6cmpTaskLbl">${t.label}</div>` +
      `<div class="m6cmpTaskBarWrap">` +
        `<div class="m6cmpTaskBar${isPar ? ' par' : ''}" id="${prefix}${i}Bar"></div>` +
      `</div>` +
    `</div>`
  ).join('');
}

function cmpSetWorkers(n, btn) {
  if (cmpRunning) return;
  cmpWorkers = n;
  document.querySelectorAll('.m6cmpWBtn').forEach(b => b.classList.remove('m6cmpWBtnActive'));
  btn.classList.add('m6cmpWBtnActive');
  document.getElementById('cmpParWorkerLbl').textContent = n + ' workers';
  cmpReset();
}

function cmpReset() {
  cmpRunning = false;
  if (cmpIntervalId) { clearInterval(cmpIntervalId); cmpIntervalId = null; }

  const seqEl = document.getElementById('cmpSeqTasks');
  const parEl = document.getElementById('cmpParTasks');
  if (seqEl) seqEl.innerHTML = cmpBuildHTML('cmpSeq', false);
  if (parEl) parEl.innerHTML = cmpBuildHTML('cmpPar', true);

  const seqTime = document.getElementById('cmpSeqTime');
  const parTime = document.getElementById('cmpParTime');
  if (seqTime) seqTime.textContent = '0.0s';
  if (parTime) parTime.textContent = '0.0s';

  const speedup = document.getElementById('cmpSpeedup');
  if (speedup) speedup.style.display = 'none';

  const btn = document.getElementById('cmpPlayBtn');
  if (btn) { btn.innerHTML = '<i class="ph-bold ph-play"></i> Iniciar'; btn.disabled = false; }
}

function cmpPlay() {
  if (cmpRunning) return;
  cmpRunning = true;

  const seqEl = document.getElementById('cmpSeqTasks');
  const parEl = document.getElementById('cmpParTasks');
  if (seqEl) seqEl.innerHTML = cmpBuildHTML('cmpSeq', false);
  if (parEl) parEl.innerHTML = cmpBuildHTML('cmpPar', true);
  document.getElementById('cmpSeqTime').textContent = '0.0s';
  document.getElementById('cmpParTime').textContent = '0.0s';
  document.getElementById('cmpSpeedup').style.display = 'none';

  const btn = document.getElementById('cmpPlayBtn');
  if (btn) { btn.innerHTML = '<i class="ph-bold ph-hourglass"></i> Corriendo...'; btn.disabled = true; }

  // Sequential state
  const seqProgress = new Array(CMP_TASKS.length).fill(0);
  let seqCur = 0;
  let seqDone = false;
  let seqEndTime = 0;

  // Parallel state
  const parProgress  = new Array(CMP_TASKS.length).fill(0);
  const parTaskDone  = new Array(CMP_TASKS.length).fill(false);
  const workerTask   = new Array(cmpWorkers).fill(-1);
  const parQueue     = CMP_TASKS.map((_, i) => i);
  for (let w = 0; w < cmpWorkers && parQueue.length > 0; w++) {
    workerTask[w] = parQueue.shift();
  }
  let parDone = false;
  let parEndTime = 0;

  const t0 = Date.now();

  function onBothDone() {
    clearInterval(cmpIntervalId);
    cmpIntervalId = null;
    cmpRunning = false;
    const pb = document.getElementById('cmpPlayBtn');
    if (pb) { pb.innerHTML = '<i class="ph-bold ph-play"></i> Iniciar'; pb.disabled = false; }

    const speedup = (seqEndTime / Math.max(parEndTime, 0.01)).toFixed(2);
    const pct     = Math.round((1 - parEndTime / seqEndTime) * 100);
    document.getElementById('cmpSpeedupVal').textContent = '×' + speedup;
    document.getElementById('cmpSpeedupX').textContent   = pct + '%';
    document.getElementById('cmpSpeedup').style.display  = 'flex';
  }

  cmpIntervalId = setInterval(() => {
    const elapsed = (Date.now() - t0) / 1000;

    // ── Sequential side ──
    if (!seqDone) {
      document.getElementById('cmpSeqTime').textContent = elapsed.toFixed(1) + 's';
      if (seqCur < CMP_TASKS.length) {
        const incr = CMP_INTERVAL / (CMP_UNIT_MS * CMP_TASKS[seqCur].units);
        seqProgress[seqCur] = Math.min(seqProgress[seqCur] + incr, 1);
        const bar = document.getElementById('cmpSeq' + seqCur + 'Bar');
        if (bar) bar.style.width = (seqProgress[seqCur] * 100).toFixed(1) + '%';
        if (seqProgress[seqCur] >= 1) {
          if (bar) bar.classList.add('done-seq');
          seqCur++;
        }
      } else {
        seqDone = true;
        seqEndTime = elapsed;
        if (parDone) onBothDone();
      }
    }

    // ── Parallel side ──
    if (!parDone) {
      document.getElementById('cmpParTime').textContent = elapsed.toFixed(1) + 's';
      for (let w = 0; w < cmpWorkers; w++) {
        const fi = workerTask[w];
        if (fi === -1 || parTaskDone[fi]) continue;
        const incr = CMP_INTERVAL / (CMP_UNIT_MS * CMP_TASKS[fi].units);
        parProgress[fi] = Math.min(parProgress[fi] + incr, 1);
        const bar = document.getElementById('cmpPar' + fi + 'Bar');
        if (bar) bar.style.width = (parProgress[fi] * 100).toFixed(1) + '%';
        if (parProgress[fi] >= 1) {
          parTaskDone[fi] = true;
          if (bar) bar.classList.add('done-par');
          workerTask[w] = parQueue.length > 0 ? parQueue.shift() : -1;
        }
      }
      if (parTaskDone.every(d => d)) {
        parDone = true;
        parEndTime = elapsed;
        if (seqDone) onBothDone();
      }
    }
  }, CMP_INTERVAL);
}

/* ═══════════════════════════════════════════
   SIMULADOR STREAMING: ENCODING DE VIDEO
═══════════════════════════════════════════ */
const STREAM_FRAMES = [
  { id: 'F01', type: 'I', ticks: 3 },
  { id: 'F02', type: 'P', ticks: 1 },
  { id: 'F03', type: 'P', ticks: 1 },
  { id: 'F04', type: 'B', ticks: 2 },
  { id: 'F05', type: 'P', ticks: 1 },
  { id: 'F06', type: 'I', ticks: 3 },
  { id: 'F07', type: 'P', ticks: 1 },
  { id: 'F08', type: 'B', ticks: 2 },
  { id: 'F09', type: 'P', ticks: 1 },
  { id: 'F10', type: 'I', ticks: 3 },
  { id: 'F11', type: 'P', ticks: 1 },
  { id: 'F12', type: 'B', ticks: 2 }
];
const STREAM_UNIT_MS  = 250;
const STREAM_INTERVAL =  50;

let streamMode         = 'seq';
let streamWorkerCount  = 4;
let streamRunning      = false;
let streamIntervalId   = null;
let streamSeqBaseline  = null; // measured sequential time

function streamSetMode(mode, btn) {
  if (streamRunning) return;
  streamMode = mode;
  document.querySelectorAll('.m6streamModeBtn').forEach(b => b.classList.remove('m6streamModeBtnActive'));
  btn.classList.add('m6streamModeBtnActive');
  const wsel = document.getElementById('streamWorkerSel');
  if (wsel) wsel.style.display = mode === 'par' ? 'flex' : 'none';
  streamReset();
}

function streamSetWorkers(n, btn) {
  if (streamRunning) return;
  streamWorkerCount = n;
  document.querySelectorAll('.m6streamWBtn').forEach(b => b.classList.remove('m6streamWBtnActive'));
  btn.classList.add('m6streamWBtnActive');
  streamReset();
}

function streamBuildInit() {
  const framesEl = document.getElementById('streamFrames');
  if (framesEl) {
    framesEl.innerHTML = STREAM_FRAMES.map((f, i) =>
      `<div class="m6sFrame" id="sf${i}">` +
        `<div style="font-size:9px;font-weight:800;opacity:0.55;line-height:1">${f.type}</div>` +
        `<div style="font-size:13px;font-weight:900;line-height:1">${f.id}</div>` +
        `<div class="m6sFrameProgress" id="sfp${i}"></div>` +
      `</div>`
    ).join('');
  }

  const wCount    = streamMode === 'seq' ? 1 : streamWorkerCount;
  const workersEl = document.getElementById('streamWorkers');
  if (workersEl) {
    workersEl.innerHTML = Array.from({ length: wCount }, (_, w) =>
      `<div class="m6sWorker" id="sw${w}">` +
        `<div class="m6sWorkerLbl">W${w + 1}</div>` +
        `<div class="m6sWorkerFrame" id="swf${w}">—</div>` +
        `<div class="m6sWorkerBarWrap"><div class="m6sWorkerBar" id="swb${w}"></div></div>` +
        `<div class="m6sWorkerPct" id="swp${w}">0%</div>` +
      `</div>`
    ).join('');
  }

  const stTime = document.getElementById('streamTime');
  const stDone = document.getElementById('streamDone');
  const stSpd  = document.getElementById('streamSpeedup');
  if (stTime) stTime.textContent = '0.0s';
  if (stDone) stDone.textContent = '0 / ' + STREAM_FRAMES.length;
  if (stSpd)  stSpd.textContent  = '—';
}

function streamReset() {
  if (streamIntervalId) { clearInterval(streamIntervalId); streamIntervalId = null; }
  streamRunning = false;
  streamBuildInit();
  const btn = document.getElementById('streamPlayBtn');
  if (btn) { btn.innerHTML = '<i class="ph-bold ph-play"></i> Iniciar encoding'; btn.disabled = false; }
}

function streamToggle() {
  if (streamRunning) { streamReset(); return; }

  streamRunning = true;
  streamBuildInit();

  const btn = document.getElementById('streamPlayBtn');
  if (btn) { btn.innerHTML = '<i class="ph-bold ph-stop"></i> Detener'; }

  const wCount   = streamMode === 'seq' ? 1 : streamWorkerCount;
  const queue    = STREAM_FRAMES.map((_, i) => i);
  const frameDone = new Array(STREAM_FRAMES.length).fill(false);

  // Workers: which frame index each is processing, and when it started
  const workers = Array.from({ length: wCount }, () => ({ fi: -1, startMs: 0 }));
  const now0 = Date.now();
  for (let w = 0; w < wCount && queue.length > 0; w++) {
    workers[w] = { fi: queue.shift(), startMs: now0 };
  }
  let doneCount = 0;

  streamIntervalId = setInterval(() => {
    const now     = Date.now();
    const elapsed = (now - now0) / 1000;
    const stTime  = document.getElementById('streamTime');
    if (stTime) stTime.textContent = elapsed.toFixed(1) + 's';

    for (let w = 0; w < wCount; w++) {
      const wk = workers[w];
      const swfEl = document.getElementById('swf' + w);
      const swbEl = document.getElementById('swb' + w);
      const swpEl = document.getElementById('swp' + w);

      if (wk.fi === -1) {
        if (swfEl) swfEl.textContent = '—';
        if (swbEl) swbEl.style.width = '0%';
        if (swpEl) swpEl.textContent = 'idle';
        continue;
      }

      const frame    = STREAM_FRAMES[wk.fi];
      const durMs    = frame.ticks * STREAM_UNIT_MS;
      const progress = Math.min((now - wk.startMs) / durMs, 1);

      const sfEl  = document.getElementById('sf' + wk.fi);
      const sfpEl = document.getElementById('sfp' + wk.fi);
      if (sfEl && !frameDone[wk.fi]) sfEl.classList.add('sf-active');
      if (sfpEl && !frameDone[wk.fi]) sfpEl.style.width = (progress * 100).toFixed(1) + '%';

      if (swfEl) swfEl.textContent = frame.id;
      if (swbEl) swbEl.style.width = (progress * 100).toFixed(1) + '%';
      if (swpEl) swpEl.textContent = Math.round(progress * 100) + '%';

      if (progress >= 1 && !frameDone[wk.fi]) {
        frameDone[wk.fi] = true;
        doneCount++;
        if (sfEl)  { sfEl.classList.remove('sf-active'); sfEl.classList.add('sf-done'); }
        if (sfpEl) sfpEl.style.width = '100%';

        const stDone = document.getElementById('streamDone');
        if (stDone) stDone.textContent = doneCount + ' / ' + STREAM_FRAMES.length;

        wk.fi = queue.length > 0 ? queue.shift() : -1;
        if (wk.fi !== -1) wk.startMs = now;
      }
    }

    if (doneCount >= STREAM_FRAMES.length) {
      clearInterval(streamIntervalId);
      streamIntervalId = null;
      streamRunning    = false;

      const pbtn = document.getElementById('streamPlayBtn');
      if (pbtn) { pbtn.innerHTML = '<i class="ph-bold ph-play"></i> Iniciar encoding'; pbtn.disabled = false; }

      const stSpd = document.getElementById('streamSpeedup');
      if (streamMode === 'seq') {
        streamSeqBaseline = elapsed;
        if (stSpd) stSpd.textContent = '×1.0';
      } else if (streamSeqBaseline) {
        if (stSpd) stSpd.textContent = '×' + (streamSeqBaseline / elapsed).toFixed(2);
      } else {
        const seqEst = STREAM_FRAMES.reduce((s, f) => s + f.ticks * STREAM_UNIT_MS, 0) / 1000;
        if (stSpd) stSpd.textContent = '×' + (seqEst / elapsed).toFixed(2) + ' (est.)';
      }
    }
  }, STREAM_INTERVAL);
}

/* ═══════════════════════════════════════════
   JUEGO 2: BALANCEO DE CARGA
═══════════════════════════════════════════ */
const LB_FRAMES_DATA = [
  { id: 1, w: 8 },
  { id: 2, w: 5 },
  { id: 3, w: 7 },
  { id: 4, w: 4 },
  { id: 5, w: 6 },
  { id: 6, w: 5 },
  { id: 7, w: 3 },
  { id: 8, w: 4 },
  { id: 9, w: 2 }
];
// Optimal distribution: W1=[8,4,3]=15, W2=[7,5,2]=14, W3=[6,5,4]=15 → makespan=15
const LB_OPTIMAL    = 15;
const LB_NUM_WORKERS = 3;

let lbSelected    = null;
let lbAssignments = [[], [], []];
let lbAssigned    = new Array(LB_FRAMES_DATA.length).fill(false);

function lbRenderFrames() {
  const grid = document.getElementById('lbFrameGrid');
  if (!grid) return;
  grid.innerHTML = LB_FRAMES_DATA.map((f, i) => {
    let cls = 'm6lbFrame';
    if (lbSelected === i) cls += ' lb-selected';
    if (lbAssigned[i])    cls += ' lb-assigned';
    return `<div class="${cls}" id="lbf${i}" onclick="lbSelectFrame(${i})">` +
             `<div class="m6lbFrameWeight">${f.w}s</div>` +
             `<div style="font-size:9px;opacity:0.55">F${String(f.id).padStart(2, '0')}</div>` +
           `</div>`;
  }).join('');
}

function lbRenderWorkers() {
  const grid = document.getElementById('lbWorkerGrid');
  if (!grid) return;

  const totals = lbAssignments.map(arr => arr.reduce((s, fi) => s + LB_FRAMES_DATA[fi].w, 0));
  const maxTotal = Math.max(...totals, LB_OPTIMAL);

  grid.innerHTML = lbAssignments.map((frames, w) => {
    const total   = totals[w];
    const pct     = (total / maxTotal) * 100;
    const isHeavy = total > LB_OPTIMAL;
    const items   = frames.map(fi =>
      `<div class="m6lbWorkerItem">${LB_FRAMES_DATA[fi].w}s</div>`
    ).join('');

    return `<div class="m6lbWorker" id="lbw${w}" onclick="lbAssignToWorker(${w})">` +
             `<div class="m6lbWorkerHead">` +
               `<div class="m6lbWorkerName">W${w + 1}</div>` +
               `<div class="m6lbWorkerTotal${isHeavy ? ' lb-heavy' : ''}">${total}s</div>` +
             `</div>` +
             `<div class="m6lbWorkerItems">${items}</div>` +
             `<div class="m6lbWorkerBarWrap">` +
               `<div class="m6lbWorkerBar${isHeavy ? ' lb-heavy-bar' : ''}" style="width:${pct.toFixed(1)}%"></div>` +
             `</div>` +
           `</div>`;
  }).join('');
}

function lbReset() {
  lbSelected    = null;
  lbAssignments = [[], [], []];
  lbAssigned    = new Array(LB_FRAMES_DATA.length).fill(false);
  const res = document.getElementById('lbResult');
  if (res) res.style.display = 'none';
  lbRenderFrames();
  lbRenderWorkers();
}

function lbSelectFrame(idx) {
  if (lbAssigned[idx]) return;
  lbSelected = lbSelected === idx ? null : idx;
  lbRenderFrames();
}

function lbAssignToWorker(workerIdx) {
  if (lbSelected === null) return;
  lbAssignments[workerIdx].push(lbSelected);
  lbAssigned[lbSelected] = true;
  lbSelected = null;
  lbRenderFrames();
  lbRenderWorkers();
  if (lbAssigned.every(a => a)) lbShowResult();
}

function lbShowResult() {
  const totals   = lbAssignments.map(arr => arr.reduce((s, fi) => s + LB_FRAMES_DATA[fi].w, 0));
  const makespan = Math.max(...totals);
  const diff     = makespan - LB_OPTIMAL;
  const score    = diff === 0 ? 100 : diff <= 1 ? 85 : diff <= 3 ? 65 : diff <= 5 ? 45 : 25;

  const msgs = [
    `🏆 ¡ÓPTIMO PERFECTO! Makespan = ${makespan}s. Encontraste la distribución ideal. Esto equivale a un algoritmo de scheduling perfecto — algo NP-hard de resolver en general.`,
    `👍 ¡Casi perfecto! Makespan = ${makespan}s (${diff}s sobre el óptimo de ${LB_OPTIMAL}s). El algoritmo LPT (Longest Processing Time First) suele dar resultados así de buenos.`,
    `💡 Makespan = ${makespan}s. El óptimo es ${LB_OPTIMAL}s. Pista: intentá asignar los frames más pesados primero, distribuyéndolos entre los workers más libres (heurística LPT).`,
    `⚠️ Makespan = ${makespan}s — hay bastante margen de mejora. El óptimo es ${LB_OPTIMAL}s. Heurística: asigná el frame más pesado al worker con menos carga acumulada.`
  ];
  const msgIdx = diff === 0 ? 0 : diff <= 1 ? 1 : diff <= 4 ? 2 : 3;

  document.getElementById('lbYourTime').textContent = makespan + 's';
  document.getElementById('lbOptTime').textContent  = LB_OPTIMAL + 's';
  document.getElementById('lbScore').textContent    = score + '/100';
  document.getElementById('lbResultMsg').textContent = msgs[msgIdx];
  document.getElementById('lbResult').style.display  = 'block';
}
