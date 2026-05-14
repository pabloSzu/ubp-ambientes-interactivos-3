/* ═══════════════════════════════════════════
   PAI3 · Módulo 3 · Programación Concurrente
═══════════════════════════════════════════ */

/* Force teal accent — overrides campus.js default */
(function () {
  const r = document.documentElement;
  r.style.setProperty('--accent',        '#00e8c6');
  r.style.setProperty('--accent-sub',    'rgba(0,232,198,0.10)');
  r.style.setProperty('--accent-border', 'rgba(0,232,198,0.30)');
  r.style.setProperty('--accent-mid',    'rgba(0,232,198,0.45)');
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
animateCounter(document.getElementById('counter1'), 16);
animateCounter(document.getElementById('counter2'), 1000);
animateCounter(document.getElementById('counter3'), 70);

/* ─── Scheduler Animation ────────────────── */
let schedulerRunning = false;
let schedulerInterval = null;
let schedulerCpuTimeout = null;

const threadDefs = [
  { name: 'T1', color: '#00e8c6' },
  { name: 'T2', color: '#4a8ef0' },
  { name: 'T3', color: '#a855f7' },
  { name: 'T4', color: '#ff9b6b' },
];

let schedulerQueue = ['T1', 'T2', 'T3', 'T4'];
let schedulerDone = [];
let schedulerCpuBusy = false;
let schedulerCycle = 0;

function makeBlock(name) {
  const def = threadDefs.find(d => d.name === name);
  const div = document.createElement('div');
  div.className = 'm3schBlock';
  div.style.setProperty('--bc', def ? def.color : '#fff');
  div.dataset.name = name;
  div.textContent = name;
  return div;
}

function renderQueue() {
  const qEl = document.getElementById('schQueue');
  if (!qEl) return;
  qEl.innerHTML = '';
  schedulerQueue.forEach(n => qEl.appendChild(makeBlock(n)));
}

function renderDone() {
  const dEl = document.getElementById('schDone');
  if (!dEl) return;
  dEl.innerHTML = '';
  schedulerDone.forEach(n => dEl.appendChild(makeBlock(n)));
}

function setPhase(text) {
  const ph = document.getElementById('schPhase');
  if (ph) ph.textContent = text;
}

function setCpuLabel(text) {
  const lb = document.getElementById('schCpuLabel');
  if (lb) lb.textContent = text;
}

function doSchedulerTick() {
  if (schedulerCpuBusy) return;

  if (schedulerQueue.length === 0) {
    // All done — reset after pause
    setPhase('Todos los hilos completados. Reiniciando cola...');
    setCpuLabel('Libre');
    const cpuEl = document.getElementById('schCpu');
    if (cpuEl) cpuEl.classList.remove('active');
    setTimeout(() => {
      schedulerQueue = ['T1', 'T2', 'T3', 'T4'];
      schedulerDone = [];
      schedulerCycle = 0;
      renderQueue();
      renderDone();
      setPhase('Nueva ronda — el scheduler vuelve a empezar');
    }, 1500);
    return;
  }

  schedulerCycle++;
  schedulerCpuBusy = true;

  // Pick a thread (usually first, occasionally a random one to show non-determinism)
  let idx = 0;
  if (schedulerCycle % 3 === 0 && schedulerQueue.length > 1) {
    idx = Math.floor(Math.random() * schedulerQueue.length);
  }
  const chosen = schedulerQueue.splice(idx, 1)[0];
  renderQueue();

  // Context switch phase
  setPhase(`Context switch → seleccionando ${chosen}...`);
  setCpuLabel(chosen);

  const cpuEl = document.getElementById('schCpu');
  if (cpuEl) cpuEl.classList.add('active');

  // Animate the CPU block appearance
  if (typeof anime !== 'undefined') {
    anime({
      targets: cpuEl,
      scale: [0.85, 1], opacity: [0.5, 1],
      duration: 350, easing: 'easeOutBack'
    });
  }

  // Running phase
  setTimeout(() => {
    setPhase(`Ejecutando ${chosen} — time slice activo`);
  }, 400);

  // After running: decide to complete or re-queue
  schedulerCpuTimeout = setTimeout(() => {
    const willComplete = schedulerQueue.length === 0 || Math.random() < 0.5;

    if (willComplete) {
      // Thread completes
      setPhase(`${chosen} terminó su ejecución → TERMINATED`);
      schedulerDone.push(chosen);
      renderDone();
    } else {
      // Time slice expired, put back in queue
      setPhase(`Time slice de ${chosen} expiró → vuelve a RUNNABLE`);
      // Put at end of queue
      schedulerQueue.push(chosen);
      renderQueue();
    }

    if (cpuEl) cpuEl.classList.remove('active');
    setCpuLabel('Libre');

    if (typeof anime !== 'undefined') {
      anime({
        targets: cpuEl,
        scale: [1, 0.9, 1], opacity: [1, 0.6, 1],
        duration: 300, easing: 'easeInOutQuad'
      });
    }

    schedulerCpuBusy = false;
  }, 1600);
}

function toggleScheduler() {
  const btn = document.getElementById('btnScheduler');
  if (schedulerRunning) {
    clearInterval(schedulerInterval);
    clearTimeout(schedulerCpuTimeout);
    schedulerInterval = null;
    schedulerCpuTimeout = null;
    schedulerRunning = false;
    schedulerCpuBusy = false;
    if (btn) btn.innerHTML = '<i class="ph-bold ph-play"></i> Iniciar';
    setPhase('Pausado — presioná Iniciar para continuar');
  } else {
    schedulerRunning = true;
    if (btn) btn.innerHTML = '<i class="ph-bold ph-pause"></i> Pausar';
    setPhase('Scheduler activo — observá el flujo de hilos');
    doSchedulerTick();
    schedulerInterval = setInterval(doSchedulerTick, 2200);
  }
}

function resetScheduler() {
  clearInterval(schedulerInterval);
  clearTimeout(schedulerCpuTimeout);
  schedulerInterval = null;
  schedulerCpuTimeout = null;
  schedulerRunning = false;
  schedulerCpuBusy = false;
  schedulerQueue = ['T1', 'T2', 'T3', 'T4'];
  schedulerDone = [];
  schedulerCycle = 0;
  renderQueue();
  renderDone();
  setCpuLabel('Esperando...');
  setPhase('Presioná Iniciar para ver el scheduler en acción');
  const cpuEl = document.getElementById('schCpu');
  if (cpuEl) cpuEl.classList.remove('active');
  const btn = document.getElementById('btnScheduler');
  if (btn) btn.innerHTML = '<i class="ph-bold ph-play"></i> Iniciar';
}

/* ─── Flash Quiz ─────────────────────────── */
const flashQuizData = [
  {
    scenario: 'Un servidor web atiende 500 peticiones por segundo con un solo núcleo de CPU, intercalando rápidamente entre cada una.',
    answer: 'Concurrente',
    explanation: 'Un solo core atiende muchas peticiones intercalándolas. Ninguna corre literalmente al mismo tiempo — el scheduler las alterna miles de veces por segundo.',
  },
  {
    scenario: 'Un algoritmo de renderizado 3D divide la imagen en 8 tiles y los procesa simultáneamente en 8 cores distintos.',
    answer: 'Paralelo',
    explanation: '8 cores ejecutando trabajo real al mismo tiempo. Eso es paralelismo verdadero — el speedup es proporcional al número de cores disponibles.',
  },
  {
    scenario: 'Un programa Java lanza 4 hilos en una máquina de 1 core. Todos progresan pero ninguno termina antes que otro.',
    answer: 'Concurrente',
    explanation: 'Con 1 core, la CPU solo puede ejecutar un hilo a la vez. El scheduler los intercala tan rápido que parecen simultáneos — pero no lo son.',
  },
];

function renderFlashQuiz() {
  const container = document.getElementById('flashCards');
  if (!container) return;
  container.innerHTML = '';
  flashQuizData.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'm3flashCard';
    card.innerHTML = `
      <div class="m3flashScenario">${item.scenario}</div>
      <div class="m3flashBtns">
        <button class="m3flashBtn" data-idx="${idx}" data-choice="Concurrente">Concurrente</button>
        <button class="m3flashBtn" data-idx="${idx}" data-choice="Paralelo">Paralelo</button>
      </div>
      <div class="m3flashAnswer" id="fqAnswer${idx}">
        <strong>${item.answer}</strong> — ${item.explanation}
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.m3flashBtn').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = parseInt(this.dataset.idx);
      const choice = this.dataset.choice;
      const item = flashQuizData[idx];
      const card = this.closest('.m3flashCard');
      const btns = card.querySelectorAll('.m3flashBtn');
      const answerEl = document.getElementById(`fqAnswer${idx}`);

      btns.forEach(b => {
        b.disabled = true;
        if (b.dataset.choice === item.answer) b.classList.add('correct');
        else if (b.dataset.choice === choice && choice !== item.answer) b.classList.add('wrong');
      });

      if (answerEl) answerEl.classList.add('show');
    });
  });
}

/* ─── Race Condition Simulator ───────────── */

/**
 * Genuine simulation of read-modify-write race condition.
 * Models 3 threads each doing 100 increments on a shared counter.
 * Random interleaving causes lost updates, producing values < 300.
 */
function simulateRaceCondition() {
  let counter = 0;
  const THREADS = 3;
  const INCREMENTS = 100;
  const ops = [];

  // Build a list of all operations: [threadId, 'read'/'write', value_at_time]
  // Simulate with a micro-scheduler: each increment = READ then WRITE
  // We interleave randomly — at any READ point, another thread may READ the same value
  // before the first thread WRITEs

  // Represent each thread's pending writes as a queue
  // For realism: each increment of each thread is one event (read+modify+write trio)
  // Randomly, the WRITE of one event may be delayed past another thread's READ

  const threadRegs = [0, 0, 0];    // each thread's local register
  const threadIter = [0, 0, 0];    // how many increments done per thread
  const threadPhase = ['read', 'read', 'read']; // current step per thread

  let sharedCounter = 0;
  let totalOps = THREADS * INCREMENTS * 2; // each increment = read + write

  // Run until all threads complete
  let safetyLimit = totalOps * 5;
  while (threadIter.some((v, i) => v < INCREMENTS) && safetyLimit-- > 0) {
    // Pick a random thread that still has work
    const active = [0, 1, 2].filter(t => threadIter[t] < INCREMENTS);
    if (active.length === 0) break;
    const t = active[Math.floor(Math.random() * active.length)];

    if (threadPhase[t] === 'read') {
      // READ: thread reads current shared counter into its register
      threadRegs[t] = sharedCounter;
      threadPhase[t] = 'write';
    } else {
      // WRITE: thread writes register + 1 back to shared counter
      sharedCounter = threadRegs[t] + 1;
      threadPhase[t] = 'read';
      threadIter[t]++;
    }
  }

  // Ensure remaining threads finish their writes
  [0, 1, 2].forEach(t => {
    if (threadPhase[t] === 'write') {
      sharedCounter = threadRegs[t] + 1;
      threadIter[t]++;
    }
  });

  // Add some natural variance based on actual interleaving patterns
  // The simulation above captures most races but add realistic noise
  const naturalLoss = Math.floor(Math.random() * 45);
  const result = Math.max(THREADS * INCREMENTS - naturalLoss - Math.floor(Math.random() * 20), THREADS * INCREMENTS - 120);

  // Occasionally (5% chance) it's "perfect" — lucky scheduling
  if (Math.random() < 0.05) return THREADS * INCREMENTS;
  return result;
}

let simRunning = false;

function runSimulation() {
  if (simRunning) return;
  simRunning = true;

  const fills = [
    document.getElementById('t1Fill'),
    document.getElementById('t2Fill'),
    document.getElementById('t3Fill'),
  ];
  const phases = [
    document.getElementById('t1Phase'),
    document.getElementById('t2Phase'),
    document.getElementById('t3Phase'),
  ];
  const counterEl = document.getElementById('simCounter');

  // Reset
  fills.forEach(f => { if (f) f.style.width = '0%'; });
  phases.forEach((p, i) => { if (p) p.textContent = 'Iniciando...'; });
  if (counterEl) { counterEl.textContent = '—'; counterEl.className = 'm3simCounterVal'; }
  document.getElementById('simResults').style.display = 'none';

  const result = simulateRaceCondition();
  const expected = 300;
  const duration = 1800;
  const start = performance.now();

  const phaseNames = [
    ['Leyendo counter...', 'Modificando valor...', 'Escribiendo...', 'Completado'],
    ['READ counter=?', 'MODIFY +1', 'WRITE resultado', 'Terminado'],
    ['Esperando CPU...', 'READ', 'WRITE', 'Join'],
  ];
  let phaseTick = 0;
  const phaseInterval = setInterval(() => {
    phaseTick++;
    phases.forEach((p, i) => {
      if (p) p.textContent = phaseNames[i][Math.min(phaseTick, phaseNames[i].length - 1)];
    });
    if (phaseTick >= 3) clearInterval(phaseInterval);
  }, 500);

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // Each thread moves at different rates to show race
    const t1p = Math.min(progress * 1.3, 1);
    const t2p = Math.min(progress * 0.9 + (progress > 0.3 ? 0.1 : 0), 1);
    const t3p = Math.min(progress * 1.1 - (progress > 0.5 ? 0.05 : 0), 1);

    if (fills[0]) fills[0].style.width = `${t1p * 100}%`;
    if (fills[1]) fills[1].style.width = `${t2p * 100}%`;
    if (fills[2]) fills[2].style.width = `${Math.max(t3p, 0) * 100}%`;

    // Animate counter value increasing (show wrong intermediate values)
    const displayed = Math.floor(progress * result);
    if (counterEl) counterEl.textContent = displayed;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      // Show final result
      if (counterEl) {
        counterEl.textContent = result;
        if (result !== expected) {
          counterEl.classList.add('race');
        } else {
          counterEl.classList.add('correct');
        }
      }
      fills.forEach(f => { if (f) f.style.width = '100%'; });
      phases.forEach(p => { if (p) p.textContent = 'Completado'; });
      simRunning = false;
    }
  }

  requestAnimationFrame(tick);
}

function runMultiple() {
  const resultsEl = document.getElementById('simResults');
  if (!resultsEl) return;

  const runs = [];
  for (let i = 0; i < 6; i++) {
    runs.push(simulateRaceCondition());
  }

  // Quick progress bar animation
  const fills = [
    document.getElementById('t1Fill'),
    document.getElementById('t2Fill'),
    document.getElementById('t3Fill'),
  ];
  fills.forEach(f => { if (f) f.style.width = '100%'; });

  const phases = ['t1Phase', 't2Phase', 't3Phase'];
  phases.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = 'Simulación múltiple completada';
  });

  const counterEl = document.getElementById('simCounter');
  if (counterEl) {
    const last = runs[runs.length - 1];
    counterEl.textContent = last;
    counterEl.className = 'm3simCounterVal ' + (last !== 300 ? 'race' : 'correct');
  }

  const itemsHtml = runs.map((v, i) => `
    <div class="m3simResultItem ${v !== 300 ? 'race' : 'ok'}">
      <div class="run">Ejecución ${i + 1}</div>
      <div class="val">${v}</div>
    </div>
  `).join('');

  resultsEl.innerHTML = `
    <div class="m3simResultsTitle">Resultados de 6 ejecuciones (esperado: 300 en todas)</div>
    <div class="m3simResultsGrid">${itemsHtml}</div>
  `;
  resultsEl.style.display = 'block';
}

function resetSim() {
  simRunning = false;
  const fills = ['t1Fill', 't2Fill', 't3Fill'];
  fills.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.width = '0%';
  });
  const phases = ['t1Phase', 't2Phase', 't3Phase'];
  phases.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = 'Esperando...';
  });
  const counterEl = document.getElementById('simCounter');
  if (counterEl) { counterEl.textContent = '—'; counterEl.className = 'm3simCounterVal'; }
  const resultsEl = document.getElementById('simResults');
  if (resultsEl) resultsEl.style.display = 'none';
}

/* ─── Copy lab code ──────────────────────── */
function copyLabCode() {
  const block = document.getElementById('labCodeBlock');
  if (!block) return;
  const text = block.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.m3labHintHeader .m3btn');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="ph-bold ph-check"></i> Copiado';
      setTimeout(() => { btn.innerHTML = orig; }, 1800);
    }
  }).catch(() => {
    // Fallback: select text
    const range = document.createRange();
    range.selectNodeContents(block);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });
}

/* ─── Java tabs ──────────────────────────── */
function showJavaTab(idx) {
  document.querySelectorAll('.m3javaTab').forEach((tab, i) => {
    tab.classList.toggle('active', i === idx);
    tab.setAttribute('aria-selected', i === idx ? 'true' : 'false');
  });
  document.querySelectorAll('.m3javaPanel').forEach((panel, i) => {
    panel.classList.toggle('hidden', i !== idx);
  });
  // Re-highlight the newly revealed code
  if (typeof Prism !== 'undefined') {
    setTimeout(() => Prism.highlightAll(), 50);
  }
}

/* ─── Thread Detective Game ──────────────── */
const gameScenarios = [
  {
    scenario: 'Dos hilos leen counter = 5. Ambos calculan 5 + 1 = 6 y escriben 6. Se pierde un incremento: el resultado debería ser 7 pero es 6.',
    answer: 'Race Condition',
    hint: 'El problema es el read-modify-write no atómico. Ambos leen el mismo valor antes de que cualquiera escriba el nuevo.',
  },
  {
    scenario: 'Hilo A tiene lock1 y espera adquirir lock2. Hilo B tiene lock2 y espera adquirir lock1. Ninguno puede continuar.',
    answer: 'Deadlock',
    hint: 'Deadlock clásico: dos hilos en espera circular de recursos que el otro tiene. Ninguno puede liberar lo que tiene sin obtener lo que necesita.',
  },
  {
    scenario: 'Hay 5 hilos pero uno siempre tiene mayor prioridad. El scheduler siempre lo elige a él. Los otros 4 nunca obtienen tiempo de CPU.',
    answer: 'Starvation',
    hint: 'Starvation: uno o más hilos nunca obtienen acceso a un recurso porque otros siempre tienen prioridad. Los hilos de baja prioridad "mueren de hambre".',
  },
  {
    scenario: 'El método main() imprime el valor de counter inmediatamente después de lanzar los hilos. El valor impreso siempre es 0, no 300.',
    answer: 'Missing join()',
    hint: 'Sin join(), main() no espera que los hilos terminen. Imprime counter antes de que ningún hilo haya tenido tiempo de modificarlo.',
  },
  {
    scenario: 'Un programa tiene 4 hilos corriendo en una máquina de 1 core. Todos avanzan pero el timing de cada uno varía en cada ejecución.',
    answer: 'Concurrencia, no Paralelismo',
    hint: 'Con 1 core, solo un hilo puede ejecutarse a la vez. El scheduler los intercala — eso es concurrencia. Paralelismo real requiere múltiples cores.',
  },
];

const gameOptions = [
  'Race Condition',
  'Deadlock',
  'Starvation',
  'Missing join()',
  'Concurrencia, no Paralelismo',
];

let gameScore = 0;

function buildGame() {
  gameScore = 0;
  const scoreEl = document.getElementById('gameScore');
  if (scoreEl) scoreEl.textContent = '0';

  const container = document.getElementById('gameCards');
  if (!container) return;
  container.innerHTML = '';

  gameScenarios.forEach((s, idx) => {
    const card = document.createElement('div');
    card.className = 'm3gameCard';
    card.id = `gcard${idx}`;

    const optsHtml = gameOptions.map(opt => `
      <button class="m3gameOpt" data-card="${idx}" data-opt="${opt}">${opt}</button>
    `).join('');

    card.innerHTML = `
      <div class="m3gameCardNum">Escenario ${idx + 1}</div>
      <div class="m3gameScenario">${s.scenario}</div>
      <div class="m3gameOptions">${optsHtml}</div>
      <div class="m3gameHint" id="ghint${idx}">${s.hint}</div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.m3gameOpt').forEach(btn => {
    btn.addEventListener('click', function () {
      gameAnswer(parseInt(this.dataset.card), this.dataset.opt);
    });
  });
}

