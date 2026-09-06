import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/prefer-as-const": "off",
    "@typescript-eslint/no-unused-disable-directive": "off",
    
    // React rules
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/purity": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/prop-types": "off",
    "react-compiler/react-compiler": "off",
    
    // Next.js rules
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": "off",
    
    // General JavaScript rules
    "prefer-const": "off",
    "no-unused-vars": "off",
    "no-console": "off",
    "no-debugger": "off",
    "no-empty": "off",
    "no-irregular-whitespace": "off",
    "no-case-declarations": "off",
    "no-fallthrough": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-redeclare": "off",
    "no-undef": "off",
    "no-unreachable": "off",
    "no-useless-escape": "off",
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "examples/**", "skills/**", "scripts/**"]
}, {
  // ════════════════════════════════════════════════════════════
  // FASE 3.5-D.2.8 — ADMIN DB ARCHITECTURAL GUARD
  // src/lib/admin-db.ts is the isolated SA AGGREGATE mechanism
  // (server-only, audited). Tenant routes/components must NEVER
  // import it. Only the aggregate endpoints below are whitelisted.
  //
  // PHASE 3.5-H (VUL-H6): the whitelist grows from 3 to 7 — SA global
  // lists (users/interviews/vacancies/positions) were moved OFF the
  // shared unscoped client and ONTO the audited admin-db channel via
  // the getAggregate*Directory()/getAggregatePositionCatalog() functions.
  // Every other file in the repo remains restricted.
  // ════════════════════════════════════════════════════════════
  files: ["**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": ["error", {
      patterns: [{
        group: ["@/lib/admin-db", "@/lib/admin-db/*", "src/lib/admin-db", "./admin-db", "../lib/admin-db"],
        message: "admin-db is the isolated SA AGGREGATE mechanism (global administrative access). Only /api/dashboard, /api/results, /api/candidates, /api/users, /api/interviews, /api/vacancies and /api/positions aggregate branches may import it, and only through the high-level getAggregate*Metrics()/getAggregate*Directory()/getAggregatePositionCatalog() functions. Tenant endpoints must use createRLSClient()/createSuperAdminRLSClient() from @/lib/rls."
      }]
    }]
  }
}, {
  files: [
    "src/app/api/dashboard/route.ts",
    "src/app/api/results/route.ts",
    "src/app/api/candidates/route.ts",
    "src/app/api/users/route.ts",
    "src/app/api/interviews/route.ts",
    "src/app/api/vacancies/route.ts",
    "src/app/api/positions/route.ts",
  ],
  rules: {
    "no-restricted-imports": "off"
  }
}];

export default eslintConfig;
