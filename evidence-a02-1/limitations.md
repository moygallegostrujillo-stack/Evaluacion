# EVALUHR — A-02.1 · PASO 15
# LIMITACIONES DE LA METODOLOGÍA DE CRITERIOS

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0
> Vinculadas a las limitaciones del instrumento: `evidence-a01-3/07-limitations.md`.

---

## 1. Limitaciones exigidas (bloque mínimo obligatorio)

### L1. La relación entre personalidad y puesto no es automática
Ningún mapeo automático vincula un rasgo Big Five con un requisito de puesto.
Toda correspondencia se documenta como **hipótesis (HDC)** trazada a un
requisito real, sin umbral, sujeta a evidencia que hoy no existe
(`04-personality-use-rules.md`).

### L2. Un rasgo no determina desempeño
Los resultados del IPIP-50-MX describen tendencias auto-reportadas; no
determinan, predicen ni garantizan desempeño laboral de ninguna persona.

### L3. El IPIP no sustituye entrevista
La evaluación de personalidad no reemplaza la entrevista, la verificación de
experiencia, ni ninguna otra fuente de decisión humana. Complementa; no
sustituye.

### L4. Conocimiento y personalidad son constructos distintos
Lo que una persona **sabe** (categoría A) no se infiere de lo que **es**
(categoría D), ni viceversa. Prohibida cualquier sustitución de evidencia
entre categorías de la taxonomía (`02-criteria-taxonomy.md`).

### L5. La integridad todavía no está metodológicamente cerrada
El instrumento actual de integridad de EvaluHR no cuenta con validación,
versión formal ni evidencia propia; su salida es orientativa y su estatus
permanece abierto hasta completar el checklist de prerrequisitos
(`07-integrity-status.md` §3). **"El instrumento actual de integridad de
EvaluHR no debe presentarse todavía como prueba psicométrica validada."**

### L6. No existe todavía fórmula de ajuste validada
El "Nivel de ajuste respecto de los criterios definidos para el puesto" es un
concepto documentado (PASO 9): sin fórmula, sin pesos, sin cálculo, sin
validación. Cualquier número presentado como "nivel de ajuste" sería
inventado.

### L7. No existen puntos de corte
Ningún instrumento ni criterio de EvaluHR define umbrales de aprobación o
rechazo. Su fijación sin evidencia es arbitraria y está prohibida (PASO 8).

### L8. No existe recomendación automática
No hay recomendación automática de contratación ni de rechazo. La única
recomendación prevista es la **orientación técnica** de considerar entrevista,
condicionada a criterios aprobados y revisión humana (PASO 10–11).

---

## 2. Limitaciones adicionales registradas (metodología y sistema)

- **L9. Sin análisis de puesto real**: A-02.1 define el marco, no análisis.
  Los ejemplos "Mesero" son ilustrativos (estado `EJEMPLO-ILUSTRATIVO`);
  ningún criterio está aprobado todavía para un puesto real.
- **L10. Sin método conductual para competencias**: la categoría B no cuenta
  con instrumento implementado; las competencias permanecen como candidatas
  documentadas (`06-competency-model.md`).
- **L11. Reserva de calidad de la evidencia de conocimientos**: hallazgo
  preexistente documentado en A-01.2 — `correctAnswer` no se persiste para
  puestos nuevos → `knowledgeScore = 0`. Hasta corregirse con autorización,
  esa evidencia no es confiable y no debe alimentar el futuro nivel de
  ajuste (`05-knowledge-criteria.md` §6).
- **L12. Instrumentos legacy sin expediente**: "psicológica" (10 ítems,
  deprecada) e "integridad" (10 ítems) no cuentan con expediente tipo
  A-01.3; su evidencia es la más débil del sistema.
- **L13. Dependencia de la empresa**: la calidad de la metodología depende de
  la calidad y honestidad del registro de puesto que provea la empresa;
  EvaluHR no verifica veracidad de descripciones de puesto.
- **L14. Sin evidencia de criterio externo**: EvaluHR no posee estudios que
  vinculen ninguna de sus evidencias con resultados laborales observados
  (rotación, desempeño supervisado, etc.).
- **L15. Riesgo de uso indebido por el usuario**: si una empresa ignora la
  revisión humana y decide solo con la salida, la protección es documental
  (lenguaje controlado, ausencia de botones decisorios), no coercitiva
  (`11-human-review-model.md` §5).

---

## 3. Regla de visibilidad

Las limitaciones L1–L8 deben acompañar (resumidas) cualquier salida
orientativa futura y cualquier descripción pública de la metodología. No es
opcional citarlas: es parte de la definición del producto.
