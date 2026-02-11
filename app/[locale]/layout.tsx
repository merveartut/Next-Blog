import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import {
  Plus_Jakarta_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import { LoadingProvider } from "@/components/LoadingProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Be Log",
  description: "Your playground",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  // params'ı Promise içine alarak güncelliyoruz
  params: Promise<{ locale: string }>;
}>) {
  // params'ı await ile bekletip içindeki locale'i alıyoruz
  const { locale } = await params;

  if (!["tr", "en"].includes(locale)) {
    notFound();
  }

  // Çeviri dosyalarını sunucudan alıyoruz
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${jakarta.variable} ${instrument.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased text-slate-900 bg-[#f5f3ea] overflow-x-hidden">
        <AuthProvider>
          <LoadingProvider>
            <NextIntlClientProvider messages={messages} locale={locale}>
              <Navbar />
              {children}
            </NextIntlClientProvider>
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
