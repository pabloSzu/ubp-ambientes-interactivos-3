# Prompt Modulo 04 - Comunicacion IPC

Actua como docente universitario de sistemas operativos, Java concurrente y editor visual premium. Genera materiales completos para el Modulo 4.

Debes entregar 4 documentos separados:

1. CONTENIDO
2. GLOSARIO
3. OBJETIVOS
4. ACTIVIDADES

Reglas:

- CONTENIDO no debe incluir juegos, quizzes ni simuladores; eso va solo en ACTIVIDADES.
- El contenido debe ser teorico, profundo y visualmente prolijo.
- Incluir tablas comparativas, diagramas de productor-consumidor, ejemplos de Java y casos reales.
- Primera pagina de cada documento: "Modulo 4 - Comunicacion IPC" y link: https://ubp-pai-3.vercel.app/Materia_Web/modulos/modulo4.html
- Agrega QR si puedes.

## DOCUMENTO 3: OBJETIVOS DEL MODULO

IMPORTANTE: el documento OBJETIVOS debe construirse con estos objetivos exactos del modulo. No cambiarlos ni reemplazarlos por objetivos inventados; solo puedes explicarlos, maquetarlos o ampliarlos visualmente en el documento final:

1. Identificar los mecanismos de comunicacion entre procesos con el fin de seleccionar el mas adecuado para cada escenario de diseno concurrente.
2. Implementar pipes, sockets y colas de mensajes en Java con el fin de resolver problemas de comunicacion en sistemas multiproceso.
3. Evaluar el rendimiento y la seguridad de distintos mecanismos IPC con el fin de tomar decisiones fundamentadas en el diseno de sistemas distribuidos.

## GLOSARIO

Desarrollar:

- IPC
- Proceso
- Espacio de memoria aislado
- Pipe
- Pipe anonimo
- FIFO / named pipe
- Cola de mensajes
- Memoria compartida
- Buffer
- Productor
- Consumidor
- BlockingQueue
- LinkedBlockingQueue
- put()
- take()
- Backpressure
- Bloqueo
- Persistencia
- Desacoplamiento
- Latencia
- Throughput
- Sincronizacion
- Mutex
- Semaforo
- Polling
- Worker thread

## CONTENIDO

1. Por que existe IPC
   - Procesos aislados y memoria virtual.
   - Necesidad de intercambiar datos.
   - Seguridad vs comunicacion.

2. Mapa de mecanismos IPC
   - Pipe.
   - FIFO.
   - Cola de mensajes.
   - Memoria compartida.
   - BlockingQueue como mecanismo intra-proceso en Java.
   - Tabla: direccion, persistencia, relacion entre procesos, velocidad, complejidad.

3. Pipes
   - Unidireccionales.
   - Uso tipico padre-hijo.
   - Ejemplos conceptuales.
   - Limitaciones.

4. FIFO / Named pipe
   - Nombre en filesystem.
   - Comunicacion entre procesos no relacionados.
   - Cuando conviene.

5. Colas de mensajes
   - Comunicacion asincrona.
   - Persistencia.
   - Desacoplamiento.
   - Casos: ecommerce, pagos, notificaciones.

6. Memoria compartida
   - Acceso al mismo segmento de RAM.
   - Sin copia de datos.
   - Alta velocidad y baja latencia.
   - Necesidad de sincronizacion manual.
   - Riesgos de race conditions.

7. Productor-consumidor
   - Productor genera items.
   - Consumidor procesa.
   - Buffer limitado.
   - Queue llena y queue vacia.
   - Backpressure.

8. BlockingQueue en Java
   - LinkedBlockingQueue.
   - put() bloquea si esta llena.
   - take() bloquea si esta vacia.
   - Evita polling y consumo inutil de CPU.
   - Ejemplo con productor y workers.

9. Criterios de eleccion
   - Si hay relacion padre-hijo.
   - Si los procesos no estan relacionados.
   - Si se necesita persistencia.
   - Si la latencia es critica.
   - Si se trabaja dentro de un mismo proceso Java.

10. Cierre integrador
   - IPC como equilibrio entre aislamiento, velocidad, persistencia y complejidad.

## ACTIVIDADES

### Actividad principal

