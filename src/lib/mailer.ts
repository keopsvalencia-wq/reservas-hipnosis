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
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #f0f0f5; margin: 0; padding: 20px; }
          .container { max-width: 500px; margin: 0 auto; background: #12121e; border-radius: 16px; padding: 32px; border: 1px solid #1f1f30; }
          .header { text-align: center; margin-bottom: 24px; }
          .header h1 { font-size: 20px; font-weight: 300; margin: 0; }
          .header h1 span { color: #c9a84c; }
          .divider { height: 1px; background: #1f1f30; margin: 20px 0; }
          .detail { display: flex; align-items: center; gap: 12px; margin: 12px 0; font-size: 14px; }
          .detail-icon { color: #c9a84c; font-size: 16px; }
          .cta { display: block; text-align: center; background: #c9a84c; color: #0a0a0f; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 500; font-size: 14px; margin-top: 24px; }
          .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #8888a0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1><span>Hipnosis</span> en Terapia</h1>
            <p style="color: #8888a0; font-size: 12px; margin-top: 8px; text-transform: uppercase; letter-spacing: 2px;">Confirmación de Cita</p>
          </div>
          <div class="divider"></div>
          <p style="font-size: 14px;">Hola <strong>${data.fullName}</strong>,</p>
          <p style="font-size: 14px; color: #a0a0b0;">Tu sesión de valoración diagnóstica con <strong>Salva Vera</strong> ha sido confirmada:</p>
          <div style="background: #0a0a0f; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <div class="detail">📅 <strong>${data.date}</strong></div>
            <div class="detail">🕒 <strong>${data.time}h</strong></div>
            <div class="detail">📍 <strong>${data.location}</strong></div>
          </div>
          <p style="font-size: 13px; color: #a0a0b0;">Si necesitas cancelar o modificar tu cita, contacta por WhatsApp.</p>
          <a href="https://wa.me/34600000000" class="cta">Contactar por WhatsApp</a>
          <div class="footer">
            <p>hipnosisenterapia.com</p>
            <p>Valencia · Motilla del Palancar · Online</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await transporter.sendMail({
      from: `"Hipnosis en Terapia" <info@hipnosisenterapia.com>`,
      to: data.email,
      subject: `✅ Cita confirmada — ${data.date} a las ${data.time}h`,
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