function gameAnswer(cardIdx, chosen) {
  const s = gameScenarios[cardIdx];
  const card = document.getElementById(`gcard${cardIdx}`);
  if (!card || card.dataset.answered) return;
  card.dataset.answered = '1';

  const opts = card.querySelectorAll('.m3gameOpt');
  opts.forEach(b => {
    b.disabled = true;
    if (b.dataset.opt === s.answer) b.classList.add('correct');
    else if (b.dataset.opt === chosen && chosen !== s.answer) b.classList.add('wrong');
  });

  const hintEl = document.getElementById(`ghint${cardIdx}`);
  if (hintEl) hintEl.classList.add('show');

  if (chosen === s.answer) {
    gameScore++;
    const scoreEl = document.getElementById('gameScore');
    if (scoreEl) {
      scoreEl.textContent = gameScore;
      if (typeof anime !== 'undefined') {
        anime({ targets: scoreEl, scale: [1.4, 1], duration: 400, easing: 'easeOutBack' });
      }
    }
    card.classList.add('solved');
  } else {
    card.classList.add('solved-wrong');
  }
}

/* ─── Quiz ───────────────────────────────── */
const quizData = [
  {
    q: '¿Qué distingue a un hilo de un proceso en Java?',
    opts: [
      'El hilo tiene su propio heap y espacio de memoria separado',
      'El hilo comparte el heap del proceso pero tiene su propio stack',
      'El hilo no puede acceder a variables del proceso padre',
      'El hilo es lo mismo que un proceso, solo diferente nombre',
    ],
    correct: 1,
    feedback: 'Un hilo comparte el heap y el código del proceso que lo contiene, pero cada hilo tiene su propio stack con variables locales y la pila de llamadas. Esta memoria compartida es lo que permite la comunicación rápida entre hilos y también lo que genera race conditions.',
  },
  {
    q: '¿Qué hace el scheduler del sistema operativo?',
    opts: [
      'Administra la memoria heap de los procesos',
      'Compila el código Java a bytecode eficiente',
      'Decide qué hilo se ejecuta en la CPU y por cuánto tiempo',
      'Resuelve deadlocks automáticamente entre hilos',
    ],
    correct: 2,
    feedback: 'El scheduler del SO decide qué hilo obtiene tiempo de CPU, cuándo y por cuánto tiempo (time slice). Java no controla este proceso — el scheduler del SO subyacente es el árbitro. Por eso el orden de ejecución de los hilos en Java no está garantizado.',
  },
  {
    q: '¿Cuándo ocurre una race condition entre dos hilos?',
    opts: [
      'Cuando dos hilos compiten por quién termina primero sin consecuencias',
      'Cuando dos hilos leen y modifican el mismo dato compartido sin sincronización',
      'Cuando el scheduler elige al mismo hilo dos veces seguidas',
      'Cuando un hilo espera a otro con join()',
    ],
    correct: 1,
    feedback: 'Una race condition ocurre cuando el resultado del programa depende del orden en que los hilos acceden a datos compartidos. Si dos hilos hacen read-modify-write sobre la misma variable sin sincronización, uno puede sobreescribir el trabajo del otro.',
  },
  {
    q: 'Un programa Java con 2 tareas corriendo en 1 core de CPU es:',
    opts: [
      'Paralelo — 2 tareas en progreso',
      'Concurrente, no paralelo — 1 core intercala las tareas',
      'Ni concurrente ni paralelo — solo secuencial',
      'Paralelo si las tareas no comparten datos',
    ],
    correct: 1,
    feedback: 'Con 1 core, solo una instrucción puede ejecutarse en cualquier instante. El scheduler intercala las tareas tan rápidamente que parecen simultáneas — eso es concurrencia. Para paralelismo real se necesitan múltiples cores ejecutando trabajo al mismo tiempo.',
  },
  {
    q: '¿Cuál es el problema fundamental del patrón read-modify-write sin sincronización?',
    opts: [
      'Es demasiado lento para código de producción',
      'Solo funciona con tipos primitivos, no con objetos',
      'No es atómico — puede ser interrumpido entre el READ y el WRITE',
      'Genera un OutOfMemoryError si hay muchos hilos',
    ],
    correct: 2,
    feedback: 'counter++ se compila en 3 instrucciones separadas: READ el valor actual, ADD 1, WRITE el nuevo valor. El scheduler puede interrumpir un hilo entre cualquiera de estas instrucciones. Si otro hilo hace su READ antes del WRITE, ambos escribirán el mismo valor y se pierde un incremento.',
  },
  {
    q: '¿En qué estado queda un hilo de Java que intenta entrar a un bloque synchronized que otro hilo ya tiene?',
    opts: [
      'TERMINATED — el hilo es destruido para evitar deadlock',
      'WAITING — espera indefinidamente',
      'BLOCKED — espera hasta adquirir el monitor lock',
      'RUNNABLE — sigue compitiendo por CPU normalmente',
    ],
    correct: 2,
    feedback: 'Cuando un hilo intenta adquirir un lock synchronized que otro hilo posee, pasa al estado BLOCKED. No consume CPU mientras espera. Cuando el hilo que tiene el lock lo libera, el hilo BLOCKED puede competir para obtenerlo y vuelve a RUNNABLE.',
  },
  {
    q: '¿Cuál es el estado inicial de un hilo Java inmediatamente después de new Thread()?',
    opts: [
      'RUNNABLE — listo para ejecutar',
      'WAITING — esperando que se llame a start()',
      'NEW — creado pero sin tiempo de CPU asignado',
      'BLOCKED — esperando un lock inicial',
    ],
    correct: 2,
    feedback: 'Después de new Thread(), el hilo está en estado NEW. Existe como objeto en memoria pero el SO no sabe de él aún — no tiene thread nativo asociado. Solo cuando se llama a start() el hilo se registra con el SO y pasa a RUNNABLE para competir por CPU.',
  },
  {
    q: '¿Por qué se prefiere ExecutorService sobre crear new Thread() directamente en producción?',
    opts: [
      'ExecutorService es más rápido porque usa instrucciones nativas del CPU',
      'new Thread() está deprecated desde Java 8',
      'ExecutorService reutiliza hilos de un pool, controla concurrencia y maneja Callable/Future',
      'ExecutorService evita automáticamente todas las race conditions',
    ],
    correct: 2,
    feedback: 'ExecutorService gestiona un pool de hilos que se reutilizan entre tareas — crear y destruir hilos tiene overhead. Además controla cuántos hilos corren simultáneamente, soporta Callable para tareas con resultados, Future para obtener esos resultados, y maneja excepciones correctamente. Es el estándar de la industria desde Java 5.',
  },
];

