# Prompt Modulo 06 - Paralelismo

Actua como docente universitario de algoritmos paralelos, Java y editor visual premium. Genera materiales completos para el Modulo 6.

Debes entregar 4 documentos separados:

1. CONTENIDO
2. GLOSARIO
3. OBJETIVOS
4. ACTIVIDADES

Reglas:

- CONTENIDO no incluye juegos, quizzes ni simuladores. Eso va solo en ACTIVIDADES.
- El contenido debe ser teorico, completo, visualmente excelente y con ejemplos de Java.
- Primera pagina de cada documento: "Modulo 6 - Paralelismo" y link: https://ubp-pai-3.vercel.app/Materia_Web/modulos/modulo6.html
- Agregar QR si es posible.

## DOCUMENTO 3: OBJETIVOS DEL MODULO

IMPORTANTE: el documento OBJETIVOS debe construirse con estos objetivos exactos del modulo. No cambiarlos ni reemplazarlos por objetivos inventados; solo puedes explicarlos, maquetarlos o ampliarlos visualmente en el documento final:

1. Comprender los algoritmos paralelos para conocer las posibilidades y limitaciones que ofrecen las arquitecturas paralelas a la programacion.
2. Aplicar la Ley de Amdahl y la taxonomia de Flynn con el fin de clasificar arquitecturas y tomar decisiones fundadas sobre cuando y como paralelizar.
3. Implementar soluciones paralelas con Fork/Join y Parallel Streams con el fin de aprovechar el hardware multinucleo en aplicaciones reales.

## GLOSARIO

Desarrollar:

- Paralelismo
- Concurrencia
- Core
- Worker
- Speedup
- Eficiencia
- Overhead
- Parte serial
- Parte paralelizable
- Ley de Amdahl
- Flynn
- SISD
- SIMD
- MISD
- MIMD
- Fork/Join
- RecursiveTask
- RecursiveAction
- Work stealing
- Parallel Stream
- Reduccion
- Embarrassingly parallel
- Throughput
- Latencia
- Memoria compartida
- Memoria distribuida

## CONTENIDO

1. Introduccion al paralelismo
   - Paralelismo como ejecucion simultanea real.
   - Diferencia con concurrencia.
   - Por que el hardware multinucleo cambia el diseno de software.

2. Tipos de paralelismo
   - Paralelismo de datos.
   - Paralelismo de tareas.
   - Pipeline.
   - Reducciones.
   - Casos ideales y casos problematicos.

3. Taxonomia de Flynn
   - SISD, SIMD, MISD, MIMD.
   - Ejemplos: CPU clasica, GPU, clusters, pipelines redundantes.
   - Tabla comparativa.

4. Ley de Amdahl
   - Formula S(N) = 1 / ((1-P) + P/N).
   - P como fraccion paralelizable.
   - N como cantidad de cores.
   - Techo maximo 1/(1-P).
   - Rendimientos decrecientes.
   - Ejemplos numericos.

5. Speedup y eficiencia
   - Speedup = tiempo secuencial / tiempo paralelo.
   - Eficiencia = speedup / N.
   - Interpretar resultados.
   - Por que speedup ideal rara vez se alcanza.

6. Overhead
   - Creacion de threads.
   - Sincronizacion.
   - Context switch.
   - Comunicacion y combinacion de resultados.
   - Granularidad.

7. Memoria compartida vs distribuida
   - Multicore local.
   - Cluster.
   - Costos de comunicacion.
   - Cuando conviene cada una.

8. Fork/Join en Java
   - Divide and conquer.
   - RecursiveTask<V> y RecursiveAction.
   - UMBRAL para evitar overhead.
   - Work stealing.
   - Ejemplo de suma, maximo o merge sort.

9. Parallel Streams
   - Ventajas y riesgos.
   - Operaciones stateless.
   - Reducciones seguras.
   - Cuando no usarlos.

10. Casos reales
   - Redimensionar imagenes.
   - Encoding de video.
   - Render 3D.
   - Validacion bancaria.
   - Busqueda de maximo.

