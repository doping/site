"use client"

import { useState } from "react"
import { Play } from "lucide-react"

function getVideoType(url: string): "youtube" | "vimeo" | "cloudinary" | "direct" {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("vimeo.com")) return "vimeo"
  if (url.includes("cloudinary.com") || url.includes("res.cloudinary")) return "cloudinary"
  if (url.match(/\.(mp4|webm|mov|avi|mkv)(\?|$)/i)) return "direct"
  return "cloudinary"
}

function getYouTubeId(url: string): string {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return m?.[1] || ""
}

function getVimeoId(url: string): string {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m?.[1] || ""
}

interface VideoPlayerProps {
  url: string
  thumbnail?: string | null
  title: string
}

export default function VideoPlayer({ url, thumbnail, title }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const type = getVideoType(url)

  if ((type === "cloudinary" || type === "direct") && playing) {
    return (
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden">
        <video
          src={url}
          controls
          autoPlay
          className="w-full h-full"
          title={title}
        />
      </div>
    )
  }

  if (type === "youtube" && playing) {
    const videoId = getYouTubeId(url)
    return (
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    )
  }

  if (type === "vimeo" && playing) {
    const videoId = getVimeoId(url)
    return (
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    )
  }

  return (
    <div
      className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative cursor-pointer group"
      onClick={() => setPlaying(true)}
    >
      {thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-violet-900 to-indigo-900 flex items-center justify-center">
          <span className="text-7xl">🎬</span>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 bg-white/90 group-hover:bg-white rounded-full flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
          <Play className="w-8 h-8 text-violet-600 ml-1" fill="currentColor" />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
        {type === "youtube" ? "YouTube" : type === "vimeo" ? "Vimeo" : "Video"}
      </div>
    </div>
  )
}
