/* ═══════════════════════════════════════════
   PAI3 · Módulo 2 · Interfaces y UX
═══════════════════════════════════════════ */

/* Enforce violet accent (campus.js may default to module 1 yellow without ?m= param) */
(function() {
  const r = document.documentElement;
  r.style.setProperty('--accent',        '#9b6fff');
  r.style.setProperty('--accent-sub',    'rgba(155,111,255,0.08)');
  r.style.setProperty('--accent-border', 'rgba(155,111,255,0.25)');
  r.style.setProperty('--accent-mid',    'rgba(155,111,255,0.38)');
})();

/* ─── Reading progress ───────────────────── */
const readProgress = document.getElementById('readProgress');
if (readProgress) {
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    readProgress.style.width = docH > 0 ? `${(window.scrollY / docH) * 100}%` : '0%';
  });
}

/* ─── Scroll reveal ──────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Animated counters ──────────────────── */
function animateCounter(el, target) {
  if (!el) return;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    anime({
      targets: { val: 0 }, val: target, round: 1, duration: 1800, easing: 'easeOutQuart',
      update(a) { el.textContent = Math.round(a.animations[0].currentValue); },
      complete() { el.textContent = target; }
    });
  }, { threshold: 0.5 });
  obs.observe(el);
}
animateCounter(document.getElementById('counter1'), 10);
animateCounter(document.getElementById('counter2'), 50);
animateCounter(document.getElementById('counter3'), 88);
animateCounter(document.getElementById('counterA11y'), 1300);

/* ─── Flip cards ─────────────────────────── */
document.querySelectorAll('.m1flipCard').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

