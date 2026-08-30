/**
 * HTML Sanitization utility (Phase 3.5 — B8)
 *
 * Prevents Stored XSS by sanitizing any HTML content stored in the DB
 * that could later be rendered to candidates or admins.
 *
 * Uses isomorphic-dompurify (works on both server and client).
 *
 * Whitelist: only safe formatting tags are allowed.
 * All scripts, event handlers, javascript: URLs, and dangerous tags are stripped.
 */
import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content for safe storage/rendering.
 *
 * Allowed tags: basic formatting (p, br, strong, em, ul, ol, li, h1-h6, table, etc.)
 * Forbidden: script, iframe, object, embed, form, input, style, link, meta, base.
 * All event handlers (onclick, onerror, etc.) are stripped.
 * javascript: URLs are stripped from href/src.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return ''

  return DOMPurify.sanitize(dirty, {
    // Whitelist of allowed tags — excludes script, iframe, object, embed, form, etc.
    ALLOWED_TAGS: [
      'p', 'br', 'hr', 'strong', 'em', 'b', 'i', 'u', 's', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a', 'img',
      'blockquote', 'pre', 'code',
      'dl', 'dt', 'dd',
    ],
    // Whitelist of allowed attributes — excludes event handlers, style, etc.
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'colspan', 'rowspan', 'target', 'rel'],
    // Explicitly forbid these tags (defense-in-depth)
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'style', 'link', 'meta', 'base', 'svg', 'math'],
    // Explicitly forbid these attributes (event handlers, etc.)
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'style'],
    // Strip data-URIs from img src (can be used for XSS in some browsers)
    ALLOW_DATA_ATTR: false,
    // Don't allow any protocols except http, https, mailto
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):)/i,
  })
}

/**
 * Escape HTML special characters for plain-text rendering.
 * Use this when you want to render user content as text (not HTML).
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
