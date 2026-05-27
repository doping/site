import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const THUMBNAILS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  "https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=800&q=80",
  "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80",
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
]

const VIDEOS_DATA = [
  { title: "Golden Hour Beach Timelapse", category: "nature", tags: "beach,sunset,timelapse,ocean", price: 89, duration: 45, featured: true, views: 12400 },
  { title: "Street Food Tour Bangkok", category: "food", tags: "food,thailand,street food,travel", price: 120, duration: 180, featured: true, views: 8900 },
  { title: "Urban Parkour London", category: "sports", tags: "parkour,london,urban,extreme", price: 150, duration: 90, featured: true, views: 23100 },
  { title: "Minimalist Home Office Setup", category: "lifestyle", tags: "home office,minimal,setup,desk", price: 75, duration: 60, featured: true, views: 5600 },
  { title: "iPhone 15 Unboxing Experience", category: "technology", tags: "iphone,apple,unboxing,review", price: 99, duration: 300, featured: true, views: 45000 },
  { title: "Bali Rice Fields Drone Footage", category: "travel", tags: "bali,drone,rice fields,indonesia", price: 200, duration: 120, featured: true, views: 31200 },
  { title: "Autumn Forest Morning Walk", category: "nature", tags: "forest,autumn,walk,morning", price: 65, duration: 240, featured: false, views: 4200 },
  { title: "Homemade Pasta Recipe", category: "food", tags: "pasta,recipe,italian,cooking", price: 55, duration: 360, featured: false, views: 7800 },
  { title: "Yoga Flow Sunset Session", category: "sports", tags: "yoga,sunset,meditation,fitness", price: 80, duration: 1200, featured: false, views: 9300 },
  { title: "Sustainable Fashion Haul", category: "fashion", tags: "fashion,sustainable,clothing,haul", price: 110, duration: 480, featured: false, views: 15600 },
  { title: "Coffee Shop Morning Ambience", category: "lifestyle", tags: "coffee,morning,ambience,cozy", price: 45, duration: 600, featured: false, views: 3400 },
  { title: "Tokyo Night Street Scenes", category: "travel", tags: "tokyo,japan,night,street", price: 175, duration: 150, featured: false, views: 28900 },
  { title: "Waterfall Hiking Adventure", category: "nature", tags: "waterfall,hiking,adventure,nature", price: 130, duration: 420, featured: false, views: 11200 },
  { title: "Startup Office Culture B-Roll", category: "business", tags: "startup,office,business,team", price: 95, duration: 180, featured: false, views: 6700 },
  { title: "Puppy First Day Home", category: "animals", tags: "puppy,dog,pets,cute", price: 60, duration: 90, featured: false, views: 52000 },
  { title: "Electric Guitar Solo Performance", category: "music", tags: "guitar,music,performance,rock", price: 85, duration: 210, featured: false, views: 18400 },
]

async function main() {
  console.log("Seeding database...")

  const hashedDemo = await bcrypt.hash("demo123", 10)

  const creator = await prisma.user.upsert({
    where: { email: "creator@demo.com" },
    update: {},
    create: {
      email: "creator@demo.com",
      name: "Alex Visuals",
      password: hashedDemo,
      role: "creator",
      bio: "Filmmaker and content creator specializing in travel, nature and lifestyle videos. Based in London.",
      country: "United Kingdom",
      verified: true,
    },
  })

  const creator2 = await prisma.user.upsert({
    where: { email: "creator2@demo.com" },
    update: {},
    create: {
      email: "creator2@demo.com",
      name: "Sofia Lens",
      password: hashedDemo,
      role: "creator",
      bio: "Documentary filmmaker and food videographer from Barcelona.",
      country: "Spain",
      verified: true,
    },
  })

  const creator3 = await prisma.user.upsert({
    where: { email: "creator3@demo.com" },
    update: {},
    create: {
      email: "creator3@demo.com",
      name: "Marco Vids",
      password: hashedDemo,
      role: "creator",
      bio: "Sports and action content creator. Certified drone pilot.",
      country: "Italy",
      verified: false,
    },
  })

  const creator4 = await prisma.user.upsert({
    where: { email: "creator4@demo.com" },
    update: {},
    create: {
      email: "creator4@demo.com",
      name: "Yuki Films",
      password: hashedDemo,
      role: "creator",
      bio: "Cinematographer based in Tokyo. Specializing in urban and street content.",
      country: "Japan",
      verified: true,
    },
  })

  const brand = await prisma.user.upsert({
    where: { email: "brand@demo.com" },
    update: {},
    create: {
      email: "brand@demo.com",
      name: "Acme Marketing Co.",
      password: hashedDemo,
      role: "brand",
      bio: "Full-service marketing agency specializing in digital campaigns.",
      country: "United States",
    },
  })

  const creators = [creator, creator2, creator3, creator4]

  // Only seed videos and licenses if they don't exist yet (idempotent)
  const existingVideoCount = await prisma.video.count()

  if (existingVideoCount === 0) {
    const createdVideos: { id: string }[] = []

    for (let i = 0; i < VIDEOS_DATA.length; i++) {
      const vd = VIDEOS_DATA[i]
      const creatorUser = creators[i % creators.length]
      const thumb = THUMBNAILS[i % THUMBNAILS.length]

      const video = await prisma.video.create({
        data: {
          title: vd.title,
          description: `High quality ${vd.category} content perfect for commercial use. Professionally shot and edited.`,
          category: vd.category,
          tags: vd.tags,
          price: vd.price,
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail: thumb,
          duration: vd.duration,
          featured: vd.featured,
          views: vd.views,
          status: "active",
          creatorId: creatorUser.id,
        },
      })
      createdVideos.push(video)
    }

    // Only create demo licenses if no licenses exist
    const existingLicenseCount = await prisma.license.count()
    if (existingLicenseCount === 0) {
      await prisma.license.createMany({
        data: [
          { videoId: createdVideos[0].id, buyerId: brand.id, type: "standard", price: 89, currency: "USD", status: "paid", paymentId: "demo_pay_001" },
          { videoId: createdVideos[1].id, buyerId: brand.id, type: "extended", price: 300, currency: "USD", status: "paid", paymentId: "demo_pay_002" },
          { videoId: createdVideos[2].id, buyerId: brand.id, type: "standard", price: 150, currency: "USD", status: "paid", paymentId: "demo_pay_003" },
        ],
      })
    }
  } else {
    console.log(`ℹ️  Skipping video/license seed — ${existingVideoCount} videos already exist.`)
  }

  console.log("✅ Seed completed!")
  console.log("Demo accounts:")
  console.log("  Creator: creator@demo.com / demo123")
  console.log("  Brand:   brand@demo.com / demo123")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
