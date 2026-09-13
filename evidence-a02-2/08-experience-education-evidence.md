# EVALUHR — A-02.2 · PASO 8
# EVIDENCIA DE EXPERIENCIA Y FORMACIÓN (declarado vs. verificado)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Regla central

> **No se asume que una declaración es evidencia de cumplimiento.**
>
> La trayectoria y la formación existen en dos estados estrictamente
> separados: **dato declarado** y **dato verificado**. Cada estado produce
> registros con calidades máximas distintas y nunca se mezclan en un mismo
> registro.

---

## 2. Separación declarado / verificado

| Aspecto | DECLARADO | VERIFICADO |
|---|---|---|
| Origen (`source`) | `CANDIDATE_DECLARATION` | `DOCUMENT_VERIFICATION` o `HUMAN_INTERVIEW` (RH/empresa) |
| Qué dice | Lo que la persona afirma sobre sí | Lo que un método de verificación humano registró |
| `value` / `unit` | Texto/estructura de la declaración · `DECLARATIVE` | Resultado binario/regla documentada · `BOOLEAN_VERIFIED` (+ referencia al documento o acto de verificación) |
| Calidad máxima | **LOW** | **HIGH** (método robusto y documentado) / **MEDIUM** (método básico) |
| `reviewRequired` | Siempre `true` | Según matriz (PASO 14); revisor identificado obligatorio |
| Uso permitido | Contexto orientativo; nunca lectura del criterio por sí sola | Base posible para lectura del criterio (fase futura), con revisión |
| Uso prohibido | Presentarlo como "cumple el requisito"; convertirlo en puntaje; usarlo sin marcar que no está verificado | Declarar verificación sin registro del revisor, del documento y de la fecha |

**Regla D-EXP-1**: un registro nunca contiene "declaración verificada por el
candidato". La verificación es un acto **humano ajeno a la declaración**, con
su propio registro.

---

## 3. Tratamiento por elemento

### 3.1 Años de experiencia
- **Declarado**: texto estructurado (puesto, organización, periodo, funciones)
  con `DECLARATIVE` → LOW.
- **Verificado**: constancia documental o referencia registrada por RH
  (documento, contacto, plataforma) con `BOOLEAN_VERIFIED` + método
  registrado → MEDIUM/HIGH.
- `value` conservado con contexto (meses por rol), sin totalizadores
  derivados por fórmulas (no hay fórmulas en A-02.2).
- Nota: años declarados no implican competencia ni conocimiento vigente
  (constructos separados).

### 3.2 Estudios
- Declarado (nivel, institución, periodo) → LOW.
- Verificado (título/certificado revisado, revisor, fecha) → MEDIUM/HIGH
  según método.
- La verificación acredita **el dato**, no el conocimiento actual del
  contenido (eso es categoría A con prueba — constructos separados).

### 3.3 Certificaciones
- Declarada → LOW (con folio si lo aporta).
- Verificada → MEDIUM/HIGH; registro incluye folio, emisor, vigencia y
  método de verificación. Certificación vencida o no localizable → no
  verifica (resultado negativo documentado, no "insuficiencia" del candidato:
  el estado es un `BOOLEAN_VERIFIED=false` legítimo).

### 3.4 Cursos
- Declarado → LOW. Verificado (constancia) → MEDIUM.
- **Importante**: cursos son datos de **formación** (categoría C de la
  taxonomía). "Saber lo que enseñó el curso" solo se acredita con prueba de
  conocimientos (categoría A, PASO 5). No se acepta "tomó un curso" como
  evidencia de conocimiento.

### 3.5 Conocimientos declarados
- La declaración de conocimientos ("sé operar X") **no es evidencia de
  conocimiento** (categoría A). Puede registrarse como declaración (LOW,
  contexto) y el criterio de conocimiento correspondiente queda
  `INSUFFICIENT` hasta existir prueba válida (PASO 5).

---

## 4. Reglas de registro (resumen)

1. Un requisito del criterio se atiende con **uno o más** registros; cada
   registro es declarado **o** verificado (nunca híbrido).
2. La verificación requiere: documento/acto identificado, revisor humano,
   fecha, regla de decisión documentada ("qué hace válido el documento").
3. Resultado negativo verificado (`false`) es evidencia legítima: se
   registra tal cual, sin "suavizar" ni convertir en insuficiencia.
4. Sin registro del revisor → máximo LOW (PASO 3 §2).
5. Los registros declarados que después se verifican **no se editan**: se
   agrega el registro de verificación que los referencia (append-only,
   PASO 13).
