const board = document.querySelector("#board");
const mode = document.querySelector("#mode");
const agentsInput = document.querySelector("#agents");
const speedInput = document.querySelector("#speed");
const agentsValue = document.querySelector("#agentsValue");
const speedValue = document.querySelector("#speedValue");
const startBtn = document.querySelector("#start");
const stepBtn = document.querySelector("#step");
const resetBtn = document.querySelector("#reset");
const ticksEl = document.querySelector("#ticks");
const collisionsEl = document.querySelector("#collisions");
const blockedEl = document.querySelector("#blocked");
const logEl = document.querySelector("#log");
const modeCoach = document.querySelector("#modeCoach");
const explainCurrent = document.querySelector("#explainCurrent");
const tourBtn = document.querySelector("#tourBtn");
const startTourHero = document.querySelector("#startTourHero");
const modal = document.querySelector("#modal");
const modalClose = document.querySelector("#modalClose");
const modalStep = document.querySelector("#modalStep");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const modalExample = document.querySelector("#modalExample");
const modalPrev = document.querySelector("#modalPrev");
const modalNext = document.querySelector("#modalNext");

const size = 10;
const colors = ["#32d6c0", "#ffd45f", "#ff5a66", "#6aa7ff", "#a578ff", "#54d28b"];

let agents = [];
let tick = 0;
let collisions = 0;
let blocked = 0;
let timer = null;
let tourIndex = 0;

const tour = [
  {
    title: "Primero: que es un hilo",
    text: "Un hilo es como un trabajador dentro de tu programa. Si tenes varios hilos, varias tareas pueden avanzar en el mismo periodo de tiempo.",
    example: "Ejemplo: un hilo descarga datos, otro dibuja la pantalla y otro procesa resultados. Parecen trabajar a la vez.",
  },
  {
    title: "Segundo: que comparten",
    text: "Los hilos de un mismo programa comparten memoria. Eso es comodo porque pueden leer los mismos datos, pero peligroso porque pueden pisarse.",
    example: "En el simulador, la grilla es la memoria compartida. Todos los agentes quieren ocupar celdas de esa misma grilla.",
  },
  {
    title: "Tercero: que es una race condition",
    text: "Una race condition pasa cuando el resultado depende de quien llega primero. El problema es que ese orden no siempre se repite.",
    example: "Dos agentes ven una celda libre. Los dos deciden entrar. Cuando el sistema actualiza, hay choque.",
  },
  {
    title: "Cuarto: para que sirve un lock",
    text: "Un lock hace que una parte delicada del programa se ejecute de a uno. Evita choques, pero puede hacer que otros esperen.",
    example: "Modo con lock: si una celda ya esta ocupada, el agente no entra. No choca, pero suma un bloqueo.",
  },
  {
    title: "Como usar el simulador",
    text: "Probalo en modo sin lock y mira colisiones. Despues cambia a con lock y compara. Esa diferencia es la clase.",
    example: "La conclusion esperada: sincronizar mejora consistencia, pero introduce espera y overhead.",
  },
];

function rand(max) {
  return Math.floor(Math.random() * max);
}

function log(message) {
  const p = document.createElement("p");
  p.textContent = message;
  logEl.prepend(p);
  while (logEl.children.length > 60) {
    logEl.lastElementChild.remove();
  }
}

function initAgents() {
  const count = Number(agentsInput.value);
  const used = new Set();
  agents = Array.from({ length: count }, (_, i) => {
    let pos;
    do {
      pos = rand(size * size);
    } while (used.has(pos));
    used.add(pos);
    return {
      id: i + 1,
      pos,
      color: colors[i % colors.length],
    };
  });
}

function render() {
  board.innerHTML = "";
  const occupancy = new Map();
  for (const agent of agents) {
    const list = occupancy.get(agent.pos) || [];
    list.push(agent);
    occupancy.set(agent.pos, list);
  }

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    const list = occupancy.get(i) || [];
    if (list.length > 1) {
      cell.classList.add("collision");
    }
    for (const agent of list.slice(0, 3)) {
      const el = document.createElement("div");
      el.className = "agent";
      el.style.background = agent.color;
      el.textContent = `A${agent.id}`;
      if (list.length > 1) {
        el.style.transform = `translate(${(agent.id % 3) * 9 - 9}px, ${(agent.id % 2) * 9 - 4}px)`;
      }
      cell.appendChild(el);
    }
    board.appendChild(cell);
  }

  ticksEl.textContent = tick;
  collisionsEl.textContent = collisions;
  blockedEl.textContent = blocked;
  agentsValue.textContent = agentsInput.value;
  speedValue.textContent = speedInput.value;
}

function updateCoach() {
  if (mode.value === "unsafe") {
    modeCoach.textContent =
      "En modo sin lock, cada agente decide a la vez. Si dos eligen la misma celda, aparece una colision. Esto representa una race condition.";
  } else {
    modeCoach.textContent =
      "En modo con lock, cada agente revisa el recurso con acceso protegido. Baja la colision, pero algunos movimientos se bloquean y esperan.";
  }
}

