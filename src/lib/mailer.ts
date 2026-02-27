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
}

/**
 * Envía email de confirmación al paciente.
 */
export async function sendPatientConfirmation(data: EmailData) {
  try {
    let finalLocationHTML = '';
    const locLower = data.location.toLowerCase();

    if (locLower.includes('online')) {
      finalLocationHTML = '<strong>Online (Videollamada)</strong><br><span style="color: #a0a0b0; font-size: 13px;">El enlace de conexión te llegará próximamente.</span>';
    } else if (locLower.includes('picanya') || locLower.includes('valencia')) {
      finalLocationHTML = `
        <strong>Sede Picanya (Valencia)</strong><br>
        <span style="color: #a0a0b0; font-size: 13px;">Carrer Torrent, 30, PUERTA 4, 46210 Picaña, Valencia.</span><br>
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

    const cancelText = encodeURIComponent(`Hola Salva, necesito cancelar/modificar mi reserva del ${data.date} a las ${data.time}.`);
    const whatsappLink = `https://wa.me/34656839568?text=${cancelText}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #f0f0f5; margin: 0; padding: 20px; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: #12121e; border-radius: 16px; padding: 40px; border: 1px solid #1f1f30; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { font-size: 24px; font-weight: 300; margin: 0; color: #f0f0f5; }
          .header h1 span { color: #c9a84c; }
          .divider { height: 1px; background: #1f1f30; margin: 24px 0; }
          .greeting { font-size: 16px; font-weight: 500; margin-bottom: 16px; color: #ffffff; }
          .text { font-size: 15px; color: #a0a0b0; margin-bottom: 20px; }
          .details-box { background: #0a0a0f; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #1f1f30; }
          .details-box h3 { margin-top: 0; margin-bottom: 16px; font-size: 16px; color: #c9a84c; font-weight: 500; }
          .detail-item { margin-bottom: 16px; font-size: 15px; display: flex; align-items: flex-start; gap: 10px; }
          .detail-item:last-child { margin-bottom: 0; }
          .detail-icon { font-size: 16px; }
          .gifts-box { margin-bottom: 24px; }
          .gifts-box h3 { font-size: 17px; color: #c9a84c; margin-bottom: 12px; font-weight: 500; }
          .gifts-box p { font-size: 15px; color: #a0a0b0; }
          .gifts-box ul { padding-left: 0; list-style: none; margin: 16px 0; }
          .gifts-box li { margin-bottom: 12px; font-size: 15px; color: #f0f0f5; background: #0a0a0f; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #c9a84c; }
          .warning-box { background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 30px; }
          .warning-box p { margin: 0; font-size: 14px; color: #fca5a5; }
          .signature { font-size: 16px; color: #f0f0f5; font-weight: 400; }
          .cta-container { text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #1f1f30; }
          .cta { display: inline-block; background: transparent; border: 1px solid #c9a84c; color: #c9a84c; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.3s ease; }
          .cta:hover { background: #c9a84c; color: #0a0a0f; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666680; }
          .footer a { color: #8888a0; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1><span>Hipnosis</span> en Terapia</h1>
            <p style="color: #8888a0; font-size: 12px; margin-top: 8px; text-transform: uppercase; letter-spacing: 2px;">Evaluación Diagnóstica Confirmada</p>
          </div>
          
          <div class="greeting">Hola ${data.fullName},</div>
          
          <p class="text">Te escribo para confirmarte que tu reserva se ha realizado con éxito.</p>
          <p class="text">Quiero darte la enhorabuena. Dar el primer paso y pedir ayuda cuando uno está agotado requiere mucho valor. Has hecho lo correcto y quiero que sepas que a partir de ahora, no estás solo/a en esto.</p>

          <div class="details-box">
            <h3>Detalles de tu Evaluación:</h3>
            <div class="detail-item"><span class="detail-icon">📅</span> <div><strong>Fecha:</strong><br><span style="color: #a0a0b0;">${data.date}</span></div></div>
            <div class="detail-item"><span class="detail-icon">⏰</span> <div><strong>Hora:</strong><br><span style="color: #a0a0b0;">${data.time}h</span></div></div>
            <div class="detail-item"><span class="detail-icon">📍</span> <div>${finalLocationHTML}</div></div>
          </div>

          <div class="gifts-box">
            <h3>¿Qué va a pasar en esta sesión de 45 minutos?</h3>
            <p>Mi objetivo es analizar la raíz de tu problema y ver si tu caso encaja en el Método Reset para arrancarlo de forma definitiva.</p>
            <p>Además, solo por asistir, te llevarás estos 3 regalos de claridad mental:</p>
            <ul>
              <li><strong>1.</strong> Entenderás de una vez por todas qué te pasa realmente.</li>
              <li><strong>2.</strong> Verás exactamente por qué NO te ha funcionado nada de lo que has intentado hasta hoy.</li>
              <li><strong>3.</strong> Descubrirás cuál es la verdadera y única solución a tu problema.</li>
            </ul>
          </div>

          <div class="warning-box">
            <p><strong>⚠️ SOBRE MI AGENDA:</strong> Solo acepto entre 3 y 5 casos nuevos al mes. Esa plaza ahora es tuya. <strong>Si no puedes asistir, te ruego que canceles con al menos 24 horas de antelación</strong> para dar esta oportunidad a otra persona.</p>
          </div>

          <div class="signature">
            Nos vemos muy pronto. Un abrazo,<br>
            <strong style="color: #c9a84c;">Salva Vera</strong>
          </div>

          <div class="cta-container">
            <p style="font-size: 13px; color: #8888a0; margin-bottom: 16px;">(Si necesitas cancelar o modificar tu cita, puedes hacerlo enviándome un mensaje directo)</p>
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
 * Diferencia entre "Aviso Director" (Presencial) y "Aviso Online".
 */
export async function sendTherapistNotification(data: EmailData) {
  try {
    const isOnline = data.location.toLowerCase().includes('online');
    const badgeText = isOnline ? 'Aviso Online' : 'Aviso Director';
    const ubicacionInfo = isOnline ? 'Sesión Online (Videollamada)' : `Sesión Presencial en ${data.location}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #f0f0f5; margin: 0; padding: 20px; }
          .container { max-width: 500px; margin: 0 auto; background: #12121e; border-radius: 16px; padding: 32px; border: 1px solid #1f1f30; }
          .badge { display: inline-block; background: ${isOnline ? '#4b6cb7' : '#c9a84c'}; color: ${isOnline ? '#fff' : '#0a0a0f'}; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
          .detail { margin: 8px 0; font-size: 14px; }
          .label { color: #8888a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <span class="badge">${badgeText}</span>
          <h2 style="font-size: 18px; font-weight: 400; margin-top: 16px;">Nueva Solicitud: ${ubicacionInfo}</h2>
          
          <div style="background: #0a0a0f; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p class="label">Datos del Cliente</p>
            <div class="detail"><strong>${data.fullName}</strong></div>
            <div class="detail">📧 ${data.email}</div>
            <div class="detail">📱 ${data.phone}</div>
            ${data.ciudad ? `<div class="detail">🏙️ Ciudad: ${data.ciudad}</div>` : ''}
            
            <div style="height: 1px; background: #1f1f30; margin: 12px 0;"></div>
            
            <p class="label">Resumen de la Cita</p>
            <div class="detail">📅 ${data.date}</div>
            <div class="detail">🕒 ${data.time}h</div>
            <div class="detail">📍 ${data.location}</div>
            
            <div style="height: 1px; background: #1f1f30; margin: 12px 0;"></div>
            
            <p class="label">Datos de Triaje</p>
            <div class="detail">🧠 Motivo: ${data.motivo || '—'}</div>
            <div class="detail">💪 Compromiso: ${data.compromiso || '—'} / 10</div>
            <div class="detail">⏳ Tiempo disp.: ${data.tiempo || '—'}</div>
            <div class="detail">💰 Inversión disp.: ${data.inversion || '—'}</div>
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
