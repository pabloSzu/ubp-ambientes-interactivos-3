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

/* ─── Code tabs (main) ──────────────────── */
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

/* ─── Filesystem quirks tabs ────────────── */
function switchTabFs(btn, panelId) {
  document.querySelectorAll('.m5fsTab').forEach(t => t.classList.remove('m5fsTabActive'));
  document.querySelectorAll('.m5fsPanel').forEach(p => p.classList.add('m5fsPanelHidden'));
  btn.classList.add('m5fsTabActive');
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.remove('m5fsPanelHidden');
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
   SIMULADOR MODAL — Cena de los Filósofos
═══════════════════════════════════════════ */
const SM_EMOJI = { thinking:'💭', hungry:'🍽️', waiting:'⏳', eating:'😋', dead:'💀' };
const SM_LABEL = { thinking:'pensando', hungry:'hambriento', waiting:'esperando', eating:'comiendo', dead:'DEADLOCK' };

let smScene = 'deadlock';
let smView  = 'historia';
let smIdx   = -1;
let smSteps = null;

/* ── Step arrays ─────────────────────────── */
const DL_STEPS = [
  { title:'Estado inicial — todos pensando',
    watchThis:'Mirá los 5 círculos alrededor de la mesa: todos 💭 gris (pensando). Los tenedores T0–T4 están en verde: libres. No hay ningún control.',
    analogy:'5 amigos en una mesa redonda. Entre cada par hay 1 tenedor compartido. Para comer necesitás los 2 tenedores de tus lados. Ahora todos charlan, nadie tiene hambre todavía.',
    explain:'Cinco filósofos se sientan alrededor de una mesa circular. Entre cada par hay exactamente <strong>un tenedor compartido</strong>. Para comer, un filósofo necesita <strong>los dos tenedores</strong> de su lado. No existe ningún mecanismo de control.',
    insight:null, bubble:null, alert:null,
    highlight:[], highlightForks:[], wantFork:null,
    codeLine:-1, consoleOutput:'// Sistema iniciado — 5 filósofos pensando',
    phils:['thinking','thinking','thinking','thinking','thinking'], forks:[null,null,null,null,null], permits:4 },

  { title:'F0 tiene hambre — toma el tenedor izquierdo T0',
    watchThis:'Mirá F0 — cambió a 🍽️ amarillo. T0 (entre F0 y F1) ahora está NARANJA y brillante: F0 lo tomó. El badge "→ T1" indica que F0 quiere ese tenedor también.',
    analogy:'F0 agarró el tenedor de su izquierda con la mano. Pero para comer necesita también el de la derecha. <strong>No lo suelta mientras espera el otro</strong>. Eso se llama Hold & Wait.',
    explain:'F0 quiere comer. Sin ningún control, toma <strong>T0</strong> (su tenedor izquierdo). Ahora F0 <strong>retiene T0</strong> y espera conseguir T1 (su tenedor derecho) para poder comer.',
    insight:'⚠️ Primera condición de Coffman activada: <strong>Hold & Wait</strong> — F0 retiene T0 mientras espera T1.',
    bubble:{ phil:0, text:'Tomé T0 ✓ Espero T1...' },
    alert:{ type:'warn', text:'⚠️ HOLD & WAIT: F0 retiene T0 y espera T1' },
    highlight:[0], highlightForks:[0], wantFork:{ phil:0, fork:1 },
    codeLine:2, consoleOutput:'F0: synchronized(tenedor[0]) → OK\nF0: esperando tenedor[1]...',
    phils:['waiting','thinking','thinking','thinking','thinking'], forks:[0,null,null,null,null], permits:4 },

  { title:'F1 tiene hambre — toma su tenedor izquierdo T1',
    watchThis:'Ahora F1 también cambió a naranja ⏳. T1 (entre F1 y F2) está tomado. Fijate: F0 espera T1 pero F1 lo tiene. El primer "nudo" se forma.',
    analogy:'Tu vecino de la derecha también agarró su tenedor izquierdo. Vos querés el de él pero no lo suelta. El efecto dominó empieza.',
    explain:'F1 también quiere comer y hace exactamente lo mismo que F0: agarra <strong>T1</strong>. F1 retiene T1 y espera T2. Ya hay <strong>dos filósofos esperando</strong>, cada uno con un tenedor, esperando el del vecino.',
    insight:null,
    bubble:{ phil:1, text:'Tomé T1 ✓ Espero T2...' },
    alert:null,
    highlight:[1], highlightForks:[1], wantFork:{ phil:1, fork:2 },
    codeLine:2, consoleOutput:'F0: espera T1...\nF1: synchronized(tenedor[1]) → OK\nF1: espera T2...',
    phils:['waiting','waiting','thinking','thinking','thinking'], forks:[0,1,null,null,null], permits:4 },

  { title:'F2 y F3 hacen lo mismo — cuatro bloqueados',
    watchThis:'Mirá: F0, F1, F2, F3 en naranja, todos con 1 tenedor. T0, T1, T2, T3 están naranjas (tomados). Solo T4 sigue verde (libre). ¡Solo falta uno!',
    analogy:'Cuatro personas con un tenedor en la mano izquierda, esperando que el vecino suelte el suyo. Queda solo un tenedor libre... ya sabés lo que pasa.',
    explain:'F2 y F3 también tienen hambre. F2 toma T2 y espera T3. F3 toma T3 y espera T4. <strong>Cuatro filósofos tienen un tenedor cada uno</strong>. Solo T4 está libre.',
    insight:null,
    bubble:{ phil:2, text:'Tomé T2 ✓ Espero T3...' },
    alert:{ type:'warn', text:'4 filósofos retienen 1 tenedor cada uno — solo T4 libre' },
    highlight:[2,3], highlightForks:[2,3], wantFork:{ phil:2, fork:3 },
    codeLine:2, consoleOutput:'F0: espera T1\nF1: espera T2\nF2: espera T3\nF3: espera T4',
    phils:['waiting','waiting','waiting','waiting','thinking'], forks:[0,1,2,3,null], permits:4 },

  { title:'F4 toma T4 — ¡EL SISTEMA COLAPSA!',
    watchThis:'¡Todos en ROJO 💀! Todos los tenedores en naranja. Nadie puede moverse. El sistema está paralizado para siempre. Esto es DEADLOCK.',
    analogy:'El 5to amigo agarró el último tenedor. Ahora cada uno tiene 1 y espera el del vecino. Para siempre. Nadie come. Nunca.',
    explain:'F4 toma <strong>T4</strong>, el último tenedor libre. Ahora <strong>TODOS los tenedores están ocupados</strong>. Cada filósofo espera el del vecino. El ciclo se cerró: F0→F1→F2→F3→F4→F0. <strong>Nadie puede avanzar jamás.</strong>',
    insight:'🔴 <strong>DEADLOCK:</strong> F0 espera T1 (F1 lo tiene) · F1 espera T2 (F2) · F2 espera T3 (F3) · F3 espera T4 (F4) · F4 espera T0 (F0). Ciclo cerrado = deadlock permanente.',
    bubble:{ phil:4, text:'Tomé T4... ¿quién tiene T0?! 💀' },
    alert:{ type:'danger', text:'🔴 DEADLOCK — F0→F1→F2→F3→F4→F0. Ciclo cerrado. Sistema paralizado para siempre.' },
    highlight:[0,1,2,3,4], highlightForks:[0,1,2,3,4], wantFork:null,
    codeLine:3, consoleOutput:'💀 DEADLOCK DETECTADO\nNingún hilo puede avanzar.',
    phils:['dead','dead','dead','dead','dead'], forks:[0,1,2,3,4], permits:4 },

  { title:'Las 4 condiciones de Coffman — todas presentes',
    watchThis:'El diagrama muestra el deadlock final. Cada filósofo (rojo) retiene un tenedor y espera el siguiente. El ciclo es perfecto, cerrado e insoluble.',
    analogy:'Es como 5 autos en una rotonda, cada uno esperando que el de adelante avance. Nadie se mueve porque todos esperan al mismo tiempo.',
    explain:'Coffman (1971) demostró que un deadlock ocurre si y solo si se cumplen <strong>4 condiciones simultáneamente</strong>. Para prevenirlo, basta con <strong>romper cualquiera de las cuatro</strong>.',
    insight:'① <strong>Exclusión mutua:</strong> cada tenedor lo usa uno a la vez.<br>② <strong>Hold & Wait:</strong> retiene lo que tiene mientras espera más.<br>③ <strong>No preempción:</strong> nadie puede quitarle el tenedor por la fuerza.<br>④ <strong>Espera circular:</strong> F0→F1→F2→F3→F4→F0. <strong>Rompé cualquiera = sin deadlock.</strong>',
    bubble:null,
    alert:{ type:'danger', text:'4 condiciones de Coffman CUMPLIDAS: ① exclusión mutua ② hold&wait ③ no preempción ④ espera circular' },
    highlight:[], highlightForks:[], wantFork:null,
    codeLine:3, consoleOutput:'// ① Exclusión mutua: ✓\n// ② Hold & Wait: ✓\n// ③ No preempción: ✓\n// ④ Espera circular: ✓\n// → DEADLOCK inevitable sin control',
    phils:['dead','dead','dead','dead','dead'], forks:[0,1,2,3,4], permits:4 },

  { title:'Solución: Semaphore(4) rompe la espera circular',
    watchThis:'Probá el escenario "Semáforo(4)" con el botón en el header arriba. Vas a ver el semáforo aparecer en el centro de la mesa y cómo previene este colapso exactamente.',
    analogy:'Un portero en el restaurante que dice "máximo 4 personas pueden ir a buscar cubiertos al mismo tiempo". El 5to espera afuera. Siempre hay cubiertos para completar un juego.',
    explain:'La solución más elegante: agregar un <strong>Semáforo(4)</strong>. Máximo 4 de los 5 filósofos pueden intentar comer simultáneamente. El 5to no puede tomar ningún tenedor. Siempre hay espacio para completar el par.',
    insight:'✅ <strong>¿Por qué funciona?</strong> Con solo 4 intentando, siempre habrá al menos un tenedor libre para completar un par → uno come → sistema avanza → 0 deadlocks. Probá el modo Semáforo(4) →',
    bubble:null,
    alert:{ type:'success', text:'✅ Solución: Semaphore(N-1) elimina la espera circular. Probá el modo Semáforo(4) →' },
    highlight:[], highlightForks:[], wantFork:null,
    codeLine:-1, consoleOutput:'// Solución:\nSemaphore permiso = new Semaphore(4);\n// Antes de tomar tenedores:\npermiso.acquire();\n// Al terminar:\npermiso.release();',
    phils:['dead','dead','dead','dead','dead'], forks:[0,1,2,3,4], permits:4 }
];

const SEM_STEPS = [
  { title:'Semáforo(4) instalado — 4 permisos disponibles',
    watchThis:'Mirá el CENTRO de la mesa — cambió: ya no dice "Mesa" sino SEMÁFORO con 4 puntos violetas (4/4 libres). Los filósofos siguen pensando. El control está activo.',
    analogy:'El restaurante instaló un sistema de fichas. Antes de ir a buscar cubiertos necesitás pedir una ficha. Si no hay fichas disponibles, esperás en la entrada sin tocar nada.',
    explain:'Se instala un <strong>Semáforo con contador = 4</strong>. La regla es obligatoria: antes de tomar cualquier tenedor, el filósofo debe ejecutar <code>permiso.acquire()</code>. Si el contador llega a 0, el próximo queda bloqueado.',
    insight:'🔑 El semáforo funciona como un portero: solo 4 personas pueden estar en el "área de tenedores" a la vez.',
    bubble:null,
    alert:{ type:'info', text:'🎫 Semaphore(4) activo — máx. 4 filósofos pueden intentar comer simultáneamente' },
    highlight:[], highlightForks:[], wantFork:null,
    codeLine:0, consoleOutput:'// Semaphore permiso = new Semaphore(4);\n// Sistema con control de acceso listo.',
    phils:['thinking','thinking','thinking','thinking','thinking'], forks:[null,null,null,null,null], permits:4 },

  { title:'F0 tiene hambre — pide permiso al semáforo',
    watchThis:'En el centro de la mesa: un punto violeta se APAGÓ (3/4). F0 cambió a 🍽️ amarillo: obtuvo el permiso y ahora puede buscar tenedores.',
    analogy:'F0 pidió una ficha en la entrada. Le dieron una (quedan 3). Ahora puede acercarse a la mesa a buscar cubiertos.',
    explain:'F0 quiere comer. Primero ejecuta <code>permiso.acquire()</code>. El semáforo tiene 4 → concede el permiso y decrementa: 4→<strong>3/4</strong>. F0 queda autorizado.',
    insight:'📊 Semáforo: 4→3. F0 tiene permiso para proceder.',
    bubble:{ phil:0, text:'¡Tengo permiso! (3/4 libres)' },
    alert:{ type:'info', text:'F0 → permiso.acquire() → Semáforo: 4→3' },
    highlight:[0], highlightForks:[], wantFork:null,
    codeLine:1, consoleOutput:'F0: permiso.acquire() → sem=3\nF0: tengo permiso, busco tenedores...',
    phils:['hungry','thinking','thinking','thinking','thinking'], forks:[null,null,null,null,null], permits:3 },

  { title:'F0 toma T0 y T1 — ¡tiene los dos! Come.',
    watchThis:'T0 y T1 están NARANJAS (tomados por F0). F0 cambió a 😋 VERDE: comiendo. Esto es posible porque el semáforo garantizó que hubiera tenedores disponibles.',
    analogy:'Con su ficha, F0 agarró el tenedor izquierdo y luego el derecho sin problema. ¡Puede comer! La ficha aseguró que hubiera cubiertos disponibles.',
    explain:'Con el permiso en mano, F0 toma <strong>T0</strong> (izquierdo) y luego <strong>T1</strong> (derecho). Al tener ambos tenedores, F0 puede comer. El semáforo garantizó que hubiera espacio.',
    insight:'✅ Con 5 intentando simultáneamente, todos toman el izquierdo y se bloquean. Con solo 4, siempre hay un "hueco" para completar el par.',
    bubble:{ phil:0, text:'¡Tengo T0 y T1! 😋 Como' },
    alert:{ type:'success', text:'✅ F0 come — Semáforo garantizó que T1 estuviera libre' },
    highlight:[0], highlightForks:[0,1], wantFork:null,
    codeLine:2, consoleOutput:'F0: synchronized(tenedor[0]) → OK\nF0: synchronized(tenedor[1]) → OK\nF0: comiendo...',
    phils:['eating','thinking','thinking','thinking','thinking'], forks:[0,0,null,null,null], permits:3 },

  { title:'F0 come — F1, F2, F3 piden permisos (3→0)',
    watchThis:'Mirá el centro: los 4 puntos violetas están TODOS APAGADOS (0/4). F1, F2, F3 en naranja esperando sus tenedores. Semáforo agotado.',
    analogy:'Las 3 fichas restantes fueron tomadas. Si llega F4 ahora, no hay fichas → espera en la entrada → no puede cerrar el ciclo de deadlock.',
    explain:'F0 está comiendo. F1, F2 y F3 tienen hambre y llaman a <code>permiso.acquire()</code>. Los tres obtienen permiso. El semáforo baja: 3→2→1→<strong>0 permisos libres</strong>.',
    insight:'⚠️ Semáforo en 0/4. Si F4 pide permiso ahora, será BLOQUEADO antes de tocar cualquier tenedor. Esto rompe el ciclo de deadlock.',
    bubble:{ phil:1, text:'Tengo permiso (0/4 libres)' },
    alert:{ type:'warn', text:'⚠️ Semáforo en 0/4 — F4 será BLOQUEADO si intenta ahora' },
    highlight:[1,2,3], highlightForks:[], wantFork:null,
    codeLine:1, consoleOutput:'F1: sem=2 · F2: sem=1 · F3: sem=0\nF0: comiendo\n// Semáforo agotado',
    phils:['eating','waiting','waiting','waiting','thinking'], forks:[0,0,null,null,null], permits:0 },

  { title:'F4 tiene hambre — el semáforo lo BLOQUEA',
    watchThis:'F4 está en naranja ⏳ pero fijate: NO tiene ningún tenedor. El semáforo lo detuvo ANTES de que pudiera agarrar nada. ¡Eso es lo que rompe el deadlock!',
    analogy:'F4 llega al restaurante y no hay fichas disponibles. Tiene que esperar en la entrada sin tocar nada. Por eso no puede cerrar el ciclo de espera circular.',
    explain:'F4 quiere comer y llama a <code>permiso.acquire()</code>. El semáforo está en <strong>0</strong> → F4 queda <strong>BLOQUEADO</strong>. No puede tocar T4 ni ningún tenedor. El ciclo de deadlock no puede cerrarse.',
    insight:'🔑 Sin el semáforo, F4 tomaría T4 y cerraría el ciclo. <strong>Con el semáforo, F4 no puede intentarlo</strong> → ciclo jamás se cierra → deadlock imposible.',
    bubble:{ phil:4, text:'Quiero comer... 🚫 sem=0, espero afuera' },
    alert:{ type:'info', text:'🚦 F4 bloqueado — sin tenedores. Ciclo de deadlock IMPOSIBLE.' },
    highlight:[4], highlightForks:[], wantFork:null,
    codeLine:1, consoleOutput:'F4: permiso.acquire() → BLOQUEADO (sem=0)\n// F4 espera sin tocar ningún tenedor\n// → ciclo de deadlock imposible',
    phils:['eating','waiting','waiting','waiting','hungry'], forks:[0,0,null,null,null], permits:0 },

  { title:'F0 termina — libera tenedores y devuelve el permiso',
    watchThis:'T0 y T1 volvieron al VERDE (libres). F0 gris: pensando de nuevo. En el centro, un punto violeta se encendió (0→1). F4 está por despertar.',
    analogy:'F0 terminó, devolvió los cubiertos y la ficha. El portero se la entrega inmediatamente a F4 que estaba esperando afuera.',
    explain:'F0 terminó de comer. Suelta T0, suelta T1, y ejecuta <code>permiso.release()</code>. El semáforo sube de 0 a <strong>1</strong>. F4, bloqueado esperando, <strong>se despierta automáticamente</strong>.',
    insight:'🔄 El ciclo virtuoso: comer → soltar → devolver permiso → despertar al siguiente → el siguiente come. <strong>Progreso garantizado siempre.</strong>',
    bubble:{ phil:0, text:'Listo. Suelto T0, T1 y el permiso 🔄' },
    alert:{ type:'success', text:'🔄 permiso.release() → sem=1. F4 se despierta.' },
    highlight:[0], highlightForks:[], wantFork:null,
    codeLine:3, consoleOutput:'F0: terminó de comer\nF0: permiso.release() → sem=1\nF4: ¡desbloqueado! permiso recibido.',
    phils:['thinking','waiting','waiting','waiting','hungry'], forks:[null,null,null,null,null], permits:1 },

  { title:'F4 despierta, toma tenedores y come',
    watchThis:'F4 en VERDE 😋 comiendo. Tiene T4 y T0 (naranja). Semáforo en 0/4 de nuevo. F1, F2, F3 siguen esperando turno — pero el sistema AVANZA, no está bloqueado.',
    analogy:'F4 recibió la ficha, tomó los cubiertos disponibles y come. Al terminar, devolverá la ficha y otro podrá comer. El restaurante funciona indefinidamente.',
    explain:'El semáforo despertó a F4 (1→0). F4 toma <strong>T4</strong> y <strong>T0</strong> (libre ahora que F0 terminó). F4 empieza a comer. El sistema sigue rotando indefinidamente.',
    insight:'✅ Ningún filósofo queda esperando para siempre. <strong>0 deadlocks garantizados con Semaphore(N-1).</strong> La solución es elegante y generalizable a cualquier N.',
    bubble:{ phil:4, text:'¡Tengo T4 y T0! 😋 Como' },
    alert:{ type:'success', text:'🏆 Sistema estable — Semaphore(4) garantiza 0 deadlocks. Ciclo virtuoso activo.' },
    highlight:[4], highlightForks:[3,4], wantFork:null,
    codeLine:2, consoleOutput:'F4: synchronized(tenedor[4]) → OK\nF4: synchronized(tenedor[0]) → OK\nF4: comiendo — sistema rotando ✅',
    phils:['thinking','waiting','waiting','waiting','eating'], forks:[4,null,null,null,4], permits:0 }
];

const DL_CODE = `// SIN SEMÁFORO — Deadlock garantizado
Object[] tenedor = new Object[5];

synchronized (tenedor[id]) {           // ← toma tenedor izquierdo
    synchronized (tenedor[(id+1)%5]) { // ← espera tenedor derecho
        comer(); // nunca llega si hay deadlock
    }
}
// Con 5 filósofos al mismo tiempo:
// todos toman el izquierdo → deadlock`;

const SEM_CODE = `// CON SEMÁFORO(4) — Deadlock imposible
Semaphore permiso = new Semaphore(4);  // ← control clave
Object[] tenedor = new Object[5];

pensar();
permiso.acquire();                     // ← bloquea si sem=0
synchronized (tenedor[id]) {           // ← toma tenedor izquierdo
    synchronized (tenedor[(id+1)%5]) { // ← toma tenedor derecho
        comer();
    }
}
permiso.release();                     // ← devuelve permiso`;

const DL_CODE_LINES  = [-1,3,3,3,4,4,-1];
const SEM_CODE_LINES = [0,5,6,5,5,10,6];

/* ── Modal open/close ─────────────────── */
function smOpen() {
  document.getElementById('smOverlay').classList.add('sm-open');
  document.addEventListener('keydown', smKey);
}
function smClose() {
  document.getElementById('smOverlay').classList.remove('sm-open');
  document.removeEventListener('keydown', smKey);
}
function smKey(e) {
  if (e.key === 'Escape')      smClose();
  if (e.key === 'ArrowRight')  smNext();
  if (e.key === 'ArrowLeft')   smPrev();
}
document.getElementById('smOverlay').addEventListener('click', function(e) {
  if (e.target === this) smClose();
});

/* ── View ─────────────────────────────── */
function smSetView(v) {
  smView = v;
  document.getElementById('vtHistoria').classList.toggle('sm-vtActive', v === 'historia');
  document.getElementById('vtCodigo').classList.toggle('sm-vtActive',   v === 'codigo');
  document.getElementById('smNarH').style.display = v === 'historia' ? 'flex' : 'none';
  document.getElementById('smNarC').style.display = v === 'codigo'   ? 'flex' : 'none';
  if (smIdx >= 0 && smSteps) smApplyNarrative(smSteps[smIdx]);
}

/* ── Scene ────────────────────────────── */
function smSetScene(sc) {
  smScene = sc;
  document.getElementById('stDL').classList.toggle('sm-stActive',  sc === 'deadlock');
  document.getElementById('stSEM').classList.toggle('sm-stActive', sc === 'semaphore');
  smReset();
}

/* ── Reset ────────────────────────────── */
function smReset() {
  smIdx = -1; smSteps = null;
  for (let i = 0; i < 5; i++) smSetPhil(i,'thinking');
  for (let i = 0; i < 5; i++) smSetFork(i, null);
  for (let i = 0; i < 5; i++) {
    const sp = document.getElementById(`smSp${i}`);
    if (sp) { sp.textContent=''; sp.classList.remove('sm-show'); }
    const w = document.getElementById(`smW${i}`);
    if (w)  { w.textContent='';  w.classList.remove('sm-show'); }
  }
  smHideAlert();
  smUpdateSem(-1);
  smApplyHighlight([],[]);
  const hdr = smScene==='deadlock' ? 'Sin control → Deadlock' : 'Semáforo(4) → Estable';
  document.getElementById('smHdrStep').textContent = `${hdr} — presioná →`;
  document.getElementById('smChipH').textContent = `${hdr} · avanzá con →`;
  document.getElementById('smChipC').textContent = `${hdr} · avanzá con →`;
  document.getElementById('smTitleH').textContent = 'Simulador listo — presioná → para empezar';
  document.getElementById('smTitleC').textContent = 'Código Java';
  document.getElementById('smWatch').innerHTML = 'Usá las flechas ← → a los lados del diagrama (o las teclas del teclado). Cada paso tiene un cartel en el diagrama y su explicación acá.';
  document.getElementById('smAnalogy').textContent = 'La analogía cotidiana aparece con el primer paso.';
  document.getElementById('smExplain').innerHTML = smScene==='deadlock'
    ? 'Vas a ver cómo los 5 filósofos generan un <strong>deadlock</strong> paso a paso, con las 4 condiciones de Coffman.'
    : 'Vas a ver cómo el <strong>Semaphore(4)</strong> previene el deadlock garantizando que siempre haya progreso.';
  document.getElementById('smInsight').style.display  = 'none';
  document.getElementById('smInsightC').style.display = 'none';
  const codeEl = document.getElementById('smCodeContent');
  if (codeEl) { codeEl.textContent = smScene==='deadlock' ? DL_CODE : SEM_CODE; if (window.Prism) Prism.highlightElement(codeEl); }
  document.getElementById('smConsole').textContent = '// Elegí un escenario y presioná →';
  document.getElementById('smSidePrev').disabled = true;
  document.getElementById('smFootPrev').disabled = true;
  document.getElementById('smSideNext').innerHTML = '<i class="ph-bold ph-caret-right"></i>';
  document.getElementById('smFootNext').innerHTML = 'Empezar <i class="ph-bold ph-arrow-right"></i>';
  smBuildDots(0);
}

/* ── Navigation ───────────────────────── */
function smNext() {
  if (!smSteps) {
    smSteps = smScene==='deadlock' ? DL_STEPS : SEM_STEPS;
    smIdx   = 0;
    smBuildDots(smSteps.length);
  } else if (smIdx >= smSteps.length - 1) {
    smReset(); return;
  } else {
    smIdx++;
  }
  smApplyStep(smSteps[smIdx]);
}
function smPrev() {
  if (!smSteps || smIdx <= 0) return;
  smIdx--;
  smApplyStep(smSteps[smIdx]);
}

/* ── Apply step ───────────────────────── */
function smApplyStep(step) {
  for (let i = 0; i < 5; i++) smSetPhil(i, step.phils[i]);
  for (let i = 0; i < 5; i++) smSetFork(i, step.forks[i]);
  smApplyHighlight(step.highlight || [], step.highlightForks || []);
  // Speech bubbles
  for (let i = 0; i < 5; i++) {
    const sp = document.getElementById(`smSp${i}`);
    if (!sp) continue;
    if (step.bubble && step.bubble.phil === i) { sp.textContent = step.bubble.text; sp.classList.add('sm-show'); }
    else { sp.textContent = ''; sp.classList.remove('sm-show'); }
  }
  // Want indicators
  for (let i = 0; i < 5; i++) {
    const w = document.getElementById(`smW${i}`);
    if (!w) continue;
    if (step.wantFork && step.wantFork.phil === i) { w.textContent = `→ T${step.wantFork.fork}`; w.classList.add('sm-show'); }
    else { w.textContent = ''; w.classList.remove('sm-show'); }
  }
  // Alert
  if (step.alert) smShowAlert(step.alert);
  else smHideAlert();
  // Semaphore
  smUpdateSem(step.permits);
  // Narrative
  smApplyNarrative(step);
  // Header
  document.getElementById('smHdrStep').textContent = `Paso ${smIdx+1} de ${smSteps.length} · ${smScene==='deadlock'?'Sin control':'Semáforo(4)'}`;
  // Buttons
  const isLast = smIdx >= smSteps.length - 1;
  document.getElementById('smSidePrev').disabled = smIdx === 0;
  document.getElementById('smFootPrev').disabled = smIdx === 0;
  document.getElementById('smSideNext').innerHTML = isLast ? '<i class="ph-bold ph-arrow-counter-clockwise"></i>' : '<i class="ph-bold ph-caret-right"></i>';
  document.getElementById('smFootNext').innerHTML = isLast ? 'Reiniciar <i class="ph-bold ph-arrow-counter-clockwise"></i>' : 'Siguiente <i class="ph-bold ph-arrow-right"></i>';
  smUpdateDots();
}

/* ── Narrative ────────────────────────── */
function smApplyNarrative(step) {
  const total = smSteps ? smSteps.length : 1;
  const badge = `Paso ${smIdx+1} / ${total} · ${smScene==='deadlock'?'Sin control':'Semáforo(4)'}`;
  if (smView === 'historia') {
    document.getElementById('smChipH').textContent = badge;
    document.getElementById('smTitleH').textContent = step.title;
    document.getElementById('smWatch').innerHTML    = step.watchThis;
    document.getElementById('smAnalogy').innerHTML  = step.analogy;
    document.getElementById('smExplain').innerHTML  = step.explain;
    const ins = document.getElementById('smInsight');
    if (step.insight) { ins.innerHTML = step.insight; ins.style.display = 'block'; }
    else ins.style.display = 'none';
  } else {
    document.getElementById('smChipC').textContent = badge;
    document.getElementById('smTitleC').textContent = step.title;
    const codeStr  = smScene==='deadlock' ? DL_CODE : SEM_CODE;
    const codeLines = smScene==='deadlock' ? DL_CODE_LINES : SEM_CODE_LINES;
    const lineIdx  = codeLines[Math.min(smIdx, codeLines.length-1)];
    const escaped  = codeStr.split('\n').map((ln,i) =>
      i === lineIdx
        ? `<mark class="sm-codeMark">${smEsc(ln)}</mark>`
        : smEsc(ln)
    ).join('\n');
    document.getElementById('smCodeContent').innerHTML = escaped;
    document.getElementById('smConsole').textContent   = step.consoleOutput || '';
    const ins = document.getElementById('smInsightC');
    if (step.insight) { ins.innerHTML = step.insight; ins.style.display = 'block'; }
    else ins.style.display = 'none';
  }
}
function smEsc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ── Philosopher state ────────────────── */
function smSetPhil(id, state) {
  const el = document.getElementById(`smP${id}`);
  if (!el) return;
  ['sm-thinking','sm-hungry','sm-waiting','sm-eating','sm-dead'].forEach(c => el.classList.remove(c));
  el.classList.add(`sm-${state}`);
  const em = document.getElementById(`smE${id}`); if (em) em.textContent = SM_EMOJI[state];
  const st = document.getElementById(`smS${id}`); if (st) st.textContent = SM_LABEL[state];
}

/* ── Fork state ───────────────────────── */
function smSetFork(id, owner) {
  const el = document.getElementById(`smF${id}`);
  const ow = document.getElementById(`smFO${id}`);
  if (!el) return;
  if (owner !== null) {
    el.classList.add('sm-held');
    if (ow) { ow.textContent = `F${owner}`; ow.classList.add('sm-show'); }
  } else {
    el.classList.remove('sm-held');
    if (ow) { ow.textContent = ''; ow.classList.remove('sm-show'); }
  }
}

/* ── Highlight/dim ────────────────────── */
function smApplyHighlight(phils, forks) {
  const ap = phils && phils.length > 0;
  const af = forks && forks.length > 0;
  for (let i = 0; i < 5; i++) {
    const pe = document.getElementById(`smP${i}`);
    const fe = document.getElementById(`smF${i}`);
    if (pe) pe.classList.toggle('sm-dim', ap && !phils.includes(i));
    if (fe) fe.classList.toggle('sm-dim', af && !forks.includes(i) && !fe.classList.contains('sm-held'));
  }
}

/* ── Alert ────────────────────────────── */
function smShowAlert(alert) {
  const box = document.getElementById('smAlertBox');
  if (!box) return;
  const t = alert.type.charAt(0).toUpperCase() + alert.type.slice(1);
  box.className = `sm-alertBox sm-alert${t} sm-show`;
  box.innerHTML = `<div class="sm-alertInner">${alert.text}</div>`;
}
function smHideAlert() {
  const box = document.getElementById('smAlertBox');
  if (box) { box.className = 'sm-alertBox'; box.innerHTML = ''; }
}

/* ── Semaphore in center ──────────────── */
function smUpdateSem(permits) {
  const mesa = document.getElementById('smCenterMesa');
  const sem  = document.getElementById('smCenterSem');
  const ctr  = document.getElementById('smCenter');
  const cnt  = document.getElementById('smSemCount');
  if (!mesa || !sem) return;
  if (smScene === 'semaphore' && permits >= 0) {
    mesa.style.display = 'none'; sem.classList.add('sm-visible');
    ctr.classList.add('sm-semMode');
    if (permits === 0) ctr.classList.add('sm-semEmpty');
    else ctr.classList.remove('sm-semEmpty');
    if (cnt) cnt.textContent = `${permits}/4`;
    for (let i = 0; i < 4; i++) {
      const d = document.getElementById(`sd${i}`);
      if (d) d.classList.toggle('sm-free', i < permits);
    }
  } else {
    mesa.style.display = 'flex'; sem.classList.remove('sm-visible');
    ctr.classList.remove('sm-semMode','sm-semEmpty');
  }
}

/* ── Dots ─────────────────────────────── */
function smBuildDots(count) {
  const c = document.getElementById('smDots'); if (!c) return;
  c.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const b = document.createElement('button'); b.className = 'sm-dot';
    b.title = `Paso ${i+1}`; b.onclick = () => smGoTo(i); c.appendChild(b);
  }
  smUpdateDots();
}
function smUpdateDots() {
  const c = document.getElementById('smDots'); if (!c || !smSteps) return;
  c.querySelectorAll('.sm-dot').forEach((d,i) => {
    d.classList.toggle('sm-seen',    i <= smIdx);
    d.classList.toggle('sm-current', i === smIdx);
  });
}
function smGoTo(idx) { if (!smSteps) return; smIdx = idx; smApplyStep(smSteps[smIdx]); }

