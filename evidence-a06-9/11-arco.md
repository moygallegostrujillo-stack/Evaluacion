# EVALUHR — A-06.9 — 11 · ANEXO: ARCO (PASO 13)

> **BORRADOR PARA REVISIÓN LEGAL PROFESIONAL. NO CONSTITUYE VERSIÓN DEFINITIVA.**
> Anexo del Contrato (cláusulas VIGÉSIMO SEGUNDA/VIGÉSIMO TERCERA). Alineado con la arquitectura
> ARCO/consentimiento ya existente en la plataforma. **No se modifica código.**
> Plazos y procedimiento exactos: **[LEGAL_REVIEW]**.

# ANEXO 6 — DERECHOS ARCO Y ATENCIÓN DE TITULARES

## 1. Derechos cubiertos

Acceso, rectificación, cancelación y oposición (ARCO), limitación y revocación del
consentimiento, respecto de los datos tratados en el proceso de entrevista.

## 2. Reparto de funciones

| Función | Quién | Detalle |
|---|---|---|
| **Recibir la solicitud** | EVALUA HR (canal técnico) + empresa (Recursos Humanos) | Cualquiera de los dos canales debe derivar la solicitud al flujo común el mismo día hábil **[plazo: LEGAL_REVIEW]** |
| **Verificar identidad** | EVALUA HR (verificación técnica) + empresa confirma al candidato del proceso | Mínimo datos suficientes; sin pedir datos sensibles para verificar |
| **Atender la solicitud** | **Empresa cliente (responsable)** | Decide fondo del derecho (procedencia/improcedencia) |
| **Ejecutar** | EVALUA HR (ejecución técnica por instrucciones) | Acceso/rectificación (append-only)/cancelación (purge)/oposición (suspensión) |
| **Conservar evidencia del trámite** | EVALUA HR (logs) + empresa (acuerdos) | Registro de solicitud, respuesta y ejecución, con fecha/hora |

## 3. Reglas de ejecución

1. **Acceso**: entrega de la información tratada del titular **[LEGAL_REVIEW: forma y plazos]**.
2. **Rectificación**: mediante nueva versión (append-only), sin sobrescribir historia.
3. **Cancelación**: purge de los datos del titular, salvo obligación legal de conservación
   **[LEGAL_REVIEW: excepciones]**; se registra el purge.
4. **Oposición**: suspensión del tratamiento del titular, salvo obligación legal.
5. **Revocación del consentimiento**: detiene la entrevista en curso si no ha concluido; los datos
   ya capturados se tratan conforme a ARCO.
6. Las solicitudes sobre **datos de terceros** o sin acreditación se desechan con registro.
7. La respuesta al titular es emitida por la **empresa responsable**; EvaluHR provee la parte
   técnica y de plataforma.

## 4. Alineación con la arquitectura existente

La plataforma ya cuenta con flujo de consentimiento y versionado del aviso. Este anexo reutiliza
esa arquitectura; **no requiere cambios de código en A-06.9**. Cualquier ajuste futuro de canal o
plazos requiere dictamen y desarrollo aparte (fuera de alcance).

---

**FIN DEL ANEXO — SUJETO A REVISIÓN LEGAL PROFESIONAL.**
