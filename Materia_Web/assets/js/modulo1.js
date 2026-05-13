const missionTip = document.querySelector("#missionTip");
const missionNodes = document.querySelectorAll(".missionNode");
const levelButtons = [...document.querySelectorAll(".levelButton")];
const levelNumber = document.querySelector("#levelNumber");
const levelTitle = document.querySelector("#levelTitle");
const levelDescription = document.querySelector("#levelDescription");
const powerFill = document.querySelector("#powerFill");
const userIcon = document.querySelector("#userIcon");
const systemIcon = document.querySelector("#systemIcon");
const feedbackIcon = document.querySelector("#feedbackIcon");
const userAction = document.querySelector("#userAction");
const systemProcess = document.querySelector("#systemProcess");
const feedbackText = document.querySelector("#feedbackText");
const examples = document.querySelector("#examples");
const explainLevel = document.querySelector("#explainLevel");

const pipes = [...document.querySelectorAll(".pipe")];
const pipeKicker = document.querySelector("#pipeKicker");
const pipeTitle = document.querySelector("#pipeTitle");
const pipeText = document.querySelector("#pipeText");

const platformTabs = [...document.querySelectorAll(".platformTab")];
const screenContent = document.querySelector("#screenContent");
const analysisTitle = document.querySelector("#analysisTitle");
const analysisText = document.querySelector("#analysisText");
const analysisQuestion = document.querySelector("#analysisQuestion");
const analysisTags = document.querySelector("#analysisTags");
const museumItems = [...document.querySelectorAll(".museumItem")];
const museumTitle = document.querySelector("#museumTitle");
const museumText = document.querySelector("#museumText");
const buildOptions = [...document.querySelectorAll(".buildOption")];
const builderTitle = document.querySelector("#builderTitle");
const builderText = document.querySelector("#builderText");

const modal = document.querySelector("#modal");
const modalCard = document.querySelector(".modalCard");
const openGuide = document.querySelector("#openGuide");
const startGuide = document.querySelector("#startGuide");
const closeModal = document.querySelector("#closeModal");
const modalStep = document.querySelector("#modalStep");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const modalExample = document.querySelector("#modalExample");
const prevModal = document.querySelector("#prevModal");
const nextModal = document.querySelector("#nextModal");

let activeLevel = 0;
let activePlatform = "streaming";
let guideIndex = 0;
let modalKind = "guide";

const levels = [
  {
    title: "Reactividad",
    desc: "El usuario controla reproducción básica, pero no transforma el contenido.",
    power: 20,
    icons: ["▶", "⏱", "✓"],
    story: ["Pausa o avanza un video.", "Actualiza el estado de reproducción.", "La barra de progreso cambia."],
    examples: [["YouTube", "Pausar, avanzar, retroceder."], ["TV digital", "Abrir información adicional."], ["Reproductor", "Cambiar audio o subtítulos."]],
  },
  {
    title: "Selección",
    desc: "El usuario elige entre opciones previstas por el sistema.",
    power: 40,
    icons: ["☰", "↳", "★"],
    story: ["Elige un perfil, menú o contenido.", "Carga el camino seleccionado.", "Muestra una nueva pantalla o categoría."],
    examples: [["Netflix", "Elegir una película o perfil."], ["Flow", "Pasar de grilla a VOD."], ["Ginga", "Elegir un servicio interactivo."]],
  },
  {
    title: "Personalización",
    desc: "El sistema adapta la experiencia según perfil, historial o contexto.",
    power: 60,
    icons: ["👤", "⚙", "✨"],
    story: ["El usuario mira, busca o califica.", "El sistema aprende patrones.", "La portada y recomendaciones cambian."],
    examples: [["Streaming", "Recomendaciones distintas por usuario."], ["Home", "Seguir viendo y listas personales."], ["IA", "Ordena contenido por tiempo disponible."]],
  },
  {
    title: "Cocreación",
    desc: "El usuario crea, comenta, publica o modifica contenido.",
    power: 80,
    icons: ["✎", "☁", "💬"],
    story: ["Crea, comenta o sube contenido.", "La plataforma procesa y publica.", "Otros usuarios pueden verlo o responder."],
    examples: [["Twitch", "Chat, clips, encuestas."], ["YouTube", "Crear y publicar contenido."], ["Aula", "Subir prototipos y comentar trabajos."]],
  },
  {
    title: "Colectiva",
    desc: "La acción de una persona afecta la experiencia compartida de otras.",
    power: 100,
    icons: ["☷", "⚡", "🌐"],
    story: ["Muchos usuarios actúan a la vez.", "El sistema coordina estado compartido.", "La experiencia cambia para todos."],
    examples: [["Juego online", "Un jugador altera el mundo compartido."], ["Vivo", "Votos que cambian una transmisión."], ["Agentes IA", "Muchos agentes coordinan o compiten."]],
  },
];

