#!/usr/bin/env python3
"""
Generate Aviso de Privacidad y Consentimiento — EvaluHR
With all original sections PLUS new legal sections per requirements.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ── Fonts ──────────────────────────────────────────────────────
FONT_DIR = '/usr/share/fonts'
pdfmetrics.registerFont(TTFont('NotoSerifSC', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerifSC-Bold', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerifSC-Medium', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Medium.ttf'))
registerFontFamily('NotoSerifSC', normal='NotoSerifSC', bold='NotoSerifSC-Bold')

# ── Colors ─────────────────────────────────────────────────────
NAVY      = HexColor('#1B2A4A')
DARK_BLUE = HexColor('#2C3E6B')
ACCENT    = HexColor('#3B7DD8')
LIGHT_BG  = HexColor('#F0F4FA')
DARK_TEXT  = HexColor('#1A1A2E')
MEDIUM_TEXT = HexColor('#333344')
LIGHT_LINE = HexColor('#C5D0E0')
WHITE     = HexColor('#FFFFFF')
RED_ACCENT = HexColor('#C0392B')

# ── Styles ─────────────────────────────────────────────────────
styles = getSampleStyleSheet()

style_title = ParagraphStyle(
    'CustomTitle', fontName='NotoSerifSC-Bold', fontSize=20,
    leading=26, textColor=NAVY, alignment=TA_CENTER, spaceAfter=4
)
style_subtitle = ParagraphStyle(
    'CustomSubtitle', fontName='NotoSerifSC-Medium', fontSize=11,
    leading=15, textColor=ACCENT, alignment=TA_CENTER, spaceAfter=2
)
style_date = ParagraphStyle(
    'CustomDate', fontName='NotoSerifSC', fontSize=9,
    leading=13, textColor=MEDIUM_TEXT, alignment=TA_CENTER, spaceAfter=12
)
style_h1 = ParagraphStyle(
    'H1', fontName='NotoSerifSC-Bold', fontSize=13,
    leading=18, textColor=NAVY, spaceBefore=14, spaceAfter=6
)
style_h2 = ParagraphStyle(
    'H2', fontName='NotoSerifSC-Bold', fontSize=11,
    leading=15, textColor=DARK_BLUE, spaceBefore=10, spaceAfter=4
)
style_body = ParagraphStyle(
    'Body', fontName='NotoSerifSC', fontSize=9.5,
    leading=14, textColor=DARK_TEXT, alignment=TA_JUSTIFY, spaceAfter=4
)
style_bullet = ParagraphStyle(
    'Bullet', fontName='NotoSerifSC', fontSize=9.5,
    leading=14, textColor=DARK_TEXT, alignment=TA_JUSTIFY,
    leftIndent=18, bulletIndent=6, spaceAfter=3
)
style_bold_bullet = ParagraphStyle(
    'BoldBullet', fontName='NotoSerifSC-Bold', fontSize=9.5,
    leading=14, textColor=DARK_TEXT, alignment=TA_JUSTIFY,
    leftIndent=18, bulletIndent=6, spaceAfter=3
)
style_important = ParagraphStyle(
    'Important', fontName='NotoSerifSC-Bold', fontSize=9.5,
    leading=14, textColor=RED_ACCENT, alignment=TA_JUSTIFY,
    spaceBefore=6, spaceAfter=6, borderPadding=6,
    backColor=HexColor('#FFF5F5'), borderColor=RED_ACCENT,
    borderWidth=1, borderRadius=3
)
style_footer = ParagraphStyle(
    'Footer', fontName='NotoSerifSC', fontSize=8,
    leading=11, textColor=MEDIUM_TEXT, alignment=TA_CENTER, spaceBefore=12
)
style_table_header = ParagraphStyle(
    'TableHeader', fontName='NotoSerifSC-Bold', fontSize=9,
    leading=13, textColor=WHITE, alignment=TA_CENTER
)
style_table_cell = ParagraphStyle(
    'TableCell', fontName='NotoSerifSC', fontSize=8.5,
    leading=12, textColor=DARK_TEXT, alignment=TA_JUSTIFY
)

# ── Helpers ────────────────────────────────────────────────────
def hr():
    return HRFlowable(width="100%", thickness=0.8, color=LIGHT_LINE,
                       spaceBefore=4, spaceAfter=4)

def section(num, title):
    """Main numbered section heading."""
    return Paragraph(f'{num}. {title}', style_h1)

def subsection(num, title):
    """Sub-numbered section heading (e.g. 1.1)."""
    return Paragraph(f'{num} {title}', style_h2)

def body(text):
    return Paragraph(text, style_body)

def bullet(text):
    return Paragraph(f'• {text}', style_bullet)

def bold_bullet(text):
    return Paragraph(f'• {text}', style_bold_bullet)

def important(text):
    return Paragraph(f'<b>AVISO IMPORTANTE:</b> {text}', style_important)

def spacer(h=6):
    return Spacer(1, h)

# ── Build Document ─────────────────────────────────────────────
OUTPUT = '/home/z/my-project/public/Aviso_de_Privacidad_Consentimiento_EvaluHR.pdf'

doc = SimpleDocTemplate(
    OUTPUT, pagesize=letter,
    topMargin=2*cm, bottomMargin=2*cm,
    leftMargin=2.5*cm, rightMargin=2.5*cm,
    title='Aviso de Privacidad y Consentimiento — EvaluHR',
    author='EvaluHR — Sistema de Pre-evaluación de Personal',
    creator='EvaluHR'
)

story = []

# ── Header ─────────────────────────────────────────────────────
story.append(Paragraph('EvaluHR', ParagraphStyle(
    'Brand', fontName='NotoSerifSC-Bold', fontSize=24,
    leading=30, textColor=NAVY, alignment=TA_CENTER, spaceAfter=2
)))
story.append(Paragraph('Sistema de Pre-evaluación de Personal', style_subtitle))
story.append(spacer(10))
story.append(Paragraph(
    'AVISO DE PRIVACIDAD Y CONSENTIMIENTO', style_title
))
story.append(Paragraph(
    'Documento vigente a partir de: 08 de agosto de 2026', style_date
))
story.append(hr())
story.append(spacer(4))

# ── Section 1 ──────────────────────────────────────────────────
story.append(section(1, 'Responsable del Tratamiento de Datos Personales'))
story.append(body(
    'El responsable del tratamiento de sus datos personales es la empresa que solicita '
    'la evaluación psicométrica, psicológica y de conocimientos a través de la plataforma '
    'EvaluHR (en adelante, "el Responsable"). El domicilio del Responsable se encuentra '
    'en Tuxtla Gutiérrez, Chiapas, México.'
))
story.append(body(
    'La plataforma EvaluHR actúa como encargado del tratamiento de datos personales, '
    'procesando la información por cuenta y bajo instrucciones del Responsable, conforme '
    'a lo establecido en la Ley Federal de Protección de Datos Personales en Posesión de '
    'los Particulares (LFPDPPP) y su Reglamento.'
))

# ── Section 1.1 (NEW) ──────────────────────────────────────────
story.append(subsection('1.1', 'EvaluHR como Encargado del Tratamiento'))
story.append(body(
    'Conforme a los artículos 3, fracción VI, y 14 de la LFPDPPP, EvaluHR es '
    '<b>Encargado del Tratamiento</b> de datos personales, en virtud de que:'
))
story.append(bullet(
    'Procesa datos personales exclusivamente por cuenta y bajo instrucciones del '
    'Responsable (la empresa contratante del servicio de evaluación).'
))
story.append(bullet(
    'No determina los fines ni los medios del tratamiento; su función se limita a '
    'alojar, operar y mantener la plataforma tecnológica de evaluación.'
))
story.append(bullet(
    'Se obliga a tratar los datos personales únicamente para las finalidades '
    'señaladas en el presente aviso de privacidad y conforme a las instrucciones '
    'del Responsable.'
))
story.append(bullet(
    'Adopta las medidas de seguridad técnicas, administrativas y físicas previstas '
    'en la Sección 8 del presente documento y en el contrato de prestación de '
    'servicios celebrado con el Responsable.'
))
story.append(bullet(
    'No transfiere, comercializa ni comparte los datos personales con terceros, '
    'salvo cuando medie instrucción expresa del Responsable o requerimiento legal.'
))
story.append(body(
    'La relación entre el Responsable y EvaluHR como Encargado se rige por un '
    'contrato de encargo de tratamiento de datos personales que cumple con los '
    'requisitos del artículo 14 del Reglamento de la LFPDPPP, incluyendo la '
    'identificación de las categorías de datos sujetas al encargo, las '
    'obligaciones de seguridad, y las causas de terminación del encargo.'
))
story.append(spacer(4))

# ── Section 2 ──────────────────────────────────────────────────
story.append(section(2, 'Datos Personales que se Recopilan'))
story.append(body(
    'Para llevar a cabo las evaluaciones psicométricas, psicológicas y de '
    'conocimientos, se recopilan los siguientes datos personales:'
))
story.append(bullet('Nombre completo del candidato'))
story.append(bullet('Correo electrónico del candidato'))
story.append(bullet('Teléfono (opcional, proporcionado voluntariamente)'))
story.append(bullet(
    'Respuestas a evaluaciones psicométricas (cuestionarios de personalidad Big Five)'
))
story.append(bullet(
    'Respuestas a evaluaciones psicológicas (factores de riesgo psicosocial, '
    'NOM-035-STPS-2018)'
))
story.append(bullet(
    'Resultados de evaluaciones de conocimientos específicos del puesto'
))
story.append(body(
    'De conformidad con la LFPDPPP, las respuestas a evaluaciones psicométricas y '
    'psicológicas son consideradas Datos Personales Sensibles, ya que revelan '
    'información sobre el estado de salud física o mental, así como características '
    'de la personalidad del titular. Su tratamiento está sujeto al consentimiento '
    'expreso y por escrito del titular de los datos.'
))

# ── Section 2.1 (NEW) ──────────────────────────────────────────
story.append(subsection('2.1', 'Identificación de Datos Sensibles'))
story.append(body(
    'De conformidad con el artículo 3, fracción VII, de la LFPDPPP, se consideran '
    '<b>datos personales sensibles</b> aquellos que afectan a la esfera más íntima del '
    'titular, o cuyo uso indebido puede dar origen a discriminación o conllevar un '
    'riesgo grave para éste. En el contexto de la plataforma EvaluHR, los siguientes '
    'datos son expresamente identificados como sensibles:'
))

# Sensitive data table
sensitive_data = [
    [Paragraph('<b>Dato Sensible</b>', style_table_header),
     Paragraph('<b>Categoría LFPDPPP</b>', style_table_header),
     Paragraph('<b>Fundamento de Sensibilidad</b>', style_table_header)],
    [Paragraph('Respuestas a cuestionarios de personalidad Big Five', style_table_cell),
     Paragraph('Salud y personalidad (Art. 3, fr. VII, inc. b)', style_table_cell),
     Paragraph('Revelan rasgos profundos de la personalidad, temperamento y '
               'características psicológicas del titular que pueden ser utilizados '
               'para perfilar o discriminar.', style_table_cell)],
    [Paragraph('Respuestas a evaluaciones de factores de riesgo psicosocial (NOM-035)', style_table_cell),
     Paragraph('Salud mental y entorno organizacional (Art. 3, fr. VII, inc. b)', style_table_cell),
     Paragraph('Revelan información sobre el estado de salud mental del titular, '
               'nivel de estrés, burnout, violencia laboral y otros factores de '
               'riesgo psicosocial.', style_table_cell)],
    [Paragraph('Resultados de evaluaciones psicológicas', style_table_cell),
     Paragraph('Salud mental (Art. 3, fr. VII, inc. b)', style_table_cell),
     Paragraph('Constituyen un diagnóstico o valoración del estado de salud mental '
               'y psicológico del titular, información especialmente protegida '
               'contra discriminación laboral.', style_table_cell)],
    [Paragraph('Resultados de evaluaciones de conocimientos', style_table_cell),
     Paragraph('Datos de identificación / capacidad profesional', style_table_cell),
     Paragraph('Aunque no son sensibles per se bajo la LFPDPPP, se tratan con '
               'nivel de protección reforzado por su naturaleza confidencial en '
               'el contexto de un proceso de selección.', style_table_cell)],
]

t_sensitive = Table(sensitive_data, colWidths=[3.8*cm, 3.8*cm, 8.4*cm])
t_sensitive.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('BACKGROUND', (0, 1), (-1, -1), LIGHT_BG),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
    ('GRID', (0, 0), (-1, -1), 0.5, LIGHT_LINE),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
]))
story.append(spacer(4))
story.append(t_sensitive)
story.append(spacer(4))
story.append(body(
    'El tratamiento de datos personales sensibles requiere el <b>consentimiento expreso '
    'y por escrito</b> del titular, de conformidad con el artículo 8 de la LFPDPPP. '
    'Dicho consentimiento se obtiene de forma separada del consentimiento para el '
    'tratamiento de datos personales generales, conforme a lo establecido en la '
    'Sección 10 del presente documento.'
))

# ── Section 3 ──────────────────────────────────────────────────
story.append(section(3, 'Finalidad del Tratamiento'))
story.append(body(
    'Los datos personales recopilados serán tratados para las siguientes finalidades:'
))
story.append(bullet(
    'Realizar pre-evaluaciones para procesos de reclutamiento y selección laboral'
))
story.append(bullet(
    'Generar perfiles de competencias y recomendaciones de idoneidad para el '
    'puesto evaluado'
))
story.append(bullet(
    'Facilitar el proceso de selección laboral, proporcionando al Responsable un '
    'reporte con los resultados de la evaluación'
))
story.append(bullet(
    'Cumplir con la obligación del patrón de identificar factores de riesgo '
    'psicosocial en el centro de trabajo (NOM-035-STPS-2018, LFT Art. 132)'
))
story.append(bullet(
    'Generar estadísticas internas anónimas y agregadas para mejorar los '
    'instrumentos de evaluación'
))
story.append(body(
    'Los datos personales no serán utilizados para finalidades distintas a las aquí '
    'señaladas sin el consentimiento expreso del titular.'
))

# ── Section 4 ──────────────────────────────────────────────────
story.append(section(4, 'Base Legal del Tratamiento'))
story.append(body(
    'El tratamiento de datos personales encuentra su fundamento en las siguientes '
    'disposiciones legales:'
))

legal_data = [
    [Paragraph('<b>Disposición Legal</b>', style_table_header),
     Paragraph('<b>Descripción y Aplicación</b>', style_table_header)],
    [Paragraph('LFPDPPP Art. 8', style_table_cell),
     Paragraph('Consentimiento expreso y por escrito para el tratamiento de datos '
               'personales sensibles. El titular otorga su consentimiento mediante la '
               'aceptación del presente aviso de privacidad antes de iniciar la evaluación.',
               style_table_cell)],
    [Paragraph('NOM-035-STPS-2018', style_table_cell),
     Paragraph('Identificación, análisis y prevención de factores de riesgo psicosocial '
               'en el centro de trabajo. Esta norma obliga al patrón a evaluar el entorno '
               'organizacional y los factores de riesgo psicosocial que afectan a los '
               'trabajadores.', style_table_cell)],
    [Paragraph('LFT Art. 132', style_table_cell),
     Paragraph('Obligaciones del patrón en la relación laboral, incluyendo la de '
               'proporcionar capacitación y adiestramiento necesarios para el desarrollo '
               'del trabajador, así como las condiciones de seguridad y salud en el trabajo.',
               style_table_cell)],
    [Paragraph('Reglamento de la LFPDPPP', style_table_cell),
     Paragraph('Disposiciones complementarias para el ejercicio de los derechos ARCO y la '
               'transferencia de datos personales.', style_table_cell)],
    [Paragraph('LFPDPPP Art. 14', style_table_cell),
     Paragraph('Obligaciones del Encargado del Tratamiento (EvaluHR): tratar datos '
               'únicamente conforme a instrucciones del Responsable, implementar medidas '
               'de seguridad, y no utilizar los datos para fines propios.', style_table_cell)],
    [Paragraph('Código de Comercio Art. 38', style_table_cell),
     Paragraph('Obligación de conservar registros y documentación soporte de actos de '
               'comercio por un plazo mínimo de 5 años.', style_table_cell)],
]

t_legal = Table(legal_data, colWidths=[4.2*cm, 11.8*cm])
t_legal.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
    ('GRID', (0, 0), (-1, -1), 0.5, LIGHT_LINE),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
]))
story.append(spacer(4))
story.append(t_legal)

# ── Section 5 ──────────────────────────────────────────────────
story.append(section(5, 'Destinatarios de los Datos Personales'))
story.append(body(
    'Los resultados de las evaluaciones serán compartidos exclusivamente con las '
    'siguientes personas dentro de la organización del Responsable:'
))
story.append(bullet(
    'Personal de Recursos Humanos de la empresa responsable del proceso de selección'
))
story.append(bullet(
    'Gerentes del área correspondiente al puesto evaluado, únicamente para efectos '
    'del proceso de selección'
))
story.append(body(
    'Los datos personales no serán compartidos con terceros ajenos a la organización '
    'del Responsable sin el consentimiento expreso del titular de los datos, salvo en '
    'los casos previstos por la LFPDPPP (Art. 10: excepciones al consentimiento).'
))

# ── Section 6 ──────────────────────────────────────────────────
story.append(section(6, 'Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)'))
story.append(body(
    'Conforme a la LFPDPPP y su Reglamento, usted tiene derecho a ejercer los '
    'siguientes derechos respecto de sus datos personales:'
))
story.append(bullet(
    '<b>Acceso:</b> Solicitar al Responsable acceso a sus datos personales tratados, '
    'para conocer qué información se tiene sobre usted y cómo ha sido utilizada.'
))
story.append(bullet(
    '<b>Rectificación:</b> Solicitar la corrección de sus datos personales cuando sean '
    'inexactos o incompletos. Esto incluye la actualización de nombre, correo '
    'electrónico o teléfono.'
))
story.append(bullet(
    '<b>Cancelación:</b> Solicitar la eliminación de sus datos personales de los '
    'archivos, registros o bases de datos del Responsable, cuando considere que su '
    'tratamiento no se ajusta a las disposiciones legales aplicables.'
))
story.append(bullet(
    '<b>Oposición:</b> Oponerse al tratamiento de sus datos personales para finalidades '
    'específicas, cuando tenga causa legítima para ello. El ejercicio de este derecho '
    'puede implicar la no continuación del proceso de evaluación o selección laboral.'
))
story.append(body(
    'Para ejercer cualquiera de estos derechos, deberá presentar su solicitud por '
    'escrito al área de Recursos Humanos del Responsable, acompañada de identificación '
    'oficial. El Responsable dará respuesta a su solicitud en un plazo máximo de 20 '
    'días hábiles conforme a la LFPDPPP.'
))

# ── Section 7 ──────────────────────────────────────────────────
story.append(section(7, 'Transferencia de Datos Personales'))
story.append(body(
    'Sus datos personales no serán transferidos a terceros nacionales o internacionales, '
    'salvo en los siguientes supuestos:'
))
story.append(bullet(
    'Cuando usted otorgue su consentimiento expreso para la transferencia.'
))
story.append(bullet(
    'Cuando la transferencia sea necesaria para cumplir con una obligación legal.'
))
story.append(bullet(
    'Cuando la transferencia sea necesaria para la prevención, diagnóstico, tratamiento '
    'o rehabilitación de la salud (Art. 10, fracción III, LFPDPPP).'
))
story.append(bullet(
    'Cuando la transferencia sea contractualmente necesaria para el cumplimiento del '
    'objeto del contrato que da origen al tratamiento.'
))

# ── Section 8 ──────────────────────────────────────────────────
story.append(section(8, 'Medidas de Seguridad'))
story.append(body(
    'El Responsable y EvaluHR han implementado medidas de seguridad técnicas, '
    'administrativas y físicas para proteger sus datos personales contra daño, pérdida, '
    'alteración, destrucción, uso, acceso o tratamiento no autorizado, incluyendo:'
))
story.append(bullet('Cifrado de datos en tránsito (TLS/HTTPS) y en reposo (cifrado de base de datos).'))
story.append(bullet('Control de acceso basado en roles (RBAC) y autenticación con credenciales seguras.'))
story.append(bullet('Aislamiento de datos por empresa (multi-tenancy con Row-Level Security).'))
story.append(bullet('Auditoría de accesos y modificaciones a datos personales.'))
story.append(bullet('Respaldo periódico y plan de recuperación ante desastres.'))
story.append(bullet(
    'Registro inmutable de consentimientos y revocaciones (_SHA-256 hashing_).'
))

# ── Section 9 (NEW) ────────────────────────────────────────────
story.append(section(9, 'Conservación y Eliminación de Datos'))
story.append(body(
    'El Responsable y EvaluHR observan las siguientes políticas de conservación y '
    'eliminación de datos personales, conforme a la legislación aplicable:'
))

story.append(subsection('9.1', 'Plazos de Conservación'))
story.append(bullet(
    '<b>Datos de identificación del candidato:</b> Se conservan durante el proceso '
    'de selección y hasta 3 años después de su conclusión, conforme a lo establecido '
    'por el Código de Comercio (Art. 38) para la conservación de registros de '
    'operaciones comerciales.'
))
story.append(bullet(
    '<b>Respuestas y resultados de evaluaciones psicométricas y psicológicas:</b> '
    'Se conservan por un plazo de 5 años contados a partir de la fecha de la '
    'evaluación, para efectos de auditoría interna y cumplimiento de la '
    'NOM-035-STPS-2018, que requiere la conservación de evidencia de las evaluaciones '
    'de factores de riesgo psicosocial.'
))
story.append(bullet(
    '<b>Resultados de evaluaciones de conocimientos:</b> Se conservan por el mismo '
    'plazo de 5 años para garantizar la trazabilidad del proceso de selección y '
    'atender cualquier reclamación o controversia derivada del mismo.'
))
story.append(bullet(
    '<b>Registros de consentimiento:</b> Se conservan por el plazo máximo de '
    'conservación de datos personales sensibles (5 años) como evidencia del '
    'cumplimiento de la obligación de obtener consentimiento expreso (LFPDPPP Art. 8).'
))

story.append(subsection('9.2', 'Eliminación o Anonimización'))
story.append(body(
    'Transcurridos los plazos de conservación señalados en la sección 9.1, los datos '
    'personales serán:'
))
story.append(bullet(
    '<b>Eliminados</b> de manera segura e irreversible de todas las bases de datos, '
    'respaldos y sistemas de EvaluHR, salvo que exista una obligación legal que '
    'justifique su conservación por un plazo adicional.'
))
story.append(bullet(
    '<b>Anonimizados</b> cuando sea posible, de modo que no puedan asociarse a un '
    'titular identificable, permitiendo su uso únicamente con fines estadísticos '
    'o de investigación, conforme al principio de minimización de datos.'
))

story.append(subsection('9.3', 'Solicitud de Eliminación Anticipada'))
story.append(body(
    'El titular de los datos puede solicitar la eliminación anticipada de sus datos '
    'personales mediante el ejercicio del derecho de Cancelación (ARCO), conforme a '
    'lo establecido en la Sección 6 del presente documento. La solicitud será atendida '
    'en un plazo máximo de 20 días hábiles, siempre que no exista una obligación legal '
    'que impida la eliminación (por ejemplo, requerimientos de autoridades fiscales, '
    'laborales o de seguridad social).'
))

# ── Section 10 (NEW) ───────────────────────────────────────────
story.append(section(10, 'Separación de Consentimiento'))
story.append(body(
    'De conformidad con el artículo 8 de la LFPDPPP, el consentimiento para el '
    'tratamiento de datos personales sensibles debe ser <b>expreso, informado y por '
    'escrito</b>, y debe otorgarse de manera separada del consentimiento para el '
    'tratamiento de datos personales de carácter general. Por lo anterior, la '
    'plataforma EvaluHR implementa <b>dos consentimientos independientes</b>, '
    'materializados en casillas de verificación (checkboxes) separadas:'
))

# Consent table
consent_data = [
    [Paragraph('<b>Consentimiento</b>', style_table_header),
     Paragraph('<b>Casilla de Verificación</b>', style_table_header),
     Paragraph('<b>Alcance y Contenido</b>', style_table_header),
     Paragraph('<b>Base Legal</b>', style_table_header)],
    [Paragraph('<b>Consentimiento 1</b>', style_table_cell),
     Paragraph('☐ Acepto el Aviso de Privacidad y el tratamiento de mis datos personales.', style_table_cell),
     Paragraph('Aceptación del presente aviso de privacidad integral y autorización para '
               'el tratamiento de datos personales de carácter general (nombre, correo, '
               'teléfono, resultados de evaluaciones de conocimientos) para las finalidades '
               'señaladas en la Sección 3.', style_table_cell),
     Paragraph('LFPDPPP Arts. 6 y 7 (consentimiento tácito/expreso para datos generales)', style_table_cell)],
    [Paragraph('<b>Consentimiento 2</b>', style_table_cell),
     Paragraph('☐ Otorgo mi consentimiento expreso para el tratamiento de mis datos personales sensibles.', style_table_cell),
     Paragraph('Consentimiento expreso, informado y por escrito, separado e independiente, '
               'para el tratamiento de datos personales sensibles (respuestas y resultados '
               'de evaluaciones psicométricas y psicológicas) conforme a la sección 2.1 '
               'del presente documento.', style_table_cell),
     Paragraph('LFPDPPP Art. 8 (consentimiento expreso para datos sensibles)', style_table_cell)],
]

t_consent = Table(consent_data, colWidths=[2.8*cm, 4.2*cm, 5.5*cm, 3.5*cm])
t_consent.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
    ('GRID', (0, 0), (-1, -1), 0.5, LIGHT_LINE),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
]))
story.append(spacer(4))
story.append(t_consent)
story.append(spacer(4))
story.append(body(
    '<b>Ambos consentimientos son requisito indispensable</b> para acceder a la '
    'evaluación en la plataforma EvaluHR. El candidato no podrá iniciar ninguna '
    'evaluación psicométrica o psicológica sin haber otorgado previamente ambos '
    'consentimientos. La separación de consentimientos garantiza el cumplimiento '
    'del principio de consentimiento informado y específico previsto en la LFPDPPP.'
))

# ── Section 11 (NEW) ───────────────────────────────────────────
story.append(section(11, 'Registro y Evidencia del Consentimiento'))
story.append(body(
    'Para garantizar la trazabilidad, inalterabilidad y oponibilidad a terceros del '
    'consentimiento otorgado por el titular, EvaluHR implementa las siguientes '
    'medidas técnicas de registro y evidencia:'
))
story.append(bullet(
    '<b>Identificador único de consentimiento:</b> Por cada aceptación registrada, '
    'se genera un identificador único (UUID v4) que vincula al titular con su '
    'consentimiento de forma inequívoca.'
))
story.append(bullet(
    '<b>Hash SHA-256 del texto del aviso:</b> Al momento del consentimiento, se '
    'calcula y almacena el hash SHA-256 del texto completo del aviso de privacidad '
    'presentado al titular, como evidencia inalterable de la versión exacta que fue '
    'leída y aceptada. Cualquier modificación posterior al texto resultaría en un '
    'hash diferente, invalidando la evidencia.'
))
story.append(bullet(
    '<b>Dirección IP del titular:</b> Se registra la dirección IP desde la cual '
    'se otorgó el consentimiento, como medio de identificación del dispositivo y '
    'ubicación aproximada del titular al momento de la aceptación.'
))
story.append(bullet(
    '<b>User-Agent del navegador:</b> Se registra el identificador del navegador '
    'y sistema operativo utilizado, como evidencia del contexto técnico en que se '
    'otorgó el consentimiento.'
))
story.append(bullet(
    '<b>Versión del aviso de privacidad:</b> Se registra el número de versión del '
    'aviso de privacidad presentado y aceptado, permitiendo identificar de forma '
    'precisa qué disposiciones fueron aceptadas por el titular.'
))
story.append(bullet(
    '<b>Fecha y hora del consentimiento:</b> Se registra de forma automática la '
    'fecha y hora exacta (con resolución de milisegundos y zona horaria) en que '
    'el titular otorgó su consentimiento, utilizando la hora del servidor para '
    'evitar manipulación.'
))
story.append(bullet(
    '<b>Inmutabilidad del registro:</b> Los registros de consentimiento son '
    '<b>inmutables</b> y no pueden ser alterados, eliminados ni sobrescritos '
    'por ningún usuario o administrador del sistema, incluyendo al Responsable '
    'y al personal de EvaluHR. Los registros se almacenan en una tabla de solo '
    'apéndice (append-only) con auditoría de integridad.'
))

# Consent record example table
record_data = [
    [Paragraph('<b>Campo</b>', style_table_header),
     Paragraph('<b>Ejemplo</b>', style_table_header),
     Paragraph('<b>Descripción</b>', style_table_header)],
    [Paragraph('consent_id', style_table_cell),
     Paragraph('a3f7c2e1-8b4d-4a9f-b6c3-1e2d3f4a5b6c', style_table_cell),
     Paragraph('Identificador único UUID v4', style_table_cell)],
    [Paragraph('notice_hash', style_table_cell),
     Paragraph('e3b0c44298fc1c14...927b4a8b7e3f', style_table_cell),
     Paragraph('SHA-256 del texto del aviso de privacidad', style_table_cell)],
    [Paragraph('ip_address', style_table_cell),
     Paragraph('189.203.xxx.xxx', style_table_cell),
     Paragraph('IP del titular al momento del consentimiento', style_table_cell)],
    [Paragraph('user_agent', style_table_cell),
     Paragraph('Mozilla/5.0 (Windows NT 10.0...)', style_table_cell),
     Paragraph('Navegador y SO del titular', style_table_cell)],
    [Paragraph('notice_version', style_table_cell),
     Paragraph('2.0', style_table_cell),
     Paragraph('Versión del aviso de privacidad aceptado', style_table_cell)],
    [Paragraph('consented_at', style_table_cell),
     Paragraph('2026-08-08T14:32:17.452-06:00', style_table_cell),
     Paragraph('Timestamp del servidor con zona horaria', style_table_cell)],
]

t_record = Table(record_data, colWidths=[3.2*cm, 5.8*cm, 7*cm])
t_record.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
    ('GRID', (0, 0), (-1, -1), 0.5, LIGHT_LINE),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
]))
story.append(spacer(4))
story.append(t_record)

# ── Section 12 (NEW) ───────────────────────────────────────────
story.append(section(12, 'Revocación del Consentimiento'))
story.append(body(
    'Conforme a los artículos 8 y 22 de la LFPDPPP, el titular puede revocar el '
    'consentimiento que hubiere otorgado para el tratamiento de sus datos personales '
    'en cualquier momento, sin que se le exijan requisitos adicionales a los previstos '
    'en la propia ley. La revocación del consentimiento se sujeta a las siguientes '
    'disposiciones:'
))

story.append(subsection('12.1', 'Mecanismo de Revocación'))
story.append(bullet(
    'El titular puede revocar su consentimiento a través de la plataforma EvaluHR, '
    'seleccionando la opción correspondiente en su perfil, o bien mediante solicitud '
    'escrita dirigida al Responsable conforme a lo establecido en la Sección 6.'
))
story.append(bullet(
    'La revocación puede referirse al consentimiento general (Consentimiento 1) o al '
    'consentimiento para datos sensibles (Consentimiento 2), de forma independiente.'
))

story.append(subsection('12.2', 'Registro de la Revocación'))
story.append(bullet(
    'Toda revocación es registrada con: fecha y hora del servidor, dirección IP, '
    'user-agent, e identificador del consentimiento revocado.'
))
story.append(bullet(
    'El registro de revocación es inmutable y se conserva como evidencia del '
    'ejercicio del derecho del titular.'
))

story.append(subsection('12.3', 'Efectos de la Revocación'))
story.append(bullet(
    '<b>Tratamiento previo lícito:</b> La revocación del consentimiento no tiene '
    'efectos retroactivos y, por lo tanto, no afecta la licitud del tratamiento '
    'de los datos personales realizado con anterioridad a la revocación, conforme '
    'al principio de legalidad previsto en la LFPDPPP.'
))
story.append(bullet(
    '<b>Cese del tratamiento futuro:</b> A partir de la fecha de revocación, el '
    'Responsable y EvaluHR cesarán el tratamiento de los datos personales del '
    'titular para las finalidades consentidas, salvo que exista una causa legítima '
    'o obligación legal que justifique su continuación.'
))
story.append(bullet(
    '<b>Impacto en el proceso de selección:</b> La revocación del consentimiento '
    'para el tratamiento de datos personales sensibles puede impedir la continuación '
    'del proceso de evaluación psicométrica o psicológica, ya que dicho tratamiento '
    'es indispensable para generar los resultados que fundamentan la recomendación '
    'de idoneidad. El titular será informado de esta consecuencia antes de confirmar '
    'la revocación.'
))

# ── Section 13 ──────────────────────────────────────────────────
story.append(section(13, 'Consentimiento Informado'))
story.append(body(
    'Al aceptar el presente aviso de privacidad y consentimiento, usted manifiesta '
    'de manera libre, informada y expresa que:'
))
story.append(bullet(
    'Ha leído y comprende el contenido del presente aviso de privacidad.'
))
story.append(bullet(
    'Acepta que sus respuestas a las evaluaciones psicométricas, psicológicas y de '
    'conocimientos serán tratadas como datos personales sensibles.'
))
story.append(bullet(
    'Consiente someterse a la evaluación de forma voluntaria, sin coacción ni presión.'
))
story.append(bullet(
    'Entiende que los resultados serán confidenciales y utilizados exclusivamente '
    'para el proceso de selección laboral.'
))
story.append(bullet(
    'Conoce y entiende sus derechos ARCO y el procedimiento para ejercerlos.'
))
story.append(bullet(
    'Autoriza el tratamiento de sus datos personales para las finalidades señaladas '
    'en la Sección 3 del presente documento.'
))
story.append(bullet(
    'Comprende que puede revocar su consentimiento en cualquier momento, conforme a '
    'lo establecido en la Sección 12.'
))
story.append(important(
    'La evaluación psicométrica, psicológica y de conocimientos es un requisito del '
    'proceso de selección laboral. Sin embargo, su consentimiento para el tratamiento '
    'de datos personales sensibles es voluntario. En caso de no otorgar su '
    'consentimiento, no podrá continuar con el proceso de evaluación, lo cual puede '
    'afectar su participación en el proceso de selección.'
))

# ── Section 14 ──────────────────────────────────────────────────
story.append(section(14, 'Datos de Contacto del Responsable'))
story.append(body(
    'Para cualquier consulta, solicitud de ejercicio de derechos ARCO, revocación '
    'de consentimiento, o reclamación relacionada con el tratamiento de sus datos '
    'personales, puede contactar al Responsable a través de:'
))
story.append(bullet(
    'Área de Recursos Humanos de la empresa correspondiente'
))
story.append(bullet('Domicilio: Tuxtla Gutiérrez, Chiapas, México'))
story.append(bullet(
    'Plataforma: EvaluHR — Sistema de Pre-evaluación de Personal'
))

# ── Section 15 ──────────────────────────────────────────────────
story.append(section(15, 'Modificaciones al Aviso de Privacidad'))
story.append(body(
    'El Responsable se reserva el derecho de modificar el presente aviso de privacidad '
    'en cualquier momento. Las modificaciones serán notificadas a través de la plataforma '
    'EvaluHR antes de la siguiente evaluación, y se solicitará nuevamente el '
    'consentimiento del titular cuando los cambios afecten el tratamiento de datos '
    'personales sensibles.'
))
story.append(body(
    'En caso de modificaciones sustanciales al aviso de privacidad que alteren las '
    'finalidades del tratamiento, las categorías de datos recopiladas, o los '
    'mecanismos de consentimiento, se requerirá la aceptación expresa del nuevo aviso '
    'por parte del titular, registrándose una nueva evidencia de consentimiento conforme '
    'a lo establecido en la Sección 11. La versión del aviso de privacidad será '
    'incrementada (ej. de 2.0 a 3.0) y el hash SHA-256 será recalculado.'
))

# ── Footer ─────────────────────────────────────────────────────
story.append(spacer(12))
story.append(hr())
story.append(Paragraph(
    'EvaluHR — Sistema de Pre-evaluación de Personal<br/>'
    'Tuxtla Gutiérrez, Chiapas, México<br/>'
    '© 2026 EvaluHR. Todos los derechos reservados.',
    style_footer
))

# ── Build ──────────────────────────────────────────────────────
doc.build(story)
print(f'PDF generated: {OUTPUT}')
