package pai3.trivia;

/**
 * Representa una pregunta del juego.
 * Clase de datos pura — sin lógica, sin estado mutable.
 * Esta clase no tiene bugs, es solo un contenedor.
 */
public class Question {

    public final String text;
    public final String optA;
    public final String optB;
    public final String optC;
    public final String optD;
    public final char correct; // 'A', 'B', 'C' o 'D'

    public Question(String text, String optA, String optB, String optC, String optD, char correct) {
        this.text    = text;
        this.optA    = optA;
        this.optB    = optB;
        this.optC    = optC;
        this.optD    = optD;
        this.correct = correct;
    }

    @Override
    public String toString() {
        return text + " [Correcta: " + correct + "]";
    }
}
