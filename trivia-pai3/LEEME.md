# Trivia PAI3 — Servidor Java Multijugador

> **Proyecto Integrador · PAI3 · Universidad Blas Pascal**
> Un servidor de trivia en tiempo real con race conditions intencionales para encontrar, demostrar y corregir.

---

## ¿Qué es esto?

Un servidor de trivia multijugador construido en Java puro (sin frameworks).
Con un jugador funciona perfecto. Con 10+ jugadores simultáneos… algo se rompe.
**Tu trabajo es descubrir qué, demostrarlo con evidencia y corregirlo.**

---

## Estructura del proyecto

```
trivia-pai3/
├── LEEME.md                          ← estás acá
├── src/
│   └── main/java/pai3/trivia/
│       ├── TriviaServer.java         ← punto de entrada (main)
│       ├── GameState.java            ← estado compartido del juego
│       ├── ScoreBoard.java           ← tabla de puntajes
│       ├── ClientHandler.java        ← un hilo por jugador
│       └── Question.java             ← clase de datos (preguntas)
└── test/
    └── stress_test.py                ← script para reproducir los bugs
```

---

## Paso 1 — Compilar y ejecutar

### Requisitos
- Java 17 o superior (`java --version` para verificar)
- Python 3.8+ para el stress test

### Compilar (una sola vez)
```bash
# Desde la carpeta trivia-pai3/
javac -encoding UTF-8 -d out src/main/java/pai3/trivia/*.java
```

Si ves errores de compilación, verificá que estás en la carpeta correcta.

### Ejecutar el servidor
```bash
java -cp out pai3.trivia.TriviaServer
```

Deberías ver:
```
════════════════════════════════════════════════════════
  TRIVIA PAI3 · Servidor Java multijugador
  Puerto     : 9000
  Capacidad  : hasta 30 jugadores
════════════════════════════════════════════════════════
```

El servidor queda esperando conexiones en el **puerto 9000**.

---

## Paso 2 — Conectar jugadores manualmente

En una **nueva terminal** (sin cerrar la del servidor):

```bash
# Linux o Mac
nc localhost 9000

# Windows
telnet localhost 9000
```

Vas a ver:
```
BIENVENIDO|Trivia PAI3 · Servidor Java multijugador
INGRESA_NOMBRE|Escribí: NOMBRE|<tu nombre>
```

Escribí:
```
NOMBRE|María
```

Abrí otra terminal y conectá otro jugador:
```
NOMBRE|Juan
```

Cualquiera puede iniciar el juego:
```
START
```

Para responder preguntas:
```
RESPUESTA|B
```

---

## Paso 3 — Reproducir la race condition (Etapa 02)

Con 2 jugadores todo anda bien. El bug aparece con carga real.

### Ejecutar el stress test
Mientras el servidor está corriendo, en otra terminal:

```bash
# Test con 10 jugadores simultáneos
python test/stress_test.py

# Test con 20 jugadores
python test/stress_test.py --players 20

# Test con 30 jugadores (máximo estrés)
python test/stress_test.py --players 30
```

### ¿Qué vas a ver cuando hay bug?

```
  PUNTAJES FINALES:
  Jugador              Puntaje Real    Esperado    ¿OK?
  ─────────────────── ────────────  ──────────  ──────
  Bot-00                       500        5000  ✗ BAJO
  Bot-01                      4500        5000  ✓
  Bot-02                         0        5000  ✗ CERO!
  Bot-03                      5000        5000  ✓
  ...

  ⚠  RACE CONDITION DETECTADA: 8 jugadores tienen puntaje inconsistente
```

Capturá este output (screenshot o copiar texto) → es tu **evidencia de la race condition**.

---

## Paso 4 — Entender los bugs (leer el código)

Hay **3 race conditions plantadas** en el código. Están señaladas con comentarios.
Tu trabajo es leerlas, entender por qué ocurren y plantear la corrección.

### Bug #1 — `ScoreBoard.java` · método `addPoints()`

```java
public void addPoints(String player, int points) {
    int current = scores.getOrDefault(player, 0);  // Paso 1: leer
    scores.put(player, current + points);            // Paso 2: escribir
}
```

**El problema:** Entre el Paso 1 y el Paso 2, otro hilo puede leer el mismo valor viejo
y luego sobrescribir el resultado. Dos hilos suman "sobre el mismo puntaje base" y uno
de los dos incrementos se pierde.

**Posibles correcciones:**
- `synchronized` en el método
- `ConcurrentHashMap` + `merge()` o `compute()`
- `AtomicInteger` por jugador

### Bug #2 — `GameState.java` · método `claimFirstAnswer()`

```java
private volatile boolean firstAnswerClaimed = false;

public boolean claimFirstAnswer() {
    if (!firstAnswerClaimed) {      // CHECK  ← dos hilos pueden pasar juntos
        firstAnswerClaimed = true;  // SET    ← ambos escriben true
        return true;                // ambos retornan true → dos "primeros"
    }
    return false;
}
```

**El problema:** `volatile` garantiza visibilidad pero NO atomicidad del patrón check-then-act.
Dos hilos pueden leer `false` simultáneamente antes de que cualquiera escriba `true`.

**Posibles correcciones:**
- `synchronized` en el método
- `AtomicBoolean.compareAndSet(false, true)` — atómico por diseño

### Bug #3 — `TriviaServer.java` · lista de clientes

