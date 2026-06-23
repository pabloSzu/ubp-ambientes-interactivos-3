# Prompt Modulo 07 - HPC, GPU & Cloud

Actua como docente universitario de arquitecturas de alto rendimiento, GPU, cloud computing y editor visual premium. Genera materiales completos para el Modulo 7.

Debes entregar 4 documentos separados:

1. CONTENIDO
2. GLOSARIO
3. OBJETIVOS
4. ACTIVIDADES

Reglas:

- CONTENIDO no debe incluir juegos, quizzes ni simuladores. Eso va solo en ACTIVIDADES.
- El contenido debe ser completo, visualmente premium, con tablas, diagramas, arquitectura comparada y casos reales.
- Primera pagina de cada documento: "Modulo 7 - HPC, GPU & Cloud" y link: https://ubp-pai-3.vercel.app/Materia_Web/modulos/modulo7.html
- Agregar QR si puedes.

## DOCUMENTO 3: OBJETIVOS DEL MODULO

IMPORTANTE: el documento OBJETIVOS debe construirse con estos objetivos exactos del modulo. No cambiarlos ni reemplazarlos por objetivos inventados; solo puedes explicarlos, maquetarlos o ampliarlos visualmente en el documento final:

1. Analizar arquitecturas de alto rendimiento (clusters, grid y cloud computing) con el fin de seleccionar el entorno optimo para resolver problemas de computo intensivo de gran escala.
2. Comparar CPU y GPU como modelos de procesamiento paralelo con el fin de disenar soluciones de alto rendimiento que aprovechen las capacidades del hardware moderno.

## GLOSARIO

Desarrollar:

- HPC
- CPU
- GPU
- Core
- SIMD
- SIMT
- Warp
- Warp divergence
- CUDA
- VRAM
- HBM
- FLOPS
- Throughput
- Latencia
- FPGA
- ASIC
- Cluster
- Nodo
- MPI
- InfiniBand
- Fat-Tree
- Cloud HPC
- Auto-scaling
- Spot instances
- Checkpointing
- Amdahl
- Gustafson-Barsis
- Escalabilidad fuerte
- Escalabilidad debil

## CONTENIDO

1. Introduccion a HPC
   - Que problemas necesitan alto rendimiento.
   - Simulaciones, IA, render, clima, bioinformatica, finanzas.
   - Diferencia entre computadora rapida y arquitectura adecuada.

2. Amdahl vs Gustafson-Barsis
   - Amdahl: problema fijo, limite por parte serial.
   - Gustafson: problema escala con cantidad de cores.
   - Formulas y ejemplos.
   - Escalabilidad fuerte vs debil.

3. CPU
   - Pocos cores complejos.
   - Alta frecuencia.
   - Excelente para baja latencia, ramas, control secuencial.
   - Casos: trading, logica de negocio, decisiones encadenadas.

4. GPU
   - Miles de cores simples.
   - SIMD/SIMT masivo.
   - Ideal para mismas operaciones sobre datos independientes.
   - Casos: pixeles, matrices, ML training, render.
   - Warp divergence.
   - Memoria GPU y HBM.

5. FPGA y ASIC
   - FPGA reconfigurable.
   - ASIC especializado.
   - Costo, eficiencia y rigidez.
   - Casos: redes, criptografia, inferencia especifica.

6. Clusters HPC
   - Nodos conectados por red rapida.
   - MPI.
   - Interconnect InfiniBand.
   - Topologias Fat-Tree.
   - Comunicacion entre nodos y particion de dominio.

7. Cloud HPC
   - GPUs por hora.
   - Elasticidad.
   - Auto-scaling.
   - Spot instances y checkpointing.
   - Trade-off costo vs control.

8. Memoria y cuellos de botella
   - FLOPS vs ancho de banda.
   - HBM y VRAM.
   - Movimiento de datos como costo dominante.

9. Elegir arquitectura
   - Datos independientes.
   - Dependencias secuenciales.
   - Latencia estricta.
   - Carga variable.
   - Duracion del trabajo.
   - Presupuesto y hardware ocioso.
   - Tabla de decision.

