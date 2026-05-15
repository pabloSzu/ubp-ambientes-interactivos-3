/* ═══════════════════════════════════════════
   PAI3 · Módulo 7 · HPC, GPU & Cloud
   Accent: #a3e635
═══════════════════════════════════════════ */

(function () {
  const R = document.documentElement.style;
  R.setProperty('--accent',        '#a3e635');
  R.setProperty('--accent-sub',    'rgba(163,230,53,0.13)');
  R.setProperty('--accent-border', 'rgba(163,230,53,0.38)');
  R.setProperty('--accent-mid',    'rgba(163,230,53,0.55)');
})();

/* ═══════════════════════════════════════════
   CANVAS HERO — node network
═══════════════════════════════════════════ */
function initHeroCanvas() {
  const canvas = document.getElementById('m7Canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeNodes(n) {
    return Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 2 + 1.5,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const now = Date.now() * 0.001;

    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      n.pulse += 0.03;
    });

    const LINK = 140;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          const alpha = (1 - d / LINK) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(163,230,53,${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      const glow = 0.55 + 0.45 * Math.sin(n.pulse);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * glow, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(163,230,53,${0.4 + 0.4 * glow})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * glow * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(163,230,53,${0.06 * glow})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  nodes = makeNodes(55);
  draw();
  window.addEventListener('resize', () => { resize(); nodes = makeNodes(55); });
}

/* ═══════════════════════════════════════════
   COUNTERS
═══════════════════════════════════════════ */
function animateCounter(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = Date.now();
  function tick() {
    const progress = Math.min((Date.now() - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString('es-AR');
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString('es-AR');
  }
  tick();
}

/* ═══════════════════════════════════════════
   GPU CORE GRID (hardware card visual)
═══════════════════════════════════════════ */
function initGpuGrid() {
  const grid = document.getElementById('hwGpuGrid');
  if (!grid) return;
  const cols = 8;
  const rows = 5;
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  for (let i = 0; i < cols * rows; i++) {
    const dot = document.createElement('div');
    dot.className = 'm7hwGpuDot';
    dot.style.animationDelay = `${(Math.random() * 2).toFixed(2)}s`;
    grid.appendChild(dot);
  }
}

/* ═══════════════════════════════════════════
   GUSTAFSON / AMDAHL DUAL SIMULATOR
═══════════════════════════════════════════ */
const CORES_MAP = [1, 2, 4, 8, 16, 32, 64];

function updateGustafson() {
  const P  = parseInt(document.getElementById('gP').value) / 100;
  const ni = parseInt(document.getElementById('gN').value);
  const N  = CORES_MAP[ni];

  document.getElementById('gPLabel').textContent = `${Math.round(P * 100)}%`;
  document.getElementById('gNLabel').textContent = N;

  const amdahlSpeedup   = 1 / ((1 - P) + P / N);
  const amdahlMax       = P < 1 ? 1 / (1 - P) : Infinity;
  const gustafsonSpeedup = N - (1 - P) * (N - 1);

  document.getElementById('amdahlSpeedup7').textContent  = `×${amdahlSpeedup.toFixed(2)}`;
  document.getElementById('amdahlMax7').textContent       = isFinite(amdahlMax) ? `×${amdahlMax.toFixed(1)}` : '×∞';
  document.getElementById('gustafsonSpeedup').textContent = `×${gustafsonSpeedup.toFixed(2)}`;
  document.getElementById('gustafsonGrowth').textContent  = gustafsonSpeedup >= N * 0.9 ? 'casi lineal' : 'sub-lineal';

  drawAmdahlChart7(P, N);
  drawGustafsonChart(P, N);

  const diff = gustafsonSpeedup - amdahlSpeedup;
  const insight = document.getElementById('gInsight');
  if (N === 1) {
    insight.textContent = '💡 Con 1 core, ambas leyes dan speedup ×1. Aumentá los núcleos para ver la diferencia.';
  } else if (P < 0.5) {
    insight.textContent = `⚠️ Con solo ${Math.round(P * 100)}% paralelo, ninguna ley escala bien. El cuello de botella serial domina. Gustafson da ×${gustafsonSpeedup.toFixed(1)} vs Amdahl ×${amdahlSpeedup.toFixed(1)} — diferencia de ${diff.toFixed(1)}×.`;
  } else if (diff > 5) {
    insight.textContent = `✅ Con ${N} cores y ${Math.round(P * 100)}% paralelo, Gustafson predice ×${gustafsonSpeedup.toFixed(1)} vs el techo de Amdahl en ×${amdahlMax.toFixed(1)}. La diferencia (${diff.toFixed(1)}×) es el beneficio de escalar el problema en lugar de mantenerlo fijo — la clave del HPC real.`;
  } else {
    insight.textContent = `Con ${N} cores y ${Math.round(P * 100)}% paralelo: Amdahl predice ×${amdahlSpeedup.toFixed(2)}, Gustafson predice ×${gustafsonSpeedup.toFixed(2)}. La brecha se agranda cuando P es alto y N es grande — ahí el HPC muestra todo su potencial.`;
  }
}

function drawAmdahlChart7(P, currentN) {
  const svg = document.getElementById('amdahlSvg7');
  if (!svg) return;
  const W = 420, H = 220;
  const pad = { t: 20, r: 20, b: 30, l: 40 };
  const maxN = 64, maxS = Math.min(P < 1 ? 1 / (1 - P) : 20, 20);

  const pts = CORES_MAP.map(n => {
    const s = 1 / ((1 - P) + P / n);
    const x = pad.l + ((n - 1) / (maxN - 1)) * (W - pad.l - pad.r);
    const y = H - pad.b - (Math.min(s, maxS) / maxS) * (H - pad.t - pad.b);
    return [x, y, n, s];
  });

  const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const areaD = `${lineD} L${pts[pts.length-1][0]},${H-pad.b} L${pts[0][0]},${H-pad.b} Z`;

  const curIdx = CORES_MAP.indexOf(currentN);
  const curX = pts[curIdx] ? pts[curIdx][0] : 0;
  const curY = pts[curIdx] ? pts[curIdx][1] : 0;

  svg.innerHTML = `
    <defs>
      <linearGradient id="am7grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ef4444" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <line x1="${pad.l}" y1="${H-pad.b}" x2="${W-pad.r}" y2="${H-pad.b}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${H-pad.b}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <path d="${areaD}" fill="url(#am7grad)"/>
    <path d="${lineD}" stroke="#ef4444" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${curX}" cy="${curY}" r="5" fill="#ef4444" stroke="#06080f" stroke-width="2"/>
    <text x="${pad.l-4}" y="${H-pad.b+14}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">1</text>
    <text x="${W-pad.r}" y="${H-pad.b+14}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">64</text>
    <text x="${pad.l-6}" y="${pad.t+4}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">${maxS.toFixed(0)}×</text>
    <text x="${pad.l-6}" y="${H-pad.b}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">1×</text>
  `;
}

function drawGustafsonChart(P, currentN) {
  const svg = document.getElementById('gustafsonSvg');
  if (!svg) return;
  const W = 420, H = 220;
  const pad = { t: 20, r: 20, b: 30, l: 40 };
  const maxN = 64;
  const maxS = CORES_MAP[CORES_MAP.length - 1] - (1 - P) * (CORES_MAP[CORES_MAP.length - 1] - 1);
  const displayMax = Math.max(maxS, 10);

  const pts = CORES_MAP.map(n => {
    const s = n - (1 - P) * (n - 1);
    const x = pad.l + ((n - 1) / (maxN - 1)) * (W - pad.l - pad.r);
    const y = H - pad.b - (Math.min(s, displayMax) / displayMax) * (H - pad.t - pad.b);
    return [x, y, n, s];
  });

  const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const areaD = `${lineD} L${pts[pts.length-1][0]},${H-pad.b} L${pts[0][0]},${H-pad.b} Z`;
  const linN  = CORES_MAP.map(n => {
    const x = pad.l + ((n - 1) / (maxN - 1)) * (W - pad.l - pad.r);
    const y = H - pad.b - (n / displayMax) * (H - pad.t - pad.b);
    return `${x},${y}`;
  }).join(' ');

  const curIdx = CORES_MAP.indexOf(currentN);
  const curX = pts[curIdx] ? pts[curIdx][0] : 0;
  const curY = pts[curIdx] ? pts[curIdx][1] : 0;

  svg.innerHTML = `
    <defs>
      <linearGradient id="gu7grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#a3e635" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#a3e635" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <line x1="${pad.l}" y1="${H-pad.b}" x2="${W-pad.r}" y2="${H-pad.b}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${H-pad.b}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <polyline points="${linN}" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="none" stroke-dasharray="4 3"/>
    <path d="${areaD}" fill="url(#gu7grad)"/>
    <path d="${lineD}" stroke="#a3e635" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${curX}" cy="${curY}" r="5" fill="#a3e635" stroke="#06080f" stroke-width="2"/>
    <text x="${pad.l-4}" y="${H-pad.b+14}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">1</text>
    <text x="${W-pad.r}" y="${H-pad.b+14}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">64</text>
    <text x="${pad.l-6}" y="${pad.t+4}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">${displayMax.toFixed(0)}×</text>
    <text x="${pad.l-6}" y="${H-pad.b}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">1×</text>
  `;
}

/* ═══════════════════════════════════════════
   CPU vs GPU RACE
═══════════════════════════════════════════ */
const RACE_TASKS = {
  simple: {
    label: 'Simple masiva',
    cpuCores: 8, gpuCores: 64,
    cpuMs: 4800, gpuMs: 520,
    winner: 'gpu',
    explain: '🎮 Para operaciones uniformes sobre millones de datos (renderizado, filtros de imagen, ML), la GPU aplasta a la CPU. Sus 64 cores (simplificado de los 14K reales) trabajan todos en paralelo — la misma operación en todos los elementos simultáneamente. La CPU gasta ciclos en control flow; la GPU los gasta en cómputo.',
  },
  complex: {
    label: 'Compleja / dependencias',
    cpuCores: 8, gpuCores: 64,
    cpuMs: 1200, gpuMs: 3800,
    winner: 'cpu',
    explain: '🧠 Para lógica compleja con mucho branching (if/else, graph traversal, árbol de decisiones), la CPU gana. La GPU sufre "warp divergence": cuando threads del mismo warp toman ramas diferentes, los threads idle esperan. Una CPU puede ejecutar código complejo sin penalización de divergencia y su cache L1/L2 enorme reduce los accesos a memoria.',
  },
};

let raceTask  = 'simple';
let raceInterval = null;
let raceCpuDone  = false;
let raceGpuDone  = false;
let raceStart    = 0;

function raceSetTask(mode, btn) {
  raceTask = mode;
  document.querySelectorAll('.m7raceTaskBtn').forEach(b => b.classList.remove('m7raceTaskBtnActive'));
  btn.classList.add('m7raceTaskBtnActive');
  raceReset();
}

function raceReset() {
  clearInterval(raceInterval);
  raceCpuDone = raceGpuDone = false;
  const t = RACE_TASKS[raceTask];
  buildCpuCores(t.cpuCores);
  buildGpuCores(t.gpuCores);
  document.getElementById('cpuTime').textContent = '0.0s';
  document.getElementById('gpuTime').textContent = '0.0s';
  const res = document.getElementById('raceResult');
  const exp = document.getElementById('raceExplain');
  if (res) res.style.display = 'none';
  if (exp) exp.style.display = 'none';
  const btn = document.getElementById('racePlayBtn');
  if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ph-bold ph-play"></i> Correr carrera'; }
}

function buildCpuCores(n) {
  const el = document.getElementById('cpuCores');
  if (!el) return;
  el.style.gridTemplateColumns = `repeat(${Math.min(n, 4)}, 1fr)`;
  el.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'm7raceCore';
    c.id = `cpuCore${i}`;
    el.appendChild(c);
  }
  document.getElementById('cpuWorkerLbl').textContent = `${n} cores · alto rendimiento individual`;
}

function buildGpuCores(n) {
  const el = document.getElementById('gpuCores');
  if (!el) return;
  el.innerHTML = '';
  el.style.gridTemplateColumns = `repeat(8, 1fr)`;
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    d.className = 'm7raceGpuDot';
    d.id = `gpuDot${i}`;
    el.appendChild(d);
  }
  document.getElementById('gpuWorkerLbl').textContent = `${n} cores simulados · SIMD masivo`;
}

function racePlay() {
  const t = RACE_TASKS[raceTask];
  raceReset();
  const btn = document.getElementById('racePlayBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="ph-bold ph-spinner"></i> Corriendo…'; }

  raceStart = Date.now();
  let cpuProgress = 0, gpuProgress = 0;
  const n = t.cpuCores;
  const gn = t.gpuCores;

  raceInterval = setInterval(() => {
    const elapsed = Date.now() - raceStart;
    cpuProgress = Math.min(elapsed / t.cpuMs, 1);
    gpuProgress = Math.min(elapsed / t.gpuMs, 1);

    document.getElementById('cpuTime').textContent = (elapsed / 1000).toFixed(1) + 's';
    document.getElementById('gpuTime').textContent = (elapsed / 1000).toFixed(1) + 's';

    for (let i = 0; i < n; i++) {
      const c = document.getElementById(`cpuCore${i}`);
      if (!c) continue;
      const coreP = Math.min((cpuProgress * n - i) / 1, 1);
      if (coreP > 0) c.classList.add('m7raceCoreActive');
      if (coreP >= 1) {
        c.classList.remove('m7raceCoreActive');
        c.style.background = 'rgba(56,189,248,0.12)';
        c.style.borderColor = 'rgba(56,189,248,0.2)';
      }
    }

    const waveFront = Math.floor(gpuProgress * gn);
    for (let i = 0; i < gn; i++) {
      const d = document.getElementById(`gpuDot${i}`);
      if (!d) continue;
      if (i < waveFront) {
        d.classList.remove('m7raceGpuDotActive');
        d.classList.add('m7raceGpuDotDone');
      } else if (i === waveFront) {
        d.classList.add('m7raceGpuDotActive');
      }
    }

    if (!raceCpuDone && cpuProgress >= 1) {
      raceCpuDone = true;
      document.getElementById('cpuTime').textContent = (t.cpuMs / 1000).toFixed(1) + 's';
    }
    if (!raceGpuDone && gpuProgress >= 1) {
      raceGpuDone = true;
      document.getElementById('gpuTime').textContent = (t.gpuMs / 1000).toFixed(1) + 's';
    }

    if (raceCpuDone && raceGpuDone) {
      clearInterval(raceInterval);
      showRaceResult(t);
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ph-bold ph-play"></i> Correr carrera'; }
    }
  }, 50);
}

function showRaceResult(t) {
  const res = document.getElementById('raceResult');
  const exp = document.getElementById('raceExplain');
  const icon = document.getElementById('raceWinnerIcon');
  const text = document.getElementById('raceWinnerText');
  const speedupEl = document.getElementById('raceSpeedupText');
  if (!res) return;

  const speedup = t.winner === 'gpu'
    ? (t.cpuMs / t.gpuMs).toFixed(1)
    : (t.gpuMs / t.cpuMs).toFixed(1);
  const winnerLabel = t.winner === 'gpu' ? 'GPU gana' : 'CPU gana';
  const winnerColor = t.winner === 'gpu' ? 'var(--accent)' : '#38bdf8';

  icon.className = 'ph-bold ph-trophy';
  icon.style.color = winnerColor;
  text.textContent  = winnerLabel;
  text.style.color  = winnerColor;
  speedupEl.textContent = `×${speedup} más rápido`;
  speedupEl.style.color = winnerColor;
  res.style.display = 'flex';

  if (exp) {
    exp.textContent  = t.explain;
    exp.style.display = 'block';
  }
}

/* ═══════════════════════════════════════════
   CODE TABS
═══════════════════════════════════════════ */
function switchTab7(btn, panelId) {
  document.querySelectorAll('.m7codeTab').forEach(t => t.classList.remove('m7codeTabActive'));
  document.querySelectorAll('.m7codePanel').forEach(p => p.classList.add('m7codePanelHidden'));
  btn.classList.add('m7codeTabActive');
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.remove('m7codePanelHidden');
    if (window.Prism) Prism.highlightAllUnder(panel);
  }
}

