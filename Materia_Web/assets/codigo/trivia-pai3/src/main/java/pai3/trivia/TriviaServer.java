package pai3.trivia;

import java.io.*;
import java.net.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  TRIVIA PAI3 — Servidor de trivia multijugador en tiempo real
 *  Proyecto Integrador · PAI3 · Universidad Blas Pascal
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  ARQUITECTURA: Thread-per-client
 *    → Un hilo nuevo por cada jugador que se conecta.
 *    → Todos los hilos comparten un GameState y un ScoreBoard.
 *    → Con pocos jugadores funciona bien. Con 10+ empiezan los problemas.
 *
 *  CÓMO COMPILAR Y EJECUTAR:
 *
 *    1. Compilar (desde la carpeta trivia-pai3/):
 *       javac -d out src/main/java/pai3/trivia/*.java
 *
 *    2. Ejecutar el servidor:
 *       java -cp out pai3.trivia.TriviaServer
 *
 *    3. Conectar un jugador (nueva terminal):
 *       nc localhost 9000          (Linux/Mac)
 *       telnet localhost 9000      (Windows)
 *
 *    4. Stress test (ver si se rompe con 20 jugadores):
 *       python test/stress_test.py
 *
 *  PROTOCOLO (ver ClientHandler.java para detalle completo):
 *    NOMBRE|<nombre>     → registrarse
 *    START               → iniciar partida
 *    RESPUESTA|<A/B/C/D> → responder pregunta activa
 *
 * ════════════════════════════════════════════════════════════════════════════
 */
public class TriviaServer {

    private static final int PORT        = 9000;
    private static final int MAX_PLAYERS = 30;

    // Lista de clientes conectados.
    // ArrayList NO es thread-safe. Con múltiples hilos llamando a
    // removeClient() y add() simultáneamente puede lanzar ConcurrentModificationException.
    // Alternativa correcta: CopyOnWriteArrayList o Collections.synchronizedList()
    private final List<ClientHandler> clients = new ArrayList<>();

    private final GameState  gameState;
    private final ScoreBoard scoreBoard;

    public TriviaServer() {
        this.scoreBoard = new ScoreBoard();
        this.gameState  = new GameState(buildQuestions());
    }

    // ─── Arranque ─────────────────────────────────────────────────────────