/* ─── 10 Heurísticas de Nielsen ──────────── */
const heuristics = [
  {
    num: 'H1', name: 'Visibilidad del estado',
    desc: 'El sistema debe informar siempre al usuario qué está pasando, mediante feedback apropiado en un tiempo razonable. El usuario nunca debería preguntarse: ¿qué está haciendo el sistema ahora mismo?',
    bad: { label: 'Violación típica', text: 'Un spinner que gira sin texto ni porcentaje. El usuario no sabe si cargó, falló o sigue procesando. Sin contexto, la espera se vuelve ansiedad.' },
    good: { label: 'Implementación correcta', text: '"Cargando 3 de 5 archivos… 60% completado." El usuario sabe exactamente qué ocurre y cuánto falta.' },
  },
  {
    num: 'H2', name: 'Coincidencia con el mundo real',
    desc: 'El sistema debe hablar el lenguaje del usuario — palabras, frases y conceptos familiares para él, no terminología interna del sistema o jerga técnica. La información debe aparecer en un orden lógico y natural.',
    bad: { label: 'Violación típica', text: '"Error 403 Forbidden" o "ERR_CONNECTION_REFUSED" mostrado al usuario final. El sistema habla consigo mismo, no con la persona.' },
    good: { label: 'Implementación correcta', text: '"No tenés permiso para ver esta página. Contactá al administrador si creés que es un error." Lenguaje humano, acción clara.' },
  },
  {
    num: 'H3', name: 'Control y libertad del usuario',
    desc: 'Los usuarios eligen funciones del sistema por error. Necesitan una "salida de emergencia" claramente marcada para abandonar el estado no deseado sin tener que pasar por un proceso extenso. Soportar deshacer y rehacer es esencial.',
    bad: { label: 'Violación típica', text: 'Eliminar un archivo sin confirmación previa y sin posibilidad de recuperarlo. Acción destructiva, irreversible e inesperada.' },
    good: { label: 'Implementación correcta', text: 'Google Drive: archivo eliminado → "Deshacer" visible 5 segundos. Papelera como red de seguridad permanente.' },
  },
  {
    num: 'H4', name: 'Consistencia y estándares',
    desc: 'Los usuarios no deberían preguntarse si palabras, situaciones o acciones diferentes significan lo mismo. Seguir las convenciones de la plataforma. La consistencia reduce la curva de aprendizaje y genera confianza.',
    bad: { label: 'Violación típica', text: 'El botón "Confirmar" es azul en el login, verde en el checkout y rojo en el perfil. Sin sistema visual coherente, cada pantalla se siente como una app diferente.' },
    good: { label: 'Implementación correcta', text: 'Un design system define que el color de acción primaria es siempre #4a8ef0 en toda la interfaz. Una sola fuente de verdad.' },
  },
  {
    num: 'H5', name: 'Prevención de errores',
    desc: 'Mejor que un buen mensaje de error es un diseño cuidadoso que evite que el problema ocurra en primer lugar. Eliminar condiciones propensas a error o verificar antes de que el usuario confirme una acción irreversible.',
    bad: { label: 'Violación típica', text: 'Campo de fecha libre sin indicar el formato. El usuario escribe "15/3/24" cuando el sistema espera "2024-03-15". El error era previsible y evitable.' },
    good: { label: 'Implementación correcta', text: 'Un datepicker visual o un placeholder "DD/MM/AAAA" evita el error antes de que ocurra. Restricciones de input que guían, no que bloquean.' },
  },
  {
    num: 'H6', name: 'Reconocimiento antes que recuerdo',
    desc: 'Minimizar la carga de memoria del usuario haciendo visibles los objetos, acciones y opciones. El usuario no debería tener que recordar información de una parte a otra del sistema — el contexto debe ser siempre visible.',
    bad: { label: 'Violación típica', text: 'Una barra de herramientas con íconos sin etiquetas ni tooltips. El usuario debe memorizar qué hace cada ícono — carga cognitiva innecesaria.' },
    good: { label: 'Implementación correcta', text: 'Íconos con etiquetas de texto siempre visibles, o tooltips descriptivos que aparecen al pasar el cursor. El sistema recuerda por el usuario.' },
  },
  {
    num: 'H7', name: 'Flexibilidad y eficiencia',
    desc: 'Los atajos — invisibles para el usuario novato — pueden acelerar la interacción del usuario experto, de modo que el sistema sirva a ambos perfiles. Permitir a los usuarios adaptar y personalizar las acciones frecuentes.',
    bad: { label: 'Violación típica', text: 'Una app profesional sin ningún shortcut de teclado. Cada acción requiere navegar menús con el mouse. Los expertos trabajan 3 veces más lento de lo que podrían.' },
    good: { label: 'Implementación correcta', text: 'Figma, Notion, VS Code: Cmd+K para búsqueda global. Los expertos vuelan; los novatos usan los menús. El sistema funciona para todos.' },
  },
  {
    num: 'H8', name: 'Estética y diseño minimalista',
    desc: 'Los diálogos no deben contener información irrelevante o raramente necesaria. Cada unidad extra de información compite con la información relevante y disminuye su visibilidad relativa. Menos es siempre más.',
    bad: { label: 'Violación típica', text: 'Un dashboard con 20 widgets, 15 gráficos y 8 notificaciones simultáneas. Todo compite por atención, nada destaca, nada se procesa.' },
    good: { label: 'Implementación correcta', text: 'Stripe Dashboard: 4 métricas clave prominentes. El detalle está a un click, no llenando la pantalla principal.' },
  },
  {
    num: 'H9', name: 'Recuperación de errores',
    desc: 'Los mensajes de error deben expresarse en lenguaje claro (sin códigos de error), indicar con precisión el problema y sugerir constructivamente una solución. El error es una oportunidad de guiar, no de confundir.',
    bad: { label: 'Violación típica', text: '"Ha ocurrido un error." Sin información sobre qué falló, por qué falló ni qué puede hacer el usuario para continuar.' },
    good: { label: 'Implementación correcta', text: '"No encontramos una cuenta con ese email. ¿Querés crear una cuenta nueva o recuperar tu contraseña?" — tres problemas resueltos en una sola línea.' },
  },
  {
    num: 'H10', name: 'Ayuda y documentación',
    desc: 'Aunque es mejor que el sistema pueda usarse sin documentación, puede ser necesario proveer ayuda. Esta información debe ser fácil de buscar, orientada a la tarea del usuario, específica y no demasiado extensa.',
    bad: { label: 'Violación típica', text: 'Un manual PDF de 200 páginas como única documentación. Nadie lo lee; nadie puede encontrar lo que busca en el momento que lo necesita.' },
    good: { label: 'Implementación correcta', text: 'Tooltips contextuales en la app + búsqueda en ayuda + artículos breves orientados a tareas específicas. La ayuda aparece cuando y donde se necesita.' },
  },
];

const heuristicTabsEl = document.getElementById('heuristicTabs');
const heuristicPanelEl = document.getElementById('heuristicPanel');

