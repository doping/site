import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "creator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, description, category, tags, price, url, thumbnail, duration } = await req.json()

  if (!title || !category || !url || !price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const video = await prisma.video.create({
    data: {
      title,
      description: description || null,
      category,
      tags: tags || "",
      price: parseFloat(price),
      url,
      thumbnail: thumbnail || null,
      duration: duration ? parseInt(duration) : null,
      creatorId: session.user.id,
      status: "active",
    },
  })

  return NextResponse.json(video)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const q = searchParams.get("q")

  const videos = await prisma.video.findMany({
    where: {
      status: "active",
      ...(category && category !== "all" ? { category } : {}),
      ...(q ? { title: { contains: q } } : {}),
    },
    include: { creator: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  })

  return NextResponse.json(videos)
}
