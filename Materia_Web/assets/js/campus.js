/* ═══════════════════════════════════════════
   PAI3 · campus.js · Datos de los 7 módulos
═══════════════════════════════════════════ */

const MODULES = {

  1: {
    title: "La interactividad y la TV digital interactiva",
    intro: "Interactividad como acción, proceso y feedback. Diferencias entre TV analógica, digital e Internet. ISDB-Tb, middleware Ginga, NCL/Lua y el caso DEVENDRA como servicio interactivo en Argentina.",
    block: "Bloque 01",
    accent: "#ffd166",
    accentSub: "rgba(255,209,102,0.08)",
    accentBorder: "rgba(255,209,102,0.25)",
    accentMid: "rgba(255,209,102,0.35)",
    objectives: [
      "Conocer el concepto de interactividad y el lenguaje interactivo con el fin de transferirlos a las situaciones prácticas propuestas en la materia.",
      "Identificar los niveles de interactividad con el fin de clasificar y comparar experiencias digitales.",
      "Analizar el ecosistema de la TV digital argentina —ISDB-Tb, Ginga, NCL/Lua, DEVENDRA— con el fin de entender el contexto técnico de aplicaciones interactivas.",
      "Aplicar el ciclo acción-proceso-feedback con el fin de evaluar y proponer mejoras en experiencias digitales reales.",
    ],
    terms: [
      ["Interactividad", "Relación dinámica en la que el usuario actúa y el sistema responde transformando la experiencia."],
      ["Acción-Proceso-Feedback", "Ciclo básico de toda experiencia interactiva: el usuario actúa, el sistema procesa y la interfaz responde."],
      ["ISDB-Tb", "Estándar de televisión digital terrestre adoptado en Argentina; permite transmitir video, audio y datos."],
      ["Middleware", "Capa de software entre el sistema operativo del decodificador y las aplicaciones interactivas."],
      ["Ginga", "Middleware estándar de la TV digital brasileña y argentina para ejecutar aplicaciones NCL/Lua."],
      ["NCL/Lua", "Lenguajes de programación usados para crear aplicaciones interactivas sobre el middleware Ginga."],
      ["DEVENDRA", "Servicio de TV digital interactiva desarrollado en Argentina; caso de aplicación real en el aula."],
      ["Nivel de interactividad", "Escala del 1 al 5 que mide el grado de poder real del usuario sobre la experiencia."],
    ],
    contents: [
      ["Qué es la interactividad", "La interactividad como proceso: acción del usuario, procesamiento del sistema y feedback visible al instante."],
      ["TV analógica vs TV digital", "Diferencias entre modelo broadcast pasivo y ecosistema con canal de retorno, datos y aplicaciones."],
      ["Los 5 niveles de interactividad", "Escala de Reactividad → Selección → Personalización → Cocreación → Interactividad colectiva."],
      ["ISDB-Tb y Ginga", "Estándar argentino de TV digital terrestre y su middleware para ejecutar aplicaciones NCL/Lua."],
      ["Caso DEVENDRA", "Cómo se diseña una capa de servicio interactivo sobre una transmisión de TV digital."],
      ["Plataformas actuales", "Análisis de streaming, TV híbrida y deportes en vivo desde la perspectiva de la interactividad."],
    ],
    activity: [
      "Elegir una plataforma audiovisual interactiva (streaming, app de TV, servicio en vivo).",
      "Identificar 5 acciones del usuario dentro de la plataforma y describir el ciclo acción-proceso-feedback para cada una.",
      "Clasificar cada acción según el nivel de interactividad (1 al 5) y justificar con evidencia observable.",
      "Relacionar al menos una acción con la lógica de TV digital, Ginga o el caso DEVENDRA.",
      "Proponer una mejora interactiva concreta para la plataforma elegida y fundamentarla.",
    ],
  },

  2: {
    title: "Interfaces, navegabilidad y experiencia del usuario",
    intro: "Especificidad de cada plataforma, experiencia de usuario, navegabilidad e interfaces. Maquetación y prototipado con Moqups o Figma.",
    block: "Bloque 01",
    accent: "#a855f7",
    accentSub: "rgba(168,85,247,0.10)",
    accentBorder: "rgba(168,85,247,0.30)",
    accentMid: "rgba(168,85,247,0.45)",
    objectives: [
      "Reconocer los conceptos de interfaz, usuario, navegabilidad y experiencia con el fin de analizar plataformas interactivas.",
      "Comparar interfaces móviles y de escritorio con el fin de identificar restricciones y oportunidades de diseño.",
      "Aplicar criterios básicos de UX/UI con el fin de justificar mejoras en una pantalla existente.",
      "Construir un mockup navegable con el fin de comunicar una propuesta de interacción.",
    ],
    terms: [
      ["Interfaz", "Superficie de contacto entre usuario y sistema que permite operar y recibir respuesta."],
      ["Navegabilidad", "Facilidad con la que una persona recorre una experiencia y encuentra caminos claros."],
      ["UX", "Experiencia total del usuario antes, durante y después de usar un sistema."],
      ["UI", "Componentes visuales e interactivos que permiten operar el sistema."],
      ["Mockup", "Representación visual de una pantalla o flujo antes de implementarlo."],
      ["Plataforma", "Contexto técnico y de uso: móvil, PC, TV, web u otro entorno."],
    ],
    contents: [
      ["Mobile vs PC", "Diferencias de pantalla, interacción, contexto, atención, precisión y navegación entre ambas plataformas."],
      ["Flujos de usuario", "Recorridos que realiza el usuario para cumplir un objetivo dentro del sistema."],
      ["Jerarquía visual", "Orden de importancia que guía la lectura y las decisiones del usuario."],
      ["Accesibilidad", "Contraste, tamaño, foco y feedback como criterios de diseño inclusivo."],
      ["Prototipado", "Uso de Moqups o Figma para representar pantallas y justificar decisiones de diseño."],
    ],
    activity: [
      "Elegir una interfaz real de una plataforma interactiva (app, web, TV).",
      "Detectar al menos tres problemas de navegabilidad, jerarquía visual o feedback.",
      "Rediseñar una pantalla completa en Moqups o Figma (o mockup equivalente).",
      "Justificar cada cambio con criterios de usuario, contexto de uso y objetivo de la tarea.",
    ],
  },

  3: {
    title: "Introducción a la programación concurrente",
    intro: "Procesos, múltiples hilos, scheduler, concurrencia vs. paralelismo. Implementación y observación de race conditions en Java.",
    block: "Bloque 02",
    accent: "#00e8c6",
    accentSub: "rgba(0,232,198,0.08)",
    accentBorder: "rgba(0,232,198,0.25)",
    accentMid: "rgba(0,232,198,0.35)",
    objectives: [
      "Distinguir proceso de hilo con el fin de comprender las unidades básicas de ejecución concurrente.",
      "Explicar el rol del scheduler con el fin de entender cómo el sistema operativo administra la ejecución.",
      "Diferenciar concurrencia de paralelismo con el fin de aplicar el modelo correcto a cada problema.",
      "Implementar múltiples hilos en Java con el fin de observar y analizar race conditions.",
    ],
    terms: [
      ["Proceso", "Programa en ejecución con su propio espacio de memoria, recursos y estado del SO."],
      ["Hilo (Thread)", "Unidad de ejecución dentro de un proceso que comparte su memoria con otros hilos."],
      ["Scheduler", "Componente del SO que decide qué hilo o proceso ejecuta en cada momento y por cuánto tiempo."],
      ["Concurrencia", "Múltiples tareas progresan en el mismo período de tiempo, no necesariamente en simultáneo."],
      ["Paralelismo", "Múltiples tareas se ejecutan físicamente al mismo tiempo en distintos núcleos del procesador."],
      ["Race condition", "Error que depende del orden no determinístico en que los hilos acceden a un recurso compartido."],
    ],
    contents: [
      ["Proceso vs Hilo", "Diferencias de aislamiento, costo de creación y comunicación entre ambos modelos de ejecución."],
      ["Scheduler y estados", "Cómo el SO gestiona los estados ready, running y waiting; qué es el context switching."],
      ["Concurrencia vs Paralelismo", "Modelo conceptual: intercalación (concurrencia) vs ejecución simultánea real (paralelismo)."],
      ["Hilos en Java", "Thread, Runnable, ExecutorService y ciclo de vida básico de un hilo en Java."],
      ["Race condition en la práctica", "Cómo identificar, reproducir y observar errores de acceso concurrente no protegido."],
    ],
    activity: [
      "Implementar una clase Java con 3 o más hilos que accedan a un contador compartido sin sincronización.",
      "Ejecutar el programa varias veces y registrar los resultados distintos obtenidos en cada ejecución.",
      "Explicar por qué el resultado varía y en qué momento ocurre la race condition.",
      "Incluir un diagrama de estados simplificado del ciclo de vida de los hilos creados.",
    ],
  },

  4: {
    title: "Comunicación entre procesos e hilos",
    intro: "IPC, pipes, FIFO, colas de mensajes, memoria compartida y equivalentes prácticos en Java. Patrón productor-consumidor.",
    block: "Bloque 02",
    accent: "#9b6fff",
    accentSub: "rgba(155,111,255,0.08)",
    accentBorder: "rgba(155,111,255,0.25)",
    accentMid: "rgba(155,111,255,0.35)",
    objectives: [
      "Comprender la comunicación entre procesos e hilos con el fin de diseñar programas concurrentes coordinados.",
      "Distinguir pipes, FIFO, colas y memoria compartida con el fin de comparar mecanismos de IPC.",
      "Implementar un flujo productor-consumidor en Java con el fin de resolver comunicación entre tareas.",
    ],
    terms: [
      ["IPC", "Inter-Process Communication: conjunto de mecanismos para intercambiar datos entre procesos o hilos."],
      ["Pipe", "Canal de comunicación unidireccional y secuencial entre dos procesos."],
      ["FIFO", "Cola primero en entrar, primero en salir; permite comunicación entre procesos no relacionados."],
      ["Cola de mensajes", "Estructura para enviar datos entre productores y consumidores de forma asincrónica."],
      ["Memoria compartida", "Zona de datos accesible por más de una unidad de ejecución; rápida pero riesgosa."],
      ["BlockingQueue", "Cola Java que coordina productores y consumidores bloqueando cuando está llena o vacía."],
    ],
    contents: [
      ["Concepto de IPC", "Por qué comunicar procesos e hilos y qué problemas aparecen cuando comparten datos."],
      ["Pipes y FIFO", "Canales como modelo de comunicación: unidireccional, nombrado y no nombrado."],
      ["Colas de mensajes", "Desacoplamiento entre productor y consumidor mediante buffers intermedios."],
      ["Memoria compartida", "Comunicación rápida pero que requiere sincronización explícita para evitar race conditions."],
      ["Java: BlockingQueue y pipelines", "BlockingQueue, PipedInputStream/PipedOutputStream y patrón pipeline en Java."],
    ],
    activity: [
      "Crear un pipeline productor-procesador-consumidor en Java usando tres hilos.",
      "Usar una BlockingQueue para comunicar cada etapa del pipeline.",
      "Registrar los mensajes procesados y medir tiempos básicos de ejecución.",
      "Comparar la solución Java con los conceptos de pipes y FIFO vistos en la teoría.",
    ],
  },

  5: {
    title: "Sincronización entre procesos e hilos",
    intro: "Exclusión mutua, semáforos, mutexes, variables de condición, monitores. Deadlock, starvation y livelock.",
    block: "Bloque 02",
    accent: "#ff7d54",
    accentSub: "rgba(255,125,84,0.08)",
    accentBorder: "rgba(255,125,84,0.25)",
    accentMid: "rgba(255,125,84,0.35)",
    objectives: [
      "Identificar problemas de sincronización con el fin de proteger recursos compartidos en programas concurrentes.",
      "Aplicar semáforos, mutexes, condiciones y monitores con el fin de coordinar hilos correctamente.",
      "Analizar deadlock, starvation y livelock con el fin de prevenir fallas concurrentes en sistemas reales.",
    ],
    terms: [
      ["Sección crítica", "Bloque de código que accede a un recurso compartido y debe ejecutarse de forma exclusiva."],
      ["Mutex", "Mecanismo de exclusión mutua: solo un hilo puede tomar el mutex y acceder al recurso a la vez."],
      ["Semáforo", "Contador sincronizado que controla cuántas unidades de ejecución acceden a un recurso."],
      ["Monitor", "Abstracción que combina estado compartido y operaciones sincronizadas en una misma unidad."],
      ["Deadlock", "Situación en la que dos o más tareas se bloquean mutuamente esperando recursos indefinidamente."],
      ["Condition", "Mecanismo Java para que un hilo espere una condición específica y sea notificado al cumplirse."],
    ],
    contents: [
      ["Race condition y sección crítica", "Por qué ocurren los errores de sincronización y qué área del código hay que proteger."],
      ["Exclusión mutua", "Cómo proteger lectura y escritura de recursos compartidos con synchronized y ReentrantLock."],
      ["Semáforos y monitores", "Semaphore de Java para controlar acceso múltiple; monitores con wait/notify."],
      ["Variables de condición", "Condition para esperar y notificar estados específicos dentro de una sección protegida."],
      ["Fallas clásicas", "Deadlock, starvation y livelock: cómo detectarlos, prevenirlos y romper ciclos de espera."],
    ],
    activity: [
      "Implementar una simulación en Java con recurso compartido accedido por múltiples hilos sin sincronización.",
      "Medir o evidenciar el error de sincronización: valores incorrectos o comportamiento inconsistente.",
      "Corregir el problema usando synchronized, Lock, Condition o Semaphore según corresponda.",
      "Explicar qué problema se resolvió, qué mecanismo se eligió y qué costo de coordinación apareció.",
    ],
  },

  6: {
    title: "Programación en sistemas paralelos",
    intro: "Taxonomía de Flynn, memoria compartida y distribuida, paso de mensajes y paralelismo con Java ForkJoinPool.",
    block: "Bloque 03",
    accent: "#4a8ef0",
    accentSub: "rgba(74,142,240,0.08)",
    accentBorder: "rgba(74,142,240,0.25)",
    accentMid: "rgba(74,142,240,0.35)",
    objectives: [
      "Clasificar arquitecturas SISD, SIMD, MISD y MIMD con el fin de reconocer los modelos paralelos existentes.",
      "Comparar memoria compartida y distribuida con el fin de comprender sus diferencias de comunicación y sincronización.",
      "Aplicar paralelismo en Java con el fin de acelerar una tarea medible y comparar con la versión secuencial.",
    ],
    terms: [
      ["SISD", "Single Instruction, Single Data: arquitectura clásica secuencial con una instrucción y un dato."],
      ["SIMD", "Single Instruction, Multiple Data: una instrucción aplicada en paralelo a múltiples datos."],
      ["MISD", "Multiple Instruction, Single Data: múltiples instrucciones sobre un dato; caso poco común."],
      ["MIMD", "Multiple Instruction, Multiple Data: múltiples instrucciones sobre múltiples datos; base del HPC."],
      ["ForkJoinPool", "Framework Java para dividir recursivamente tareas en subtareas y combinar sus resultados."],
      ["Paso de mensajes", "Modelo de comunicación explícita entre nodos distribuidos con memoria propia."],
    ],
    contents: [
      ["Taxonomía de Flynn", "Clasificación de arquitecturas paralelas: SISD, SIMD, MISD y MIMD con ejemplos."],
      ["Memoria compartida", "Procesadores que acceden a un espacio de memoria común: ventajas y riesgos."],
      ["Memoria distribuida", "Nodos con memoria propia que se comunican por mensajes: MPI como referencia."],
      ["Java paralelo", "ExecutorService, ForkJoinPool y parallelStream como herramientas de paralelismo en Java."],
    ],
    activity: [
      "Elegir una tarea de procesamiento de datos con costo computacional medible (suma de array, búsqueda, etc.).",
      "Implementar la versión secuencial y la versión paralela en Java usando ForkJoinPool o parallelStream.",
      "Medir los tiempos de ejecución con distintos tamaños de entrada (al menos 3 magnitudes).",
      "Explicar el speedup obtenido y los límites observados en función de la cantidad de hilos.",
    ],
  },

  7: {
    title: "Computación de alta performance",
    intro: "Medición de rendimiento, speedup, eficiencia y escalabilidad. Ley de Amdahl y Gustafson-Barsis como cierre de la materia.",
    block: "Bloque 03",
    accent: "#9b6fff",
    accentSub: "rgba(155,111,255,0.08)",
    accentBorder: "rgba(155,111,255,0.25)",
    accentMid: "rgba(155,111,255,0.35)",
    objectives: [
      "Medir performance de algoritmos con el fin de comparar soluciones secuenciales y paralelas con datos reales.",
      "Aplicar la Ley de Amdahl y la Ley de Gustafson-Barsis con el fin de interpretar los límites teóricos de aceleración.",
      "Comunicar resultados con gráficos y conclusiones técnicas con el fin de justificar decisiones de diseño paralelo.",
    ],
    terms: [
      ["Speedup", "Relación entre el tiempo secuencial y el tiempo paralelo: S = T₁ / Tₙ."],
      ["Eficiencia", "Uso relativo de los recursos paralelos: E = S / n (donde n es el número de procesadores)."],
      ["Ley de Amdahl", "Modelo que limita el speedup máximo en función de la fracción no paralelizable del programa."],
      ["Ley de Gustafson-Barsis", "Modelo alternativo que analiza el escalado aumentando el tamaño del problema con más procesadores."],
      ["Profiling", "Técnica de medición para identificar cuellos de botella y las partes más costosas del código."],
      ["Overhead", "Costo extra de crear, coordinar y sincronizar las unidades de ejecución paralelas."],
    ],
    contents: [
      ["Medición de performance", "Cómo comparar tiempos de forma reproducible: warm-up, repeticiones y promedios."],
      ["Speedup y eficiencia", "Interpretación de la aceleración real obtenida y el costo de los recursos usados."],
      ["Ley de Amdahl", "Límite teórico del speedup basado en la porción serial del algoritmo."],
      ["Ley de Gustafson-Barsis", "Perspectiva alternativa: más procesadores para resolver problemas más grandes."],
      ["Conclusión técnica", "Cómo decidir si paralelizar valió la pena y comunicar la decisión con evidencia."],
    ],
    activity: [
      "Seleccionar un algoritmo de alto costo computacional (ordenamiento, búsqueda, suma matricial u otro).",
      "Medir la versión secuencial y la versión paralela con distintas cantidades de hilos.",
      "Calcular el speedup y la eficiencia para cada configuración medida.",
      "Contrastar los resultados con las predicciones de Amdahl y Gustafson; presentar una conclusión técnica fundamentada.",
    ],
  },
};

