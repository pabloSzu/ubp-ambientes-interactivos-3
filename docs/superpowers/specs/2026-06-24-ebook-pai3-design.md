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

El ebook cubrirá los siete módulos:

1. Interactividad y TV Digital.
2. Interfaces, Navegabilidad y UX.
3. Programación Concurrente.
4. Comunicación entre Procesos e Hilos.
5. Sincronización y Deadlock.
6. Paralelismo.
7. HPC, GPU y Cloud.

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

