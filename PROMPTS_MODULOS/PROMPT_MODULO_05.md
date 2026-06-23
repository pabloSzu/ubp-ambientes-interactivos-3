# Prompt Modulo 05 - Sincronizacion y Deadlock

Actua como docente universitario de concurrencia, sistemas operativos y editor visual premium. Genera materiales completos para el Modulo 5.

Debes entregar 4 documentos separados:

1. CONTENIDO
2. GLOSARIO
3. OBJETIVOS
4. ACTIVIDADES

Reglas:

- CONTENIDO no debe incluir juegos, quizzes ni simuladores. Eso va solo en ACTIVIDADES.
- Desarrollar teoria con profundidad, ejemplos Java, tablas, diagramas y casos cotidianos.
- Primera pagina de cada documento: "Modulo 5 - Sincronizacion y Deadlock" y link: https://ubp-pai-3.vercel.app/Materia_Web/modulos/modulo5.html
- Agregar QR si es posible.

## DOCUMENTO 3: OBJETIVOS DEL MODULO

IMPORTANTE: el documento OBJETIVOS debe construirse con estos objetivos exactos del modulo. No cambiarlos ni reemplazarlos por objetivos inventados; solo puedes explicarlos, maquetarlos o ampliarlos visualmente en el documento final:

1. Reconocer las condiciones de Coffman con el fin de identificar situaciones de interbloqueo antes de que ocurran en produccion.
2. Aplicar estrategias de prevencion, evitacion y deteccion de deadlocks con el fin de garantizar la vivacidad de los procesos concurrentes.
3. Analizar problemas clasicos de sincronizacion (filosofos, productor-consumidor) con el fin de extraer patrones reutilizables para el diseno concurrente.

## GLOSARIO

Desarrollar:

- Sincronizacion
- Seccion critica
- Recurso compartido
- Race condition
- Mutex
- Lock
- Monitor
- synchronized
- Semaphore
- ReentrantLock
- fair lock
- wait()
- notify()
- notifyAll()
- Deadlock
- Starvation
- Livelock
- Condiciones de Coffman
- Exclusion mutua
- Hold and wait
- No preemption
- Circular wait
- tryLock(timeout)
- Backoff aleatorio
- Filosofos comensales

## CONTENIDO

1. Por que sincronizar
   - Memoria compartida y ejecucion intercalada.
   - Datos corruptos, incrementos perdidos y resultados no deterministas.

2. Seccion critica
   - Definicion.
   - Como identificarla.
   - Ejemplos: contador, cuenta bancaria, lista compartida.

3. Herramientas de sincronizacion
   - synchronized.
   - Mutex/Lock.
   - Semaphore.
   - Monitor.
   - wait/notify.
   - ReentrantLock.
   - Tabla comparativa.

4. Mutex y exclusion mutua
   - Solo un hilo entra a la vez.
   - Costo de bloqueo.
   - Buenas practicas: bloquear lo minimo necesario.

5. Semaforos
   - Semaphore(1) vs Semaphore(N).
   - acquire() y release().
   - Control de cupos.
   - Ejemplos cotidianos.

6. Deadlock
   - Definicion.
   - Sistema bloqueado permanentemente.
   - Ejemplo con dos locks en orden inverso.

7. Condiciones de Coffman
   - Exclusion mutua.
   - Hold and wait.
   - No preemption.
   - Circular wait.
   - Tabla con explicacion, ejemplo y como romperla.

8. Starvation y livelock
   - Starvation: sistema avanza, un hilo nunca accede.
   - Livelock: hilos activos pero sin progreso.
   - Diferencias con deadlock.

9. Filosofos comensales
   - Problema clasico.
   - Por que ocurre deadlock si todos toman el tenedor izquierdo.
   - Solucion con Semaphore(N-1).
   - Explicar por que Semaphore(4) funciona con 5 filosofos.

10. Estrategias de prevencion
   - Orden global de locks.
   - Liberar recursos antes de pedir otros.
   - tryLock(timeout).
   - Fair locks.
   - Backoff aleatorio.

11. Java aplicado
   - synchronized.
   - Semaphore.
   - ReentrantLock(true).
   - try/finally para unlock().
   - Codigo correcto e incorrecto.

## ACTIVIDADES

### Actividad principal