```java
private final List<ClientHandler> clients = new ArrayList<>();

public void broadcast(String message) {
    for (ClientHandler c : clients) { ... }  // iterando
}

public void removeClient(ClientHandler handler) {
    clients.remove(handler);  // modificando mientras otro itera → excepción
}
```

**El problema:** `ArrayList` no es thread-safe. Si un jugador se desconecta
mientras `broadcast()` itera la lista → `ConcurrentModificationException`.

**Posibles correcciones:**
- `CopyOnWriteArrayList` (ideal para listas que se leen mucho y modifican poco)
- `Collections.synchronizedList(new ArrayList<>())` + bloque `synchronized` al iterar

---

## Paso 5 — Corregir y demostrar la mejora (Etapa 02)

1. Hacé una copia del archivo con el bug:
   ```bash
   cp src/main/java/pai3/trivia/ScoreBoard.java ScoreBoard_ROTO.java
   ```

2. Aplicá la corrección en el archivo original.

3. Recompilá y ejecutá el stress test de nuevo.

4. Comparé los resultados: ¿los puntajes son consistentes ahora?

5. Documentá la diferencia en una tabla:

| Métrica                | Sin sync (roto) | Con sync (correcto) |
|------------------------|-----------------|---------------------|
| Puntaje consistente    | No              | Sí                  |
| Excepciones lanzadas   | A veces         | Nunca               |
| Latencia promedio      | ?ms             | ?ms                 |
| Throughput (resp/seg)  | ?               | ?                   |

---

## Paso 6 — Medir el rendimiento (Etapa 04)

Una vez corregido, medí el impacto de la sincronización:

```bash
# Sin delay (máximo estrés)
python test/stress_test.py --players 30 --delay 0

# Con delay de 50ms (más realista)
python test/stress_test.py --players 30 --delay 0.05
```

Preguntas para responder en el informe:
- ¿Cuánto overhead agrega `synchronized` vs sin sincronización?
- ¿Cuál es el cuello de botella del servidor? (usar el profiler de IntelliJ o añadir timestamps)
- Usando la Ley de Amdahl: si el 20% del código es secuencial (sincronizado), ¿cuál es el speedup máximo con 8 núcleos?

---

## Protocolo completo

Para integrar un cliente propio (parte de la interfaz gráfica, si se animan):

| Dirección         | Formato                                        | Descripción                   |
|-------------------|------------------------------------------------|-------------------------------|
| Cliente → Servidor | `NOMBRE\|<nombre>`                            | Registrarse                   |
| Cliente → Servidor | `START`                                       | Iniciar la partida            |
| Cliente → Servidor | `RESPUESTA\|<A\|B\|C\|D>`                    | Responder pregunta activa     |
| Servidor → Cliente | `BIENVENIDO\|<texto>`                         | Confirmación de conexión      |
| Servidor → Cliente | `OK\|<texto>`                                 | Confirmación de nombre        |
| Servidor → Cliente | `JUGADOR_UNIDO\|<nombre>\|<total> jugadores`  | Nuevo jugador conectado       |
| Servidor → Cliente | `PREGUNTA\|[N/T] <texto>\|A: ...\|B: ...\|C: ...\|D: ...` | Nueva pregunta |
| Servidor → Cliente | `CORRECTO\|<texto con puntos>`                | Respuesta correcta            |
| Servidor → Cliente | `INCORRECTO\|<texto>`                         | Respuesta incorrecta          |
| Servidor → Cliente | `PUNTAJES\|<n1>:<p1>\|<n2>:<p2>...`          | Estado del scoreboard         |
| Servidor → Cliente | `NUEVA_RONDA\|<texto>`                        | Transición entre rondas       |
| Servidor → Cliente | `FIN_JUEGO\|<texto con ganador>`              | Fin del juego                 |
| Servidor → Cliente | `ERROR\|<descripción>`                        | Error de protocolo            |

---

## Conceptos de la materia aplicados

| Módulo | Concepto | Dónde se ve en el código |
|--------|----------|--------------------------|
| **M3** | Hilos, race condition, scheduler | `ClientHandler` + race en `ScoreBoard` |
| **M4** | IPC, comunicación entre procesos | Protocolo TCP sobre sockets |
| **M5** | Mutex, synchronized, AtomicBoolean | Bugs #1 y #2 a corregir |
| **M6** | Paralelismo, streams paralelos | Cálculo del ranking en `TriviaServer` |
| **M7** | Ley de Amdahl, benchmark, speedup | Medición before/after del fix |

---

## FAQ

**¿Por qué Java puro y no Spring Boot?**
Para que el código sea legible y el threading sea visible. Con Spring Boot
la concurrencia está oculta en el framework — acá la ven directamente.

**¿Puedo agregar una interfaz gráfica?**
Sí, el protocolo es texto plano sobre TCP. Podés hacer un cliente con Swing,
JavaFX, o incluso una página web con WebSocket. Bonus points.

**¿Puedo usar IA para ayudarme?**
Sí. Pero en la presentación te preguntamos por cualquier línea del código.
Asegurate de entender todo lo que entregás.

**¿El stress test no muestra el bug?**
El bug es no-determinístico por naturaleza (así son las race conditions).
Probá con más jugadores (`--players 30`) y sin delay (`--delay 0`).
En máquinas multicore el bug aparece más seguido.

---

*Trivia PAI3 — Proyecto Integrador · UBP · 2026*
