"use client"

import { useState } from "react"
import { Link2, Check, Twitter, Facebook, Send, Linkedin, MessageCircle } from "lucide-react"

interface ShareButtonsProps {
  title: string
  url?: string // optional override; defaults to window.location.href
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  function getUrl() {
    return url ?? (typeof window !== "undefined" ? window.location.href : "")
  }

  function copyLink() {
    navigator.clipboard.writeText(getUrl()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const encodedUrl = encodeURIComponent(getUrl())
  const encodedTitle = encodeURIComponent(title)

  const platforms = [
    {
      name: "X / Twitter",
      icon: <Twitter className="w-5 h-5" />,
      color: "bg-black hover:bg-neutral-800",
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      color: "bg-[#1877F2] hover:bg-[#166fe5]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "bg-[#25D366] hover:bg-[#1ebe5d]",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: <Send className="w-5 h-5" />,
      color: "bg-[#229ED9] hover:bg-[#1a8fcb]",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      color: "bg-[#0A66C2] hover:bg-[#095aad]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ]

  return (
    <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-5">
      <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <span className="text-base">📢</span> Share this video
      </p>
      <div className="flex flex-wrap gap-2">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${p.name}`}
            className={`flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors ${p.color}`}
          >
            {p.icon}
            <span className="hidden sm:inline">{p.name}</span>
          </a>
        ))}

        <button
          onClick={copyLink}
          title="Copy link"
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
            copied
              ? "bg-green-50 border-green-300 text-green-700"
              : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
          <span className="hidden sm:inline">{copied ? "Copied!" : "Copy link"}</span>
        </button>
      </div>
    </div>
  )
}