const pipeData = {
  isdb: ["ISDB-Tb", "Estándar de TV digital terrestre adoptado por Argentina. Permite mejor calidad y soporte para datos adicionales."],
  datos: ["Datos", "La interactividad necesita datos: menús, guías, alertas, clima, educación, servicios y contenido ampliado."],
  ginga: ["Ginga", "Middleware que permite ejecutar aplicaciones interactivas en receptores compatibles con TV digital."],
  ncl: ["NCL/Lua", "NCL organiza estructura multimedia; Lua agrega lógica y comportamiento a las aplicaciones."],
  devendra: ["DEVENDRA", "Caso argentino para pensar servicios interactivos sobre TV digital: educación, información pública, alertas y contenido ampliado con participación del usuario."],
  usuario: ["Usuario", "La persona navega, elige y recibe feedback mediante control remoto u otro dispositivo de interacción."],
};

const platforms = {
  streaming: {
    html: `
      <div class="appChrome">
        <div class="appTop">
          <span class="appBrand"><i></i>StreamLab</span>
          <span class="searchPill">Buscar: serie interactiva</span>
        </div>
        <div class="featurePanel">
          <div class="featureHero"><span>Resultado destacado</span><b>El sistema entiende intención y contexto</b></div>
          <div class="sideStack">
            <div class="miniStat"><span>Recomendación</span><b>Por perfil</b></div>
            <div class="miniStat"><span>Estado</span><b>Seguir viendo</b></div>
          </div>
        </div>
        <div class="contentShelf">
          <div class="contentCard"><span>Perfil Pablo</span></div>
          <div class="contentCard"><span>Recomendado</span></div>
          <div class="contentCard"><span>Favoritos</span></div>
          <div class="contentCard"><span>Nuevo</span></div>
        </div>
      </div>`,
    points: {
      search: ["Intención del usuario", "Cuando alguien busca, no está tocando un botón cualquiera: le está diciendo al sistema qué quiere lograr.", "¿La interfaz entiende rápido qué quiere hacer la persona?", ["Selección", "UX", "Claridad"]],
      recommend: ["Decisión del sistema", "La recomendación es una respuesta calculada: usa perfil, historial o contexto para ordenar opciones.", "¿El sistema explica o deja intuir por qué muestra eso?", ["Personalización", "Algoritmo", "IA"]],
      state: ["Feedback y memoria", "Seguir viendo, favoritos y progreso muestran que el sistema recuerda al usuario y reduce esfuerzo.", "¿Qué cambió en pantalla después de la acción?", ["Estado", "Feedback", "Usabilidad"]],
    },
  },
  hybrid: {
    html: `
      <div class="appChrome">
        <div class="appTop">
          <span class="appBrand"><i></i>TV híbrida</span>
          <span class="searchPill">Vivo + catálogo + apps</span>
        </div>
        <div class="guideGrid">
          <div class="guideCard">Vivo</div>
          <div class="guideCard">Grabado</div>
          <div class="guideCard">VOD</div>
          <div class="guideCard">Guía</div>
          <div class="guideCard">Apps</div>
          <div class="guideCard">Favoritos</div>
        </div>
        <div class="contentShelf">
          <div class="contentCard"><span>Canal</span></div>
          <div class="contentCard"><span>Replay</span></div>
          <div class="contentCard"><span>Catálogo</span></div>
          <div class="contentCard"><span>Alertas</span></div>
        </div>
      </div>`,
    points: {
      search: ["Intención del usuario", "En TV híbrida la persona puede querer vivo, grabado, catálogo o aplicación. La navegación debe separar caminos.", "¿La pantalla deja claro qué caminos existen?", ["Híbrido", "Navegación", "Selección"]],
      recommend: ["Decisión del sistema", "La plataforma decide qué destacar: canal, VOD, replay, favorito o app interactiva.", "¿La decisión ayuda o confunde?", ["Arquitectura", "VOD", "Flujo"]],
      state: ["Feedback y memoria", "Debe quedar claro qué está en vivo, qué está grabado y qué acción está disponible.", "¿El usuario sabe dónde está parado?", ["Feedback", "Claridad", "Estado"]],
    },
  },
  sports: {
    html: `
      <div class="appChrome">
        <div class="appTop">
          <span class="appBrand"><i></i>Match Pulse</span>
          <span class="searchPill">Evento en vivo</span>
        </div>
        <div class="scoreBoard">
          <span class="teamName">Local</span>
          <span class="score">2 - 1</span>
          <span class="teamName">Visita</span>
        </div>
        <div class="timeline"><i></i><i></i><i></i></div>
        <div class="contentShelf">
          <div class="contentCard"><span>Stats</span></div>
          <div class="contentCard"><span>Votación</span></div>
          <div class="contentCard"><span>Repetición</span></div>
          <div class="contentCard"><span>Chat</span></div>
        </div>
      </div>`,
    points: {
      search: ["Intención del usuario", "En vivo, el usuario quiere llegar rápido al evento, al marcador o al momento clave.", "¿Puede resolverlo sin pensar demasiado?", ["Vivo", "Urgencia", "Acceso"]],
      recommend: ["Decisión del sistema", "Datos, repeticiones y votaciones aumentan el valor de la transmisión si aparecen en el momento justo.", "¿El dato suma o tapa la experiencia principal?", ["Datos", "Contexto", "Interactividad"]],
      state: ["Feedback y memoria", "En deportes, una demora o dato ambiguo rompe la confianza. El feedback tiene que ser inmediato.", "¿La pantalla comunica tiempo real con precisión?", ["Feedback", "Precisión", "Tiempo real"]],
    },
  },
};

