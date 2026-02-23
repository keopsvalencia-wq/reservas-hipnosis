import { BookingWizard } from '@/components/BookingWizard';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] backdrop-blur-md bg-opacity-90">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <span className="material-icons-outlined text-[var(--color-primary)]">psychology</span>
            <span className="font-bold text-[var(--color-secondary)] text-sm tracking-wide">
              HipnosisTerapia
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <span className="material-icons-outlined text-[14px] text-[var(--color-primary)]">verified</span>
            Salva Vera — Hipnoterapeuta
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* ── Sales Copy Section ── */}
          <div className="stitch-card space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-secondary)]">
                Solicita tu Evaluación Diagnóstica
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xl mx-auto">
                Selecciona el día y la hora que mejor se adapten a ti.
                Recuerda que mi agenda es muy limitada y solo acepto entre <strong>3 y 5 casos nuevos al mes</strong>.
              </p>
            </div>

            <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-5 space-y-4">
              <p className="text-sm font-semibold text-[var(--color-secondary)]">
                En esta sesión de <span className="text-[var(--color-primary)]">45 minutos</span>:
              </p>
              <ul className="space-y-2.5 text-sm text-[var(--color-text-muted)]">
                {[
                  'Analizaremos la raíz exacta de tu problema.',
                  'Veremos si tu caso es 100% apto para el Método Reset.',
                  'Si lo es, te explicaré el plan exacto para solucionarlo definitivamente.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="material-icons-outlined text-[var(--color-primary)] text-[16px] mt-0.5 flex-shrink-0">
                      check_circle
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Gifts Section ── */}
            <div className="bg-[var(--color-primary-soft)] rounded-xl border border-[var(--color-primary)] border-opacity-20 p-5 space-y-3">
              <p className="text-sm font-bold text-[var(--color-secondary)] flex items-center gap-2">
                <span className="text-lg">🎁</span>
                Además, solo por asistir, te llevarás 3 regalos de claridad absoluta:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: 'Regalo 1',
                    text: 'Entenderás de una vez por todas qué te pasa realmente.',
                    sub: 'Mis pacientes me dicen que esta revelación les ha dado más paz mental en 45 minutos que años de terapias convencionales.',
                  },
                  {
                    title: 'Regalo 2',
                    text: 'Verás exactamente por qué NO te ha funcionado nada de lo que has intentado hasta hoy.',
                  },
                  {
                    title: 'Regalo 3',
                    text: 'Descubrirás cuál es la verdadera y única solución a tu problema.',
                  },
                ].map((gift) => (
                  <div key={gift.title} className="flex items-start gap-3">
                    <span className="bg-[var(--color-primary)] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {gift.title.slice(-1)}
                    </span>
                    <div>
                      <p className="text-sm text-[var(--color-secondary)] leading-relaxed">
                        {gift.text}
                      </p>
                      {gift.sub && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-1 italic">
                          {gift.sub}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Shield guarantee ── */}
            <div className="flex items-start gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
              <span className="text-2xl">🛡️</span>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                <strong className="text-[var(--color-secondary)]">Recuerda:</strong> Si durante la sesión veo
                que no te puedo garantizar resultados, el coste de la visita será <strong className="text-[var(--color-primary)]">0€</strong>.
              </p>
            </div>

            {/* ── CTA ── */}
            <p className="text-center text-sm text-[var(--color-text-muted)] font-medium">
              Elige tu hueco en el calendario y responde al formulario con total honestidad.
            </p>
          </div>

          {/* ── Booking Wizard ── */}
          <div id="booking" className="stitch-card max-w-3xl mx-auto">
            <BookingWizard />
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[var(--color-secondary)] text-white/60 text-center text-xs py-4 mt-8">
        <p>© {new Date().getFullYear()} Salva Vera — HipnosisTerapia · Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