/* ═══════════════════════════════════════════
   Inicialización
═══════════════════════════════════════════ */
const params = new URLSearchParams(window.location.search);
const filenameMatch = window.location.pathname.match(/modulo(\d+)\.html/);
const id = Number(params.get("m")) || (filenameMatch ? Number(filenameMatch[1]) : 1);
const data = MODULES[id] || MODULES[1];
const doc = document.documentElement;

// Accent CSS variables
doc.style.setProperty("--accent",        data.accent);
doc.style.setProperty("--accent-sub",    data.accentSub);
doc.style.setProperty("--accent-border", data.accentBorder);
doc.style.setProperty("--accent-mid",    data.accentMid);

// Cursor glow
const glow = document.getElementById("mglow");
if (glow) {
  document.addEventListener("mousemove", e => {
    glow.style.transform = `translate(${e.clientX - 210}px, ${e.clientY - 210}px)`;
  });
}

// Hero
document.title = `PAI3 · Módulo ${id}`;
setText("mhdrLabel",  `Módulo ${String(id).padStart(2, "0")}`);
setText("mheroBlock", data.block);
setText("mheroNum",   String(id).padStart(2, "0"));
setText("mheroTitle", data.title);
setText("mheroIntro", data.intro);

const decor = document.getElementById("mheroDecor");
if (decor) decor.textContent = String(id).padStart(2, "0");

