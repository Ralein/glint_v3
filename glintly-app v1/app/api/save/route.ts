import { NextResponse } from "next/server"

// Mock saved videos data - in production, this would be stored in your database
let savedVideos = [
  {
    id: "1",
    title: "Advanced React Patterns You Should Know",
    channel: "CodeMaster",
    category: "Technology",
    thumbnail: "/placeholder-9hlhv.png",
    savedAt: "2024-01-15T10:30:00Z",
    duration: "8:45",
  },
  {
    id: "2",
    title: "Morning Motivation: Start Your Day Right",
    channel: "MotivationDaily",
    category: "Motivation",
    thumbnail: "/placeholder-iieud.png",
    savedAt: "2024-01-08T14:20:00Z",
    duration: "3:22",
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Add relative time for display
  const videosWithRelativeTime = savedVideos.map((video) => ({
    ...video,
    savedAt: getRelativeTime(video.savedAt),
  }))

  return NextResponse.json({
    videos: videosWithRelativeTime,
    total: savedVideos.length,
  })
}

export async function POST(request: Request) {
  const { videoId, action } = await request.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  if (action === "save") {
    // Add video to saved list (in production, save to database)
    const newSavedVideo = {
      id: videoId,
      title: `Saved Video ${videoId}`,
      channel: "Unknown Channel",
      category: "General",
      thumbnail: "/placeholder-j6nz2.png",
      savedAt: new Date().toISOString(),
      duration: "5:00",
    }
    savedVideos.push(newSavedVideo)
  } else if (action === "unsave") {
    // Remove video from saved list
    savedVideos = savedVideos.filter((video) => video.id !== videoId)
  }

  return NextResponse.json({ success: true })
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "1 day ago"
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 14) return "1 week ago"
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  return `${Math.floor(diffInDays / 30)} months ago`
}
