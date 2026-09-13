# EVALUHR — A-02.4 · PASO 16
# MÉTRICAS INTERNAS DE AUDITORÍA DEL MODELO

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Regla del encargo: métricas internas; **NO convertirlas automáticamente en
> recomendación laboral**.

---

## 1. Las métricas definidas

| # | Métrica | Definición conceptual | Uso de auditoría |
|---|---|---|---|
| M1 | **% de criterios evaluables** | criterios con método/instrumento aprobado disponible ÷ criterios aprobados del puesto | Detecta puestos con métodos faltantes (NO_METHOD) |
| M2 | **% de evidencia válida** | evidencias en estado VALID ÷ evidencias totales del proceso | Detecta procesos sostenidos en contexto (LIMITED) o insuficiencias |
| M3 | **# de criterios críticos evaluados** | criterios CRITICAL con lectura utilizable (VALID) | Verifica cobertura de lo bloqueante; insumo del estado de gates |
| M4 | **# de criterios insuficientes** | criterios con INSUFFICIENT, separados por causa (no evaluable vs evidencia insuficiente) | Detecta brechas sistemáticas (p. ej., K-INS-1 masivo) |
| M5 | **# de conflictos** | conflictos abiertos y cerrados por proceso | Mide fricción entre fuentes; insumo del protocolo A-02.3 |
| M6 | **# de evidencia pendiente** | registros PENDING_REVIEW abiertos y antigüedad | Detecta cuellos de botella de revisión humana |
| M7 | **% de criterios verificados** | criterios C con evidencia VERIFIED ÷ criterios C con evidencia (declarada o verificada) | Mide dependencia de declaraciones sin verificar |

Métricas complementarias de gobernanza (definidas para completitud):
- M8: distribución de niveles producidos vs resultados incompletos (por
  puesto) — detecta gates activos crónicos o niveles "demasiado fáciles".
- M9: % de salidas con revisión humana cerrada antes de uso decisorio.
- M10: derivas de parámetros: cambios de reglas/pesos/topes por versión
  (deben ser 0 sin registro de gobernanza).

---

## 2. Reglas de uso (límites duros)

1. **Son diagnósticos de proceso, no del candidato**: miden completitud,
   fricción y cobertura del sistema — **nunca** se presentan como atributos
   de la persona.
2. **NO se convierten automáticamente en recomendación laboral**: ninguna
   métrica produce, altera o condiciona la recomendación técnica (que rige
   por C1–C6 de A-02.3) ni el nivel (que rige por 𝒜).
3. **NO son un score global**: M1–M7 no se combinan en un número de
   "calidad del candidato"; el score 0–100 sigue excluido del producto
   (PASO 7).
4. **NO son visibles como ranking** ni comparan personas entre sí; pueden
   agregarse por puesto/proceso para gobernanza.
5. **Auditabilidad**: cada métrica es reconstruible desde los registros
   (append-only) y viaja con la versión de reglas que la produjo.
6. **Visibilidad**: M1–M7 pueden mostrarse en contexto interno de RH como
   "completitud del proceso" (con lenguaje permitido), nunca como "fuerza
   del candidato".

---

## 3. Uso principal previsto

1. **Validación del modelo antes de productivo**: con datos reales, θ
   (umbrales) se valida contra estas métricas (dossier §19).
2. **Detección de sesgo**: distribución de niveles por grupo observable debe
   monitorearse (riesgo de discriminación, PASO 2); anomalías → revisión de
   gobernanza.
3. **Mantenimiento**: gates crónicos (M3 bajo en un puesto) señalan métodos
   faltantes o criterios imposibles de evidenciar — insumo para corregir el
   diseño del puesto, no para bajar el estándar.
