#!/usr/bin/env python3
"""Convert AUDITORIA_EVALUHR.md to a styled PDF via HTML + weasyprint."""
import re
import subprocess
from pathlib import Path

MD_FILE = Path("/home/z/my-project/AUDITORIA_EVALUHR.md")
HTML_FILE = Path("/home/z/my-project/AUDITORIA_EVALUHR.html")
PDF_FILE = Path("/home/z/my-project/public/AUDITORIA_EVALUHR.pdf")

# Read markdown
md = MD_FILE.read_text(encoding="utf-8")

# Replace emoji severity markers with textual equivalents (safe rendering)
md = md.replace("🔴 CRÍTICO", "**CRÍTICO**")
md = md.replace("🟠 ALTO", "**ALTO**")
md = md.replace("🟡 MEDIO", "**MEDIO**")
md = md.replace("🟢 BAJO", "**BAJO**")
md = md.replace("🔴", "[!]")
md = md.replace("🟠", "[!]")
md = md.replace("🟡", "[!]")
md = md.replace("🟢", "[!]")
md = md.replace("✅", "[OK]")
md = md.replace("❌", "[X]")
md = md.replace("⚠️", "[!]")
md = md.replace("⚠", "[!]")
md = md.replace("🛡️", "")
md = md.replace("📌", "")

# Convert markdown to HTML body via pandoc
result = subprocess.run(
    ["pandoc", "--from=markdown", "--to=html5", "--no-highlight"],
    input=md,
    capture_output=True,
    text=True,
    check=True,
)
body_html = result.stdout

# Build full styled HTML
full_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Auditoría Técnica y Funcional de EvaluHR</title>
<style>
  @page {{
    size: A4;
    margin: 18mm 16mm 20mm 16mm;
    @bottom-center {{
      content: counter(page) " / " counter(pages);
      font-size: 9pt;
      color: #6b7280;
    }}
    @top-center {{
      content: "Auditoría EvaluHR — Confidencial";
      font-size: 8pt;
      color: #9ca3af;
    }}
  }}
  @page :first {{
    @top-center {{ content: ""; }}
  }}
  * {{ box-sizing: border-box; }}
  html, body {{
    margin: 0;
    padding: 0;
    font-family: 'Helvetica Neue', 'Arial', 'Noto Sans', sans-serif;
    font-size: 10pt;
    line-height: 1.5;
    color: #1f2937;
    background: #ffffff;
  }}
  h1 {{
    font-size: 22pt;
    color: #0f766e;
    border-bottom: 3px solid #0f766e;
    padding-bottom: 8px;
    margin-top: 0;
    margin-bottom: 16px;
    line-height: 1.2;
  }}
  h2 {{
    font-size: 15pt;
    color: #ffffff;
    background: #0f766e;
    padding: 6px 12px;
    margin-top: 28px;
    margin-bottom: 12px;
    border-radius: 4px;
    page-break-after: avoid;
    page-break-before: auto;
  }}
  h3 {{
    font-size: 12pt;
    color: #115e59;
    border-left: 4px solid #14b8a6;
    padding-left: 10px;
    margin-top: 20px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }}
  h4 {{
    font-size: 11pt;
    color: #0f766e;
    margin-top: 14px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }}
  p {{ margin: 6px 0; }}
  ul, ol {{ margin: 6px 0 6px 22px; padding: 0; }}
  li {{ margin: 3px 0; }}
  code {{
    font-family: 'Menlo', 'Consolas', 'Courier New', monospace;
    background: #f1f5f9;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 9pt;
    color: #be123c;
  }}
  pre {{
    background: #0f172a;
    color: #e2e8f0;
    padding: 12px 14px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 8.5pt;
    line-height: 1.4;
    page-break-inside: avoid;
  }}
  pre code {{
    background: transparent;
    color: inherit;
    padding: 0;
  }}
  table {{
    border-collapse: collapse;
    width: 100%;
    margin: 10px 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }}
  th {{
    background: #0f766e;
    color: white;
    padding: 6px 8px;
    text-align: left;
    border: 1px solid #0f766e;
    font-weight: 600;
  }}
  td {{
    padding: 5px 8px;
    border: 1px solid #d1d5db;
    vertical-align: top;
  }}
  tr:nth-child(even) td {{ background: #f9fafb; }}
  tr:nth-child(odd) td {{ background: #ffffff; }}
  blockquote {{
    border-left: 4px solid #f59e0b;
    background: #fffbeb;
    padding: 8px 14px;
    margin: 10px 0;
    color: #78350f;
    font-style: italic;
  }}
  hr {{
    border: none;
    border-top: 1px solid #d1d5db;
    margin: 18px 0;
  }}
  strong {{ color: #111827; }}
  a {{ color: #0f766e; text-decoration: none; }}
  /* Cover page */
  .cover {{
    page-break-after: always;
    text-align: center;
    padding-top: 60mm;
  }}
  .cover h1 {{
    font-size: 32pt;
    border: none;
    color: #0f766e;
    margin-bottom: 8px;
  }}
  .cover .subtitle {{
    font-size: 14pt;
    color: #4b5563;
    margin-bottom: 30mm;
  }}
  .cover .meta {{
    font-size: 10pt;
    color: #6b7280;
    line-height: 2;
  }}
</style>
</head>
<body>
  <div class="cover">
    <h1>AUDITORÍA TÉCNICA Y FUNCIONAL DE EVALUHR</h1>
    <div class="subtitle">Revisión para análisis jurídico y de cumplimiento bajo legislación mexicana<br/>(LFPDPPP, NOM-035-STPS-2018, Art. 37 Bis)</div>
    <div class="meta">
      <strong>Base de evidencia:</strong> Código fuente en /home/z/my-project<br/>
      <strong>Alcance:</strong> 22 rutas API · 16 modelos Prisma · 4 plantillas de evaluación<br/>
      <strong>Verificabilidad:</strong> Cada afirmación incluye archivo y línea citable<br/>
      <strong>Fecha:</strong> 2025-07-25<br/>
      <strong>Commit base:</strong> 1249353<br/>
      <strong>Documento:</strong> Confidencial — para revisión jurídica
    </div>
  </div>
  {body_html}
</body>
</html>
"""

HTML_FILE.write_text(full_html, encoding="utf-8")
print(f"HTML generado: {HTML_FILE}")

# Convert HTML to PDF with weasyprint
subprocess.run(
    ["weasyprint", str(HTML_FILE), str(PDF_FILE)],
    check=True,
)
print(f"PDF generado: {PDF_FILE}")
print(f"Tamaño: {PDF_FILE.stat().st_size / 1024:.1f} KB")
