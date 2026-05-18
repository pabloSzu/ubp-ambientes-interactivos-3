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
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      n.pulse += 0.03;
    });
    const LINK = 140;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < LINK) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(163,230,53,${(1 - d/LINK) * 0.3})`;
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
    const p = Math.min((Date.now() - start) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target).toLocaleString('es-AR');
    if (p < 1) requestAnimationFrame(tick);
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
  grid.style.gridTemplateColumns = 'repeat(8, 1fr)';
  for (let i = 0; i < 40; i++) {
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

  const amdahlSpeedup    = 1 / ((1 - P) + P / N);
  const amdahlMax        = P < 1 ? 1 / (1 - P) : Infinity;
  const gustafsonSpeedup = N - (1 - P) * (N - 1);

  document.getElementById('amdahlSpeedup7').textContent  = `×${amdahlSpeedup.toFixed(2)}`;
  document.getElementById('amdahlMax7').textContent       = isFinite(amdahlMax) ? `×${amdahlMax.toFixed(1)}` : '×∞';
  document.getElementById('gustafsonSpeedup').textContent = `×${gustafsonSpeedup.toFixed(2)}`;
  document.getElementById('gustafsonGrowth').textContent  = gustafsonSpeedup >= N * 0.9 ? 'casi lineal' : 'sub-lineal';

  drawAmdahlChart7(P, N);
  drawGustafsonChart(P, N);

  const diff = gustafsonSpeedup - amdahlSpeedup;
  const ins  = document.getElementById('gInsight');
  if (N === 1) {
    ins.textContent = '💡 Con 1 core, ambas leyes dan speedup ×1. Aumentá los núcleos para ver la diferencia.';
  } else if (P < 0.5) {
    ins.textContent = `⚠️ Con solo ${Math.round(P*100)}% paralelo, ninguna ley escala bien. El cuello de botella serial domina. Gustafson da ×${gustafsonSpeedup.toFixed(1)} vs Amdahl ×${amdahlSpeedup.toFixed(1)}.`;
  } else if (diff > 5) {
    ins.textContent = `✅ Con ${N} cores y ${Math.round(P*100)}% paralelo, Gustafson predice ×${gustafsonSpeedup.toFixed(1)} vs el techo de Amdahl en ×${amdahlMax.toFixed(1)}. La diferencia (${diff.toFixed(1)}×) es el beneficio de escalar el problema — la clave del HPC real.`;
  } else {
    ins.textContent = `Con ${N} cores y ${Math.round(P*100)}% paralelo: Amdahl predice ×${amdahlSpeedup.toFixed(2)}, Gustafson predice ×${gustafsonSpeedup.toFixed(2)}. La brecha se agranda cuando P es alto y N es grande.`;
  }
}

function drawAmdahlChart7(P, currentN) {
  const svg = document.getElementById('amdahlSvg7');
  if (!svg) return;
  const W = 420, H = 220, pad = { t:20, r:20, b:30, l:40 };
  const maxS = Math.min(P < 1 ? 1/(1-P) : 20, 20);
  const pts = CORES_MAP.map(n => {
    const s = 1/((1-P)+P/n);
    const x = pad.l + ((n-1)/(64-1))*(W-pad.l-pad.r);
    const y = H - pad.b - (Math.min(s,maxS)/maxS)*(H-pad.t-pad.b);
    return [x, y];
  });
  const lineD = pts.map((p,i)=>`${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ');
  const areaD = `${lineD} L${pts[pts.length-1][0]},${H-pad.b} L${pts[0][0]},${H-pad.b} Z`;
  const ci = CORES_MAP.indexOf(currentN);
  svg.innerHTML = `<defs><linearGradient id="am7g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#ef4444" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
  </linearGradient></defs>
  <line x1="${pad.l}" y1="${H-pad.b}" x2="${W-pad.r}" y2="${H-pad.b}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${H-pad.b}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <path d="${areaD}" fill="url(#am7g)"/>
  <path d="${lineD}" stroke="#ef4444" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${pts[ci][0]}" cy="${pts[ci][1]}" r="5" fill="#ef4444" stroke="#06080f" stroke-width="2"/>
  <text x="${pad.l-4}" y="${H-pad.b+14}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">1</text>
  <text x="${W-pad.r}" y="${H-pad.b+14}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">64</text>
  <text x="${pad.l-6}" y="${pad.t+4}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">${maxS.toFixed(0)}×</text>
  <text x="${pad.l-6}" y="${H-pad.b}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">1×</text>`;
}

