"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Film, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const t = useTranslations("auth")
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError(t("error"))
    } else {
      router.push(`/${locale}/dashboard`)
    }
  }

  const fillDemo = (type: "creator" | "brand") => {
    setEmail(type === "creator" ? "creator@demo.com" : "brand@demo.com")
    setPassword("demo123")
    setError("")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-violet-600 font-bold text-2xl mb-6">
            <Film className="w-7 h-7" /> ClipLicense
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">{t("loginTitle")}</h1>
          <p className="text-slate-500 mt-1">{t("loginSubtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="mb-6 p-4 bg-violet-50 rounded-xl border border-violet-100">
            <p className="text-xs font-semibold text-violet-700 mb-2">{t("demoTitle")}</p>
            <div className="flex gap-2">
              <button onClick={() => fillDemo("creator")} className="flex-1 text-xs bg-white border border-violet-200 text-violet-600 py-1.5 rounded-lg hover:bg-violet-600 hover:text-white transition-colors font-medium">
                Creator
              </button>
              <button onClick={() => fillDemo("brand")} className="flex-1 text-xs bg-white border border-violet-200 text-violet-600 py-1.5 rounded-lg hover:bg-violet-600 hover:text-white transition-colors font-medium">
                Brand
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">creator@demo.com / brand@demo.com — password: demo123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("password")}</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "..." : t("loginBtn")}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {t("noAccount")}{" "}
            <Link href={`/${locale}/auth/register`} className="text-violet-600 font-semibold hover:underline">{t("signUp")}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
