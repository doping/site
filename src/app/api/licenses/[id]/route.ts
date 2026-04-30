import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const license = await prisma.license.findUnique({
    where: { id },
    include: { video: { include: { creator: true } } },
  })

  if (!license || license.buyerId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(license)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { status } = await req.json()

  const license = await prisma.license.findUnique({ where: { id } })
  if (!license || license.buyerId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.license.update({
    where: { id },
    data: { status, paymentId: status === "paid" ? `demo_${Date.now()}` : undefined },
  })

  if (status === "paid") {
    await prisma.video.update({ where: { id: license.videoId }, data: { downloads: { increment: 1 } } })
  }

  return NextResponse.json(updated)
}