/* Inicializar */
(function() { smReset(); })();

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
  const scenarioEl = document.getElementById('gameScenario');
  const lang = sc.scenario.trimStart().startsWith('--') ? 'sql' : 'java';
  const escaped = sc.scenario.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  scenarioEl.innerHTML = `<pre class="language-${lang}" style="margin:0;border-radius:10px"><code class="language-${lang}">${escaped}</code></pre>`;
  if (window.Prism) Prism.highlightAllUnder(scenarioEl);

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

/* ═══════════════════════════════════════════
   RACE CONDITION SIMULATOR
═══════════════════════════════════════════ */

const rc = {
  mode: 'race',
  step: 0,
  counter: 0,
  expected: 0,
  lost: 0,
  rounds: 0,
  running: false,
  timer: null,
  locked: null,
  speedMs: 700,
  t1: { local: null, state: 'idle' },
  t2: { local: null, state: 'idle' },
};

/* ── Helpers ─────────────────────────────── */
function rcSetThread(id, state, local) {
  const t = id === 'T1' ? rc.t1 : rc.t2;
  t.state = state; t.local = local;
  const el = document.getElementById('rcThread' + id);
  if (el) el.dataset.state = state;
  const opEl = document.getElementById('rcOp' + id);
  const stateLabels = {
    idle: 'IDLE', reading: 'READ ←', incrementing: 'local++',
    writing: '→ WRITE', waiting: 'ESPERANDO…', locked: '🔒 TIENE LOCK',
  };
  if (opEl) opEl.textContent = stateLabels[state] || state.toUpperCase();
  const localEl = document.getElementById('rcLocal' + id);
  if (localEl) localEl.textContent = local !== null && local !== undefined ? local : '–';
}

