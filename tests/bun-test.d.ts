/**
 * Declaración mínima de tipos para bun:test (bun los provee en runtime).
 * Evita errores TS2307 en `bunx tsc --noEmit` para los archivos de test
 * (tests/knowledge-scoring.test.ts — A-03.2 — y tests/knowledge-blueprint.test.ts
 * — A-03.3) sin instalar dependencias adicionales.
 */
declare module 'bun:test' {
  export function describe(name: string, fn: () => void): void
  export function test(name: string, fn: () => void | Promise<void>): void
  export function it(name: string, fn: () => void | Promise<void>): void
  export function beforeAll(fn: () => void | Promise<void>): void
  export function afterAll(fn: () => void | Promise<void>): void
  export function beforeEach(fn: () => void | Promise<void>): void
  export function afterEach(fn: () => void | Promise<void>): void
  export function expect(value: unknown): any
}
