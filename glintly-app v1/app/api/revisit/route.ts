import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || "anonymous"
  const includeNudges = searchParams.get("includeNudges") === "true"

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const revisitVideos = [
    {
      id: "revisit_1",
      title: "The Science of Habit Formation",
      channel: "LifeHacker",
      category: "learning",
      thumbnail: "/memory-palace-brain-learning.jpg",
      savedAt: "2024-04-01T10:00:00Z",
      daysAgo: 14,
      lastWatched: "2024-04-01T10:00:00Z",
      priority: "high",
      nudgeType: "forgotten_gem",
      nudgeMessage: "You loved this 2 weeks ago! Time for a refresher?",
      engagement: 0.92,
      isRevisit: true,
    },
    {
      id: "revisit_2",
      title: "Advanced CSS Grid Techniques",
      channel: "WebDev Pro",
      category: "tech",
      thumbnail: "/react-hooks-coding-tutorial.jpg",
      savedAt: "2024-04-05T15:30:00Z",
      daysAgo: 10,
      lastWatched: "2024-04-08T09:15:00Z",
      priority: "medium",
      nudgeType: "skill_reinforcement",
      nudgeMessage: "Ready to master CSS Grid? Let's dive deeper!",
      engagement: 0.87,
      isRevisit: true,
    },
    {
      id: "revisit_3",
      title: "Mindfulness Meditation for Beginners",
      channel: "ZenMaster",
      category: "wellness",
      thumbnail: "/meditation-mindfulness-peaceful.jpg",
      savedAt: "2024-04-08T20:00:00Z",
      daysAgo: 7,
      lastWatched: "2024-04-10T07:30:00Z",
      priority: "medium",
      nudgeType: "wellness_reminder",
      nudgeMessage: "Your mind deserves this peaceful moment again",
      engagement: 0.89,
      isRevisit: true,
    },
    {
      id: "revisit_4",
      title: "Quick Healthy Breakfast Ideas",
      channel: "NutritionNinja",
      category: "cooking",
      thumbnail: "/pasta-cooking-kitchen-food.jpg",
      savedAt: "2024-04-12T08:00:00Z",
      daysAgo: 3,
      lastWatched: "2024-04-12T08:00:00Z",
      priority: "low",
      nudgeType: "recent_save",
      nudgeMessage: "Still fresh in your saves - worth another look?",
      engagement: 0.84,
      isRevisit: true,
    },
  ]

  // Filter by priority and days for nudges
  let filteredVideos = revisitVideos
  if (includeNudges) {
    // Only include videos saved 3+ days ago for nudges
    filteredVideos = revisitVideos.filter((video) => video.daysAgo >= 3)
    // Sort by priority and engagement
    filteredVideos.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder]
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder]

      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      return b.engagement - a.engagement
    })
  }

  return NextResponse.json({
    videos: filteredVideos,
    total: filteredVideos.length,
    nudgeStats: {
      highPriority: filteredVideos.filter((v) => v.priority === "high").length,
      mediumPriority: filteredVideos.filter((v) => v.priority === "medium").length,
      lowPriority: filteredVideos.filter((v) => v.priority === "low").length,
    },
  })
}
