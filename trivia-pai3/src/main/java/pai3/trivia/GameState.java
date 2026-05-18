package pai3.trivia;

import java.util.List;

/**
 * ─────────────────────────────────────────────────────────────────────────
 * ESTADO COMPARTIDO DEL JUEGO — GameState
 *
 * Una única instancia de esta clase existe por partida.
 * TODOS los hilos (uno por jugador) acceden a este mismo objeto.
 *
 * Algunos métodos están marcados como synchronized — ¿cuáles?
 * ¿Hay alguno que debería estarlo y no lo está?
 * ─────────────────────────────────────────────────────────────────────────
 */
public class GameState {

    public enum Phase {
        WAITING,          // Esperando que se unan jugadores
        QUESTION_ACTIVE,  // Hay una pregunta activa, se aceptan respuestas
        SHOWING_RESULT,   // Mostrando resultado de la ronda
        GAME_OVER         // Fin del juego
    }

    private final List<Question> questions;
    private int currentQuestionIndex = 0;
    private Phase phase = Phase.WAITING;
    private int totalPlayers = 0;
    private int answersThisRound = 0;

    /**
     * Flag para el bonus de velocidad: ¿ya alguien reclamó "primer lugar" en esta ronda?
     *
     * volatile garantiza que el valor sea visible entre hilos (sin cache de CPU).
     * PERO: volatile NO garantiza atomicidad del patrón check-then-act.
     *
     * Ejemplo del problema:
     *   Hilo A lee firstAnswerClaimed → false
     *   Hilo B lee firstAnswerClaimed → false  (antes de que A escriba)
     *   Hilo A escribe firstAnswerClaimed = true, retorna true  (¡ganó el bonus!)
     *   Hilo B escribe firstAnswerClaimed = true, retorna true  (¡también ganó el bonus!)
     *
     * Resultado: DOS jugadores reciben el bonus de "primero en responder" en la misma ronda.
     */
    private volatile boolean firstAnswerClaimed = false;

    public GameState(List<Question> questions) {
        this.questions = questions;
    }

    // ─── Gestión de jugadores ────────────────────────────────────────────

    public synchronized void incrementPlayers() {
        totalPlayers++;
    }

    public synchronized void decrementPlayers() {
        totalPlayers = Math.max(0, totalPlayers - 1);
    }

    public synchronized int getTotalPlayers() {
        return totalPlayers;
    }

    // ─── Control del flujo del juego ─────────────────────────────────────

    public synchronized void startGame() {
        if (phase == Phase.WAITING) {
            phase = Phase.QUESTION_ACTIVE;
        }
    }

    public Phase getPhase() {
        return phase;
    }

    public Question getCurrentQuestion() {
        if (currentQuestionIndex < questions.size()) {
            return questions.get(currentQuestionIndex);
        }
        return null;
    }

    public int getTotalQuestions() {
        return questions.size();
    }

    public int getCurrentQuestionNumber() {
        return currentQuestionIndex + 1;
    }

    // ─── Lógica de respuestas ────────────────────────────────────────────

    /** Verifica si la letra es la respuesta correcta para la pregunta actual. */
    public boolean checkAnswer(char letter) {
        Question q = getCurrentQuestion();
        return q != null && q.correct == Character.toUpperCase(letter);
    }

    /**
     * Intenta reclamar el bonus de "primero en responder" en esta ronda.
     *
     * Retorna true si este hilo fue el primero (y recibe el bonus).
     * Retorna false si ya alguien más llegó primero.
     *
     * PROBLEMA: el bloque if(!flag){ flag=true; return true; } NO es atómico.
     * Con synchronized o AtomicBoolean.compareAndSet() sería correcto.
     */
    public boolean claimFirstAnswer() {
        if (!firstAnswerClaimed) {      // ← Hilo A y Hilo B pueden pasar este check juntos
            firstAnswerClaimed = true;  // ← Ambos escriben true y ambos retornan true
            return true;
        }
        return false;
    }

    /**
     * Registra que un jugador respondió.
     * Retorna true cuando TODOS los jugadores respondieron (fin de ronda).
     *
     * synchronized aquí es correcto: evita que dos hilos incrementen
     * answersThisRound al mismo tiempo y que ambos crean que "terminó la ronda".
     */
    public synchronized boolean recordAnswerAndCheckRoundEnd() {
        answersThisRound++;
        return answersThisRound >= totalPlayers && totalPlayers > 0;
    }

    /**
     * Avanza a la siguiente pregunta.
     * Retorna true si hay más preguntas, false si el juego terminó.
     */
    public synchronized boolean nextQuestion() {
        currentQuestionIndex++;
        answersThisRound = 0;
        firstAnswerClaimed = false;

        if (currentQuestionIndex >= questions.size()) {
            phase = Phase.GAME_OVER;
            return false;
        }
        return true;
    }
}
