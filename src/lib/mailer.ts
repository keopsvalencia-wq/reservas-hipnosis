import nodemailer from 'nodemailer';

// ───────────────────────────────────────────────────
// Nodemailer — Hostinger SMTP Email Sender
// ───────────────────────────────────────────────────
// Hostinger config: smtp.hostinger.com, port 465, SSL
// ───────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // SSL for Hostinger
  auth: {
    user: 'info@hipnosisenterapia.com',
    pass: '$ah>yYMP>7Ru',
  },
});

interface EmailData {
  fullName: string;
  email: string;
  phone: string;
  date: string;        // "Martes 4 de marzo de 2026"
  time: string;        // "11:00"
  location: string;    // "Valencia (Picanya)"
  motivo?: string;
  compromiso?: string;
  tiempo?: string;
  inversion?: string;
  ciudad?: string;
  dedicacion?: string;
  situacion_actual?: string;
  situacion_deseada?: string;
  impacto_emocional?: string;
  edad?: string;
}

/**
 * Envía email de confirmación al paciente.
 */
export async function sendPatientConfirmation(data: EmailData) {
  try {
    let finalLocationHTML = '';
    const locLower = data.location.toLowerCase();

    if (locLower.includes('online')) {
      finalLocationHTML = '<strong>Online (Videollamada)</strong><br><span style="color: #6B7280; font-size: 13px;">El enlace de conexión te llegará próximamente.</span>';
    } else if (locLower.includes('picanya') || locLower.includes('valencia')) {
      finalLocationHTML = `
        <strong>Sede Picanya (Valencia)</strong><br>
        <span style="color: #6B7280; font-size: 13px;">Carrer Torrent, 30, PUERTA 4, 46210 Picaña, Valencia.</span><br>
        <a href="https://maps.google.com/?cid=10480257999918627497&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ" style="color: #c9a84c; font-size: 13px; text-decoration: underline;">📍 Ver en Google Maps</a>
      `;
    } else if (locLower.includes('motilla')) {
      finalLocationHTML = `
        <strong>Sede Motilla del Palancar (Cuenca)</strong><br>
        <a href="https://maps.app.goo.gl/ZoJiw55xy2x1sJgG8" style="color: #c9a84c; font-size: 13px; text-decoration: underline;">📍 Ver en Google Maps</a>
      `;
    } else {
      finalLocationHTML = `<strong>${data.location}</strong>`;
    }

    const cancelText = encodeURIComponent(`Hola Salva, necesito modificar o cancelar mi reserva del ${data.date} a las ${data.time}.`);
    const whatsappLink = `https://wa.me/34656839568?text=${cancelText}`;

    const html = `
      <!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Evaluación Confirmada</title>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #F9FAFB; margin: 0; padding: 0; }
          a { text-decoration: none; }
          table, td, p, h1, h2, h3, a { font-family: 'Arial', sans-serif; }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F9FAFB;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; padding: 20px;">
          <tr>
            <td align="center">
              <!-- Main Container 600px -->
              <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #E1E8ED; border-radius: 12px; width: 600px; max-width: 600px;">
                <tr>
                  <td style="padding: 40px;">
                    <!-- Header -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding-bottom: 30px;">
                          <img src="https://raw.githubusercontent.com/keopsvalencia-wq/reservas-hipnosis/main/public/images/logo.png" alt="Hipnosis en Terapia" width="200" style="display: block; width: 200px; max-width: 200px; border: 0;" />
                          <p style="color: #39DCA8; font-size: 13px; font-weight: bold; margin: 15px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Evaluación Confirmada</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Greeting & Intro -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 16px 0; color: #0A2833;">Hola ${data.fullName},</h1>
                          <p style="font-size: 15px; color: #4B5563; margin: 0 0 20px 0; line-height: 1.6;">Te escribo para confirmarte que tu reserva se ha realizado con éxito.</p>
                          <p style="font-size: 15px; color: #4B5563; margin: 0 0 20px 0; line-height: 1.6;">Quiero darte la enhorabuena. Dar el primer paso y pedir ayuda cuando uno está agotado requiere mucho valor. Has hecho lo correcto y quiero que sepas que a partir de ahora, no estás solo/a en esto.</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Details Box -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #E5E7EB; border-left: 4px solid #39DCA8; margin: 5px 0 25px 0; border-radius: 4px;">
                      <tr>
                        <td style="padding: 24px;">
                          <h3 style="margin: 0 0 20px 0; font-size: 16px; color: #0A2833; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Detalles de tu Evaluación:</h3>
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 15px; color: #4B5563;">
                            <tr>
                              <td width="30" valign="top" style="padding-bottom: 16px; font-size: 18px;">📅</td>
                              <td valign="top" style="padding-bottom: 16px; line-height: 1.5;"><strong>Fecha:</strong><br><span style="color: #6B7280;">${data.date}</span></td>
                            </tr>
                            <tr>
                              <td width="30" valign="top" style="padding-bottom: 16px; font-size: 18px;">⏰</td>
                              <td valign="top" style="padding-bottom: 16px; line-height: 1.5;"><strong>Hora:</strong><br><span style="color: #6B7280;">${data.time}h</span></td>
                            </tr>
                            <tr>
                              <td width="30" valign="top" style="font-size: 18px;">📍</td>
                              <td valign="top" style="line-height: 1.5;">${finalLocationHTML}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Gifts Box -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                      <tr>
                        <td>
                          <h3 style="margin: 0 0 12px 0; font-size: 18px; color: #0A2833; font-weight: bold;">¿Qué va a pasar en esta sesión de 45 minutos?</h3>
                          <p style="font-size: 15px; color: #4B5563; margin: 0 0 20px 0; line-height: 1.6;">Mi objetivo es analizar la raíz de tu problema y ver si tu caso encaja en el Método Reset para arrancarlo de forma definitiva.</p>
                          <p style="font-size: 15px; color: #4B5563; margin: 0 0 20px 0; line-height: 1.6;">Además, solo por asistir, te llevarás estos 3 regalos de claridad mental:</p>
                          
                          <table width="100%" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background-color: #F9FAFB; padding: 16px; border-left: 4px solid #c9a84c; border: 1px solid #F3F4F6; font-size: 14px; color: #1F2937; margin-bottom: 12px; display: block; border-radius: 4px;">
                                <strong>1.</strong> Verás tu problema desde un punto de vista que ni te imaginas y que nadie te ha contado.
                              </td>
                            </tr>
                            <tr><td height="12"></td></tr>
                            <tr>
                              <td style="background-color: #F9FAFB; padding: 16px; border-left: 4px solid #c9a84c; border: 1px solid #F3F4F6; font-size: 14px; color: #1F2937; margin-bottom: 12px; display: block; border-radius: 4px;">
                                <strong>2.</strong> Verás exactamente por qué NO te ha funcionado nada de lo que has intentado hasta hoy.
                              </td>
                            </tr>
                            <tr><td height="12"></td></tr>
                            <tr>
                              <td style="background-color: #F9FAFB; padding: 16px; border-left: 4px solid #c9a84c; border: 1px solid #F3F4F6; font-size: 14px; color: #1F2937; display: block; border-radius: 4px;">
                                <strong>3.</strong> Descubrirás cuál es la verdadera y única solución a tu problema.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Warning Box -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FEF2F2; border-left: 4px solid #EF4444; margin-bottom: 30px; border-radius: 4px;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0; font-size: 14px; color: #991B1B; line-height: 1.5;"><strong>⚠️ SOBRE MI AGENDA:</strong> Solo acepto entre 3 y 5 casos nuevos al mes. Esa plaza ahora es tuya. <strong>Si no puedes asistir, te ruego que canceles con al menos 24 horas de antelación</strong> para dar esta oportunidad a otra persona.</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Signature -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                      <tr>
                        <td>
                          <p style="font-size: 16px; color: #4B5563; margin: 0;">Nos vemos muy pronto. Un abrazo,<br>
                          <strong style="color: #0A2833; font-size: 18px; display: inline-block; margin-top: 8px;">Salva Vera</strong></p>
                        </td>
                      </tr>
                    </table>

                    <!-- Footer / Cancellation -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 40px; border-top: 1px dashed #E5E7EB;">
                      <tr>
                        <td align="center" style="padding-top: 30px;">
                          <p style="font-size: 13px; color: #6B7280; margin: 0 0 16px 0;">(Si necesitas cancelar o modificar tu cita, haz clic en el botón inferior)</p>
                          <a href="${whatsappLink}" style="display: inline-block; background-color: #0A2833; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Modificar / Cancelar Cita</a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top: 40px;">
                          <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 8px 0;"><a href="https://hipnosisenterapia.com" style="color: #39DCA8; text-decoration: none; font-weight: bold;">hipnosisenterapia.com</a></p>
                          <p style="font-size: 12px; color: #9CA3AF; margin: 0;">Valencia · Motilla del Palancar · Online</p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
              <!-- End Main Container -->
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const res = await transporter.sendMail({
      from: `"Salva Vera - Hipnosis en Terapia" <info@hipnosisenterapia.com>`,
      to: data.email,
      subject: `🟢 Confirmado: Tu Evaluación Diagnóstica con Salva Vera`,
      html,
    });
    console.log('📧 Email enviado al paciente:', res.messageId);
  } catch (err: any) {
    console.error('❌ Error enviando email al paciente:', err.message);
    throw err;
  }
}

/**
 * Envía email de notificación al terapeuta (Salva Vera).
 */
export async function sendTherapistNotification(data: EmailData) {
  try {
    const isOnline = data.location.toLowerCase().includes('online');
    const badgeText = isOnline ? 'Aviso Online' : 'Aviso Director';
    const ubicacionInfo = isOnline ? 'Sesión Online (Videollamada)' : `Sesión en ${data.location}`;

    const html = `
      <!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Reserva</title>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #F3F4F6; margin: 0; padding: 0; }
          table, td, p, h1, h2, h3, a, span { font-family: 'Arial', sans-serif; }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F3F4F6;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F3F4F6; padding: 20px;">
          <tr>
            <td align="center">
              <!-- Main Container 600px -->
              <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; width: 600px; max-width: 600px;">
                <tr>
                  <td style="padding: 40px;">

                    <!-- Header -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                      <tr>
                        <td align="center">
                          <img src="https://raw.githubusercontent.com/keopsvalencia-wq/reservas-hipnosis/main/public/images/logo.png" alt="Hipnosis en Terapia" width="160" style="display: block; width: 160px; max-width: 160px; border: 0;" />
                        </td>
                      </tr>
                    </table>
                    
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                      <tr>
                        <td align="center">
                          <span style="display: inline-block; background-color: ${isOnline ? '#39DCA8' : '#c9a84c'}; color: ${isOnline ? '#0A2833' : '#ffffff'}; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">${badgeText}</span>
                          <h2 style="font-size: 18px; color: #0A2833; margin: 0;">NUEVA RESERVA RECIBIDA</h2>
                        </td>
                      </tr>
                    </table>

                    <!-- Section: Cita y Contacto -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                      <tr>
                        <td style="border-bottom: 2px solid #F3F4F6; padding-bottom: 8px; margin-bottom: 12px;">
                          <span style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Cita y Contacto</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px; font-size: 14px; color: #374151; line-height: 1.6;">
                          <div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 100px;">📆 Fecha:</strong> ${data.date} a las ${data.time}h</div>
                          <div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 100px;">📍 Sede:</strong> ${ubicacionInfo}</div>
                          <div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 100px;">👤 Nombre:</strong> ${data.fullName}</div>
                          <div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 100px;">📱 Teléfono:</strong> ${data.phone}</div>
                          <div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 100px;">✉️ Email:</strong> ${data.email}</div>
                          <div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 100px;">🏙️ Ciudad:</strong> ${data.ciudad || '—'}</div>
                        </td>
                      </tr>
                    </table>

                    <!-- Section: Contexto Clínico -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                      <tr>
                        <td style="border-bottom: 2px solid #F3F4F6; padding-bottom: 8px; margin-bottom: 12px;">
                          <span style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">TRIAJE: Contexto Clínico</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px; font-size: 14px; color: #374151; line-height: 1.6;">
                          <div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 130px;">⏳ Edad:</strong> ${data.edad || '—'}</div>
                          <div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 130px;">💼 Ocupación:</strong> ${data.dedicacion || '—'}</div>
                          <div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 130px;">🎯 Motivo (Ppal):</strong> ${data.motivo || '—'}</div>
                          ${data.impacto_emocional ? `<div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 130px;">🧠 Consecuencias:</strong> ${data.impacto_emocional}</div>` : ''}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 16px;">
                          <strong style="color: #0A2833; font-size: 14px;">🌪️ ¿Cómo se siente AHORA?</strong>
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 4px; margin-top: 8px;">
                            <tr><td style="padding: 16px; font-size: 14px; color: #374151; line-height: 1.6;">${data.situacion_actual ? data.situacion_actual.replace(/\\n/g, '<br>') : 'No especificado'}</td></tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 16px;">
                          <strong style="color: #0A2833; font-size: 14px;">✨ ¿Cómo le gustaría estar?</strong>
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 4px; margin-top: 8px;">
                            <tr><td style="padding: 16px; font-size: 14px; color: #374151; line-height: 1.6;">${data.situacion_deseada ? data.situacion_deseada.replace(/\\n/g, '<br>') : 'No especificado'}</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Section: Compromiso -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-bottom: 2px solid #F3F4F6; padding-bottom: 8px; margin-bottom: 12px;">
                          <span style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">TRIAJE: Compromiso e Inversión</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px; font-size: 14px; color: #374151; line-height: 1.6;">
                          <div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 110px;">🔥 Compromiso:</strong> ${data.compromiso || '—'}</div>
                          <div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 110px;">⏳ Tiempo:</strong> ${data.tiempo || '—'}</div>
                          <div style="margin-bottom: 8px;"><strong style="color: #0A2833; display: inline-block; width: 110px;">💰 Dinero:</strong> <span style="background-color: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: 4px; font-weight: bold; display: inline-block;">${data.inversion ? data.inversion.split('.')[0] : '—'}</span></div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
              <!-- End Main Container -->
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const res = await transporter.sendMail({
      from: `"Sistema de Reservas" <info@hipnosisenterapia.com>`,
      to: 'info@hipnosisenterapia.com',
      subject: `🔔 ${badgeText}: ${data.fullName} — ${data.date} ${data.time}h`,
      html,
    });
    console.log('📧 Email enviado al terapeuta (Notificación):', res.messageId);
  } catch (err: any) {
    console.error('❌ Error enviando email al terapeuta:', err.message);
    throw err;
  }
}