/* ═══════════════════════════════════════════
   LAB CODE COPY
═══════════════════════════════════════════ */
function copyLabCode7() {
  const pre = document.getElementById('lab7CodePre');
  if (!pre) return;
  navigator.clipboard.writeText(pre.innerText).then(() => {
    const btn = pre.closest('.m7labHint')?.querySelector('button');
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="ph-bold ph-check"></i> Copiado';
    setTimeout(() => { btn.innerHTML = orig; }, 2000);
  });
}

/* ═══════════════════════════════════════════
   ARCHITECTURE GAME
═══════════════════════════════════════════ */
const ARCH_SCENARIOS = [
  {
    icon: '🎮',
    title: 'Motor de renderizado en tiempo real',
    desc: 'Tu estudio necesita renderizar un juego AAA a 4K 60fps con ray tracing. Cada frame tiene millones de píxeles con trazado de rayos independientes. Latencia requerida: < 16ms por frame.',
    reqs: ['Latencia < 16ms', 'Millones de píxeles/frame', 'Ray tracing', 'Tiempo real'],
    options: [
      'CPU cluster de 64 cores de servidor',
      'GPU NVIDIA RTX 4090 (16K CUDA cores)',
      'FPGA + CPU híbrido',
      'Cloud CPU burst (AWS c7g)',
    ],
    correct: 1,
    feedback: '✅ GPU es la respuesta correcta. Ray tracing es el caso de uso ideal para GPU: millones de operaciones de trazado completamente independientes entre sí (embarassingly parallel). La RTX 4090 tiene hardware específico para ray tracing (RT Cores) y procesa miles de rayos en paralelo. Un CPU haría el trabajo, pero 100× más lento — imposible para tiempo real.',
  },
  {
    icon: '🌡️',
    title: 'Simulación meteorológica global',
    desc: 'El servicio meteorológico necesita simular el clima global para las próximas 10 días. La grilla tiene 100M de celdas 3D. Las ecuaciones de Navier-Stokes requieren múltiples pasos de tiempo con dependencias entre celdas vecinas. El resultado debe estar listo en < 2 horas.',
    reqs: ['100M celdas 3D', 'Dependencias entre vecinos', 'Ecuaciones diferenciales', 'Resultado en < 2 horas'],
    options: [
      'GPU farm de 100× A100',
      'Supercomputador HPC con MPI (miles de CPUs)',
      'Cloud GPU (AWS p5)',
      'ASIC diseñado específicamente',
    ],
    correct: 1,
    feedback: '✅ HPC con MPI es correcto. Las simulaciones de CFD (Computational Fluid Dynamics) tienen dependencias fuertes entre celdas vecinas — no son "embarassingly parallel". Necesitan comunicación frecuente entre nodos (scatter-compute-gather). Los supercomputadores como Frontier usan miles de CPUs conectados con InfiniBand para esta clase de workload. Las GPU son excelentes pero las dependencias entre elementos las penalizan.',
  },
  {
    icon: '📈',
    title: 'Sistema de trading de alta frecuencia (HFT)',
    desc: 'Un fondo de trading necesita tomar decisiones de compra/venta en menos de 10 microsegundos. El código procesa datos de mercado, evalúa condiciones complejas con muchos if/else, y envía órdenes. La latencia es más crítica que el throughput.',
    reqs: ['Latencia < 10 µs', 'Mucho branching (if/else)', 'Decisiones complejas', 'Latencia > throughput'],
    options: [
      'GPU cluster para procesar en paralelo',
      'Cloud con auto-scaling horizontal',
      'CPU single-thread de alta frecuencia (5GHz+) + FPGA front-end',
      'TPU de Google para ML',
    ],
    correct: 2,
    feedback: '✅ CPU high-clock + FPGA es correcto. HFT es el caso donde la GPU pierde porque sufre warp divergence con todo el branching, y además tiene overhead de transferencia CPU→GPU. Los HFT usan CPUs Intel de 5GHz+ (latencia de nanosegundos), código C++ sin GC, kernel bypass (DPDK), y FPGAs para el front-end de red que opera en hardware a 40MHz. El cloud añade latencia inaceptable.',
  },
  {
    icon: '🤖',
    title: 'Entrenamiento de un LLM de 70B parámetros',
    desc: 'Tu empresa quiere entrenar un modelo de lenguaje de 70 billones de parámetros. El modelo no cabe en una sola GPU (requiere 140GB+ de VRAM para entrenamiento). El proceso tomará semanas. El presupuesto importa.',
    reqs: ['140GB+ VRAM', 'Semanas de entrenamiento', 'No cabe en 1 GPU', 'Costo importa'],
    options: [
      'Una sola GPU H100 de 80GB',
      'CPU cluster con mucha RAM (1TB+)',
      'Multi-GPU con NVLink + Cloud Spot instances para reducir costo',
      'FPGA farm customizado',
    ],
    correct: 2,
    feedback: '✅ Multi-GPU + Cloud Spot es correcto. Un modelo de 70B no cabe en una sola H100 (80GB VRAM). La solución estándar es model parallelism: partir el modelo en múltiples GPUs conectadas con NVLink (900 GB/s de bandwidth). Para reducir el costo de semanas de cómputo, se usan Spot instances con checkpointing frecuente — si la instancia se interrumpe, se retoma del último checkpoint. CPU es posible pero 50-100× más lento para operaciones de matriz.',
  },
];

