# A-05.2 — 10 · RIESGO DE FAKING (PASO 13)

## 1. Regla

Comparar: susceptibilidad a deseabilidad social · instrucciones · escalas de control · limitaciones.

---

## 2. Matriz de faking por instrumento

| Instrumento | Susceptibilidad | Instrucciones | Escalas de control | Limitaciones |
|---|---|---|---|---|
| Big Five demo actual | ALTO — face-valid, 2 ítems/dim, adivinable | auto-reporte estándar | NO | sin escala de deseabilidad; sin ítems de control |
| IPIP-50-MX | MEDIO-ALTO — face-valid (50 ítems); más robustez que 2/dim pero adivinable | auto-reporte estándar | NO incluidas (habría que añadir Marlowe-Crowne/BIDR) | faking puede inflar Conscientiousness/Agreeableness en selección |
| Mini-IPIP | MEDIO-ALTO — face-valid, 4 ítems/dim | auto-reporte estándar | NO | menos robustez que IPIP-50 para detectar atípicos |
| BFI-10 | ALTO — face-valid, 2 ítems/dim (igual que demo) | auto-reporte estándar | NO | no resuelve el problema de faking del demo |
| NEO-PI-R | MEDIO — face-valid pero 240 ítems + baremos T-score permiten detectar perfiles atípicos | instrucciones formales + cualificación | existe escala de validez (informada por psicólogo) | requiere cualificación profesional |
| Hogan HPI | MEDIO-BAJO — diseñado para selección con baremos ocupacionales; incluye escalas de「faking good/bad」 | instrucciones formales + partner certificado | SÍ (escalas de validación Hogan) | scoring propietario |

---

## 3. Evidencia sobre faking en pruebas Big Five

- El meta-análisis de integridad (Ones 1993, A-04.1) reporta que las pruebas **overt** son especialmente susceptibles: fake-good d = 0.90, coaching d = 1.32; las personality-based resultan menos susceptibles.
- Big Five face-valid (todos los instrumentos aquí) es susceptible a deseabilidad social, especialmente en contextos de selección donde el candidato tiene incentivo para parecer «bueno».
- Conscientiousness y Agreeableness son las dimensiones más fácilmente falsificables hacia arriba (socialmente deseables).

## 4. Mitigaciones disponibles

| Mitigación | Aplicable a | Eficacia |
|---|---|---|
| Añadir escala de deseabilidad social (Marlowe-Crowne, BIDR) | IPIP, Mini-IPIP, BFI | MEDIA — detecta faking grosero, no sutil |
| Instrucción de honestidad / advertencia de verificación | todos | BAJA-MEDIA |
| Diseño de ítems encubiertos | requiere rediseño | ALTA pero cambia el instrumento |
| Intervalos de respuesta obligados + tiempo | todos | BAJA |
| Escalas de validez (NEO, Hogan) | comerciales | ALTA |

## 5. Conclusión PASO 13

- El **demo actual** tiene riesgo de faking ALTO (face-valid, 2 ítems/dim, sin escalas de control).
- **IPIP-50-MX** y **Mini-IPIP** son MEDIO-ALTO (face-valid, sin escalas de control incluidas); requerirían añadir una escala separada.
- **BFI-10** no resuelve el problema del demo (2 ítems/dim).
- **NEO-PI-R** y **Hogan HPI** (comerciales) tienen escalas de validez integradas — pero requieren cualificación/partner.

Para V1, cualquier instrumento público elegido requeriría:
1. Añadir una escala de deseabilidad social (costo de implementación).
2. Etiquetar resultados como «orientativos, sensibles a faking».
3. No usar puntuaciones de personalidad como criterio único de decisión.

El riesgo de faking refuerza la recomendación de **no alimentar overallScore con personalidad** en V1 (consistente con A-04.5 governance).
