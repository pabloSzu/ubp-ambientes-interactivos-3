# Prompt Modulo 02 - Interfaces, Navegabilidad y UX

Actua como disenador instruccional, especialista UX/UI y editor visual premium. Necesito que generes materiales completos para el Modulo 2 de Programacion para Ambientes Interactivos III.

Debes entregar 4 documentos separados:

1. CONTENIDO
2. GLOSARIO
3. OBJETIVOS
4. ACTIVIDADES

Reglas obligatorias:

- El documento CONTENIDO no debe incluir actividades, quizzes ni juegos. Eso va solo en ACTIVIDADES.
- El contenido teorico debe ser amplio, ordenado, visualmente excelente y exportable a PDF/Word.
- Usar tablas, matrices de analisis, ejemplos de interfaces, mini casos, diagramas de flujo y recomendaciones visuales.
- Primera pagina de cada documento: "Modulo 2 - Interfaces, Navegabilidad y UX" y link grande: https://ubp-pai-3.vercel.app/Materia_Web/modulos/modulo2.html
- Si puedes, agrega QR a ese link.
- Mantener tono universitario, moderno y claro.

## DOCUMENTO 3: OBJETIVOS DEL MODULO

IMPORTANTE: el documento OBJETIVOS debe construirse con estos objetivos exactos del modulo. No cambiarlos ni reemplazarlos por objetivos inventados; solo puedes explicarlos, maquetarlos o ampliarlos visualmente en el documento final:

1. Aproximarse a los conceptos de interfaz, navegabilidad, usuario y experiencia con el proposito de reconocer la especificidad de cada uno y profundizarlos a lo largo de la carrera.
2. Aprender los conceptos de UX, UI y Navegabilidad con el fin de avanzar hacia los contenidos de plataformas interactivas.

## GLOSARIO que debe desarrollar el documento GLOSARIO

Incluir definiciones con ejemplos:

- Interfaz
- UI
- UX
- Interaccion
- Navegabilidad
- Usuario
- Flujo de usuario
- Arquitectura de informacion
- Jerarquia visual
- Affordance
- Signifier
- Feedback
- Estado del sistema
- Heuristicas de Nielsen
- Consistencia
- Prevencion de errores
- Reconocimiento vs recuerdo
- Flexibilidad y eficiencia
- Accesibilidad
- WCAG
- Contraste
- Foco visible
- Ley de Hick
- Ley de Fitts
- Ley de Miller
- Gestalt
- Happy path
- Edge case
- Error state
- Empty state

## CONTENIDO que debe desarrollar el documento CONTENIDO

1. Introduccion a interfaces y experiencia
   - La interfaz como punto de contacto entre usuario y sistema.
   - Diferencia entre interfaz bonita, interfaz usable e interfaz significativa.
   - Por que UX no es solo estetica.

2. UX, UI, interaccion y navegabilidad
   - UX: experiencia total antes, durante y despues de usar el sistema.
   - UI: elementos visuales y controles concretos.
   - Interaccion: acciones del usuario y respuestas del sistema.
   - Navegabilidad: capacidad de orientarse, moverse y volver.
   - Tabla comparativa con responsabilidades y ejemplos.

3. Modelos mentales del usuario
   - Que espera el usuario.
   - Como se construye confianza.
   - Lenguaje cercano vs lenguaje tecnico.
   - Consistencia con convenciones.

4. Leyes de UX
   - Ley de Hick: mas opciones aumentan tiempo de decision.
   - Ley de Fitts: objetivos grandes y cercanos son mas faciles de alcanzar.
   - Ley de Miller: limites de memoria de trabajo.
   - Principios Gestalt: proximidad, similitud, continuidad, cierre, figura-fondo.
   - Ejemplos aplicados a menus, botones, formularios y dashboards.

5. Heuristicas de Nielsen
   - Visibilidad del estado del sistema.
   - Relacion entre sistema y mundo real.
   - Control y libertad del usuario.
   - Consistencia y estandares.
   - Prevencion de errores.
   - Reconocimiento antes que recuerdo.
   - Flexibilidad y eficiencia.
   - Diseno estetico y minimalista.
   - Ayudar a reconocer, diagnosticar y recuperarse de errores.
   - Ayuda y documentacion.
   - Para cada heuristica incluir: explicacion, ejemplo de problema y mejora sugerida.

6. Accesibilidad y WCAG
   - Accesibilidad como calidad del producto, no agregado posterior.
   - Contraste, navegacion por teclado, foco visible, textos alternativos.
   - Nivel AA como referencia comun.
   - Errores frecuentes: focus invisible, texto gris bajo contraste, iconos sin tooltip, formularios sin etiquetas.

