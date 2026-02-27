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
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; background: #F9FAFB; color: #1F2937; margin: 0; padding: 20px; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 40px; border: 1px solid #E1E8ED; }
          .header { text-align: center; margin-bottom: 30px; }
          .header img { max-width: 200px; margin-bottom: 16px; }
          .header p { color: #39DCA8; font-size: 13px; font-weight: 700; margin-top: 8px; text-transform: uppercase; letter-spacing: 2px; }
          .greeting { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #0A2833; }
          .text { font-size: 15px; color: #4B5563; margin-bottom: 20px; }
          .details-box { background: #ffffff; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #E5E7EB; border-left: 4px solid #39DCA8; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
          .details-box h3 { margin-top: 0; margin-bottom: 20px; font-size: 16px; color: #0A2833; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
          .detail-item { margin-bottom: 16px; font-size: 15px; display: flex; align-items: flex-start; gap: 12px; color: #4B5563; }
          .detail-item:last-child { margin-bottom: 0; }
          .gifts-box { margin-bottom: 24px; }
          .gifts-box h3 { font-size: 18px; color: #0A2833; margin-bottom: 12px; font-weight: 700; }
          .gifts-box ul { padding-left: 0; list-style: none; margin: 20px 0; }
          .gifts-box li { margin-bottom: 12px; font-size: 14px; color: #1F2937; background: #F9FAFB; padding: 16px; border-radius: 10px; border-left: 4px solid #c9a84c; border-top: 1px solid #F3F4F6; border-right: 1px solid #F3F4F6; border-bottom: 1px solid #F3F4F6; }
          .warning-box { background: #FEF2F2; border-left: 4px solid #EF4444; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .warning-box p { margin: 0; font-size: 14px; color: #991B1B; line-height: 1.5; }
          .cta { display: inline-block; background: #0A2833; color: #ffffff !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #9CA3AF; }
          .footer a { color: #39DCA8; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://raw.githubusercontent.com/keopsvalencia-wq/reservas-hipnosis/main/public/images/logo.png" alt="Hipnosis en Terapia" />
            <p>Evaluación Confirmada</p>
          </div>
          
          <div class="greeting">Hola ${data.fullName},</div>
          
          <p class="text">Te escribo para confirmarte que tu reserva se ha realizado con éxito.</p>
          <p class="text">Quiero darte la enhorabuena. Dar el primer paso y pedir ayuda cuando uno está agotado requiere mucho valor. Has hecho lo correcto y quiero que sepas que a partir de ahora, no estás solo/a en esto.</p>

          <div class="details-box">
            <h3>Detalles de tu Evaluación:</h3>
            <div class="detail-item"><span>📅</span> <div><strong>Fecha:</strong><br><span style="color: #6B7280;">${data.date}</span></div></div>
            <div class="detail-item"><span>⏰</span> <div><strong>Hora:</strong><br><span style="color: #6B7280;">${data.time}h</span></div></div>
            <div class="detail-item"><span>📍</span> <div>${finalLocationHTML}</div></div>
          </div>

          <div class="gifts-box">
            <h3>¿Qué va a pasar en esta sesión de 45 minutos?</h3>
            <p class="text">Mi objetivo es analizar la raíz de tu problema y ver si tu caso encaja en el Método Reset para arrancarlo de forma definitiva.</p>
            <p class="text">Además, solo por asistir, te llevarás estos 3 regalos de claridad mental:</p>
            <ul>
              <li><strong>1.</strong> Verás tu problema desde un punto de vista que ni te imaginas y que nadie te ha contado.</li>
              <li><strong>2.</strong> Verás exactamente por qué NO te ha funcionado nada de lo que has intentado hasta hoy.</li>
              <li><strong>3.</strong> Descubrirás cuál es la verdadera y única solución a tu problema.</li>
            </ul>
          </div>

          <div class="warning-box">
            <p><strong>⚠️ SOBRE MI AGENDA:</strong> Solo acepto entre 3 y 5 casos nuevos al mes. Esa plaza ahora es tuya. <strong>Si no puedes asistir, te ruego que canceles con al menos 24 horas de antelación</strong> para dar esta oportunidad a otra persona.</p>
          </div>

          <div style="font-size: 16px; color: #4B5563; margin-top: 30px;">
            Nos vemos muy pronto. Un abrazo,<br>
            <strong style="color: #0A2833; font-size: 18px; display: inline-block; margin-top: 8px;">Salva Vera</strong>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px dashed #E5E7EB;">
            <p style="font-size: 13px; color: #6B7280; margin-bottom: 16px;">(Si necesitas cancelar o modificar tu cita, puedes hacerlo enviándome un mensaje directo)</p>
            <a href="${whatsappLink}" class="cta">Modificar / Cancelar Cita</a>
          </div>

          <div class="footer">
            <p><a href="https://hipnosisenterapia.com">hipnosisenterapia.com</a></p>
            <p>Valencia · Motilla del Palancar · Online</p>
          </div>
        </div>
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
      <html>
      <head>
        <style>
          body { font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; background: #F3F4F6; color: #1F2937; margin: 0; padding: 20px; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 40px; border: 1px solid #E5E7EB; }
          .badge { display: inline-block; background: ${isOnline ? '#39DCA8' : '#c9a84c'}; color: ${isOnline ? '#0A2833' : '#ffffff'}; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }
          .section { margin-bottom: 32px; }
          .label { color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 12px; display: block; border-bottom: 2px solid #F3F4F6; padding-bottom: 8px; }
          .detail { margin: 8px 0; font-size: 14px; color: #374151; }
          .detail strong { color: #0A2833; font-weight: 600; min-width: 120px; display: inline-block; }
          .box { background: #F9FAFB; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB; margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://raw.githubusercontent.com/keopsvalencia-wq/reservas-hipnosis/main/public/images/logo.png" alt="Hipnosis en Terapia" style="max-width: 160px;" />
          </div>
          
          <div style="text-align: center;">
            <span class="badge">${badgeText}</span>
            <h2 style="font-size: 18px; color: #0A2833; margin-top: 0;">NUEVA RESERVA RECIBIDA</h2>
          </div>
          
          <div class="section">
            <span class="label">Cita y Contacto</span>
            <div class="detail"><strong>📆 Fecha:</strong> ${data.date} a las ${data.time}h</div>
            <div class="detail"><strong>📍 Sede:</strong> ${ubicacionInfo}</div>
            <div class="detail"><strong>👤 Nombre:</strong> ${data.fullName}</div>
            <div class="detail"><strong>📱 Teléfono:</strong> ${data.phone}</div>
            <div class="detail"><strong>✉️ Email:</strong> ${data.email}</div>
            <div class="detail"><strong>🏙️ Ciudad:</strong> ${data.ciudad || '—'}</div>
          </div>

          <div class="section">
            <span class="label">TRIAJE: Contexto Clínico</span>
            <div class="detail"><strong>⏳ Edad:</strong> ${data.edad || '—'}</div>
            <div class="detail"><strong>💼 Ocupación:</strong> ${data.dedicacion || '—'}</div>
            <div class="detail"><strong>🎯 Motivo (Ppal):</strong> ${data.motivo || '—'}</div>
            ${data.impacto_emocional ? `<div class="detail" style="margin-top:4px;"><strong>🧠 Consecuencias:</strong> ${data.impacto_emocional}</div>` : ''}
            
            <div style="margin-top: 16px;">
              <strong>🌪️ ¿Cómo se siente AHORA?</strong>
              <div class="box">${data.situacion_actual ? data.situacion_actual.replace(/\n/g, '<br>') : 'No especificado'}</div>
            </div>

            <div style="margin-top: 16px;">
              <strong>✨ ¿Cómo le gustaría estar?</strong>
              <div class="box">${data.situacion_deseada ? data.situacion_deseada.replace(/\n/g, '<br>') : 'No especificado'}</div>
            </div>
          </div>

          <div class="section">
            <span class="label">TRIAJE: Compromiso e Inversión</span>
            <div class="detail"><strong>🔥 Compromiso:</strong> ${data.compromiso || '—'}</div>
            <div class="detail"><strong>⏳ Tiempo:</strong> ${data.tiempo || '—'}</div>
            <div class="detail"><strong>💰 Dinero:</strong> <span style="background: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${data.inversion ? data.inversion.split('.')[0] : '—'}</span></div>
          </div>
        </div>
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
