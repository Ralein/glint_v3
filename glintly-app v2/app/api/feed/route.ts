import { NextResponse } from "next/server"

const mockVideos = [
  // Tech Videos
  {
    id: "1",
    title: "Master React Hooks in 60 Seconds",
    channel: "CodeMaster",
    category: "tech",
    thumbnail: "/react-hooks-coding-tutorial.jpg",
    embedId: "dQw4w9WgXcQ",
    likes: 1234,
    isLiked: false,
    isSaved: false,
    watchTime: 60,
    difficulty: "intermediate",
    tags: ["react", "hooks", "javascript"],
    engagement: 0.85,
  },
  {
    id: "2",
    title: "JavaScript Closures Explained Simply",
    channel: "DevTips",
    category: "tech",
    thumbnail: "/javascript-closures-programming.jpg",
    embedId: "dQw4w9WgXcQ",
    likes: 892,
    isLiked: false,
    isSaved: false,
    watchTime: 180,
    difficulty: "advanced",
    tags: ["javascript", "closures", "fundamentals"],
    engagement: 0.78,
  },
  // Motivation Videos
  {
    id: "3",
    title: "Morning Motivation: Transform Your Mindset",
    channel: "MotivationDaily",
    category: "motivation",
    thumbnail: "/morning-motivation-success-mindset.jpg",
    embedId: "dQw4w9WgXcQ",
    likes: 856,
    isLiked: false,
    isSaved: false,
    watchTime: 120,
    difficulty: "beginner",
    tags: ["motivation", "mindset", "morning"],
    engagement: 0.92,
  },
  {
    id: "4",
    title: "5 Habits of Successful People",
    channel: "SuccessPath",
    category: "motivation",
    thumbnail: "/success-habits-productive-people.jpg",
    embedId: "dQw4w9WgXcQ",
    likes: 1567,
    isLiked: false,
    isSaved: false,
    watchTime: 240,
    difficulty: "beginner",
    tags: ["success", "habits", "productivity"],
    engagement: 0.88,
  },
  // Cooking Videos
  {
    id: "5",
    title: "Perfect Pasta in Under 10 Minutes",
    channel: "QuickChef",
    category: "cooking",
    thumbnail: "/pasta-cooking-kitchen-food.jpg",
    embedId: "dQw4w9WgXcQ",
    likes: 2341,
    isLiked: false,
    isSaved: false,
    watchTime: 300,
    difficulty: "beginner",
    tags: ["pasta", "quick", "italian"],
    engagement: 0.95,
  },
  {
    id: "6",
    title: "Knife Skills Every Cook Needs",
    channel: "CulinaryMaster",
    category: "cooking",
    thumbnail: "/knife-skills-cooking-techniques.jpg",
    embedId: "dQw4w9WgXcQ",
    likes: 1876,
    isLiked: false,
    isSaved: false,
    watchTime: 420,
    difficulty: "intermediate",
    tags: ["knife", "skills", "techniques"],
    engagement: 0.87,
  },
  // Wellness Videos
  {
    id: "7",
    title: "5-Minute Meditation for Beginners",
    channel: "MindfulMoments",
    category: "wellness",
    thumbnail: "/meditation-mindfulness-peaceful.jpg",
    embedId: "dQw4w9WgXcQ",
    likes: 1432,
    isLiked: false,
    isSaved: false,
    watchTime: 300,
    difficulty: "beginner",
    tags: ["meditation", "mindfulness", "stress"],
    engagement: 0.91,
  },
  {
    id: "8",
    title: "Breathing Techniques for Anxiety",
    channel: "WellnessWise",
    category: "wellness",
    thumbnail: "/breathing-exercises-calm-anxiety.jpg",
    embedId: "dQw4w9WgXcQ",
    likes: 987,
    isLiked: false,
    isSaved: false,
    watchTime: 180,
    difficulty: "beginner",
    tags: ["breathing", "anxiety", "calm"],
    engagement: 0.89,
  },
  // Learning Videos
  {
    id: "9",
    title: "Speed Reading Techniques That Work",
    channel: "LearnFast",
    category: "learning",
    thumbnail: "/speed-reading-books-learning.jpg",
    embedId: "dQw4w9WgXcQ",
    likes: 1123,
    isLiked: false,
    isSaved: false,
    watchTime: 360,
    difficulty: "intermediate",
    tags: ["reading", "learning", "productivity"],
    engagement: 0.83,
  },
  {
    id: "10",
    title: "Memory Palace Method Explained",
    channel: "BrainHacks",
    category: "learning",
    thumbnail: "/memory-palace-brain-learning.jpg",
    embedId: "dQw4w9WgXcQ",
    likes: 2156,
    isLiked: false,
    isSaved: false,
    watchTime: 480,
    difficulty: "advanced",
    tags: ["memory", "learning", "techniques"],
    engagement: 0.86,
  },
  // Finance Videos
  {
    id: "11",
    title: "Investing Basics for Beginners",
    channel: "MoneyWise",
    category: "finance",
    thumbnail: "/investing-money-finance-stocks.jpg",
    embedId: "dQw4w9WgXcQ",
    likes: 1789,
    isLiked: false,
    isSaved: false,
    watchTime: 420,
    difficulty: "beginner",
    tags: ["investing", "stocks", "finance"],
    engagement: 0.84,
  },
  {
    id: "12",
    title: "Budget Like a Pro in 2024",
    channel: "FinanceFree",
    category: "finance",
    thumbnail: "/budgeting-money-planning-finance.jpg",
    embedId: "dQw4w9WgXcQ",
    likes: 1345,
    isLiked: false,
    isSaved: false,
    watchTime: 300,
    difficulty: "beginner",
    tags: ["budget", "planning", "money"],
    engagement: 0.88,
  },
]

