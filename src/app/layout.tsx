import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const cormorant = localFont({
  variable: "--font-cormorant",
  src: [
    { path: "./fonts/cormorant-garamond-latin.woff2", weight: "400 700", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-italic.woff2", weight: "400 700", style: "italic" },
  ],
  display: "swap",
});

const dmSans = localFont({
  variable: "--font-dm-sans",
  src: [{ path: "./fonts/dm-sans-latin.woff2", weight: "300 700", style: "normal" }],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LiDu Garden · Restaurante Fusión Asiática en Mutxamel, Alicante",
  description:
    "Restaurante de cocina fusión asiática en Mutxamel, Alicante. Cocina china, japonesa, tailandesa y vietnamita en un ambiente acogedor y familiar. Reserva tu mesa.",
  keywords: [
    "restaurante asiático alicante",
    "fusión asiática mutxamel",
    "sushi alicante",
    "restaurante chino alicante",
    "lidu garden",
    "taller de sushi alicante",
  ],
  openGraph: {
    title: "LiDu Garden · Fusión Asiática · Mutxamel",
    description:
      "Donde Asia se sienta a tu mesa. Reserva en nuestro restaurante de cocina fusión asiática en Mutxamel, Alicante.",
    type: "website",
    locale: "es_ES",
    siteName: "LiDu Garden",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