function renderHeuristic(idx) {
  const h = heuristics[idx];
  document.querySelectorAll('.m2hTab').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
    t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
  });
  heuristicPanelEl.innerHTML = `
    <div class="m2hPanelLeft">
      <div class="m2hEye">${h.num} · Heurística de Nielsen</div>
      <div class="m2hTitle">${h.name}</div>
      <div class="m2hDesc">${h.desc}</div>
    </div>
    <div class="m2hExamples">
      <div class="m2hExample">
        <div class="m2hExampleLabel bad">✗ ${h.bad.label}</div>
        <div class="m2hExampleText">${h.bad.text}</div>
      </div>
      <div class="m2hExample">
        <div class="m2hExampleLabel good">✓ ${h.good.label}</div>
        <div class="m2hExampleText">${h.good.text}</div>
      </div>
    </div>
  `;
}

if (heuristicTabsEl) {
  heuristics.forEach((h, i) => {
    const btn = document.createElement('button');
    btn.className = 'm2hTab';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.innerHTML = `<span class="m2hTabNum">${h.num}</span><span>${h.name}</span>`;
    btn.addEventListener('click', () => renderHeuristic(i));
    heuristicTabsEl.appendChild(btn);
  });
  renderHeuristic(0);
}

/* ─── Patrones de navegación ─────────────── */
const navData = {
  menu: {
    title: 'Menú global',
    desc: 'Estructura de navegación principal, generalmente en el header. Expone las secciones más importantes del sistema de forma persistente. Es lo primero que el usuario ve y el mapa mental de la app.',
    yes: 'Apps con 4-7 secciones principales de igual importancia. Contenido al mismo nivel jerárquico. Desktop con espacio horizontal disponible. Cuando el usuario necesita cambiar de sección frecuentemente.',
    no: 'Apps con más de 7 secciones (se vuelve abrumador). Mobile donde el espacio horizontal es limitado. Contenido fuertemente jerárquico donde el breadcrumb es más apropiado.',
  },
  breadcrumb: {
    title: 'Breadcrumb',
    desc: 'Rastro de "migas de pan" que muestra la ubicación actual del usuario dentro de la jerarquía del sistema. "Inicio > Ropa > Hombre > Remeras > Producto". Siempre visible, siempre clicable.',
    yes: 'Sitios con jerarquía profunda (3+ niveles). E-commerce, documentación, sistemas de administración. Cuando el usuario puede llegar al mismo punto desde múltiples rutas.',
    no: 'Apps de una sola pantalla o flujo lineal. Cuando el usuario siempre llega por el mismo camino. En apps móviles donde el espacio horizontal es crítico.',
  },
  tabs: {
    title: 'Tabs',
    desc: 'Navegación por pestañas que muestra contenido alternativo dentro del mismo contexto. Permiten cambiar entre vistas sin perder el contexto general. El usuario siempre sabe en cuál está.',
    yes: 'Cuando hay 2-5 secciones relacionadas de igual importancia. Contenido que el usuario necesita comparar. Paneles de configuración o dashboard con vistas distintas.',
    no: 'Más de 6 tabs (mejor usar menú desplegable). Cuando las secciones son temáticamente independientes. Si el contenido de cada tab es tan extenso que el usuario pierde el contexto.',
  },
  search: {
    title: 'Búsqueda',
    desc: 'Permite al usuario encontrar contenido específico sin navegar por la estructura. Es el patrón más eficiente para usuarios que saben exactamente lo que buscan. Complementa, no reemplaza, la navegación.',
    yes: 'Sistemas con mucho contenido (100+ ítems). Cuando los usuarios llegan con una intención específica. Apps con contenido variable o generado por usuarios (YouTube, Spotify, Google).',
    no: 'Sistemas pequeños donde el browse es más natural. Cuando el catálogo es curado y fijo. Si el usuario no sabe qué buscar (exploración y descubrimiento > búsqueda).',
  },
  hamburger: {
    title: 'Menú Hamburger',
    desc: 'Ícono de tres líneas (≡) que oculta la navegación en un drawer lateral. Ganó popularidad en mobile pero genera controversia por su bajo índice de descubrimiento — los usuarios no siempre saben que existe.',
    yes: 'Apps móviles con espacio limitado. Navegación secundaria que no es de uso frecuente. Cuando la pantalla necesita máximo espacio para el contenido principal.',
    no: 'Desktop — los usuarios esperan ver la navegación visible. Cuando las secciones son de uso frecuente. Usuarios mayores o con baja alfabetización digital. La investigación muestra 20% menos engagement.',
  },
  bottomnav: {
    title: 'Bottom Navigation',
    desc: 'Barra de navegación en la parte inferior de la pantalla, al alcance del pulgar. Es el patrón dominante en apps móviles modernas. Instagram, YouTube, Twitter, WhatsApp lo usan por una razón.',
    yes: 'Apps móviles con 3-5 secciones principales de uso frecuente. Cuando el usuario necesita cambiar de sección constantemente. Diseño thumb-friendly — el alcance natural del pulgar.',
    no: 'Más de 5 secciones (se satura y confunde). Desktop o tablets en landscape. Cuando el contenido ocupa toda la pantalla (video fullscreen, juegos, mapas).',
  },
};

