import { notFound } from "next/navigation"
import { useTranslations } from "next-intl"
import type { User, Video } from "@prisma/client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import VideoCard from "@/components/VideoCard"
import { prisma } from "@/lib/prisma"
import { Award, Globe, Video as VideoIcon } from "lucide-react"

type CreatorWithVideos = User & {
  videos: (Video & { creator: User })[]
  _count: { videos: number; licenses: number }
}

export default async function CreatorProfilePage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params

  const creator = await prisma.user.findUnique({
    where: { id, role: "creator" },
    include: {
      videos: { where: { status: "active" }, include: { creator: true }, orderBy: { createdAt: "desc" } },
      _count: { select: { videos: true, licenses: true } },
    },
  }) as CreatorWithVideos | null

  if (!creator) notFound()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <CreatorProfileContent creator={creator} locale={locale} />
      </main>
      <Footer />
    </div>
  )
}

function CreatorProfileContent({ creator, locale }: { creator: CreatorWithVideos; locale: string }) {
  const t = useTranslations("creators")

  return (
    <div>
      <div className="bg-gradient-to-br from-violet-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-4xl font-bold text-white flex-shrink-0">
              {creator.name[0]}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-3xl font-extrabold">{creator.name}</h1>
                {creator.verified && <Award className="w-6 h-6 text-yellow-400" />}
              </div>
              {creator.country && <p className="text-violet-200 mb-2">{creator.country}</p>}
              {creator.bio && <p className="text-violet-100 max-w-xl leading-relaxed">{creator.bio}</p>}
              {creator.website && (
                <a href={creator.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-violet-300 hover:text-white text-sm mt-2">
                  <Globe className="w-4 h-4" /> {creator.website}
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-8 mt-8 justify-center sm:justify-start">
            <div className="text-center">
              <div className="text-2xl font-extrabold">{creator._count.videos}</div>
              <div className="text-violet-200 text-sm">{t("videos")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold">{creator._count.licenses}</div>
              <div className="text-violet-200 text-sm">{t("licenses")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-8">
          <VideoIcon className="w-5 h-5 text-violet-600" />
          <h2 className="text-xl font-bold text-slate-900">{t("videos")}</h2>
        </div>
        {creator.videos.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No videos yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creator.videos.map((video) => (
              <VideoCard key={video.id} {...video} creator={video.creator} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