const guide = [
  ["Idea base", "Interactividad es acción + proceso + feedback. Si el sistema no responde de forma visible, la persona siente que no tiene control.", "Botón sin respuesta = interfaz que no escucha."],
  ["TV digital", "La TV digital puede transportar datos y aplicaciones además de audio y video.", "Eso permite pensar la pantalla como plataforma interactiva."],
  ["Ginga y DEVENDRA", "Ginga ejecuta aplicaciones interactivas. DEVENDRA sirve para imaginar cómo esas aplicaciones se vuelven servicios concretos en el contexto argentino.", "La pregunta clave es: qué puede hacer el usuario que antes no podía hacer."],
  ["Mirada profesional", "Netflix, Flow y DIRECTV Play se analizan por niveles, feedback, navegación, personalización y contexto.", "La actividad pide evidencia visual, no opinión suelta."],
];

const museumData = {
  analog: {
    title: "TV analógica",
    image: "../assets/m1/tv_analogica.png",
    text: "Modelo de recepción: la señal viaja en una dirección y el usuario no modifica la experiencia desde el sistema.",
    detail: "Sirve como punto de partida: antes de hablar de Ginga, DEVENDRA o streaming, el alumno ve qué falta. Falta acción del usuario, falta proceso personalizado y falta feedback dentro de la experiencia.",
  },
  ginga: {
    title: "Ginga App",
    image: "../assets/m1/ginga_app.png",
    text: "La TV digital suma datos y una capa de software capaz de ejecutar aplicaciones interactivas.",
    detail: "Ginga permite pensar la televisión como una plataforma: el contenido principal convive con menús, servicios, datos y pequeñas decisiones tomadas con el control remoto.",
  },
  devendra: {
    title: "DEVENDRA",
    image: "../assets/m1/devendra_case.png",
    text: "Caso argentino para imaginar servicios sobre TV digital: educación, alertas, información pública y contenido ampliado con decisiones simples del usuario.",
    detail: "La clave didáctica es que DEVENDRA no quede como sigla: funciona como caso para diseñar qué servicio aparece sobre la transmisión, qué dato necesita y qué respuesta espera del usuario.",
  },
  streaming: {
    title: "Streaming actual",
    image: "../assets/m1/streaming_lab.png",
    text: "Las plataformas actuales llevan la interactividad hacia búsqueda, recomendación, perfiles, comunidad y datos en vivo.",
    detail: "Este caso conecta el programa con experiencias que los estudiantes ya conocen. No se mira Netflix, Flow o DIRECTV Play por gusto: se analiza intención, navegación, personalización, estado y feedback.",
  },
};