function rcDrawCounter(lost) {
  const valEl = document.getElementById('rcCounterVal');
  const box   = document.getElementById('rcCounterBox');
  if (valEl) valEl.textContent = rc.counter;
  if (lost && box) {
    box.classList.remove('lost');
    void box.offsetWidth; // reflow to restart animation
    box.classList.add('lost');
    // floating badge
    const badge = document.createElement('div');
    badge.className = 'm5rcLostBadge';
    badge.textContent = '−1 PERDIDO';
    box.appendChild(badge);
    setTimeout(() => { box.classList.remove('lost'); badge.remove(); }, 1200);
  }
}

function rcDrawLock(holder) {
  const el = document.getElementById('rcLockBadge');
  if (!el) return;
  if (!holder) { el.textContent = 'LIBRE'; el.dataset.state = 'free'; }
  else if (holder === 'T1') { el.textContent = '🔒 T1'; el.dataset.state = 't1'; }
  else { el.textContent = '🔒 T2'; el.dataset.state = 't2'; }
}

function rcNarrate(html) {
  const el = document.getElementById('rcNarration');
  if (el) el.innerHTML = html;
}

function rcDrawStats() {
  const set = (id, val, cls) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = val;
    el.className = 'm5rcStatNum' + (cls ? ' ' + cls : '');
  };
  set('rcExpected', rc.expected);
  set('rcActual',   rc.counter,  rc.lost > 0 && rc.mode === 'race' ? 'bad' : '');
  set('rcLost',     rc.lost,     rc.lost > 0 ? 'bad' : '');
  set('rcRounds',   rc.rounds);
}

