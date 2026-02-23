import { BookingWizard } from "@/components/BookingWizard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Stitch Navbar ──────────────────────── */}
      <nav className="bg-[var(--color-bg-card)] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="material-icons-outlined text-[var(--color-primary)] text-4xl">
                psychology
              </span>
              <div>
                <h1 className="text-xl font-bold text-[var(--color-secondary)] leading-tight">
                  Hipnosis<span className="text-[var(--color-primary)]">Terapia</span>
                </h1>
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">
                  Valencia
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="https://hipnosisenterapia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors text-sm font-medium"
              >
                Volver al Inicio
              </a>
              <a
                href="https://hipnosisenterapia.com/contacto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors text-sm font-medium"
              >
                Contacto
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Main Content ───────────────────────── */}
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] mb-3">
            Reserva tu sesión
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto font-light">
            Sesión de valoración diagnóstica con <strong className="font-semibold">Salva Vera</strong>.
            Completa los pasos para confirmar tu cita.
          </p>
        </div>

        <BookingWizard />
      </main>

      {/* ─── Stitch Footer ──────────────────────── */}
      <footer className="bg-[var(--color-secondary)] text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="material-icons-outlined text-[var(--color-primary)] text-2xl">
              psychology
            </span>
            <span className="font-bold text-lg tracking-tight">
              Hipnosis<span className="text-[var(--color-primary)]">Terapia</span>
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Transformando vidas a través de la hipnoterapia profesional en Valencia.
          </p>
          <div className="space-x-4 text-xs text-gray-400 mb-4">
            <a className="hover:text-[var(--color-primary)] transition-colors" href="https://hipnosisenterapia.com/privacidad">
              Política de Privacidad
            </a>
            <a className="hover:text-[var(--color-primary)] transition-colors" href="https://hipnosisenterapia.com/legal">
              Términos Legales
            </a>
          </div>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} HipnosisTerapia Valencia. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
