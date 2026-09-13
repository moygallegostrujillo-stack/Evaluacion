# EVALUHR — A-02.2 · PASO 17
# CHECKLIST DE AUDITORÍA FINAL

> Auditoría ejecutada: 2026-09-09 · Método: inspección de documentos + git
> status + barridos de texto (rg) + parser CSV sobre `evidence-a02-2/`.
> Base: encargo A-02.2 (PASO 1–17), expedientes A-01.3 y A-02.1.

---

## 1. Checklist obligatorio (12 verificaciones)

| # | Verificación | Método | Resultado |
|---|---|---|---|
| 1 | ☑ **No existe fórmula** | Barrido de tokens de fórmula/asignación en `evidence-a02-2/`: solo falsos positivos de listas numeradas (13-audit-trail.md); ninguna expresión de cálculo, composición o decisión. PASO 1 §1 declara expresamente que solo una fase posterior podrá diseñar fórmula | **CUMPLE** |
| 2 | ☑ **No existen pesos** | Ningún peso asignado a categorías, tipos, instrumentos o registros; el único "peso" textual es la prohibición del encargo | **CUMPLE** |
| 3 | ☑ **No existen cortes** | Ningún valor umbral en el expediente; "puntos de corte" solo en prohibiciones (AI-X6, dossier) | **CUMPLE** |
| 4 | ☑ **No existe APTO** | Barrido "APTO": 1 aparición (01 §1) en la lista de prohibiciones de la fase | **CUMPLE** |
| 5 | ☑ **No existe NO APTO** | Ídem (misma aparición, contexto prohibitorio) | **CUMPLE** |
| 6 | ☑ **IPIP no se usa como predictor automático** | PASO 4 §5: tabla de prohibiciones (desempeño, capacidad, honestidad, decisión, candidato ideal, predictor automático); herencia A-01.3/A-02.1 sin relajación | **CUMPLE** |
| 7 | ☑ **Ausencia de evidencia no equivale a 0** | Regla de oro PASO 11 ("INSUFFICIENT ≠ 0") presente en 5 piezas (02, 11, 12, matriz CSV, insufficient-evidence-rules); prohibiciones de imputación/prorrateo | **CUMPLE** |
| 8 | ☑ **Integridad sigue INSUFFICIENT** | Regla I-INT-1 (07-integrity-evidence.md §1; insufficient-evidence-rules R6): quality=INSUFFICIENT hasta expediente suficiente; frase obligatoria de A-02.1 reproducida | **CUMPLE** |
| 9 | ☑ **knowledgeScore=0 por falta de correctAnswer no se considera evidencia válida** | Hallazgo verificado por inspección de solo lectura (05 §2: banco declara correctAnswer, `db.question.create` lo omite líneas 300–309; banco genérico sin correctAnswer y estilo auto-reporte); respuesta formal **NO** + regla K-INS-1 (`INSUFFICIENT`, `QUALITY_FAIL`); **no se corrigió** (0 cambios de código) | **CUMPLE** |
| 10 | ☑ **IA no crea evidencia** | PASO 12: AI-X1 (inventar evidencia) + AI-X2 (sin evidencia→score) + AI-X3/X4/X5/X6; `source` sin valor "AI"; la IA solo asiste tareas definidas con validación humana | **CUMPLE** |
| 11 | ☑ **Entrevista permanece humana** | PASO 9: ENTREVISTA ≠ prueba psicométrica; `source=HUMAN_INTERVIEW`; entrevistador identificable; AI-X8 prohíbe IA entrevistando o redactando notas; reviewRequired siempre | **CUMPLE** |
| 12 | ☑ **Conflictos requieren revisión humana** | PASO 10: regla central "NO resolver automáticamente"; protocolo con reviewStatus=PENDING forzado, sin promedios ni jerarquías; AI-X7 excluye a la IA | **CUMPLE** |

---

## 2. Verificaciones adicionales (calidad documental)

| # | Verificación | Resultado |
|---|---|---|
| A1 | `git status --porcelain` = único cambio `?? evidence-a02-2/`; sin cambios en src/, prisma/, db/, scripts/ (código, schema, scoring, preguntas, IA, contrato, aviso intactos; IPIP congelado v1.0) | **OK** |
| A2 | `evidence-quality-matrix.csv`: 8 columnas × 8 filas (tipos A–H), 0 filas malformadas (parser CSV) | **OK** |
| A3 | EvidenceRecord con los 14 campos mínimos del encargo, explicados uno a uno (01 §3) + 6 extensiones coherentes | **OK** |
| A4 | Tipos A–H definidos con qué mide / qué no mide / cómo se obtiene / quién la genera / calidad mínima (02) + matriz tipo×categoría | **OK** |
| A5 | Niveles HIGH/MEDIUM/LOW/INSUFFICIENT con criterios objetivos y declaración honesta (sin evidencia científica inventada; existencia ≠ validez) (03) | **OK** |
| A6 | Experiencia/formación con separación estricta declarado vs. verificado (08); declaración ≠ cumplimiento | **OK** |
| A7 | Audit trail con los 7 puntos del encargo mapeados 1:1 (13) + propiedades append-only | **OK** |
| A8 | Gobernanza: aprobar / cambiar criterios / revisar / invalidar con separación de duties y matriz de roles (16) | **OK** |
| A9 | Catálogo R1–R9 de insuficiencia con mensaje oficial literal y casos mandatorios vigentes (15) | **OK** |
| A10 | Coherencia vertical A-01.3 → A-02.1 → A-02.2 (identidad del instrumento, lenguaje, no-reinterpretación, revisión humana) sin contradicciones detectadas | **OK** |

---

## 3. Hallazgos (ninguno bloqueante)

1. **Problema correctAnswer vigente**: documentado con precisión de línea
   (generador omite persistencia; banco genérico además es auto-reporte).
   La corrección queda pendiente de autorización — hasta entonces, la
   evidencia de conocimiento de puestos generados es INSUFFICIENT por regla
   (no por juicio).
2. **La matriz de calidad es regla, no dogma**: cuando se corrija
   correctAnswer y se aprueben métodos nuevos (competencias, entrevista
   estructurada), las filas pertinentes se actualizan con versión nueva de
   reglas — nunca editando el expediente en silencio (gobernanza PASO 16).
3. **Doble papel del trail de "cálculo posterior"**: A-02.2 no tiene
   cálculos; el punto 5 del audit trail queda como obligación preventiva
   para fases futuras (se verificó que no se introdujo ningún cálculo).

---

## 4. Conclusión de auditoría

**12/12 verificaciones obligatorias CUMPLEn · 10/10 adicionales OK.**
A-02.2 es documentación pura, coherente con A-01.3/A-02.1 y con el encargo.
**GO documental** para adoptar el modelo de evidencia como marco; ninguna
pieza puede citarse como funcionalidad implementada.