Disenar un pipeline productor-consumidor de 3 etapas usando BlockingQueue:

- Etapa 1 produce datos.
- Etapa 2 transforma.
- Etapa 3 consume o guarda.
- Definir capacidad de cada queue.
- Explicar que pasa si una etapa es mas lenta.
- Mostrar codigo Java con LinkedBlockingQueue.
- Identificar backpressure.

### Flash quiz Productor-Consumidor

1. Productor genera 1 item/seg, consumidor procesa 1 item/seg, queue de 5 slots.
   - Respuesta: Equilibrio; la queue se mantiene estable.
   - Explicacion: P = C, no crece indefinidamente ni se vacia.

2. Productor genera 3 items/seg, consumidor procesa 1 item/seg, queue de 5 slots.
   - Respuesta: Productor mas rapido; queue se llena y productor se bloquea.
   - Explicacion: P > C, put() bloquea cuando no hay espacio.

3. Productor genera 1 item/seg, consumidor procesa 3 items/seg, queue de 5 slots.
   - Respuesta: Consumidor mas rapido; queue se vacia y consumidor se bloquea.
   - Explicacion: P < C, take() bloquea hasta que haya item.

### Simulador BlockingQueue

Describir:

- Queue con capacidad maxima 8.
- Estados: productor produciendo, consumidor consumiendo, bloqueado e inactivo.
- Escenario "fast-prod": productor 400 ms, consumidor 1600 ms; la queue se llena y put() bloquea.
- Escenario "balanced": productor 800 ms, consumidor 800 ms; sistema equilibrado.
- Escenario "fast-cons": productor 1600 ms, consumidor 350 ms; queue se vacia y take() bloquea.
- Estadisticas: producidos, consumidos, productor bloqueado, consumidor bloqueado.

### Juego El Courier IPC

Opciones: Pipe, FIFO (Named Pipe), Cola de mensajes, Memoria compartida, BlockingQueue (Java).

1. Programa en C crea proceso hijo con fork(); padre genera numeros e hijo los suma.
   - Correcta: Pipe.
   - Pista: comunicacion padre-hijo, unidireccional y rapida.

2. Logger y app web independientes en el mismo Linux intercambian texto, sin relacion padre-hijo.
   - Correcta: FIFO (Named Pipe).
   - Pista: tiene nombre en filesystem y puede abrirlo cualquier proceso.

3. Ecommerce recibe pedidos a rafagas; procesador de pagos mas lento; si cae, no deben perderse pedidos.
   - Correcta: Cola de mensajes.
   - Pista: persistente, asincrona y desacoplada.

4. Motor de fisica genera vectores de 4096 floats a 120fps; renderizador lee inmediatamente; latencia maxima 0.5 ms.
   - Correcta: Memoria compartida.
   - Pista: sin copia de datos; menor latencia.

5. En Java, un hilo genera tareas de red y 4 workers las procesan; si no hay tareas, esperan sin consumir CPU.
   - Correcta: BlockingQueue (Java).
   - Pista: take() bloquea workers, put() despierta.

### Quiz

1. ¿Por que los procesos necesitan IPC?
   - Correcta: porque cada proceso tiene su propio espacio de memoria aislado.

2. Caracteristica fundamental de un pipe:
   - Correcta: unidireccional y opera entre procesos relacionados.

3. Diferencia entre FIFO y pipe anonimo:
   - Correcta: FIFO tiene nombre en filesystem y permite procesos no relacionados.

4. ¿Que hace BlockingQueue.put() cuando la queue esta llena?
   - Correcta: bloquea el hilo productor hasta que haya espacio.

5. Productor mas rapido que consumidor:
   - Correcta: queue se llena hasta bloquear productor o perder trabajo.

6. Ventaja principal de memoria compartida:
   - Correcta: no hay copia de datos, ambos procesos acceden al mismo segmento RAM.

7. ¿Para que sirve LinkedBlockingQueue?
   - Correcta: BlockingQueue con capacidad opcional que bloquea en put()/take().

8. ¿Por que una cola de mensajes es mejor que memoria compartida para ecommerce?
   - Correcta: persiste pedidos aunque el consumidor caiga y desacopla productor-consumidor.
