-- ============================================================
-- EVALUHR — AUTH BOOTSTRAP & PUBLIC LOOKUP FUNCTIONS
-- PHASE 3.5-D.3 (Partes 1–2) — PREPARED, NOT EXECUTED
-- ============================================================
--
-- PURPOSE
--   Identity/bootstrap resolution BEFORE a tenant context exists
--   (login, auto-login, public vacancy slug, public application
--   tenant resolution). Under FORCE RLS the runtime role
--   (evalhr_app) cannot see tenant rows without
--   app.current_company_id — these functions are the ONLY
--   pre-tenant read path.
--
-- SECURITY MODEL (Parte 2 checklist)
--   OWNER      : evalhr_secdef — NOLOGIN role, created here, holds
--                ONLY scoped SELECT policies (see rls-policies.sql,
--                section "SECDEF AUTH BOOTSTRAP POLICIES"). Nobody can
--                log in as evalhr_secdef; it is only reachable through
--                these functions.
--   search_path: pinned to pg_catalog on every function
--                (SET search_path = pg_catalog). All object references
--                are schema-qualified (public."Table").
--   PARAMETERS : strongly typed (TEXT), always used as bound values —
--                NO dynamic SQL, NO EXECUTE, NO format().
--   RETURN     : TABLE with MINIMAL columns. The password hash is
--                returned only because the API must verify it
--                server-side; no other secret/PII is exposed.
--   PRIVILEGES : functions are read-only (pure SELECT); they cannot
--                modify data.
--   EXECUTE    : REVOKE ALL FROM PUBLIC; GRANT EXECUTE ONLY to
--                evalhr_app (runtime role) and evalhr_secdef.
--   INJECTION  : parameters are typed and compared with =; callers use
--                Prisma $queryRaw with bound parameters.
--   TAMPERING  : altering the tables referenced here does not change
--                function behavior (static SQL); replacing these
--                functions requires ownership of the function (owner is
--                a NOLOGIN role) — see verifier queries at the bottom.
--
-- ⚠️ NOT ACTIVATED IN THIS PHASE (D.3): no role is created and no
--    function is executed against any database. This file is the
--    prepared design for staging activation.
--
-- PREREQUISITES (staging activation order):
--   1. prisma/create-rls-role.sql   → evalhr_app (NO SUPERUSER, NO BYPASSRLS)
--   2. This file                    → evalhr_secdef + functions
--   3. rls-policies.sql             → policies (incl. SECDEF section)
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- STEP 1: NOLOGIN function-owner role (no password needed)
-- ════════════════════════════════════════════════════════════
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'evalhr_secdef') THEN
    CREATE ROLE evalhr_secdef
      NOLOGIN
      NOSUPERUSER
      NOCREATEDB
      NOCREATEROLE
      NOINHERIT
      NOREPLICATION
      NOBYPASSRLS;
    RAISE NOTICE 'Role evalhr_secdef created (NOLOGIN, NOBYPASSRLS)';
  ELSE
    RAISE NOTICE 'Role evalhr_secdef already exists';
  END IF;
END $$;

-- ════════════════════════════════════════════════════════════
-- STEP 2: SELECT grants for the function owner (scoped, read-only)
-- ════════════════════════════════════════════════════════════
GRANT USAGE ON SCHEMA public TO evalhr_secdef;
GRANT SELECT ON TABLE public."User"                TO evalhr_secdef;
GRANT SELECT ON TABLE public."CandidateInvitation" TO evalhr_secdef;
GRANT SELECT ON TABLE public."Company"             TO evalhr_secdef;
GRANT SELECT ON TABLE public."Vacancy"             TO evalhr_secdef;
GRANT SELECT ON TABLE public."Position"            TO evalhr_secdef;
GRANT SELECT ON TABLE public."VacancyQuestion"     TO evalhr_secdef;
GRANT SELECT ON TABLE public."VacancyApplication"  TO evalhr_secdef;

