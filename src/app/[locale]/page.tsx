import { useTranslations } from "next-intl"
import Link from "next/link"
import type { User, Video } from "@prisma/client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import VideoCard from "@/components/VideoCard"
import CreatorCard from "@/components/CreatorCard"
import { prisma } from "@/lib/prisma"
import { ArrowRight, Play, ShieldCheck, Zap, Globe } from "lucide-react"

type VideoWithCreator = Video & { creator: User }
type CreatorWithCount = User & { _count: { videos: number; licenses: number } }

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const [featuredVideos, topCreators] = await Promise.all([
    prisma.video.findMany({
      where: { status: "active", featured: true },
      include: { creator: true },
      orderBy: { views: "desc" },
      take: 6,
    }) as Promise<VideoWithCreator[]>,
    prisma.user.findMany({
      where: { role: "creator" },
      include: { _count: { select: { videos: true, licenses: true } } },
      orderBy: { videos: { _count: "desc" } },
      take: 4,
    }) as Promise<CreatorWithCount[]>,
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection locale={locale} />
        <StatsSection />
        <HowItWorksSection />
        {featuredVideos.length > 0 && <FeaturedVideosSection videos={featuredVideos} locale={locale} />}
        {topCreators.length > 0 && <TopCreatorsSection creators={topCreators} locale={locale} />}
        <CTASection locale={locale} />
      </main>
      <Footer />
    </div>
  )
}

function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations("hero")
  return (
    <section className="relative bg-gradient-to-br from-violet-900 via-violet-800 to-indigo-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)" }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-block bg-white/10 backdrop-blur border border-white/20 text-violet-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            {t("badge")}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            {t("title")}
          </h1>
          <p className="text-lg sm:text-xl text-violet-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/explore`} className="flex items-center justify-center gap-2 bg-white text-violet-700 px-8 py-4 rounded-xl font-bold text-base hover:bg-violet-50 transition-colors shadow-lg">
              <Play className="w-5 h-5" />
              {t("ctaBrand")}
            </Link>
            <Link href={`/${locale}/auth/register`} className="flex items-center justify-center gap-2 bg-violet-600 border-2 border-violet-400 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-violet-500 transition-colors">
              {t("ctaCreator")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const t = useTranslations("hero")
  const stats = [
    { label: t("statsVideos"), value: "12,400+" },
    { label: t("statsCreators"), value: "3,200+" },
    { label: t("statsBrands"), value: "850+" },
  ]
  return (
    <section className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl lg:text-4xl font-extrabold text-violet-400 mb-1">{s.value}</div>
              <div className="text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const t = useTranslations("home")
  const steps = [
    { icon: <Globe className="w-7 h-7 text-violet-600" />, title: t("step1Title"), desc: t("step1Desc"), num: "01" },
    { icon: <ShieldCheck className="w-7 h-7 text-violet-600" />, title: t("step2Title"), desc: t("step2Desc"), num: "02" },
    { icon: <Zap className="w-7 h-7 text-violet-600" />, title: t("step3Title"), desc: t("step3Desc"), num: "03" },
  ]
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">{t("howTitle")}</h2>
          <p className="text-slate-500">{t("howSubtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">{step.icon}</div>
                <span className="text-4xl font-extrabold text-slate-100">{step.num}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedVideosSection({ videos, locale }: { videos: VideoWithCreator[]; locale: string }) {
  const t = useTranslations("home")
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">{t("featuredTitle")}</h2>
            <p className="text-slate-500">{t("featuredSubtitle")}</p>
          </div>
          <Link href={`/${locale}/explore`} className="hidden sm:flex items-center gap-1 text-violet-600 font-semibold hover:gap-2 transition-all text-sm">
            {t("viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} {...video} creator={video.creator} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TopCreatorsSection({ creators, locale }: { creators: CreatorWithCount[]; locale: string }) {
  const t = useTranslations("home")
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">{t("topCreatorsTitle")}</h2>
          </div>
          <Link href={`/${locale}/creators`} className="hidden sm:flex items-center gap-1 text-violet-600 font-semibold hover:gap-2 transition-all text-sm">
            {t("viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} {...creator} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ locale }: { locale: string }) {
  const t = useTranslations("hero")
  return (
    <section className="py-20 bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">{t("title")}</h2>
        <p className="text-violet-200 mb-8 text-lg">{t("subtitle")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${locale}/auth/register`} className="bg-white text-violet-700 px-8 py-4 rounded-xl font-bold hover:bg-violet-50 transition-colors">
            {t("ctaCreator")}
          </Link>
          <Link href={`/${locale}/explore`} className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
            {t("ctaBrand")}
          </Link>
        </div>
      </div>
    </section>
  )
}