let archIdx   = 0;
let archScore = 0;
let archAnswered = false;

function archRender() {
  const s = ARCH_SCENARIOS[archIdx];
  if (!s) return;
  document.getElementById('archCounter').textContent = `Escenario ${archIdx + 1} / ${ARCH_SCENARIOS.length}`;
  document.getElementById('archScore').textContent   = `${archScore} pts`;
  document.getElementById('archIcon').textContent    = s.icon;
  document.getElementById('archTitle').textContent   = s.title;
  document.getElementById('archDesc').textContent    = s.desc;
  document.getElementById('archReqs').innerHTML = s.reqs.map(r => `<span class="m7archReq">${r}</span>`).join('');
  document.getElementById('archOptions').innerHTML = s.options
    .map((o, i) => `<button class="m7archOption" onclick="archAnswer(${i})">${o}</button>`)
    .join('');
  const fb = document.getElementById('archFeedback');
  if (fb) { fb.style.display = 'none'; fb.textContent = ''; fb.className = 'm7archFeedback'; }
  const next = document.getElementById('archNext');
  if (next) next.style.display = 'none';
  archAnswered = false;
}

function archAnswer(idx) {
  if (archAnswered) return;
  archAnswered = true;
  const s = ARCH_SCENARIOS[archIdx];
  const opts = document.querySelectorAll('.m7archOption');
  opts.forEach((o, i) => {
    o.disabled = true;
    if (i === s.correct) o.classList.add('m7archOptionCorrect');
    else if (i === idx && idx !== s.correct) o.classList.add('m7archOptionWrong');
  });
  const correct = idx === s.correct;
  if (correct) archScore += 25;
  document.getElementById('archScore').textContent = `${archScore} pts`;
  const fb = document.getElementById('archFeedback');
  if (fb) {
    fb.textContent  = s.feedback;
    fb.className    = `m7archFeedback ${correct ? 'm7archFeedbackOk' : 'm7archFeedbackWrong'}`;
    fb.style.display = 'block';
  }
  const next = document.getElementById('archNext');
  if (next) {
    next.style.display = 'inline-flex';
    next.textContent = archIdx < ARCH_SCENARIOS.length - 1 ? 'Siguiente escenario →' : 'Ver resultados →';
    if (archIdx < ARCH_SCENARIOS.length - 1) {
      next.innerHTML = 'Siguiente escenario <i class="ph-bold ph-arrow-right"></i>';
    } else {
      next.innerHTML = 'Ver resultados <i class="ph-bold ph-trophy"></i>';
    }
  }
}

