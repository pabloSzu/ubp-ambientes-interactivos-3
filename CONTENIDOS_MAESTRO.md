# PAI3 — Documento Maestro de Contenidos
**Programación para Ambientes Interactivos III**
Universidad Blas Pascal · Licenciatura en Sistemas de Información · Plan 2021
Responsable: Mónica Nano · 6° Semestre · 90 hs totales · 6 hs/semana

---

## OBJETIVOS GENERALES DE LA MATERIA

1. Conocer el concepto de Interactividad y el lenguaje interactivo con el fin de transferirlos a las situaciones prácticas propuestas en la materia.
2. Conocer el estado de arte de la televisión digital interactiva a los fines de situarnos como profesionales en el contexto mundial.
3. Revisar modelos de aplicaciones para TV digital en la Argentina y el mundo.
4. Aproximarse a los conceptos de interfaz, navegabilidad, usuario y experiencia con el propósito de reconocer la especificidad de cada uno y profundizarlos a lo largo de la carrera.
5. Aprender los conceptos de UX, UI y Navegabilidad con el fin de avanzar hacia los contenidos de plataformas interactivas.
6. Desarrollar capacidades para construir programas concurrentes.
7. Desarrollar capacidades para testear y depurar un programa concurrente.
8. Comprender los algoritmos paralelos para conocer las posibilidades y limitaciones que ofrecen las arquitecturas paralelas a la programación.

---

## BLOQUE 01 — Medios y Diseño Interactivo

---

## Módulo 1 · Interactividad y TV Digital
**Color de acento:** `#ffd166` (ámbar)

### Microobjetivos
1. Conocer el concepto de Interactividad y el lenguaje interactivo con el fin de transferirlos a las situaciones prácticas propuestas en la materia.
2. Conocer el estado de arte de la televisión digital interactiva a los fines de situarnos como profesionales en el contexto mundial.
3. Revisar modelos de aplicaciones para TV digital en la Argentina y el mundo.

### Secciones de contenido

| # | ID | Título | Contenido cubierto |
|---|-----|--------|--------------------|
| 1 | `#contenidos` | El Ciclo Básico de Interactividad | Definición de interactividad. Modelo Acción → Proceso → Feedback. Tiempo de respuesta (<100ms, 1s). Diferencia entre sistemas interactivos y pasivos. |
| 2 | `#niveles` | 5 Niveles de Interactividad | Taxonomía completa: N1 Reactividad, N2 Selección, N3 Personalización, N4 Cocreación, N5 Colectiva. Interfaz tabbed con ejemplos y simulación del ciclo por nivel. |
| 3 | `#juego` | Minijuego clasificador | 5 escenarios reales para clasificar en el nivel correcto del espectro. Sistema de puntuación con feedback. |
| 4 | `#tvdigital` | TV Digital Interactiva en Argentina | Adopción de ISDB-Tb en 2009. Canal de datos paralelo a la señal de video. Ecosistema: estándar → middleware → aplicaciones. Diferencias TV analógica/digital/internet. |
| 5 | `#pipeline` | Pipeline ISDB-Tb / Ginga / DEVENDRA | Diagrama interactivo: ISDB-Tb → Datos → Ginga → NCL/Lua → DEVENDRA → Usuario. Clic en cada nodo muestra descripción detallada. |
| 6 | `#devendra` | Caso DEVENDRA | Proyecto argentino de TV educativa interactiva. Flujo: señal pública → App Ginga → alumno (control remoto) → datos de uso → impacto social. Llega a hogares sin internet. |
| 7 | `#streaming` | Netflix, Twitch, YouTube | Las plataformas de streaming como ejemplos del ciclo en acción. Netflix (N3-N5, ABR+ML), Twitch (N5 colectiva, chat en tiempo real), YouTube (multi-nivel). Comparativa TV analógica vs streaming. |
| 8 | `#quiz` | Quiz de autoevaluación | 5 preguntas de opción múltiple con explicación en caso de error. Cubre conceptos de ciclo, niveles y TV digital. |

### Glosario
Términos incluidos en `#glosario` (verificar contenido real en HTML).

### Actividades (`#actividades`)
- Actividad práctica: clasificar un sistema real en el espectro de interactividad + justificar con el ciclo Acción → Proceso → Feedback.

