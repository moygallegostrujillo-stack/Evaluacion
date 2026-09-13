# A-05.3 — 08 · LÍMITES DE IA (PASO 10)

## 1. Regla

La IA no podrá:
- generar nuevas preguntas de personalidad V1;
- publicar personalidad;
- modificar personality scores;
- activar el instrumento.

## 2. Estado

**Cumplido por diseño**:

| Acción | ¿Posible? | Mecanismo de bloqueo |
|---|---|---|
| Generar preguntas de personalidad V1 | NO | `generateTemplatesForPosition` no crea PSICOMETRICA template; no hay endpoint de IA para generar preguntas BF |
| Publicar personalidad | NO | No hay ruta que cree preguntas BF; el endpoint `/api/vacancies/[id]/generate-questions` NO existe en el código (AUDITORIA_EVALUHR.md L15 confirma) |
| Modificar personality scores | NO | Los scores se computan server-side desde responses; el cliente no puede enviar `personalityScore` (grep = 0) |
| Activar el instrumento | NO | El engine excluye BIG_FIVE incondicionalmente; no hay flag de activación |

## 3. Verificación de ausencia de IA

- `z-ai-web-dev-sdk` está en `package.json` pero NO se importa en `src/` (verificado en A-04.1, A-05.1).
- No hay endpoint de generación de preguntas de personalidad por IA.
- No hay `origin = 'AI_DRAFT'` para preguntas de personalidad (solo para `VacancyQuestion` de Knowledge).

## 4. Conclusión PASO 10

La IA no puede generar, publicar, modificar ni activar personalidad en V1. El bloqueo es estructural (código), no solo de política.