/* ── Race steps (1 round = 4 steps) ─────── */
const rcRaceSteps = [
  () => {
    const v = rc.counter;
    rc.t1.local = v; rc.t2.local = v;
    rcSetThread('T1', 'reading', v);
    rcSetThread('T2', 'reading', v);
    rcNarrate(`Ambos hilos llaman a <code>contador++</code> al mismo tiempo. Los dos leen el valor actual: <strong>${v}</strong>. El scheduler puede interrumpirlos entre el READ y el WRITE.`);
  },
  () => {
    rc.t1.local++; rc.t2.local++;
    rcSetThread('T1', 'incrementing', rc.t1.local);
    rcSetThread('T2', 'incrementing', rc.t2.local);
    rcNarrate(`T1 calcula <strong>${rc.t1.local - 1} + 1 = ${rc.t1.local}</strong>. T2 calcula <strong>${rc.t2.local - 1} + 1 = ${rc.t2.local}</strong>. Ambos tienen el mismo resultado en su registro privado.`);
  },
  () => {
    rc.counter = rc.t1.local;
    rcSetThread('T1', 'writing', rc.t1.local);
    rcSetThread('T2', 'idle', null);
    rcDrawCounter(false);
    rcNarrate(`T1 escribe <strong>${rc.t1.local}</strong>. Contador = ${rc.counter}. Hasta acá todo bien... ahora T2 también va a escribir su valor.`);
  },
  () => {
    rc.counter = rc.t2.local; // mismo valor → overwrite
    rc.expected += 2;
    rc.lost++;
    rc.rounds++;
    rcSetThread('T1', 'idle', null);
    rcSetThread('T2', 'writing', rc.t2.local);
    rcDrawCounter(true);
    rcDrawStats();
    rcNarrate(`💥 T2 escribe <strong>${rc.t2.local}</strong>... ¡el mismo número que T1! El contador debería ser <strong>${rc.expected}</strong> pero quedó en <strong>${rc.counter}</strong>. <strong>Un incremento se perdió para siempre.</strong> Esto es una race condition.`);
  },
];

