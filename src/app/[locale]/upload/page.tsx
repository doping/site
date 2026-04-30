import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import UploadForm from "@/components/UploadForm"

export default async function UploadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "creator") {
    redirect(`/${locale}/auth/login`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <UploadForm locale={locale} />
      </main>
      <Footer />
    </div>
  )
}
