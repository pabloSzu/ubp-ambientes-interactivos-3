package pai3.trivia;

import java.io.*;
import java.net.Socket;

/**
 * ─────────────────────────────────────────────────────────────────────────
 * MANEJADOR DE CLIENTE — ClientHandler
 *
 * Una instancia de esta clase se crea por cada jugador conectado.
 * Cada instancia corre en su propio Thread (arquitectura thread-per-client).
 *
 * Con 20 jugadores → 20 instancias de ClientHandler corriendo en paralelo,
 * todas compartiendo el mismo GameState y ScoreBoard.
 *
 * PROTOCOLO (texto plano sobre TCP, una línea por mensaje):
 *
 *   Cliente → Servidor:
 *     NOMBRE|<nombre>          → registra el jugador
 *     START                    → arranca el juego (cualquier jugador puede iniciar)
 *     RESPUESTA|<A|B|C|D>      → envía una respuesta a la pregunta activa
 *
 *   Servidor → Cliente:
 *     BIENVENIDO|<texto>        → confirmación de conexión
 *     INGRESA_NOMBRE|<texto>    → prompt inicial
 *     OK|<texto>                → confirmación de nombre
 *     JUGADOR_UNIDO|<nombre>|<total> → broadcast cuando alguien se une
 *     PREGUNTA|<texto>|A:...|B:...|C:...|D:...  → nueva pregunta
 *     CORRECTO|<texto>          → respuesta correcta con puntos
 *     INCORRECTO|<texto>        → respuesta incorrecta
 *     PUNTAJES|<n1>:<p1>|<n2>:<p2>...  → estado actual del scoreboard
 *     NUEVA_RONDA|<texto>       → entre rondas
 *     FIN_JUEGO|<texto>         → fin del juego con ganador
 *     ERROR|<texto>             → mensaje de error
 * ─────────────────────────────────────────────────────────────────────────
 */
public class ClientHandler implements Runnable {

    private final Socket socket;
    private final GameState gameState;
    private final ScoreBoard scoreBoard;
    private final TriviaServer server;

    private PrintWriter out;
    private String playerName = "Desconocido";
    private boolean registered = false;

    public ClientHandler(Socket socket, GameState gameState, ScoreBoard scoreBoard, TriviaServer server) {
        this.socket     = socket;
        this.gameState  = gameState;
        this.scoreBoard = scoreBoard;
        this.server     = server;
    }

    @Override
    public void run() {
        System.out.println("[HILO] " + Thread.currentThread().getName() + " iniciado para nueva conexión");

        try (
            BufferedReader in  = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter writer = new PrintWriter(socket.getOutputStream(), true)
        ) {
            this.out = writer;

            send("BIENVENIDO|Trivia PAI3 · Servidor Java multijugador");
            send("INGRESA_NOMBRE|Escribí: NOMBRE|<tu nombre>");

            String line;
            while ((line = in.readLine()) != null) {
                line = line.trim();
                if (!line.isEmpty()) {
                    handleMessage(line);
                }
            }

        } catch (IOException e) {
            System.out.println("[HILO] Conexión cerrada para: " + playerName);
        } finally {
            cleanup();
        }
    }

    private void handleMessage(String msg) {
        String[] parts = msg.split("\\|", 2);
        String command = parts[0].toUpperCase().trim();
        String arg     = parts.length > 1 ? parts[1].trim() : "";

        switch (command) {
            case "NOMBRE"    -> handleRegister(arg);
            case "START"     -> handleStart();
            case "RESPUESTA" -> handleAnswer(arg);
            default          -> send("ERROR|Comando desconocido: " + command +
                                    " — Comandos válidos: NOMBRE|<nombre>, START, RESPUESTA|<A/B/C/D>");
        }
    }

    // ─── Handlers ────────────────────────────────────────────────────────

    private void handleRegister(String name) {
        if (name.isBlank()) {
            send("ERROR|El nombre no puede estar vacío");
            return;
        }
        if (registered) {
            send("ERROR|Ya estás registrado como " + playerName);
            return;
        }

        playerName = name;
        registered = true;

        scoreBoard.registerPlayer(playerName);
        gameState.incrementPlayers();

        int total = gameState.getTotalPlayers();
        send("OK|¡Bienvenido " + playerName + "! Hay " + total + " jugador(es) conectados.");
        send("INFO|Cuando estén listos, cualquiera puede escribir START para comenzar.");

        server.broadcast("JUGADOR_UNIDO|" + playerName + "|" + total + " jugadores conectados");

        System.out.println("[SERVIDOR] " + playerName + " se unió. Total jugadores: " + total);
    }

