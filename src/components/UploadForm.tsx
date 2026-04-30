"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Upload, CheckCircle } from "lucide-react"

const CATEGORIES = ["lifestyle", "travel", "food", "technology", "sports", "fashion", "nature", "animals", "music", "business"]

export default function UploadForm({ locale }: { locale: string }) {
  const t = useTranslations("upload")
  const tCat = useTranslations("categories")
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "lifestyle",
    tags: "",
    price: "99",
    url: "",
    thumbnail: "",
    duration: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: parseFloat(form.price), duration: form.duration ? parseInt(form.duration) : null }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || "Error publishing video")
    } else {
      setSuccess(true)
      setTimeout(() => router.push(`/${locale}/dashboard`), 2000)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t("success")}</h2>
        <p className="text-slate-500">Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{t("title")}</h1>
        <p className="text-slate-500">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t("videoTitle")} *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Amazing sunset timelapse"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t("description")}</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            placeholder="Describe your video..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t("category")} *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{tCat(c as Parameters<typeof tCat>[0])}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t("price")} *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input
                type="number"
                required
                min="1"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t("tags")}</label>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="nature, sunset, timelapse"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t("videoUrl")} *</label>
          <input
            required
            type="url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t("thumbnail")}</label>
          <input
            type="url"
            value={form.thumbnail}
            onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Duration (seconds)</label>
          <input
            type="number"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="120"
          />
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-violet-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          {loading ? "Publishing..." : t("submit")}
        </button>
      </form>
    </div>
  )
}
