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
   DINING PHILOSOPHERS SIMULATOR — PASO A PASO
   Navegación manual: Anterior / Siguiente
   Cada paso explica en detalle qué pasa y por qué
═══════════════════════════════════════════ */

const PHIL_N = 5;

let phils      = [];
let forks      = [];
let simMode    = 'deadlock';
let semPermits = 4;
let stepIdx    = -1;
let stepList   = null;

const STATE_EMOJI = { thinking:'💭', hungry:'🍽️', waiting:'⏳', eating:'😋', dead:'💀' };
const STATE_CLASS = { thinking:'m5sThinking', hungry:'m5sHungry', waiting:'m5sWaiting', eating:'m5sEating', dead:'m5sDead' };
const STATE_LABEL = { thinking:'pensando', hungry:'hambriento', waiting:'esperando tenedor', eating:'comiendo', dead:'💀 deadlock' };

function initPhils() {
  phils      = Array.from({ length: PHIL_N }, (_, i) => ({ id: i, state: 'thinking' }));
  forks      = Array.from({ length: PHIL_N }, (_, i) => ({ id: i, held: null }));
  semPermits = 4;
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

function updatePermits() {
  const wrap = document.getElementById('simPermitWrap');
  if (wrap) wrap.style.display = (simMode === 'semaphore' && stepIdx >= 0) ? 'block' : 'none';
  const count = document.getElementById('permCount');
  if (count) count.textContent = `${semPermits}/4`;
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`perm${i}`);
    if (dot) dot.classList.toggle('m5permFree', i < semPermits);
  }
}

