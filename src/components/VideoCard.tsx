"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Eye, Clock, Tag } from "lucide-react"

interface VideoCardProps {
  id: string
  title: string
  thumbnail?: string | null
  price: number
  currency: string
  views: number
  duration?: number | null
  category: string
  creator: { name: string; avatar?: string | null }
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function VideoCard({ id, title, thumbnail, price, currency, views, duration, category, creator }: VideoCardProps) {
  const params = useParams()
  const locale = params.locale as string

  return (
    <Link href={`/${locale}/videos/${id}`} className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-violet-300 hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        {thumbnail ? (
          <Image src={thumbnail} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-100 to-indigo-200 flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
            {formatDuration(duration)}
          </div>
        )}
        <div className="absolute top-2 left-2 bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
          {currency} {price}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2 mb-2 group-hover:text-violet-600 transition-colors">{title}</h3>
        <div className="flex items-center gap-1 mb-3">
          <div className="w-5 h-5 rounded-full bg-violet-200 flex items-center justify-center text-xs font-bold text-violet-700 overflow-hidden">
            {creator.avatar ? (
              <Image src={creator.avatar} alt={creator.name} width={20} height={20} className="object-cover" />
            ) : creator.name[0]}
          </div>
          <span className="text-xs text-slate-500">{creator.name}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span className="capitalize">{category}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
