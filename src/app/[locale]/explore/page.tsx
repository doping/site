import { useTranslations } from "next-intl"
import type { User, Video } from "@prisma/client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import VideoCard from "@/components/VideoCard"
import { prisma } from "@/lib/prisma"
import ExploreFilters from "@/components/ExploreFilters"

const CATEGORIES = ["all", "lifestyle", "travel", "food", "technology", "sports", "fashion", "nature", "animals", "music", "business"]

type VideoWithCreator = Video & { creator: User }

export default async function ExplorePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>
}) {
  const { locale } = await params
  const { category, sort, q } = await searchParams

  const where: { status: string; category?: string; title?: { contains: string } } = { status: "active" }
  if (category && category !== "all") where.category = category
  if (q) where.title = { contains: q }

  const orderBy: { createdAt?: "desc" | "asc"; views?: "desc" | "asc"; price?: "desc" | "asc" } =
    sort === "popular" ? { views: "desc" } :
    sort === "price" ? { price: "asc" } :
    { createdAt: "desc" }

  const videos = await prisma.video.findMany({
    where,
    include: { creator: true },
    orderBy,
    take: 24,
  }) as VideoWithCreator[]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <ExploreContent videos={videos} locale={locale} category={category} sort={sort} q={q} />
      </main>
      <Footer />
    </div>
  )
}

function ExploreContent({
  videos,
  locale,
  category,
  sort,
  q,
}: {
  videos: VideoWithCreator[]
  locale: string
  category?: string
  sort?: string
  q?: string
}) {
  const t = useTranslations("explore")
  const tCat = useTranslations("categories")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{t("title")}</h1>
      </div>

      <ExploreFilters locale={locale} initialCategory={category} initialSort={sort} initialQ={q} />

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <a
            key={cat}
            href={`/${locale}/explore?category=${cat}${sort ? `&sort=${sort}` : ""}${q ? `&q=${q}` : ""}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${(category || "all") === cat ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-600"}`}
          >
            {tCat(cat as "all" | "lifestyle" | "travel" | "food" | "technology" | "sports" | "fashion" | "nature" | "animals" | "music" | "business")}
          </a>
        ))}
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-xl">{t("noResults")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} {...video} creator={video.creator} />
          ))}
        </div>
      )}
    </div>
  )
}
