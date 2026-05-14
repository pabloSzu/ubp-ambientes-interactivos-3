/* ═══════════════════════════════════════════
   PAI3 · Módulo 1 · Interactivos
═══════════════════════════════════════════ */

/* ─── Cursor glow ────────────────────────── */
const glow = document.getElementById('mglow');
if (glow) {
  document.addEventListener('mousemove', e => {
    glow.style.transform = `translate(${e.clientX - 210}px, ${e.clientY - 210}px)`;
  });
}

/* ─── Reading progress ───────────────────── */
const readProgress = document.getElementById('readProgress');
if (readProgress) {
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    readProgress.style.width = `${pct}%`;
  });
}

/* ─── Scroll reveal ──────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Animated counters ──────────────────── */
function animateCounter(el, target, suffix = '') {
  if (!el) return;
  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    anime({
      targets: { val: 0 },
      val: target,
      round: 1,
      duration: 2000,
      easing: 'easeOutQuart',
      update(anim) { el.textContent = Math.round(anim.animations[0].currentValue).toLocaleString('es-AR'); },
      complete() { el.textContent = target.toLocaleString('es-AR') + suffix; }
    });
  }, { threshold: 0.5 });
  observer.observe(el);
}

animateCounter(document.getElementById('counter1'), 26);
animateCounter(document.getElementById('counter2'), 95);
animateCounter(document.getElementById('counter3'), 5);