function archNext() {
  archIdx++;
  if (archIdx >= ARCH_SCENARIOS.length) {
    document.getElementById('archCard').style.display   = 'none';
    document.getElementById('archResult').style.display = 'block';
    document.getElementById('archResultNum').textContent = `${archScore} / 100 pts`;
    const msgs = [
      [100, '🏆 ¡Perfecto! Sos un arquitecto de sistemas de alto rendimiento. Todos los workloads correctos.'],
      [75,  '🎯 Muy bien. Entendés bien las trade-offs entre CPU, GPU, cluster y cloud.'],
      [50,  '📚 Bien. Algunos workloads son contraintuitivos — ¡repassá Gustafson y la sección de hardware!'],
      [0,   '🔁 El hardware HPC tiene muchas capas. Volvé a la sección de CPU vs GPU y volvé a intentarlo.'],
    ];
    const msg = msgs.find(([min]) => archScore >= min);
    document.getElementById('archResultMsg').textContent = msg ? msg[1] : '';
  } else {
    archRender();
  }
}

function archRestart() {
  archIdx = 0;
  archScore = 0;
  document.getElementById('archResult').style.display = 'none';
  document.getElementById('archCard').style.display   = 'block';
  archRender();
}

/* ═══════════════════════════════════════════
   QUIZ
═══════════════════════════════════════════ */
const QUIZ7 = [
  {
    q: '¿Cuál es la diferencia clave entre la Ley de Amdahl y la Ley de Gustafson-Barsis?',
    opts: [
      'Amdahl es para CPU, Gustafson es para GPU',
      'Amdahl asume tamaño de problema fijo; Gustafson asume que el problema escala con los cores',
      'Gustafson siempre predice mayor speedup — no importa el contexto',
      'No hay diferencia real, son equivalentes matemáticamente',
    ],
    correct: 1,
    feedback: 'La diferencia fundamental: Amdahl mantiene el tamaño del problema fijo y muestra que el speedup converge a 1/(1-P). Gustafson observa que en HPC real, con más cores se resuelve un problema mayor en el mismo tiempo — el speedup es S(N) = N − (1−P)·(N−1), que crece casi linealmente. En HPC, el problema siempre crece para aprovechar los recursos disponibles.',
  },
  {
    q: '¿Por qué una GPU con 14.000 cores simples puede ser más rápida que una CPU con 8 cores complejos para ML training?',
    opts: [
      'Porque la GPU tiene más frecuencia de reloj',
      'Porque la GPU tiene mejor compilador de Java',
      'Porque el ML training aplica la misma operación a millones de elementos independientes (SIMD masivo)',
      'Porque la GPU tiene más memoria RAM',
    ],
    correct: 2,
    feedback: 'ML training involucra multiplicaciones de matrices enormes — la misma operación aplicada a millones de pesos en paralelo. Esta característica (SIMD: Single Instruction Multiple Data) es exactamente para lo que se diseñó la GPU. Sus 14K cores simples ejecutan la misma instrucción en paralelo sobre diferentes datos. La CPU tiene 8 cores complejos optimizados para latencia y control flow complejo, no para throughput masivo uniforme.',
  },
  {
    q: '¿Qué es el "warp divergence" en programación GPU?',
    opts: [
      'Cuando dos GPUs en un cluster no están sincronizadas',
      'Cuando threads del mismo warp (32 threads) toman distintas ramas de un if/else y algunos deben esperar',
      'Cuando la VRAM se llena y hay que hacer swap a RAM del sistema',
      'Cuando el driver CUDA tiene un bug que causa resultados incorrectos',
    ],
    correct: 1,
    feedback: 'Una GPU ejecuta grupos de 32 threads (warps) con la MISMA instrucción simultáneamente (SIMT). Si un if/else hace que algunos threads vayan por el if y otros por el else, la GPU debe serializar: primero ejecuta el if con los idle threads esperando, luego el else. El resultado es pérdida de paralelismo. Por eso la GPU pierde en código con mucho branching — HFT, árbol de decisiones, graph traversal.',
  },
  {
    q: 'Para una simulación de física de fluidos (CFD) con fuertes dependencias entre celdas vecinas, ¿qué arquitectura es más adecuada?',
    opts: [
      'GPU farm — maximiza el throughput paralelo',
      'ASIC dedicado — máxima eficiencia energética',
      'Supercomputador HPC con MPI — maneja dependencias mediante comunicación entre procesos',
      'Cloud Spot instances — reduce el costo del cómputo',
    ],
    correct: 2,
    feedback: 'CFD tiene "stencil computations" — cada celda depende de sus vecinas. Esto requiere comunicación frecuente entre workers. MPI (Message Passing Interface) es el estándar para este tipo de computación distribuida: cada nodo procesa su porción del dominio y comunica los bordes a sus vecinos. Los clusters HPC con InfiniBand (< 0.5µs de latencia) minimizan el overhead de esta comunicación. Las GPU son excelentes pero las dependencias entre datos limitan su eficiencia.',
  },
  {
    q: '¿Cuál es la principal ventaja de usar "spot instances" en cloud computing para ML training?',
    opts: [
      'Son más rápidas que las instancias normales',
      'Tienen más VRAM disponible',
      'Reducen el costo hasta 90% aprovechando capacidad no utilizada, a cambio de posibles interrupciones',
      'Permiten correr código sin contenedores ni virtualización',
    ],
    correct: 2,
    feedback: 'Las spot/preemptible instances son capacidad de cómputo no utilizada que el cloud vende con descuento de 70-90%. El trade-off: pueden ser interrumpidas con ~2 minutos de aviso cuando el cloud necesita esa capacidad. Para ML training, esto es aceptable si implementás checkpointing frecuente: guardás el estado del modelo cada N pasos y retomás desde ahí si la instancia se interrumpe. Los hyperscalers como Google y Meta usan esta técnica a gran escala.',
  },
  {
    q: 'En la topología Fat-Tree usada por los TOP500, ¿cuál es el rol del interconnect InfiniBand?',
    opts: [
      'Conectar GPUs dentro del mismo servidor (función de NVLink)',
      'Proporcionar acceso a internet para los nodos del cluster',
      'Conectar nodos con latencia < 0.5µs y bandwidth de 200Gb/s para comunicación MPI casi sin overhead',
      'Reemplazar el almacenamiento HDD por NVMe',
    ],
    correct: 2,
    feedback: 'InfiniBand es el interconnect estándar de HPC porque ofrece lo que los clusters necesitan: latencia ultrabajos (< 0.5µs) y alto bandwidth (200Gb/s en HDR). En Frontier, los 9.408 nodos están conectados con InfiniBand porque la computación distribuida de física/química requiere coordinación frecuente — si la latencia fuera de Ethernet (5µs), el overhead de comunicación MPI se comería la mayoría de los ciclos de cómputo. Fat-Tree garantiza el mismo ancho de banda entre cualquier par de nodos.',
  },
  {
    q: '¿Qué es HBM (High Bandwidth Memory) y por qué es crítica para ML en GPU?',
    opts: [
      'Es un protocolo de red para conectar múltiples GPUs',
      'Memoria 3D apilada sobre el chip GPU con bandwidth de TB/s — crucial porque el cuello de botella en ML es mover pesos desde memoria, no el cómputo en sí',
      'Es el nombre del bus PCIe que conecta GPU con CPU',
      'High-performance Blob Memory — sistema de storage para datasets de ML',
    ],
    correct: 1,
    feedback: 'En ML, el cuello de botella real no suele ser los FLOPS sino el ancho de banda de memoria: traer los pesos del modelo desde VRAM al chip para multiplicarlos. HBM (High Bandwidth Memory) es memoria DRAM apilada en 3D directamente sobre el chip GPU usando TSV (Through-Silicon Vias), lo que permite anchos de banda de 3.35 TB/s (H100 HBM3) vs ~1 TB/s de GDDR6. Sin HBM, los 80 TFLOPS del chip estarían idle esperando que lleguen los datos.',
  },
  {
    q: 'Un sistema tiene 95% de código paralelizable (P=0.95). Con 64 cores, ¿cuál es el speedup según Amdahl?',
    opts: [
      '×64 (speedup lineal perfecto)',
      '×19.0 — el techo de Amdahl para P=0.95',
      '×13.5 — la realidad considerando overhead',
      '×95 — proporcional a la fracción paralela',
    ],
    correct: 1,
    feedback: 'Ley de Amdahl: S(N) = 1/((1-P) + P/N) = 1/((1-0.95) + 0.95/64) = 1/(0.05 + 0.0148) = 1/0.0648 ≈ ×15.4. El techo teórico (N→∞) es 1/(1-0.95) = 1/0.05 = ×20. Con 64 cores ya estamos cerca del techo — agregar más cores da retornos decrecientes. Gustafson daría: S(64) = 64 - (1-0.95)(64-1) = 64 - 0.05×63 = 64 - 3.15 = ×60.85 — mucho más optimista porque asume que el problema escala.',
  },
];