function addLog(msg, type = 'info') {
  const log = document.getElementById('simLog');
  if (!log) return;
  const entry = document.createElement('div');
  entry.className = `m5simLogEntry m5simLog${type.charAt(0).toUpperCase() + type.slice(1)}`;
  const clean = msg.replace(/^[^\wÀ-ú]+/, '').trim();
  entry.textContent = `${stepIdx + 1}. ${clean}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function clearSimLog() {
  const log = document.getElementById('simLog');
  if (log) log.innerHTML = '<div class="m5simLogEntry m5simLogInfo">— Historial de pasos —</div>';
}

/* ══════════════════════════════════════════
   PASO A PASO — arrays de pasos definidos
══════════════════════════════════════════ */

const DEADLOCK_STEPS = [
  {
    title: '🧘 Estado inicial — todos pensando',
    explain: 'Cinco filósofos se sientan alrededor de una mesa circular. Entre cada par hay exactamente <strong>1 tenedor</strong> (5 filósofos, 5 tenedores). Todos están pensando tranquilamente. <strong>No existe ningún mecanismo de control</strong> — cualquiera puede tomar un tenedor cuando quiera, sin coordinación.',
    insight: null,
    phils:   ['thinking','thinking','thinking','thinking','thinking'],
    forks:   [null,null,null,null,null],
    permits: 4
  },
  {
    title: '🍽️ F0 tiene hambre — toma el tenedor izquierdo T0',
    explain: 'F0 quiere comer. El protocolo sin sincronización es simple: <strong>primero toma el tenedor de su izquierda</strong>. F0 agarra T0 sin coordinar con nadie. Ahora F0 <strong>retiene T0</strong> y espera conseguir T1 (su tenedor derecho) para poder comer.',
    insight: '⚠️ Primera condición de Coffman activada: <strong>Hold & Wait</strong> — F0 retiene un recurso (T0) mientras espera otro (T1).',
    phils:   ['waiting','thinking','thinking','thinking','thinking'],
    forks:   [0,null,null,null,null],
    permits: 4
  },
  {
    title: '🍽️ F1 tiene hambre — toma su tenedor izquierdo T1',
    explain: 'F1 también quiere comer y hace exactamente lo mismo que F0: agarra <strong>T1</strong>, su tenedor izquierdo. Ahora F1 retiene T1 y espera T2. Ya hay <strong>dos filósofos esperando</strong>, cada uno reteniendo un tenedor y esperando el del vecino.',
    insight: null,
    phils:   ['waiting','waiting','thinking','thinking','thinking'],
    forks:   [0,1,null,null,null],
    permits: 4
  },
  {
    title: '🍽️ F2 toma T2 · F3 toma T3 — cuatro bloqueados',
    explain: 'F2 y F3 hacen lo mismo. F2 retiene T2 y espera T3. F3 retiene T3 y espera T4. <strong>Cuatro filósofos tienen exactamente un tenedor cada uno</strong>. Solo queda T4 libre. El sistema está al borde del colapso total.',
    insight: null,
    phils:   ['waiting','waiting','waiting','waiting','thinking'],
    forks:   [0,1,2,3,null],
    permits: 4
  },
  {
    title: '💀 F4 toma T4 — EL SISTEMA COLAPSA',
    explain: 'F4 tiene hambre y toma <strong>T4</strong>, el último tenedor libre. Ahora <strong>TODOS los tenedores están ocupados</strong>. Cada filósofo tiene uno y espera el del vecino. Nadie puede avanzar. El sistema está paralizado para siempre. Esto es un <strong>deadlock</strong>.',
    insight: '🔴 DEADLOCK CONFIRMADO: F0 espera T1 (lo tiene F1) · F1 espera T2 (lo tiene F2) · F2 espera T3 · F3 espera T4 · F4 espera T0 (lo tiene F0) → <strong>ciclo de espera circular cerrado</strong>. Nadie puede avanzar.',
    phils:   ['dead','dead','dead','dead','dead'],
    forks:   [0,1,2,3,4],
    permits: 4
  },
  {
    title: '📋 Análisis: las 4 condiciones de Coffman — todas presentes',
    explain: 'Edward G. Coffman (1971) formuló que un deadlock ocurre si y solo si se cumplen <strong>4 condiciones simultáneas</strong>. Para prevenir el deadlock, basta con <strong>romper cualquiera de las cuatro</strong>. Mirá qué condición eliminamos con el semáforo.',
    insight: '① <strong>Exclusión mutua:</strong> cada tenedor solo lo puede usar un filósofo a la vez.<br>② <strong>Hold &amp; Wait:</strong> cada filósofo retiene su tenedor izquierdo mientras espera el derecho.<br>③ <strong>No preempción:</strong> nadie puede quitarle el tenedor a otro por la fuerza.<br>④ <strong>Espera circular:</strong> F0→F1→F2→F3→F4→F0 — ciclo cerrado perfecto.',
    phils:   ['dead','dead','dead','dead','dead'],
    forks:   [0,1,2,3,4],
    permits: 4
  },
  {
    title: '💡 La solución: Semáforo(4) rompe la espera circular',
    explain: 'La solución más elegante: agregar un <strong>Semáforo(4)</strong>. Con esta restricción, como máximo 4 de los 5 filósofos pueden intentar comer simultáneamente. El quinto no puede tomar ningún tenedor. Siempre hay "espacio" para que alguien complete el par de tenedores y coma.',
    insight: '✅ <strong>¿Por qué funciona?</strong> Con 5 filósofos y 5 tenedores: si solo 4 intentan, siempre habrá al menos un tenedor libre para completar un par → al menos uno come → sistema progresa → 0 deadlocks. Seleccioná <strong>Con Semáforo(4)</strong> arriba y comprobalo vos mismo.',
    phils:   ['dead','dead','dead','dead','dead'],
    forks:   [0,1,2,3,4],
    permits: 4
  }
];

const SEMAPHORE_STEPS = [
  {
    title: '🎫 Semáforo(4) instalado — 4 permisos disponibles',
    explain: 'Se instala un <strong>Semáforo con contador = 4</strong>. La regla es simple y obligatoria: antes de tomar cualquier tenedor, el filósofo debe ejecutar <code>sem.acquire()</code> y obtener un permiso. Si el contador llega a 0, el próximo filósofo que pida queda <strong>bloqueado automáticamente</strong>.',
    insight: '🔑 El semáforo funciona como un portero: solo 4 personas pueden estar en el "área de tenedores" a la vez. El quinto espera afuera hasta que alguien salga. Simple, pero rompe el deadlock.',
    phils:   ['thinking','thinking','thinking','thinking','thinking'],
    forks:   [null,null,null,null,null],
    permits: 4
  },
  {
    title: '🍽️ F0 tiene hambre — pide permiso al semáforo',
    explain: 'F0 quiere comer. <strong>Paso obligatorio: sem.acquire()</strong>. El semáforo tiene 4 permisos disponibles → concede el permiso inmediatamente y decrementa el contador a <strong>3/4</strong>. F0 queda autorizado para buscar tenedores.',
    insight: '📊 Semáforo: 4 → <strong>3 permisos libres</strong>. F0 puede proceder a tomar los tenedores.',
    phils:   ['hungry','thinking','thinking','thinking','thinking'],
    forks:   [null,null,null,null,null],
    permits: 3
  },
  {
    title: '🍴 F0 toma el tenedor izquierdo T0',
    explain: 'Con el permiso en mano, F0 toma <strong>T0</strong> (su tenedor izquierdo). Lo retiene y va a buscar T1 (el derecho). En este momento, el semáforo garantiza que como máximo 4 filósofos están haciendo esta operación simultáneamente.',
    insight: null,
    phils:   ['waiting','thinking','thinking','thinking','thinking'],
    forks:   [0,null,null,null,null],
    permits: 3
  },
  {
    title: '🍴🍴 F0 toma el tenedor derecho T1 — ¡tiene los dos!',
    explain: 'F0 consigue <strong>T1</strong>. Tiene ambos tenedores: T0 y T1. <strong>El semáforo garantiza que nunca los 5 filósofos están buscando su tenedor derecho simultáneamente.</strong> Siempre hay al menos un "hueco" que permite completar el par. F0 puede comer.',
    insight: '✅ Esta es la clave del Semaphore(N-1): con 5 intentando podrían tomar todos el izquierdo y bloquearse. Con solo 4 intentando, SIEMPRE al menos uno puede completar el par → sistema avanza.',
    phils:   ['eating','thinking','thinking','thinking','thinking'],
    forks:   [0,0,null,null,null],
    permits: 3
  },
  {
    title: '😋 F0 come · F1, F2, F3 también piden permisos',
    explain: 'F0 está comiendo. Mientras tanto, F1, F2 y F3 tienen hambre y llaman a <code>sem.acquire()</code>. Los tres obtienen permiso. El semáforo baja: 3→2→1→<strong>0 permisos libres</strong>. Ahora el semáforo está completamente ocupado.',
    insight: '⚠️ Semáforo en 0/4. Si F4 pide permiso ahora, el semáforo lo <strong>BLOQUEARÁ</strong> antes de que pueda tocar cualquier tenedor. Esto es lo que rompe el ciclo de deadlock.',
    phils:   ['eating','waiting','waiting','waiting','thinking'],
    forks:   [0,0,null,null,null],
    permits: 0
  },
  {
    title: '🚦 F4 tiene hambre — el semáforo le dice ESPERA',
    explain: 'F4 quiere comer y llama a <code>sem.acquire()</code>. Pero el semáforo está en <strong>0</strong> — todos los permisos están ocupados. F4 queda <strong>BLOQUEADO en la cola del semáforo</strong>. No puede tomar T4 ni ningún tenedor. Queda suspendido esperando.',
    insight: '🔑 Sin el semáforo, F4 tomaría T4 y cerraría el ciclo de espera circular (deadlock). <strong>Con el semáforo, F4 ni siquiera puede intentarlo</strong> → el ciclo jamás se cierra → deadlock imposible. ¡Problema resuelto!',
    phils:   ['eating','waiting','waiting','waiting','hungry'],
    forks:   [0,0,null,null,null],
    permits: 0
  },
  {
    title: '✅ F0 termina — libera tenedores y devuelve el permiso',
    explain: 'F0 terminó de comer. Ejecuta en orden: suelta T0, suelta T1, luego <code>sem.release()</code>. El semáforo sube de 0 a <strong>1</strong>. F4, que estaba bloqueado esperando, <strong>se despierta automáticamente</strong> y recibe el permiso.',
    insight: '🔄 El ciclo virtuoso: comer → soltar tenedores → devolver permiso → despertar al siguiente en cola → el siguiente come. <strong>Progreso garantizado</strong>, siempre, sin excepciones.',
    phils:   ['thinking','waiting','waiting','waiting','hungry'],
    forks:   [null,null,null,null,null],
    permits: 1
  },
  {
    title: '🎫 F4 despierta — obtiene permiso, toma tenedores, come',
    explain: 'El semáforo despertó a F4 y le entregó el permiso (contador: 1→0). F4 toma <strong>T4</strong> (izquierdo) y <strong>T0</strong> (derecho, libre ahora que F0 terminó). F4 empieza a comer satisfactoriamente. El sistema sigue rotando.',
    insight: '✅ Ningún filósofo queda esperando para siempre. El sistema siempre avanza. <strong>0 deadlocks garantizados</strong> con Semaphore(N-1).',
    phils:   ['thinking','waiting','waiting','waiting','eating'],
    forks:   [4,null,null,null,4],
    permits: 0
  },
  {
    title: '🏆 Sistema estable — Semaphore(4) garantiza 0 deadlocks',
    explain: 'El sistema puede ejecutarse indefinidamente sin deadlock. Los filósofos comen, piensan y rotan. El <strong>Semaphore(N-1)</strong> elimina la condición de "espera circular" de Coffman al garantizar que nunca los N filósofos toman su tenedor izquierdo simultáneamente.',
    insight: '💡 <strong>La regla general:</strong> Para N filósofos con N recursos → usar <code>Semaphore(N-1)</code>. En Java:<br><code>Semaphore permiso = new Semaphore(4);</code><br>Antes de tomar cualquier tenedor: <code>permiso.acquire()</code><br>Al terminar de comer: <code>permiso.release()</code>',
    phils:   ['thinking','thinking','thinking','thinking','eating'],
    forks:   [4,null,null,null,4],
    permits: 1
  }
];

/* ── Aplicar un paso ────────────────────── */
function applyStep(step) {
  /* Visual state */
  for (let i = 0; i < PHIL_N; i++) setPhilState(i, step.phils[i]);
  for (let i = 0; i < PHIL_N; i++) {
    forks[i].held = step.forks[i];
    updateForkEl(i);
  }
  if (step.permits !== undefined) {
    semPermits = step.permits;
    updatePermits();
  }

  /* Panel de explicación */
  const badge   = document.getElementById('simStepBadge');
  const titleEl = document.getElementById('simStepTitle');
  const exEl    = document.getElementById('simStepExplain');
  const inEl    = document.getElementById('simStepInsight');
  const counter = document.getElementById('simStepCounter');

  if (badge)   badge.textContent = `Paso ${stepIdx + 1} de ${stepList.length}`;
  if (counter) counter.textContent = `${stepIdx + 1} / ${stepList.length}`;
  if (titleEl) titleEl.innerHTML = step.title;
  if (exEl)    exEl.innerHTML    = step.explain;
  if (inEl) {
    inEl.style.display = step.insight ? 'block' : 'none';
    if (step.insight) inEl.innerHTML = step.insight;
  }

  /* Botones nav */
  const prevBtn = document.getElementById('simPrevBtn');
  const nextBtn = document.getElementById('simNextBtn');
  if (prevBtn) prevBtn.disabled = (stepIdx === 0);
  if (nextBtn) {
    nextBtn.innerHTML = stepIdx >= stepList.length - 1
      ? '<i class="ph-bold ph-arrow-counter-clockwise"></i> Reiniciar'
      : 'Siguiente <i class="ph-bold ph-arrow-right"></i>';
  }

  /* Log */
  const logType = step.phils.includes('dead') ? 'dead'
    : step.phils.includes('eating') ? 'eat'
    : step.phils.includes('waiting') ? 'wait' : 'info';
  addLog(step.title.replace(/^[^\wÀ-úA-Z]/u, '').replace(/^[^\wÀ-ú]+/, '').trim(), logType);
}

/* ── Navegación pública ──────────────────── */
function simNextStep() {
  if (stepIdx < 0) {
    /* Primera vez: inicializar */
    stepList = simMode === 'deadlock' ? DEADLOCK_STEPS : SEMAPHORE_STEPS;
    stepIdx  = 0;
    initPhils();
    clearSimLog();
    for (let i = 0; i < PHIL_N; i++) { setPhilState(i,'thinking'); forks[i].held=null; updateForkEl(i); }
    updatePermits();
    applyStep(stepList[0]);
  } else if (stepIdx >= stepList.length - 1) {
    simReset();
  } else {
    stepIdx++;
    applyStep(stepList[stepIdx]);
  }
}

function simPrevStep() {
  if (stepIdx <= 0) return;
  stepIdx--;
  applyStep(stepList[stepIdx]);
}

function setMode(mode) {
  if (stepIdx >= 0) simReset();
  simMode = mode;
  document.getElementById('modeDeadlock').classList.toggle('m5simModeActive',  mode === 'deadlock');
  document.getElementById('modeSemaphore').classList.toggle('m5simModeActive', mode === 'semaphore');
  updatePermits();

  const badge = document.getElementById('simStepBadge');
  const exEl  = document.getElementById('simStepExplain');
  if (badge) badge.textContent = mode === 'deadlock' ? 'Modo: Sin control (→ deadlock)' : 'Modo: Con Semáforo(4) (→ estable)';
  if (exEl) exEl.innerHTML = mode === 'deadlock'
    ? 'Vas a ver cómo los 5 filósofos generan un deadlock paso a paso. Presioná <strong>Empezar</strong>.'
    : 'Vas a ver cómo Semaphore(4) previene el deadlock. Presioná <strong>Empezar</strong>.';
}

function simReset() {
  stepIdx  = -1;
  stepList = null;
  initPhils();
  for (let i = 0; i < PHIL_N; i++) { setPhilState(i,'thinking'); forks[i].held=null; updateForkEl(i); }
  clearSimLog();
  updatePermits();

  const badge   = document.getElementById('simStepBadge');
  const titleEl = document.getElementById('simStepTitle');
  const exEl    = document.getElementById('simStepExplain');
  const inEl    = document.getElementById('simStepInsight');
  const counter = document.getElementById('simStepCounter');
  const prevBtn = document.getElementById('simPrevBtn');
  const nextBtn = document.getElementById('simNextBtn');

  if (badge)   badge.textContent  = 'Elegí un modo ↑ y presioná Empezar';
  if (titleEl) titleEl.textContent = 'Simulador paso a paso';
  if (exEl)    exEl.innerHTML = 'Seleccioná el modo arriba y explorá paso a paso. Cada paso explica exactamente qué está pasando y por qué.';
  if (inEl)    inEl.style.display  = 'none';
  if (counter) counter.textContent = '— / —';
  if (prevBtn) prevBtn.disabled    = true;
  if (nextBtn) nextBtn.innerHTML   = 'Empezar <i class="ph-bold ph-arrow-right"></i>';
}

/* Inicializar en carga */
(function () {
  initPhils();
  updatePermits();
  for (let i = 0; i < PHIL_N; i++) { setPhilState(i,'thinking'); updateForkEl(i); }
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
