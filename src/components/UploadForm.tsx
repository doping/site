"use client"

import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Upload, CheckCircle, Film, X, Loader2 } from "lucide-react"

const CATEGORIES = ["lifestyle", "travel", "food", "technology", "sports", "fashion", "nature", "animals", "music", "business", "diy", "gaming", "comedy", "fitness", "education", "beauty", "art"]
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxp820xti"
const UPLOAD_PRESET = "cliplicense_videos"

interface UploadState {
  status: "idle" | "uploading" | "done" | "error"
  progress: number
  url: string
  thumbnail: string
  duration: number
  fileName: string
}

export default function UploadForm({ locale }: { locale: string }) {
  const t = useTranslations("upload")
  const tCat = useTranslations("categories")
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "lifestyle",
    tags: "",
    price: "99",
  })
  const [upload, setUpload] = useState<UploadState>({
    status: "idle",
    progress: 0,
    url: "",
    thumbnail: "",
    duration: 0,
    fileName: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("video/")) {
      setError("Please select a video file.")
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      setError("File too large. Max 500MB.")
      return
    }

    setError("")
    setUpload({ status: "uploading", progress: 0, url: "", thumbnail: "", duration: 0, fileName: file.name })

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", UPLOAD_PRESET)
    formData.append("resource_type", "video")

    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        setUpload((prev) => ({ ...prev, progress: Math.round((e.loaded / e.total) * 100) }))
      }
    })

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        const thumbUrl = data.secure_url.replace("/video/upload/", "/video/upload/so_auto,f_jpg,q_80,w_800/").replace(/\.[^/.]+$/, ".jpg")
        setUpload({
          status: "done",
          progress: 100,
          url: data.secure_url,
          thumbnail: thumbUrl,
          duration: Math.round(data.duration || 0),
          fileName: file.name,
        })
        if (!form.title) {
          setForm((prev) => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") }))
        }
      } else {
        setUpload((prev) => ({ ...prev, status: "error" }))
        setError("Upload failed. Check your Cloudinary preset.")
      }
    })

    xhr.addEventListener("error", () => {
      setUpload((prev) => ({ ...prev, status: "error" }))
      setError("Upload failed. Check your connection.")
    })

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`)
    xhr.send(formData)
  }

  const resetUpload = () => {
    setUpload({ status: "idle", progress: 0, url: "", thumbnail: "", duration: 0, fileName: "" })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!upload.url) { setError("Please upload a video first."); return }
    setError("")
    setSubmitting(true)
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        url: upload.url,
        thumbnail: upload.thumbnail,
        duration: upload.duration || null,
      }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (!res.ok) {
      setError(data.error || "Error publishing video")
    } else {
      setSuccess(true)
      setTimeout(() => router.push(`/${locale}/dashboard`), 2000)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t("success")}</h2>
        <p className="text-slate-500">Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{t("title")}</h1>
        <p className="text-slate-500">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-5">

        {/* Video Upload Area */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Video File *</label>

          {upload.status === "idle" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all group"
            >
              <Film className="w-12 h-12 text-slate-300 group-hover:text-violet-400 mx-auto mb-3 transition-colors" />
              <p className="font-semibold text-slate-600 mb-1">Click to select a video</p>
              <p className="text-sm text-slate-400">MP4, MOV, AVI, WebM — max 500MB</p>
              <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
            </div>
          )}

          {upload.status === "uploading" && (
            <div className="border-2 border-violet-200 bg-violet-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-5 h-5 text-violet-600 animate-spin flex-shrink-0" />
                <span className="text-sm font-medium text-violet-700 truncate">{upload.fileName}</span>
                <span className="ml-auto text-sm font-bold text-violet-700">{upload.progress}%</span>
              </div>
              <div className="w-full bg-violet-200 rounded-full h-2">
                <div
                  className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
              <p className="text-xs text-violet-500 mt-2 text-center">Uploading to Cloudinary...</p>
            </div>
          )}

          {upload.status === "done" && (
            <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4 flex items-center gap-4">
              {upload.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={upload.thumbnail} alt="thumbnail" className="w-20 h-12 object-cover rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Uploaded successfully
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{upload.fileName}</p>
                {upload.duration > 0 && <p className="text-xs text-slate-400">{Math.floor(upload.duration / 60)}:{(upload.duration % 60).toString().padStart(2, "0")} min</p>}
              </div>
              <button type="button" onClick={resetUpload} className="text-slate-400 hover:text-red-500 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {upload.status === "error" && (
            <div className="border-2 border-red-200 bg-red-50 rounded-xl p-4 flex items-center justify-between">
              <p className="text-sm text-red-600">Upload failed. Try again.</p>
              <button type="button" onClick={resetUpload} className="text-xs text-red-500 underline">Reset</button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t("videoTitle")} *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Amazing sunset timelapse"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t("description")}</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            placeholder="Describe your video..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t("category")} *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{tCat(c as Parameters<typeof tCat>[0])}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t("price")} *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input
                type="number"
                required
                min="1"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t("tags")}</label>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="nature, sunset, timelapse"
          />
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <button
          type="submit"
          disabled={submitting || upload.status === "uploading" || upload.status !== "done"}
          className="w-full bg-violet-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          {submitting ? "Publishing..." : upload.status !== "done" ? "Upload a video first" : t("submit")}
        </button>
      </form>
    </div>
  )
}