const navPipeline = document.getElementById('navPipeline');
const navEye = document.getElementById('navEye');
const navTitle = document.getElementById('navTitle');
const navDetail = document.getElementById('navDetail');

function renderNav(key) {
  document.querySelectorAll('[data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === key));
  const d = navData[key];
  if (navEye) navEye.textContent = 'Patrón seleccionado';
  if (navTitle) navTitle.textContent = d.title;
  if (navDetail) navDetail.innerHTML = `
    <p class="pipeText">${d.desc}</p>
    <div class="m2navWhen">
      <div class="m2navWhenBox">
        <div class="m2navWhenLabel yes">✓ Usalo cuando</div>
        <div class="m2navWhenText">${d.yes}</div>
      </div>
      <div class="m2navWhenBox">
        <div class="m2navWhenLabel no">✗ Evitalo cuando</div>
        <div class="m2navWhenText">${d.no}</div>
      </div>
    </div>
  `;
}

if (navPipeline) {
  navPipeline.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => renderNav(btn.dataset.nav));
  });
}

/* ─── Mini-game ──────────────────────────── */
const gameScenarios = [
  {
    text: "Completás un formulario de 5 pasos y al enviarlo aparece solo: 'Error'. No hay más información. No sabés si se perdieron tus datos ni qué hacer.",
    options: ['H1 — Visibilidad del estado', 'H2 — Lenguaje del mundo real', 'H4 — Consistencia', 'H8 — Minimalismo'],
    correct: 0,
    hint: 'H1 — Visibilidad del estado del sistema. El sistema no informa al usuario qué pasó ni qué debe hacer. Un mensaje de error sin contexto es la violación más clásica de esta heurística.',
  },
  {
    text: "Querés cerrar sesión pero el botón dice: 'Terminar instancia activa del entorno de usuario autenticado'.",
    options: ['H3 — Control del usuario', 'H2 — Lenguaje del mundo real', 'H6 — Reconocimiento', 'H9 — Recuperación de errores'],
    correct: 1,
    hint: 'H2 — Coincidencia con el mundo real. El sistema usa jerga técnica interna en lugar del lenguaje natural del usuario. "Cerrar sesión" es lo que el usuario entiende y espera ver.',
  },
  {
    text: "Eliminás un mensaje importante por error y no hay forma de recuperarlo. No hubo confirmación previa ni advertencia.",
    options: ['H5 — Prevención de errores', 'H3 — Control y libertad', 'H1 — Visibilidad', 'H4 — Consistencia'],
    correct: 1,
    hint: 'H3 — Control y libertad del usuario. El sistema no provee salida de emergencia (deshacer). También viola H5 al no pedir confirmación, pero el problema central es la falta de control sobre la acción.',
  },
  {
    text: "Una app de diseño profesional no tiene ningún shortcut de teclado. Todo se hace navegando menús con el mouse.",
    options: ['H8 — Minimalismo', 'H10 — Documentación', 'H7 — Flexibilidad y eficiencia', 'H6 — Reconocimiento'],
    correct: 2,
    hint: 'H7 — Flexibilidad y eficiencia de uso. La heurística pide que el sistema sirva tanto a novatos como a expertos. Sin shortcuts, los usuarios avanzados no pueden trabajar eficientemente.',
  },
  {
    text: "En una app nueva, los íconos de la barra de herramientas no tienen etiquetas ni tooltips. Hay que hacer clic en cada uno para descubrir qué hace.",
    options: ['H2 — Lenguaje real', 'H5 — Prevención', 'H6 — Reconocimiento antes que recuerdo', 'H4 — Consistencia'],
    correct: 2,
    hint: 'H6 — Reconocimiento antes que recuerdo. Forzar al usuario a explorar para descubrir funciones aumenta la carga cognitiva. Los elementos deben ser autoexplicativos — no deberías tener que adivinar.',
  },
];

