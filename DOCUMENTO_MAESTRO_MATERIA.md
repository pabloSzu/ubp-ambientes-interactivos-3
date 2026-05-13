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
│   ├── modulo1.html
│   ├── modulo.html?m=2
│   ├── modulo3.html
│   ├── modulo.html?m=4
│   ├── modulo.html?m=5
│   ├── modulo.html?m=6
│   └── modulo.html?m=7
└── assets/
    ├── css/
    ├── js/
    ├── m1/
    └── recursos/
```

`modulo.html?m=2`, `modulo.html?m=4`, etc. usan una plantilla comun alimentada por datos en JavaScript. Los modulos mas importantes o mas visuales pueden tener pagina propia, como el Modulo 1 y el Modulo 3.

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

