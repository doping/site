"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Film, ShieldCheck, CreditCard, Lock } from "lucide-react"

interface LicenseData {
  id: string
  type: string
  price: number
  currency: string
  status: string
  video: { id: string; title: string; thumbnail?: string | null; creator: { name: string } }
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const licenseId = params.licenseId as string
  const [license, setLicense] = useState<LicenseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  const [cardNum, setCardNum] = useState("4242 4242 4242 4242")
  const [expiry, setExpiry] = useState("12/28")
  const [cvv, setCvv] = useState("123")

  useEffect(() => {
    fetch(`/api/licenses/${licenseId}`)
      .then((r) => r.json())
      .then((data) => { setLicense(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [licenseId])

  const handlePay = async () => {
    setPaying(true)
    await new Promise((r) => setTimeout(r, 2000))
    await fetch(`/api/licenses/${licenseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    })
    setPaying(false)
    setPaid(true)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>
  if (!license) return <div className="min-h-screen flex items-center justify-center text-slate-500">Not found</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-2">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-violet-600 font-bold text-xl">
          <Film className="w-5 h-5" /> ClipLicense
        </Link>
        <span className="text-slate-400 mx-2">/</span>
        <span className="text-slate-600 text-sm">Checkout</span>
        <div className="ml-auto flex items-center gap-1 text-xs text-slate-400">
          <Lock className="w-3 h-3" /> Secure Payment
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-12">
        {paid ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">License Activated!</h1>
            <p className="text-slate-500 mb-6">You can now use <strong>{license.video.title}</strong> under the {license.type} license terms.</p>
            <div className="flex gap-3 justify-center">
              <Link href={`/${locale}/dashboard`} className="bg-violet-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-violet-700 transition-colors">My Licenses</Link>
              <Link href={`/${locale}/explore`} className="border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors">Explore More</Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
              <h1 className="text-xl font-bold mb-1">Complete Your Purchase</h1>
              <p className="text-violet-200 text-sm">Demo checkout — no real payment processed</p>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                <div className="w-16 h-10 bg-slate-200 rounded flex items-center justify-center text-2xl flex-shrink-0">🎬</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{license.video.title}</p>
                  <p className="text-xs text-slate-500">by {license.video.creator.name}</p>
                  <p className="text-xs text-violet-600 font-medium capitalize mt-0.5">{license.type} License</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-slate-900">{license.currency} {license.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Card Number</label>
                  <div className="relative">
                    <input value={cardNum} onChange={(e) => setCardNum(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Expiry</label>
                    <input value={expiry} onChange={(e) => setExpiry(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">CVV</label>
                    <input value={cvv} onChange={(e) => setCvv(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full bg-violet-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-violet-700 disabled:opacity-70 transition-colors flex items-center justify-center gap-2"
              >
                {paying ? (
                  <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Processing...</>
                ) : (
                  <><Lock className="w-4 h-4" /> Pay {license.currency} {license.price.toFixed(2)}</>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 mt-3">
                🔒 Demo mode — no real charge will be made
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
