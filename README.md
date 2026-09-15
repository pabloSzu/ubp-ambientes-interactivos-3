# UBP — Programación para Ambientes Interactivos III (PAI3)

Repositorio de trabajo de la materia **Programación para Ambientes Interactivos III**
(Licenciatura en Sistemas de Información, Universidad Blas Pascal).

Lo que se entrega formalmente a la universidad son los **entregables** en
`entregables/` (Contenido, Microobjetivos, Glosario, Actividades, Evaluaciones
y Presentaciones en Word/PDF/PPTX, por módulo).

Además de eso, existe una **plataforma web complementaria**, construida por
iniciativa propia como material extra para que los alumnos puedan cursar la
materia de forma más interactiva. No es lo que se sube a la universidad; es
un plus. Vive en:

```text
Materia_Web/
```

Entrada principal: `Materia_Web/index.html`

## Vista local

Desde la raíz del proyecto:

```powershell
python -m http.server 8124 --directory Materia_Web
```

Luego abrir: http://localhost:8124/index.html

> Se puede abrir `Materia_Web/index.html` directo en el navegador, pero el
> servidor local es más estable para probar rutas y assets.

## Mapa de documentación

| Archivo | Para qué sirve |
|---|---|
| `README.md` (este) | Punto de entrada: qué es y cómo correrlo. |
| `DOCUMENTO_MAESTRO_MATERIA.md` | **Reglas y criterio pedagógico** que no cambian: competencias, formato de microobjetivos, evaluación, patrón técnico de cada módulo. |
| `CONTENIDOS_MAESTRO.md` | **Inventario de contenido real** de cada módulo (secciones, simuladores, juegos) y gaps detectados. |
| `Materia_Web/README.md` | Notas mínimas de la carpeta web. |
| `PROMPTS_MODULOS/` | Prompts usados para generar cada módulo. |

## Contenido de `Materia_Web/`

- `index.html` — índice de la materia con los 7 módulos por bloques.
- `modulos/modulo1.html` … `modulo7.html` — una página dedicada por módulo.
- `evaluacion.html` — evaluación integradora (Parcial 1: 40 pts · Parcial 2: 60 pts).
- `proyecto.html` — proyecto integrador (trivia multijugador).
- `assets/` — `css/`, `js/`, imágenes y recursos.

## Qué se sube a la universidad

Se sube el contenido de `entregables/` (Word/PDF/PPTX por módulo, evaluaciones
y presentaciones). `Materia_Web/` es un recurso aparte, para los alumnos, y no
forma parte de la entrega académica.