## ACTIVIDADES

### Actividad principal

Benchmark paralelo:

- Elegir una tarea paralelizable: maximo de array, redimensionar imagenes, conteo de palabras o render.
- Medir tiempo secuencial y paralelo con 1, 2, 4, 8 cores.
- Calcular speedup y eficiencia.
- Comparar contra Amdahl.
- Explicar overhead observado.

### Simulador Ley de Amdahl

Escenarios:

1. Redimensionar 10M de fotos.
   - P = 75%, N inicial = 2.
   - Descripcion: cada imagen es independiente, casi ideal.

2. Encodear video a 15 resoluciones.
   - P = 92%, N inicial = 3.
   - Descripcion: cada frame/tarea independiente, caso muy favorable.

3. Validar transacciones bancarias.
   - P = 25%, N inicial = 2.
   - Descripcion: reglas de negocio con orden estricto.

4. Merge sort con 1M elementos.
   - P = 65%, N inicial = 3.
   - Descripcion: chunks paralelos pero merge final serial.

Formula: S(N) = 1 / ((1-P) + P/N). Incluir grafico de curva, linea ideal, maximo teorico, timeline serial/paralelo y eficiencia.

### Juego: ¿Paralelizar o no?

Opciones: SI / NO.

1. Galeria de 10 millones de fotos; cada foto independiente.
   - Respuesta: SI.
   - Explicacion: caso embarrassingly parallel; speedup casi lineal.

2. Ordenar una lista de 8 nombres.
   - Respuesta: NO.
   - Explicacion: trabajo minimo; overhead supera beneficio.

3. Fibonacci iterativo F[i] = F[i-1] + F[i-2] para 1000 terminos.
   - Respuesta: NO.
   - Explicacion: dependencia secuencial estricta salvo redisenar algoritmo.

4. 500 frames de video independientes.
   - Respuesta: SI.
   - Explicacion: cada frame es unidad independiente.

5. Debitar saldo de cuenta bancaria.
   - Respuesta: NO.
   - Explicacion: operacion atomica con consistencia estricta; debe serializarse.

6. Buscar maximo en 100 millones de numeros.
   - Respuesta: SI.
   - Explicacion: dividir en chunks, maximos locales y reduccion final.

### Comparador secuencial vs paralelo

Usar tareas:

- Frame A: 6 unidades.
- Frame B: 4 unidades.
- Frame C: 8 unidades.
- Frame D: 3 unidades.
- Frame E: 7 unidades.
- Frame F: 5 unidades.
- Frame G: 6 unidades.
- Frame H: 4 unidades.

Mostrar ejecucion secuencial contra paralela con 2, 4 y 8 workers. Calcular speedup.

### Simulador encoding de video

Frames:

- F01 I 3 ticks
- F02 P 1 tick
- F03 P 1 tick
- F04 B 2 ticks
- F05 P 1 tick
- F06 I 3 ticks
- F07 P 1 tick
- F08 B 2 ticks
- F09 P 1 tick
- F10 I 3 ticks
- F11 P 1 tick
- F12 B 2 ticks

Comparar modo secuencial vs paralelo con workers.

### Quiz

1. ¿Que predice la Ley de Amdahl?
   - Correcta: speedup maximo teorico al paralelizar una fraccion P del codigo.

2. Programa con 80% paralelizable. Speedup maximo con cores ilimitados:
   - Correcta: x5.0.

3. En Flynn, SIMD:
   - Correcta: misma instruccion aplicada simultaneamente a multiples datos.

4. Clase Java para ForkJoin que retorna resultado:
   - Correcta: RecursiveTask<V>.

5. ¿Cuando el paralelismo puede empeorar rendimiento?
   - Correcta: cuando overhead de crear/sincronizar threads supera beneficio.

6. P = 50%, N = 4. Speedup Amdahl:
   - Correcta: x1.6.

7. Tipo de paralelismo de GPU procesando pixeles:
   - Correcta: SIMD.

8. Eficiencia:
   - Correcta: Speedup / N, fraccion real de cores aprovechada.
