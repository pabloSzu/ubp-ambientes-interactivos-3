# Diseño editorial y pedagógico del ebook PAI3

**Materia:** Programación para Ambientes Interactivos III  
**Fecha:** 24 de junio de 2026  
**Archivo fuente actual:** `ebook-muestra.html`  
**Salidas:** ebook integral y PDF independiente por módulo

## 1. Objetivo

Construir un ebook universitario autosuficiente que contenga el 100 % de los
contenidos teóricos de la materia, explicados con profundidad, coherencia y
rigor técnico. El estudiante debe poder aprender toda la materia usando el ebook
como fuente principal, sin depender del campus, de los videos ni de recursos
externos para comprender los conceptos.

El ebook no incluirá actividades evaluativas ni consignas de entrega en esta
etapa. Puede incluir preguntas de reflexión, comprobaciones de comprensión y
autoevaluaciones no calificadas.

## 2. Audiencia y tono

Los estudiantes llegan con conocimientos intermedios de Java: programación
orientada a objetos, colecciones, excepciones y lectura de código. No se
presupondrán conocimientos previos de concurrencia, IPC, sincronización,
paralelismo ni HPC.

El tono será académico, cercano y didáctico:

- Preciso en definiciones, terminología y modelos.
- Claro al introducir conceptos complejos.
- Apoyado en analogías que no sustituyan la explicación técnica.
- Progresivo: de la intuición al modelo formal y de este a la aplicación.
- Orientado a estudiantes de programación y a situaciones profesionales.

No habrá un límite de páginas por módulo. La profundidad y la claridad tendrán
prioridad sobre la brevedad.

## 3. Alcance

El alcance se regirá por el programa formal de la asignatura. Los temas
enumerados en el programa constituyen el **piso curricular obligatorio**, no una
lista cerrada ni un resumen suficiente para redactar el ebook. Cada tema
principal deberá desplegarse en todos los conceptos previos, subtemas, modelos,
ejemplos, comparaciones y explicaciones necesarios para que pueda comprenderse
con profundidad y en relación con el resto de la materia.

### 3.1 Propósito formativo

La asignatura se sitúa en el cambio del paradigma de comunicación producido por
la digitalización del video, Internet, la conectividad continua y la
convergencia entre medios audiovisuales, telecomunicaciones e informática. El
protocolo IP y las tecnologías de redes funcionan como base tecnológica común
para medios y plataformas que históricamente evolucionaron por separado.

En este contexto, la programación de aplicaciones interactivas forma parte
central de la formación de la Licenciatura. El estudiante debe comprender la
relación entre programación, interfaces, medios, contenidos digitales,
dispositivos y plataformas; participar conceptualmente en la cadena que va
desde la idea hasta la ejecución; y desarrollar criterios para crear soluciones
interactivas innovadoras.

La materia amplía y profundiza aprendizajes de Programación para Ambientes
Interactivos I y II. Su campo profesional comprende aplicaciones y contenidos
interactivos para web, dispositivos móviles y otras plataformas, además de
interfaces gráficas, videojuegos, consolas y realidad virtual como contextos de
aplicación posibles. Estos contextos no se convertirán automáticamente en
módulos independientes: se utilizarán como casos y ejemplos cuando contribuyan
a explicar los contenidos obligatorios del programa.

### 3.2 Objetivos obligatorios

El ebook deberá permitir al estudiante:

1. Conocer el concepto de interactividad y el lenguaje interactivo para
   transferirlos a situaciones prácticas.
2. Conocer el estado del arte de la televisión digital interactiva para situarse
   profesionalmente en el contexto mundial.
3. Revisar modelos de aplicaciones para TV digital en Argentina y el mundo.
4. Aproximarse a los conceptos de interfaz, navegabilidad, usuario y experiencia,
   reconociendo la especificidad de cada uno.
5. Aprender los conceptos de UX, UI y navegabilidad para avanzar hacia los
   contenidos de plataformas interactivas.
6. Desarrollar capacidades para construir programas concurrentes.
7. Desarrollar capacidades para testear y depurar programas concurrentes.
8. Comprender los algoritmos paralelos, sus posibilidades y las limitaciones
   impuestas por las arquitecturas paralelas.

### 3.3 Contenidos mínimos institucionales

Los contenidos mínimos obligatorios son:

- Programación concurrente y paralelismo.
- Procesos hijos y múltiples hilos de ejecución.
- Comunicación y sincronización entre procesos e hilos.
- Algoritmos concurrentes, distribuidos y paralelos.
- Programación paralela.

