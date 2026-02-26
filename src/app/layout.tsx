import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Reservar Sesión | HipnosisTerapia Valencia",
  description:
    "Reserva tu sesión de valoración diagnóstica con Salva Vera. Hipnoterapia profesional en Valencia, Motilla del Palancar y Online.",
  openGraph: {
    title: "Reservar Sesión | HipnosisTerapia Valencia",
    description:
      "Reserva tu sesión de valoración diagnóstica. Hipnoterapia profesional en Valencia y Online.",
    url: "https://reservas.hipnosisenterapia.com",
    siteName: "HipnosisTerapia",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head />
      <body className={`${montserrat.variable} ${montserrat.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
