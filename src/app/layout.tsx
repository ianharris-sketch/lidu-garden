import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