La especificación y la matriz maestra deberán comprobar de forma explícita dónde
y con qué profundidad se desarrolla cada contenido mínimo.

### 3.4 Contenidos obligatorios por módulo

#### Módulo 1 · La interactividad y la TV digital interactiva

Contenidos formales:

- Interactividad.
- Niveles de interactividad.
- Aplicaciones para TV digital.
- Caso DEVENDRA.
- Interfaces de Netflix, Flow y DIRECTV Play.

El desarrollo incluirá, como subtemas necesarios, el ciclo
acción–procesamiento–feedback, lenguaje interactivo, participación del usuario,
tiempos de respuesta, grados o modelos de interactividad, evolución de la TV
analógica a la digital, estándares y middleware, Ginga, canal de retorno,
modelos argentinos e internacionales, convergencia con streaming y criterios
para comparar plataformas. Las tecnologías históricas o actuales deberán
distinguirse con claridad para no presentar como equivalente lo que pertenece a
etapas diferentes.

#### Módulo 2 · Interfaces, navegabilidad y experiencia del usuario

Contenidos formales:

- Especificidades de las plataformas móvil y PC.
- Experiencia de usuario.
- Navegabilidad e interfaces.
- Maquetación y uso de Moqups.

El desarrollo incluirá, como subtemas necesarios, diferencias entre UI,
interacción y UX; usuario, contexto y modelos mentales; affordances y
significantes; arquitectura de información; jerarquía visual; patrones de
navegación; flujos de usuario; consistencia; feedback; prevención y recuperación
de errores; diseño responsive y adaptación entre móvil y escritorio;
accesibilidad; usabilidad; heurísticas; wireframes, mockups y prototipos; y el
papel de Moqups dentro de un proceso de diseño. Podrán incorporarse otras
herramientas actuales para contextualizar, sin desplazar la herramienta indicada
por el programa.

#### Módulo 3 · Introducción a la programación concurrente

Contenidos formales:

- Introducción a la concurrencia.
- Creación de procesos hijo.
- Programación con múltiples hilos de ejecución.

El desarrollo incluirá, como subtemas necesarios, programa, proceso e hilo;
espacios de memoria y recursos; creación y finalización de procesos; `fork()` y
su semántica en sistemas que lo soportan; ciclo de vida de los hilos; scheduler,
preempción y cambio de contexto; concurrencia frente a paralelismo;
interleavings; estado compartido; atomicidad; condiciones de carrera;
visibilidad de memoria; creación de hilos en Java mediante `Thread`, `Runnable`
y APIs de más alto nivel; excepciones, cancelación, pruebas y depuración básica
de programas concurrentes.

Cuando un concepto del programa dependa de una API propia de otro sistema
operativo —por ejemplo, `fork()`— se explicará el modelo original y luego su
relación o diferencia con Java, sin fingir una equivalencia inexistente.

#### Módulo 4 · Comunicación entre procesos e hilos

Contenidos formales:

- Comunicación entre procesos (IPC).
- Pipes.
- FIFO.
- Colas de mensajes.
- Memoria compartida.

El desarrollo incluirá, como subtemas necesarios, aislamiento y necesidad de
comunicación; paso de mensajes frente a memoria compartida; comunicación
sincrónica y asincrónica; bloqueo y buffering; pipes anónimos; FIFO o named
pipes; colas de mensajes; serialización; memoria compartida y sus riesgos;
productor–consumidor; backpressure; comunicación entre hilos; mecanismos Java
aplicables; sockets como extensión necesaria para procesos remotos; y criterios
de selección según latencia, throughput, persistencia, acoplamiento, seguridad y
complejidad.

#### Módulo 5 · Sincronización entre procesos e hilos

Contenidos formales:

- Particularidades del filesystem.
- Semáforos.
- Mutexes.
- Variables de condición.
- Monitores.

El desarrollo incluirá, como subtemas necesarios, sección crítica, exclusión
mutua, invariantes, atomicidad y orden; mutex y locks; semáforos binarios y
contadores; variables de condición y espera por predicados; monitores;
`synchronized`, `wait`, `notify` y `notifyAll`; `Lock` y `Condition`; visibilidad
y relación con el modelo de memoria de Java; deadlock y condiciones de Coffman;
prevención, evitación y detección; starvation y livelock; problemas clásicos de
sincronización; locks de archivos; operaciones atómicas, TOCTOU, renombrado,
persistencia y otras particularidades relevantes del filesystem.

#### Módulo 6 · Programación en sistemas paralelos

Contenidos formales:

