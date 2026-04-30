import { useTranslations } from "next-intl"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import CreatorCard from "@/components/CreatorCard"
import { prisma } from "@/lib/prisma"
import { Search } from "lucide-react"

export default async function CreatorsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { locale } = await params
  const { q } = await searchParams

  const creators = await prisma.user.findMany({
    where: {
      role: "creator",
      ...(q ? { name: { contains: q } } : {}),
    },
    include: { _count: { select: { videos: true, licenses: true } } },
    orderBy: { videos: { _count: "desc" } },
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <CreatorsContent creators={creators} locale={locale} q={q} />
      </main>
      <Footer />
    </div>
  )
}

function CreatorsContent({
  creators,
  locale,
  q,
}: {
  creators: Awaited<ReturnType<typeof prisma.user.findMany<{ include: { _count: { select: { videos: true; licenses: true } } } }>>>
  locale: string
  q?: string
}) {
  const t = useTranslations("creators")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{t("title")}</h1>
        <p className="text-slate-500">{t("subtitle")}</p>
      </div>

      <form method="GET" className="flex gap-3 mb-8 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder={t("search")}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <button type="submit" className="bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {creators.map((creator) => (
          <CreatorCard key={creator.id} {...creator} />
        ))}
      </div>
    </div>
  )
}
