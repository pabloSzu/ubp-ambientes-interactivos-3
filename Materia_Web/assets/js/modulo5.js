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
    if (window.Prism) Prism.highlightAllUnder(panel);
  }
}

/* ─── Lab code copy ──────────────────────── */
const LAB_CODE = `public class DeadlockDemo {
    static final Object LOCK_A = new Object();
    static final Object LOCK_B = new Object();

    public static void main(String[] args) throws Exception {
        Thread t1 = new Thread(() -> {
            synchronized (LOCK_A) {
                System.out.println("T1 tomó LOCK_A — espera LOCK_B...");
                try { Thread.sleep(100); } catch (Exception e) {}
                synchronized (LOCK_B) {
                    System.out.println("T1 consiguió LOCK_B — éxito");
                }
            }
        });

        Thread t2 = new Thread(() -> {
            synchronized (LOCK_B) {  // ← orden invertido: LOCK_B primero
                System.out.println("T2 tomó LOCK_B — espera LOCK_A...");
                try { Thread.sleep(100); } catch (Exception e) {}
                synchronized (LOCK_A) {
                    System.out.println("T2 consiguió LOCK_A — éxito");
                }
            }
        });

        t1.start();
        t2.start();
        Thread.sleep(3000);
        System.out.println("🔒 DEADLOCK: ninguno pudo terminar");
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
   DINING PHILOSOPHERS SIMULATOR — REDESIGNED
   Slow, verbose, step-by-step explanation
═══════════════════════════════════════════ */

const PHIL_N = 5;

let phils = [];
let forks = [];
let simMode = 'deadlock';
let simRunning = false;
let simDeadlockTimeouts = [];
let semPermits = 4;
let stats = { meals: 0, deadlocks: 0 };
let simStartTime = null;
let timeTickId = null;

const STATE_EMOJI = { thinking:'💭', hungry:'🍽️', waiting:'⏳', eating:'😋', dead:'💀' };
const STATE_CLASS = { thinking:'m5sThinking', hungry:'m5sHungry', waiting:'m5sWaiting', eating:'m5sEating', dead:'m5sDead' };
const STATE_LABEL = { thinking:'pensando', hungry:'hambriento', waiting:'esperando tenedor', eating:'comiendo', dead:'deadlock' };

function initPhils() {
  phils = Array.from({ length: PHIL_N }, (_, i) => ({ id: i, state: 'thinking' }));
  forks = Array.from({ length: PHIL_N }, (_, i) => ({ id: i, held: null }));
  semPermits = 4;
  stats = { meals: 0, deadlocks: 0 };
  simStartTime = null;
}

function setPhilState(id, state) {
  phils[id].state = state;
  const philEl  = document.getElementById(`sp${id}`);
  const emojiEl = document.getElementById(`se${id}`);
  const stateEl = document.getElementById(`ss${id}`);
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
  el.classList.add(forks[id].held !== null ? 'm5fkHeld' : 'm5fkFree');
}

function addLog(msg, type = 'info') {
  const log = document.getElementById('simLog');
  if (!log) return;
  const entry = document.createElement('div');
  entry.className = `m5simLogEntry m5simLog${type.charAt(0).toUpperCase() + type.slice(1)}`;
  const elapsed = simStartTime ? ((Date.now() - simStartTime) / 1000).toFixed(1) : '0.0';
  entry.textContent = `[${elapsed}s] ${msg}`;
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
  btn.innerHTML = simRunning
    ? '<i class="ph-bold ph-pause"></i> Pausar'
    : '<i class="ph-bold ph-play"></i> Play';
}

function updatePermits() {
  const wrap = document.getElementById('simPermitWrap');
  if (wrap) wrap.style.display = (simMode === 'semaphore') ? 'block' : 'none';
  const count = document.getElementById('permCount');
  if (count) count.textContent = `${semPermits}/4`;
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`perm${i}`);
    if (dot) {
      dot.classList.toggle('m5permFree', i < semPermits);
    }
  }
}

/* ══════════════════════════════
   DEADLOCK MODE — staggered, slow
   Each step is logged individually
══════════════════════════════ */
function runDeadlockMode() {
  simStartTime = Date.now();
  addLog('Sistema iniciado. 5 filósofos piensan sin ningún control de sincronización.', 'info');
  updateStatus('Filósofos pensando — sin mecanismo de coordinación');

  /* Phase 1: become hungry one by one */
  for (let i = 0; i < PHIL_N; i++) {
    const t = setTimeout(() => {
      if (!simRunning) return;
      setPhilState(i, 'hungry');
      addLog(`F${i} tiene hambre 🍽️ — va a tomar el tenedor de su izquierda`, 'wait');
    }, 1000 + i * 400);
    simDeadlockTimeouts.push(t);
  }

  /* Phase 2: each picks up LEFT fork one by one */
  for (let i = 0; i < PHIL_N; i++) {
    const t = setTimeout(() => {
      if (!simRunning) return;
      forks[i].held = i;
      setPhilState(i, 'waiting');
      updateForkEl(i);
      addLog(`F${i} tomó tenedor T${i} (izquierdo) 🍴 — ahora espera T${(i + 1) % 5}`, 'wait');
    }, 3500 + i * 400);
    simDeadlockTimeouts.push(t);
  }

  /* Phase 3: detection */
  const tDetect = setTimeout(() => {
    if (!simRunning) return;
    addLog('⚠️ Situación: todos tienen un tenedor. Todos esperan el tenedor de su vecino.', 'wait');
    addLog('    F0 espera T1 (lo tiene F1)', 'wait');
    addLog('    F1 espera T2 (lo tiene F2)', 'wait');
    addLog('    F2 espera T3 (lo tiene F3)', 'wait');
    addLog('    F3 espera T4 (lo tiene F4)', 'wait');
    addLog('    F4 espera T0 (lo tiene F0) ← ¡ciclo cerrado!', 'wait');
  }, 6200);
  simDeadlockTimeouts.push(tDetect);

  /* Phase 4: DEADLOCK confirmed */
  const tDead = setTimeout(() => {
    if (!simRunning) return;
    for (let i = 0; i < PHIL_N; i++) setPhilState(i, 'dead');
    addLog('💀 DEADLOCK — espera circular confirmada. Las 4 condiciones de Coffman se cumplen:', 'dead');
    addLog('   ① Exclusión mutua: cada tenedor es de uso exclusivo', 'dead');
    addLog('   ② Hold & wait: cada filósofo retiene T_izq mientras espera T_der', 'dead');
    addLog('   ③ No preempción: nadie puede quitarle el tenedor a otro', 'dead');
    addLog('   ④ Espera circular: F0→F1→F2→F3→F4→F0', 'dead');
    addLog('El sistema está paralizado. Reiniciá y probá con Semáforo(4).', 'dead');
    stats.deadlocks++;
    updateStats();
    updateStatus('💀 DEADLOCK detectado — probá el modo Con Semáforo(4)');
    simRunning = false;
    clearInterval(timeTickId);
    updatePlayBtn();
  }, 7500);
  simDeadlockTimeouts.push(tDead);
}

/* ══════════════════════════════
   SEMAPHORE MODE — verbose, clear
   Shows every sub-step with delays
══════════════════════════════ */

function leftForkIdx(id)  { return id; }
function rightForkIdx(id) { return (id + 1) % PHIL_N; }

/* ── Step card helper ─────────────────────── */
function setStep(html) {
  const card = document.getElementById('simStepCard');
  const txt  = document.getElementById('simStepText');
  if (!card) return;
  const show = simMode === 'semaphore' && simRunning;
  card.style.display = show ? 'block' : 'none';
  if (show && txt) {
    txt.innerHTML = html;
    /* re-trigger animation */
    card.classList.remove('stepAnim');
    void card.offsetWidth;
    card.classList.add('stepAnim');
  }
}

function hideStep() {
  const card = document.getElementById('simStepCard');
  if (card) card.style.display = 'none';
}

/* ── STEP DELAY (ms) — controls simulation pace ── */
const STEP_MS = 1400;   /* between each sub-step   */
const EAT_MS  = 3500;   /* how long eating lasts   */
const THINK_MS_MIN = 2500;
const THINK_MS_MAX = 4000;

function startHungerCycle(id) {
  if (!simRunning || simMode !== 'semaphore') return;
  setPhilState(id, 'hungry');
  addLog(`F${id} tiene hambre 🍽️ — va a pedir permiso al semáforo`, 'wait');
  setStep(`<strong>Filósofo ${id}</strong> tiene hambre y solicita permiso al semáforo.<br>Semáforo actual: <strong>${semPermits}/4 permisos libres</strong>`);

  setTimeout(() => {
    if (simRunning && phils[id].state === 'hungry') tryAcquire(id);
  }, STEP_MS);
}

function tryAcquire(id) {
  if (!simRunning || simMode !== 'semaphore' || phils[id].state !== 'hungry') return;

  const lf = leftForkIdx(id);
  const rf = rightForkIdx(id);

  if (semPermits > 0 && forks[lf].held === null && forks[rf].held === null) {

    /* ── Sub-step 1: obtain semaphore permit ── */
    semPermits--;
    updatePermits();
    addLog(`F${id} OBTIENE permiso ✅ — semáforo: ${semPermits}/4 libres`, 'sem');
    updateStatus(`F${id} obtuvo permiso del semáforo`);
    setStep(`<strong>Semáforo concede permiso a F${id}</strong> ✅<br>Permisos restantes: <strong>${semPermits}/4</strong> — ahora F${id} puede intentar tomar los tenedores`);

    /* ── Sub-step 2: left fork ── */
    setTimeout(() => {
      if (!simRunning) return;
      forks[lf].held = id;
      updateForkEl(lf);
      addLog(`F${id} toma tenedor izquierdo T${lf} 🍴`, 'eat');
      setStep(`<strong>F${id} tomó tenedor izquierdo T${lf}</strong> 🍴<br>Ahora espera el tenedor derecho T${rf}...`);

      /* ── Sub-step 3: right fork ── */
      setTimeout(() => {
        if (!simRunning) return;
        forks[rf].held = id;
        updateForkEl(rf);
        addLog(`F${id} toma tenedor derecho T${rf} 🍴 — ¡tiene los dos!`, 'eat');
        setStep(`<strong>F${id} tomó tenedor derecho T${rf}</strong> 🍴<br>¡Tiene ambos tenedores! Empieza a comer 😋`);

        /* ── Sub-step 4: eating ── */
        setTimeout(() => {
          if (!simRunning) return;
          setPhilState(id, 'eating');
          stats.meals++;
          updateStats();
          addLog(`F${id} come 😋 — comida #${stats.meals}`, 'eat');
          updateStatus(`F${id} come. Semáforo: ${semPermits}/4 disponibles — sistema progresa ✅`);
          setStep(`<strong>F${id} come</strong> 😋 (comida #${stats.meals})<br>Tiene T${lf} y T${rf} ocupados. Semáforo: ${semPermits}/4 libres.<br><em>Otros filósofos pueden intentar mientras tanto.</em>`);

          /* ── Sub-step 5: finish ── */
          setTimeout(() => finishEatingVerbose(id, lf, rf), EAT_MS);
        }, STEP_MS);
      }, STEP_MS);
    }, STEP_MS);

  } else {
    /* Can't eat — explain why, slower retry */
    const reason = semPermits <= 0
      ? `el semáforo está lleno (0/4 permisos disponibles)`
      : `el tenedor T${forks[lf].held !== null ? lf : rf} está ocupado`;
    addLog(`F${id} no puede comer aún — ${reason}`, 'wait');
    setStep(`<strong>F${id} espera</strong> ⏳<br>${reason === `el semáforo está lleno (0/4 permisos disponibles)` ? 'El semáforo no tiene permisos libres — F' + id + ' espera su turno' : 'Un tenedor está ocupado — F' + id + ' reintentará pronto'}`);

    const retryDelay = STEP_MS + Math.random() * 600;
    setTimeout(() => {
      if (simRunning && phils[id].state === 'hungry') tryAcquire(id);
    }, retryDelay);
  }
}