- Clasificación de arquitecturas SISD, SIMD, MISD y MIMD.
- Sistemas multiprocesador de memoria compartida: sincronización y comunicación
  entre procesos.
- Sistemas paralelos de memoria distribuida: sincronización y comunicación
  mediante paso de mensajes.

El desarrollo incluirá, como subtemas necesarios, taxonomía de Flynn;
paralelismo de datos y de tareas; descomposición; granularidad; dependencias;
balanceo de carga; overhead; speedup, eficiencia y escalabilidad; memoria
compartida, cachés, coherencia, UMA y NUMA; memoria distribuida; paso de mensajes
y nociones introductorias de MPI; patrones de programación paralela; pools de
hilos, `ExecutorService`, Fork/Join y streams paralelos en Java; medición y
comparación de versiones secuenciales y paralelas.

#### Módulo 7 · Computación de alta performance

Contenidos formales:

- Algoritmos de alto requerimiento computacional.
- Estudio de performance de algoritmos paralelos.
- Ley de Amdahl.
- Ley de Gustafson–Barsis.

El desarrollo incluirá, como subtemas necesarios, métricas y metodología de
benchmarking; latencia, throughput, speedup, eficiencia, escalabilidad fuerte y
débil; cuellos de botella; fracción serial; costos de comunicación y
sincronización; interpretación, cálculo, supuestos y límites de las leyes de
Amdahl y Gustafson–Barsis; CPU y GPU; clusters; interconexión; almacenamiento;
job scheduling; cloud para cargas de alto rendimiento; y casos de aplicación en
simulación, renderizado, video, inteligencia artificial y experiencias
interactivas. GPU, FPGA, ASIC, clusters y cloud funcionarán como arquitecturas y
contextos para aplicar el análisis de performance, no como sustitutos de los
contenidos formales.

### 3.5 Regla para ampliar el temario

La incorporación de un subtema adicional deberá cumplir al menos una de estas
condiciones:

- Es requisito conceptual para comprender un contenido obligatorio.
- Permite comparar tecnologías o modelos que el programa nombra.
- Corrige una posible confusión o anacronismo.
- Conecta el contenido con una API, herramienta o caso profesional pertinente.
- Es necesario para explicar límites, rendimiento, seguridad o depuración.
- Construye el puente conceptual hacia otro módulo.

La ampliación no deberá transformar el ebook en una colección enciclopédica sin
jerarquía. La matriz maestra distinguirá entre contenido obligatorio,
prerrequisito explicativo, profundización y caso de aplicación.

También incluirá portada, índice general, introducción a la materia y los
elementos editoriales necesarios para recorrer el contenido como una obra
unificada.

Quedan fuera de esta etapa:

- Actividades calificadas.
- Consignas de entrega.
- Rúbricas de evaluación.
- Parciales y proyecto integrador.
- Interacciones indispensables para comprender la teoría.

## 4. Estrategia de producción

Se utilizará un enfoque híbrido:

1. Definir una arquitectura editorial y pedagógica común.
2. Construir una matriz maestra de contenidos y dependencias entre módulos.
3. Perfeccionar los módulos uno por uno, comenzando por el Módulo 1.
4. Cerrar contenido, diseño, fuentes y PDF de cada módulo antes de avanzar.
5. Realizar una revisión transversal al terminar los siete módulos.

Este método permite obtener resultados terminados de forma incremental sin
perder coherencia global.

## 5. Matriz maestra de coherencia

Antes de reescribir los módulos se documentará, para cada uno:

- Conceptos que introduce.
- Conocimientos previos requeridos.
- Conceptos retomados de módulos anteriores.
- Profundidad esperada de cada tema.
- Ejemplos y casos reales necesarios.
- Código Java requerido.
- Diagramas, tablas, gráficos e imágenes necesarios.
- Errores frecuentes que deben explicarse.
- Fuentes académicas u oficiales.
- Conceptos que prepara para el módulo siguiente.

La matriz servirá para detectar vacíos, repeticiones innecesarias, contradicciones
y saltos conceptuales.

## 6. Estructura pedagógica de cada módulo

Cada módulo seguirá este recorrido:

1. **Apertura:** problema, escena o pregunta que otorgue sentido al módulo.
2. **Conexión:** vínculo explícito con los contenidos anteriores.
3. **Propósito y microobjetivos:** entre uno y cuatro, con la forma establecida
   por el documento maestro.
4. **Mapa conceptual:** representación de los temas y sus relaciones.
5. **Desarrollo teórico:** explicación progresiva y detallada.
6. **Analogías:** apoyo inicial para conceptos difíciles, seguido de sus límites.
7. **Ejemplos:** situaciones concretas y casos vinculados con sistemas
   interactivos.