    public void start() throws IOException {
        printBanner();

        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            serverSocket.setReuseAddress(true);

            while (true) {
                Socket clientSocket = serverSocket.accept();
                String clientAddr = clientSocket.getInetAddress().getHostAddress();
                System.out.println("[SERVIDOR] Nueva conexión desde " + clientAddr);

                if (clients.size() >= MAX_PLAYERS) {
                    try (PrintWriter pw = new PrintWriter(clientSocket.getOutputStream(), true)) {
                        pw.println("ERROR|Servidor lleno (" + MAX_PLAYERS + " jugadores máximo)");
                    }
                    clientSocket.close();
                    continue;
                }

                ClientHandler handler = new ClientHandler(clientSocket, gameState, scoreBoard, this);

                // BUG: clients.add() desde el hilo principal mientras broadcast()
                // itera sobre la lista desde otros hilos → puede corromper la lista
                clients.add(handler);

                Thread t = new Thread(handler);
                t.setName("Jugador-" + clients.size());
                t.setDaemon(true);
                t.start();
            }
        }
    }

    // ─── Mensajes hacia clientes ───────────────────────────────────────────

    /**
     * Envía un mensaje a todos los jugadores conectados.
     *
     * BUG: iteramos sobre clients (ArrayList) sin sincronización.
     * Si removeClient() se llama desde otro hilo durante esta iteración
     * → ConcurrentModificationException en escenarios de alta concurrencia.
     */
    public void broadcast(String message) {
        for (ClientHandler c : clients) {
            c.send(message);
        }
    }

    /** Broadcast de una pregunta con formato legible. */
    public void broadcastQuestion(Question q, int current, int total) {
        String msg = String.format(
            "PREGUNTA|[%d/%d] %s|A: %s|B: %s|C: %s|D: %s",
            current, total, q.text, q.optA, q.optB, q.optC, q.optD
        );
        broadcast(msg);

        String preview = q.text.length() > 60 ? q.text.substring(0, 60) + "..." : q.text;
        System.out.printf("[SERVIDOR] Pregunta %d/%d: %s%n", current, total, preview);
    }

    /** Broadcast del scoreboard actual. */
    public void broadcastScores(ScoreBoard board) {
        StringBuilder sb = new StringBuilder("PUNTAJES");
        Map<String, Integer> snapshot = board.getSnapshot();

        // Ordenamos por puntaje descendente para que el leaderboard tenga sentido
        snapshot.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .forEach(e -> sb.append("|").append(e.getKey()).append(":").append(e.getValue()));

        broadcast(sb.toString());
    }

    /** Broadcast del resultado final. */
    public void broadcastGameOver(ScoreBoard board) {
        Map<String, Integer> scores = board.getSnapshot();

        String winner = scores.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("Nadie");

        int winScore = scores.getOrDefault(winner, 0);

        String msg = "FIN_JUEGO|¡Fin del juego! Ganador: " + winner + " con " + winScore + " puntos";
        broadcast(msg);

        // Imprime tabla final en consola del servidor
        System.out.println("\n══════════ RESULTADO FINAL ══════════");
        scores.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .forEach(e -> System.out.printf("  %-20s %5d pts%n", e.getKey(), e.getValue()));
        System.out.println("═════════════════════════════════════\n");
    }

    /** Remueve un cliente de la lista cuando se desconecta. */
    public void removeClient(ClientHandler handler) {
        // BUG: remove() desde el hilo del cliente que se desconecta,
        // mientras broadcast() puede estar iterando desde otro hilo.
        clients.remove(handler);
    }

    // ─── Preguntas del juego ──────────────────────────────────────────────

    private List<Question> buildQuestions() {
        return List.of(
            new Question(
                "¿Cuántas condiciones de Coffman son necesarias para que ocurra un deadlock?",
                "2 condiciones",
                "4 condiciones",
                "3 condiciones",
                "1 sola condición",
                'B'
            ),
            new Question(
                "¿Cuál es la diferencia principal entre un PROCESO y un HILO?",
                "Los procesos son más rápidos que los hilos",
                "Los hilos comparten la memoria del proceso que los creó",
                "Los procesos no tienen estado propio",
                "Los hilos no pueden comunicarse entre sí",
                'B'
            ),
            new Question(
                "¿Qué significa que una operación sea ATÓMICA?",
                "Que usa memoria RAM muy rápida",
                "Que solo puede ejecutarla el hilo principal",
                "Que se ejecuta completa sin interrupción — no hay estado intermedio visible",
                "Que necesita un semáforo para funcionar",
                'C'
            ),
            new Question(
                "La Ley de Amdahl dice que el speedup máximo está limitado por...",
                "La cantidad de núcleos del CPU",
                "El porcentaje del código que NO puede ejecutarse en paralelo",
                "La velocidad del disco rígido del servidor",
                "El garbage collector de Java",
                'B'
            ),
            new Question(
                "¿Qué es una Race Condition?",
                "Una competencia entre procesadores para acceder a la RAM",
                "Un bug que solo aparece en código C++, no en Java",
                "Cuando el resultado de un programa depende del orden en que los hilos ejecutan sus instrucciones",
                "Un tipo especial de semáforo binario",
                'C'
            ),
            new Question(
                "¿Qué hace la palabra clave synchronized en Java?",
                "Acelera la ejecución del bloque de código sincronizado",
                "Garantiza que solo UN hilo a la vez puede ejecutar ese bloque de código",
                "Sincroniza el reloj del sistema con el servidor NTP",
                "Solo funciona en métodos estáticos",
                'B'
            ),
            new Question(
                "¿Por qué AtomicInteger es mejor que int++ en código concurrente?",
                "AtomicInteger siempre es más rápido",
                "AtomicInteger usa menos memoria que int",
                "El incremento de AtomicInteger es una operación atómica — no puede dividirse entre dos hilos",
                "int++ no funciona dentro de hilos",
                'C'
            ),
            new Question(
                "En la taxonomía de Flynn, ¿qué significa MIMD?",
                "Multiple Input, Multiple Display",
                "Memory Interface and Module Design",
                "Multiple Instruction, Multiple Data — múltiples procesadores con distintas instrucciones sobre distintos datos",
                "Main Instruction, Main Data",
                'C'
            ),
            new Question(
                "¿Cuál es la diferencia entre IPC y comunicación entre hilos?",
                "No hay diferencia práctica",
                "IPC cruza límites de procesos (más costoso); los hilos comparten memoria directamente (más rápido)",
                "IPC solo funciona en sistemas operativos Linux",
                "Los hilos no pueden comunicarse directamente",
                'B'
            ),
            new Question(
                "volatile en Java garantiza visibilidad entre hilos, pero NO garantiza...",
                "Que la variable se inicialice en cero",
                "Que la variable sea accesible desde subclases",
                "Atomicidad del patrón check-then-act (leer + evaluar + escribir)",
                "Que la variable tenga un valor por defecto",
                'C'
            )
        );
    }

    // ─── Banner de inicio ─────────────────────────────────────────────────

    private void printBanner() {
        System.out.println("""
            ════════════════════════════════════════════════════════
              TRIVIA PAI3 · Servidor Java multijugador
              Proyecto Integrador · Universidad Blas Pascal
            ════════════════════════════════════════════════════════
              Puerto     : %d
              Capacidad  : hasta %d jugadores
              Preguntas  : %d
            ────────────────────────────────────────────────────────
              Para conectar un jugador:
                Linux/Mac: nc localhost %d
                Windows  : telnet localhost %d
              Para stress test:
                python test/stress_test.py
            ════════════════════════════════════════════════════════
            """.formatted(PORT, MAX_PLAYERS, buildQuestions().size(), PORT, PORT));
    }

    // ─── main ─────────────────────────────────────────────────────────────

    public static void main(String[] args) throws IOException {
        new TriviaServer().start();
    }
}