let gameScore = 0;
let gameAnswered = 0;
const gameCardsEl = document.getElementById('gameCards');
const gameScoreEl = document.getElementById('gameScore');
const gameTotalEl = document.getElementById('gameTotal');
const gameBadgeEl = document.getElementById('gameBadge');
const gameResetEl = document.getElementById('gameReset');

function buildGame() {
  gameScore = 0; gameAnswered = 0;
  if (gameScoreEl) gameScoreEl.textContent = '0';
  if (gameTotalEl) gameTotalEl.textContent = gameScenarios.length;
  if (gameBadgeEl) gameBadgeEl.style.display = 'none';
  if (gameResetEl) gameResetEl.style.display = 'none';
  if (!gameCardsEl) return;
  gameCardsEl.innerHTML = gameScenarios.map((s, i) => `
    <div class="m1gameCard" id="gcard${i}">
      <div class="m1gameScenario">${i + 1}. ${s.text}</div>
      <div class="m1gameOptions">
        ${s.options.map((opt, oi) =>
          `<button class="m1gameOption" onclick="gameAnswer(${i}, ${oi})">${opt}</button>`
        ).join('')}
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
  const s = gameScenarios[cardIdx];
  card.querySelectorAll('.m1gameOption').forEach((btn, oi) => {
    btn.disabled = true;
    if (oi === s.correct) btn.classList.add('correct');
    else if (oi === chosen && chosen !== s.correct) btn.classList.add('wrong');
  });
  if (chosen === s.correct) { gameScore++; if (gameScoreEl) gameScoreEl.textContent = gameScore; }
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

/* ─── Quiz — 8 preguntas ─────────────────── */
const quizData = [
  {
    q: "¿Qué heurística de Nielsen se viola cuando un sistema muestra 'ERR_CONNECTION_REFUSED' al usuario final en lugar de un mensaje comprensible?",
    opts: ['H1 — Visibilidad del estado', 'H2 — Coincidencia con el mundo real', 'H9 — Recuperación de errores', 'H4 — Consistencia'],
    correct: 1,
    explain: "H2 — Coincidencia con el mundo real. El sistema usa lenguaje técnico interno en lugar del vocabulario del usuario. 'ERR_CONNECTION_REFUSED' no le dice al usuario qué pasó ni qué puede hacer.",
  },
  {
    q: "Un diseñador pone en el mismo flujo dos botones: 'Cancelar' (cierra el modal) y 'Salir' (cierra la sesión). ¿Qué principio fundamental ignora?",
    opts: ['H5 — Prevención de errores', 'H4 — Consistencia y estándares', 'H7 — Flexibilidad y eficiencia', 'H6 — Reconocimiento antes que recuerdo'],
    correct: 0,
    explain: "H5 — Prevención de errores. Usar dos verbos similares con consecuencias radicalmente distintas crea condiciones propensas al error. El buen diseño elimina ambigüedades antes de que el error ocurra.",
  },
  {
    q: "¿Cuál es la diferencia clave entre un affordance y un signifier?",
    opts: ['Son sinónimos; ambos describen la apariencia visual de un botón', 'El affordance es la posibilidad real de acción; el signifier es la señal visible que la comunica', 'El signifier existe aunque no se vea; el affordance es siempre visible', 'El affordance es solo para objetos físicos; el signifier es solo para digital'],
    correct: 1,
    explain: "El affordance es la propiedad real que permite una acción (un botón SE PUEDE presionar). El signifier es la señal perceptible que comunica esa posibilidad (el botón PARECE presionable por su sombra y borde).",
  },
  {
    q: "Un formulario solo valida los campos cuando el usuario hace clic en 'Enviar', no mientras escribe. ¿Qué heurística no se aprovecha?",
    opts: ['H3 — Control y libertad', 'H8 — Diseño minimalista', 'H5 — Prevención de errores', 'H10 — Ayuda y documentación'],
    correct: 2,
    explain: "H5 — Prevención de errores. La validación en tiempo real (inline validation) permite al usuario corregir mientras escribe, antes de intentar enviar. Esperar al submit es un diseño reactivo, no preventivo.",
  },
  {
    q: "¿Qué describe mejor la Ley de Hick aplicada al diseño de interfaces?",
    opts: ['Los botones más grandes son más fáciles de presionar', 'La memoria de trabajo humana puede retener 7 ± 2 ítems', 'A más opciones disponibles, más tiempo tarda el usuario en decidir', 'El ojo humano sigue el patrón F al leer pantallas'],
    correct: 2,
    explain: "La Ley de Hick establece que el tiempo de decisión aumenta logarítmicamente con el número de opciones. Por eso los menús efectivos tienen máximo 7 ítems y los botones de acción principal son únicos y claros.",
  },
  {
    q: "¿Cuál es el nivel mínimo de WCAG requerido por la mayoría de regulaciones legales de accesibilidad web (como ADA en USA)?",
    opts: ['Nivel A', 'Nivel AA', 'Nivel AAA', 'Ningún nivel es legalmente requerido'],
    correct: 1,
    explain: "Nivel AA es el estándar exigido por la mayoría de leyes de accesibilidad digitales. Incluye requisitos como contraste mínimo 4.5:1, texto redimensionable al 200% y foco visible en navegación por teclado.",
  },
  {
    q: "¿Por qué un menú hamburguesa puede ser problemático en una interfaz de desktop?",
    opts: ['Porque consume demasiado ancho de pantalla', 'Porque los usuarios de desktop esperan ver la navegación visible sin tener que descubrirla', 'Porque no es compatible con navegadores modernos', 'Porque solo funciona bien con touchscreen táctil'],
    correct: 1,
    explain: "H6 — Reconocimiento antes que recuerdo. En desktop los usuarios esperan ver la navegación (reconocer), no tener que recordar que existe y hacer clic para revelarla. El hamburger oculta navegación donde hay espacio de sobra.",
  },
  {
    q: "En un flujo de usuario, ¿qué diferencia un 'happy path' de un 'edge case'?",
    opts: ['El happy path es el flujo de error; el edge case es el flujo ideal', 'El happy path es el flujo ideal cuando todo funciona; los edge cases son situaciones límite o de error', 'El happy path aplica a usuarios expertos; los edge cases a novatos', 'Son sinónimos que describen el mismo flujo de usuario'],
    correct: 1,
    explain: "El happy path es el recorrido ideal cuando todo funciona perfectamente. Los edge cases son situaciones límite: datos inesperados, errores de red, sesiones expiradas. Una interfaz robusta maneja ambos escenarios con igual cuidado.",
  },
];

let quizIdx = 0;
let quizScoreVal = 0;
const quizContent = document.getElementById('quizContent');
const quizProgressBar = document.getElementById('quizProgress');
const quizMetaEl = document.getElementById('quizMeta');
const optLabels = ['A', 'B', 'C', 'D'];

function renderQuiz() {
  if (!quizContent) return;
  if (quizIdx >= quizData.length) { showQuizResult(); return; }
  if (quizProgressBar) quizProgressBar.style.width = `${(quizIdx / quizData.length) * 100}%`;
  if (quizMetaEl) quizMetaEl.textContent = `Pregunta ${quizIdx + 1} de ${quizData.length}`;
  const q = quizData[quizIdx];
  quizContent.innerHTML = `
    <div class="m1quizQ">${q.q}</div>
    <div class="m1quizOptions">
      ${q.opts.map((opt, i) =>
        `<button class="m1quizOption" data-opt="${optLabels[i]}" onclick="quizAnswer(${i})">${opt}</button>`
      ).join('')}
    </div>
  `;
}

window.quizAnswer = function(chosen) {
  const q = quizData[quizIdx];
  quizContent.querySelectorAll('.m1quizOption').forEach((btn, i) => {
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
  const msg = pct === 100 ? '¡Dominio total! Estás listo para la auditoría de interfaz.'
    : pct >= 75 ? 'Muy buen trabajo. Repasá las preguntas donde fallaste antes de la actividad práctica.'
    : pct >= 50 ? 'Buen comienzo. Volvé a repasar las heurísticas de Nielsen y las leyes de UX.'
    : 'Revisá el contenido del módulo — especialmente las heurísticas — antes de arrancar la actividad.';
  quizContent.innerHTML = `
    <div class="m1quizResult">
      <div class="m1quizResultScore">${pct}%</div>
      <div class="m1quizResultLabel">${quizScoreVal} de ${quizData.length} correctas</div>
      <div class="m1quizResultMsg">${msg}</div>
      <button class="m1quizRetry" onclick="quizReset()">Intentar de nuevo</button>
    </div>
  `;
}

window.quizReset = function() { quizIdx = 0; quizScoreVal = 0; renderQuiz(); };

/* ─── Init ───────────────────────────────── */
buildGame();
renderQuiz();
renderNav('menu');
