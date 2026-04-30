"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ShieldCheck, Zap, Crown } from "lucide-react"
import type { Session } from "next-auth"

interface LicenseButtonsProps {
  video: { id: string; price: number; currency: string }
  locale: string
  session: Session | null
}

export default function LicenseButtons({ video, locale, session }: LicenseButtonsProps) {
  const t = useTranslations("video")
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const plans = [
    { type: "standard", label: t("standard"), desc: t("standardDesc"), price: video.price, icon: <ShieldCheck className="w-5 h-5" />, color: "border-slate-200 hover:border-violet-400" },
    { type: "extended", label: t("extended"), desc: t("extendedDesc"), price: video.price * 2.5, icon: <Zap className="w-5 h-5" />, color: "border-slate-200 hover:border-violet-400" },
    { type: "exclusive", label: t("exclusive"), desc: t("exclusiveDesc"), price: video.price * 8, icon: <Crown className="w-5 h-5 text-amber-500" />, color: "border-amber-200 hover:border-amber-400" },
  ]

  const handleBuy = async (licenseType: string, price: number) => {
    if (!session) {
      router.push(`/${locale}/auth/login`)
      return
    }
    setLoading(licenseType)
    const res = await fetch("/api/licenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId: video.id, type: licenseType, price }),
    })
    const data = await res.json()
    setLoading(null)
    if (res.ok) {
      router.push(`/${locale}/checkout/${data.id}`)
    }
  }

  return (
    <div className="space-y-3">
      {plans.map((plan) => (
        <div key={plan.type} className={`border-2 rounded-xl p-4 transition-colors ${plan.color}`}>
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-violet-600">{plan.icon}</span>
              <span className="font-semibold text-sm text-slate-800">{plan.label}</span>
            </div>
            <span className="font-bold text-slate-900">{video.currency} {plan.price.toFixed(0)}</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">{plan.desc}</p>
          <button
            onClick={() => handleBuy(plan.type, plan.price)}
            disabled={loading === plan.type}
            className="w-full bg-violet-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-60 transition-colors"
          >
            {loading === plan.type ? "..." : t("buyNow")}
          </button>
        </div>
      ))}
    </div>
  )
}