Corregir un sistema concurrente defectuoso:

- Dado codigo con locks en orden inverso o contador compartido.
- Identificar patologia: race, deadlock, starvation o livelock.
- Explicar condicion/es de Coffman involucradas.
- Proponer solucion con orden global, Semaphore(4), ReentrantLock(true), tryLock(timeout) o synchronized.
- Justificar por que la solucion funciona.

### Simulador filosofos comensales

Escenario sin semaforo:

- 5 filosofos toman su tenedor izquierdo.
- Cada uno espera el derecho.
- Se cumplen las cuatro condiciones de Coffman.
- Resultado: deadlock.
- Codigo base: synchronized(tenedor[id]) y luego synchronized(tenedor[(id+1)%5]).

Escenario con Semaphore(4):

- Antes de tomar tenedores, cada filosofo ejecuta permiso.acquire().
- Solo 4 de 5 pueden intentar comer al mismo tiempo.
- El quinto espera sin tocar tenedores.
- Siempre queda un hueco para que alguien complete el par de tenedores.
- Al terminar, release() despierta a otro.
- Resultado: progreso garantizado y deadlock imposible.

### Juego Deadlock Doctor

Opciones: DEADLOCK, STARVATION, LIVELOCK, SEGURO.

1. T1 adquiere lockA y espera lockB; T2 adquiere lockB y espera lockA.
   - Respuesta: DEADLOCK.
   - Explicacion: espera circular clasica; solucion: pedir locks en mismo orden.

2. Thread HIGH con prioridad maxima toma el recurso en loop; LOW nunca entra.
   - Respuesta: STARVATION.
   - Explicacion: el sistema avanza, pero LOW nunca accede; usar ReentrantLock(true) o ceder CPU.

3. T1 y T2 se ceden el paso mutuamente, estan activos pero nadie usa el recurso.
   - Respuesta: LIVELOCK.
   - Explicacion: no estan bloqueados, pero sus respuestas se anulan; usar backoff aleatorio.

4. Ambos hilos adquieren locks en el mismo orden A -> B.
   - Respuesta: SEGURO.
   - Explicacion: se rompe espera circular.

5. Ciclo de 3 hilos: T1 tiene A pide B; T2 tiene B pide C; T3 tiene C pide A.
   - Respuesta: DEADLOCK.
   - Explicacion: el ciclo puede tener mas de 2 nodos; usar orden global A -> B -> C.

6. Deadlock en SQL: T1 bloquea fila 1 y espera fila 2; T2 bloquea fila 2 y espera fila 1.
   - Respuesta: DEADLOCK.
   - Explicacion: los deadlocks tambien ocurren en bases de datos; el motor puede abortar una transaccion.

7. ReentrantLock(true) con cola FIFO.
   - Respuesta: SEGURO.
   - Explicacion: fair lock evita starvation; trade-off: menor throughput.

### Simulador race vs mutex

Race:

- T1 y T2 leen el mismo valor.
- Ambos incrementan localmente.
- T1 escribe.
- T2 escribe el mismo valor y se pierde un incremento.

Mutex:

- T1 adquiere lock.
- T2 espera.
- T1 lee, incrementa, escribe y libera.
- T2 adquiere lock y lee el valor actualizado.
- Resultado esperado = resultado actual.

### Quiz

1. ¿Que garantiza synchronized?
   - Correcta: solo un hilo ejecuta el bloque a la vez.

2. Semaphore(3) permite:
   - Correcta: 3 hilos simultaneos.

3. Hold & Wait:
   - Correcta: el hilo retiene recursos adquiridos mientras espera otros.

4. Diferencia entre deadlock y starvation:
   - Correcta: en starvation el sistema avanza, pero un hilo nunca accede; en deadlock los involucrados no progresan.

5. ¿Que hace wait() dentro de synchronized?
   - Correcta: libera el lock y suspende el hilo hasta notify().

6. Livelock:
   - Correcta: hilos activos se responden mutuamente pero no avanzan.

7. ¿Por que Semaphore(4) resuelve filosofos con 5?
   - Correcta: si solo 4 intentan comer, al menos uno puede tomar ambos tenedores.

8. Ventaja de tryLock(timeout):
   - Correcta: permite evitar deadlock soltando locks si no consigue todos a tiempo.