### ⚠️ Contenido posiblemente faltante
- Comparativa más detallada de estándares mundiales (ATSC, DVB-T, ISDB-T)
- NCL/Lua: ejemplo de código mínimo de aplicación Ginga
- Línea de tiempo histórica de la TV digital en Latinoamérica
- Laboratorio interactivo (presente en M3-M7, ausente en M1)

---

## Módulo 2 · Interfaces, Navegabilidad y UX
**Color de acento:** `#a855f7` (violeta)

### Microobjetivos
1. Aproximarse a los conceptos de interfaz, navegabilidad, usuario y experiencia con el propósito de reconocer la especificidad de cada uno y profundizarlos a lo largo de la carrera.
2. Aprender los conceptos de UX, UI y Navegabilidad con el fin de avanzar hacia los contenidos de plataformas interactivas.

### Secciones de contenido

| # | ID | Título | Contenido cubierto |
|---|-----|--------|--------------------|
| 1 | `#conceptos` | UX, UI e Interacción: ¿cuál es la diferencia? | Definición de UI (capa visual), IX (comportamiento), UX (experiencia total). Diagrama de capas. Analogía del auto. |
| 2 | `#leyes` | Las leyes de UX | Ley de Hick (tiempo de decisión vs nro. de opciones), Ley de Fitts (tamaño y distancia de targets), Ley de Miller (7±2 chunks), Leyes de Gestalt (proximidad, similitud, continuidad, cierre). |
| 3 | `#heuristicas` | Las 10 Heurísticas de Nielsen | Las 10 heurísticas completas con ejemplos visuales. Sistema para auditoría de interfaces. Calificación de severidad. |
| 4 | `#accesibilidad` | Accesibilidad Web — WCAG | Principios POUR (Perceptible, Operable, Comprensible, Robusto). Niveles A/AA/AAA. Herramientas de evaluación. |
| 5 | `#flujos` | Flujos de usuario y navegabilidad | Diseño de flujos de navegación. User journey maps. Jerarquía visual. Arquitectura de información. Prototipado (Moqups/Figma). |

### Glosario
Términos en `#glosario`.

### Actividades (`#actividades`)
- Auditoría de interfaz real aplicando las heurísticas de Nielsen con calificación de severidad y propuesta de mejora.

### ⚠️ Contenido posiblemente faltante
- Casos de estudio con antes/después de rediseño
- Comparativa mobile vs desktop (diferencias de patrones de navegación)
- Dark patterns: qué son y cómo identificarlos
- Laboratorio interactivo

---

## BLOQUE 02 — Programación Concurrente en Java

---

## Módulo 3 · Programación Concurrente
**Color de acento:** `#00e8c6` (cian)

### Microobjetivos
1. Desarrollar capacidades para construir programas concurrentes con el fin de diseñar sistemas que ejecuten múltiples tareas en simultáneo de forma correcta y eficiente.
2. Desarrollar capacidades para testear y depurar un programa concurrente con el fin de identificar y corregir condiciones de carrera, deadlocks y errores de sincronización.

### Secciones de contenido

| # | ID | Título | Contenido cubierto |
|---|-----|--------|--------------------|
| 1 | `#conceptos` | Proceso vs Hilo: ¿cuál es la diferencia? | Definición de proceso (espacio de memoria propio) vs hilo (memoria compartida). Diagrama "casa vs habitaciones". Cuándo usar cada uno. |
| 2 | `#scheduler` | El Scheduler: quién decide quién corre | Planificación de hilos por el SO. Algoritmos de scheduling (FIFO, Round Robin, prioridad). Preempción. Context switch. Simulador visual de scheduling. |
| 3 | `#race` | Race Condition: cuando el orden importa | Problema read-modify-write. Diagrama de entrelazado de hilos. Demostración con contador compartido. Thread Detective (juego de detección de bugs). |
| 4 | `#laboratorio` | Laboratorio Interactivo | Entorno de ejercitación práctica con código Java concurrente. |

### Glosario
Términos en `#glosario`.

### Actividades (`#actividades`)
- Race Condition en Producción: analizar y corregir un sistema bancario concurrente con bug de condición de carrera.

