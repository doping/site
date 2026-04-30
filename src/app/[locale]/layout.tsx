import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import Providers from "@/components/Providers"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClipLicense — UGC Video Marketplace",
  description: "License authentic UGC videos from creators worldwide. The marketplace for brands and content creators.",
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as "en" | "it" | "pt" | "es" | "de" | "fr")) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.className}>
      <body className="min-h-screen bg-white text-slate-900 flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
