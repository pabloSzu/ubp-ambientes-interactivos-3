/* ═══════════════════════════════════════════
   PAI3 · Módulo 5 · Sincronización
═══════════════════════════════════════════ */

/* Force orange accent — overrides campus.js */
(function () {
  const r = document.documentElement;
  r.style.setProperty('--accent',        '#ff7d54');
  r.style.setProperty('--accent-sub',    'rgba(255,125,84,0.13)');
  r.style.setProperty('--accent-border', 'rgba(255,125,84,0.38)');
  r.style.setProperty('--accent-mid',    'rgba(255,125,84,0.55)');
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
animateCounter(document.getElementById('counter1'), 3);
animateCounter(document.getElementById('counter2'), 3);
animateCounter(document.getElementById('counter3'), 5);

/* ─── Code tabs ──────────────────────────── */
function switchTab(btn, panelId) {
  document.querySelectorAll('.m5codeTab').forEach(t => t.classList.remove('m5codeTabActive'));
  document.querySelectorAll('.m5codePanel').forEach(p => p.classList.add('m5codePanelHidden'));
  btn.classList.add('m5codeTabActive');
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.remove('m5codePanelHidden');
    Prism.highlightAllUnder(panel);
  }
}

/* ═══════════════════════════════════════════
   DINING PHILOSOPHERS SIMULATOR
═══════════════════════════════════════════ */

const PHIL_N = 5;

/* state per philosopher: thinking | hungry | waiting | eating | dead */
let phils = [];
let forks = [];
let simMode = 'deadlock';
let simRunning = false;
let simTickId = null;
let simDeadlockTimeouts = [];
let semPermits = 4;
let stats = { meals: 0, deadlocks: 0 };
let simStartTime = null;
let timeTickId = null;

const STATE_EMOJI = {
  thinking: '💭',
  hungry:   '🍽️',
  waiting:  '⏳',
  eating:   '😋',
  dead:     '💀'
};
const STATE_CLASS = {
  thinking: 'm5sThinking',
  hungry:   'm5sHungry',
  waiting:  'm5sWaiting',
  eating:   'm5sEating',
  dead:     'm5sDead'
};
const STATE_LABEL = {
  thinking: 'pensando',
  hungry:   'hambriento',
  waiting:  'esperando',
  eating:   'comiendo',
  dead:     'deadlock'
};

function initPhils() {
  phils = Array.from({ length: PHIL_N }, (_, i) => ({
    id: i,
    state: 'thinking',
    eatTimer: 0
  }));
  forks = Array.from({ length: PHIL_N }, (_, i) => ({
    id: i,
    held: null
  }));
  semPermits = 4;
  stats = { meals: 0, deadlocks: 0 };
  simStartTime = null;
}

function setPhilState(id, state) {
  phils[id].state = state;
  const philEl   = document.getElementById(`sp${id}`);
  const emojiEl  = document.getElementById(`se${id}`);
  const stateEl  = document.getElementById(`ss${id}`);
  if (!philEl) return;
  Object.values(STATE_CLASS).forEach(c => philEl.classList.remove(c));
  philEl.classList.add(STATE_CLASS[state]);
  if (emojiEl) emojiEl.textContent = STATE_EMOJI[state];
  if (stateEl) stateEl.textContent = STATE_LABEL[state];
}

function updateForkEl(id) {
  const el = document.getElementById(`sf${id}`);
  if (!el) return;
  el.classList.remove('m5fkHeld', 'm5fkFree');
  if (forks[id].held !== null) {
    el.classList.add('m5fkHeld');
  } else {
    el.classList.add('m5fkFree');
  }
}

function updateAllForks() {
  for (let i = 0; i < PHIL_N; i++) updateForkEl(i);
}

function addLog(msg, type = 'info') {
  const log = document.getElementById('simLog');
  if (!log) return;
  const entry = document.createElement('div');
  entry.className = `m5simLogEntry m5simLog${type.charAt(0).toUpperCase() + type.slice(1)}`;
  const now = simStartTime ? ((Date.now() - simStartTime) / 1000).toFixed(1) : '0.0';
  entry.textContent = `[${now}s] ${msg}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function updateStatus(msg) {
  const el = document.getElementById('simStatus');
  if (el) el.innerHTML = `<i class="ph ph-info"></i> ${msg}`;
}

function updateStats() {
  const meals = document.getElementById('simMeals');
  const dead  = document.getElementById('simDeadlocks');
  if (meals) meals.textContent = stats.meals;
  if (dead)  dead.textContent  = stats.deadlocks;
}

function updateTimeTick() {
  if (!simStartTime) return;
  const el = document.getElementById('simTime');
  if (el) el.textContent = ((Date.now() - simStartTime) / 1000).toFixed(0) + 's';
}

function updatePlayBtn() {
  const btn = document.getElementById('simPlayBtn');
  if (!btn) return;
  if (simRunning) {
    btn.innerHTML = '<i class="ph-bold ph-pause"></i> Pause';
  } else {
    btn.innerHTML = '<i class="ph-bold ph-play"></i> Play';
  }
}

/* ── Deadlock mode ─────────────────────── */
function runDeadlockMode() {
  simStartTime = Date.now();

  addLog('Todos los filósofos empiezan a pensar...', 'info');
  updateStatus('Los filósofos piensan...');

  const t1 = setTimeout(() => {
    if (!simRunning) return;
    for (let i = 0; i < PHIL_N; i++) setPhilState(i, 'hungry');
    addLog('¡Todos tienen hambre al mismo tiempo!', 'info');
    updateStatus('Todos quieren comer — van por el tenedor izquierdo');
  }, 1000);

  const t2 = setTimeout(() => {
    if (!simRunning) return;
    for (let i = 0; i < PHIL_N; i++) {
      forks[i].held = i;
      setPhilState(i, 'waiting');
      updateForkEl(i);
    }
    addLog('Todos tomaron su tenedor IZQUIERDO', 'wait');
    addLog('Cada filósofo espera el tenedor DERECHO de su vecino...', 'wait');
    updateStatus('Todos tienen un tenedor — esperan el otro');
  }, 2500);

  const t3 = setTimeout(() => {
    if (!simRunning) return;
    for (let i = 0; i < PHIL_N; i++) setPhilState(i, 'dead');
    addLog('🔴 DEADLOCK — nadie puede tomar el tenedor derecho', 'dead');
    addLog('El sistema está paralizado. Ningún hilo puede avanzar.', 'dead');
    stats.deadlocks++;
    updateStats();
    updateStatus('DEADLOCK detectado — el sistema está congelado');

    simRunning = false;
    updatePlayBtn();
    clearInterval(timeTickId);
  }, 4500);

  simDeadlockTimeouts = [t1, t2, t3];
}

/* ── Semaphore mode ────────────────────── */
const THINK_MIN = 800;
const THINK_MAX = 1800;
const EAT_MIN   = 1000;
const EAT_MAX   = 1600;

function randBetween(min, max) {
  return min + Math.random() * (max - min);
}

function leftFork(id)  { return id; }
function rightFork(id) { return (id + 1) % PHIL_N; }

function tryEat(id) {
  if (!simRunning || simMode !== 'semaphore') return;
  if (phils[id].state !== 'hungry') return;

  const lf = leftFork(id);
  const rf = rightFork(id);

  if (semPermits > 0 && forks[lf].held === null && forks[rf].held === null) {
    semPermits--;
    forks[lf].held = id;
    forks[rf].held = id;
    setPhilState(id, 'eating');
    updateForkEl(lf);
    updateForkEl(rf);
    addLog(`F${id} come (tenedores T${lf} y T${rf}) — semáforo: ${semPermits} permisos libres`, 'eat');
    updateStatus(`F${id} está comiendo — semáforo: ${semPermits}/4 permisos libres`);

    const eatDuration = randBetween(EAT_MIN, EAT_MAX);
    setTimeout(() => finishEating(id), eatDuration);
  } else {
    /* Can't eat yet — retry in a bit */
    if (simRunning && phils[id].state === 'hungry') {
      setTimeout(() => tryEat(id), 200 + Math.random() * 200);
    }
  }
}

function finishEating(id) {
  if (!simRunning) return;
  const lf = leftFork(id);
  const rf = rightFork(id);

  forks[lf].held = null;
  forks[rf].held = null;
  semPermits++;
  stats.meals++;
  updateStats();
  updateForkEl(lf);
  updateForkEl(rf);
  addLog(`F${id} terminó de comer — semáforo: ${semPermits} permisos libres`, 'sem');
  setPhilState(id, 'thinking');

  /* Wake anyone who was hungry and might benefit from the freed permit/forks */
  for (let i = 0; i < PHIL_N; i++) {
    if (phils[i].state === 'hungry') tryEat(i);
  }

  /* Schedule next hunger cycle */
  const thinkTime = randBetween(THINK_MIN, THINK_MAX);
  setTimeout(() => becomeHungry(id), thinkTime);
}

function becomeHungry(id) {
  if (!simRunning || simMode !== 'semaphore') return;
  setPhilState(id, 'hungry');
  addLog(`F${id} tiene hambre — pide permiso al semáforo`, 'wait');
  tryEat(id);
}

function startSemaphoreMode() {
  simStartTime = Date.now();
  addLog('Semáforo(4) iniciado — max 4 filósofos intentando a la vez', 'sem');
  updateStatus('Modo semáforo activo — 4 permisos disponibles');

  for (let i = 0; i < PHIL_N; i++) {
    const delay = i * 300 + Math.random() * 200;
    setTimeout(() => {
      if (!simRunning) return;
      becomeHungry(i);
    }, delay);
  }
}

/* ── Public controls ─────────────────────── */
function setMode(mode) {
  if (simRunning) simReset();
  simMode = mode;
  document.getElementById('modeDeadlock').classList.toggle('m5simModeActive', mode === 'deadlock');
  document.getElementById('modeSemaphore').classList.toggle('m5simModeActive', mode === 'semaphore');
  const statusMsg = mode === 'deadlock'
    ? 'Modo sin control — cada filósofo toma su tenedor izquierdo sin coordinación'
    : 'Modo semáforo — máximo 4 filósofos intentando simultáneamente';
  updateStatus(statusMsg);
}

function simToggle() {
  if (simRunning) {
    simPause();
  } else {
    simStart();
  }
}

function simStart() {
  simRunning = true;
  updatePlayBtn();
  initPhils();
  clearSimLog();
  updateStats();

  for (let i = 0; i < PHIL_N; i++) {
    setPhilState(i, 'thinking');
    updateForkEl(i);
  }

  timeTickId = setInterval(updateTimeTick, 500);

  if (simMode === 'deadlock') {
    runDeadlockMode();
  } else {
    startSemaphoreMode();
  }
}

function simPause() {
  simRunning = false;
  updatePlayBtn();
  clearInterval(timeTickId);
  simDeadlockTimeouts.forEach(t => clearTimeout(t));
  simDeadlockTimeouts = [];
  updateStatus('Pausado — presioná Play para continuar');
}

function simReset() {
  simRunning = false;
  clearInterval(timeTickId);
  simDeadlockTimeouts.forEach(t => clearTimeout(t));
  simDeadlockTimeouts = [];
  updatePlayBtn();
  initPhils();

  for (let i = 0; i < PHIL_N; i++) {
    setPhilState(i, 'thinking');
  }
  for (let i = 0; i < PHIL_N; i++) {
    forks[i].held = null;
    updateForkEl(i);
  }

  clearSimLog();
  const el = document.getElementById('simTime');
  if (el) el.textContent = '0s';
  const meals = document.getElementById('simMeals');
  const dead  = document.getElementById('simDeadlocks');
  if (meals) meals.textContent = '0';
  if (dead)  dead.textContent  = '0';
  updateStatus('Sistema reiniciado. Elegí un modo y presioná Play.');
}

function clearSimLog() {
  const log = document.getElementById('simLog');
  if (log) {
    log.innerHTML = '<div class="m5simLogEntry m5simLogInfo">— Log reiniciado —</div>';
  }
}

/* Initialize forks as free on load */
(function () {
  initPhils();
  for (let i = 0; i < PHIL_N; i++) updateForkEl(i);
})();

/* ═══════════════════════════════════════════
   DEADLOCK DOCTOR GAME
═══════════════════════════════════════════ */

const GAME_SCENARIOS = [
  {
    scenario: `// T1 adquiere LOCK_A y espera LOCK_B
// T2 adquiere LOCK_B y espera LOCK_A
// Ambos hilos empiezan al mismo tiempo

Thread t1 = new Thread(() -> {
    synchronized(lockA) {
        sleep(50); // pausa — da tiempo a T2
        synchronized(lockB) { /* trabajo */ }
    }
});
Thread t2 = new Thread(() -> {
    synchronized(lockB) {
        sleep(50); // pausa — da tiempo a T1
        synchronized(lockA) { /* trabajo */ }
    }
});
t1.start(); t2.start();`,
    answer: 'DEADLOCK',
    explanation: '✅ Correcto: T1 retiene lockA y espera lockB; T2 retiene lockB y espera lockA. Ciclo de espera circular clásico — las 4 condiciones de Coffman se cumplen simultáneamente.'
  },
  {
    scenario: `// Scheduler sin fair queuing
// Thread de alta prioridad en loop continuo
// Thread de baja prioridad espera el mismo lock

Thread highPrio = new Thread(() -> {
    while(true) {
        synchronized(sharedResource) {
            process(); // tarda 10ms
        }
        // sin sleep — vuelve a intentar INMEDIATAMENTE
    }
}, "HIGH");
Thread lowPrio = new Thread(() -> {
    synchronized(sharedResource) {
        // jamás entra — siempre pierde contra HIGH
        process();
    }
}, "LOW");
highPrio.setPriority(Thread.MAX_PRIORITY);
lowPrio.setPriority(Thread.MIN_PRIORITY);`,
    answer: 'STARVATION',
    explanation: '✅ Correcto: El hilo HIGH nunca cede el recurso por tiempo suficiente — el hilo LOW nunca puede entrar. El sistema avanza (HIGH funciona bien), pero LOW muere de hambre. Clásica starvation por prioridad injusta.'
  },
  {
    scenario: `// T1 y T2 se "ceden el paso" mutuamente
// Ninguno avanza pero tampoco están bloqueados

while(true) {
    while(other.isActive()) {
        setActive(false);    // "yo me aparto"
        Thread.sleep(1);
        setActive(true);     // "intento de nuevo"
    }
    // Ambos ven al otro activo, ambos retroceden
    // el ciclo se repite indefinidamente
    useResource();
}`,
    answer: 'LIVELOCK',
    explanation: '✅ Correcto: Ambos hilos están ejecutándose (no bloqueados), pero se responden mutuamente: cada uno ve al otro "activo" y se aparta. Nadie usa el recurso nunca. Esto es livelock — active pero sin progreso.'
  },
  {
    scenario: `// Ambos hilos adquieren los locks en el MISMO orden
// T1: A → B    T2: A → B  (idéntico)

Thread t1 = new Thread(() -> {
    synchronized(lockA) {
        synchronized(lockB) {
            processA_B();
        }
    }
});
Thread t2 = new Thread(() -> {
    synchronized(lockA) {  // mismo orden que T1
        synchronized(lockB) {
            processA_B();
        }
    }
});
t1.start(); t2.start();`,
    answer: 'SEGURO',
    explanation: '✅ Correcto: Cuando ambos hilos adquieren los locks en el mismo orden (A→B), se rompe la condición de "espera circular" de Coffman. T2 simplemente espera que T1 libere lockA — no hay ciclo.'
  },
  {
    scenario: `// 3 hilos en ciclo: T1→T2→T3→T1
// Cada uno retiene un lock y espera el siguiente

synchronized(lockA) {           // T1: tiene A, pide B
    synchronized(lockB) { ... }
}

synchronized(lockB) {           // T2: tiene B, pide C
    synchronized(lockC) { ... }
}

synchronized(lockC) {           // T3: tiene C, pide A  ← cierra el ciclo
    synchronized(lockA) { ... }
}`,
    answer: 'DEADLOCK',
    explanation: '✅ Correcto: El grafo de espera forma un ciclo de 3 nodos: T1 espera a T2, T2 espera a T3, T3 espera a T1. Un deadlock no requiere solo 2 hilos — puede ocurrir con cualquier cantidad que forme un ciclo cerrado.'
  }
];

const GAME_OPTIONS = ['DEADLOCK', 'STARVATION', 'LIVELOCK', 'SEGURO'];
let gameIndex = 0;
let gameCorrect = 0;
let gameAnswered = false;

function buildGame() {
  gameIndex = 0;
  gameCorrect = 0;
  gameAnswered = false;
  renderGameScenario();
  const result = document.getElementById('gameResult');
  const card   = document.getElementById('gameCard');
  if (result) result.style.display = 'none';
  if (card)   card.style.display   = 'block';
}

function renderGameScenario() {
  const sc = GAME_SCENARIOS[gameIndex];
  document.getElementById('gameNum').textContent = `Caso ${gameIndex + 1} / ${GAME_SCENARIOS.length}`;
  document.getElementById('gameScore').textContent = `${gameCorrect} correcta${gameCorrect !== 1 ? 's' : ''}`;
  document.getElementById('gameScenario').textContent = sc.scenario;

  const opts = document.getElementById('gameOptions');
  opts.innerHTML = '';
  GAME_OPTIONS.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'm5gameOpt';
    btn.textContent = opt;
    btn.onclick = () => answerGame(opt, btn);
    opts.appendChild(btn);
  });

  const fb = document.getElementById('gameFeedback');
  const next = document.getElementById('gameNext');
  if (fb)   { fb.style.display = 'none'; fb.className = 'm5gameFeedback'; }
  if (next) next.style.display = 'none';
  gameAnswered = false;
}

function answerGame(choice, btn) {
  if (gameAnswered) return;
  gameAnswered = true;
  const sc = GAME_SCENARIOS[gameIndex];
  const correct = choice === sc.answer;
  if (correct) {
    gameCorrect++;
    btn.classList.add('correct');
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.m5gameOpt').forEach(b => {
      if (b.textContent === sc.answer) b.classList.add('correct');
    });
  }
  document.querySelectorAll('.m5gameOpt').forEach(b => b.classList.add('disabled'));

  const fb = document.getElementById('gameFeedback');
  if (fb) {
    fb.style.display = 'block';
    fb.className = `m5gameFeedback ${correct ? 'correct' : 'wrong'}`;
    fb.innerHTML = `${correct ? '✅' : '❌'} <strong>${sc.answer}</strong> — ${sc.explanation}`;
  }

  const next = document.getElementById('gameNext');
  if (next) {
    next.style.display = 'inline-flex';
    if (gameIndex >= GAME_SCENARIOS.length - 1) {
      next.innerHTML = 'Ver resultado <i class="ph-bold ph-check"></i>';
    }
  }
  document.getElementById('gameScore').textContent = `${gameCorrect} correcta${gameCorrect !== 1 ? 's' : ''}`;
}

function gameNext() {
  gameIndex++;
  if (gameIndex >= GAME_SCENARIOS.length) {
    showGameResult();
  } else {
    renderGameScenario();
  }
}

function showGameResult() {
  document.getElementById('gameCard').style.display   = 'none';
  document.getElementById('gameResult').style.display = 'block';
  document.getElementById('gameFinalScore').textContent = `${gameCorrect} / ${GAME_SCENARIOS.length}`;
}

function gameRestart() {
  buildGame();
}

buildGame();

/* ═══════════════════════════════════════════
   QUIZ
═══════════════════════════════════════════ */

const QUIZ_QUESTIONS = [
  {
    q: '¿Qué garantiza un bloque `synchronized` en Java?',
    opts: [
      'Que dos hilos lean el mismo objeto simultáneamente sin error',
      'Que solo un hilo ejecute el bloque a la vez — exclusión mutua',
      'Que el bloque sea más rápido que sin sincronización',
      'Que el hilo no pueda ser interrumpido por el scheduler'
    ],
    ans: 1,
    fb: 'synchronized implementa exclusión mutua: el hilo que entra "toma el lock" del objeto y los demás quedan en espera hasta que lo libere al salir del bloque.'
  },
  {
    q: 'Un `Semaphore(3)` permite _____ hilos en la sección protegida de forma simultánea.',
    opts: ['1 hilo — es lo mismo que un mutex', '2 hilos — reserva uno para el SO', '3 hilos — exactamente N', 'Ilimitados — el semáforo no limita'],
    ans: 2,
    fb: 'Semaphore(N) permite exactamente N hilos simultáneos. acquire() decrementa el contador; si llega a 0, el próximo hilo se bloquea. release() lo incrementa y despierta un hilo en espera.'
  },
  {
    q: '¿Cuál de estas opciones describe la condición de Coffman "Hold & Wait"?',
    opts: [
      'El SO puede quitar el recurso al hilo que lo tiene por la fuerza',
      'El hilo retiene recursos ya adquiridos mientras espera obtener otros nuevos',
      'Todos los hilos esperan entre sí formando un ciclo cerrado',
      'El recurso puede usarse por múltiples hilos a la vez sin conflicto'
    ],
    ans: 1,
    fb: '"Hold & wait" significa que el hilo NO suelta lo que ya tiene mientras espera más. Romper esta condición (soltar antes de pedir nuevos) es una de las estrategias para prevenir deadlock.'
  },
  {
    q: 'La diferencia clave entre deadlock y starvation es:',
    opts: [
      'En starvation el sistema tampoco progresa para ningún hilo',
      'En deadlock el sistema continúa respondiendo normalmente',
      'En starvation el sistema avanza, pero un hilo específico nunca accede al recurso',
      'Son sinónimos — ambos significan que ningún hilo progresa'
    ],
    ans: 2,
    fb: 'En starvation el sistema funciona bien para la mayoría — solo un hilo (o pocos) nunca obtienen recursos. En deadlock, todos los hilos involucrados están bloqueados y el sistema no progresa en absoluto.'
  },
  {
    q: '¿Qué hace `wait()` cuando se llama dentro de un bloque `synchronized`?',
    opts: [
      'Termina definitivamente la ejecución del hilo',
      'Libera el lock del objeto y suspende el hilo hasta que alguien llame notify()',
      'Mantiene el lock y bloquea el hilo hasta que pase el tiempo especificado',
      'Solo funciona con ReentrantLock, no con synchronized'
    ],
    ans: 1,
    fb: 'wait() hace dos cosas atomicamente: libera el lock (permitiendo que otros hilos entren) y suspende el hilo actual. Esto es fundamental — si no liberara el lock, nadie podría llamar notify() y el hilo quedaría atrapado para siempre.'
  },
  {
    q: '¿Qué caracteriza al livelock a diferencia del deadlock?',
    opts: [
      'En livelock los hilos están bloqueados esperando en una cola',
      'En livelock los hilos están activos y se responden mutuamente, pero ninguno avanza',
      'En livelock un solo hilo falla mientras los demás funcionan bien',
      'En livelock el scheduler asigna incorrectamente las prioridades'
    ],
    ans: 1,
    fb: 'En livelock los hilos NO están bloqueados — están ejecutándose, consumiendo CPU, reaccionando entre sí. El problema es que sus respuestas se anulan mutuamente sin generar progreso real. Como dos personas que se corren al mismo lado en un pasillo.'
  },
  {
    q: 'En el problema de los 5 filósofos, ¿por qué `Semaphore(4)` resuelve el deadlock?',
    opts: [
      'Porque impide que más de 4 filósofos toquen los tenedores',
      'Si solo 4 filósofos intentan comer simultáneamente, al menos uno siempre puede tomar sus dos tenedores',
      'Porque permite que 4 filósofos coman al mismo tiempo sin conflicto',
      'Porque elimina la condición de exclusión mutua sobre los tenedores'
    ],
    ans: 1,
    fb: 'Con 5 filósofos y 5 tenedores: si los 5 toman el izquierdo, deadlock. Pero si solo 4 intentan, el 5to filósofo "libre" no tiene el tenedor que el 1ro necesita — entonces el 1ro puede tomar ambos, comer y liberar. El sistema siempre progresa.'
  },
  {
    q: '¿Qué ventaja específica tiene `tryLock(timeout)` de ReentrantLock sobre `synchronized`?',
    opts: [
      'tryLock es siempre más rápido porque no usa el kernel del SO',
      'Permite evitar deadlock: si no consigue todos los locks en tiempo, los suelta y reintenta',
      'Permite que múltiples hilos entren a la sección crítica simultáneamente',
      'No requiere que el programador libere el lock manualmente'
    ],
    ans: 1,
    fb: 'tryLock(timeout) rompe la condición de Coffman "no preempción": si el hilo no puede obtener el segundo lock en el tiempo dado, suelta el primero y reintenta más tarde. Esto hace que el deadlock sea imposible, aunque puede generar livelock si el backoff no es adecuado.'
  }
];

let quizIndex = 0;
let quizAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);
let quizAnswered = new Array(QUIZ_QUESTIONS.length).fill(false);

function renderQuiz() {
  const q = QUIZ_QUESTIONS[quizIndex];
  const total = QUIZ_QUESTIONS.length;

  document.getElementById('quizProgressLabel').textContent = `Pregunta ${quizIndex + 1} de ${total}`;
  const fill = document.getElementById('quizProgressFill');
  if (fill) fill.style.width = `${((quizIndex + 1) / total) * 100}%`;

  document.getElementById('quizQuestion').textContent = q.q;

  const opts = document.getElementById('quizOptions');
  opts.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'm5quizOpt';
    btn.textContent = opt;
    if (quizAnswered[quizIndex]) {
      if (i === q.ans) btn.classList.add('correct');
      if (i === quizAnswers[quizIndex] && i !== q.ans) btn.classList.add('wrong');
      btn.classList.add('disabled');
    } else {
      btn.onclick = () => answerQuiz(i, btn);
    }
    opts.appendChild(btn);
  });

  const fb = document.getElementById('quizFeedback');
  if (quizAnswered[quizIndex]) {
    const correct = quizAnswers[quizIndex] === q.ans;
    fb.style.display = 'block';
    fb.className = `m5quizFeedback ${correct ? 'correct' : 'wrong'}`;
    fb.textContent = `${correct ? '✅' : '❌'} ${q.fb}`;
  } else {
    fb.style.display = 'none';
  }

  document.getElementById('quizPrev').style.opacity = quizIndex === 0 ? '0.4' : '1';
  document.getElementById('quizPrev').disabled = quizIndex === 0;

  const nextBtn = document.getElementById('quizNext');
  if (quizIndex === total - 1) {
    nextBtn.innerHTML = 'Ver resultado <i class="ph ph-trophy"></i>';
  } else {
    nextBtn.innerHTML = 'Siguiente <i class="ph ph-arrow-right"></i>';
  }
}

function answerQuiz(i, btn) {
  if (quizAnswered[quizIndex]) return;
  quizAnswered[quizIndex] = true;
  quizAnswers[quizIndex] = i;
  renderQuiz();
}

function quizNav(dir) {
  const next = quizIndex + dir;
  if (next < 0) return;
  if (next >= QUIZ_QUESTIONS.length) {
    showQuizResult();
    return;
  }
  quizIndex = next;
  renderQuiz();
}

function showQuizResult() {
  const correct = quizAnswers.filter((a, i) => a === QUIZ_QUESTIONS[i].ans).length;
  const total   = QUIZ_QUESTIONS.length;
  const pct     = Math.round((correct / total) * 100);

  document.getElementById('quizCard').style.display       = 'none';
  document.getElementById('quizProgressLabel').textContent = '';
  document.querySelector('.m5quizProgress').style.display = 'none';
  document.querySelector('.m5quizNav').style.display       = 'none';
  document.getElementById('quizFeedback').style.display   = 'none';

  const result = document.getElementById('quizResult');
  result.style.display = 'block';

  let emoji, title, msg;
  if (pct >= 88) {
    emoji = '🏆'; title = `¡Excelente! ${correct}/${total}`;
    msg = 'Dominás los conceptos de sincronización. Estás listo para el parcial.';
  } else if (pct >= 62) {
    emoji = '👍'; title = `Bien! ${correct}/${total}`;
    msg = 'Buena base. Repasá deadlock vs starvation y las condiciones de Coffman.';
  } else {
    emoji = '📖'; title = `${correct}/${total} — A repasar`;
    msg = 'Te recomendamos releer la sección de conceptos clave y volver a intentarlo.';
  }

  document.getElementById('quizResultTitle').textContent = title;
  document.getElementById('quizResultMsg').textContent   = msg;
  document.querySelector('.m5quizResultIcon').innerHTML  = emoji;
}

function quizRestart() {
  quizIndex   = 0;
  quizAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);
  quizAnswered = new Array(QUIZ_QUESTIONS.length).fill(false);

  document.getElementById('quizCard').style.display       = 'block';
  document.querySelector('.m5quizProgress').style.display = 'flex';
  document.querySelector('.m5quizNav').style.display       = 'flex';
  document.getElementById('quizResult').style.display     = 'none';
  renderQuiz();
}

renderQuiz();

/* ─── Flip cards ─────────────────────────── */
document.querySelectorAll('.m5flipCard').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

/* ─── Prism highlight on load ────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (window.Prism) Prism.highlightAll();
});