function finishEatingVerbose(id, lf, rf) {
  if (!simRunning) return;

  addLog(`F${id} terminó de comer — libera recursos`, 'info');
  setStep(`<strong>F${id} terminó de comer</strong><br>Va a soltar los tenedores T${lf} y T${rf} y devolver el permiso al semáforo`);

  /* ── Sub-step 6: release forks ── */
  setTimeout(() => {
    if (!simRunning) return;
    forks[lf].held = null;
    forks[rf].held = null;
    updateForkEl(lf);
    updateForkEl(rf);
    addLog(`F${id} suelta T${lf} y T${rf} — disponibles para otros`, 'sem');
    setStep(`<strong>F${id} suelta tenedores T${lf} y T${rf}</strong> 🍴 libre<br>Otros filósofos hambrientos pueden tomarlos ahora`);

    /* ── Sub-step 7: return permit ── */
    setTimeout(() => {
      if (!simRunning) return;
      semPermits++;
      updatePermits();
      addLog(`F${id} devuelve permiso al semáforo ✅ — semáforo: ${semPermits}/4 libres`, 'sem');
      setPhilState(id, 'thinking');
      updateStatus(`F${id} vuelve a pensar. Semáforo: ${semPermits}/4 disponibles`);
      setStep(`<strong>F${id} devuelve permiso al semáforo</strong> ✅<br>Semáforo: <strong>${semPermits}/4 libres</strong><br>F${id} vuelve a pensar 💭 — ciclo completado`);

      /* Wake any hungry philosopher */
      for (let i = 0; i < PHIL_N; i++) {
        if (phils[i].state === 'hungry') {
          setTimeout(() => {
            if (simRunning && phils[i].state === 'hungry') tryAcquire(i);
          }, 300 + i * 120);
        }
      }

      /* Schedule next hunger cycle */
      const thinkTime = THINK_MS_MIN + Math.random() * (THINK_MS_MAX - THINK_MS_MIN);
      setTimeout(() => {
        if (simRunning && simMode === 'semaphore') startHungerCycle(id);
      }, thinkTime);
    }, STEP_MS);
  }, STEP_MS);
}

