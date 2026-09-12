# EVALUHR — A-06.9 — 09 · ANEXO: CONSERVACIÓN — CLÁUSULA FLEXIBLE (PASO 11)

> **BORRADOR PARA REVISIÓN LEGAL PROFESIONAL. NO CONSTITUYE VERSIÓN DEFINITIVA.**
> Anexo del Contrato (cláusulas VIGÉSIMA/VIGÉSIMO PRIMERA). **NO se fija "2 años" como obligación
> legal**: la propuesta de 2 años es práctica recomendada de diseño (A-06.8 `10-retention.md`),
> no un requisito identificado en la ley. Los plazos finales los establece el abogado.

# ANEXO 4 — TRATAMIENTO Y CONSERVACIÓN DE EVIDENCIA

## 1. Cláusula flexible (texto propuesto)

> "Los datos del proceso de entrevista se conservarán por el plazo que las PARTES determinen por
> categoría en el Cuadro de Conservación, el cual podrá actualizarse de común acuerdo conforme al
> dictamen jurídico vigente, y en todo caso por el tiempo **estrictamente necesario** para las
> finalidades del tratamiento, el ejercicio de derechos y la defensa jurídica, sin exceder lo
> permitido por la legislación aplicable."

**Cuadro de Conservación — [PLAZO POR DICTAMEN LEGAL]** en cada fila.

## 2. Clasificación por categoría

| Categoría | Propuesta de diseño | Clasificación | Plazo en borrador |
|---|---|---|---|
| **Entrevista** (guía aplicada, versión, tiempos) | Conservar con el proceso | RECOMMENDED | [PLAZO POR DICTAMEN] |
| **Respuestas** del candidato (STAR) | 2 años no contratados (práctica recomendada, NO ley) | RECOMMENDED + LEGAL_REVIEW | [PLAZO POR DICTAMEN] |
| **Evidencia** (notas, fragments, resultado de competencia) | Igual que respuestas; contratado → expediente del empleado del cliente | RECOMMENDED + LEGAL_REVIEW | [PLAZO POR DICTAMEN] |
| **Auditoría** (logs de acceso/export/purge, flags de incidente) | Ciclo técnico de logs | RECOMMENDED | [PLAZO POR DICTAMEN] |
| **Consentimiento** | Mientras dure el tratamiento + plazo de defensa | LEGAL_REVIEW | [PLAZO POR DICTAMEN] |
| **Grabaciones** (audio/video) | **V1 NO incorpora grabación**; si existiera: eliminar post-revisión | RECOMMENDED (no aplica V1) | N/A en V1 |
| **Datos sensibles revelados involuntariamente** | **Nunca conservar** (protocolo Anexo 3) | REGLA DE DISEÑO OBLIGATORIA | 0 / no conservar |

## 3. Reglas de conservación (sin cambios respecto de A-06.8)

1. Minimización: no conservar más allá de lo necesario; retención indefinida prohibida.
2. Cancelación ARCO: eliminación a solicitud, salvo obligación legal de conservar **[LEGAL_REVIEW:
   excepciones citables]**.
3. Queja/proceso en curso: suspensión del purge del expediente involucrado hasta resolución
   **[LEGAL_REVIEW: cuándo levantar]**.
4. Purge con registro en audit trail; anonimización solo para fines estadísticos sin atributos
   protegidos.
5. Terminación del contrato: devolución y/o eliminación verificable a elección del cliente.

## 4. Recordatorio de alcance

**V1 NO incorpora grabación de audio/video.** Toda mención a grabaciones en este paquete es
condicional para futuras versiones y requeriría consentimiento específico **[LEGAL_REVIEW]**.

---

**FIN DEL ANEXO — SUJETO A REVISIÓN LEGAL PROFESIONAL.**