let q7Idx  = 0;
let q7Score = 0;
let q7Answered = false;

function quiz7Render() {
  const q = QUIZ7[q7Idx];
  if (!q) return;
  const pct = ((q7Idx + 1) / QUIZ7.length * 100).toFixed(0);
  document.getElementById('q7ProgressBar').style.width  = `${pct}%`;
  document.getElementById('q7ProgressLabel').textContent = `Pregunta ${q7Idx + 1} de ${QUIZ7.length}`;
  document.getElementById('q7Question').textContent = q.q;
  document.getElementById('q7Options').innerHTML = q.opts
    .map((o, i) => `<button class="m7quizOption" onclick="quiz7Answer(${i})">${o}</button>`)
    .join('');
  const fb = document.getElementById('q7Feedback');
  if (fb) { fb.style.display = 'none'; fb.className = 'm7quizFeedback'; }
  const btn = document.getElementById('q7NextBtn');
  if (btn) btn.style.display = 'none';
  document.getElementById('q7Result').style.display = 'none';
  q7Answered = false;
}

function quiz7Answer(idx) {
  if (q7Answered) return;
  q7Answered = true;
  const q = QUIZ7[q7Idx];
  document.querySelectorAll('.m7quizOption').forEach((o, i) => {
    o.disabled = true;
    if (i === q.correct) o.classList.add('m7quizOptionCorrect');
    else if (i === idx && idx !== q.correct) o.classList.add('m7quizOptionWrong');
  });
  const correct = idx === q.correct;
  if (correct) q7Score++;
  const fb = document.getElementById('q7Feedback');
  if (fb) {
    fb.textContent  = q.feedback;
    fb.className    = `m7quizFeedback ${correct ? 'm7quizFeedbackOk' : 'm7quizFeedbackWrong'}`;
    fb.style.display = 'block';
  }
  const btn = document.getElementById('q7NextBtn');
  if (btn) {
    btn.style.display = 'inline-flex';
    btn.innerHTML = q7Idx < QUIZ7.length - 1
      ? 'Siguiente <i class="ph-bold ph-arrow-right"></i>'
      : 'Ver resultado <i class="ph-bold ph-trophy"></i>';
  }
}