10. Casos interactivos
   - Juego 3D.
   - Trading automatico.
   - Entrenamiento IA.
   - Ecommerce con picos.
   - CFD con dependencias.

## ACTIVIDADES

### Actividad principal

Analizar un problema intensivo real:

- Elegir: entrenamiento IA, render, simulacion fisica, ecommerce de alto trafico, CFD, analisis financiero.
- Describir datos, dependencias, latencia, volumen y variabilidad.
- Seleccionar CPU, GPU, cluster, cloud, FPGA o ASIC.
- Justificar con Amdahl/Gustafson y criterios de arquitectura.
- Proponer diagrama de arquitectura.

### Simulador Amdahl vs Gustafson

Usar CORES_MAP = 1, 2, 4, 8, 16, 32, 64.

- Amdahl: S = 1 / ((1-P) + P/N).
- Gustafson: S(N) = N - (1-P) * (N-1).
- Mostrar como Amdahl se aplana por el cuello serial.
- Mostrar como Gustafson crece cuando el problema escala.

### Juego de arquitectura

1. Juego 3D en tiempo real
   - Datos: 8 millones de pixeles por frame, 60 veces por segundo, 16 ms por frame, cada pixel independiente.
   - Opciones:
     A. CPU potente 8-16 cores.
     B. GPU con miles de cores simples.
     C. Cluster de 10 servidores por red.
     D. Chip personalizado.
   - Correcta: B.
   - Explicacion: millones de datos independientes y misma operacion: GPU/SIMD masivo.

2. Sistema de decisiones automaticas
   - Datos: decide comprar/vender en menos de 1 ms; 50 condiciones encadenadas; resultado depende del anterior.
   - Opciones:
     A. GPU.
     B. CPU potente, un hilo dedicado.
     C. Cloud con muchos servidores.
     D. Cluster de 50 maquinas.
   - Correcta: B.
   - Explicacion: decisiones secuenciales y latencia minima; CPU single-thread dedicada.

3. Entrenamiento de inteligencia artificial
   - Datos: multiplicacion de matrices millones de veces, datos independientes, dias de computo, no comprar hardware ocioso.
   - Opciones:
     A. CPU con mucha RAM.
     B. GPUs alquiladas por hora en cloud.
     C. Cluster sin GPU.
     D. Chip de red.
   - Correcta: B.
   - Explicacion: GPU ideal para matrices; cloud evita inversion fija.

4. Ecommerce con trafico impredecible
   - Datos: 1.000 visitas/hora lunes, 100.000 visitas/hora viernes, requests independientes, no pagar capacidad ociosa.
   - Opciones:
     A. Servidor propio potente 24/7.
     B. GPU de alto rendimiento.
     C. Cloud con auto-scaling.
     D. Cluster fijo de 50 servidores.
   - Correcta: C.
   - Explicacion: carga variable y requests independientes; escalar segun demanda.

### Quiz

1. Diferencia clave entre Amdahl y Gustafson-Barsis:
   - Correcta: Amdahl asume problema fijo; Gustafson asume que el problema escala con cores.

2. ¿Por que GPU con 14.000 cores simples puede ganar a CPU de 8 cores en ML training?
   - Correcta: ML aplica la misma operacion a millones de elementos independientes, SIMD masivo.

3. ¿Que es warp divergence?
   - Correcta: threads del mismo warp toman ramas distintas de if/else y algunos esperan.

4. Para CFD con dependencias entre celdas vecinas:
   - Correcta: supercomputador HPC con MPI.

5. Ventaja de spot instances para ML training:
   - Correcta: reducen costo hasta 90% usando capacidad no utilizada, con interrupciones manejadas con checkpointing.

6. Rol de InfiniBand en Fat-Tree:
   - Correcta: conectar nodos con latencia ultrabaja y alto bandwidth para MPI.

7. Que es HBM:
   - Correcta: memoria 3D apilada con TB/s de bandwidth, critica porque mover pesos es cuello de botella.

8. P = 0.95 y 64 cores segun Amdahl:
   - Correcta: aproximadamente x15.4.
   - Explicacion: S(64)=1/(0.05+0.95/64)=x15.4; techo teorico x20.