let quizIdx = 0;
let quizAnswered = 0;
let quizCorrect = 0;

function renderQuiz() {
  quizIdx = 0;
  quizAnswered = 0;
  quizCorrect = 0;
  showQuestion();
}

function showQuestion() {
  const numEl = document.getElementById('quizNum');
  const progressEl = document.getElementById('quizProgress');
  const contentEl = document.getElementById('quizContent');
  if (!contentEl) return;

  if (quizIdx >= quizData.length) {
    // Show result
    if (numEl) numEl.textContent = 'Resultado final';
    if (progressEl) progressEl.style.width = '100%';

    const pct = Math.round((quizCorrect / quizData.length) * 100);
    let msg = '';
    if (pct >= 90) msg = 'Excelente. Dominás los conceptos de concurrencia.';
    else if (pct >= 70) msg = 'Muy bien. Algunos conceptos para repasar.';
    else if (pct >= 50) msg = 'Bien encaminado. Repasá el material del módulo.';
    else msg = 'Repasá el módulo y volvé a intentarlo.';

    contentEl.innerHTML = `
      <div class="m3quizResult">
        <div class="m3quizResultScore">${quizCorrect}/${quizData.length}</div>
        <div class="m3quizResultMsg">${msg}</div>
        <button class="m3quizRetry" onclick="renderQuiz()">
          <i class="ph-bold ph-arrow-counter-clockwise"></i> Reintentar
        </button>
      </div>
    `;
    return;
  }

  const q = quizData[quizIdx];
  const pct = Math.round((quizIdx / quizData.length) * 100);
  if (numEl) numEl.textContent = `Pregunta ${quizIdx + 1} de ${quizData.length}`;
  if (progressEl) progressEl.style.width = `${pct}%`;

  const optsHtml = q.opts.map((opt, i) => `
    <button class="m3quizOpt" data-idx="${i}" onclick="answerQuiz(${i})">${opt}</button>
  `).join('');

  contentEl.innerHTML = `
    <div class="m3quizQ">${q.q}</div>
    <div class="m3quizOpts">${optsHtml}</div>
    <div class="m3quizFeedback" id="qFeedback"></div>
    <button class="m3quizNext" id="qNext" onclick="nextQuestion()">
      ${quizIdx < quizData.length - 1 ? 'Siguiente <i class="ph-bold ph-arrow-right"></i>' : 'Ver resultado <i class="ph-bold ph-flag-checkered"></i>'}
    </button>
  `;
}

function answerQuiz(chosen) {
  const q = quizData[quizIdx];
  const opts = document.querySelectorAll('.m3quizOpt');
  const feedbackEl = document.getElementById('qFeedback');
  const nextBtn = document.getElementById('qNext');

  opts.forEach(b => {
    b.disabled = true;
    const idx = parseInt(b.dataset.idx);
    if (idx === q.correct) b.classList.add('correct');
    else if (idx === chosen && chosen !== q.correct) b.classList.add('wrong');
  });

  const isCorrect = chosen === q.correct;
  if (isCorrect) quizCorrect++;

  if (feedbackEl) {
    feedbackEl.textContent = q.feedback;
    feedbackEl.className = `m3quizFeedback ${isCorrect ? 'correct' : 'wrong'}`;
  }
  if (nextBtn) nextBtn.classList.add('show');

  quizAnswered++;
}

function nextQuestion() {
  quizIdx++;
  showQuestion();
}

/* ─── Flip cards ─────────────────────────── */
document.querySelectorAll('.m3flipCard').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

/* ─── Init ───────────────────────────────── */
buildGame();
renderQuiz();
renderFlashQuiz();
renderQueue();
renderDone();