/* ─── Level selector data ────────────────── */
const levels = [
  {
    title: "Reactividad",
    desc: "El usuario controla reproducción básica, pero no transforma el contenido. El sistema solo obedece comandos predefinidos.",
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
    desc: "El usuario elige entre opciones previstas por el sistema. Hay ramificación, pero el árbol de decisiones es diseñado previamente.",
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
    desc: "El sistema adapta la experiencia según perfil, historial o contexto. Ya no es un árbol fijo: el sistema aprende y predice.",
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
    desc: "El usuario crea, comenta, publica o modifica contenido. Ya no es solo consumidor — es también productor.",
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
    desc: "La acción de una persona afecta la experiencia compartida de otras. El sistema coordina estado global en tiempo real.",
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

const levelTabs        = [...document.querySelectorAll('.levelTab')];
const levelEye         = document.getElementById('levelEye');
const levelTitle       = document.getElementById('levelTitle');
const levelDesc        = document.getElementById('levelDesc');
const powerFill        = document.getElementById('powerFill');
const powerPct         = document.getElementById('powerPct');
const storyUser        = document.getElementById('storyUser');
const storyUserText    = document.getElementById('storyUserText');
const storySystem      = document.getElementById('storySystem');
const storySystemText  = document.getElementById('storySystemText');
const storyFeedback    = document.getElementById('storyFeedback');
const storyFeedbackText = document.getElementById('storyFeedbackText');
const levelExamples    = document.getElementById('levelExamples');

function renderLevel(idx) {
  const d = levels[idx];
  levelTabs.forEach((t, i) => {
    t.classList.toggle('active', i === idx);
    t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
  });
  if (levelEye)   levelEye.textContent   = `Nivel ${idx + 1} de ${levels.length}`;
  if (levelTitle) levelTitle.textContent = d.title;
  if (levelDesc)  levelDesc.textContent  = d.desc;
  if (powerFill)  powerFill.style.width  = `${d.power}%`;
  if (powerPct)   powerPct.textContent   = `${d.power}%`;
  if (storyUser)        storyUser.textContent         = d.story.user.icon;
  if (storyUserText)    storyUserText.textContent     = d.story.user.text;
  if (storySystem)      storySystem.textContent       = d.story.system.icon;
  if (storySystemText)  storySystemText.textContent   = d.story.system.text;
  if (storyFeedback)    storyFeedback.textContent     = d.story.feedback.icon;
  if (storyFeedbackText) storyFeedbackText.textContent = d.story.feedback.text;
  if (levelExamples) {
    levelExamples.innerHTML = d.examples.map(([title, text]) =>
      `<div class="levelExample"><strong>${title}</strong><span>${text}</span></div>`
    ).join('');
  }
}

levelTabs.forEach(btn => {
  btn.addEventListener('click', () => renderLevel(Number(btn.dataset.level)));
});

/* ─── Pipeline data ──────────────────────── */
const pipeData = {
  isdb:     ["ISDB-Tb",   "Estándar de TV digital terrestre adoptado por Argentina. Permite mejor calidad de imagen, audio y soporte para datos adicionales en un canal paralelo a la señal de video."],
  datos:    ["Datos",     "La interactividad necesita datos: menús, guías, alertas, clima, educación, servicios y contenido ampliado que viajan junto a la señal de TV sin consumir ancho de banda de internet."],
  ginga:    ["Ginga",     "Middleware open source que permite ejecutar aplicaciones interactivas en receptores compatibles con TV digital. Es la capa donde vive la lógica de la app, entre el hardware y el contenido."],
  ncl:      ["NCL/Lua",   "NCL (Nested Context Language) organiza la estructura multimedia del contenido; Lua agrega lógica, variables y comportamiento a las aplicaciones interactivas. Son el HTML y JS del mundo Ginga."],
  devendra: ["DEVENDRA",  "Caso argentino para pensar servicios interactivos sobre TV digital: educación pública, información de emergencia, alertas y contenido ampliado con participación del usuario sin requerir internet."],
  usuario:  ["Usuario",   "La persona navega, elige y recibe feedback mediante control remoto u otro dispositivo. Su acción cierra el ciclo de interactividad y da sentido a todo el pipeline técnico anterior."],
};

const pipeBtns  = [...document.querySelectorAll('.pipeBtn')];
const pipeEye   = document.getElementById('pipeEye');
const pipeTitle = document.getElementById('pipeTitle');
const pipeText  = document.getElementById('pipeText');

function renderPipe(key) {
  pipeBtns.forEach(b => b.classList.toggle('active', b.dataset.pipe === key));
  const [title, text] = pipeData[key];
  if (pipeEye)   pipeEye.textContent   = 'Paso seleccionado';
  if (pipeTitle) pipeTitle.textContent = title;
  if (pipeText)  pipeText.textContent  = text;
}

pipeBtns.forEach(btn => {
  btn.addEventListener('click', () => renderPipe(btn.dataset.pipe));
});

/* ─── Mini-game ──────────────────────────── */
const gameScenarios = [
  { text: "Pausás un video en Netflix mientras comés.", correct: 1, hint: "Nivel 1 — Reactividad. El sistema responde a un comando básico sin transformar contenido." },
  { text: "Elegís 'Acción' en el menú de géneros de una plataforma.", correct: 2, hint: "Nivel 2 — Selección. Estás eligiendo entre opciones predefinidas por el sistema." },
  { text: "Netflix cambia la portada y el orden del catálogo según lo que miraste esta semana.", correct: 3, hint: "Nivel 3 — Personalización. El sistema adapta la experiencia usando tu historial." },
  { text: "Subís un tutorial a YouTube y otros usuarios lo comentan y comparten.", correct: 4, hint: "Nivel 4 — Cocreación. Sos productor de contenido que otros consumen e interactúan." },
  { text: "En un live de Twitch, los espectadores votan y eso cambia lo que hace el streamer en tiempo real.", correct: 5, hint: "Nivel 5 — Colectiva. La acción de muchos usuarios simultáneos afecta la experiencia de todos." },
];

let gameScore = 0;
let gameAnswered = 0;
const gameCardsEl = document.getElementById('gameCards');
const gameScoreEl = document.getElementById('gameScore');
const gameTotalEl = document.getElementById('gameTotal');
const gameBadgeEl = document.getElementById('gameBadge');
const gameResetEl = document.getElementById('gameReset');

function buildGame() {
  gameScore = 0;
  gameAnswered = 0;
  if (gameScoreEl) gameScoreEl.textContent = '0';
  if (gameTotalEl) gameTotalEl.textContent = gameScenarios.length;
  if (gameBadgeEl) gameBadgeEl.style.display = 'none';
  if (gameResetEl) gameResetEl.style.display = 'none';
  if (!gameCardsEl) return;

  gameCardsEl.innerHTML = gameScenarios.map((s, i) => `
    <div class="m1gameCard" id="gcard${i}">
      <div class="m1gameScenario">${i + 1}. ${s.text}</div>
      <div class="m1gameOptions">
        ${[1,2,3,4,5].map(lvl => `
          <button class="m1gameOption" data-card="${i}" data-level="${lvl}" onclick="gameAnswer(${i}, ${lvl})">
            N${lvl}
          </button>
        `).join('')}
      </div>
      <div class="m1gameHint" id="ghint${i}">${s.hint}</div>
    </div>
  `).join('');
}

window.gameAnswer = function(cardIdx, chosen) {
  const card = document.getElementById(`gcard${cardIdx}`);
  if (!card || card.classList.contains('answered')) return;
  card.classList.add('answered');
  gameAnswered++;

  const scenario = gameScenarios[cardIdx];
  const btns = card.querySelectorAll('.m1gameOption');
  btns.forEach(btn => {
    btn.disabled = true;
    const lvl = Number(btn.dataset.level);
    if (lvl === scenario.correct) btn.classList.add('correct');
    else if (lvl === chosen && chosen !== scenario.correct) btn.classList.add('wrong');
  });

  if (chosen === scenario.correct) {
    gameScore++;
    if (gameScoreEl) gameScoreEl.textContent = gameScore;
  }

  const hint = document.getElementById(`ghint${cardIdx}`);
  if (hint) hint.classList.add('show');

  if (gameAnswered === gameScenarios.length) {
    if (gameBadgeEl) {
      gameBadgeEl.style.display = 'inline';
      gameBadgeEl.textContent = gameScore === 5 ? '¡Perfecto!' : `${gameScore}/5`;
    }
    if (gameResetEl) gameResetEl.style.display = 'flex';
  }
};

if (gameResetEl) gameResetEl.addEventListener('click', buildGame);

/* ─── Quiz ───────────────────────────────── */
const quizData = [
  {
    q: "¿Cuál de estas opciones describe mejor la diferencia entre Reactividad y Selección?",
    opts: [
      "No hay diferencia, son sinónimos.",
      "Reactividad responde a comandos básicos sin ramificación; Selección ofrece caminos alternativos predefinidos.",
      "Selección usa IA; Reactividad no.",
      "Reactividad solo existe en TV; Selección solo en apps móviles.",
    ],
    correct: 1,
    explain: "Reactividad (N1) responde a acciones básicas como pausar o avanzar. Selección (N2) implica elegir entre caminos distintos previamente diseñados, como elegir un género o perfil.",
  },
  {
    q: "En el ciclo básico de interactividad, ¿qué ocurre en la etapa de 'Proceso'?",
    opts: [
      "El usuario hace una acción observable.",
      "El sistema muestra un resultado visual.",
      "El sistema interpreta la acción y aplica lógica interna para preparar una respuesta.",
      "La base de datos guarda el estado del usuario.",
    ],
    correct: 2,
    explain: "El Proceso es la etapa interna: el sistema recibe la acción, aplica reglas, toma decisiones y prepara la respuesta. Es invisible para el usuario, pero es donde vive toda la inteligencia del sistema.",
  },
  {
    q: "¿Qué rol cumple el middleware Ginga en el ecosistema de TV digital?",
    opts: [
      "Comprimir la señal de video para reducir ancho de banda.",
      "Gestionar los subtítulos automáticos del canal.",
      "Servir de capa entre el hardware del receptor y las aplicaciones interactivas.",
      "Conectar el televisor a internet mediante WiFi.",
    ],
    correct: 2,
    explain: "Ginga es el middleware del estándar ISDB-Tb. Funciona como la capa de software entre el hardware del receptor de TV y las aplicaciones escritas en NCL/Lua. Es el equivalente al navegador en el mundo web.",
  },
  {
    q: "Un sistema de juego en línea donde la acción de un jugador modifica el mapa para todos los demás corresponde a:",
    opts: [
      "Nivel 2 — Selección",
      "Nivel 3 — Personalización",
      "Nivel 4 — Cocreación",
      "Nivel 5 — Colectiva",
    ],
    correct: 3,
    explain: "Nivel 5 — Colectiva. La característica clave es que la acción de un usuario afecta la experiencia de todos los demás en tiempo real. El sistema coordina un estado global compartido.",
  },
  {
    q: "¿Por qué DEVENDRA es relevante como caso de estudio para interactividad?",
    opts: [
      "Porque fue el primer videojuego argentino exportado al exterior.",
      "Porque demuestra cómo llevar interactividad educativa a hogares sin acceso a internet usando TV digital.",
      "Porque usa inteligencia artificial para personalizar contenido.",
      "Porque fue desarrollado en NCL y publicado como app móvil.",
    ],
    correct: 1,
    explain: "DEVENDRA es relevante porque muestra un modelo de servicio interactivo sobre infraestructura pública (TV digital ISDB-Tb) que no requiere internet. Democratiza el acceso a educación interactiva usando el estándar Ginga.",
  },
];

let quizIdx = 0;
let quizScoreVal = 0;
const quizContent = document.getElementById('quizContent');
const quizProgressBar = document.getElementById('quizProgress');

function renderQuiz() {
  if (!quizContent) return;
  if (quizIdx >= quizData.length) {
    showQuizResult();
    return;
  }
  if (quizProgressBar) quizProgressBar.style.width = `${(quizIdx / quizData.length) * 100}%`;

  const q = quizData[quizIdx];
  quizContent.innerHTML = `
    <div class="m1quizQ">${quizIdx + 1}. ${q.q}</div>
    <div class="m1quizOptions">
      ${q.opts.map((opt, i) =>
        `<button class="m1quizOption" onclick="quizAnswer(${i})">${opt}</button>`
      ).join('')}
    </div>
  `;
}

window.quizAnswer = function(chosen) {
  const q = quizData[quizIdx];
  const opts = quizContent.querySelectorAll('.m1quizOption');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === chosen && chosen !== q.correct) btn.classList.add('wrong');
  });
  if (chosen === q.correct) quizScoreVal++;

  const explainEl = document.createElement('div');
  explainEl.className = 'm1quizExplain';
  explainEl.textContent = q.explain;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'm1quizNext';
  nextBtn.textContent = quizIdx < quizData.length - 1 ? 'Siguiente →' : 'Ver resultado';
  nextBtn.addEventListener('click', () => { quizIdx++; renderQuiz(); });

  quizContent.appendChild(explainEl);
  quizContent.appendChild(nextBtn);
};

function showQuizResult() {
  if (quizProgressBar) quizProgressBar.style.width = '100%';
  const pct = Math.round((quizScoreVal / quizData.length) * 100);
  const msg = pct === 100
    ? '¡Dominio total! Estás listo para la actividad práctica.'
    : pct >= 60
    ? 'Bien encaminado. Repasá los conceptos donde fallaste.'
    : 'Volvé a leer el contenido del módulo antes de la actividad.';

  quizContent.innerHTML = `
    <div class="m1quizResult">
      <div class="m1quizResultScore">${pct}%</div>
      <div class="m1quizResultLabel">${quizScoreVal} de ${quizData.length} correctas</div>
      <div class="m1quizResultMsg">${msg}</div>
      <button class="m1quizRetry" onclick="quizReset()">
        Intentar de nuevo
      </button>
    </div>
  `;
}

window.quizReset = function() {
  quizIdx = 0;
  quizScoreVal = 0;
  renderQuiz();
};

/* ─── Flip cards ─────────────────────────── */
document.querySelectorAll('.m1flipCard').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

/* ─── Init ───────────────────────────────── */
renderLevel(0);
renderPipe('isdb');
buildGame();
renderQuiz();