### ⚠️ Contenido posiblemente faltante
- Ciclo de vida de un hilo (NEW, RUNNABLE, BLOCKED, WAITING, TERMINATED)
- ThreadPool y ExecutorService (introducción)
- Código Java de referencia: crear hilos con Thread, Runnable, Callable
- Comparativa rendimiento: single-thread vs multi-thread

---

## Módulo 4 · Comunicación IPC
**Color de acento:** `#b040ff` (violeta oscuro)

### Microobjetivos
1. Identificar los mecanismos de comunicación entre procesos con el fin de seleccionar el más adecuado para cada escenario de diseño concurrente.
2. Implementar pipes, sockets y colas de mensajes en Java con el fin de resolver problemas de comunicación en sistemas multiproceso.
3. Evaluar el rendimiento y la seguridad de distintos mecanismos IPC con el fin de tomar decisiones fundamentadas en el diseño de sistemas distribuidos.

### Secciones de contenido

| # | ID | Título | Contenido cubierto |
|---|-----|--------|--------------------|
| 1 | `#conceptos` | ¿Por qué necesitan comunicarse? | Aislamiento de procesos y la necesidad de IPC. Problema del buffer compartido. Modelos de comunicación (sincrónico/asincrónico). |
| 2 | `#ipc` | Los 4 mecanismos de IPC | Pipes (flujo unidireccional, heredados), FIFO/Named Pipes (persistentes, entre procesos no relacionados), Colas de mensajes (asincrónicas, tipadas), Memoria compartida (más rápida, requiere sincronización). Tabla comparativa: velocidad, persistencia, acoplamiento. |
| 3 | `#simulador` | BlockingQueue Simulator | Simulador visual del patrón Productor-Consumidor con BlockingQueue. Control de velocidad de producción/consumo. Visualización del estado del buffer. |
| 4 | `#laboratorio` | Laboratorio Interactivo | Ejercicios de implementación de IPC en Java. |

### Glosario
Términos en `#glosario`.

### Actividades (`#actividades`)
- Implementar un pipeline Productor-Consumidor de 3 etapas en Java usando BlockingQueue sin race conditions.

### ⚠️ Contenido posiblemente faltante
- Sockets (TCP/UDP) como mecanismo IPC entre procesos remotos
- Código de referencia completo (Pipes, Named Pipes, BlockingQueue, SharedMemory)
- Casos reales de IPC en sistemas productivos (Kafka, RabbitMQ como equivalentes enterprise)
- "Modo Courier" (mencionado previamente — verificar qué es y si está implementado)

---

## Módulo 5 · Sincronización y Deadlock
**Color de acento:** `#ff7d54` (naranja coral)

### Microobjetivos
1. Reconocer las condiciones de Coffman con el fin de identificar situaciones de interbloqueo antes de que ocurran en producción.
2. Aplicar estrategias de prevención, evitación y detección de deadlocks con el fin de garantizar la vivacidad de los procesos concurrentes.
3. Analizar problemas clásicos de sincronización (filósofos, productor-consumidor) con el fin de extraer patrones reutilizables para el diseño concurrente.

### Secciones de contenido

| # | ID | Título | Contenido cubierto |
|---|-----|--------|--------------------|
| 1 | `#conceptos` | 6 conceptos que definen la sincronización | Mutex, semáforo, monitor, sección crítica, exclusión mutua, condición de carrera. Cards con iconografía y descripción. |
| 2 | `#filosofos-intro` | Los Filósofos de la Cena | Presentación del problema clásico de Dijkstra. 5 filósofos, 5 tenedores. Análisis del deadlock potencial. |
| 3 | `#simulador` | Simulador de Filósofos | Simulador interactivo con 5 filósofos. Control de estrategia (naive/solución). Visualización de estados (comiendo, pensando, esperando, deadlock). |
| 4 | `#coffman` | Las 4 Condiciones de Coffman | Exclusión mutua, retención y espera, no expropiación, espera circular. Para que haya deadlock deben cumplirse las 4. Estrategias de rotura. |
| 5 | `#vidareal` | Los mismos problemas en el mundo real | Deadlocks en bases de datos, sistemas operativos, transacciones bancarias. Casos reales documentados. |
| 6 | `#filesystem` | Filesystem quirks — locks en disco | Locks de archivo, journal, fsync. Problemas de sincronización en acceso concurrente al disco. |
| 7 | `#codigo` | Código Java — 3 implementaciones | synchronized, Semaphore, ReentrantLock. Deadlock Doctor (juego de corrección de código con Prism.js). |
| 8 | `#laboratorio` | Laboratorio Interactivo | Ejercicios de sincronización en Java. |

