import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { videoId, type, price } = await req.json()

  const license = await prisma.license.create({
    data: {
      videoId,
      buyerId: session.user.id,
      type,
      price,
      currency: "USD",
      status: "pending",
    },
  })

  return NextResponse.json(license)
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const licenses = await prisma.license.findMany({
    where: { buyerId: session.user.id },
    include: { video: { include: { creator: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(licenses)
}
