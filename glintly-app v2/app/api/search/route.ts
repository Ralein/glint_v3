import { type NextRequest, NextResponse } from "next/server"

interface SearchResult {
  id: string
  type: "video" | "user" | "hashtag"
  title: string
  channel?: string
  category?: string
  thumbnail?: string
  followers?: number
  posts?: number
  views?: number
  duration?: string
  isVerified?: boolean
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type") || "all"
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  if (!query) {
    return NextResponse.json({ results: [], total: 0 })
  }

  try {
    // Mock search results - in a real app, this would query your database
    const allResults: SearchResult[] = [
      {
        id: "1",
        type: "video",
        title: "React Hooks Complete Guide",
        channel: "CodeMaster",
        category: "tech",
        thumbnail: "/react-hooks-coding-tutorial.jpg",
        views: 15600,
        duration: "12:45",
      },
      {
        id: "2",
        type: "user",
        title: "CodeMaster",
        followers: 125000,
        posts: 342,
        thumbnail: "/developer-avatar.png",
        isVerified: true,
      },
      {
        id: "3",
        type: "hashtag",
        title: "#ReactTips",
        posts: 8900,
      },
      {
        id: "4",
        type: "video",
        title: "Perfect Pasta in 5 Minutes",
        channel: "QuickCook",
        category: "cooking",
        thumbnail: "/pasta-cooking-kitchen-food.jpg",
        views: 23400,
        duration: "5:12",
      },
      {
        id: "5",
        type: "user",
        title: "ChefLife",
        followers: 89000,
        posts: 156,
        thumbnail: "/chef-avatar.png",
        isVerified: false,
      },
      {
        id: "6",
        type: "video",
        title: "Morning Motivation Routine",
        channel: "DailyInspire",
        category: "motivation",
        thumbnail: "/morning-motivation-success-mindset.jpg",
        views: 18900,
        duration: "8:30",
      },
      {
        id: "7",
        type: "hashtag",
        title: "#CookingHacks",
        posts: 12400,
      },
      {
        id: "8",
        type: "video",
        title: "JavaScript Closures Explained",
        channel: "DevTips",
        category: "tech",
        thumbnail: "/javascript-closures-programming.jpg",
        views: 11200,
        duration: "6:15",
      },
    ]

    // Filter results based on query
    let filteredResults = allResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        (result.channel && result.channel.toLowerCase().includes(query.toLowerCase())),
    )

    // Filter by type if specified
    if (type !== "all") {
      const typeMap: { [key: string]: string } = {
        videos: "video",
        users: "user",
        hashtags: "hashtag",
      }
      filteredResults = filteredResults.filter((result) => result.type === typeMap[type])
    }

    // Apply limit
    const results = filteredResults.slice(0, limit)

    return NextResponse.json({
      results,
      total: filteredResults.length,
      query,
      type,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Search failed", results: [], total: 0 }, { status: 500 })
  }
}
