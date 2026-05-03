"use client"

import { useTranslations } from "next-intl"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Menu, X, Film, Globe, ChevronDown, User, LayoutDashboard, Upload, LogOut } from "lucide-react"

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
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  const localeSegment = `/${locale}`
  const pathWithoutLocale = pathname.replace(localeSegment, "") || "/"

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const avatarLetter = session?.user?.name?.[0]?.toUpperCase() || "?"

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
            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 text-slate-600 hover:text-violet-600 text-sm font-medium px-2 py-1 rounded-md hover:bg-slate-50">
                <Globe className="w-4 h-4" />
                {localeNames[locale]}
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-36 z-50">
                  {Object.entries(localeNames).map(([code, name]) => (
                    <Link key={code} href={`/${code}${pathWithoutLocale}`} onClick={() => setLangOpen(false)}
                      className={`block px-4 py-2 text-sm hover:bg-violet-50 hover:text-violet-600 ${code === locale ? "text-violet-600 font-semibold bg-violet-50" : "text-slate-700"}`}>
                      {name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {session ? (
              <>
                {session.user.role === "creator" && (
                  <Link href={`/${locale}/upload`} className="flex items-center gap-1.5 text-slate-600 hover:text-violet-600 text-sm font-medium">
                    <Upload className="w-4 h-4" />{t("upload")}
                  </Link>
                )}

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {avatarLetter}
                    </div>
                    <span className="text-sm font-medium text-slate-700 max-w-24 truncate">{session.user.name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800 truncate">{session.user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${session.user.role === "creator" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>
                          {session.user.role}
                        </span>
                      </div>
                      <Link href={`/${locale}/dashboard`} onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600">
                        <LayoutDashboard className="w-4 h-4" /> {t("dashboard")}
                      </Link>
                      <Link href={`/${locale}/profile`} onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600">
                        <User className="w-4 h-4" /> Edit Profile
                      </Link>
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button onClick={() => { signOut({ callbackUrl: `/${locale}` }); setProfileOpen(false) }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left">
                          <LogOut className="w-4 h-4" /> {t("logout")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
              <div className="flex items-center gap-3 py-2 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold">{avatarLetter}</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{session.user.name}</p>
                  <p className="text-xs text-slate-400">{session.user.role}</p>
                </div>
              </div>
              {session.user.role === "creator" && <Link href={`/${locale}/upload`} className="block text-slate-700 font-medium py-2" onClick={() => setMobileOpen(false)}>{t("upload")}</Link>}
              <Link href={`/${locale}/dashboard`} className="block text-slate-700 font-medium py-2" onClick={() => setMobileOpen(false)}>{t("dashboard")}</Link>
              <Link href={`/${locale}/profile`} className="block text-slate-700 font-medium py-2" onClick={() => setMobileOpen(false)}>Edit Profile</Link>
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
