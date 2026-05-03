"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, User } from "lucide-react"

interface ProfileFormProps {
  user: { id: string; name: string; email: string; bio: string | null; country: string | null; website: string | null; role: string }
  locale: string
}

export default function ProfileForm({ user, locale }: ProfileFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: user.name,
    bio: user.bio || "",
    country: user.country || "",
    website: user.website || "",
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    } else {
      setError("Failed to save changes.")
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
          {user.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Edit Profile</h1>
          <p className="text-slate-500 text-sm">{user.email} · <span className="capitalize">{user.role}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            placeholder="Tell brands about yourself and your content style..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
          <input
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Italy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Website / Social</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="https://instagram.com/yourusername"
          />
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && (
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Saved!
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
