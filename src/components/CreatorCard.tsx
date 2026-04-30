"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Video, Award } from "lucide-react"

interface CreatorCardProps {
  id: string
  name: string
  avatar?: string | null
  bio?: string | null
  country?: string | null
  verified: boolean
  _count: { videos: number; licenses: number }
}

export default function CreatorCard({ id, name, avatar, bio, country, verified, _count }: CreatorCardProps) {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations("creators")

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition-all duration-200 p-6 text-center">
      <div className="relative w-20 h-20 mx-auto mb-4">
        {avatar ? (
          <Image src={avatar} alt={name} fill className="object-cover rounded-full" sizes="80px" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
            {name[0]}
          </div>
        )}
        {verified && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
            <Award className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <h3 className="font-bold text-slate-800 mb-1">{name}</h3>
      {country && <p className="text-xs text-slate-400 mb-2">{country}</p>}
      {bio && <p className="text-xs text-slate-500 mb-4 line-clamp-2">{bio}</p>}
      <div className="flex justify-center gap-4 mb-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Video className="w-3 h-3" />
          <span>{_count.videos} {t("videos")}</span>
        </div>
        <div className="flex items-center gap-1">
          <Award className="w-3 h-3" />
          <span>{_count.licenses} {t("licenses")}</span>
        </div>
      </div>
      <Link href={`/${locale}/creators/${id}`} className="block w-full bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white py-2 rounded-lg text-sm font-medium transition-colors">
        {t("viewProfile")}
      </Link>
    </div>
  )
}
