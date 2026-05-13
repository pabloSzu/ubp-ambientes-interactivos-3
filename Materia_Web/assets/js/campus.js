const modules = {
  2: {
    title: "Módulo 2: Interfaces, navegabilidad y experiencia del usuario",
    intro: "Este módulo trabaja la especificidad de cada plataforma, la experiencia de usuario, la navegabilidad, las interfaces y la maquetación con herramientas como Moqups o Figma.",
    objectives: [
      "Reconocer los conceptos de interfaz, usuario, navegabilidad y experiencia con el fin de analizar plataformas interactivas.",
      "Comparar interfaces móviles y de escritorio con el fin de identificar restricciones y oportunidades de diseño.",
      "Aplicar criterios básicos de UX/UI con el fin de justificar mejoras en una pantalla existente.",
      "Construir un mockup navegable con el fin de comunicar una propuesta de interacción.",
    ],
    terms: [
      ["Interfaz", "Superficie de contacto entre usuario y sistema."],
      ["Navegabilidad", "Facilidad con la que una persona recorre una experiencia y encuentra caminos claros."],
      ["UX", "Experiencia total del usuario antes, durante y después de usar un sistema."],
      ["UI", "Componentes visuales e interactivos que permiten operar el sistema."],
      ["Mockup", "Representación visual de una pantalla o flujo antes de implementarlo."],
      ["Plataforma", "Contexto técnico y de uso: móvil, PC, TV, web u otro entorno."],
    ],
    contents: [
      ["Mobile vs PC", "Diferencias de pantalla, interacción, contexto, atención, precisión y navegación."],
      ["Flujos", "Recorridos que realiza el usuario para cumplir un objetivo dentro del sistema."],
      ["Jerarquía visual", "Orden de importancia que guía la lectura y las decisiones."],
      ["Prototipado", "Uso de Moqups o Figma para representar pantallas y justificar cambios."],
    ],
    activity: [
      "Elegir una interfaz real de una plataforma interactiva.",
      "Detectar problemas de navegabilidad, jerarquía o feedback.",
      "Rediseñar una pantalla en Moqups/Figma o mockup equivalente.",
      "Justificar cada cambio con criterios de usuario, contexto y objetivo.",
    ],
  },
  4: {
    title: "Módulo 4: Comunicación entre procesos e hilos",
    intro: "Este módulo explica cómo las unidades de ejecución intercambian información: IPC, pipes, FIFO, colas de mensajes, memoria compartida y equivalentes prácticos en Java.",
    objectives: [
      "Comprender la comunicación entre procesos e hilos con el fin de diseñar programas concurrentes coordinados.",
      "Distinguir pipes, FIFO, colas y memoria compartida con el fin de comparar mecanismos de IPC.",
      "Implementar un flujo productor-consumidor en Java con el fin de resolver comunicación entre tareas.",
    ],
    terms: [
      ["IPC", "Comunicación entre procesos o unidades de ejecución."],
      ["Pipe", "Canal de comunicación secuencial entre procesos."],
      ["FIFO", "Cola primero en entrar, primero en salir."],
      ["Cola de mensajes", "Estructura para enviar datos entre productores y consumidores."],
      ["Memoria compartida", "Zona de datos accesible por más de una unidad de ejecución."],
      ["BlockingQueue", "Cola Java que coordina productores y consumidores bloqueando cuando corresponde."],
    ],
    contents: [
      ["Concepto de IPC", "Por qué comunicar procesos/hilos y qué problemas aparecen."],
      ["Canales", "Pipes, FIFO y colas como modelos de comunicación."],
      ["Memoria compartida", "Comunicación rápida pero riesgosa si no se sincroniza."],
      ["Java", "BlockingQueue, PipedInputStream/PipedOutputStream y patrón pipeline."],
    ],
    activity: [
      "Crear un pipeline productor-procesador-consumidor en Java.",
      "Usar una cola bloqueante para comunicar etapas.",
      "Registrar mensajes procesados y tiempos básicos.",
      "Comparar la solución con pipes/FIFO conceptuales.",
    ],
  },
  5: {
    title: "Módulo 5: Sincronización entre procesos e hilos",
    intro: "Este módulo trabaja exclusión mutua, semáforos, mutexes, variables de condición, monitores y problemas como deadlock, starvation y livelock.",
    objectives: [
      "Identificar problemas de sincronización con el fin de proteger recursos compartidos.",
      "Aplicar semáforos, mutexes, condiciones y monitores con el fin de coordinar hilos correctamente.",
      "Analizar deadlock, starvation y livelock con el fin de prevenir fallas concurrentes.",
    ],
    terms: [
      ["Sección crítica", "Bloque que accede a un recurso compartido y debe protegerse."],
      ["Mutex", "Mecanismo de exclusión mutua."],
      ["Semáforo", "Contador sincronizado que controla acceso a recursos."],
      ["Monitor", "Abstracción que combina estado compartido y operaciones sincronizadas."],
      ["Deadlock", "Situación en la que tareas quedan esperando indefinidamente."],
      ["Condition", "Mecanismo Java para esperar y notificar condiciones específicas."],
    ],
    contents: [
      ["Race condition", "Error que depende del orden de ejecución."],
      ["Exclusión mutua", "Cómo proteger lectura/escritura de recursos compartidos."],
      ["Herramientas Java", "synchronized, ReentrantLock, Condition y Semaphore."],
      ["Fallas clásicas", "Deadlock, starvation, livelock y estrategias de prevención."],
    ],
    activity: [
      "Implementar una simulación con recurso compartido sin sincronización.",
      "Medir o evidenciar el error.",
      "Corregir con synchronized, Lock, Condition o Semaphore.",
      "Explicar qué problema se resolvió y qué costo apareció.",
    ],
  },
  6: {
    title: "Módulo 6: Programación en sistemas paralelos",
    intro: "Este módulo presenta arquitecturas paralelas, taxonomía de Flynn, memoria compartida/distribuida, paso de mensajes y herramientas Java para paralelismo.",
    objectives: [
      "Clasificar arquitecturas SISD, SIMD, MISD y MIMD con el fin de reconocer modelos paralelos.",
      "Comparar memoria compartida y distribuida con el fin de comprender comunicación y sincronización.",
      "Aplicar paralelismo en Java con el fin de acelerar una tarea medible.",
    ],
    terms: [
      ["SISD", "Una instrucción, un dato."],
      ["SIMD", "Una instrucción aplicada a múltiples datos."],
      ["MISD", "Múltiples instrucciones sobre un dato, caso poco común."],
      ["MIMD", "Múltiples instrucciones sobre múltiples datos."],
      ["ForkJoinPool", "Framework Java para dividir y combinar tareas."],
      ["Paso de mensajes", "Comunicación explícita entre unidades distribuidas."],
    ],
    contents: [
      ["Flynn", "Taxonomía para clasificar arquitecturas."],
      ["Memoria compartida", "Procesadores acceden a un espacio común."],
      ["Memoria distribuida", "Nodos con memoria propia comunican por mensajes."],
      ["Java paralelo", "ExecutorService, ForkJoinPool y parallelStream."],
    ],
    activity: [
      "Elegir una tarea de procesamiento de datos.",
      "Implementar versión secuencial y paralela en Java.",
      "Medir tiempos con distintos tamaños de entrada.",
      "Explicar speedup y límites observados.",
    ],
  },
  7: {
    title: "Módulo 7: Computación de alta performance",
    intro: "Este módulo cierra la materia midiendo rendimiento real, speedup, eficiencia, Ley de Amdahl, Ley de Gustafson y límites del paralelismo.",
    objectives: [
      "Medir performance de algoritmos con el fin de comparar soluciones secuenciales y paralelas.",
      "Aplicar Ley de Amdahl y Ley de Gustafson con el fin de interpretar límites de aceleración.",
      "Comunicar resultados con gráficos y conclusiones con el fin de justificar decisiones técnicas.",
    ],
    terms: [
      ["Speedup", "Relación entre tiempo secuencial y tiempo paralelo."],
      ["Eficiencia", "Uso relativo de recursos paralelos."],
      ["Amdahl", "Ley que limita speedup según la parte no paralelizable."],
      ["Gustafson", "Ley que analiza escalado aumentando tamaño del problema."],
      ["Profiling", "Medición para encontrar cuellos de botella."],
      ["Overhead", "Costo extra de coordinar paralelismo."],
    ],
    contents: [
      ["Medición", "Cómo comparar tiempos de forma razonable."],
      ["Speedup", "Interpretación de aceleración real."],
      ["Amdahl/Gustafson", "Modelos para discutir límites y escalado."],
      ["Conclusión técnica", "Cómo decidir si paralelizar valió la pena."],
    ],
    activity: [
      "Seleccionar algoritmo de alto costo computacional.",
      "Medir versión secuencial y paralela.",
      "Calcular speedup y eficiencia.",
      "Contrastar resultados con Amdahl/Gustafson y presentar conclusión.",
    ],
  },
};

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("m") || 2);
const data = modules[id] || modules[2];

function fillText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function renderCards(selector, items, renderer) {
  const root = document.querySelector(selector);
  if (!root) return;
  root.innerHTML = items.map(renderer).join("");
}

document.title = `PAI3 | Módulo ${id}`;
fillText("#topTitle", `Módulo ${id}`);
fillText("#moduleKicker", `Módulos / Módulo ${id}`);
fillText("#moduleTitle", data.title);
fillText("#moduleIntro", data.intro);
fillText("#moduleFolder", `Módulos / Módulo ${id}`);

renderCards("#objectives", data.objectives, (item, index) => `
  <article>
    <span class="pill">${String(index + 1).padStart(2, "0")}</span>
    <p>${item}</p>
  </article>
`);

renderCards("#terms", data.terms, ([term, definition]) => `
  <article>
    <h3>${term}</h3>
    <p>${definition}</p>
  </article>
`);

renderCards("#contents", data.contents, ([title, text]) => `
  <article>
    <h3>${title}</h3>
    <p>${text}</p>
  </article>
`);

renderCards("#activities", data.activity, (step, index) => `
  <article>
    <span class="pill">Paso ${index + 1}</span>
    <p>${step}</p>
  </article>
`);
