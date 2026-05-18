#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════
  STRESS TEST — Trivia PAI3
  Reproduce las race conditions del servidor Java con carga concurrente.
═══════════════════════════════════════════════════════════════════════════

PROPÓSITO:
  Este script simula N jugadores conectándose y respondiendo TODOS A LA VEZ.
  Con sincronización rota → los puntajes van a ser incorrectos.
  Con sincronización correcta → los puntajes son exactos y consistentes.

REQUISITO:
  El servidor debe estar corriendo antes de ejecutar este script:
    javac -d out src/main/java/pai3/trivia/*.java
    java -cp out pai3.trivia.TriviaServer

USO:
  python test/stress_test.py                    # 10 jugadores, respuesta B
  python test/stress_test.py --players 20       # 20 jugadores
  python test/stress_test.py --players 20 --answer C  # respuesta C

CÓMO INTERPRETAR LOS RESULTADOS:
  - Si todos respondieron la misma opción correcta (B por defecto),
    el puntaje esperado de cada jugador es 500 puntos × N preguntas.
  - Si el puntaje REAL es menor → hubo race condition: se perdieron updates.
  - Si el puntaje REAL es 0 para algunos → el Map se corrompió.
  - Si el servidor lanza ConcurrentModificationException → ArrayList bug.
═══════════════════════════════════════════════════════════════════════════
"""

import socket
import threading
import time
import argparse
import sys
from datetime import datetime

HOST = "localhost"
PORT = 9000

# ─── Configuración ─────────────────────────────────────────────────────────

def parse_args():
    parser = argparse.ArgumentParser(description="Stress test para Trivia PAI3")
    parser.add_argument("--players", type=int, default=10,
                        help="Cantidad de jugadores simulados (default: 10)")
    parser.add_argument("--answer", type=str, default="B",
                        choices=["A", "B", "C", "D"],
                        help="Letra de respuesta que envían todos (default: B = correcta)")
    parser.add_argument("--delay", type=float, default=0.0,
                        help="Delay entre respuestas en segundos (default: 0 = simultáneo)")
    parser.add_argument("--questions", type=int, default=10,
                        help="Cuántas preguntas responder (default: 10)")
    return parser.parse_args()

# ─── Jugador simulado ────────────────────────────────────────────────────────

class SimulatedPlayer:
    def __init__(self, player_id, answer_letter, delay, questions_count):
        self.player_id      = player_id
        self.name           = f"Bot-{player_id:02d}"
        self.answer_letter  = answer_letter
        self.delay          = delay
        self.questions_count = questions_count

        self.received_scores = []
        self.error           = None
        self.done            = False
        self.messages        = []

    def run(self, ready_event, start_event):
        """
        Conecta, se registra, espera a que todos estén listos,
        y luego responde todas las preguntas simultáneamente.
        """
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.connect((HOST, PORT))
            sock.settimeout(30.0)

            reader = sock.makefile("r", encoding="utf-8")
            writer = sock.makefile("w", encoding="utf-8")

            def send(msg):
                writer.write(msg + "\n")
                writer.flush()

            def recv():
                try:
                    line = reader.readline()
                    return line.strip() if line else None
                except socket.timeout:
                    return None

            # Esperar BIENVENIDO
            msg = recv()
            self.messages.append(f"← {msg}")

            # Esperar INGRESA_NOMBRE
            msg = recv()
            self.messages.append(f"← {msg}")

            # Registrarse
            send(f"NOMBRE|{self.name}")
            self.messages.append(f"→ NOMBRE|{self.name}")

            # Esperar OK
            msg = recv()
            self.messages.append(f"← {msg}")

            # Señal: este jugador está listo
            ready_event.set()

            # Si es el jugador 0, espera a que todos estén conectados y arranca
            if self.player_id == 0:
                start_event.wait()  # espera a que todos los bots estén listos
                time.sleep(0.5)     # pequeña pausa para que lleguen todos los OK
                send("START")
                self.messages.append(f"→ START")

            # Loop de juego: responder preguntas
            questions_answered = 0
            while questions_answered < self.questions_count:
                msg = recv()
                if msg is None:
                    break
                self.messages.append(f"← {msg}")

                if msg.startswith("PREGUNTA"):
                    # Delay configurable (0 = todos simultáneos)
                    if self.delay > 0:
                        time.sleep(self.delay)

                    send(f"RESPUESTA|{self.answer_letter}")
                    self.messages.append(f"→ RESPUESTA|{self.answer_letter}")
                    questions_answered += 1

                elif msg.startswith("PUNTAJES"):
                    self.received_scores.append(msg)

                elif msg.startswith("FIN_JUEGO"):
                    break

                elif msg.startswith("ERROR"):
                    self.messages.append(f"[ERROR] {msg}")

            sock.close()

        except ConnectionRefusedError:
            self.error = "No se pudo conectar. ¿El servidor está corriendo?"
        except Exception as e:
            self.error = str(e)
        finally:
            self.done = True

# ─── Orquestador ────────────────────────────────────────────────────────────

def run_stress_test(num_players, answer_letter, delay, questions_count):
    print(f"""
╔════════════════════════════════════════════════════╗
║  STRESS TEST · Trivia PAI3                        ║
╠════════════════════════════════════════════════════╣
║  Jugadores    : {num_players:<34} ║
║  Respuesta    : {answer_letter:<34} ║
║  Delay        : {f"{delay}s":<34} ║
║  Preguntas    : {questions_count:<34} ║
║  Hora inicio  : {datetime.now().strftime("%H:%M:%S"):<34} ║
╚════════════════════════════════════════════════════╝
""")

    players   = []
    threads   = []
    ready_events = [threading.Event() for _ in range(num_players)]
    start_event  = threading.Event()

    # Crear y arrancar todos los bots
    for i in range(num_players):
        p = SimulatedPlayer(i, answer_letter, delay, questions_count)
        players.append(p)

        t = threading.Thread(
            target=p.run,
            args=(ready_events[i], start_event),
            daemon=True
        )
        threads.append(t)

    print(f"[TEST] Conectando {num_players} jugadores...")
    for t in threads:
        t.start()
        time.sleep(0.05)  # pequeña pausa para no saturar el accept() del servidor

    # Esperar a que todos estén registrados
    for i, ev in enumerate(ready_events):
        if not ev.wait(timeout=10.0):
            print(f"[WARN] Jugador {i} no se registró a tiempo")

    print(f"[TEST] Todos conectados. Señalando inicio simultáneo...")
    start_event.set()  # ahora el Bot-00 enviará START

    # Esperar a que todos terminen
    for t in threads:
        t.join(timeout=60.0)

    # ─── Análisis de resultados ───────────────────────────────────────────
    print("\n" + "═" * 54)
    print("  RESULTADOS")
    print("═" * 54)

    errors  = [p for p in players if p.error]
    done    = [p for p in players if p.done and not p.error]

    if errors:
        print(f"\n⚠  ERRORES ({len(errors)} jugadores fallaron):")
        for p in errors:
            print(f"   {p.name}: {p.error}")

    # Extraer puntajes finales del último mensaje PUNTAJES recibido
    print(f"\n  Jugadores que terminaron: {len(done)}/{num_players}")

    final_scores = {}
    for p in done:
        for score_msg in reversed(p.received_scores):
            # Formato: PUNTAJES|Bot-01:800|Bot-02:500|...
            parts = score_msg.split("|")[1:]
            for part in parts:
                if ":" in part:
                    name, score = part.split(":", 1)
                    try:
                        final_scores[name.strip()] = int(score.strip())
                    except ValueError:
                        pass
            break  # solo el último mensaje de puntajes

    if final_scores:
        print(f"\n  PUNTAJES FINALES:")
        print(f"  {'Jugador':<20} {'Puntaje Real':>12}  {'Esperado':>10}  {'¿OK?':>6}")
        print(f"  {'─'*20} {'─'*12}  {'─'*10}  {'─'*6}")

        # Si la respuesta es B (correcta), el puntaje esperado es 500 * preguntas respondidas
        # El primer jugador que responde cada ronda recibe +200 extra (bonus velocidad)
        # Con race condition, el bonus puede darse múltiples veces por ronda
        expected_base = 500 * questions_count

        inconsistencies = 0
        for name in sorted(final_scores.keys()):
            real  = final_scores[name]
            # Con delay=0 (simultáneo), todos deberían tener ~500*Q (sin contar bonus)
            # Si hay race condition: algunos tienen menos (updates perdidos)
            ok_mark = "✓" if real > 0 else "✗ CERO!"
            if real < expected_base * 0.9:  # más del 10% de pérdida = problema
                ok_mark    = "✗ BAJO"
                inconsistencies += 1
            print(f"  {name:<20} {real:>12}  {expected_base:>10}  {ok_mark:>6}")

        print()
        if inconsistencies > 0:
            print(f"  ⚠  RACE CONDITION DETECTADA: {inconsistencies} jugador(es) tienen")
            print(f"     puntaje inconsistente con el esperado.")
            print(f"     → Los hilos se solaparon en ScoreBoard.addPoints()")
            print(f"     → Fix: usar synchronized, AtomicInteger o ConcurrentHashMap")
        else:
            print(f"  ✓  Puntajes consistentes — sincronización correcta (o pocos jugadores).")
            print(f"     Probá con más jugadores: python stress_test.py --players 30")
    else:
        print("\n  No se recibieron puntajes. ¿El juego terminó correctamente?")
        print("  Revisá la consola del servidor para ver si hubo excepciones.")

    print("\n" + "═" * 54)
    print("  FIN DEL STRESS TEST")
    print("═" * 54 + "\n")


if __name__ == "__main__":
    args = parse_args()

    if args.players < 2:
        print("Error: necesitás al menos 2 jugadores para el test")
        sys.exit(1)

    run_stress_test(
        num_players=args.players,
        answer_letter=args.answer.upper(),
        delay=args.delay,
        questions_count=args.questions
    )