function drawGustafsonChart(P, currentN) {
  const svg = document.getElementById('gustafsonSvg');
  if (!svg) return;
  const W = 420, H = 220, pad = { t:20, r:20, b:30, l:40 };
  const maxS = CORES_MAP[CORES_MAP.length-1] - (1-P)*(CORES_MAP[CORES_MAP.length-1]-1);
  const displayMax = Math.max(maxS, 10);
  const pts = CORES_MAP.map(n => {
    const s = n-(1-P)*(n-1);
    const x = pad.l + ((n-1)/(64-1))*(W-pad.l-pad.r);
    const y = H - pad.b - (Math.min(s,displayMax)/displayMax)*(H-pad.t-pad.b);
    return [x, y];
  });
  const lineD = pts.map((p,i)=>`${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ');
  const areaD = `${lineD} L${pts[pts.length-1][0]},${H-pad.b} L${pts[0][0]},${H-pad.b} Z`;
  const linN  = CORES_MAP.map(n => {
    const x = pad.l + ((n-1)/(64-1))*(W-pad.l-pad.r);
    const y = H - pad.b - (n/displayMax)*(H-pad.t-pad.b);
    return `${x},${y}`;
  }).join(' ');
  const ci = CORES_MAP.indexOf(currentN);
  svg.innerHTML = `<defs><linearGradient id="gu7g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#a3e635" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#a3e635" stop-opacity="0"/>
  </linearGradient></defs>
  <line x1="${pad.l}" y1="${H-pad.b}" x2="${W-pad.r}" y2="${H-pad.b}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${H-pad.b}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <polyline points="${linN}" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="none" stroke-dasharray="4 3"/>
  <path d="${areaD}" fill="url(#gu7g)"/>
  <path d="${lineD}" stroke="#a3e635" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${pts[ci][0]}" cy="${pts[ci][1]}" r="5" fill="#a3e635" stroke="#06080f" stroke-width="2"/>
  <text x="${pad.l-4}" y="${H-pad.b+14}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">1</text>
  <text x="${W-pad.r}" y="${H-pad.b+14}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">64</text>
  <text x="${pad.l-6}" y="${pad.t+4}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">${displayMax.toFixed(0)}×</text>
  <text x="${pad.l-6}" y="${H-pad.b}" font-size="9" fill="rgba(255,255,255,0.4)" text-anchor="end">1×</text>`;
}

/* ═══════════════════════════════════════════
   CLUSTER SVG — Fat-Tree diagram
═══════════════════════════════════════════ */
function drawClusterSvg() {
  const svg = document.getElementById('clusterSvg');
  if (!svg) return;

  const CORE_COLOR = '#a3e635';
  const AGG_COLOR  = '#38bdf8';
  const NODE_COLOR = '#8a9bb8';
  const LINK_CORE  = 'rgba(163,230,53,0.45)';
  const LINK_AGG   = 'rgba(56,189,248,0.35)';

  // ViewBox 600×280 — perfectly symmetric Fat-Tree, no crowding
  // Nodes: 70px pitch, r=20 → 30px gap. Aggs centered over node pairs. Cores centered over agg pairs.
  const NR = 20;
  const nodeY = 228;
  const nxs = [45, 115, 185, 255, 325, 395, 465, 535]; // 70px pitch

  // Agg centers = midpoint of each node pair
  const cores = [
    { x: 150, y: 42, label: 'Core 1' }, // midpoint of Agg1(80) & Agg2(220)
    { x: 430, y: 42, label: 'Core 2' }, // midpoint of Agg3(360) & Agg4(500)
  ];
  const aggs = [
    { x: 80,  y: 132, label: 'Agg 1' }, // midpoint of N1(45) & N2(115)
    { x: 220, y: 132, label: 'Agg 2' }, // midpoint of N3(185) & N4(255)
    { x: 360, y: 132, label: 'Agg 3' }, // midpoint of N5(325) & N6(395)
    { x: 500, y: 132, label: 'Agg 4' }, // midpoint of N7(465) & N8(535)
  ];
  const nodeLabels = ['N1','N2','N3','N4','N5','N6','N7','N8'];
  const nodes = nxs.map((x, i) => ({ x, y: nodeY, label: nodeLabels[i] }));

  // Fat-Tree connections: each core → all 4 aggs, each agg → 2 nodes
  const coreToAgg = [
    [0,0],[0,1],[0,2],[0,3],
    [1,0],[1,1],[1,2],[1,3],
  ];
  const aggToNode = [
    [0,0],[0,1],[1,2],[1,3],
    [2,4],[2,5],[3,6],[3,7],
  ];

  let html = '';

  // Lines first (behind nodes)
  coreToAgg.forEach(([ci, ai]) => {
    html += `<line x1="${cores[ci].x}" y1="${cores[ci].y+15}" x2="${aggs[ai].x}" y2="${aggs[ai].y-15}" stroke="${LINK_CORE}" stroke-width="1.4" stroke-dasharray="5 3" opacity="0.7"/>`;
  });
  aggToNode.forEach(([ai, ni]) => {
    html += `<line x1="${aggs[ai].x}" y1="${aggs[ai].y+15}" x2="${nodes[ni].x}" y2="${nodes[ni].y-NR}" stroke="${LINK_AGG}" stroke-width="1.2" opacity="0.7"/>`;
  });

  // Core switches (rounded rects 80×30)
  cores.forEach(c => {
    html += `<rect x="${c.x-40}" y="${c.y-15}" width="80" height="30" rx="9" fill="rgba(163,230,53,0.1)" stroke="${CORE_COLOR}" stroke-width="1.6"/>`;
    html += `<text x="${c.x}" y="${c.y+5}" text-anchor="middle" font-size="11" font-weight="800" fill="${CORE_COLOR}" font-family="system-ui,sans-serif">${c.label}</text>`;
  });

  // Aggregation switches (rounded rects 80×30)
  aggs.forEach(a => {
    html += `<rect x="${a.x-40}" y="${a.y-15}" width="80" height="30" rx="9" fill="rgba(56,189,248,0.08)" stroke="${AGG_COLOR}" stroke-width="1.4"/>`;
    html += `<text x="${a.x}" y="${a.y+5}" text-anchor="middle" font-size="11" font-weight="700" fill="${AGG_COLOR}" font-family="system-ui,sans-serif">${a.label}</text>`;
  });

  // Compute nodes (circles r=20)
  nodes.forEach(n => {
    html += `<circle cx="${n.x}" cy="${n.y}" r="${NR}" fill="rgba(138,155,184,0.09)" stroke="${NODE_COLOR}" stroke-width="1.2"/>`;
    html += `<text x="${n.x}" y="${n.y+4}" text-anchor="middle" font-size="10" font-weight="700" fill="${NODE_COLOR}" font-family="system-ui,sans-serif">${n.label}</text>`;
  });

  svg.innerHTML = html;
}

/* ═══════════════════════════════════════════
   CPU vs GPU RACE
═══════════════════════════════════════════ */
const RACE_TASKS = {
  simple: {
    label: 'Simple masiva (píxeles independientes)',
    cpuCores: 8, gpuCores: 64,
    cpuMs: 4800, gpuMs: 520,
    winner: 'gpu',
    cpuDesc: (p) => `⚙️ Core activo: procesando píxel ${Math.floor(p*1024)}/1024 — uno a la vez`,
    gpuDesc: (p) => `⚡ ${Math.floor(p*1024)} píxeles completados simultáneamente (SIMD masivo)`,
    cpuDoneText: 'CPU procesó 1024 píxeles secuencialmente',
    gpuDoneText: 'GPU procesó 1024 píxeles en paralelo total',
    realExample: '🎮 Ejemplo real: renderizar un frame 4K (8M píxeles con ray tracing). CPU: ~37s por frame. GPU RTX 4090: ~8ms por frame — por eso los juegos AAA con ray tracing requieren GPU obligatoriamente.',
    whenCpu: '✓ CPU gana en:\nCódigo complejo · Baja latencia · Branching · HFT',
    whenGpu: '✓ GPU gana en:\nOperaciones uniformes · ML · Render · SIMD masivo',
    explain: 'Para tareas donde la misma operación se aplica a millones de datos independientes, la GPU aplasta a la CPU. Sus miles de cores simples procesan todo en paralelo real.',
  },
  complex: {
    label: 'Compleja con dependencias (árbol de decisión)',
    cpuCores: 8, gpuCores: 64,
    cpuMs: 1200, gpuMs: 3800,
    winner: 'cpu',
    cpuDesc: (p) => `🧠 Nodo ${Math.floor(p*512)}/512 del árbol — branching sin penalización`,
    gpuDesc: (p) => `⚠️ ~${Math.floor((1-p)*28)} threads idle esperando el otro branch (warp divergence)`,
    cpuDoneText: 'CPU evaluó el árbol de decisiones sin overhead',
    gpuDoneText: 'GPU luchó con el branching — threads idle todo el tiempo',
    realExample: '💱 Ejemplo real: sistema HFT (High-Frequency Trading). Evaluar condiciones del mercado en 10 microsegundos. La GPU añade ~100µs solo para lanzar el kernel — inaceptable. Los HFT usan CPUs Intel de 5GHz+ con kernel bypass en red (DPDK).',
    whenCpu: '✓ CPU gana en:\nMucho branching · Latencia ultra-baja · HFT · Graph traversal',
    whenGpu: '✓ GPU gana en:\nCuando throughput > latencia · Ops uniformes masivas · ML',
    explain: 'Con lógica compleja y mucho if/else, la GPU sufre "warp divergence": threads que toman ramas distintas hacen que los otros esperen en idle. La CPU ejecuta código complejo sin esta penalización.',
  },
};

let raceTask     = 'simple';
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

  const cpuDesc = document.getElementById('cpuDesc');
  const gpuDesc = document.getElementById('gpuDesc');
  if (cpuDesc) { cpuDesc.textContent = 'Listo para correr…'; cpuDesc.classList.remove('active'); }
  if (gpuDesc) { gpuDesc.textContent = 'Listo para correr…'; gpuDesc.classList.remove('active'); }

  const cpuDone = document.getElementById('cpuDone');
  const gpuDone = document.getElementById('gpuDone');
  if (cpuDone) cpuDone.style.display = 'none';
  if (gpuDone) gpuDone.style.display = 'none';

  const res    = document.getElementById('raceResult');
  const detail = document.getElementById('raceResultDetail');
  const exp    = document.getElementById('raceExplain');
  if (res)    res.style.display    = 'none';
  if (detail) detail.style.display = 'none';
  if (exp)    exp.style.display    = 'none';

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
  el.style.gridTemplateColumns = 'repeat(8, 1fr)';
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
  const n = t.cpuCores, gn = t.gpuCores;
  const cpuDesc = document.getElementById('cpuDesc');
  const gpuDesc = document.getElementById('gpuDesc');
  if (cpuDesc) cpuDesc.classList.add('active');
  if (gpuDesc) gpuDesc.classList.add('active');

  raceInterval = setInterval(() => {
    const elapsed    = Date.now() - raceStart;
    const cpuProgress = Math.min(elapsed / t.cpuMs, 1);
    const gpuProgress = Math.min(elapsed / t.gpuMs, 1);

    if (!raceCpuDone) {
      document.getElementById('cpuTime').textContent = (elapsed / 1000).toFixed(1) + 's';
      if (cpuDesc) cpuDesc.textContent = t.cpuDesc(cpuProgress);
    }
    if (!raceGpuDone) {
      document.getElementById('gpuTime').textContent = (elapsed / 1000).toFixed(1) + 's';
      if (gpuDesc) gpuDesc.textContent = t.gpuDesc(gpuProgress);
    }

    for (let i = 0; i < n; i++) {
      const c = document.getElementById(`cpuCore${i}`);
      if (!c) continue;
      if (cpuProgress * n > i) {
        c.classList.add('m7raceCoreActive');
        if (cpuProgress * n > i + 1) {
          c.classList.remove('m7raceCoreActive');
          c.style.background   = 'rgba(56,189,248,0.12)';
          c.style.borderColor  = 'rgba(56,189,248,0.2)';
        }
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
      const finalMs = (t.cpuMs / 1000).toFixed(1);
      document.getElementById('cpuTime').textContent = finalMs + 's';
      if (cpuDesc) cpuDesc.textContent = `✓ ${t.cpuDoneText} — ${finalMs}s`;
      const badge = document.getElementById('cpuDone');
      if (badge) badge.style.display = 'inline-flex';
    }
    if (!raceGpuDone && gpuProgress >= 1) {
      raceGpuDone = true;
      const finalMs = (t.gpuMs / 1000).toFixed(1);
      document.getElementById('gpuTime').textContent = finalMs + 's';
      if (gpuDesc) gpuDesc.textContent = `✓ ${t.gpuDoneText} — ${finalMs}s`;
      const badge = document.getElementById('gpuDone');
      if (badge) badge.style.display = 'inline-flex';
    }

    if (raceCpuDone && raceGpuDone) {
      clearInterval(raceInterval);
      showRaceResult(t);
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ph-bold ph-play"></i> Correr carrera'; }
    }
  }, 50);
}

function showRaceResult(t) {
  const res    = document.getElementById('raceResult');
  const detail = document.getElementById('raceResultDetail');
  const icon   = document.getElementById('raceWinnerIcon');
  const text   = document.getElementById('raceWinnerText');
  const speedEl = document.getElementById('raceSpeedupText');
  if (!res) return;

  const faster   = t.winner === 'gpu' ? t.cpuMs / t.gpuMs : t.gpuMs / t.cpuMs;
  const winLabel = t.winner === 'gpu' ? 'GPU gana por amplio margen' : 'CPU gana — tarea compleja';
  const winColor = t.winner === 'gpu' ? 'var(--accent)' : '#38bdf8';

  icon.className = 'ph-bold ph-trophy';
  icon.style.color  = winColor;
  text.textContent  = winLabel;
  text.style.color  = winColor;
  speedEl.textContent = `×${faster.toFixed(1)} más rápido`;
  speedEl.style.color = winColor;
  res.style.display   = 'flex';

  if (detail) {
    document.getElementById('raceRealExample').textContent  = t.realExample;
    document.getElementById('raceWhenCpu').textContent      = t.whenCpu;
    document.getElementById('raceWhenGpu').textContent      = t.whenGpu;
    detail.style.display = 'block';
  }
  const exp = document.getElementById('raceExplain');
  if (exp) { exp.textContent = t.explain; exp.style.display = 'block'; }
}

/* ═══════════════════════════════════════════
   CLOUD COST CALCULATOR
═══════════════════════════════════════════ */
function updateCloudCost() {
  const hours    = parseInt(document.getElementById('cloudHours').value);
  const H100_RATE = 32;           // $/h cloud on-demand (p4d.24xlarge ~equivalente)
  const SPOT_RATE = H100_RATE * 0.28; // ~72% descuento promedio spot
  const ONPREM_H100 = 30000;      // precio hardware H100

  const cloudCost = hours * H100_RATE;
  const spotCost  = hours * SPOT_RATE;
  const amortizedOnPrem = (ONPREM_H100 / (365 * 24)) * hours; // amortizado en 1 año

  document.getElementById('cloudHoursLabel').textContent = `${hours} horas / mes`;

  const best = Math.min(cloudCost, spotCost, amortizedOnPrem);

  const cards = [
    {
      label: '🏢 On-premise',
      amount: `$${Math.round(amortizedOnPrem).toLocaleString('en-US')}`,
      sub: `Amortización de H100 ($30K) en 1 año × ${hours}h/mes usadas.\nNo incluye: energía, cooling, mantenimiento, personal IT.`,
      isBest: amortizedOnPrem === best,
    },
    {
      label: '☁️ Cloud bajo demanda',
      amount: `$${Math.round(cloudCost).toLocaleString('en-US')}`,
      sub: `$${H100_RATE}/hora × ${hours}h. AWS p4d.24xlarge (8×A100).\nVentaja: sin compromiso, escala inmediata.`,
      isBest: cloudCost === best,
    },
    {
      label: '⚡ Cloud Spot instance',
      amount: `$${Math.round(spotCost).toLocaleString('en-US')}`,
      sub: `~$${SPOT_RATE.toFixed(1)}/hora × ${hours}h (72% ahorro).\nRequiere checkpointing ante posibles interrupciones.`,
      isBest: spotCost === best,
    },
  ];

  const grid = document.getElementById('cloudCostGrid');
  if (grid) {
    grid.innerHTML = cards.map(c => `
      <div class="m7cloudCostCard ${c.isBest ? 'best' : ''}">
        <div class="m7cloudCostCardLabel">${c.label}${c.isBest ? ' 🏆' : ''}</div>
        <div class="m7cloudCostCardAmount">${c.amount}<small style="font-size:14px;font-weight:500">/mes</small></div>
        <div class="m7cloudCostCardSub">${c.sub.replace(/\n/g,'<br>')}</div>
      </div>
    `).join('');
  }

  const note = document.getElementById('cloudCostNote');
  if (note) {
    if (hours < 100) {
      note.textContent = `💡 Con solo ${hours}h/mes, el cloud on-demand es casi siempre más barato que comprar hardware. Comprás capacidad cuando la necesitás.`;
    } else if (hours >= 600) {
      note.textContent = `⚡ Con ${hours}h/mes (uso casi 24/7), el hardware on-premise puede comenzar a amortizarse si tenés el equipo IT para administrarlo. Spot instances siguen siendo muy competitivas.`;
    } else {
      note.textContent = `📊 Con ${hours}h/mes, Spot instances son generalmente la mejor opción precio/rendimiento — siempre que implementes checkpointing en tu entrenamiento.`;
    }
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
    title: 'Juego 3D en tiempo real',
    desc: 'Tu motor de juego necesita calcular el color de 8 millones de píxeles por frame, 60 veces por segundo. Cada píxel se calcula de forma completamente independiente (no depende de los demás). Tenés 16ms por frame para hacerlo todo.',
    reqs: ['8 millones de píxeles/frame', 'Cada píxel es independiente', '16ms por frame', 'Sin dependencias entre datos'],
    options: [
      'Un CPU potente (8–16 cores) dedicado al renderizado',
      'GPU con miles de cores simples trabajando en paralelo',
      'Cluster de 10 servidores en la nube conectados por red',
      'Chip personalizado diseñado solo para este juego',
    ],
    correct: 1,
    feedback: '✅ GPU. Millones de datos independientes + misma operación para todos = caso ideal para GPU (SIMD masivo). La GPU puede procesar miles de píxeles simultáneamente. El CPU los haría uno por uno → 100× más lento. El cluster introduce latencia de red incompatible con los 16ms exigidos.',
  },
  {
    icon: '📈',
    title: 'Sistema de decisiones automáticas',
    desc: 'Tu sistema analiza el estado del mercado y decide si comprar o vender activos en menos de 1 milisegundo. La decisión pasa por 50 condiciones encadenadas (si A, entonces B, si no C...). Cada milisegundo de demora cuesta dinero real.',
    reqs: ['Respuesta en < 1 ms', 'Decisiones secuenciales (if/else)', 'Resultado depende del anterior', 'Latencia es lo más crítico'],
    options: [
      'GPU con miles de cores para procesar en paralelo',
      'CPU potente, un solo hilo dedicado, sin overhead',
      'Cloud con muchos servidores que escalan según carga',
      'Cluster de 50 máquinas distribuidas',
    ],
    correct: 1,
    feedback: '✅ CPU de un solo hilo. Las decisiones son secuenciales (cada resultado depende del anterior) — no hay nada que paralelizar. La GPU es terrible acá: sus miles de cores necesitan hacer todos lo mismo, no if/else ramificados. El cloud y el cluster agregan latencia de red. Un CPU a máxima velocidad, sin distracciones, es la respuesta.',
  },
  {
    icon: '🤖',
    title: 'Entrenamiento de inteligencia artificial',
    desc: 'Querés entrenar un modelo de IA. El proceso consiste en aplicar la misma operación matemática (multiplicación de matrices) millones de veces sobre millones de valores independientes. Va a tardar días. Tu empresa no quiere comprar hardware caro que después quede ocioso.',
    reqs: ['Misma operación, millones de veces', 'Datos completamente independientes', 'Días de cómputo', 'No querés hardware ocioso después'],
    options: [
      'Un CPU muy rápido con mucha RAM',
      'GPUs alquiladas por horas en la nube (cloud)',
      'Cluster de 100 servidores normales sin GPU',
      'Chip de red de alta velocidad',
    ],
    correct: 1,
    feedback: '✅ GPUs en cloud. La multiplicación de matrices es SIMD masivo: misma operación sobre datos independientes → GPU ideal. Como el entrenamiento es temporario (días, no años), alquilar GPUs por horas en cloud es más barato que comprarlas ($30.000+ por GPU). Pagás lo que usás y listo. Este es el modelo de todas las startups de IA hoy.',
  },
  {
    icon: '🛒',
    title: 'E-commerce con tráfico impredecible',
    desc: 'Tenés una tienda online. Los lunes hay 1.000 visitas/hora. Los viernes a la noche hay 100.000 visitas/hora (lanzamiento de ofertas). Cada visita es un request independiente. No querés pagar por capacidad que el 90% del tiempo está ociosa.',
    reqs: ['Tráfico variable: 1K → 100K visitas/hora', 'Requests completamente independientes', 'Picos impredecibles', 'No pagar por capacidad ociosa'],
    options: [
      'Servidor propio muy potente encendido 24/7',
      'GPU de alto rendimiento en data center propio',
      'Cloud con escalado automático según la demanda real',
      'Cluster fijo de 50 servidores siempre activos',
    ],
    correct: 2,
    feedback: '✅ Cloud con auto-scaling. Requests independientes + carga variable = cloud. En lugar de tener 50 servidores prendidos para los picos (gastando el 95% del tiempo en capacidad que no usás), el cloud arranca y apaga servidores automáticamente. Pagás solo lo que usás. Esto es exactamente lo que hacen Mercado Libre, Netflix y cualquier plataforma moderna.',
  },
];

let archIdx      = 0;
let archScore    = 0;
let archAnswered = false;

function archRender() {
  const s = ARCH_SCENARIOS[archIdx];
  if (!s) return;
  document.getElementById('archCounter').textContent = `Escenario ${archIdx+1} / ${ARCH_SCENARIOS.length}`;
  document.getElementById('archScore').textContent   = `${archScore} pts`;
  document.getElementById('archIcon').textContent    = s.icon;
  document.getElementById('archTitle').textContent   = s.title;
  document.getElementById('archDesc').textContent    = s.desc;
  document.getElementById('archReqs').innerHTML = s.reqs.map(r => `<span class="m7archReq">${r}</span>`).join('');
  document.getElementById('archOptions').innerHTML = s.options
    .map((o, i) => `<button class="m7archOption" onclick="archAnswer(${i})">${o}</button>`).join('');
  const fb = document.getElementById('archFeedback');
  if (fb) { fb.style.display = 'none'; fb.className = 'm7archFeedback'; }
  const next = document.getElementById('archNext');
  if (next) next.style.display = 'none';
  archAnswered = false;
}

function archAnswer(idx) {
  if (archAnswered) return;
  archAnswered = true;
  const s = ARCH_SCENARIOS[archIdx];
  document.querySelectorAll('.m7archOption').forEach((o, i) => {
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
    next.innerHTML = archIdx < ARCH_SCENARIOS.length-1
      ? 'Siguiente escenario <i class="ph-bold ph-arrow-right"></i>'
      : 'Ver resultados <i class="ph-bold ph-trophy"></i>';
  }
}

function archNext() {
  archIdx++;
  if (archIdx >= ARCH_SCENARIOS.length) {
    document.getElementById('archCard').style.display   = 'none';
    document.getElementById('archResult').style.display = 'block';
    document.getElementById('archResultNum').textContent = `${archScore} / 100 pts`;
    const msgs = [[100,'🏆 ¡Perfecto! Sos un arquitecto de sistemas de alto rendimiento.'],[75,'🎯 Muy bien. Entendés las trade-offs entre CPU, GPU, cluster y cloud.'],[50,'📚 Bien. Repasá la sección de hardware para reforzar.'],[0,'🔁 El hardware HPC tiene muchas capas. Volvé a la sección CPU vs GPU.']];
    const msg = msgs.find(([min]) => archScore >= min);
    document.getElementById('archResultMsg').textContent = msg ? msg[1] : '';
  } else { archRender(); }
}

function archRestart() {
  archIdx = 0; archScore = 0;
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
    opts: ['Amdahl es para CPU, Gustafson es para GPU','Amdahl asume tamaño fijo; Gustafson asume que el problema escala con los cores','Gustafson siempre predice mayor speedup sin importar el contexto','No hay diferencia real, son equivalentes matemáticamente'],
    correct: 1,
    feedback: 'Amdahl mantiene el tamaño del problema fijo → speedup converge a 1/(1-P). Gustafson observa que en HPC real, con más cores se resuelve un problema mayor en el mismo tiempo → S(N) = N − (1−P)·(N−1), casi lineal.',
  },
  {
    q: '¿Por qué una GPU con 14.000 cores simples puede ser más rápida que una CPU con 8 cores complejos para ML training?',
    opts: ['Porque la GPU tiene más frecuencia de reloj','Porque la GPU tiene mejor compilador de Java','Porque el ML training aplica la misma operación a millones de elementos independientes (SIMD masivo)','Porque la GPU tiene más memoria RAM'],
    correct: 2,
    feedback: 'ML training = multiplicaciones de matrices enormes. La misma operación aplicada a millones de pesos en paralelo. Esto es SIMD puro — exactamente para lo que se diseñó la GPU. Sus 14K cores simples ejecutan la misma instrucción sobre diferentes datos simultáneamente.',
  },
  {
    q: '¿Qué es el "warp divergence" en programación GPU?',
    opts: ['Cuando dos GPUs en un cluster no están sincronizadas','Cuando threads del mismo warp (32 threads) toman distintas ramas de un if/else y algunos deben esperar','Cuando la VRAM se llena y hay que hacer swap','Cuando el driver CUDA tiene un bug que causa resultados incorrectos'],
    correct: 1,
    feedback: 'Una GPU ejecuta grupos de 32 threads (warps) con la MISMA instrucción simultáneamente (SIMT). Si un if/else divide los threads, la GPU serializa: ejecuta el if con los idle threads esperando, luego el else. Resultado: pérdida de paralelismo en código con mucho branching.',
  },
  {
    q: 'Para una simulación CFD con fuertes dependencias entre celdas vecinas, ¿qué arquitectura es más adecuada?',
    opts: ['GPU farm — maximiza el throughput paralelo','ASIC dedicado — máxima eficiencia energética','Supercomputador HPC con MPI — maneja dependencias mediante comunicación entre procesos','Cloud Spot instances — reduce el costo'],
    correct: 2,
    feedback: 'CFD tiene stencil computations — cada celda depende de sus vecinas. Requiere comunicación frecuente entre workers. MPI (Message Passing Interface) es el estándar: cada nodo procesa su porción del dominio y comunica los bordes. Clusters HPC con InfiniBand (< 0.5µs) minimizan el overhead de esta comunicación.',
  },
  {
    q: '¿Cuál es la principal ventaja de las "spot instances" para ML training?',
    opts: ['Son más rápidas que las instancias normales','Tienen más VRAM disponible','Reducen el costo hasta 90% aprovechando capacidad no utilizada, con posibles interrupciones manejadas con checkpointing','Permiten correr código sin contenedores'],
    correct: 2,
    feedback: 'Spot/preemptible instances son capacidad no utilizada vendida con 70-90% de descuento. Pueden interrumpirse con ~2 min de aviso. Para ML training esto es aceptable con checkpointing frecuente: guardás el estado del modelo cada N pasos y retomás desde ahí si la instancia se interrumpe.',
  },
  {
    q: 'En la topología Fat-Tree usada por los TOP500, ¿cuál es el rol del interconnect InfiniBand?',
    opts: ['Conectar GPUs dentro del mismo servidor (función de NVLink)','Proporcionar acceso a internet para los nodos','Conectar nodos con latencia < 0.5µs y 200Gb/s de bandwidth para comunicación MPI casi sin overhead','Reemplazar el almacenamiento HDD por NVMe'],
    correct: 2,
    feedback: 'InfiniBand ofrece lo que HPC necesita: latencia ultrabajas (< 0.5µs) y alto bandwidth (200Gb/s). En Frontier (9.408 nodos), la computación distribuida requiere coordinación frecuente. Con Ethernet (5µs), el overhead de comunicación MPI se comería la mayoría de los ciclos de cómputo. Fat-Tree garantiza el mismo ancho de banda entre cualquier par de nodos.',
  },
  {
    q: '¿Qué es HBM (High Bandwidth Memory) y por qué es crítica para ML en GPU?',
    opts: ['Es un protocolo de red para conectar múltiples GPUs','Memoria 3D apilada sobre el chip GPU con TB/s de bandwidth — crucial porque el cuello de botella en ML es mover pesos desde memoria','Es el nombre del bus PCIe que conecta GPU con CPU','High-performance Blob Memory — sistema de storage para datasets'],
    correct: 1,
    feedback: 'En ML, el cuello de botella real no suele ser los FLOPS sino el ancho de banda de memoria: traer los pesos del modelo desde VRAM al chip. HBM es memoria DRAM apilada 3D directamente sobre el chip GPU, permitiendo 3.35 TB/s (H100 HBM3) vs ~1 TB/s de GDDR6. Sin HBM, los TFLOPS del chip estarían idle esperando datos.',
  },
  {
    q: 'Con P=0.95 (95% paralelo) y 64 cores, ¿cuál es el speedup según Amdahl? S(N) = 1/((1−P) + P/N)',
    opts: ['×64 (speedup lineal perfecto)','≈×15.4 — el cuello de botella serial del 5% limita el speedup','×95 — proporcional a la fracción paralela','×20 — el techo teórico con ∞ cores'],
    correct: 1,
    feedback: 'S(64) = 1/((1-0.95) + 0.95/64) = 1/(0.05 + 0.0148) = 1/0.0648 ≈ ×15.4. El techo teórico (N→∞) sería ×20. Con 64 cores ya estamos cerca del límite — agregar más cores da retornos decrecientes. Gustafson daría S(64) = 64 - 0.05×63 ≈ ×60.9, mucho más optimista porque asume que el problema escala.',
  },
];

let q7Idx      = 0;
let q7Score    = 0;
let q7Answered = false;

function quiz7Render() {
  const q = QUIZ7[q7Idx];
  if (!q) return;
  const pct = ((q7Idx+1) / QUIZ7.length * 100).toFixed(0);
  document.getElementById('q7ProgressBar').style.width    = `${pct}%`;
  document.getElementById('q7ProgressLabel').textContent  = `Pregunta ${q7Idx+1} de ${QUIZ7.length}`;
  document.getElementById('q7Question').textContent       = q.q;
  document.getElementById('q7Options').innerHTML = q.opts
    .map((o,i) => `<button class="m7quizOption" onclick="quiz7Answer(${i})">${o}</button>`).join('');
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
  if (idx === q.correct) q7Score++;
  const fb = document.getElementById('q7Feedback');
  if (fb) {
    fb.textContent  = q.feedback;
    fb.className    = `m7quizFeedback ${idx === q.correct ? 'm7quizFeedbackOk' : 'm7quizFeedbackWrong'}`;
    fb.style.display = 'block';
  }
  const btn = document.getElementById('q7NextBtn');
  if (btn) {
    btn.style.display = 'inline-flex';
    btn.innerHTML = q7Idx < QUIZ7.length-1
      ? 'Siguiente <i class="ph-bold ph-arrow-right"></i>'
      : 'Ver resultado <i class="ph-bold ph-trophy"></i>';
  }
}

function quiz7Next() {
  q7Idx++;
  if (q7Idx >= QUIZ7.length) {
    ['q7ProgressBar','q7ProgressLabel','q7Question','q7Options','q7Feedback','q7NextBtn'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { if (id === 'q7ProgressBar') el.parentElement.style.display = 'none'; else el.style.display = 'none'; }
    });
    const res = document.getElementById('q7Result');
    res.style.display = 'block';
    document.getElementById('q7ResultNum').textContent = `${q7Score} / ${QUIZ7.length}`;
    const pct = q7Score / QUIZ7.length * 100;
    document.getElementById('q7ResultMsg').textContent =
      pct === 100 ? '🏆 ¡Perfecto! Dominás HPC, Gustafson, GPU y cloud.' :
      pct >= 75   ? '🎯 Muy sólido. Repasá las preguntas que erraste.' :
      pct >= 50   ? '📚 Buen inicio. Algunos conceptos de GPU y Gustafson necesitan refuerzo.' :
                   '🔁 Repasá el módulo completo, especialmente GPU architecture y leyes de escalado.';
  } else { quiz7Render(); }
}

function quiz7Restart() {
  q7Idx = 0; q7Score = 0;
  ['q7ProgressLabel','q7Question','q7Options'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  });
  const bar = document.getElementById('q7ProgressBar');
  if (bar) bar.parentElement.style.display = '';
  document.getElementById('q7Result').style.display = 'none';
  quiz7Render();
}

/* ═══════════════════════════════════════════
   FLIP CARDS
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
  style.textContent = `.reveal{opacity:0;transform:translateY(22px);transition:opacity .5s ease,transform .5s ease}.reveal.visible{opacity:1;transform:none}`;
  document.head.appendChild(style);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.style.getPropertyValue('--delay')) || 0;
        setTimeout(() => e.target.classList.add('visible'), delay);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

function initReadProgress() {
  const bar = document.getElementById('readProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = `${(h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100}%`;
  });
}

function initCursorGlow() {
  const glow = document.getElementById('mglow');
  if (!glow) return;
  document.addEventListener('mousemove', e => {
    glow.style.transform = `translate(${e.clientX-140}px, ${e.clientY-140}px)`;
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
  drawClusterSvg();
  updateCloudCost();
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
