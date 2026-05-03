import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { useTranslations } from "next-intl"
import Link from "next/link"
import type { User, Video, License } from "@prisma/client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import VideoCard from "@/components/VideoCard"
import VideoPlayer from "@/components/VideoPlayer"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { Eye, Clock, Tag, Award, ExternalLink } from "lucide-react"
import LicenseButtons from "@/components/LicenseButtons"
import type { Session } from "next-auth"

type VideoWithCreator = Video & { creator: User }

export default async function VideoDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  const session = await getServerSession(authOptions) as Session | null

  const video = await prisma.video.findUnique({
    where: { id },
    include: { creator: true },
  }) as VideoWithCreator | null

  if (!video || video.status !== "active") notFound()

  await prisma.video.update({ where: { id }, data: { views: { increment: 1 } } })

  const related = await prisma.video.findMany({
    where: { category: video.category, id: { not: id }, status: "active" },
    include: { creator: true },
    take: 4,
    orderBy: { views: "desc" },
  }) as VideoWithCreator[]

  const existingLicense: License | null = session?.user
    ? await prisma.license.findFirst({ where: { videoId: id, buyerId: session.user.id, status: "paid" } })
    : null

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <VideoDetailContent video={video} related={related} locale={locale} session={session} existingLicense={existingLicense} />
      </main>
      <Footer />
    </div>
  )
}

function VideoDetailContent({ video, related, locale, session, existingLicense }: {
  video: VideoWithCreator
  related: VideoWithCreator[]
  locale: string
  session: Session | null
  existingLicense: License | null
}) {
  const t = useTranslations("video")
  const tags = video.tags ? video.tags.split(",").map((t) => t.trim()).filter(Boolean) : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <VideoPlayer url={video.url} thumbnail={video.thumbnail} title={video.title} />

          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-6 mb-3">{video.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
            <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> {video.views.toLocaleString()} {t("views")}</div>
            {video.duration && <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}</div>}
            <div className="flex items-center gap-1 capitalize"><Tag className="w-4 h-4" /> {video.category}</div>
          </div>

          {video.description && <p className="text-slate-600 leading-relaxed mb-6">{video.description}</p>}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
              {video.creator.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <p className="font-semibold text-slate-800">{video.creator.name}</p>
                {video.creator.verified && <Award className="w-4 h-4 text-violet-600" />}
              </div>
              {video.creator.bio && <p className="text-xs text-slate-500 line-clamp-1">{video.creator.bio}</p>}
            </div>
            <Link href={`/${locale}/creators/${video.creatorId}`} className="flex items-center gap-1 text-violet-600 text-sm font-medium hover:underline">
              Profile <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-20">
            <h2 className="text-lg font-bold text-slate-900 mb-4">{t("license")}</h2>

            {existingLicense ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <p className="text-green-700 font-semibold text-sm">✓ Licensed</p>
                <p className="text-green-600 text-xs mt-1">You already own a license for this video.</p>
              </div>
            ) : (
              <LicenseButtons
                video={{ id: video.id, price: video.price, currency: video.currency, creatorId: video.creatorId }}
                locale={locale}
                session={session}
              />
            )}

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex justify-between"><span>{t("duration")}</span><span>{video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, "0")}` : "—"}</span></div>
              <div className="flex justify-between"><span>{t("category")}</span><span className="capitalize">{video.category}</span></div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t("relatedTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((v) => (
              <VideoCard key={v.id} {...v} creator={v.creator} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