function neighbors(pos) {
  const x = pos % size;
  const y = Math.floor(pos / size);
  const candidates = [];
  if (x > 0) candidates.push(pos - 1);
  if (x < size - 1) candidates.push(pos + 1);
  if (y > 0) candidates.push(pos - size);
  if (y < size - 1) candidates.push(pos + size);
  candidates.push(pos);
  return candidates;
}

function stepUnsafe() {
  const intents = agents.map((agent) => {
    const ns = neighbors(agent.pos);
    return { agent, target: ns[rand(ns.length)] };
  });

  const targets = new Map();
  for (const intent of intents) {
    targets.set(intent.target, (targets.get(intent.target) || 0) + 1);
  }

  for (const intent of intents) {
    intent.agent.pos = intent.target;
  }

  const crashes = [...targets.values()].filter((count) => count > 1).reduce((sum, count) => sum + count - 1, 0);
  if (crashes > 0) {
    collisions += crashes;
    log(`tick ${tick}: race condition, ${crashes} agente(s) intentaron ocupar una celda ya elegida.`);
  } else if (tick % 4 === 0) {
    log(`tick ${tick}: sin colisiones visibles, pero el acceso sigue sin estar protegido.`);
  }
}

function stepLocked() {
  const occupied = new Set(agents.map((agent) => agent.pos));
  const order = [...agents].sort(() => Math.random() - 0.5);
  let localBlocked = 0;

  for (const agent of order) {
    const ns = neighbors(agent.pos).sort(() => Math.random() - 0.5);
    const target = ns[0];
    occupied.delete(agent.pos);
    if (!occupied.has(target)) {
      agent.pos = target;
      occupied.add(target);
    } else {
      occupied.add(agent.pos);
      localBlocked += 1;
    }
  }

  blocked += localBlocked;
  if (localBlocked > 0) {
    log(`tick ${tick}: lock activo, ${localBlocked} movimiento(s) esperaron para evitar choque.`);
  } else if (tick % 4 === 0) {
    log(`tick ${tick}: todos avanzaron respetando acceso exclusivo.`);
  }
}

function step() {
  tick += 1;
  if (mode.value === "unsafe") {
    stepUnsafe();
  } else {
    stepLocked();
  }
  render();
}

function reset() {
  stop();
  tick = 0;
  collisions = 0;
  blocked = 0;
  logEl.innerHTML = "";
  initAgents();
  updateCoach();
  log("simulacion reiniciada. Cambia el modo y compara resultados.");
  render();
}

function start() {
  if (timer) {
    stop();
    return;
  }
  startBtn.textContent = "Pausar";
  const delay = Math.max(90, 850 - Number(speedInput.value) * 75);
  timer = setInterval(step, delay);
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  startBtn.textContent = "Iniciar";
}

startBtn.addEventListener("click", start);
stepBtn.addEventListener("click", step);
resetBtn.addEventListener("click", reset);
agentsInput.addEventListener("input", reset);
speedInput.addEventListener("input", () => {
  speedValue.textContent = speedInput.value;
  if (timer) {
    stop();
    start();
  }
});
mode.addEventListener("change", reset);

function openModal(index = 0) {
  tourIndex = Math.max(0, Math.min(index, tour.length - 1));
  const item = tour[tourIndex];
  modalStep.textContent = `Paso ${tourIndex + 1} de ${tour.length}`;
  modalTitle.textContent = item.title;
  modalText.textContent = item.text;
  modalExample.textContent = item.example;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  modalPrev.disabled = tourIndex === 0;
  modalNext.textContent = tourIndex === tour.length - 1 ? "Cerrar" : "Siguiente";
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function explainState() {
  const unsafe = mode.value === "unsafe";
  modalStep.textContent = "Lectura del simulador";
  modalTitle.textContent = unsafe ? "Que significan las colisiones" : "Que significan los bloqueos";
  modalText.textContent = unsafe
    ? "Las colisiones muestran que dos o mas hilos tomaron decisiones sobre el mismo recurso sin coordinarse. En Java esto puede pasar con variables, listas o estados compartidos."
    : "Los bloqueos muestran que la coordinacion funciona: el agente detecta que no puede avanzar sin romper la regla. El precio de la seguridad es esperar.";
  modalExample.textContent = unsafe
    ? `Ahora tenes ${collisions} colisiones. No es mala suerte: es falta de sincronizacion.`
    : `Ahora tenes ${blocked} bloqueos. Eso suele ser mejor que corromper datos, pero puede afectar rendimiento.`;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  modalPrev.disabled = true;
  modalNext.textContent = "Entendido";
}

tourBtn.addEventListener("click", () => openModal(0));
startTourHero.addEventListener("click", () => openModal(0));
explainCurrent.addEventListener("click", explainState);
modalClose.addEventListener("click", closeModal);
modalPrev.addEventListener("click", () => openModal(tourIndex - 1));
modalNext.addEventListener("click", () => {
  if (tourIndex === tour.length - 1 || modalStep.textContent === "Lectura del simulador") {
    closeModal();
  } else {
    openModal(tourIndex + 1);
  }
});
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

reset();