function startSemaphoreMode() {
  simStartTime = Date.now();
  addLog('Semáforo(4) inicializado — máximo 4 filósofos intentando a la vez', 'sem');
  addLog('Regla: adquirir permiso → tomar fork izquierdo → tomar fork derecho → comer', 'sem');
  updateStatus('Modo semáforo activo — observá los permisos y los tenedores');
  updatePermits();

  /* Stagger initial hunger so it's not overwhelming */
  for (let i = 0; i < PHIL_N; i++) {
    const delay = 600 + i * 700;
    setTimeout(() => {
      if (!simRunning) return;
      startHungerCycle(i);
    }, delay);
  }
}

/* ── Public controls ─────────────────────── */
function setMode(mode) {
  if (simRunning) simReset();
  simMode = mode;
  document.getElementById('modeDeadlock').classList.toggle('m5simModeActive', mode === 'deadlock');
  document.getElementById('modeSemaphore').classList.toggle('m5simModeActive', mode === 'semaphore');
  updatePermits();

  const msg = mode === 'deadlock'
    ? 'Modo sin control — cada filósofo toma su tenedor izquierdo sin coordinación → deadlock'
    : 'Modo semáforo — máximo 4 filósofos intentando a la vez → progreso garantizado';
  updateStatus(msg);
}

