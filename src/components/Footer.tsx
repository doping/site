"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Film } from "lucide-react"

export default function Footer() {
  const t = useTranslations("footer")
  const params = useParams()
  const locale = params.locale as string

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Film className="w-6 h-6 text-violet-400" />
              ClipLicense
            </div>
            <p className="text-sm text-slate-400">{t("tagline")}</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">{t("forBrands")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/explore`} className="hover:text-violet-400 transition-colors">{t("browse")}</Link></li>
              <li><Link href={`/${locale}/explore`} className="hover:text-violet-400 transition-colors">{t("howItWorks")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">{t("forCreators")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/upload`} className="hover:text-violet-400 transition-colors">{t("upload")}</Link></li>
              <li><Link href={`/${locale}/dashboard`} className="hover:text-violet-400 transition-colors">{t("earnings")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">{t("company")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}`} className="hover:text-violet-400 transition-colors">{t("about")}</Link></li>
              <li><Link href={`/${locale}`} className="hover:text-violet-400 transition-colors">{t("privacy")}</Link></li>
              <li><Link href={`/${locale}`} className="hover:text-violet-400 transition-colors">{t("terms")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 text-sm text-slate-500 text-center">
          {t("copyright")}
        </div>
      </div>
    </footer>
  )
}