/* ── Mutex steps (1 round = 8 steps) ────── */
const rcMutexSteps = [
  () => {
    rc.locked = 'T1';
    rcSetThread('T1', 'locked', null);
    rcSetThread('T2', 'waiting', null);
    rcDrawLock('T1');
    rcNarrate(`T1 llama a <code>mutex.lock()</code> y lo adquiere. El SO bloquea a T2 automáticamente — intentó hacer <code>lock()</code> pero alguien ya lo tiene. T2 no consume CPU mientras espera.`);
  },
  () => {
    rc.t1.local = rc.counter;
    rcSetThread('T1', 'reading', rc.t1.local);
    rcNarrate(`T1 lee el contador con exclusividad total: <strong>${rc.t1.local}</strong>. Nadie más puede leer ni escribir mientras T1 tiene el mutex.`);
  },
  () => {
    rc.t1.local++;
    rcSetThread('T1', 'incrementing', rc.t1.local);
    rcNarrate(`T1 calcula: <strong>${rc.t1.local - 1} + 1 = ${rc.t1.local}</strong>. T2 sigue bloqueado esperando el mutex.`);
  },
  () => {
    rc.counter = rc.t1.local;
    rcSetThread('T1', 'writing', rc.t1.local);
    rcDrawCounter(false);
    rcNarrate(`T1 escribe <strong>${rc.t1.local}</strong>. Contador actualizado correctamente. Ahora va a liberar el mutex.`);
  },
  () => {
    rc.locked = 'T2';
    rcSetThread('T1', 'idle', null);
    rcSetThread('T2', 'locked', null);
    rcDrawLock('T2');
    rcNarrate(`T1 llama a <code>mutex.unlock()</code>. El SO desbloquea a T2 que estaba esperando. T2 adquiere el mutex inmediatamente.`);
  },
  () => {
    rc.t2.local = rc.counter; // lee el valor YA actualizado por T1
    rcSetThread('T2', 'reading', rc.t2.local);
    rcNarrate(`T2 lee <strong>${rc.t2.local}</strong> — el valor correcto que dejó T1, no el valor viejo. Esto es exactamente lo que el mutex garantiza.`);
  },
  () => {
    rc.t2.local++;
    rcSetThread('T2', 'incrementing', rc.t2.local);
    rcNarrate(`T2 calcula: <strong>${rc.t2.local - 1} + 1 = ${rc.t2.local}</strong>.`);
  },
  () => {
    rc.counter = rc.t2.local;
    rc.locked = null;
    rc.expected += 2;
    rc.rounds++;
    rcSetThread('T2', 'idle', null);
    rcDrawCounter(false);
    rcDrawLock(null);
    rcDrawStats();
    rcNarrate(`✅ T2 escribe <strong>${rc.t2.local}</strong> y libera el mutex. Esperado: <strong>${rc.expected}</strong>, Actual: <strong>${rc.counter}</strong>. <strong>Resultado perfecto.</strong> Perdidos: 0. El mutex eliminó la race condition.`);
  },
];

