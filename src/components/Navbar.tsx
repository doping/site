"use client"

import { useTranslations } from "next-intl"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Film, Globe, ChevronDown } from "lucide-react"

const localeNames: Record<string, string> = {
  en: "English", it: "Italiano", pt: "Português", es: "Español", de: "Deutsch", fr: "Français",
}

export default function Navbar() {
  const t = useTranslations("nav")
  const { data: session } = useSession()
  const params = useParams()
  const pathname = usePathname()
  const locale = params.locale as string
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const localeSegment = `/${locale}`
  const pathWithoutLocale = pathname.replace(localeSegment, "") || "/"

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl text-violet-600">
            <Film className="w-6 h-6" />
            ClipLicense
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href={`/${locale}/explore`} className="text-slate-600 hover:text-violet-600 transition-colors text-sm font-medium">{t("explore")}</Link>
            <Link href={`/${locale}/creators`} className="text-slate-600 hover:text-violet-600 transition-colors text-sm font-medium">{t("creators")}</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 text-slate-600 hover:text-violet-600 text-sm font-medium px-2 py-1 rounded-md hover:bg-slate-50">
                <Globe className="w-4 h-4" />
                {localeNames[locale]}
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-36 z-50">
                  {Object.entries(localeNames).map(([code, name]) => (
                    <Link
                      key={code}
                      href={`/${code}${pathWithoutLocale}`}
                      onClick={() => setLangOpen(false)}
                      className={`block px-4 py-2 text-sm hover:bg-violet-50 hover:text-violet-600 ${code === locale ? "text-violet-600 font-semibold bg-violet-50" : "text-slate-700"}`}
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {session ? (
              <>
                {session.user.role === "creator" && (
                  <Link href={`/${locale}/upload`} className="text-slate-600 hover:text-violet-600 text-sm font-medium">{t("upload")}</Link>
                )}
                <Link href={`/${locale}/dashboard`} className="text-slate-600 hover:text-violet-600 text-sm font-medium">{t("dashboard")}</Link>
                <button onClick={() => signOut({ callbackUrl: `/${locale}` })} className="text-sm text-slate-600 hover:text-red-600 font-medium">{t("logout")}</button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`} className="text-slate-700 hover:text-violet-600 text-sm font-medium">{t("login")}</Link>
                <Link href={`/${locale}/auth/register`} className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">{t("register")}</Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <Link href={`/${locale}/explore`} className="block text-slate-700 font-medium py-2" onClick={() => setMobileOpen(false)}>{t("explore")}</Link>
          <Link href={`/${locale}/creators`} className="block text-slate-700 font-medium py-2" onClick={() => setMobileOpen(false)}>{t("creators")}</Link>
          {session ? (
            <>
              {session.user.role === "creator" && <Link href={`/${locale}/upload`} className="block text-slate-700 font-medium py-2" onClick={() => setMobileOpen(false)}>{t("upload")}</Link>}
              <Link href={`/${locale}/dashboard`} className="block text-slate-700 font-medium py-2" onClick={() => setMobileOpen(false)}>{t("dashboard")}</Link>
              <button onClick={() => { signOut({ callbackUrl: `/${locale}` }); setMobileOpen(false) }} className="block text-red-600 font-medium py-2">{t("logout")}</button>
            </>
          ) : (
            <>
              <Link href={`/${locale}/auth/login`} className="block text-slate-700 font-medium py-2" onClick={() => setMobileOpen(false)}>{t("login")}</Link>
              <Link href={`/${locale}/auth/register`} className="block bg-violet-600 text-white px-4 py-2 rounded-lg font-medium text-center" onClick={() => setMobileOpen(false)}>{t("register")}</Link>
            </>
          )}
          <div className="border-t pt-3">
            <p className="text-xs text-slate-500 mb-2 font-medium">Language</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(localeNames).map(([code, name]) => (
                <Link key={code} href={`/${code}${pathWithoutLocale}`} onClick={() => setMobileOpen(false)}
                  className={`text-sm px-3 py-1 rounded-full border ${code === locale ? "border-violet-600 text-violet-600 bg-violet-50" : "border-slate-300 text-slate-600"}`}>
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
