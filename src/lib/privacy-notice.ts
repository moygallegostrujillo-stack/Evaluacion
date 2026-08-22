/**
 * Generador de Aviso de Privacidad LFPDPPP-compliant para EvaluHR.
 *
 * Este módulo produce el HTML completo del aviso de privacidad que las
 * empresas (Responsables) deben poner a disposición de los candidatos
 * antes de recopilar sus datos personales y datos sensibles (psicométricos,
 * psicológicos, de integridad) a través de la plataforma EvaluHR.
 *
 * Versión del aviso: 2026-01-v2
 */

export const CURRENT_PRIVACY_VERSION = '2026-01-v2';

interface CompanyData {
  name: string;
  sector: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

export function generatePrivacyNoticeHtml(company: CompanyData): string {
  // --- Derivación de placeholders ---
  const empresa = company.name;
  const sector = company.sector;

  const domicilio = [company.address, company.city, company.state, company.country]
    .filter((v): v is string => Boolean(v?.trim()))
    .join(', ');

  const emailRRHH = `rrhh@${empresa
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}.com`;

  const telefono = company.phone?.trim() || 'No especificado';

  // --- Plantilla HTML ---
  const template = `<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aviso de Privacidad — {{EMPRESA}}</title>
  <style>
    :root {
      --color-primary: #1a365d;
      --color-secondary: #2c5282;
      --color-accent: #3182ce;
      --color-bg: #f7fafc;
      --color-text: #1a202c;
      --color-muted: #4a5568;
      --color-border: #e2e8f0;
    }
    body {
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: var(--color-text);
      background: var(--color-bg);
      margin: 0;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      padding: 2.5rem 3rem;
    }
    h1 {
      font-size: 1.5rem;
      color: var(--color-primary);
      border-bottom: 3px solid var(--color-accent);
      padding-bottom: 0.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    h1:first-of-type {
      margin-top: 0;
      text-align: center;
      font-size: 1.75rem;
    }
    h2 {
      font-size: 1.15rem;
      color: var(--color-secondary);
      margin-top: 1.8rem;
      margin-bottom: 0.5rem;
    }
    h3 {
      font-size: 1rem;
      color: var(--color-secondary);
      margin-top: 1.2rem;
      margin-bottom: 0.3rem;
    }
    p {
      margin: 0.5rem 0;
    }
    ul, ol {
      margin: 0.5rem 0 0.5rem 1.5rem;
      padding: 0;
    }
    li {
      margin-bottom: 0.3rem;
    }
    .destacado {
      background: #ebf8ff;
      border-left: 4px solid var(--color-accent);
      padding: 1rem 1.25rem;
      margin: 1rem 0;
      border-radius: 0 4px 4px 0;
    }
    .destacado-rojo {
      background: #fff5f5;
      border-left: 4px solid #e53e3e;
      padding: 1rem 1.25rem;
      margin: 1rem 0;
      border-radius: 0 4px 4px 0;
    }
    .meta {
      text-align: center;
      color: var(--color-muted);
      font-size: 0.85rem;
      margin-top: 2rem;
      border-top: 1px solid var(--color-border);
      padding-top: 1rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.75rem 0;
    }
    th, td {
      border: 1px solid var(--color-border);
      padding: 0.5rem 0.75rem;
      text-align: left;
      font-size: 0.95rem;
    }
    th {
      background: #edf2f7;
      color: var(--color-primary);
    }
    @media (max-width: 600px) {
      .container { padding: 1.25rem 1rem; }
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- ============================================ -->
    <!-- SECCIÓN 1: Encabezado -->
    <!-- ============================================ -->
    <h1>Aviso de Privacidad</h1>
    <p>
      En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales
      en Posesión de los Particulares</strong> (LFPDPPP), su Reglamento y las
      disposiciones aplicables, <strong>{{EMPRESA}}</strong> (en adelante, "el
      Responsable"), con domicilio en {{DOMICILIO}}, y sector
      <strong>{{SECTOR}}</strong>, pone a su disposición el presente Aviso de
      Privacidad.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 2: Identidad del Responsable -->
    <!-- ============================================ -->
    <h1>1. Identidad del Responsable</h1>
    <table>
      <tr><th>Datos</th><th>Detalle</th></tr>
      <tr><td>Denominación social / Nombre</td><td>{{EMPRESA}}</td></tr>
      <tr><td>Domicilio</td><td>{{DOMICILIO}}</td></tr>
      <tr><td>Sector / Giro</td><td>{{SECTOR}}</td></tr>
    </table>

    <!-- ============================================ -->
    <!-- SECCIÓN 3: Datos de contacto del Responsable -->
    <!-- ============================================ -->
    <h1>2. Datos de contacto del Responsable</h1>
    <p>Para cualquier duda, aclaración, solicitud de derechos ARCO o revocación de
    consentimiento, puede contactar al área de Recursos Humanos del Responsable:
    </p>
    <ul>
      <li><strong>Correo electrónico:</strong> {{EMAIL_RRHH}}</li>
      <li><strong>Teléfono:</strong> ${telefono}</li>
      <li><strong>Domicilio:</strong> {{DOMICILIO}}</li>
    </ul>
    <p>
      El Responsable designará un área o persona encargada de atender las
      solicitudes de derechos ARCO dentro de los plazos previstos por la LFPDPPP.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 4: Encargado — EvaluHR -->
    <!-- ============================================ -->
    <h1>3. El Encargado del tratamiento: plataforma EvaluHR</h1>
    <p>
      La plataforma de evaluación utilizada es <strong>EvaluHR</strong>, que actúa
      como <em>Encargado del tratamiento</em> en los términos del artículo 12 de la
      LFPDPPP. EvaluHR procesa los datos personales únicamente por instrucción del
      Responsable y con los fines autorizados en el presente aviso.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 5: Limitación de responsabilidad del Encargado -->
    <!-- ============================================ -->
    <h1>4. Limitación de responsabilidad de EvaluHR</h1>
    <p>EvaluHR, como Encargado del tratamiento, se obliga a:</p>
    <ul>
      <li>Procesar los datos personales únicamente según las instrucciones documentadas del Responsable.</li>
      <li>Implementar medidas de seguridad técnicas, administrativas y físicas para proteger la información.</li>
      <li>No utilizar los datos para fines propios ni transferirlos a terceros sin autorización expresa.</li>
      <li>Notificar al Responsable de cualquier violación a la seguridad de los datos personales de forma inmediata.</li>
      <li>Devolver o destruir los datos personales cuando finalice la relación contractual con el Responsable.</li>
    </ul>
    <p>
      El Responsable es el único titular de la relación con el titular de los
      datos. EvaluHR no asume responsabilidad alguna respecto de las decisiones
      de contratación, despido o cualquier otra relación laboral derivada del uso
      de las evaluaciones.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 6: Datos personales recopilados -->
    <!-- ============================================ -->
    <h1>5. Datos personales recopilados</h1>
    <p>
      Como parte del proceso de evaluación, el Responsable, a través de EvaluHR,
      recopila los siguientes <strong>datos personales identificables</strong>:
    </p>
    <table>
      <tr><th>Dato personal</th><th>Ejemplo</th><th>Necesario para</th></tr>
      <tr><td>Nombre completo</td><td>Juan Pérez López</td><td>Identificación del candidato</td></tr>
      <tr><td>Correo electrónico</td><td>juan@ejemplo.com</td><td>Contacto y envío de enlace de evaluación</td></tr>
      <tr><td>Teléfono</td><td>+52 55 1234 5678</td><td>Contacto opcional</td></tr>
      <tr><td>Respuestas de evaluación (conocimientos)</td><td>Preguntas técnicas del sector</td><td>Perfil de competencias</td></tr>
      <tr><td>Fecha y hora de la evaluación</td><td>2026-01-15 10:30</td><td>Control del proceso</td></tr>
      <tr><td>Dirección IP (log de acceso)</td><td>189.203.x.x</td><td>Seguridad del sistema</td></tr>
    </table>

    <!-- ============================================ -->
    <!-- SECCIÓN 7: Datos sensibles — Introducción -->
    <!-- ============================================ -->
    <h1>6. Datos sensibles recopilados</h1>

    <!-- ============================================ -->
    <!-- SECCIÓN 8: Naturaleza de los datos sensibles -->
    <!-- ============================================ -->
    <h2>6.1 Naturaleza de los datos sensibles</h2>
    <p>
      De conformidad con el <strong>Artículo 7, fracciones I, II y V de la LFPDPPP</strong>,
      las evaluaciones pueden generar datos que la Ley clasifica como
      <em>datos sensibles</em>:
    </p>
    <table>
      <tr><th>Tipo de dato sensible</th><th>Art. 7 LFPDPPP</th><th>Ejemplo en EvaluHR</th></tr>
      <tr>
        <td><strong>Datos psicométricos</strong></td>
        <td>Fracc. I — "que puedan revelar... características de la personalidad"</td>
        <td>Test de personalidad Big Five (apertura, responsabilidad, extraversión, amabilidad, neuroticismo)</td>
      </tr>
      <tr>
        <td><strong>Datos psicológicos</strong></td>
        <td>Fracc. II — "que puedan revelar... estado anímico o emocional"</td>
        <td>Evaluaciones de perfil psicológico, rasgos emocionales y de comportamiento</td>
      </tr>
      <tr>
        <td><strong>Datos de integridad</strong></td>
        <td>Fracc. V — "que afecten... la reputación"</td>
        <td>Evaluaciones de integridad, honestidad y ética profesional</td>
      </tr>
    </table>

    <!-- ============================================ -->
    <!-- SECCIÓN 9: Particularidad de datos sensibles -->
    <!-- ============================================ -->
    <h2>6.2 Particularidad de los datos sensibles</h2>
    <p>
      Los datos sensibles requieren un nivel de protección <strong>especial y
      reforzado</strong> conforme al artículo 9 de la LFPDPPP. Su tratamiento
      solo es lícito cuando el titular otorga su <em>consentimiento expreso e
      informado</em>, o cuando la Ley autoriza otra causa de licitud.
    </p>
    <p>
      El presente aviso constituye la forma en que el Responsable informa
      ampliadamente al titular sobre el tratamiento de sus datos sensibles, por
      lo que al aceptar este aviso se entenderá otorgado el consentimiento
      expreso en los términos del artículo 8 de la LFPDPPP.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 10: Declaración — El sistema NO decide la contratación -->
    <!-- ============================================ -->
    <h1>7. Declaración: naturaleza orientativa del sistema</h1>
    <div class="destacado-rojo">
      <p><strong>Declaración obligatoria (Art. 37 Bis, fracc. V de la LFPDPPP):</strong></p>
      <p>
        El sistema de evaluación utilizado por <strong>{{EMPRESA}}</strong> a
        través de la plataforma EvaluHR <strong>NO decide la contratación, el
        despido, la promoción, la permanencia ni cualquier otra decisión laboral
        del candidato</strong>.
      </p>
      <p>
        Las evaluaciones generan exclusivamente <strong>orientación informativa</strong>
        para el área de Recursos Humanos del Responsable. Los resultados describen
        características del perfil del candidato con fines de análisis, y
        constituyen un insumo más dentro del proceso integral de selección.
      </p>
      <p>
        <strong>La decisión final sobre la contratación o cualquier otra acción
        laboral corresponde exclusiva y plenamente al área de Recursos Humanos
        de {{EMPRESA}}.</strong>
      </p>
    </div>

    <!-- ============================================ -->
    <!-- SECCIÓN 11: Art. 37 Bis — Obligaciones del Responsable -->
    <!-- ============================================ -->
    <h1>8. Cumplimiento del artículo 37 Bis</h1>
    <p>
      Conforme al <strong>artículo 37 Bis de la LFPDPPP</strong> (adicionado por
      el Decreto por el que se reforman y adicionan diversas disposiciones de la
      Ley), cuando el tratamiento de datos personales se utilice para evaluar
      ciertas características del titular, el Responsable debe:
    </p>
    <ol>
      <li>Informar al titular sobre los datos personales que se recopilan.</li>
      <li>Informar al titular sobre la finalidad del tratamiento.</li>
      <li>Proporcionar al titular acceso a los resultados de la evaluación.</li>
      <li>Conservar la documentación que sustente la evaluación.</li>
      <li>Indicar que la evaluación no decide de manera definitiva las decisiones
          que se tomen con base en la misma.</li>
    </ol>
    <p>
      <strong>{{EMPRESA}}</strong> cumple íntegramente con las obligaciones
      anteriores, como se detalla en las secciones correspondientes del presente
      aviso.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 12: Finalidad del tratamiento -->
    <!-- ============================================ -->
    <h1>9. Finalidad del tratamiento</h1>
    <p>Los datos personales y sensibles del candidato son tratados con la siguiente
    <strong>finalidad principal y exclusiva</strong>:</p>
    <ul>
      <li><strong>Evaluación para orientación al reclutador:</strong> Generar un perfil
          descriptivo del candidato que sirva como insumo informativo para el área
          de Recursos Humanos de {{EMPRESA}}, con el fin de apoyar su proceso de
          selección de personal.</li>
    </ul>
    <p><strong>Finalidades secundarias:</strong></p>
    <ul>
      <li>Contactar al candidato para comunicarle el enlace de evaluación y, en su
          caso, resultados generales del proceso.</li>
      <li>Generar estadísticas agregadas y anónimas para mejorar los procesos de
          selección del Responsable (solo si se otorga consentimiento específico).</li>
      <li>Cumplir con obligaciones legales aplicables.</li>
    </ul>
    <p>
      <strong>Queda expresamente prohibido</strong> utilizar los resultados de la
      evaluación como criterio único o automático para la toma de decisiones
      laborales.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 13: Principio de proporcionalidad -->
    <!-- ============================================ -->
    <h1>10. Principio de proporcionalidad</h1>
    <p>
      El tratamiento de datos personales y sensibles se realiza bajo estricto
      cumplimiento de los principios de <strong>licitud, consentimiento,
      información, calidad, finalidad, lealtad, proporcionalidad y
      responsabilidad</strong> establecidos en el artículo 6 de la LFPDPPP.
    </p>
    <p>
      En particular, se observa el principio de <strong>proporcionalidad</strong>:
      los datos sensibles recopilados guardan relación directa, necesaria y
      pertinente con la finalidad declarada de orientar al reclutador.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 14: Transferencia de datos -->
    <!-- ============================================ -->
    <h1>11. Transferencia de datos</h1>
    <div class="destacado">
      <p><strong>No se transfieren datos personales a terceros.</strong></p>
      <p>
        Los datos personales y sensibles del candidato son tratados
        <strong>exclusivamente por el Responsable</strong> ({{EMPRESA}}) y por el
        <strong>Encargado</strong> (EvaluHR, como procesador de datos).
      </p>
      <p>
        No se realizan transferencias a terceros, ni nacionales ni internacionales,
        salvo los siguientes supuestos excepcionales autorizados por la Ley:
      </p>
      <ul>
        <li>Cuando medie requerimiento de autoridad competente.</li>
        <li>Cuando sea necesario para la atención de una emergencia médica.</li>
        <li>Cuando lo exija la Ley, un reglamento o una disposición de autoridad
            competente.</li>
        <li>Cuando sea necesario para el reconocimiento, ejercicio o defensa de un
            derecho en un proceso judicial.</li>
      </ul>
    </div>

    <!-- ============================================ -->
    <!-- SECCIÓN 15: Remisión de datos al Responsable -->
    <!-- ============================================ -->
    <h1>12. Circulación de datos: Responsable ↔ Encargado</h1>
    <p>
      La comunicación de datos entre el Responsable y EvaluHR (Encargado) no
      constituye <em>transferencia</em> en los términos de la LFPDPPP, sino
      <em>tratamiento por cuenta del Responsable</em> (Art. 12). EvaluHR actúa
      bajo las instrucciones exclusivas del Responsable y no utiliza los datos
      para fines propios.
    </p>
    <p>
      Al concluir el proceso de evaluación, el Responsable tiene acceso a los
      resultados a través de su panel de administración en EvaluHR. Los datos
      permanecen bajo el control del Responsable en todo momento.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 16: Derechos ARCO -->
    <!-- ============================================ -->
    <h1>13. Derechos ARCO</h1>
    <p>
      El titular de los datos personales tiene derecho a ejercer los siguientes
      <strong>Derechos ARCO</strong> (Acceso, Rectificación, Cancelación y
      Oposición) conforme a los artículos 15 a 27 de la LFPDPPP:
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 17: Derecho de Acceso -->
    <!-- ============================================ -->
    <h2>13.1 Acceso</h2>
    <p>
      Derecho a conocer qué datos personales posee el Responsable, así como
      obtener copia de los mismos y de los resultados de las evaluaciones
      realizadas.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 18: Derecho de Rectificación -->
    <!-- ============================================ -->
    <h2>13.2 Rectificación</h2>
    <p>
      Derecho a solicitar la corrección de datos personales inexactos o
      incompletos (nombre, correo electrónico, teléfono u otros datos de
      identificación).
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 19: Derecho de Cancelación -->
    <!-- ============================================ -->
    <h2>13.3 Cancelación</h2>
    <p>
      Derecho a solicitar la supresión de sus datos personales y sensibles de
      las bases de datos del Responsable y de la plataforma EvaluHR, cuando
      considere que los mismos resultan excesivos, innecesarios o contrarios a
      la Ley. La cancelación procederá salvo que exista una obligación legal de
      conservar dichos datos.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 20: Derecho de Oposición -->
    <!-- ============================================ -->
    <h2>13.4 Oposición</h2>
    <p>
      Derecho a oponerse al tratamiento de sus datos personales y sensibles
      para fines específicos. La oposición será procedente cuando los datos no
      sean necesarios para el fin para el que fueron recopilados.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 21: Procedimiento para ejercer derechos ARCO -->
    <!-- ============================================ -->
    <h2>13.5 Procedimiento para ejercer derechos ARCO</h2>
    <p>Para ejercer sus derechos ARCO, el titular deberá:</p>
    <ol>
      <li>Enviar un correo electrónico a <strong>{{EMAIL_RRHH}}</strong> con el
          asunto "Solicitud de Derechos ARCO".</li>
      <li>Incluir en el correo su nombre completo y los datos de contacto con los
          que fue registrado.</li>
      <li>Indicar con claridad el derecho que desea ejercer (Acceso, Rectificación,
          Cancelación u Oposición) y los datos sobre los que recae la solicitud.</li>
      <li>Proporcionar identificación oficial vigente para acreditar su identidad.</li>
    </ol>
    <p>
      El Responsable tendrá un plazo máximo de <strong>20 días hábiles</strong>
      para responder a la solicitud, en los términos del artículo 18 de la
      LFPDPPP. En caso de que la solicitud sea procedente, la atención se
      realizará en un plazo máximo de <strong>15 días hábiles</strong> adicionales.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 22: Revocación del consentimiento -->
    <!-- ============================================ -->
    <h1>14. Revocación del consentimiento</h1>
    <p>
      El titular tiene derecho a <strong>revocar</strong> en cualquier momento el
      consentimiento otorgado para el tratamiento de sus datos personales y
      sensibles. Para ello, deberá seguir el mismo procedimiento descrito para
      los derechos ARCO.
    </p>
    <p>
      Es importante señalar que la revocación del consentimiento no implica la
      nulidad de los actos de tratamiento realizados con anterioridad, de
      conformidad con el artículo 24 de la LFPDPPP.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 23: Consentimiento — Opciones -->
    <!-- ============================================ -->
    <h1>15. Consentimiento: opciones de tratamiento</h1>
    <p>
      El titular puede elegir el nivel de consentimiento que desea otorgar. A
      continuación se describen las tres opciones disponibles:
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 24: Opción A -->
    <!-- ============================================ -->
    <h2>15.1 Opción A: Consentimiento completo</h2>
    <p>El titular autoriza el tratamiento de <strong>todos sus datos personales y
    datos sensibles</strong> (psicométricos, psicológicos, de integridad) para
    los fines de orientación al reclutador descritos en la sección 9.</p>
    <p>
      Esta opción permite generar el perfil de evaluación más completo para el
      área de Recursos Humanos del Responsable.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 25: Opción B -->
    <!-- ============================================ -->
    <h2>15.2 Opción B: Solo datos de conocimientos</h2>
    <p>El titular autoriza el tratamiento de sus <strong>datos personales
    identificables</strong> (nombre, correo, teléfono) y sus
    <strong>respuestas de evaluación de conocimientos</strong> únicamente.</p>
    <p>
      Bajo esta opción, <strong>no se recopilarán datos sensibles</strong>
      (psicométricos, psicológicos ni de integridad). La evaluación se limitará
      a las secciones de conocimientos técnicos relevantes para el puesto.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 26: Opción C -->
    <!-- ============================================ -->
    <h2>15.3 Opción C: Solo estadísticas anónimas</h2>
    <p>El titular autoriza que sus respuestas de evaluación sean utilizadas
    <strong>exclusivamente para generar estadísticas agregadas y anónimas</strong>,
    sin que se vinculen con su identidad.</p>
    <p>
      Bajo esta opción, los datos de identificación (nombre, correo, teléfono)
      se conservarán únicamente para el contacto necesario durante el proceso de
      selección. Los resultados de la evaluación no se almacenarán de forma
      individual identificable.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 27: Períodos de conservación -->
    <!-- ============================================ -->
    <h1>16. Períodos de conservación de los datos</h1>

    <!-- ============================================ -->
    <!-- SECCIÓN 28: Conservación de datos personales -->
    <!-- ============================================ -->
    <h2>16.1 Datos personales</h2>
    <p>
      Los datos personales identificables (nombre, correo electrónico, teléfono,
      fecha y hora de evaluación) se conservarán durante un período máximo de
      <strong>dos (2) años</strong> contados a partir de la fecha de realización
      de la evaluación.
    </p>
    <p>
      Transcurrido este plazo, los datos personales serán eliminados de forma
      segura y permanente de las bases de datos del Responsable y de la
      plataforma EvaluHR, salvo que exista una obligación legal de conservarlos
      por un período mayor.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 29: Conservación de datos sensibles -->
    <!-- ============================================ -->
    <h2>16.2 Datos sensibles</h2>
    <p>
      Los datos sensibles (psicométricos, psicológicos y de integridad) serán
      <strong>eliminados de forma inmediata al concluir el proceso de evaluación
      y selección</strong> del candidato, o a solicitud del titular mediante el
      ejercicio del derecho de cancelación.
    </p>
    <p>
      Se entiende que el proceso ha concluido cuando: (a) el candidato es
      contratado, (b) el candidato es notificado de que no será considerado, o
      (c) transcurren 90 días naturales sin que el Responsable realice alguna
      acción sobre la evaluación.
    </p>
    <div class="destacado">
      <p><strong>Regla de oro para datos sensibles:</strong> Los datos sensibles
      se conservan <em>únicamente</em> durante el tiempo estrictamente necesario
      para la finalidad de orientación al reclutador. No se archivan ni se
      utilizan para futuros procesos de selección sin un nuevo consentimiento
      expreso del titular.</p>
    </div>

    <!-- ============================================ -->
    <!-- SECCIÓN 30: Medidas de seguridad -->
    <!-- ============================================ -->
    <h1>17. Medidas de seguridad</h1>
    <p>
      Conforme al artículo 88 de la LFPDPPP y su Reglamento, el Responsable y
      EvaluHR (como Encargado) implementan las siguientes medidas de seguridad
      para proteger los datos personales y sensibles:
    </p>
    <ul>
      <li><strong>Control de acceso:</strong> Autenticación con credenciales seguras.
          Solo personal autorizado del Responsable puede acceder a los resultados
          de las evaluaciones.</li>
      <li><strong>Cifrado en tránsito:</strong> Toda la comunicación entre el
          navegador del candidato y la plataforma EvaluHR se realiza mediante
          protocolo HTTPS (TLS 1.2 o superior).</li>
      <li><strong>Cifrado en reposo:</strong> Los datos sensibles almacenados en la
          base de datos son cifrados para proteger su confidencialidad en caso de
          acceso no autorizado al almacenamiento.</li>
      <li><strong>Segregación de datos:</strong> Los datos de cada empresa (Responsable)
          están lógicamente aislados. Un Responsable no puede acceder a los datos
          de candidatos de otro Responsable.</li>
      <li><strong>Backups seguros:</strong> Las copias de respaldo están cifradas y
          restringidas a personal técnico autorizado.</li>
      <li><strong>Monitoreo y auditoría:</strong> Se llevan registros de acceso y
          actividad para detectar y responder a incidentes de seguridad de forma
          oportuna.</li>
      <li><strong>Capacitación:</strong> El personal con acceso a datos personales y
          sensibles recibe capacitación periódica en protección de datos
          personales.</li>
      <li><strong>Plan de respuesta a incidentes:</strong> Se cuenta con un
          procedimiento documentado para la notificación y atención de violaciones
          a la seguridad de datos personales, conforme al artículo 196 del
          Reglamento de la LFPDPPP.</li>
    </ul>

    <!-- ============================================ -->
    <!-- SECCIÓN 31: Declaración de integridad -->
    <!-- ============================================ -->
    <h1>18. Declaración sobre el uso de evaluaciones de integridad</h1>
    <div class="destacado-rojo">
      <p><strong>Aviso importante:</strong></p>
      <p>
        Los datos relativos a la <strong>integridad personal</strong> del candidato
        constituyen <em>datos sensibles</em> conforme al artículo 7, fracción V
        de la LFPDPPP, dado que pueden afectar la reputación del titular.
      </p>
    </div>
    <p>
      Por ello, el Responsable declara y se compromete a lo siguiente:
    </p>
    <ol>
      <li>
        <strong>Carácter orientativo:</strong> Las evaluaciones de integridad
        generan únicamente información de carácter <em>orientativo e
        informativo</em> para el área de Recursos Humanos. En ningún caso
        constituyen una determinación absoluta sobre la integridad moral o
        ética del candidato.
      </li>
      <li>
        <strong>No son filtro de descarte automático:</strong> Los resultados de
        las evaluaciones de integridad <strong>nunca se utilizarán como criterio
        único, definitivo o automático de descarte</strong> para la contratación
        o cualquier otra decisión laboral.
      </li>
      <li>
        <strong>Contexto integral:</strong> Los resultados de integridad serán
        considerados siempre dentro de un contexto integral que incluya
        entrevistas, referencias laborales, verificación de antecedentes y
        cualquier otro elemento que el área de Recursos Humanos estime
        pertinente.
      </li>
      <li>
        <strong>Confidencialidad reforzada:</strong> Los resultados de las
        evaluaciones de integridad recibirán un nivel de confidencialidad
        reforzado y solo serán accesibles para el personal de Recursos Humanos
        directamente involucrado en el proceso de selección.
      </li>
      <li>
        <strong>Eliminación inmediata:</strong> Los datos de integridad serán
        eliminados inmediatamente al concluir el proceso de selección, conforme
        a la sección 16.2 del presente aviso.
      </li>
    </ol>

    <!-- ============================================ -->
    <!-- SECCIÓN 32: Acceso a resultados por parte del titular -->
    <!-- ============================================ -->
    <h1>19. Acceso del titular a los resultados de la evaluación</h1>
    <p>
      Conforme al artículo 37 Bis, fracción III de la LFPDPPP, el titular tiene
      derecho a <strong>conocer los resultados de la evaluación</strong> que se
      haya realizado sobre sus datos personales.
    </p>
    <p>
      El candidato podrá solicitar acceso a sus resultados dirigiendo su
      petición a <strong>{{EMAIL_RRHH}}</strong>, indicando su nombre completo y
      fecha aproximada de la evaluación. El Responsable proporcionará los
      resultados en un plazo no mayor a <strong>20 días hábiles</strong>.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 33: Uso de cookies y tecnologías similares -->
    <!-- ============================================ -->
    <h1>20. Uso de cookies y tecnologías de rastreo</h1>
    <p>
      La plataforma EvaluHR utiliza cookies técnicas estrictamente necesarias
      para el funcionamiento de la plataforma (sesión de usuario, preferencias).
      No se utilizan cookies de publicidad ni de rastreo de terceros.
    </p>
    <p>
      Se almacena la dirección IP del candidato únicamente con fines de
      seguridad del sistema y prevención de fraudes, conforme a lo señalado
      en la sección 5.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 34: Derecho a presentar quejas ante el INAI -->
    <!-- ============================================ -->
    <h1>21. Derecho a presentar quejas ante el INAI</h1>
    <p>
      Si el titular considera que el Responsable ha infringido sus derechos
      ARCO o ha realizado un tratamiento de sus datos personales contrario a
      la LFPDPPP, podrá interponer su queja o denuncia ante el
      <strong>Instituto Nacional de Transparencia, Acceso a la Información y
      Protección de Datos Personales (INAI)</strong>:
    </p>
    <ul>
      <li>Sitio web: <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer">www.inai.org.mx</a></li>
      <li>Correo electrónico: contacto@inai.org.mx</li>
      <li>Teléfono: 01 800 835 4242</li>
    </ul>

    <!-- ============================================ -->
    <!-- SECCIÓN 35: Cambios al aviso de privacidad -->
    <!-- ============================================ -->
    <h1>22. Cambios al presente aviso de privacidad</h1>
    <p>
      El Responsable se reserva el derecho de modificar el presente Aviso de
      Privacidad en cualquier momento, con el fin de actualizarlo conforme a
      cambios legislativos, jurisprudenciales o de mejores prácticas en
      materia de protección de datos personales.
    </p>
    <p>
      Cualquier modificación será puesta a disposición de los titulares a
      través del mismo medio por el cual se difundió este aviso o mediante
      aviso visible en la plataforma EvaluHR.
    </p>
    <p>
      Se recomienda al titular revisar periódicamente este aviso para
      mantenerse informado sobre cualquier actualización.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 36: Consentimiento explícito -->
    <!-- ============================================ -->
    <h1>23. Manifestación del consentimiento</h1>
    <p>
      Al marcar la casilla de aceptación o al iniciar la evaluación, el
      titular <strong>manifiesta su consentimiento expreso e informado</strong>
      para el tratamiento de sus datos personales y, en su caso, datos
      sensibles, conforme a la opción de tratamiento que haya seleccionado
      (Opción A, B o C) y en los términos del presente Aviso de Privacidad.
    </p>
    <p>
      El consentimiento puede ser revocado en cualquier momento conforme a la
      sección 14 del presente aviso.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 37: Consentimiento para menores de edad -->
    <!-- ============================================ -->
    <h1>24. Menores de edad</h1>
    <p>
      La plataforma EvaluHR y los procesos de evaluación de {{EMPRESA}} están
      dirigidos exclusivamente a personas mayores de 18 años. No se recopilan
      datos personales de menores de edad. En caso de detectar que un
      candidato es menor de edad, se suspenderá inmediatamente el proceso de
      evaluación y se eliminarán los datos recopilados.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 38: Árbol de decisiones automatizadas -->
    <!-- ============================================ -->
    <h1>25. Decisiones automatizadas</h1>
    <p>
      Conforme al artículo 37 Bis, fracción IV de la LFPDPPP, el Responsable
      informa que <strong>no se toman decisiones basadas exclusivamente en el
      tratamiento automatizado de datos personales</strong> que produzcan efectos
      jurídicos o afecten significativamente al titular.
    </p>
    <p>
      Los algoritmos utilizados por la plataforma EvaluHR generan puntuaciones
      y perfiles descriptivos que son <strong>exclusivamente informativos y
      orientativos</strong>. Toda decisión laboral es tomada por personas del
      área de Recursos Humanos del Responsable, quienes pueden considerar los
      resultados de la evaluación como un insumo más, pero nunca como factor
      determinante único.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 39: Datos de navegación y logs -->
    <!-- ============================================ -->
    <h1>26. Datos de navegación y registros de acceso</h1>
    <p>
      Para garantizar la seguridad e integridad de la plataforma, se recopilan
      los siguientes datos de navegación de forma automática:
    </p>
    <ul>
      <li>Dirección IP del dispositivo de acceso.</li>
      <li>Marca y versión del navegador web.</li>
      <li>Fecha y hora de acceso a la plataforma.</li>
      <li>Páginas visitadas dentro de la sesión de evaluación.</li>
    </ul>
    <p>
      Estos datos se utilizan exclusivamente para fines de seguridad,
      prevención de fraudes y mejora de la plataforma. Se conservan por un
      período máximo de 90 días naturales.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 40: Legitimación del tratamiento -->
    <!-- ============================================ -->
    <h1>27. Base legal para el tratamiento</h1>
    <p>El tratamiento de los datos personales descrito en el presente aviso se
    basa en las siguientes causas de licitud previstas en la LFPDPPP:</p>
    <ul>
      <li><strong>Art. 8, fracc. I:</strong> Consentimiento expreso del titular.
      </li>
      <li><strong>Art. 8, fracc. II:</strong> Cuando el tratamiento sea
          necesario para el cumplimiento de una obligación legal.
      </li>
      <li><strong>Art. 8, fracc. V:</strong> Cuando el tratamiento sea necesario
          para el ejercicio o defensa de derechos del Responsable en un
          procedimiento judicial o administrativo.
      </li>
      <li><strong>Art. 8, fracc. VII:</strong> Cuando exista una relación
          contractual entre el titular y el Responsable (proceso de
          selección).
      </li>
    </ul>

    <!-- ============================================ -->
    <!-- SECCIÓN 41: Glosario -->
    <!-- ============================================ -->
    <h1>28. Glosario</h1>
    <table>
      <tr><th>Término</th><th>Definición</th></tr>
      <tr><td>LFPDPPP</td><td>Ley Federal de Protección de Datos Personales en Posesión de los Particulares</td></tr>
      <tr><td>INAI</td><td>Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales</td></tr>
      <tr><td>Responsable</td><td>Persona física o moral que decide sobre el tratamiento de datos personales ({{EMPRESA}})</td></tr>
      <tr><td>Encargado</td><td>Persona física o moral que trata datos personales por cuenta del Responsable (EvaluHR)</td></tr>
      <tr><td>Titular</td><td>Persona física a quien corresponden los datos personales (el candidato)</td></tr>
      <tr><td>Datos personales</td><td>Cualquier información concerniente a una persona física identificada o identificable</td></tr>
      <tr><td>Datos sensibles</td><td>Datos personales que afectan la esfera íntima del titular o cuyo uso indebido puede generar discriminación</td></tr>
      <tr><td>Derechos ARCO</td><td>Derechos de Acceso, Rectificación, Cancelación y Oposición</td></tr>
      <tr><td>Transferencia</td><td>Comunicación de datos personales a terceros distintos al Responsable o Encargado</td></tr>
    </table>

    <!-- ============================================ -->
    <!-- SECCIÓN 42: Vigencia -->
    <!-- ============================================ -->
    <h1>29. Vigencia del aviso de privacidad</h1>
    <p>
      El presente Aviso de Privacidad entra en vigor a partir de su publicación
      y mantendrá su vigencia hasta que se publique una nueva versión que lo
      sustituya.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 43: Documentación de sustento -->
    <!-- ============================================ -->
    <h1>30. Documentación de sustento de la evaluación</h1>
    <p>
      Conforme al artículo 37 Bis, fracción IV de la LFPDPPP, el Responsable
      conservará la documentación que sustente los criterios, metodologías y
      procedimientos utilizados en la evaluación durante el período de
      conservación indicado en la sección 16 del presente aviso.
    </p>
    <p>
      Dicha documentación incluye, de manera enunciativa mas no limitativa: las
      versiones de los instrumentos de evaluación aplicados, los algoritmos de
      calificación utilizados, y los criterios de ponderación empleados.
    </p>

    <!-- ============================================ -->
    <!-- SECCIÓN 44: Contacto adicional del INAI -->
    <!-- ============================================ -->
    <h1>31. Información adicional</h1>
    <p>
      Para mayor información sobre sus derechos y la protección de sus datos
      personales, puede consultar:
    </p>
    <ul>
      <li>Ley Federal de Protección de Datos Personales en Posesión de los
          Particulares: disponible en el sitio oficial del INAI
          (<a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer">www.inai.org.mx</a>).</li>
      <li>Reglamento de la LFPDPPP.</li>
      <li>Lineamientos del INAI en materia de protección de datos personales.</li>
    </ul>
    <p>
      Para cualquier duda relacionada con el presente aviso, contacte al área
      de Recursos Humanos de <strong>{{EMPRESA}}</strong> en
      <strong>{{EMAIL_RRHH}}</strong>.
    </p>

    <!-- ============================================ -->
    <!-- PIE DE PÁGINA -->
    <!-- ============================================ -->
    <div class="meta">
      <p>
        <strong>{{EMPRESA}}</strong> — Aviso de Privacidad<br />
        Versión: ${CURRENT_PRIVACY_VERSION}<br />
        Última actualización: Enero 2026<br />
        Domicilio: {{DOMICILIO}}<br />
        Sector: {{SECTOR}}
      </p>
    </div>

  </div>
</body>
</html>`;

  // --- Reemplazo de placeholders ---
  return template
    .replace(/\{\{EMPRESA\}\}/g, empresa)
    .replace(/\{\{DOMICILIO\}\}/g, domicilio || 'No especificado')
    .replace(/\{\{SECTOR\}\}/g, sector)
    .replace(/\{\{EMAIL_RRHH\}\}/g, emailRRHH)
    .replace(/\$\{telefono\}/g, telefono);
}