function simToggle() {
  if (simRunning) { simPause(); } else { simStart(); }
}

function simStart() {
  simRunning = true;
  updatePlayBtn();
  initPhils();
  clearSimLog();
  updateStats();
  updatePermits();

  for (let i = 0; i < PHIL_N; i++) {
    setPhilState(i, 'thinking');
    forks[i].held = null;
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
  updatePermits();

  for (let i = 0; i < PHIL_N; i++) {
    setPhilState(i, 'thinking');
    forks[i].held = null;
    updateForkEl(i);
  }

  clearSimLog();
  ['simTime', 'simMeals', 'simDeadlocks'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = id === 'simTime' ? '0s' : '0';
  });
  updateStatus('Sistema reiniciado. Elegí un modo y presioná Play.');
}

function clearSimLog() {
  const log = document.getElementById('simLog');
  if (log) log.innerHTML = '<div class="m5simLogEntry m5simLogInfo">— Log reiniciado —</div>';
}

/* Initialize forks as free on load */
(function () {
  initPhils();
  updatePermits();
  for (let i = 0; i < PHIL_N; i++) updateForkEl(i);
})();

/* ═══════════════════════════════════════════
   DEADLOCK DOCTOR GAME — 7 scenarios
═══════════════════════════════════════════ */

const GAME_SCENARIOS = [
  {
    scenario:
`// T1 adquiere LOCK_A, espera LOCK_B
// T2 adquiere LOCK_B, espera LOCK_A
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
    explanation: 'T1 retiene lockA y espera lockB; T2 retiene lockB y espera lockA. Ciclo de espera circular clásico — las 4 condiciones de Coffman se cumplen. Para arreglarlo: que ambos pidan los locks en el mismo orden (lockA→lockB).'
  },
  {
    scenario:
`// Thread de alta prioridad en loop continuo
// Thread de baja prioridad espera el mismo lock

Thread high = new Thread(() -> {
    while(true) {
        synchronized(recurso) {
            procesar(); // tarda 10ms
        }
        // sin sleep — vuelve INMEDIATAMENTE
    }
});
Thread low = new Thread(() -> {
    synchronized(recurso) {
        // Nunca entra: HIGH lo ocupa sin parar
        procesar();
    }
});
high.setPriority(Thread.MAX_PRIORITY);
low.setPriority(Thread.MIN_PRIORITY);`,
    answer: 'STARVATION',
    explanation: 'El hilo HIGH nunca cede el recurso por tiempo suficiente — LOW nunca puede entrar. El sistema avanza (HIGH funciona bien), pero LOW muere de hambre. Solución: usar ReentrantLock(true) para fair queuing, o agregar un sleep en HIGH.'
  },
  {
    scenario:
`// T1 y T2 se "ceden el paso" mutuamente
// Ninguno avanza pero tampoco están bloqueados

while(true) {
    while(other.isActive()) {
        setActive(false);   // "yo me aparto"
        Thread.sleep(1);
        setActive(true);    // "intento de nuevo"
    }
    // Ambos ven al otro activo, ambos retroceden
    // el ciclo se repite infinitamente
    useResource();
}`,
    answer: 'LIVELOCK',
    explanation: 'Ambos hilos están ejecutándose (no bloqueados), pero se responden mutuamente: cada uno ve al otro "activo" y se aparta. Nadie usa el recurso. Solución: backoff aleatorio — que cada hilo espere un tiempo distinto antes de reintentar.'
  },
  {
    scenario:
`// Ambos hilos adquieren locks en el MISMO orden
// T1: A → B    T2: A → B  (idéntico)

Thread t1 = new Thread(() -> {
    synchronized(lockA) {
        synchronized(lockB) {
            procesarA_B();
        }
    }
});
Thread t2 = new Thread(() -> {
    synchronized(lockA) {  // mismo orden que T1
        synchronized(lockB) {
            procesarA_B();
        }
    }
});
t1.start(); t2.start();`,
    answer: 'SEGURO',
    explanation: 'Cuando ambos hilos adquieren los locks en el mismo orden (A→B), se rompe la condición de "espera circular" de Coffman. T2 simplemente espera que T1 libere lockA — no hay ciclo. El sistema progresa normalmente.'
  },
  {
    scenario:
`// 3 hilos en ciclo: T1→T2→T3→T1
// Cada uno retiene un lock y espera el siguiente

// T1: tiene lockA, pide lockB
synchronized(lockA) { synchronized(lockB) { ... } }

// T2: tiene lockB, pide lockC
synchronized(lockB) { synchronized(lockC) { ... } }

// T3: tiene lockC, pide lockA  ← cierra el ciclo
synchronized(lockC) { synchronized(lockA) { ... } }`,
    answer: 'DEADLOCK',
    explanation: 'El grafo de espera forma un ciclo de 3 nodos: T1→T2→T3→T1. Un deadlock no requiere solo 2 hilos — puede ocurrir con cualquier cantidad que forme un ciclo cerrado. La solución es imponer un orden global: todos piden lockA→lockB→lockC.'
  },
  {
    scenario:
`-- Deadlock en base de datos SQL
-- Dos transacciones actualizan filas en orden inverso

-- Transacción 1 (simultánea con T2)
BEGIN;
UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;  -- lock fila 1
-- espera...
UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;  -- espera lock fila 2

-- Transacción 2 (simultánea con T1)
BEGIN;
UPDATE cuentas SET saldo = saldo - 50  WHERE id = 2;  -- lock fila 2
-- espera...
UPDATE cuentas SET saldo = saldo + 50  WHERE id = 1;  -- espera lock fila 1`,
    answer: 'DEADLOCK',
    explanation: 'Los deadlocks no son exclusivos de Java — ocurren en bases de datos relacionales. T1 tiene la fila 1 y espera la fila 2; T2 tiene la fila 2 y espera la fila 1. La mayoría de los motores de BD detectan esto automáticamente y abortan una transacción (victim selection).'
  },
  {
    scenario:
`// ReentrantLock con fair=true
// Garantiza orden FIFO de adquisición del lock

ReentrantLock fairLock = new ReentrantLock(true);

Thread lowPrio = new Thread(() -> {
    fairLock.lock();  // espera su turno en la cola FIFO
    try {
        procesar();
    } finally {
        fairLock.unlock();
    }
});

// Con fair=true, el primer hilo que esperó es el primero
// en entrar. Cola FIFO → starvation imposible.`,
    answer: 'SEGURO',
    explanation: 'ReentrantLock(true) habilita el modo "fair": los hilos se encolan en orden de llegada (FIFO). Ningún hilo puede "colarse". Esto previene starvation. La contrapartida: menor throughput comparado con unfair lock, porque el scheduler no puede optimizar el orden de entrada.'
  }
];

