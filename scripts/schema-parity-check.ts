/**
 * FASE 3.5-I.1 — READ-ONLY structural parity check:
 *   prisma/schema.prisma  (source of truth — dev/tests/RLS artifacts)
 *   prisma/schema.prod.prisma (deploy datasource: postgresql + directUrl)
 *
 * Compares: models, fields (name/type/optional + attributes incl. @relation
 * onDelete/onUpdate normalized), @@index/@@unique/@@map directives, enums.
 * Zero writes, zero DB access. Implements the parity-in-CI recommendation
 * registered in INFORME_FASE_3.5-H.md §10.
 *
 * Usage: bun scripts/schema-parity-check.ts   → exit 0 = parity, 1 = drift
 */
import { readFileSync } from 'fs'

const A_PATH = 'prisma/schema.prisma'
const B_PATH = 'prisma/schema.prod.prisma'

function stripComments(src: string): string {
  return src
    .split('\n')
    .filter((l) => !l.trim().startsWith('//'))
    .join('\n')
}

function extractBlocks(src: string, kind: 'model' | 'enum'): Map<string, string> {
  const map = new Map<string, string>()
  const re = new RegExp(`${kind}\\s+(\\w+)\\s*\\{`, 'g')
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    const name = m[1]
    const start = m.index + m[0].length
    let depth = 1
    let i = start
    while (i < src.length && depth > 0) {
      if (src[i] === '{') depth++
      else if (src[i] === '}') depth--
      i++
    }
    map.set(name, src.slice(start, i - 1))
  }
  return map
}

function normWs(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

/** Normalize a field line: name, type, optional flag, normalized attributes. */
function parseField(
  line: string
): { name: string; type: string; optional: boolean; attrs: string } | null {
  // Strip inline comments — they are documentation, not structure.
  const noComment = line.replace(/\/\/.*$/, '').trim()
  const t = noComment
  if (t.length === 0 || t.startsWith('@@')) return null
  const m = t.match(/^(\w+)\s+(\w+)(\?)?\s*(.*)$/)
  if (!m) return null
  const [, name, type, opt, rawAttrs] = m
  let attrs = rawAttrs || ''
  // Normalize @relation(...) args: sort comma-separated key=val pairs so
  // argument ORDER differences don't produce false positives.
  attrs = attrs.replace(/@relation\s*\(([^)]*)\)/g, (_full, args: string) => {
    const parts = args
      .split(',')
      .map((p) => normWs(p))
      .filter((p) => p.length > 0)
      .sort()
    return `@relation(${parts.join(', ')})`
  })
  return { name, type, optional: !!opt, attrs: normWs(attrs) }
}

function parseModelBody(body: string) {
  const fields = new Map<string, string>()
  const directives = new Set<string>()
  for (const raw of body.split('\n')) {
    const line = raw.trim()
    if (line.length === 0) continue
    if (line.startsWith('@@')) {
      directives.add(normWs(line))
      continue
    }
    const f = parseField(line)
    if (f) fields.set(f.name, `${f.type}${f.optional ? '?' : ''} ${f.attrs}`.trim())
  }
  return { fields, directives }
}

function main() {
  const srcA = stripComments(readFileSync(A_PATH, 'utf8'))
  const srcB = stripComments(readFileSync(B_PATH, 'utf8'))
  const A = extractBlocks(srcA, 'model')
  const B = extractBlocks(srcB, 'model')
  const EA = extractBlocks(srcA, 'enum')
  const EB = extractBlocks(srcB, 'enum')

  let issues = 0
  const namesA = Array.from(A.keys()).sort()
  const namesB = Array.from(B.keys()).sort()
  console.log(`models schema.prisma:      ${namesA.length}`)
  console.log(`models schema.prod.prisma: ${namesB.length}`)
  for (const n of namesA) if (!B.has(n)) { console.log(`❌ MISSING in prod: model ${n}`); issues++ }
  for (const n of namesB) if (!A.has(n)) { console.log(`❌ MISSING in dev:  model ${n}`); issues++ }

  const enumA = Array.from(EA.keys()).sort()
  const enumB = Array.from(EB.keys()).sort()
  console.log(`enums: ${enumA.join(', ') || '(none)'} | prod: ${enumB.join(', ') || '(none)'}`)
  for (const n of enumA) if (!EB.has(n)) { console.log(`❌ MISSING in prod: enum ${n}`); issues++ }
  for (const n of enumB) if (!A.has(n)) { console.log(`❌ MISSING in dev:  enum ${n}`); issues++ }

  for (const name of namesA) {
    if (!B.has(name)) continue
    const pa = parseModelBody(A.get(name)!)
    const pb = parseModelBody(B.get(name)!)
    const fa = Array.from(pa.fields.keys()).sort()
    const fb = Array.from(pb.fields.keys()).sort()
    for (const f of fa) {
      if (!pb.fields.has(f)) { console.log(`❌ ${name}.${f}: MISSING in prod`); issues++ }
      else if (pa.fields.get(f) !== pb.fields.get(f)) {
        console.log(`❌ ${name}.${f} DIFF:\n   dev : ${pa.fields.get(f)}\n   prod: ${pb.fields.get(f)}`)
        issues++
      }
    }
    for (const f of fb) if (!pa.fields.has(f)) { console.log(`❌ ${name}.${f}: MISSING in dev`); issues++ }
    for (const d of pa.directives) if (!pb.directives.has(d)) { console.log(`❌ ${name} directive only in dev:  ${d}`); issues++ }
    for (const d of pb.directives) if (!pa.directives.has(d)) { console.log(`❌ ${name} directive only in prod: ${d}`); issues++ }
  }

  for (const name of enumA) {
    if (!EB.has(name)) continue
    const va = EA.get(name)!.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//')).sort()
    const vb = EB.get(name)!.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//')).sort()
    if (JSON.stringify(va) !== JSON.stringify(vb)) {
      console.log(`❌ enum ${name} DIFF:\n   dev : ${va.join(' | ')}\n   prod: ${vb.join(' | ')}`)
      issues++
    }
  }

  console.log('─'.repeat(60))
  if (issues === 0) {
    console.log(`✅ PARITY OK — ${namesA.length}/${namesB.length} modelos, ${enumA.length} enums, campos/directivas idénticos`)
    process.exit(0)
  } else {
    console.log(`❌ PARITY FAIL — ${issues} diferencias estructurales`)
    process.exit(1)
  }
}

main()
