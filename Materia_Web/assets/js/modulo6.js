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

// Init on load
document.addEventListener('DOMContentLoaded', () => updateAmdahl());

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
});