const GAME_OPTIONS = ['DEADLOCK', 'STARVATION', 'LIVELOCK', 'SEGURO'];
let gameIndex = 0;
let gameCorrect = 0;
let gameAnswered = false;

function buildGame() {
  gameIndex = 0; gameCorrect = 0; gameAnswered = false;
  renderGameScenario();
  const result = document.getElementById('gameResult');
  const card   = document.getElementById('gameCard');
  if (result) result.style.display = 'none';
  if (card)   card.style.display   = 'block';
}

function renderGameScenario() {
  const sc = GAME_SCENARIOS[gameIndex];
  document.getElementById('gameNum').textContent   = `Caso ${gameIndex + 1} / ${GAME_SCENARIOS.length}`;
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

  const fb   = document.getElementById('gameFeedback');
  const next = document.getElementById('gameNext');
  if (fb)   { fb.style.display = 'none'; fb.className = 'm5gameFeedback'; }
  if (next) next.style.display = 'none';
  gameAnswered = false;
}

function answerGame(choice, btn) {
  if (gameAnswered) return;
  gameAnswered = true;
  const sc      = GAME_SCENARIOS[gameIndex];
  const correct = choice === sc.answer;
  if (correct) { gameCorrect++; btn.classList.add('correct'); }
  else {
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
    next.innerHTML = gameIndex >= GAME_SCENARIOS.length - 1
      ? 'Ver resultado <i class="ph-bold ph-check"></i>'
      : 'Siguiente caso <i class="ph-bold ph-arrow-right"></i>';
  }
  document.getElementById('gameScore').textContent = `${gameCorrect} correcta${gameCorrect !== 1 ? 's' : ''}`;
}