// Prev / Next
const ALL = [1, 2, 3, 4, 5, 6, 7];
const idx = ALL.indexOf(id);
const prevId = idx > 0 ? ALL[idx - 1] : null;
const nextId = idx < ALL.length - 1 ? ALL[idx + 1] : null;

setModuleLink("btnPrev", prevId, "../index.html");
setModuleLink("btnNext", nextId, "../evaluacion.html");
setModuleLink("footPrev", prevId, "../index.html");
setModuleLink("footNext", nextId, "../evaluacion.html");

if (prevId) {
  setText("footPrevLabel", `Módulo ${prevId}`);
} else {
  setText("footPrevLabel", "Índice");
  const fp = document.getElementById("footPrev");
  if (fp) fp.classList.add("off");
}
if (nextId) {
  setText("footNextLabel", `Módulo ${nextId}`);
} else {
  setText("footNextLabel", "Evaluación");
}

// Render sections
renderList("objectives", data.objectives, (text, i) => `
  <div class="objCard">
    <span class="objNum">${String(i + 1).padStart(2, "0")}</span>
    <span class="objText">${text}</span>
  </div>
`);

renderList("terms", data.terms, ([term, def]) => `
  <div class="termCard">
    <span class="termName">${term}</span>
    <span class="termDef">${def}</span>
  </div>
`);

renderList("contents", data.contents, ([title, text]) => `
  <div class="cCard">
    <div class="cTitle">${title}</div>
    <div class="cText">${text}</div>
  </div>
`);

renderList("activities", data.activity, (text, i) => `
  <div class="actCard">
    <span class="actStep">Paso ${String(i + 1).padStart(2, "0")}</span>
    <span class="actText">${text}</span>
  </div>
`);

/* ─── Helpers ────────────────────────────── */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function moduleUrl(targetId) {
  if (targetId === 1) return 'modulo1.html';
  if (targetId === 2) return 'modulo2.html';
  return `modulo.html?m=${targetId}`;
}

function setModuleLink(btnId, targetId, fallback) {
  const el = document.getElementById(btnId);
  if (!el) return;
  el.href = targetId ? moduleUrl(targetId) : fallback;
}

function renderList(containerId, items, renderer) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map((item, i) => renderer(item, i)).join("");
}