/* ── Step controller ─────────────────────── */
function rcStep() {
  const steps = rc.mode === 'race' ? rcRaceSteps : rcMutexSteps;
  steps[rc.step]();
  rc.step = (rc.step + 1) % steps.length;
}

/* ── Play / Pause ────────────────────────── */
function rcTogglePlay() {
  const btn = document.getElementById('rcPlayBtn');
  if (rc.running) {
    clearInterval(rc.timer);
    rc.running = false;
    if (btn) btn.innerHTML = '<i class="ph-bold ph-play"></i> Auto';
  } else {
    rc.running = true;
    if (btn) btn.innerHTML = '<i class="ph-bold ph-pause"></i> Pausar';
    rc.timer = setInterval(rcStep, rc.speedMs);
  }
}

/* ── Speed ───────────────────────────────── */
function rcSpeed(ms) {
  rc.speedMs = ms;
  document.querySelectorAll('.m5rcSpeedBtn').forEach(b => b.classList.remove('active'));
  const labels = { 1200: 'Lento', 700: 'Normal', 280: 'Rápido' };
  document.querySelectorAll('.m5rcSpeedBtn').forEach(b => {
    if (b.textContent === labels[ms]) b.classList.add('active');
  });
  if (rc.running) {
    clearInterval(rc.timer);
    rc.timer = setInterval(rcStep, rc.speedMs);
  }
}

