package pai3.trivia;

import java.util.HashMap;
import java.util.Map;

/**
 * ─────────────────────────────────────────────────────────────────────────
 * TABLA DE PUNTAJES — ScoreBoard
 *
 * Almacena el puntaje de cada jugador. Con un solo jugador funciona
 * perfectamente. Con 5+ jugadores respondiendo al mismo tiempo... ¿funciona?
 *
 * Probalo: corré el servidor, conectá 10 jugadores, hacelos responder
 * todos a la vez con el stress_test.py, y mirá los puntajes finales.
 *
 * PREGUNTA PARA PENSAR:
 *   Si todos respondieron correctamente (500 pts cada uno), ¿el total
 *   de puntos del ganador es siempre 5000? ¿O puede ser menos?
 * ─────────────────────────────────────────────────────────────────────────
 */
public class ScoreBoard {

    // HashMap no está diseñado para acceso concurrente desde múltiples hilos.
    // Alternativas thread-safe: ConcurrentHashMap, Collections.synchronizedMap()
    private final Map<String, Integer> scores = new HashMap<>();

    /** Registra un nuevo jugador con puntaje inicial 0. */
    public void registerPlayer(String name) {
        scores.put(name, 0);
    }

    /**
     * Suma puntos a un jugador.
     *
     * Este método es invocado desde MÚLTIPLES HILOS simultáneamente
     * (uno por cada jugador que responde a la misma pregunta).
     *
     * TRAZA DE EJECUCIÓN CON 2 HILOS (para entender el bug):
     *
     *   Tiempo   Hilo A (María)          Hilo B (Juan)
     *   ──────   ──────────────          ─────────────
     *     t=0    lee current = 500
     *     t=1                            lee current = 500   ← también lee 500!
     *     t=2    escribe 500 + 300 = 800
     *     t=3                            escribe 500 + 300 = 800  ← sobrescribe!
     *
     *   Resultado: María debería tener 800, Juan 800. Total: 1600.
     *   Resultado real: ambos tienen 800. ¡Se perdieron 300 puntos!
     *
     * PISTA PARA LA CORRECCIÓN (Etapa 02 del proyecto):
     *   ¿Qué operación de Java garantiza que el read + modify + write
     *   ocurra como una sola unidad atómica, sin que otro hilo se meta?
     */
    public void addPoints(String player, int points) {
        int current = scores.getOrDefault(player, 0); // Paso 1: leer valor actual
        scores.put(player, current + points);           // Paso 2: escribir nuevo valor
        // ← Entre estos dos pasos, otro hilo puede leer el valor viejo
        //   y sobrescribir el resultado de este hilo. Es una race condition.
    }

    /** Devuelve el puntaje actual de un jugador. */
    public int getScore(String player) {
        return scores.getOrDefault(player, 0);
    }

    /**
     * Devuelve una copia de los puntajes para broadcast.
     * Usamos new HashMap<>(scores) para copiar — ¿es suficiente?
     * ¿Puede scores estar siendo modificado mientras lo copiamos?
     */
    public Map<String, Integer> getSnapshot() {
        return new HashMap<>(scores);
    }
}
