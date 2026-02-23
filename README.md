# 📅 HipnosisEnTerapia — Sistema de Reservas

Sistema de reservas online para [hipnosisenterapia.com](https://hipnosisenterapia.com), creado con **Next.js 16 + Tailwind CSS 4**.

## Flujo de Reserva

1. **Triaje** — 8 preguntas de cualificación con lógica condicional
   - Si el paciente indica que no tiene recursos (pregunta 8, opción roja) → se bloquea el avance
2. **Ubicación** — Valencia (Picanya), Motilla del Palancar, Online
3. **Calendario** — Restricciones especiales:
   - **Martes**: Valencia 11:00/18:00, Motilla 13:00/16:00 — bloqueo cruzado mutuo
   - **Online**: Lunes a viernes, 10:00/12:00/16:00/18:00
4. **Confirmación** — Recoge datos personales y envía reserva

## Requisitos

- Node.js 18+
- Cuenta Google Cloud con Calendar API activada
- Email en Hostinger (SMTP)

## Instalación

```bash
git clone <repo>
cd calendly
npm install
cp .env.local.example .env.local
# → Editar .env.local con las credenciales reales
```

## Variables de Entorno

| Variable | Descripción |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Email de la Service Account de Google |
| `GOOGLE_PRIVATE_KEY` | Clave privada PEM (entre comillas, con `\n`) |
| `GOOGLE_CALENDAR_ID` | ID del calendario de Google |
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | Email de Hostinger (ej: `reservas@hipnosisenterapia.com`) |
| `SMTP_PASS` | Contraseña del email |
| `NOTIFICATION_EMAIL` | Email del terapeuta para notificaciones |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio |

## Configurar Google Calendar

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto → Activar **Google Calendar API**
3. Crear **Service Account** → Copiar el email
4. En la Service Account → Crear clave → Descargar JSON
5. Del JSON, copiar `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
6. Del JSON, copiar `private_key` → `GOOGLE_PRIVATE_KEY`
7. En Google Calendar → Compartir calendario con el email de la Service Account (permisos: "Hacer cambios en eventos")

## Configurar Hostinger SMTP

1. Panel Hostinger → **Emails** → Crear cuenta (ej: `reservas@hipnosisenterapia.com`)
2. Anotar: host `smtp.hostinger.com`, puerto `465`, usuario y contraseña

## Desarrollo

```bash
npm run dev
# → http://localhost:3000
```

## Build y Producción

```bash
npm run build
npm start
```

## Despliegue

### Vercel (Recomendado)
```bash
npx vercel --prod
# Configurar variables de entorno en el dashboard de Vercel
```

### Hostinger (VPS / Node.js)
```bash
npm run build
# Subir carpeta .next/, package.json, node_modules/ al servidor
# Ejecutar: NODE_ENV=production npm start
```

## Estructura

```
src/
├── app/
│   ├── layout.tsx, page.tsx, globals.css
│   └── api/booking/route.ts       ← POST endpoint
├── components/
│   ├── BookingWizard.tsx           ← Orquestador
│   ├── StepIndicator.tsx           ← Progreso visual
│   ├── TriageForm.tsx              ← Paso 0 (con gate Q8)
│   ├── LocationSelector.tsx        ← Paso 1
│   ├── CalendarPicker.tsx          ← Paso 2
│   ├── TimeSlotGrid.tsx            ← Slots horarios
│   └── ConfirmationStep.tsx        ← Paso 3
├── lib/
│   ├── types.ts                    ← Interfaces
│   ├── booking-rules.ts            ← Reglas negocio
│   ├── google-calendar.ts          ← Google Calendar API
│   └── mailer.ts                   ← Nodemailer SMTP
└── data/
    └── triage-questions.ts         ← 8 preguntas + gate
```

## Profesional

Único terapeuta: **Salva Vera**. No hay selector de profesional.
