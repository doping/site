import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { useTranslations } from "next-intl"
import Link from "next/link"
import type { User, Video, License } from "@prisma/client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { Video as VideoIcon, ShoppingBag, DollarSign, Eye, Upload, TrendingUp } from "lucide-react"
import DashboardCharts from "@/components/DashboardCharts"

type VideoWithLicenses = Video & { licenses: License[] }
type LicenseWithVideo = License & { video: Video & { creator: User } }
type UserWithData = User & {
  videos: VideoWithLicenses[]
  licenses: LicenseWithVideo[]
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect(`/${locale}/auth/login`)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      videos: { include: { licenses: true }, orderBy: { createdAt: "desc" } },
      licenses: { include: { video: { include: { creator: true } } }, orderBy: { createdAt: "desc" } },
    },
  }) as UserWithData | null

  if (!user) redirect(`/${locale}/auth/login`)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {user.role === "creator" ? (
          <CreatorDashboard user={user} locale={locale} />
        ) : (
          <BrandDashboard user={user} locale={locale} />
        )}
      </main>
      <Footer />
    </div>
  )
}

function generateWeeklyData(total: number, label: string): Record<string, string | number>[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weights = [0.10, 0.12, 0.14, 0.16, 0.18, 0.16, 0.14]
  return days.map((day, i) => ({
    day,
    [label]: Math.round(total * weights[i] * (0.8 + Math.random() * 0.4)),
  }))
}

function CreatorDashboard({ user, locale }: { user: UserWithData; locale: string }) {
  const t = useTranslations("dashboard")
  const totalViews = user.videos.reduce((acc, v) => acc + v.views, 0)
  const paidLicenses = user.videos.flatMap((v) => v.licenses.filter((l) => l.status === "paid"))
  const totalEarnings = paidLicenses.reduce((acc, l) => acc + l.price, 0)

  const viewsData = generateWeeklyData(Math.max(totalViews, 100), "Views")
  const earningsData = generateWeeklyData(Math.max(totalEarnings, 10), "Earnings")
  const topVideos = [...user.videos]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((v) => ({ name: v.title.length > 22 ? v.title.slice(0, 22) + "…" : v.title, Views: v.views, Earnings: v.licenses.filter((l) => l.status === "paid").reduce((s, l) => s + l.price, 0) }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{t("title")}</h1>
          <p className="text-slate-500">{t("welcome")}, {user.name} 👋</p>
        </div>
        <Link href={`/${locale}/upload`} className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-violet-700 transition-colors text-sm">
          <Upload className="w-4 h-4" /> {t("uploadVideo")}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<Eye className="w-6 h-6 text-blue-600" />} label={t("totalViews")} value={totalViews.toLocaleString()} bg="bg-blue-50" />
        <StatCard icon={<ShoppingBag className="w-6 h-6 text-violet-600" />} label={t("totalLicenses")} value={paidLicenses.length.toString()} bg="bg-violet-50" />
        <StatCard icon={<DollarSign className="w-6 h-6 text-green-600" />} label={t("earnings")} value={`$${totalEarnings.toFixed(0)}`} bg="bg-green-50" />
      </div>

      <DashboardCharts
        role="creator"
        viewsData={viewsData}
        earningsData={earningsData}
        topVideos={topVideos}
      />

      <div className="flex items-center gap-2 mb-4 mt-10">
        <VideoIcon className="w-5 h-5 text-violet-600" />
        <h2 className="text-xl font-bold text-slate-900">{t("myVideos")}</h2>
      </div>

      {user.videos.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <VideoIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 mb-4">{t("noVideos")}</p>
          <Link href={`/${locale}/upload`} className="bg-violet-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-violet-700 transition-colors">
            {t("uploadVideo")}
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Views</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Licenses</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {user.videos.map((video) => (
                <tr key={video.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/${locale}/videos/${video.id}`} className="font-medium text-slate-800 hover:text-violet-600 text-sm line-clamp-1">{video.title}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 capitalize hidden sm:table-cell">{video.category}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{video.views.toLocaleString()}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {video.licenses.filter((l) => l.status === "paid").length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">${video.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function BrandDashboard({ user, locale }: { user: UserWithData; locale: string }) {
  const t = useTranslations("dashboard")
  const paidLicenses = user.licenses.filter((l) => l.status === "paid")
  const totalSpent = paidLicenses.reduce((acc, l) => acc + l.price, 0)

  const spendData = generateWeeklyData(Math.max(totalSpent, 10), "Spent")
  const categoryCount: Record<string, number> = {}
  paidLicenses.forEach((l) => {
    const cat = l.video.category
    categoryCount[cat] = (categoryCount[cat] || 0) + 1
  })
  const categoryData = Object.entries(categoryCount).map(([name, count]) => ({ name, Licenses: count }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{t("title")}</h1>
          <p className="text-slate-500">{t("welcome")}, {user.name} 👋</p>
        </div>
        <Link href={`/${locale}/explore`} className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-violet-700 transition-colors text-sm">
          <TrendingUp className="w-4 h-4" /> Browse Videos
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <StatCard icon={<ShoppingBag className="w-6 h-6 text-violet-600" />} label={t("totalLicenses")} value={paidLicenses.length.toString()} bg="bg-violet-50" />
        <StatCard icon={<DollarSign className="w-6 h-6 text-blue-600" />} label={t("totalSpent")} value={`$${totalSpent.toFixed(0)}`} bg="bg-blue-50" />
      </div>

      <DashboardCharts role="brand" spendData={spendData} categoryData={categoryData} />

      <div className="flex items-center gap-2 mb-4 mt-10">
        <ShoppingBag className="w-5 h-5 text-violet-600" />
        <h2 className="text-xl font-bold text-slate-900">{t("myLicenses")}</h2>
      </div>

      {paidLicenses.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 mb-4">{t("noLicenses")}</p>
          <Link href={`/${locale}/explore`} className="bg-violet-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-violet-700 transition-colors">Browse Videos</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Video</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Creator</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">License</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paidLicenses.map((license) => (
                <tr key={license.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/${locale}/videos/${license.video.id}`} className="font-medium text-slate-800 hover:text-violet-600 text-sm line-clamp-1">{license.video.title}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 hidden sm:table-cell">{license.video.creator.name}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${license.type === "exclusive" ? "bg-amber-100 text-amber-700" : "bg-violet-100 text-violet-700"}`}>
                      {license.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">${license.price.toFixed(0)}</td>
                  <td className="px-6 py-4 text-xs text-slate-400 hidden md:table-cell">{new Date(license.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className={`${bg} rounded-2xl p-6 flex items-center gap-4`}>
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}
