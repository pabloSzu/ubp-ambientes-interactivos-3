# Documento maestro de la materia

Materia: Programacion para Ambientes Interactivos III.

Este documento explica como ordenar y construir la materia asincronica en formato web. La fuente formal sigue siendo la documentacion de la raiz:

- `principal.pdf`
- `Programación para Ambientes Interactivos III- Contenido y Módulos.pdf`

La carpeta final de trabajo es:

```text
Materia_Web/
```

Todo lo viejo, experimental o duplicado debe desaparecer de la vista cotidiana. La raiz queda simple: los dos PDF formales, este documento maestro y la carpeta web final.

## Idea central

La materia no se piensa como un paquete de PDF sueltos. Se piensa como una experiencia web asincronica:

- Un indice limpio con los 7 modulos.
- Una pagina por modulo.
- Navegacion global: inicio, modulos y evaluacion.
- Navegacion interna por modulo: microobjetivos, glosario, contenidos y actividades.
- Imagenes, simuladores, capturas sinteticas, laboratorios visuales y actividades aplicadas.

El foco del profesor y de los estudiantes debe estar en:

- Modulos.
- Contenidos.
- Actividades.
- Evaluacion integradora.

## Reglas formales que no se cambian

El programa formal define proposito, objetivos, competencias, contenidos y forma de cursado.

Las competencias no son modificables. Todas las actividades deben orientarse a esas competencias.

Cada modulo debe tener:

- Microobjetivos.
- Glosario.
- Contenidos.
- Actividades.

Los microobjetivos deben tener esta forma:

```text
Verbo en infinitivo + contenido + finalidad.
```

Ejemplo:

```text
Conocer el concepto de interactividad y el lenguaje interactivo con el fin de transferirlos a las situaciones practicas propuestas en la materia.
```

Cada modulo debe tener minimo 1 y maximo 4 microobjetivos.

## Estructura final

```text
Materia_Web/
├── index.html
├── evaluacion.html
├── modulos/
│   ├── modulo1.html        ← pagina dedicada (HECHO)
│   ├── modulo2.html        ← pagina dedicada (HECHO)
│   ├── modulo3.html        ← pagina dedicada (HECHO)
│   ├── modulo4.html        ← pagina dedicada (HECHO)
│   ├── modulo5.html        ← pagina dedicada (PENDIENTE)
│   ├── modulo6.html        ← pagina dedicada (PENDIENTE)
│   ├── modulo7.html        ← pagina dedicada (PENDIENTE)
│   └── modulo.html         ← plantilla generica (no se usa en produccion)
└── assets/
    ├── css/
    │   ├── modulo.css      ← CSS base compartido (NO modificar)
    │   ├── modulo2.css     ← overrides y estilos propios del modulo 2
    │   ├── modulo3.css     ← overrides y estilos propios del modulo 3
    │   └── modulo4.css     ← overrides y estilos propios del modulo 4
    ├── js/
    │   ├── campus.js       ← datos de todos los modulos + deteccion de acento por URL
    │   ├── modulo2.js      ← logica interactiva del modulo 2
    │   ├── modulo3.js      ← logica interactiva del modulo 3
    │   └── modulo4.js      ← logica interactiva del modulo 4
    └── recursos/
```

Cada modulo tiene su propia pagina HTML, su CSS de overrides y su JS de logica interactiva. El patron es consistente entre modulos: HTML + CSS propio + JS propio, todos enlazando `modulo.css` como base compartida. El acento de color de cada modulo se aplica via IIFE en el JS del modulo para sobreescribir la inyeccion de `campus.js`.

## Acento de color por modulo

Cada modulo tiene su propio color de acento definido en `campus.js` y sobreescrito via IIFE en su JS propio:

| Modulo | Color       | Hex       |
|--------|-------------|-----------|
| 1      | Dorado      | `#ffd166` |
| 2      | Violeta     | `#a855f7` |
| 3      | Teal        | `#00e8c6` |
| 4      | Violeta electrico | `#b040ff` |
| 5      | Naranja     | `#ff7d54` |
| 6      | (por definir) |         |
| 7      | (por definir) |         |

## Modulos

### Modulo 1

Tema: Interactividad, TV digital, Ginga y DEVENDRA.

Enfoque ideal:

- Explicar interactividad como accion, proceso y feedback.
- Comparar TV pasiva, TV digital interactiva, streaming y experiencias en vivo.
- Usar imagenes generadas para mostrar TV analogica, app Ginga, caso DEVENDRA y plataformas actuales.
- Pedir una actividad de analisis visual: captura o mockup, acciones del usuario, feedback, nivel de interactividad y mejora.

### Modulo 2

Tema: Interfaces, navegabilidad y experiencia del usuario.

Enfoque ideal:

- Analizar pantallas reales o sinteticas.
- Trabajar flujos, menus, accesibilidad, consistencia y feedback.
- Actividad: redisenar o diagnosticar una interfaz interactiva.

### Modulo 3

Tema: Introduccion a la programacion concurrente en Java.

Enfoque ideal:

- Explicar proceso, hilo, scheduler, concurrencia y paralelismo.
- Usar simuladores de agentes que chocan por recursos compartidos.
- Actividad: implementar una simulacion simple en Java con hilos y observar race conditions.

### Modulo 4

Tema: Comunicacion entre procesos e hilos.

Enfoque ideal:

- Productor/consumidor, colas, mensajes y comunicacion segura.
- Actividad: construir un pipeline de eventos interactivos.

### Modulo 5

Tema: Sincronizacion entre procesos e hilos.

Enfoque ideal:

- Locks, semaforos, monitores, deadlock y starvation.
- Actividad: corregir un sistema concurrente defectuoso.

### Modulo 6

Tema: Programacion en sistemas paralelos.

Enfoque ideal:

- Division de tareas, speedup, balanceo de carga y fork/join en Java.
- Actividad: comparar versiones secuenciales y paralelas.

### Modulo 7

Tema: Computacion de alta performance.

Enfoque ideal:

- HPC, clusters, GPU, cloud y rendimiento.
- Actividad: analizar una arquitectura o caso de alto rendimiento aplicado a experiencias interactivas.

## Evaluacion integradora

Debe haber dos parciales que sumen 100 puntos:

- Parcial 1: 40 puntos.
- Parcial 2: 60 puntos.

Cada actividad dentro de un parcial debe tener puntaje asignado.

La evaluacion debe integrar contenidos de los modulos y no quedar como ejercicios aislados.

## Uso de imagenes y recursos visuales

Se pueden usar imagenes generadas por IA cuando ayuden a explicar:

- Capturas sinteticas de plataformas tipo streaming.
- Diagramas de feedback usuario-sistema.
- Mockups de TV digital interactiva.
- Simuladores de hilos, locks, colisiones y recursos compartidos.
- Mapas visuales de arquitectura.

Las imagenes deben ser didacticas, no decorativas. Cada imagen tiene que ayudar a entender una idea o realizar una actividad.

## Criterio de calidad

La materia debe sentirse:

- Clara para estudiantes.
- Formalmente alineada al programa.
- Visual e intuitiva.
- Practica y aplicada.
- Moderna, con ejemplos de IA, agentes, plataformas, interactividad y sistemas concurrentes.

El objetivo no es solo que "se vea linda"; el objetivo es que el estudiante quiera entrar, tocar, probar, equivocarse y entender.

