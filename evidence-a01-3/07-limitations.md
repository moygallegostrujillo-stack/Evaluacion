# A-01.3 — PASO 8: LIMITACIONES DEL INSTRUMENTO EN EVALUHR

> Este documento declara las limitaciones que deben acompañar siempre al instrumento
> EVALHR-PERSONALIDAD-IPIP50-MX en materiales internos, comerciales y de resultados.
> Son limitaciones de hecho, verificables en el expediente.

## 1. Ausencia de baremos propios de EvaluHR

- EvaluHR **no posee baremos** (normas de comparación) generados de su propia base de
  candidatos. Ningún resultado puede presentarse como "por encima/debajo del promedio
  de los candidatos" o en percentiles.
- La visualización 0–100 es una transformación aritmética del crudo (raw/50×100) y
  **no constituye percentil** ni posición relativa frente a población alguna.

## 2. Ausencia de validación predictiva propia

- EvaluHR **no ha conducido estudio alguno** de relación entre puntajes del IPIP-50-MX
  y desempeño, permanencia, rotación ni ningún criterio laboral en su plataforma.
- No existe, por tanto, validación de criterio, validez incremental ni análisis de
  utilidad para decisiones de contratación de la implementación EvaluHR.

## 3. Evidencia mexicana limitada al contexto de los estudios encontrados

- La única evidencia mexicana identificada es la adaptación publicada por de Oliveira,
  Cherubini & Oliver (2013): una muestra de **603 personas de 18–35 años**, panel en
  línea, usuarios prepago de un operador, clase media predominantemente, administrada
  con **escala de 9 puntos de acuerdo**, en el marco de un estudio de satisfacción con
  servicios móviles.
- Esa evidencia **no cubre**: población económicamente activa general, otros rangos de
  edad, otros niveles socioeconómicos, regiones específicas, administración con escala
  de 5 puntos de exactitud, ni contexto de evaluación de candidatos.
- Los propios autores declaran la necesidad de verificar generalización (Sección 3.7
  del artículo).

## 4. No equivalencia automática entre evidencia del instrumento y evidencia de una implementación concreta

- Que el IPIP-50 base y su adaptación mexicana tengan evidencia publicada **no
  implica** que la implementación concreta de EvaluHR (su instrucción en español, su
  formato de respuesta, su medio digital, su población de candidatos) herede esas
  propiedades automáticamente.
- La transferibilidad de evidencia entre contexto de publicación y contexto de uso
  requiere verificación empírica propia (no disponible; ver `06-psychometric-evidence.md`
  sección D).

## 5. No diagnóstico clínico

- El instrumento **no es una herramienta de diagnóstico clínico ni psiquiátrico**.
  No diagnostica trastornos, patologías ni condiciones de salud mental.
- No sustituye la valoración de profesionales de la psicología cuando dicha valoración
  sea pertinente.
- Los factores miden marcadores lexicográficos de personalidad (tendencias de
  respuesta auto-reportadas), no estados clínicos ni capacidades.

## 6. No determinación automática de contratación

- Los resultados **no determinan por sí mismos** la contratación o no contratación de
  una persona (disclaimer obligatorio mostrado en resultados RH, texto literal
  implementado en `IPIP50_RESULT_DISCLAIMER`).
- Ninguna fórmula, umbral ni automatismo del sistema convierte puntajes de
  personalidad en decisiones (el IPIP no participa del overallScore ni de las
  recomendaciones automáticas).

## 7. No uso como único criterio de decisión laboral

- Los resultados constituyen **información técnica de apoyo** que debe integrarse con
  otras fuentes (entrevistas, referencia, evaluaciones técnicas, experiencia) y con el
  juicio humano de RH.
- Usar este instrumento como criterio único o determinante para una decisión laboral
  queda fuera del uso permitido y declarado del sistema.

## 8. Limitaciones adicionales de transparencia

1. **Auto-reporto**: como todo instrumento de personalidad auto-administrado, es
   susceptible a deseabilidad social y a sesgos de auto-percepción.
2. **Ítems con debilidad documentada**: el estudio de la adaptación reportó baja
   correlación ítem-total para q16r y q36r en su muestra, y sugirió revisar la
   redacción de q36r. v1.0 mantiene el texto publicado verbatim (regla anti-edición);
   esta limitación queda registrada para la futura revisión gobernanza.
3. **Administración 1–5 exactitud sin estudio propio**: la evidencia publicada de la
   adaptación fue obtenida con otra escala (9 puntos de acuerdo); la combinación exacta
   usada por EvaluHR carece de estudio publicado.
4. **Sin estabilidad test-retest** medida en la plataforma.
5. **Contexto demo**: el despliegue actual es una demo; los datos generados no son
   evidencia psicométrica.

## 9. Compromiso de comunicación

Toda comunicación de EvaluHR (interna, comercial, resultados) debe poder sustentarse
en este expediente. Ante duda, rige el texto más conservador: información técnica de
apoyo, tendencias de respuesta, sin promesas de predicción, diagnóstico ni aptitud.

— FIN DEL DOCUMENTO DE LIMITACIONES —
