# A-03.5 — PASO 15: TEST DE CAMBIO
## Escenario exacto de la especificación → A = v1 completo, B = v2 completo

## Escenario ejecutado (suite CHG-1..CHG-8)

| Paso spec | Ejecución | Resultado |
|---|---|---|
| 1. KA-v1 activa | Primer inicio sobre `vacChange` publica KA-v1 (bootstrap SYSTEM) | ✅ |
| 2. Candidato A inicia | Congelado en **KA-v1** (edición de cq1 con clave=0) | CHG-1 |
| 3. Publicar KA-v2 | Se cambia la CLAVE de cq1 (0→1) en el banco; el siguiente inicio publica **KA-v2** | CHG-1 |
| 4. Candidato B inicia | Congelado en **KA-v2** (edición de cq1 con clave=1) | CHG-1 |
| 5. Cambiar correctAnswer | Segundo cambio de clave (cq3, 1→3) DESPUÉS de que A y B iniciaran | (materializa en v3) |
| 6. A termina | Calificado SOLO contra v1 → **100** (sus respuestas: clave v1) | CHG-2 |
| 7. B termina | Calificado SOLO contra v2 → **100** (clave v2) | CHG-3 |

## Comprobaciones discriminatorias

1. **Aislarla por clave**: A respondió cq1=0 (correcto SOLO bajo v1); B respondió
   cq1=1 (correcto SOLO bajo v2). Si A se calificara con v2 (o B con v1),
   el resultado sería 66.67 — el test exige 100 exacto para ambos.
2. **Aislarla por edición de item**: cq1 obtuvo itemVersion v1 (clave=0) y v2
   (clave=1), cada edición inmutable y ligada a SU requirement (CHG-5).
3. **Item sin cambios conserva versión**: cq2 mantuvo itemVersion v1 en ambas
   administraciones (CHG-6 — semántica A-03.4 preservada).
4. **Blueprint estable ante cambio de clave**: el cambio de clave NO sube el
   blueprint (la clave es material de scoring, no estructura) — ambos sobre BP-v1 (CHG-7).
5. **El tercer cambio solo afecta a futuros**: candidato C (tras el 2.º cambio)
   inicia en KA-v3 y su edición de cq3 lleva la clave NUEVA (3) (CHG-8).
6. **KnowledgeResults por administración**: cada administración produce SU
   KnowledgeResult con evidenceStatus VALID y el scoringVersion congelado (CHG-4).
7. **Reconstrucción posterior**: aun tras mutar el banco y retirar v1/v2/BP-v1,
   el resultado de A se reconstruye idéntico desde su cadena congelada (REC-3).

## Conclusión

**A = v1 completo; B = v2 completo.** El cambio del banco (contenido o claves)
jamás altera una administración en curso o terminada.