8. **Código Java:** ejemplos completos, ejecutables y explicados cuando el tema
   lo requiera.
9. **Recursos visuales:** diagramas, tablas, gráficos, líneas de tiempo y
   comparaciones.
10. **Errores frecuentes:** confusiones conceptuales, fallos de implementación y
    formas de razonarlos.
11. **Aplicación profesional:** tecnologías, arquitecturas y casos actuales.
12. **Síntesis:** relaciones fundamentales y conclusiones del módulo.
13. **Preguntas de reflexión:** comprobación no calificada.
14. **Glosario:** términos esenciales usados en el módulo.
15. **Videos guiados:** selección curada con indicación de qué observar.
16. **Bibliografía y fuentes:** referencias verificables.
17. **Puente conceptual:** preparación explícita para el módulo siguiente.

La estructura podrá agrupar apartados cuando mejore la lectura, pero ninguno de
los propósitos pedagógicos anteriores debe desaparecer.

## 7. Progresión entre módulos

La continuidad global será:

- Los módulos 1 y 2 construyen la perspectiva de interacción, usuario, interfaz
  y experiencia.
- El Módulo 3 introduce múltiples flujos de ejecución y memoria compartida.
- El Módulo 4 explica cómo esos flujos intercambian información.
- El Módulo 5 aborda cómo coordinarlos correctamente.
- El Módulo 6 transforma esas bases en estrategias de ejecución paralela y
  medición de rendimiento.
- El Módulo 7 escala los conceptos hacia arquitecturas de alto rendimiento,
  GPU, clusters y cloud.

Cada módulo deberá explicar por qué necesita conceptos anteriores y qué problema
del módulo siguiente deja planteado.

## 8. Profundidad mínima de cada tema

Un tema se considerará completo únicamente si responde:

1. Qué es.
2. Qué problema resuelve.
3. Cómo funciona.
4. Por qué importa.
5. Cuándo conviene utilizarlo.
6. Cuáles son sus límites o costos.
7. Con qué conceptos suele confundirse.
8. Cómo se manifiesta en un ejemplo real.
9. Cómo se implementa o representa, cuando corresponda.
10. Cómo se relaciona con el resto de la materia.

No se aceptarán definiciones aisladas, listas sin desarrollo ni videos usados
como sustituto de la explicación.

## 9. Código y ejemplos técnicos

El código Java deberá:

- Corresponder al nivel intermedio de la audiencia.
- Introducir desde cero las APIs específicas de concurrencia y paralelismo.
- Ser suficientemente completo para entender el flujo.
- Explicar decisiones importantes y no solamente la sintaxis.
- Señalar resultados posibles, riesgos y errores frecuentes.
- Utilizar nombres claros y escenarios conectados con sistemas interactivos.
- Evitar fragmentos artificiales cuando un ejemplo ejecutable sea más útil.
- Indicar la versión o familia de Java relevante cuando afecte el comportamiento.

Cuando sea pedagógicamente útil se presentarán versiones incorrecta y corregida,
trazas de ejecución y comparaciones secuencial/concurrente/paralela.

## 10. Dirección visual

La estética combinará:

- Libro académico contemporáneo como base.
- Claridad modular de una guía didáctica.
- Identidad cromática propia para cada módulo.
- Tipografía editorial para lectura extensa.
- Tipografía sans serif para navegación, etiquetas y recursos.
- Bloques de código con estética de IDE.
- Jerarquía visual consistente y espacios que eviten muros de texto.

Los colores de acento existentes se conservarán:

| Módulo | Acento |
|---|---|
| 1 | Dorado `#ffd166` |
| 2 | Violeta `#a855f7` |
| 3 | Teal `#00e8c6` |
| 4 | Violeta eléctrico `#b040ff` |
| 5 | Naranja `#ff7d54` |
| 6 | Azul cielo `#38bdf8` |
| 7 | Lima `#a3e635` |

## 11. Sistema de recursos visuales

Se establecerán componentes visuales reutilizables para:

- Idea clave.
- Definición formal.
- Explicación en lenguaje cotidiano.
- Analogía y límite de la analogía.
- Profundización.
- Error frecuente.
- Caso real.
- Comparación.
- Código.
- Traza de ejecución.
- Pregunta de reflexión.
- Síntesis.
- Bibliografía.

Los gráficos serán didácticos, no decorativos. Cada imagen o figura deberá tener:

- Una función pedagógica identificable.
- Epígrafe explicativo.
- Referencia en el texto.
- Fuente o indicación de elaboración propia.
- Resolución adecuada para impresión.
- Texto alternativo o equivalente textual cuando aporte información esencial.

## 12. Videos y recursos externos

Los videos serán complementarios. Cada recomendación incluirá:

- Título.
- Autor o canal.
- Enlace verificable.
- Duración aproximada.
- Motivo de inclusión.
- Aspectos concretos que el estudiante debe observar.

El PDF mostrará enlaces clicables y códigos QR cuando resulte útil. Ningún video,
simulador o enlace contendrá información indispensable que no esté también
explicada en el ebook.

## 13. Fuentes y bibliografía

Se priorizarán:

- Libros académicos reconocidos.
- Papers y publicaciones técnicas.
- Estándares.
- Documentación oficial de Java y otras tecnologías.
- Organismos oficiales.
- Fuentes institucionales para historia y contexto local.

Las fuentes pueden estar en inglés, pero la explicación del ebook permanecerá en
español. Se evitarán referencias sin autoría clara, páginas de baja confiabilidad
y enlaces no verificados.

Cada módulo tendrá su propia bibliografía. El ebook podrá incluir además una
bibliografía general consolidada.

## 14. Adaptación a HTML y PDF

El HTML será la fuente editorial y deberá producir:

- Un PDF integral.
- Un PDF independiente por módulo.

El diseño se optimizará para A4, lectura digital e impresión:

- Saltos de página controlados.
- Encabezados que no queden aislados al final de una página.
- Figuras, tablas y bloques de código sin cortes ilegibles.
- Márgenes, tamaños tipográficos y contraste adecuados.
- Índice y enlaces navegables cuando el generador lo permita.
- Colores que sigan siendo distinguibles en impresión.
- Sin dependencia de scripts para acceder al contenido.

Los elementos interactivos del campus se reemplazarán en el ebook por diagramas,
capturas, secuencias de estados y explicaciones completas.

## 15. Controles de calidad

Cada tema deberá superar cinco controles:

1. **Exactitud:** respaldo en fuentes confiables.
2. **Profundidad:** explicación completa del concepto y sus implicancias.
3. **Aplicación:** ejemplos concretos y código cuando corresponda.
4. **Comprensión:** analogías, visualizaciones y errores frecuentes.
5. **Continuidad:** conexión con contenidos previos y posteriores.

Cada módulo se revisará además en cuatro dimensiones:

- **Contenido:** cobertura y corrección.
- **Pedagogía:** progresión, claridad y carga cognitiva.
- **Edición:** redacción, terminología y consistencia.
- **Visual/PDF:** jerarquía, legibilidad, cortes y calidad de recursos.

## 16. Verificación

Antes de considerar terminado un módulo se verificará:

- Que cubra todos los temas asignados en la matriz maestra.
- Que no contenga referencias internas rotas o conceptos sin presentar.
- Que los ejemplos y fórmulas sean correctos.
- Que el código compile o tenga una justificación explícita si es pseudocódigo.
- Que enlaces, videos y fuentes sigan disponibles.
- Que todas las imágenes tengan fuente y epígrafe.
- Que el módulo pueda comprenderse sin abrir recursos externos.
- Que el HTML se renderice correctamente.
- Que el PDF no tenga cortes, páginas vacías ni elementos desbordados.
- Que la versión integral y la versión individual coincidan en contenido.

Al finalizar los siete módulos se hará una revisión transversal de terminología,
repeticiones, dependencias, estilo visual y progresión.

## 17. Manejo de problemas durante la producción

Si una fuente o video deja de estar disponible, se reemplazará por otro recurso
verificable sin retirar la explicación autosuficiente.

Si un recurso visual no se imprime correctamente, se preparará una variante
específica para PDF.

Si un tema pertenece razonablemente a dos módulos, se introducirá en el primero
y se profundizará en el segundo, indicando claramente la relación para evitar
duplicación.

Si la profundidad necesaria aumenta la extensión, se priorizará dividir el tema
en subsecciones claras antes que resumirlo de forma insuficiente.

## 18. Criterio de finalización

El proyecto se considerará terminado cuando:

- Los siete módulos cumplan la estructura y los controles definidos.
- El ebook sea autosuficiente y coherente de principio a fin.
- Todos los temas del programa estén desarrollados con profundidad suficiente.
- Las fuentes, videos, imágenes y ejemplos estén verificados.
- El HTML genere correctamente el PDF integral y los siete PDF individuales.
- La revisión transversal no detecte vacíos, contradicciones ni saltos
  conceptuales pendientes.