function calculateVideoScore(video: any, userInterests: string[], watchHistory: string[] = []) {
  let score = 0

  // Base engagement score (0-100)
  score += video.engagement * 100

  // Interest matching bonus (0-50)
  if (userInterests.includes(video.category)) {
    score += 50
  }

  // Diversity bonus for related categories (0-20)
  const relatedCategories = getRelatedCategories(video.category)
  const hasRelatedInterest = userInterests.some((interest) => relatedCategories.includes(interest))
  if (hasRelatedInterest && !userInterests.includes(video.category)) {
    score += 20
  }

  // Freshness bonus - avoid recently watched (penalty -30)
  if (watchHistory.includes(video.id)) {
    score -= 30
  }

  // Difficulty matching (slight bonus for variety)
  if (video.difficulty === "beginner") score += 5
  if (video.difficulty === "intermediate") score += 3

  return Math.max(0, score)
}

function getRelatedCategories(category: string): string[] {
  const relations: Record<string, string[]> = {
    tech: ["learning", "career"],
    learning: ["tech", "career", "finance"],
    motivation: ["wellness", "career", "fitness"],
    wellness: ["motivation", "fitness"],
    cooking: ["wellness"],
    finance: ["learning", "career"],
    career: ["tech", "learning", "finance"],
    fitness: ["wellness", "motivation"],
  }
  return relations[category] || []
}

function applyMixInStrategy(sortedVideos: any[], userInterests: string[], revisitNudges: any[] = []) {
  const result = []
  const mixInPool = sortedVideos.filter((video) => !userInterests.includes(video.category))
  let mixInIndex = 0
  let nudgeIndex = 0

  for (let i = 0; i < sortedVideos.length; i++) {
    result.push(sortedVideos[i])

    // Every 4th video, try to inject a revisit nudge (higher priority)
    if ((i + 1) % 4 === 0 && nudgeIndex < revisitNudges.length) {
      const nudgeVideo = revisitNudges[nudgeIndex]
      if (nudgeVideo && !result.some((v) => v.id === nudgeVideo.id)) {
        result.push(nudgeVideo)
        nudgeIndex++
      }
    }
    // Every 3rd video (when not nudge), try to inject a mix-in from different category
    else if ((i + 1) % 3 === 0 && mixInIndex < mixInPool.length) {
      const mixInVideo = mixInPool[mixInIndex]
      if (mixInVideo && !result.some((v) => v.id === mixInVideo.id)) {
        result.push(mixInVideo)
        mixInIndex++
      }
    }
  }

  return result
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const interests = searchParams.get("interests")?.split(",").filter(Boolean) || []
  const watchHistory = searchParams.get("watchHistory")?.split(",").filter(Boolean) || []
  const userId = searchParams.get("userId") || "anonymous"

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  let revisitNudges: any[] = []
  if (page === 1) {
    // Only add nudges to first page
    try {
      const revisitResponse = await fetch(
        `${request.url.split("/api/feed")[0]}/api/revisit?userId=${userId}&includeNudges=true`,
      )
      const revisitData = await revisitResponse.json()
      revisitNudges = revisitData.videos.slice(0, 2) // Limit to 2 nudges per feed load
    } catch (error) {
      console.error("Failed to fetch revisit nudges:", error)
    }
  }

  const scoredVideos = mockVideos.map((video) => ({
    ...video,
    score: calculateVideoScore(video, interests, watchHistory),
  }))

  // Sort by score (highest first)
  const sortedVideos = scoredVideos.sort((a, b) => b.score - a.score)

  const feedVideos = interests.length > 0 ? applyMixInStrategy(sortedVideos, interests, revisitNudges) : sortedVideos

  // Paginate results
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedVideos = feedVideos.slice(startIndex, endIndex)

  const feedStats = {
    totalVideos: feedVideos.length,
    interestMatches: feedVideos.filter((v) => interests.includes(v.category)).length,
    mixIns: feedVideos.filter((v) => !interests.includes(v.category) && !v.isRevisit).length,
    revisitNudges: feedVideos.filter((v) => v.isRevisit).length,
    avgScore: feedVideos.reduce((sum, v) => sum + (v.score || 0), 0) / feedVideos.length,
  }

  return NextResponse.json({
    videos: paginatedVideos.map(({ score, ...video }) => video), // Remove score from response
    hasMore: endIndex < feedVideos.length,
    total: feedVideos.length,
    feedStats,
    algorithm: "smart_feed_v2_with_nudges",
  })
}
