/**
 * Consent Versioning & Re-consent Management (Phase 3.5 — B6)
 *
 * Implements:
 * 1. Single source of truth for the current consent version
 * 2. Per-version materiality flag (material changes require re-consent)
 * 3. Comparison logic to determine if re-consent is needed
 *
 * IMPORTANT: The version string is a label. The materiality flag is what
 * determines whether a change requires new consent. Minor changes (typos,
 * formatting) do NOT require re-consent. Material changes (new finalidad,
 * new data categories, new proveedores, new transferencias) DO require it.
 *
 * When a material change is published:
 *   1. Add a new entry to PRIVACY_VERSIONS with material: true
 *   2. Bump CURRENT_CONSENT_VERSION to match
 *   3. On next login, candidates with consentVersion < CURRENT will be
 *      flagged for re-consent.
 *
 * The decision of whether a change is "material" is a JURIDIC/ADMINISTRATIVE
 * decision, not a technical one. This config flag is set by the product/legal
 * team, not by developers.
 */

/**
 * Privacy notice version registry.
 *
 * Each entry documents:
 * - version: the version string (format: YYYY-MM-vN)
 * - material: true if the change requires re-consent (LFPDPPP Art. 8 / Art. 35)
 * - description: what changed (for audit purposes)
 * - date: when the version was published
 */
export const PRIVACY_VERSIONS = [
  {
    version: '2026-01-v1',
    material: true,
    description: 'Initial release — baseline privacy notice',
    date: '2026-01-01',
  },
  {
    version: '2026-01-v2',
    material: false, // minor formatting/typo fixes — no re-consent needed
    description: 'Minor formatting fixes in section 5',
    date: '2026-01-15',
  },
  {
    version: '2026-02-v1',
    material: true, // MATERIAL CHANGE — requires re-consent
    description: 'TEST VERSION — added new data category (retention policy change)',
    date: '2026-02-01',
  },
] as const

/**
 * The current consent version. This is the version that NEW consents will be
 * stamped with. Existing consents are checked against this to determine if
 * re-consent is needed.
 *
 * To publish a new version:
 *   1. Add an entry to PRIVACY_VERSIONS above
 *   2. Update CURRENT_CONSENT_VERSION below to match
 */
export const CURRENT_CONSENT_VERSION = '2026-02-v1'

/**
 * Determine if a candidate needs to re-consent based on their stored version.
 *
 * Logic:
 *   - If candidate has no consentVersion → they need to consent (first time)
 *   - If candidate's version matches CURRENT → no re-consent needed
 *   - If candidate's version is older → check if any version between theirs
 *     and CURRENT is marked as `material: true`. If yes, re-consent required.
 *
 * @param storedVersion The version the candidate consented to (from User.consentVersion)
 * @returns { needsReconsent: boolean, reason?: string }
 */
export function needsReconsent(storedVersion: string | null | undefined): {
  needsReconsent: boolean
  reason?: string
} {
  if (!storedVersion) {
    return { needsReconsent: true, reason: 'No consent version on record — first-time consent required' }
  }

  if (storedVersion === CURRENT_CONSENT_VERSION) {
    return { needsReconsent: false }
  }

  // Find the candidate's version in the registry
  const storedEntry = PRIVACY_VERSIONS.find(v => v.version === storedVersion)
  if (!storedEntry) {
    // Unknown version — assume material change, require re-consent
    return {
      needsReconsent: true,
      reason: `Unknown consent version '${storedVersion}' — re-consent required for safety`,
    }
  }

  // Find the current version in the registry
  const currentEntry = PRIVACY_VERSIONS.find(v => v.version === CURRENT_CONSENT_VERSION)
  if (!currentEntry) {
    // CURRENT_CONSENT_VERSION not in registry — this is a bug
    console.error('[consent-version] CURRENT_CONSENT_VERSION not found in PRIVACY_VERSIONS registry')
    return { needsReconsent: false } // fail safe: don't block on config error
  }

  // Check if any version BETWEEN stored and current is material
  const storedIndex = PRIVACY_VERSIONS.indexOf(storedEntry)
  const currentIndex = PRIVACY_VERSIONS.indexOf(currentEntry)

  if (storedIndex === currentIndex) {
    return { needsReconsent: false }
  }

  // If stored is NEWER than current (shouldn't happen, but handle gracefully)
  if (storedIndex > currentIndex) {
    return { needsReconsent: false }
  }

  // Check all versions between stored (exclusive) and current (inclusive)
  for (let i = storedIndex + 1; i <= currentIndex; i++) {
    if (PRIVACY_VERSIONS[i].material) {
      return {
        needsReconsent: true,
        reason: `Material change detected in version ${PRIVACY_VERSIONS[i].version}: ${PRIVACY_VERSIONS[i].description}`,
      }
    }
  }

  // No material changes between stored and current
  return { needsReconsent: false }
}
