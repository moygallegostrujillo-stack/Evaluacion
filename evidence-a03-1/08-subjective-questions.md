# EVALUHR — A-03.1 · PASO 8
# PREGUNTAS DE OPINIÓN — EXCLUSIÓN DEL KNOWLEDGESCORE

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-10 ·
> Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.1 PASO 5 §5 (separación de constructos); A-02.2 §2.1 (banco
> legacy de auto-reporte); PASO 7 (KI-VAL-1/3) y PASO 4 (K-DEF-1) de esta fase.

---

## 1. Regla del encargo

> Las preguntas tipo **"¿Qué harías?"**, **"¿Cuál consideras que es mejor?"**
> y **"¿Qué prefieres?"** se **excluyen del knowledgeScore**, salvo que exista
> una **metodología específica aprobada** para el constructo que pretenden
> medir. Esas preguntas pertenecen potencialmente a competencias/situaciones,
> no a conocimiento objetivo.

## 2. Fundamento

Una pregunta de conocimiento objetivo evalúa **contenido con respuesta
verificable** ("¿a qué temperatura debe conservarse X según el protocolo
Y?"). Una pregunta de opinión/preferencia/juicio hipotético evalúa
**tendencias, criterios personales o autopercepción** — constructos
distintos (A-02.1 §5). Mezclarlas en un mismo score:

1. rompe la definición del constructo (el score deja de significar
   "dominio declarativo");
2. rompe la exigencia de una sola respuesta correcta defendible (KI-VAL-3);
3. castiga o premia a la persona por rasgo/preferencia bajo la apariencia
   de "fallo de conocimiento" — conversión encubierta de constructos,
   prohibida por la regla general del sistema.

## 3. Taxonomía de exclusión ( KS-1..KS-4 )

| # | Tipo de pregunta | Ejemplo patrón | Tratamiento |
|---|---|---|---|
| KS-1 | **Acción hipotética** | "¿Qué harías si…?" | NO es item de conocimientos; pertenece al espacio de competencias/situaciones (cadena futura P-COMP, hoy NO_METHOD) |
| KS-2 | **Opinión / preferencia** | "¿Cuál consideras que es mejor…?", "¿Qué prefieres…?" | NO es item de conocimientos; no tiene clave defendible |
| KS-3 | **Auto-reporte de conocimiento** | "¿Conoce usted…? Sí/Parcialmente/No" | NO mide conocimiento; mide autopercepción (banco legacy de A-02.2 §2.1). No produce evidencia objetiva |
| KS-4 | **Juicio situacional con "mejor respuesta" sin source** | "¿Cuál es la mejor manera de…?" donde la clave depende de criterio no documentado | NO es item de conocimientos; solo podría existir si la empresa documenta y aprueba una metodología específica (ver §4) |

Reglas:

1. **K-SJ-1**: los items KS-1..KS-4 **no entran al knowledgeScore**, no se
   puntuan como conocimiento y no se mezclan en un instrumento de
   conocimientos.
2. **K-SJ-2**: un item que "parece conocimiento pero cuya clave es un juicio
   sin source citable" se trata como KS-4 (rechazo en KI-VAL-3).
3. **K-SJ-3**: detectar la categoría es responsabilidad de la revisión humana
   (KI-VAL); la IA puede flaggear candidatos (marcado), jamás dictaminar.

## 4. La excepción: metodología específica aprobada

Una pregunta KS-1..KS-4 solo podría puntuarse dentro de una evaluación de
conocimientos si coexisten **todas** estas condiciones (ruta futura, no
activa):

1. La empresa define y documenta la metodología (p. ej., juicio situacional
   con claves derivadas de su propio protocolo documentado, con versiones).
2. La metodología define su propio constructo, sus reglas de clave y su
   scoring separado — **no** se mezcla con el knowledgeScore de dominio
   declarativo.
3. Pasa el proceso completo de gobernanza de esta fase (blueprint →
   validación → aprobación → publicación) con el requisito de
   `knowledgeRelevance = VALID`.
4. Existe revisión psicométrica/metodológica registrada (herencia K-VAL-7).

Mientras no exista esa metodología aprobada (hoy no existe): **exclusión
absoluta**.

## 5. Consecuencias prácticas

- En validación (KI-VAL), todo item se clasifica: CONOCIMIENTO vs
  KS-1..KS-4. Los KS no avanzan en el pipeline de conocimientos.
- Si un instrumento publicado se descubre mezclado con items KS: anomalía de
  contenido → item SUSPENDED + revisión de administraciones afectadas
  (KSEC-3/5; PASO 14) — el score de administraciones que incluyeron items KS
  puntuados como conocimiento **no es reconstruible** → INSUFFICIENT
  (escenario D).
- El auto-reporte legacy ("¿Conoce…?") queda expresamente clasificado KS-3 y
  no es rescatable como "reactivo de conocimientos" sin el proceso completo.