7. Flujos de usuario y navegabilidad
   - Happy path y edge cases.
   - Estados de carga, error, vacio, exito.
   - Navegacion visible vs menus ocultos.
   - Breadcrumbs, tabs, barras laterales, menus contextuales.
   - Como reducir friccion.

8. Formularios y microcopy
   - Validacion en tiempo real.
   - Mensajes de error accionables.
   - Etiquetas claras.
   - Confirmaciones para acciones destructivas.
   - Undo y recuperacion.

9. Auditoria UX
   - Como observar una interfaz.
   - Como asignar severidad.
   - Como proponer soluciones.
   - Matriz: problema, heuristica, impacto, evidencia, propuesta.

10. Cierre integrador
   - Una buena interfaz reduce carga cognitiva y aumenta confianza.
   - UX como disciplina de decisiones visibles e invisibles.

## ACTIVIDADES que debe desarrollar el documento ACTIVIDADES

### Actividad principal

Realizar una auditoria de una interfaz real usando heuristicas de Nielsen:

- Elegir una app, sitio o sistema.
- Detectar minimo 5 problemas de usabilidad.
- Asociar cada problema con una heuristica.
- Asignar severidad: baja, media, alta o critica.
- Proponer una mejora concreta.
- Presentar evidencias con capturas o descripciones.

### Juego: detectar heuristicas violadas

Opciones usadas segun el caso: H1 Visibilidad del estado, H2 Lenguaje del mundo real, H3 Control y libertad, H4 Consistencia, H5 Prevencion de errores, H6 Reconocimiento antes que recuerdo, H7 Flexibilidad y eficiencia, H8 Diseno minimalista, H9 Recuperacion de errores, H10 Ayuda.

1. Formulario de 5 pasos muestra solo "Error"; el usuario no sabe si perdio datos ni que hacer.
   - Opciones: H1, H2, H4, H8.
   - Correcta: H1 Visibilidad del estado.
   - Pista: el sistema no informa que paso ni como continuar.

2. Boton de logout dice "Terminar instancia activa del entorno de usuario autenticado".
   - Opciones: H3, H2, H6, H9.
   - Correcta: H2 Lenguaje del mundo real.
   - Pista: usa jerga tecnica en vez de "Cerrar sesion".

3. Usuario borra accidentalmente un mensaje importante y no hay confirmacion ni recuperacion.
   - Opciones: H5, H3, H1, H4.
   - Correcta: H3 Control y libertad.
   - Pista: falta undo o salida de emergencia.

4. App profesional no tiene atajos de teclado; todo requiere menus con mouse.
   - Opciones: H8, H10, H7, H6.
   - Correcta: H7 Flexibilidad y eficiencia.
   - Pista: no contempla usuarios avanzados.

5. Barra de herramientas con iconos nuevos sin etiquetas ni tooltips.
   - Opciones: H2, H5, H6, H4.
   - Correcta: H6 Reconocimiento antes que recuerdo.
   - Pista: obliga a memorizar o probar.

### Quiz de autoevaluacion

1. ¿Que heuristica se viola mostrando "ERR_CONNECTION_REFUSED" al usuario final?
   - Opciones: H1, H2, H9, H4.
   - Correcta: H2.
   - Explicacion: es lenguaje tecnico, no lenguaje del usuario.

2. Un flujo tiene "Cancelar" para cerrar modal y "Salir" para cerrar sesion. ¿Que principio se ignora?
   - Opciones: H5, H4, H7, H6.
   - Correcta: H5.
   - Explicacion: verbos similares con consecuencias distintas generan errores.

3. Diferencia entre affordance y signifier:
   - Correcta: affordance es la posibilidad real de accion; signifier es la senal visible que comunica esa accion.

4. Un formulario valida solo al enviar, no mientras se escribe. ¿Que heuristica no aprovecha?
   - Opciones: H3, H8, H5, H10.
   - Correcta: H5 Prevencion de errores.

5. ¿Como se aplica la Ley de Hick?
   - Correcta: a mayor cantidad de opciones, mayor tiempo de decision.

6. ¿Que nivel WCAG suele tomarse como requerimiento comun?
   - Correcta: AA.
   - Explicacion: incluye contraste, texto ampliable y foco visible.

7. ¿Por que el menu hamburguesa puede ser problematico en desktop?
   - Correcta: porque en desktop se espera navegacion visible y no escondida.

8. Diferencia entre happy path y edge case:
   - Correcta: happy path es el recorrido ideal; edge cases son limites, errores o situaciones no ideales.