/* ── Mode switch ─────────────────────────── */
function rcSetMode(mode) {
  if (rc.running) { clearInterval(rc.timer); rc.running = false; }
  rc.mode = mode;
  document.querySelectorAll('.m5rcModeBtn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector('.m5rcModeBtn.' + mode);
  if (activeBtn) activeBtn.classList.add('active');
  const playBtn = document.getElementById('rcPlayBtn');
  if (playBtn) playBtn.innerHTML = '<i class="ph-bold ph-play"></i> Auto';
  rcReset();
}

/* ── Reset ───────────────────────────────── */
function rcReset() {
  clearInterval(rc.timer);
  rc.running = false;
  rc.step = 0; rc.counter = 0; rc.expected = 0; rc.lost = 0; rc.rounds = 0;
  rc.locked = null;
  rc.t1 = { local: null, state: 'idle' };
  rc.t2 = { local: null, state: 'idle' };

  rcSetThread('T1', 'idle', null);
  rcSetThread('T2', 'idle', null);
  rcDrawCounter(false);
  rcDrawLock(null);
  rcDrawStats();

  const playBtn = document.getElementById('rcPlayBtn');
  if (playBtn) playBtn.innerHTML = '<i class="ph-bold ph-play"></i> Auto';

  const msg = rc.mode === 'race'
    ? 'Presioná <strong>Paso</strong> o <strong>Auto</strong>. Dos hilos van a hacer <code>contador++</code> al mismo tiempo. Observá cómo un incremento desaparece en cada ronda.'
    : 'Presioná <strong>Paso</strong> o <strong>Auto</strong>. El mutex garantiza acceso exclusivo. T2 espera mientras T1 trabaja — ningún incremento se pierde.';
  rcNarrate(msg);
}

/* ─── Prism on load ──────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { if (window.Prism) Prism.highlightAll(); });
} else {
  if (window.Prism) Prism.highlightAll();
}