function quiz7Next() {
  q7Idx++;
  if (q7Idx >= QUIZ7.length) {
    document.getElementById('q7QuizBody')?.style && null;
    document.getElementById('q7ProgressBar').parentElement.style.display  = 'none';
    document.getElementById('q7ProgressLabel').style.display = 'none';
    document.getElementById('q7Question').style.display  = 'none';
    document.getElementById('q7Options').style.display   = 'none';
    document.getElementById('q7Feedback').style.display  = 'none';
    document.getElementById('q7NextBtn').style.display   = 'none';
    const res = document.getElementById('q7Result');
    res.style.display = 'block';
    document.getElementById('q7ResultNum').textContent = `${q7Score} / ${QUIZ7.length}`;
    const pct = (q7Score / QUIZ7.length * 100);
    let msg;
    if      (pct === 100) msg = '🏆 ¡Perfecto! Dominás HPC, Gustafson, GPU y cloud a fondo.';
    else if (pct >= 75)   msg = '🎯 Muy sólido. Entendés los conceptos principales. ¡Repasá las preguntas que erraste!';
    else if (pct >= 50)   msg = '📚 Buen inicio. Algunos conceptos de GPU y Gustafson todavía necesitan refuerzo.';
    else                  msg = '🔁 Necesitás repasar el módulo. Enfocate en GPU architecture y las leyes de escalado.';
    document.getElementById('q7ResultMsg').textContent = msg;
  } else {
    quiz7Render();
  }
}

