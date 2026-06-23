# Prompt Modulo 03 - Programacion Concurrente

Actua como docente universitario de programacion concurrente, disenador instruccional y editor visual premium. Genera materiales completos para el Modulo 3.

Debes entregar 4 documentos separados:

1. CONTENIDO
2. GLOSARIO
3. OBJETIVOS
4. ACTIVIDADES

Reglas:

- CONTENIDO no debe incluir quizzes, juegos ni simuladores. Eso va solo en ACTIVIDADES.
- El contenido teorico debe ser profundo, claro, visualmente prolijo y con ejemplos de Java.
- Primera pagina de cada documento: "Modulo 3 - Programacion Concurrente" y link: https://ubp-pai-3.vercel.app/Materia_Web/modulos/modulo3.html
- Agregar QR si es posible.
- Usar diagramas, tablas, codigo comentado, analogias y casos reales.

## DOCUMENTO 3: OBJETIVOS DEL MODULO

IMPORTANTE: el documento OBJETIVOS debe construirse con estos objetivos exactos del modulo. No cambiarlos ni reemplazarlos por objetivos inventados; solo puedes explicarlos, maquetarlos o ampliarlos visualmente en el documento final:

1. Desarrollar capacidades para construir programas concurrentes con el fin de disenar sistemas que ejecuten multiples tareas en simultaneo de forma correcta y eficiente.
2. Desarrollar capacidades para testear y depurar un programa concurrente con el fin de identificar y corregir condiciones de carrera, deadlocks y errores de sincronizacion.

## GLOSARIO

Desarrollar:

- Proceso
- Hilo
- Heap
- Stack
- Scheduler
- Time slice
- Context switch
- Concurrencia
- Paralelismo
- Thread
- Runnable
- start()
- run()
- join()
- Estado NEW
- Estado RUNNABLE
- Estado BLOCKED
- Estado WAITING
- Estado TIMED_WAITING
- Estado TERMINATED
- Race condition
- Operacion atomica
- Read-modify-write
- Seccion critica
- Deadlock
- Starvation
- ExecutorService
- Callable
- Future
- Thread pool
- Debugging concurrente

## CONTENIDO

1. Introduccion a la programacion concurrente
   - Por que los sistemas modernos ejecutan varias tareas.
   - Concurrencia como organizacion de multiples tareas.
   - Paralelismo como ejecucion simultanea real.

2. Proceso vs hilo
   - Proceso: espacio de memoria propio, aislamiento.
   - Hilo: unidad de ejecucion dentro de un proceso.
   - Heap compartido y stack propio.
   - Ventajas y riesgos de compartir memoria.
   - Tabla comparativa.

3. Scheduler y cambio de contexto
   - El SO decide que hilo corre.
   - Time slicing.
   - No determinismo del orden de ejecucion.
   - Consecuencias para debugging.

4. Estados de un hilo en Java
   - NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED.
   - Transiciones entre estados.
   - Diagrama de ciclo de vida.

5. Crear hilos en Java
   - Extender Thread.
   - Implementar Runnable.
   - Diferencia entre start() y run().
   - join() para esperar finalizacion.
   - Ejemplos de codigo.

6. Concurrencia vs paralelismo
   - Un solo core: concurrencia por intercalado.
   - Multiples cores: paralelismo real.
   - Ejemplos: servidor web, render, tareas I/O.

7. Race condition
   - Definicion.
   - Por que counter++ no es atomico.
   - Secuencia read -> add -> write.
   - Incremento perdido.
   - Como detectarlo y prevenirlo.

8. Problemas clasicos
   - Deadlock.
   - Starvation.
   - Missing join.
   - Resultados no deterministas.

9. ExecutorService
   - Por que evitar crear hilos manualmente en produccion.
   - Thread pools.
   - Callable y Future.
   - Control de concurrencia y reutilizacion.

10. Buenas practicas
   - Minimizar estado compartido.
   - Sincronizar secciones criticas.
   - Esperar hilos correctamente.
   - Disenar pruebas repetibles.

## ACTIVIDADES

### Actividad principal

Analizar una race condition en produccion:

- Presentar un contador compartido o cuenta bancaria.
- Explicar por que dos hilos pueden perder actualizaciones.
- Dibujar la secuencia read-modify-write.
- Proponer solucion con sincronizacion.
- Comparar resultado esperado vs resultado real.

### Flash quiz: Concurrente o Paralelo

1. Servidor atiende 500 requests por segundo con un solo core, intercalando tareas rapidamente.
   - Respuesta: Concurrente.
   - Explicacion: un core alterna tareas; no hay ejecucion literalmente simultanea.

2. Render 3D divide imagen en 8 tiles procesados simultaneamente en 8 cores.
   - Respuesta: Paralelo.
   - Explicacion: 8 cores ejecutan trabajo real al mismo tiempo.

3. Java lanza 4 threads en maquina de 1 core; todos progresan, ninguno termina antes que otro.
   - Respuesta: Concurrente.
   - Explicacion: el scheduler intercala; solo un hilo corre por vez.

### Simulador de race condition

Debe describirse como actividad paso a paso:

- T1 y T2 leen el mismo contador.
- Ambos calculan el mismo valor local.
- T1 escribe primero.
- T2 escribe despues el mismo valor y pisa el avance de T1.
- Si T1 y T2 hacen 3 incrementos cada uno, se esperan 6 incrementos, pero el resultado puede quedar en 5.
- Concepto clave: incremento perdido por read-modify-write no atomico.

### Juego Thread Detective

Opciones: Race Condition, Deadlock, Starvation, Missing join(), Concurrencia no Paralelismo.

1. Dos hilos leen counter=5, ambos calculan 6 y escriben 6; se esperaba 7.
   - Respuesta: Race Condition.
   - Pista: read-modify-write no atomico.

2. Thread A tiene lock1 y espera lock2; Thread B tiene lock2 y espera lock1.
   - Respuesta: Deadlock.
   - Pista: espera circular.

3. Cinco hilos compiten, uno tiene siempre mas prioridad y el scheduler lo elige siempre.
   - Respuesta: Starvation.
   - Pista: los de baja prioridad nunca acceden a CPU.

4. main() imprime counter inmediatamente despues de lanzar hilos; siempre imprime 0 en vez de 300.
   - Respuesta: Missing join().
   - Pista: main no espera a los hilos.

5. Cuatro hilos en maquina de 1 core avanzan pero con timing variable.
   - Respuesta: Concurrencia no Paralelismo.
   - Pista: un hilo por vez, intercalado por scheduler.

### Quiz de autoevaluacion

1. ¿Que distingue a un thread de un proceso en Java?
   - Correcta: el thread comparte heap del proceso pero tiene stack propio.

2. ¿Que hace el scheduler del sistema operativo?
   - Correcta: decide que hilo corre en CPU y por cuanto tiempo.

3. ¿Cuando ocurre una race condition?
   - Correcta: dos hilos leen/modifican el mismo dato compartido sin sincronizacion.

4. Programa Java con dos tareas en un solo core:
   - Correcta: concurrente, no paralelo.

5. Problema de read-modify-write sin sincronizacion:
   - Correcta: no es atomico y puede interrumpirse entre READ y WRITE.

6. Hilo intenta entrar a synchronized ocupado por otro hilo. Estado:
   - Correcta: BLOCKED.

7. Estado inicial despues de new Thread():
   - Correcta: NEW.

8. ¿Por que preferir ExecutorService sobre new Thread en produccion?
   - Correcta: reutiliza pool, controla concurrencia y maneja Callable/Future.
