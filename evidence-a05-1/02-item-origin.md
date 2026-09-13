# A-05.1 — 02 · ORIGEN DE CADA REACTIVO (PASO 2, 14)

## 1. Metodología

Para cada uno de los 10 reactivos de `BIG_FIVE_QUESTIONS` se determinó:
- origen (fuente identificable, creado por el proyecto, generado por IA);
- existencia de evidencia científica;
- existencia de derechos de uso documentados.

**Regla**: NO inventar autoría. Si no puede determinarse, se declara UNKNOWN.

## 2. Origen del bloque completo

El comentario en `generate-templates.ts` L9 dice:
> `// ── Big Five personality questions (shared across all positions) ──`

No hay cita, autor, año, DOI, URL de origen, ni atribución a IPIP/NEO/BFI/Goldberg/John/Srivastava. El `AUDITORIA_EVALUHR.md` L17 (in-repo, contemporáneo) confirma:
> «Las 4 pruebas usan preguntas redactadas por el desarrollador, NO adaptadas de instrumentos validados. El 'Big Five' se menciona como nombre descriptivo del modelo, sin citar IPIP, NEO-PI-R, BFI…»

El mismo AUDITORIA L120 (sección de clasificación) dice:
> «los items de Big Five y STRESS son paráfrasis vagas de items IPIP/PSS pero **no verificables** como adaptaciones formales»

## 3. Análisis reactivo por reactivo

| # | Texto | Origen identificable | Evidencia científica | Derechos documentados |
|---|---|---|---|---|
| 1 | Disfruto probar nuevas formas de hacer las cosas en el trabajo | UNKNOWN (paráfrasis vaga de items IPIP de OPENNESS tipo «I have a vivid imagination»/«I enjoy thinking about things») | NO (no validado en este formulario) | NO |
| 2 | Me considero una persona creativa e imaginativa | UNKNOWN (paráfrasis de items IPIP de OPENNESS tipo «I am full of ideas») | NO | NO |
| 3 | Siempre organizo mis tareas antes de empezar a trabajar | UNKNOWN (paráfrasis de items IPIP de CONSCIENTIOUSNESS tipo «I like order») | NO | NO |
| 4 | Cuando me propongo algo, lo completo sin importar los obstáculos | UNKNOWN (paráfrasis de items IPIP de CONSCIENTIOUSNESS tipo «I get things done quickly»/«I carry out my plans») | NO | NO |
| 5 | Me siento cómodo/a iniciando conversaciones con personas que no conozco | UNKNOWN (paráfrasis de items IPIP de EXTRAVERSION tipo «I start conversations») | NO | NO |
| 6 | Disfruto trabajar en equipo más que de forma individual | UNKNOWN (paráfrasis de items IPIP de EXTRAVERSION tipo «I feel comfortable around people») | NO | NO |
| 7 | Me preocupa que mis compañeros de trabajo se sientan bien | UNKNOWN (paráfrasis de items IPIP de AGREEABLENESS tipo «I am concerned about others»/«I take time out for others») | NO | NO |
| 8 | Prefiero llegar a un acuerdo que ganar una discusión | UNKNOWN (paráfrasis de items IPIP de AGREEABLENESS tipo «I try to avoid conflicts») | NO | NO |
| 9 | Me estreso fácilmente cuando tengo mucho trabajo por hacer | UNKNOWN (paráfrasis de items IPIP de NEUROTICISM/reverse tipo «I get stressed out easily»/«I worry about things») | NO | NO |
| 10 | Me cuesta controlar mis emociones cuando algo sale mal | UNKNOWN (paráfrasis de items IPIP de NEUROTICISM tipo «I panic easily»/«I get caught up in my problems») | NO | NO |

**Ningún reactivo tiene una fuente identificable verificable.** Los textos son paráfrasis en español de constructos del modelo Big Five, pero NO se pueden rastrear a un ítem específico de IPIP, NEO-PI-R, BFI, Mini-IPIP ni ningún instrumento formal.

## 4. ¿Generados por IA? (PASO 14)

**UNKNOWN.**

- `z-ai-web-dev-sdk` está declarado en `package.json:84` pero **no se importa ni invoca en ningún archivo de `src/`** (verificado por grep en A-04.1 y re-confirmado en A-05.1: `rg "z-ai-web-dev-sdk" src/` = 0 matches).
- El `AUDITORIA_EVALUHR.md` L15 confirma: «No utiliza IA en producción. La dependencia está declarada… pero no se importa ni se invoca en ningún archivo de `src/`».
- No existe historial git ni metadatos que indiquen si los reactivos fueron redactados manualmente o generados por IA en una sesión de desarrollo previa.
- No existe un `origin`/`provenance` field en `Question` para personalidad (a diferencia de `VacancyQuestion.origin = RH_MANUAL | AI_DRAFT` para Knowledge).

**Clasificación IA**: **UNKNOWN** — no puede determinarse con la evidencia disponible.

## 5. ¿Adaptación formal de IPIP?

**NO verificable como adaptación formal.**

IPIP exige (newCitation.htm):
- citar Goldberg (1999) y/o Goldberg et al. (2006);
- identificar la escala específica;
- los ítems pueden usarse sin permiso (public domain), PERO deben atribuirse correctamente.

El instrumento actual **NO cita** a Goldberg, IPIP, ni ninguna escala. Los textos son paráfrasis vagas que NO coinciden verbatim con ningún ítem IPIP conocido. Por tanto:
- Si fueran ítems IPIP verbatim → public domain, atribución requerida (NO cumplida).
- Al ser paráfrasis no verificables → **NO pueden reclamar el respaldo de IPIP** ni su estatus de public domain.

## 6. Conclusión PASO 2

| Reactivo | Origen | Autoría | IA | Evidencia | Derechos |
|---|---|---|---|---|---|
| 1–10 | UNKNOWN (paráfrasis vagas de constructos Big Five) | Desarrollador (no documentado) | UNKNOWN | NO ESTABLISHED | UNKNOWN |

Ningún reactivo tiene fuente identificable, evidencia científica documentada, ni derechos de uso establecidos. La atribución a IPIP es **inverificable** y no debe asumirse.
