# A-04.1 — PASO 12: LÍMITES DE LA IA EN INTEGRIDAD

Fase: A-04.1 (solo investigación; sin cambios de código). Fecha: 2026-09-10 (America/Mexico_City).

---

## REGLA BASE

**La IA NO puede convertirse en autoridad psicométrica de integridad.**
La validez de un instrumento se establece con métodos psicométricos (muestras,
análisis de ítems, confiabilidad, validez criterio), no por generación automática
de contenido. Crear preguntas ≠ validar un instrumento (ver PASO 15).

## 1. LO QUE LA IA SÍ PUEDE HACER (con supervisión humana)

| Tarea | Resultado del rol IA | Control humano requerido |
|---|---|---|
| Redactar situaciones/viñetas SJT (borradores) | DRAFT | Revisión y aprobación de un editor humano antes de uso |
| Proponer variantes de redacción de ítems públicos (IPIP) para adaptación lingüística | DRAFT + trazabilidad del ítem fuente | Verificación de fidelidad semántica vs ítem original |
| Detectar patrones de respuesta inconsistentes (longstring, timing anómalo) | INDICADOR técnico | Solo señala; nunca decide |
| Resumir resultados para revisores humanos | SOPORTE | El revisor interpreta y decide |
| Traducción asistida (ES) | DRAFT | Validación por traductor/juez nativo |

## 2. LO QUE LA IA NO PUEDE HACER (prohibiciones)

1. NO aprobar/aplicar claves de calificación ("correct answers" de SJT) sin
   validación y aprobación humana.
2. NO validar instrumentos (confiabilidad/validez) ni declararlos "psicométricamente
   válidos".
3. NO interpretar puntuaciones como veredicto moral o predicción individual de
   deshonestidad.
4. NO generar decisiones de contratación ni recomendar descartes (human-in-the-loop
   obligatorio).
5. NO generar ítems overt sobre drogas/violencia/creencias (datos delicados; ver
   08-risk-analysis.md).
6. NO modificar el scoring del demo ni los pesos de JobFit a partir de
   "intuiciones" del modelo.
7. NO entrenarse/optimizarse con respuestas de candidatos de integridad sin base
   legal explícita (REQUIERE REVISIÓN LEGAL).

## 3. ALINEACIÓN CON EL MARCO DE GOBERNANZA IA EXISTENTE (A-03.x)

- EvaluHR ya define: IA solo produce borradores (KGOV — función separada autor/
  publicador), no publica versiones activas ni aprueba claves (K-CA, AI-X).
- Esta fase extiende el mismo principio al dominio integridad:
  - IA = "borradorista" de viñetas y adaptaciones;
  - autoridad psicométrica = proceso humano con evidencia;
  - decisión final = revisor humano.
- Ejemplo concreto de flujo permitido (futuro, no implementado en esta fase):
  IA redacta 10 viñetas DRAFT → revisión humana → piloto con análisis de ítems →
  aprobación → versión congelada (patrón Assessment/ItemVersion de A-03.5).

## 4. EVIDENCIA QUE SUSTENTA LOS LÍMITES

- Los SJT requieren claves basadas en criterio/expertos (Christian et al., 2010;
  Whetzel & McDaniel, 2009) — no es algo que un LLM pueda "inventar" válidamente.
- El riesgo de sobreinterpretación individual (08 §A8) prohíbe interpretación
  automática como veredicto.
- La literatura de faking (meta SAGE) muestra que ni siquiera instrumentos humanos
  son infalibles; un modelo generativo no corrige eso, puede amplificarlo.

## 5. CONCLUSIÓN

La IA es aceptable como asistente de producción (borradores, variantes, alertas
técnicas) y NO aceptable como juez. Cualquier integración futura de IA en
integridad debe replicar el patrón de gobernanza ya definido: DRAFT → revisión
humana → validación → publicación versionada.
