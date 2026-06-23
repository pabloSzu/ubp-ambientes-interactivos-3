# UBP — Programación para Ambientes Interactivos III (PAI3)

Repositorio de trabajo de la materia **Programación para Ambientes Interactivos III**
(Licenciatura en Sistemas de Información, Universidad Blas Pascal).

La materia se entrega como una **experiencia web asincrónica**, no como PDF sueltos.
El producto final para estudiantes vive en:

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

## Subir a la universidad

Subir la carpeta `Materia_Web/` completa. El punto de entrada para estudiantes
es `index.html`.