    private void handleStart() {
        if (!registered) {
            send("ERROR|Primero registrate con NOMBRE|<tu nombre>");
            return;
        }
        if (gameState.getPhase() != GameState.Phase.WAITING) {
            send("ERROR|El juego ya empezó");
            return;
        }
        if (gameState.getTotalPlayers() < 1) {
            send("ERROR|Necesitás al menos 1 jugador");
            return;
        }

        server.broadcast("JUEGO_INICIADO|¡" + playerName + " inició el juego! Prepárense...");
        gameState.startGame();

        try { Thread.sleep(1500); } catch (InterruptedException ignored) {}

        Question q = gameState.getCurrentQuestion();
        if (q != null) {
            server.broadcastQuestion(q, gameState.getCurrentQuestionNumber(), gameState.getTotalQuestions());
        }
    }

    private void handleAnswer(String letterStr) {
        if (!registered) {
            send("ERROR|Primero registrate con NOMBRE|<tu nombre>");
            return;
        }
        if (gameState.getPhase() != GameState.Phase.QUESTION_ACTIVE) {
            send("ERROR|No hay pregunta activa en este momento");
            return;
        }
        if (letterStr.isEmpty()) {
            send("ERROR|Indicá la opción: RESPUESTA|A, RESPUESTA|B, RESPUESTA|C o RESPUESTA|D");
            return;
        }

        char letter = letterStr.toUpperCase().charAt(0);
        if (letter != 'A' && letter != 'B' && letter != 'C' && letter != 'D') {
            send("ERROR|Opción inválida. Usá A, B, C o D");
            return;
        }

        processAnswer(letter);
    }

    // ─── Lógica de respuesta ──────────────────────────────────────────────

    private void processAnswer(char letter) {
        // ¿Este jugador fue el primero en responder esta ronda?
        // claimFirstAnswer() tiene una race condition — ver GameState.java
        boolean isFirst   = gameState.claimFirstAnswer();
        boolean isCorrect = gameState.checkAnswer(letter);

        int points = 0;
        if (isCorrect) {
            points += 500;             // Puntos base por respuesta correcta
            if (isFirst) points += 200; // Bonus velocidad: primero en responder
        }

        // Actualiza el puntaje en el ScoreBoard compartido
        // ScoreBoard.addPoints() tiene una race condition — ver ScoreBoard.java
        scoreBoard.addPoints(playerName, points);

        // Notifica al jugador
        if (isCorrect) {
            String bonus = isFirst ? " (¡PRIMERO! +200 bonus velocidad)" : "";
            send("CORRECTO|¡Bien! +" + points + " puntos" + bonus);
        } else {
            Question q = gameState.getCurrentQuestion();
            send("INCORRECTO|0 puntos. La respuesta correcta era " +
                 (q != null ? q.correct : "?"));
        }

        // Broadcast del estado actual de puntajes a todos
        server.broadcastScores(scoreBoard);

        // Verifica si todos los jugadores ya respondieron
        boolean roundOver = gameState.recordAnswerAndCheckRoundEnd();
        if (roundOver) {
            advanceRound();
        }
    }

    private void advanceRound() {
        boolean hasMore = gameState.nextQuestion();
        if (hasMore) {
            server.broadcast("NUEVA_RONDA|Siguiente pregunta en 3 segundos...");
            try { Thread.sleep(3000); } catch (InterruptedException ignored) {}
            Question q = gameState.getCurrentQuestion();
            if (q != null) {
                server.broadcastQuestion(q, gameState.getCurrentQuestionNumber(), gameState.getTotalQuestions());
            }
        } else {
            server.broadcastGameOver(scoreBoard);
        }
    }

    // ─── Utilidades ──────────────────────────────────────────────────────

    public void send(String message) {
        if (out != null && !socket.isClosed()) {
            out.println(message);
        }
    }

    public String getPlayerName() {
        return playerName;
    }

    private void cleanup() {
        if (registered) {
            gameState.decrementPlayers();
            server.removeClient(this);
            System.out.println("[SERVIDOR] " + playerName + " se desconectó. Quedan: " + gameState.getTotalPlayers());
        }
        try { socket.close(); } catch (IOException ignored) {}
    }
}
