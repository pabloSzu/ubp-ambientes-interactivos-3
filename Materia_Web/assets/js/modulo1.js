/* ═══════════════════════════════════════════
   PAI3 · Módulo 1 · Interactivos
═══════════════════════════════════════════ */

// Cursor glow
const glow = document.getElementById('mglow');
document.addEventListener('mousemove', e => {
  glow.style.transform = `translate(${e.clientX - 210}px, ${e.clientY - 210}px)`;
});

/* ─── Datos ──────────────────────────────── */
const levels = [
  {
    title: "Reactividad",
    desc: "El usuario controla reproducción básica, pero no transforma el contenido.",
    power: 20,
    story: {
      user:     { icon: "▶", text: "Pausa o avanza un video." },
      system:   { icon: "⏱", text: "Actualiza el estado de reproducción." },
      feedback: { icon: "✓", text: "La barra de progreso cambia." },
    },
    examples: [
      ["YouTube",     "Pausar, avanzar, retroceder."],
      ["TV digital",  "Abrir información adicional."],
      ["Reproductor", "Cambiar audio o subtítulos."],
    ],
  },
  {
    title: "Selección",
    desc: "El usuario elige entre opciones previstas por el sistema.",
    power: 40,
    story: {
      user:     { icon: "☰", text: "Elige un perfil, menú o contenido." },
      system:   { icon: "↳", text: "Carga el camino seleccionado." },
      feedback: { icon: "★", text: "Muestra una nueva pantalla o categoría." },
    },
    examples: [
      ["Netflix",  "Elegir una película o perfil."],
      ["Flow",     "Pasar de grilla a VOD."],
      ["Ginga",    "Elegir un servicio interactivo."],
    ],
  },
  {
    title: "Personalización",
    desc: "El sistema adapta la experiencia según perfil, historial o contexto.",
    power: 60,
    story: {
      user:     { icon: "👤", text: "El usuario mira, busca o califica." },
      system:   { icon: "⚙",  text: "El sistema aprende patrones." },
      feedback: { icon: "✨", text: "La portada y recomendaciones cambian." },
    },
    examples: [
      ["Streaming",  "Recomendaciones distintas por usuario."],
      ["Home",       "Seguir viendo y listas personales."],
      ["IA",         "Ordena contenido por tiempo disponible."],
    ],
  },
  {
    title: "Cocreación",
    desc: "El usuario crea, comenta, publica o modifica contenido.",
    power: 80,
    story: {
      user:     { icon: "✎", text: "Crea, comenta o sube contenido." },
      system:   { icon: "☁", text: "La plataforma procesa y publica." },
      feedback: { icon: "💬", text: "Otros usuarios pueden verlo o responder." },
    },
    examples: [
      ["Twitch",   "Chat, clips, encuestas."],
      ["YouTube",  "Crear y publicar contenido."],
      ["Aula",     "Subir prototipos y comentar trabajos."],
    ],
  },
  {
    title: "Colectiva",
    desc: "La acción de una persona afecta la experiencia compartida de otras.",
    power: 100,
    story: {
      user:     { icon: "☷",  text: "Muchos usuarios actúan a la vez." },
      system:   { icon: "⚡", text: "El sistema coordina estado compartido." },
      feedback: { icon: "🌐", text: "La experiencia cambia para todos." },
    },
    examples: [
      ["Juego online", "Un jugador altera el mundo compartido."],
      ["En vivo",      "Votos que cambian una transmisión."],
      ["Agentes IA",   "Muchos agentes coordinan o compiten."],
    ],
  },
];

const pipeData = {
  isdb:     ["ISDB-Tb",   "Estándar de TV digital terrestre adoptado por Argentina. Permite mejor calidad de imagen, audio y soporte para datos adicionales."],
  datos:    ["Datos",     "La interactividad necesita datos: menús, guías, alertas, clima, educación, servicios y contenido ampliado que viajan junto a la señal."],
  ginga:    ["Ginga",     "Middleware que permite ejecutar aplicaciones interactivas en receptores compatibles con TV digital. Es la capa donde vive la app."],
  ncl:      ["NCL/Lua",   "NCL organiza la estructura multimedia del contenido; Lua agrega lógica y comportamiento a las aplicaciones interactivas."],
  devendra: ["DEVENDRA",  "Caso argentino para pensar servicios interactivos sobre TV digital: educación, información pública, alertas y contenido ampliado con participación del usuario."],
  usuario:  ["Usuario",   "La persona navega, elige y recibe feedback mediante control remoto u otro dispositivo. Su acción cierra el ciclo de interactividad."],
};

/* ─── Level selector ─────────────────────── */
const levelTabs  = [...document.querySelectorAll('.levelTab')];
const levelEye   = document.getElementById('levelEye');
const levelTitle = document.getElementById('levelTitle');
const levelDesc  = document.getElementById('levelDesc');
const powerFill  = document.getElementById('powerFill');
const powerPct   = document.getElementById('powerPct');
const storyUser  = document.getElementById('storyUser');
const storyUserText     = document.getElementById('storyUserText');
const storySystem       = document.getElementById('storySystem');
const storySystemText   = document.getElementById('storySystemText');
const storyFeedback     = document.getElementById('storyFeedback');
const storyFeedbackText = document.getElementById('storyFeedbackText');
const levelExamples     = document.getElementById('levelExamples');

function renderLevel(idx) {
  const d = levels[idx];
  levelTabs.forEach((t, i) => {
    t.classList.toggle('active', i === idx);
    t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
  });
  levelEye.textContent   = `Nivel ${idx + 1} de ${levels.length}`;
  levelTitle.textContent = d.title;
  levelDesc.textContent  = d.desc;
  powerFill.style.width  = `${d.power}%`;
  powerPct.textContent   = `${d.power}%`;

  storyUser.textContent         = d.story.user.icon;
  storyUserText.textContent     = d.story.user.text;
  storySystem.textContent       = d.story.system.icon;
  storySystemText.textContent   = d.story.system.text;
  storyFeedback.textContent     = d.story.feedback.icon;
  storyFeedbackText.textContent = d.story.feedback.text;

  levelExamples.innerHTML = d.examples.map(([title, text]) =>
    `<div class="levelExample"><strong>${title}</strong><span>${text}</span></div>`
  ).join('');
}

levelTabs.forEach(btn => {
  btn.addEventListener('click', () => renderLevel(Number(btn.dataset.level)));
});

/* ─── Pipeline ────────────────────────────── */
const pipeBtns = [...document.querySelectorAll('.pipeBtn')];
const pipeEye   = document.getElementById('pipeEye');
const pipeTitle = document.getElementById('pipeTitle');
const pipeText  = document.getElementById('pipeText');

function renderPipe(key) {
  pipeBtns.forEach(b => b.classList.toggle('active', b.dataset.pipe === key));
  const [title, text] = pipeData[key];
  pipeEye.textContent   = 'Paso seleccionado';
  pipeTitle.textContent = title;
  pipeText.textContent  = text;
}

pipeBtns.forEach(btn => {
  btn.addEventListener('click', () => renderPipe(btn.dataset.pipe));
});

/* ─── Init ───────────────────────────────── */
renderLevel(0);
renderPipe('isdb');