-- ════════════════════════════════════════════════════════════
-- STEP 3: evalhr_auth_find_user(p_email)
--   Minimal identity resolution for LOGIN (pre-tenant).
--   Returns the password hash for server-side verification ONLY.
-- ════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION evalhr_auth_find_user(p_email TEXT)
RETURNS TABLE (
  "id"            TEXT,
  "email"         TEXT,
  "name"          TEXT,
  "role"          TEXT,
  "password"      TEXT,
  "phone"         TEXT,
  "companyId"     TEXT,
  "active"        BOOLEAN,
  "consentGiven"  BOOLEAN,
  "consentVersion" TEXT,
  "companyName"   TEXT,
  "companySector" TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.email,
    u.name,
    u.role,
    u.password,
    u.phone,
    u."companyId",
    u.active,
    u."consentGiven",
    u."consentVersion",
    c.name,
    c.sector
  FROM public."User" u
  LEFT JOIN public."Company" c ON c.id = u."companyId"
  WHERE u.email = p_email
  LIMIT 1;
END;
$$;

-- ════════════════════════════════════════════════════════════
-- STEP 4: evalhr_auth_find_invitation(p_token)
--   FIX (Fase 3.5-E, PARTE 8): "expiresAt" was declared TIMESTAMPTZ while
--   CandidateInvitation.expiresAt is TIMESTAMP(3) WITHOUT TIME ZONE.
--   RETURN QUERY raised "structure of query does not match function result
--   type" → auto-login would have failed under RLS. Declared type now
--   matches the column exactly; the app layer converts to Date.
--   Minimal invitation resolution for AUTO-LOGIN (pre-tenant).
--   Returns provisioning keys (tenant/position/status/expiry) plus the
--   public-facing context the token holder already knows (company name,
--   position title). No secrets. Candidate PII limited to name/phone/email
--   columns the auth flow consumes server-side.
-- ════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION evalhr_auth_find_invitation(p_token TEXT)
RETURNS TABLE (
  "id"           TEXT,
  "companyId"    TEXT,
  "positionId"   TEXT,
  "status"       TEXT,
  "expiresAt"    TIMESTAMP,
  "candidateName" TEXT,
  "phone"        TEXT,
  "email"        TEXT,
  "companyName"  TEXT,
  "companySector" TEXT,
  "positionTitle" TEXT,
  "positionDescription" TEXT,
  "positionCategory" TEXT,
  "positionSector" TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i."companyId",
    i."positionId",
    i.status,
    i."expiresAt",
    i."candidateName",
    i.phone,
    i.email,
    c.name,
    c.sector,
    p.title,
    p.description,
    p.category,
    p.sector
  FROM public."CandidateInvitation" i
  LEFT JOIN public."Company" c ON c.id = i."companyId"
  LEFT JOIN public."Position" p ON p.id = i."positionId"
  WHERE i.token = p_token
  LIMIT 1;
END;
$$;

-- ════════════════════════════════════════════════════════════
-- STEP 5: evalhr_public_find_active_vacancy(p_slug)
--   PUBLIC bootstrap read (Parte 8): ONLY public fields of an
--   ACTIVE vacancy. No companyId to the client, no candidates,
--   no responses, no results, no internal configuration.
--   companyId IS returned to the SERVER so it can open a tenant
--   transaction — API routes must never forward it.
-- ════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION evalhr_public_find_active_vacancy(p_slug TEXT)
RETURNS TABLE (
  "id"                    TEXT,
  "companyId"             TEXT,
  "title"                 TEXT,
  "description"           TEXT,
  "sector"                TEXT,
  "includePsicometrica"   BOOLEAN,
  "includePsicologica"    BOOLEAN,
  "includeIntegridad"     BOOLEAN,
  "maxVideoSeconds"       INTEGER,
  "companyName"           TEXT,
  "companyPhone"          TEXT,
  "knowledgeQuestionCount" BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v."companyId",
    v.title,
    v.description,
    v.sector,
    v."includePsicometrica",
    v."includePsicologica",
    v."includeIntegridad",
    v."maxVideoSeconds",
    c.name,
    c.phone,
    (
      SELECT COUNT(*)
      FROM public."VacancyQuestion" vq
      WHERE vq."vacancyId" = v.id AND vq.type = 'MULTIPLE_CHOICE'
    )
  FROM public."Vacancy" v
  JOIN public."Company" c ON c.id = v."companyId"
  WHERE v.slug = p_slug
    AND v.status = 'ACTIVE'
  LIMIT 1;
END;
$$;

-- ════════════════════════════════════════════════════════════
-- STEP 6: evalhr_public_application_tenant(p_id)
--   Returns ONLY the companyId of a VacancyApplication — the
--   minimal read needed to open a tenant transaction for a
--   token-verified public operation (RESUME/ANSWER/ADVANCE/VIDEO).
--   ⚠️ Application-layer rule: callers MUST verify the HMAC token
--   BEFORE invoking this function (enforced in code).
-- ════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION evalhr_public_application_tenant(p_id TEXT)
RETURNS TABLE (
  "companyId" TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN QUERY
  SELECT va."companyId"
  FROM public."VacancyApplication" va
  WHERE va.id = p_id
  LIMIT 1;
END;
$$;

-- ════════════════════════════════════════════════════════════
-- STEP 7: EXECUTE privileges — least privilege
--   PUBLIC must NOT be able to call these functions directly;
--   only the runtime role goes through the API.
-- ════════════════════════════════════════════════════════════
REVOKE ALL ON FUNCTION evalhr_auth_find_user(TEXT)              FROM PUBLIC;
REVOKE ALL ON FUNCTION evalhr_auth_find_invitation(TEXT)        FROM PUBLIC;
REVOKE ALL ON FUNCTION evalhr_public_find_active_vacancy(TEXT)  FROM PUBLIC;
REVOKE ALL ON FUNCTION evalhr_public_application_tenant(TEXT)   FROM PUBLIC;

GRANT EXECUTE ON FUNCTION evalhr_auth_find_user(TEXT)              TO evalhr_app;
GRANT EXECUTE ON FUNCTION evalhr_auth_find_invitation(TEXT)        TO evalhr_app;
GRANT EXECUTE ON FUNCTION evalhr_public_find_active_vacancy(TEXT)  TO evalhr_app;
GRANT EXECUTE ON FUNCTION evalhr_public_application_tenant(TEXT)   TO evalhr_app;

ALTER FUNCTION evalhr_auth_find_user(TEXT)              OWNER TO evalhr_secdef;
ALTER FUNCTION evalhr_auth_find_invitation(TEXT)        OWNER TO evalhr_secdef;
ALTER FUNCTION evalhr_public_find_active_vacancy(TEXT)  OWNER TO evalhr_secdef;
ALTER FUNCTION evalhr_public_application_tenant(TEXT)   OWNER TO evalhr_secdef;

-- ════════════════════════════════════════════════════════════
-- VERIFICATION (run after activation — expected results inline)
-- ════════════════════════════════════════════════════════════
-- Owner + secdef flags:
--   SELECT p.proname, pg_get_userbyid(p.proowner) AS owner,
--          p.prosecdef, p.proconfig
--   FROM pg_proc p
--   WHERE p.proname IN ('evalhr_auth_find_user','evalhr_auth_find_invitation',
--                       'evalhr_public_find_active_vacancy',
--                       'evalhr_public_application_tenant');
--   Expected: owner = evalhr_secdef, prosecdef = t,
--             proconfig = {search_path=pg_catalog}
--
-- Function must be read-only (no data-modifying statements):
--   Verified by inspection — bodies contain only RETURN QUERY SELECT.
--
-- evalhr_secdef must be NOLOGIN/NOBYPASSRLS:
--   SELECT rolname, rolcanlogin, rolsuper, rolbypassrls
--   FROM pg_roles WHERE rolname = 'evalhr_secdef';
--   Expected: rolcanlogin = f, rolsuper = f, rolbypassrls = f
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- FASE 3.5-F — SA RESOURCE-TENANT RESOLUTION + CANDIDATE CATALOG
-- ============================================================
-- PURPOSE
--   Fase 3.5-F found (PARTE 29 regression, first run UNDER real RLS) that
--   several SA impersonation flows and the candidate global position
--   catalog resolved their resource tenant through the SHARED runtime
--   client (evalhr_app, no context). Under FORCE RLS those reads return
--   0 rows → silent breakage:
--     - candidate create-session → 404 (position unresolvable)
--     - SA consent/edit/delete on behalf of a company → 404
--     - SA derived writes (sessions/interviews/vacancies/invitations) → 404
--     - candidate availablePositions (GLOBAL catalog by design) → empty
--   These functions restore those flows using the SAME security model as
--   the auth bootstrap functions above: SECURITY DEFINER owned by
--   evalhr_secdef (NOLOGIN), search_path pinned, static SQL, minimal
--   columns, EXECUTE only for evalhr_app, revoked from PUBLIC.
--
--   The SUBSEQUENT WRITES keep running through withTenantImpersonation()
--   on the runtime channel (evalhr_app + audited tenant context) — these
--   functions ONLY resolve which tenant a resource belongs to.
--
--   evalhr_list_active_positions_catalog() replaces the shared-client
--   "availablePositions" read (business rule: candidates may apply to ANY
--   company's active position — read-only catalog, no candidate PII).
-- ============================================================

CREATE OR REPLACE FUNCTION evalhr_find_position_tenant(p_id TEXT)
RETURNS TABLE (
  "id"               TEXT,
  "companyId"        TEXT,
  "title"            TEXT,
  "category"         TEXT,
  "hasKnowledgeTest" BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN QUERY
  SELECT po.id, po."companyId", po.title, po.category, po."hasKnowledgeTest"
  FROM public."Position" po
  WHERE po.id = p_id
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION evalhr_find_user_tenant(p_id TEXT)
RETURNS TABLE (
  "id"         TEXT,
  "companyId"  TEXT,
  "role"       TEXT,
  "email"      TEXT,
  "name"       TEXT,
  "active"     BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u."companyId", u.role, u.email, u.name, u.active
  FROM public."User" u
  WHERE u.id = p_id
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION evalhr_find_session_tenant(p_id TEXT)
RETURNS TABLE (
  "id"        TEXT,
  "companyId" TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN QUERY
  SELECT es.id, es."companyId"
  FROM public."EvaluationSession" es
  WHERE es.id = p_id
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION evalhr_find_interview_tenant(p_id TEXT)
RETURNS TABLE (
  "id"        TEXT,
  "companyId" TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN QUERY
  SELECT i.id, i."companyId"
  FROM public."InterviewSchedule" i
  WHERE i.id = p_id
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION evalhr_find_invitation_tenant(p_id TEXT)
RETURNS TABLE (
  "id"        TEXT,
  "companyId" TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN QUERY
  SELECT ci.id, ci."companyId"
  FROM public."CandidateInvitation" ci
  WHERE ci.id = p_id
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION evalhr_find_vacancy_tenant(p_id TEXT)
RETURNS TABLE (
  "id"        TEXT,
  "companyId" TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN QUERY
  SELECT v.id, v."companyId"
  FROM public."Vacancy" v
  WHERE v.id = p_id
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION evalhr_company_exists(p_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public."Company" c WHERE c.id = p_id);
END;
$$;

-- Candidate/SA-aggregate global catalog of active positions.
-- Business rule preserved verbatim: "candidates may apply to ANY company's
-- position". Read-only, no candidate PII. Returns ONE JSON array whose
-- elements mirror the previous Prisma shape:
--   { ...Position scalars, company: {id,name,sector},
--     evaluationTemplates: [{id, type, _count: {questions}}] (order asc) }
CREATE OR REPLACE FUNCTION evalhr_list_active_positions_catalog()
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x.sector, x.title), '[]'::json)
    FROM (
      SELECT
        p.id, p.title, p.sector, p.category, p.description,
        p."hasKnowledgeTest", p.active, p.status, p."createdAt", p."updatedAt",
        p."companyId",
        json_build_object('id', c.id, 'name', c.name, 'sector', c.sector) AS company,
        (
          SELECT COALESCE(json_agg(json_build_object(
                     'id', t.id, 'type', t.type,
                     '_count', json_build_object('questions', (
                       SELECT count(*) FROM public."Question" q WHERE q."evaluationTemplateId" = t.id
                     ))
                 ) ORDER BY t."order"), '[]'::json)
          FROM public."EvaluationTemplate" t
          WHERE t."positionId" = p.id
        ) AS "evaluationTemplates"
      FROM public."Position" p
      LEFT JOIN public."Company" c ON c.id = p."companyId"
      WHERE p.active = true
    ) x
  );
END;
$$;

-- EXECUTE: evalhr_app only (PUBLIC revoked), same model as STEP 7 above.
REVOKE ALL ON FUNCTION evalhr_find_position_tenant(TEXT)              FROM PUBLIC;
REVOKE ALL ON FUNCTION evalhr_find_user_tenant(TEXT)                  FROM PUBLIC;
REVOKE ALL ON FUNCTION evalhr_find_session_tenant(TEXT)               FROM PUBLIC;
REVOKE ALL ON FUNCTION evalhr_find_interview_tenant(TEXT)             FROM PUBLIC;
REVOKE ALL ON FUNCTION evalhr_find_invitation_tenant(TEXT)            FROM PUBLIC;
REVOKE ALL ON FUNCTION evalhr_find_vacancy_tenant(TEXT)               FROM PUBLIC;
REVOKE ALL ON FUNCTION evalhr_company_exists(TEXT)                    FROM PUBLIC;
REVOKE ALL ON FUNCTION evalhr_list_active_positions_catalog()         FROM PUBLIC;

GRANT EXECUTE ON FUNCTION evalhr_find_position_tenant(TEXT)              TO evalhr_app;
GRANT EXECUTE ON FUNCTION evalhr_find_user_tenant(TEXT)                  TO evalhr_app;
GRANT EXECUTE ON FUNCTION evalhr_find_session_tenant(TEXT)               TO evalhr_app;
GRANT EXECUTE ON FUNCTION evalhr_find_interview_tenant(TEXT)             TO evalhr_app;
GRANT EXECUTE ON FUNCTION evalhr_find_invitation_tenant(TEXT)            TO evalhr_app;
GRANT EXECUTE ON FUNCTION evalhr_find_vacancy_tenant(TEXT)               TO evalhr_app;
GRANT EXECUTE ON FUNCTION evalhr_company_exists(TEXT)                    TO evalhr_app;
GRANT EXECUTE ON FUNCTION evalhr_list_active_positions_catalog()         TO evalhr_app;

-- Ownership: same model as STEP 7 — functions belong to evalhr_secdef
-- (NOLOGIN). Without this, CREATE as superuser leaves owner=postgres and
-- the SECURITY DEFINER would run with superuser rights (defeats the model).
ALTER FUNCTION evalhr_find_position_tenant(TEXT)              OWNER TO evalhr_secdef;
ALTER FUNCTION evalhr_find_user_tenant(TEXT)                  OWNER TO evalhr_secdef;
ALTER FUNCTION evalhr_find_session_tenant(TEXT)               OWNER TO evalhr_secdef;
ALTER FUNCTION evalhr_find_interview_tenant(TEXT)             OWNER TO evalhr_secdef;
ALTER FUNCTION evalhr_find_invitation_tenant(TEXT)            OWNER TO evalhr_secdef;
ALTER FUNCTION evalhr_find_vacancy_tenant(TEXT)               OWNER TO evalhr_secdef;
ALTER FUNCTION evalhr_company_exists(TEXT)                    OWNER TO evalhr_secdef;
ALTER FUNCTION evalhr_list_active_positions_catalog()         OWNER TO evalhr_secdef;

-- evalhr_secdef needs SELECT on the additional tables referenced here
-- (EvaluationSession, InterviewSchedule, EvaluationTemplate, Question were
-- not part of the D.3 bootstrap surface):
GRANT SELECT ON TABLE public."EvaluationSession"    TO evalhr_secdef;
GRANT SELECT ON TABLE public."InterviewSchedule"    TO evalhr_secdef;
GRANT SELECT ON TABLE public."EvaluationTemplate"   TO evalhr_secdef;
GRANT SELECT ON TABLE public."Question"             TO evalhr_secdef;
