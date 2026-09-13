# EVALUHR — A-02.1 · PASO 11
# MODELO DE REVISIÓN HUMANA

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Flujo de responsabilidades (regla central)

```
EvaluHR        →  GENERA EVIDENCIA TÉCNICA
                    (resultados por instrumento, criterios, áreas de
                     revisión, recomendación técnica orientativa)
        ↓
RH de la empresa  →  REVISA LA EVIDENCIA
                    (interpreta en contexto, entrevista, contrasta,
                     documenta su lectura)
        ↓
Empresa           →  DECIDE
                    (entrevistar, avanzar, descartar, contratar:
                     decisión laboral exclusivamente humana)
```

---

## 2. Prohibición estructural

> **Queda prohibido que una recomendación de EvaluHR constituya la decisión
> laboral final.**

Consecuencias operativas de la prohibición:

1. Ningún resultado, área o recomendación de EvaluHR puede presentarse como
   "resolución", "veredicto", "aprobación" o "rechazo" de una persona.
2. Ningún flujo del producto puede cerrar un proceso de selección
   automáticamente a partir de una salida de EvaluHR.
3. La recomendación técnica siempre viaja acompañada de su carácter
   orientativo (lenguaje controlado, `output-language-matrix.md`).
4. La decisión final y su responsabilidad pertenecen a la empresa (empleador);
   EvaluHR es una herramienta de apoyo.

---

## 3. Roles y responsabilidades

| Rol | Responsabilidad | NO le corresponde |
|---|---|---|
| **EvaluHR (sistema)** | Producir evidencia técnica trazable, con versiones; identificar áreas que requieren revisión; emitir recomendación técnica orientativa; registrar salidas para auditoría | Decidir; calificar personas; cerrar procesos; reemplazar criterios; reinterpretar históricos |
| **RH de la empresa** | Revisar evidencia y áreas; conducir entrevistas; documentar su lectura; elevar recomendación interna | Delegar su lectura en el sistema; tratar la recomendación como veredicto |
| **Empresa (empleador)** | Decidir; poseer la decisión laboral y sus consecuencias | — |
| **Gobernanza EvaluHR** | Custodiar metodología, criterios de cambio, versiones y lenguaje | Intervenir decisiones individuales de las empresas |

---

## 4. Requisitos de registro (para que la revisión humana sea real)

- Cada salida orientativa registra: puesto + versión de registro, criterios
  usados + versión, evidencia + instrumentos/versión, áreas, recomendación,
  y el estado de revisión humana (`PENDIENTE` / `REVISADO` con autor y fecha).
- La revisión humana es **obligatoria antes de cualquier uso decisorio** por
  la empresa; el sistema lo declara en la salida (bloque de revisión).
- El registro es append-only y auditable (coherente con la política de
  versiones de A-01.3).

---

## 5. Qué pasa si la empresa omite la revisión

- El sistema no puede forzar conductas humanas; por ello la protección es
  documental y de diseño: la salida **no contiene** lenguaje decisorio, no
  ofrece "botón de rechazo", y declara su carácter orientativo.
- El contrato/aviso de privacidad vigentes no se modifican en A-02.1; las
  obligaciones contractuales respecto del rol de la herramienta permanecen
  según estén definidos ahí.
- Uso indebido por la empresa (usar la recomendación como decisión) es un
  riesgo registrado en `00-master-dossier.md` §16 y en `limitations.md`.