function gameNext() {
  gameIndex++;
  if (gameIndex >= GAME_SCENARIOS.length) showGameResult();
  else renderGameScenario();
}

function showGameResult() {
  document.getElementById('gameCard').style.display   = 'none';
  document.getElementById('gameResult').style.display = 'block';
  document.getElementById('gameFinalScore').textContent = `${gameCorrect} / ${GAME_SCENARIOS.length}`;
}

function gameRestart() { buildGame(); }
buildGame();

/* ═══════════════════════════════════════════
   QUIZ — 8 questions
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
    q: 'Un `Semaphore(3)` permite _____ hilos simultáneos en la sección protegida.',
    opts: ['1 hilo — es equivalente a mutex', '2 hilos — reserva uno para el SO', '3 hilos — exactamente N', 'Ilimitados — no limita'],
    ans: 2,
    fb: 'Semaphore(N) permite exactamente N hilos simultáneos. acquire() decrementa el contador; si llega a 0, el próximo hilo se bloquea. release() lo incrementa y despierta un hilo en espera.'
  },
  {
    q: '¿Cuál de estas opciones describe la condición de Coffman "Hold & Wait"?',
    opts: [
      'El SO puede quitarle el recurso al hilo por la fuerza',
      'El hilo retiene recursos ya adquiridos mientras espera obtener otros nuevos',
      'Todos los hilos esperan entre sí formando un ciclo cerrado',
      'El recurso puede usarse por múltiples hilos sin conflicto'
    ],
    ans: 1,
    fb: '"Hold & wait" significa que el hilo NO suelta lo que ya tiene mientras espera más. Romper esta condición (liberar antes de pedir nuevos) es una de las estrategias para prevenir deadlock.'
  },
  {
    q: 'La diferencia clave entre deadlock y starvation es:',
    opts: [
      'En starvation el sistema tampoco progresa para ningún hilo',
      'En deadlock el sistema continúa respondiendo normalmente',
      'En starvation el sistema avanza, pero un hilo específico nunca accede al recurso',
      'Son sinónimos — significan lo mismo'
    ],
    ans: 2,
    fb: 'En starvation el sistema funciona bien para la mayoría — solo un hilo nunca obtiene recursos. En deadlock, todos los hilos involucrados están bloqueados y el sistema no progresa.'
  },
  {
    q: '¿Qué hace `wait()` cuando se llama dentro de un bloque `synchronized`?',
    opts: [
      'Termina definitivamente la ejecución del hilo',
      'Libera el lock del objeto y suspende el hilo hasta que alguien llame notify()',
      'Mantiene el lock y bloquea el hilo por el tiempo especificado',
      'Solo funciona con ReentrantLock, no con synchronized'
    ],
    ans: 1,
    fb: 'wait() hace dos cosas atómicamente: libera el lock (permitiendo que otros hilos entren) y suspende el hilo. Esto es fundamental — si no liberara el lock, nadie podría llamar notify() y el sistema quedaría atrapado.'
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
    fb: 'En livelock los hilos NO están bloqueados — están ejecutándose, consumiendo CPU, reaccionando entre sí. El problema es que sus respuestas se anulan sin generar progreso real. Como dos personas que se corren al mismo lado en un pasillo.'
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
    fb: 'Con 5 filósofos y 5 tenedores: si los 5 toman el izquierdo, deadlock. Pero si solo 4 intentan, el 5to no tiene el tenedor que el 1ro necesita — entonces el 1ro puede tomar ambos, comer y liberar. El sistema siempre progresa.'
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
    fb: 'tryLock(timeout) rompe la condición de Coffman "no preempción": si el hilo no puede obtener el segundo lock en el tiempo dado, suelta el primero y reintenta. Esto hace que el deadlock sea imposible (aunque puede generar livelock si el backoff no es aleatorio).'
  }
];

let quizIndex   = 0;
let quizAnswers  = new Array(QUIZ_QUESTIONS.length).fill(null);
let quizAnswered = new Array(QUIZ_QUESTIONS.length).fill(false);

function renderQuiz() {
  const q     = QUIZ_QUESTIONS[quizIndex];
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
      btn.onclick = () => answerQuiz(i);
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

  const prevBtn = document.getElementById('quizPrev');
  prevBtn.style.opacity  = quizIndex === 0 ? '0.4' : '1';
  prevBtn.disabled       = quizIndex === 0;

  const nextBtn = document.getElementById('quizNext');
  nextBtn.innerHTML = quizIndex === total - 1
    ? 'Ver resultado <i class="ph ph-trophy"></i>'
    : 'Siguiente <i class="ph ph-arrow-right"></i>';
}

function answerQuiz(i) {
  if (quizAnswered[quizIndex]) return;
  quizAnswered[quizIndex] = true;
  quizAnswers[quizIndex]  = i;
  renderQuiz();
}

function quizNav(dir) {
  const next = quizIndex + dir;
  if (next < 0) return;
  if (next >= QUIZ_QUESTIONS.length) { showQuizResult(); return; }
  quizIndex = next;
  renderQuiz();
}

function showQuizResult() {
  const correct = quizAnswers.filter((a, i) => a === QUIZ_QUESTIONS[i].ans).length;
  const total   = QUIZ_QUESTIONS.length;
  const pct     = Math.round((correct / total) * 100);

  ['quizCard', '.m5quizProgress', '.m5quizNav'].forEach(sel => {
    const el = sel.startsWith('.') ? document.querySelector(sel) : document.getElementById(sel);
    if (el) el.style.display = 'none';
  });
  document.getElementById('quizFeedback').style.display = 'none';

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
  quizIndex    = 0;
  quizAnswers  = new Array(QUIZ_QUESTIONS.length).fill(null);
  quizAnswered = new Array(QUIZ_QUESTIONS.length).fill(false);

  ['quizCard'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
  });
  ['.m5quizProgress', '.m5quizNav'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.style.display = 'flex';
  });
  document.getElementById('quizResult').style.display = 'none';
  renderQuiz();
}

renderQuiz();

/* ─── Flip cards ─────────────────────────── */
document.querySelectorAll('.m5flipCard').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

/* ─── Prism on load ──────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { if (window.Prism) Prism.highlightAll(); });
} else {
  if (window.Prism) Prism.highlightAll();
}