### Glosario
Términos en `#glosario`.

### Actividades (`#actividades`)
- Corregir un sistema concurrente defectuoso identificando el tipo de patología (deadlock/starvation/livelock) y aplicando la solución correcta.

### ⚠️ Contenido posiblemente faltante
- Algoritmo del banquero (Banker's Algorithm) para evitación de deadlock
- Starvation y Livelock como patologías separadas con sus propios ejemplos
- Problema Lectores-Escritores (clásico junto a filósofos)
- Problema del Barbero Dormido

---

## BLOQUE 03 — Arquitecturas de Alto Rendimiento

---

## Módulo 6 · Paralelismo
**Color de acento:** `#38bdf8` (azul cielo)

### Microobjetivos
1. Comprender los algoritmos paralelos para conocer las posibilidades y limitaciones que ofrecen las arquitecturas paralelas a la programación.
2. Aplicar la Ley de Amdahl y la taxonomía de Flynn con el fin de clasificar arquitecturas y tomar decisiones fundadas sobre cuándo y cómo paralelizar.
3. Implementar soluciones paralelas con Fork/Join y Parallel Streams con el fin de aprovechar el hardware multinúcleo en aplicaciones reales.

### Secciones de contenido

| # | ID | Título | Contenido cubierto |
|---|-----|--------|--------------------|
| 1 | `#conceptos` | La taxonomía de Flynn | SISD, SIMD, MIMD, MISD. Identificación de CPU, GPU y cluster según la taxonomía. |
| 2 | `#amdahl` | La Ley de Amdahl | Speedup = 1 / (S + P/N). Fracción serial como cuello de botella. Límite asintótico. Cuándo agregar cores deja de ayudar. |
| 3 | `#simulador` | Simulador Amdahl en tiempo real | Simulador interactivo de la ley. Sliders para fracción serial y número de cores. Curva de speedup dinámica. |
| 4 | `#memoria` | Memoria compartida vs Distribuida | Modelos de memoria en sistemas paralelos. UMA/NUMA. Trade-offs. Ejemplos de arquitecturas. |
| 5 | `#comparacion` | Secuencial vs Paralelo en vivo | Benchmark visual de ordenamiento/suma en un solo hilo vs múltiples hilos. |
| 6 | `#streaming` | Simulador — Encoding de video en paralelo | Simulación de pipeline de encoding paralelo. Distribución de frames entre workers. |
| 7 | `#codigo` | Tres formas de paralelizar en Java | Thread manual, ExecutorService, Fork/Join (RecursiveTask), Parallel Streams. Comparativa de código. |
| 8 | `#casos` | Paralelismo en TV y Streaming | Casos reales: transcodificación de video, rendering 3D, búsqueda distribuida. |
| 9 | `#laboratorio` | Laboratorio Interactivo | Ejercicios de implementación paralela en Java. |

### Glosario
Términos en `#glosario`.

### Actividades (`#actividades`)
- Benchmark paralelo: medir speedup real de un algoritmo propio con distintas cantidades de threads y comparar con la predicción de Amdahl.

### ⚠️ Contenido posiblemente faltante
- Ley de Gustafson-Barsis como complemento/contraste a Amdahl (aparece en M7 — ¿debería mencionarse en M6?)
- OpenMP / MPI como paradigmas de programación paralela (nivel introductorio)
- Paralelismo de datos vs paralelismo de tareas (conceptual)

---

## Módulo 7 · HPC, GPU & Cloud
**Color de acento:** `#a3e635` (lima)

### Microobjetivos
1. Analizar arquitecturas de alto rendimiento (clusters, grid y cloud computing) con el fin de seleccionar el entorno óptimo para resolver problemas de cómputo intensivo de gran escala.
2. Comparar CPU y GPU como modelos de procesamiento paralelo con el fin de diseñar soluciones de alto rendimiento que aprovechen las capacidades del hardware moderno.

### Secciones de contenido

| # | ID | Título | Contenido cubierto |
|---|-----|--------|--------------------|
| 1 | `#algoritmos` | Algoritmos que necesitan poder de fuego | Categorías de problemas HPC: simulación física, ML/AI, bioinformática, renderizado CGI, predicción climática. Por qué un solo core no alcanza. |
| 2 | `#gustafson` | Gustafson-Barsis vs Amdahl | Ley de Gustafson: el problema crece con los cores. Cuándo Gustafson reemplaza a Amdahl. Debate histórico de 40 años. Simulador comparativo. |
| 3 | `#hardware` | CPU · GPU · FPGA · ASIC | Comparativa de arquitecturas de procesamiento. GPU: miles de cores simples vs CPU: pocos cores complejos. FPGA (reconfigurable) y ASIC (circuito dedicado). Casos de uso para cada uno. |
| 4 | `#clusters` | Clusters — cuando una máquina no alcanza | Arquitectura de cluster. Nodos master/worker. Redes de interconexión (InfiniBand). Ejemplos: Beowulf, TOP500. Fat-Tree SVG interactivo. |
| 5 | `#cloud` | Cloud Computing para HPC | AWS, GCP, Azure: instancias de cómputo. Spot instances, auto-scaling. Vertical vs horizontal scaling. Calculadora de costo cloud. |
| 6 | `#codigo` | Código HPC en Java | Fork/Join para HPC, Parallel Streams con grandes datasets, race conditions en HPC. |
| 7 | `#casos` | HPC en experiencias interactivas | Unreal Engine 5 (Nanite, Lumen), ChatGPT (inference a escala), Netflix (transcodificación), HFT (trading de alta frecuencia). |
| 8 | `#laboratorio` | Laboratorio Interactivo + Juego de arquitectura | Embed de lab externo. Juego de selección de arquitectura correcta por caso de uso. |

### Glosario
Términos en `#glosario`.

### Actividades (`#actividades`)
- Análisis de arquitectura de alto rendimiento: dado un problema de cómputo intensivo real, seleccionar y justificar la arquitectura óptima (CPU/GPU/cluster/cloud).

### ⚠️ Contenido posiblemente faltante
- CUDA / OpenCL: programación de GPU (nivel introductorio o referencia)
- Grid computing vs cloud computing vs cluster: diferenciación clara
- Ejemplo de Job real en HPC (script SLURM o similar)
- Casos con números reales (costo cloud, tiempo de cómputo, speedup medido)

---

## RESUMEN GENERAL

| Módulo | Secciones de contenido | Tiene lab | Tiene quiz | Tiene juego | Tiene simulador |
|--------|------------------------|-----------|------------|-------------|-----------------|
| M1 — Interactividad | 8 | ❌ | ✅ | ✅ | ❌ |
| M2 — UX/UI | 5 | ❌ | ❌ | ❌ | ❌ |
| M3 — Concurrencia | 4 | ✅ | ❌ | ✅ | ✅ |
| M4 — IPC | 4 | ✅ | ❌ | ❌ | ✅ |
| M5 — Sincronización | 8 | ✅ | ❌ | ✅ | ✅ |
| M6 — Paralelismo | 9 | ✅ | ❌ | ❌ | ✅ |
| M7 — HPC & GPU | 8 | ✅ | ❌ | ✅ | ✅ |

### Gaps transversales detectados
- **Quiz**: solo M1 tiene quiz de autoevaluación. M2-M7 no tienen.
- **Laboratorio**: M1 y M2 no tienen laboratorio interactivo.
- **Código de referencia**: M1, M2, M3 no tienen sección de código Java de referencia.
- **Casos reales**: M3 y M4 tienen menos casos del mundo real que M5-M7.
- **Línea de tiempo / contexto histórico**: ningún módulo tiene una perspectiva histórica sistemática.
- **Evaluación parcial**: la materia tiene 2 parciales — verificar si `evaluacion.html` tiene contenido completo.

---

*Generado: 2026-05-16 · Para actualizar, editar directamente este archivo.*
