"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"

export default function ExploreFilters({
  locale,
  initialCategory,
  initialSort,
  initialQ,
}: {
  locale: string
  initialCategory?: string
  initialSort?: string
  initialQ?: string
}) {
  const t = useTranslations("explore")
  const router = useRouter()
  const [q, setQ] = useState(initialQ || "")
  const [sort, setSort] = useState(initialSort || "newest")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (sort && sort !== "newest") params.set("sort", sort)
    if (initialCategory && initialCategory !== "all") params.set("category", initialCategory)
    router.push(`/${locale}/explore?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("search")}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-slate-400" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
        >
          <option value="newest">{t("sortNewest")}</option>
          <option value="popular">{t("sortPopular")}</option>
          <option value="price">{t("sortPrice")}</option>
        </select>
      </div>
      <button type="submit" className="bg-violet-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
        {t("search").replace("...", "")}
      </button>
    </form>
  )
}