function quiz7Restart() {
  q7Idx = 0; q7Score = 0;
  ['q7ProgressLabel','q7Question','q7Options'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  });
  document.getElementById('q7ProgressBar').parentElement.style.display = '';
  document.getElementById('q7Result').style.display = 'none';
  quiz7Render();
}

/* ═══════════════════════════════════════════
   FLIP CARDS (algoritmos + glosario)
═══════════════════════════════════════════ */
function initFlipCards() {
  document.querySelectorAll('.m7flipCard, .m7glossCard').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
function initReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.style.getPropertyValue('--delay') || '0ms';
        setTimeout(() => e.target.classList.add('visible'), parseInt(delay));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ─── Reading progress ───────────────────── */
function initReadProgress() {
  const bar = document.getElementById('readProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = `${pct}%`;
  });
}

/* ─── Cursor glow ────────────────────────── */
function initCursorGlow() {
  const glow = document.getElementById('mglow');
  if (!glow) return;
  document.addEventListener('mousemove', e => {
    glow.style.transform = `translate(${e.clientX - 140}px, ${e.clientY - 140}px)`;
  });
}

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initReveal();
  initReadProgress();
  initCursorGlow();
  initFlipCards();
  initGpuGrid();
  updateGustafson();
  archRender();
  quiz7Render();
  raceReset();

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter('counter1', 14592, 2200);
        animateCounter('counter2', 1102,  2000);
        animateCounter('counter3', 700,   1800);
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const stats = document.querySelector('.m7heroStats');
  if (stats) io.observe(stats);

  if (window.Prism) Prism.highlightAll();
});