const builderState = {
  goal: "educar",
  data: "contenido",
  response: "menu",
};

const builderCopy = {
  educar: "educativa",
  informar: "informativa",
  alertar: "de alerta",
  contenido: "contenido ampliado",
  clima: "datos de clima/localidad",
  estado: "estado en vivo",
  menu: "un menú navegable",
  voto: "una votación simple",
  formulario: "un formulario breve",
};

function renderLevel(index) {
  activeLevel = Number(index);
  const data = levels[activeLevel];
  levelButtons.forEach((button, i) => button.classList.toggle("active", i === activeLevel));
  levelNumber.textContent = `Nivel ${activeLevel + 1}`;
  levelTitle.textContent = data.title;
  levelDescription.textContent = data.desc;
  powerFill.style.width = `${data.power}%`;
  [userIcon.textContent, systemIcon.textContent, feedbackIcon.textContent] = data.icons;
  [userAction.textContent, systemProcess.textContent, feedbackText.textContent] = data.story;
  examples.innerHTML = data.examples.map(([title, text]) => `<div><strong>${title}</strong><p>${text}</p></div>`).join("");
}

function renderPipe(key) {
  pipes.forEach((pipe) => pipe.classList.toggle("active", pipe.dataset.pipe === key));
  const [title, text] = pipeData[key];
  pipeKicker.textContent = "Paso seleccionado";
  pipeTitle.textContent = title;
  pipeText.textContent = text;
}

function renderPlatform(key) {
  activePlatform = key;
  platformTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.platform === key));
  screenContent.innerHTML = platforms[key].html;
  renderHotspot("search");
}

function renderHotspot(key) {
  document.querySelectorAll(".hotspot").forEach((hotspot) => hotspot.classList.toggle("active", hotspot.dataset.hotspot === key));
  const [title, text, question, tags] = platforms[activePlatform].points[key];
  analysisTitle.textContent = title;
  analysisText.textContent = text;
  analysisQuestion.textContent = question;
  analysisTags.innerHTML = tags.map((tag) => `<span>${tag}</span>`).join("");
}

function renderMuseum(key) {
  museumItems.forEach((item) => item.classList.toggle("active", item.dataset.museum === key));
  const data = museumData[key];
  museumTitle.textContent = data.title;
  museumText.textContent = data.text;
}

