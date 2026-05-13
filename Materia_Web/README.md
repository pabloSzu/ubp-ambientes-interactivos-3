# Materia Web - PAI3

Esta carpeta es el producto final web-first de la materia.

La idea es reemplazar el modelo de "carpetas llenas de PDF" por una experiencia navegable:

- `index.html`: indice simple de la materia.
- `modulos/`: clases web por modulo.
- `evaluacion.html`: evaluacion integradora con los dos parciales.
- `assets/`: estilos, scripts e imagenes generadas o preparadas para la cursada.

## Como verlo

Desde la raiz del proyecto:

```powershell
python -m http.server 8124 --directory Materia_Web
```

Luego abrir:

```text
http://localhost:8124/index.html
```

Tambien se puede abrir `Materia_Web/index.html` directo en el navegador, aunque el servidor local es mas estable para probar rutas.

## Como subirlo a la universidad

Subir la carpeta `Materia_Web` completa. El punto de entrada para estudiantes es:

```text
index.html
```

## Estructura pedagogica

Cada modulo debe respetar:

- Microobjetivos: minimo 1, maximo 4.
- Glosario: terminos tecnicos que el estudiante debe manejar.
- Contenidos: desarrollo de la clase, ejemplos, recursos visuales e invitacion a actividades.
- Actividades: al menos una actividad evaluable o practica alineada al modulo.

La evaluacion integradora mantiene:

- Parcial 1: 40 puntos.
- Parcial 2: 60 puntos.
- Total: 100 puntos.