function renderBuilder() {
  buildOptions.forEach((option) => {
    option.classList.toggle("active", builderState[option.dataset.kind] === option.dataset.value);
  });
  const goal = builderCopy[builderState.goal];
  const data = builderCopy[builderState.data];
  const response = builderCopy[builderState.response];
  builderTitle.textContent = `App ${goal} con ${data}`;
  builderText.textContent = `El usuario interactúa mediante ${response}. La aplicación toma ${data} y devuelve una experiencia ${goal} pensada para TV digital.`;
}

function showModal(kind = "guide", index = 0) {
  modalKind = kind;
  modalCard.classList.remove("museumOpen");
  prevModal.hidden = false;
  if (kind === "level") {
    const data = levels[activeLevel];
    modalStep.textContent = `Nivel ${activeLevel + 1}`;
    modalTitle.textContent = data.title;
    modalText.textContent = data.desc;
    modalExample.textContent = data.examples.map(([title, text]) => `${title}: ${text}`).join(" · ");
    prevModal.disabled = true;
    prevModal.hidden = true;
    nextModal.textContent = "Entendido";
  } else if (kind === "museum") {
    const data = museumData[index];
    modalCard.classList.add("museumOpen");
    modalStep.textContent = "Museo visual";
    modalTitle.textContent = data.title;
    modalText.textContent = data.text;
    modalExample.innerHTML = `
      <div class="museumModalGrid">
        <img class="museumModalImage" src="${data.image}" alt="${data.title}">
        <p>${data.detail}</p>
      </div>`;
    prevModal.disabled = true;
    prevModal.hidden = true;
    nextModal.textContent = "Cerrar";
  } else {
    guideIndex = Math.max(0, Math.min(index, guide.length - 1));
    const [title, text, example] = guide[guideIndex];
    modalStep.textContent = `Guía ${guideIndex + 1} de ${guide.length}`;
    modalTitle.textContent = title;
    modalText.textContent = text;
    modalExample.textContent = example;
    prevModal.disabled = guideIndex === 0;
    nextModal.textContent = guideIndex === guide.length - 1 ? "Cerrar" : "Siguiente";
  }
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function hideModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalCard.classList.remove("museumOpen");
}

missionNodes.forEach((node) => {
  node.addEventListener("click", () => {
    missionTip.textContent = node.dataset.tip;
  });
});
levelButtons.forEach((button) => button.addEventListener("click", () => renderLevel(button.dataset.level)));
pipes.forEach((pipe) => pipe.addEventListener("click", () => renderPipe(pipe.dataset.pipe)));
platformTabs.forEach((tab) => tab.addEventListener("click", () => renderPlatform(tab.dataset.platform)));
document.querySelectorAll(".hotspot").forEach((hotspot) => hotspot.addEventListener("click", () => renderHotspot(hotspot.dataset.hotspot)));
museumItems.forEach((item) => {
  item.addEventListener("click", () => {
    renderMuseum(item.dataset.museum);
    showModal("museum", item.dataset.museum);
  });
});
buildOptions.forEach((option) => {
  option.addEventListener("click", () => {
    builderState[option.dataset.kind] = option.dataset.value;
    renderBuilder();
  });
});
explainLevel.addEventListener("click", () => showModal("level"));
openGuide.addEventListener("click", () => showModal("guide"));
startGuide.addEventListener("click", () => showModal("guide"));
closeModal.addEventListener("click", hideModal);
prevModal.addEventListener("click", () => showModal("guide", guideIndex - 1));
nextModal.addEventListener("click", () => {
  if (modalKind === "level" || modalKind === "museum" || guideIndex === guide.length - 1) hideModal();
  else showModal("guide", guideIndex + 1);
});
modal.addEventListener("click", (event) => {
  if (event.target === modal) hideModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideModal();
});

renderLevel(0);
renderPipe("isdb");
renderPlatform("streaming");
renderMuseum("analog");
renderBuilder();
