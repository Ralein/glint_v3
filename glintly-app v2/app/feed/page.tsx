"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AIQuiz, QuizResults } from "@/components/ai-quiz"

interface Video {
  id: string
  title: string
  channel: string
  category: string
  thumbnail: string
  embedId: string
  likes: number
  isLiked: boolean
  isSaved: boolean
  isRevisit?: boolean
  savedDaysAgo?: number
  aiSummary?: {
    keyTakeaways: string[]
    mainTopic: string
    difficulty: "Beginner" | "Intermediate" | "Advanced"
    estimatedReadTime: string
  }
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
}

export default function FeedPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showSummary, setShowSummary] = useState<{ [key: string]: boolean }>({})
  const [videosWatched, setVideosWatched] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [watchedVideoIds, setWatchedVideoIds] = useState<Set<string>>(new Set())
  const [isPlaying, setIsPlaying] = useState(true)
  const [page, setPage] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number>(0)
  const touchEndY = useRef<number>(0)
  const isScrolling = useRef<boolean>(false)
  const { toast } = useToast()

  const fetchVideos = useCallback(
    async (pageNum = 1, reset = false) => {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      try {
        const userProfile = localStorage.getItem("userProfile")
        const interests = userProfile ? JSON.parse(userProfile).interests || [] : []
        const watchHistory = Array.from(watchedVideoIds)

        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "10",
          interests: interests.join(","),
          watchHistory: watchHistory.join(","),
          userId: "user123",
        })

        const response = await fetch(`/api/feed?${params}`)
        const data = await response.json()

        if (reset) {
          setVideos(data.videos)
        } else {
          setVideos((prev) => [...prev, ...data.videos])
        }

        setHasMore(data.hasMore)
        setPage(pageNum)
      } catch (error) {
        console.error("Failed to fetch videos:", error)
        toast({
          title: "Error loading videos",
          description: "Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [watchedVideoIds, toast],
  )

  const loadMoreVideos = useCallback(() => {
    if (!loadingMore && hasMore && currentIndex >= videos.length - 3) {
      fetchVideos(page + 1, false)
    }
  }, [loadingMore, hasMore, currentIndex, videos.length, page, fetchVideos])

  useEffect(() => {
    fetchVideos(1, true)
  }, [])

  useEffect(() => {
    loadMoreVideos()
  }, [currentIndex, loadMoreVideos])

  const handleScroll = useCallback(
    (direction: "up" | "down") => {
      if (isScrolling.current) return

      isScrolling.current = true

      if (direction === "down" && currentIndex < videos.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (direction === "up" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
      }

      setTimeout(() => {
        isScrolling.current = false
      }, 300)
    },
    [currentIndex, videos.length],
  )

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return

    const distance = touchStartY.current - touchEndY.current
    const minSwipeDistance = 50

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        handleScroll("down")
      } else {
        handleScroll("up")
      }
    }

    touchStartY.current = 0
    touchEndY.current = 0
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        handleScroll("down")
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        handleScroll("up")
      } else if (e.key === "Enter") {
        setIsPlaying((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleScroll])

  useEffect(() => {
    const currentVideo = videos[currentIndex]
    if (currentVideo && !currentVideo.isRevisit && !watchedVideoIds.has(currentVideo.id)) {
      const newWatchedIds = new Set(watchedVideoIds)
      newWatchedIds.add(currentVideo.id)
      setWatchedVideoIds(newWatchedIds)

      const newWatchedCount = videosWatched + 1
      setVideosWatched(newWatchedCount)

      if (newWatchedCount > 0 && newWatchedCount % 5 === 0) {
        const watchedCategories = Array.from(newWatchedIds)
          .map((id) => videos.find((v) => v.id === id)?.category)
          .filter((category): category is string => category !== undefined)
          .filter((category, index, arr) => arr.indexOf(category) === index)

        const questions = generateQuizQuestions(watchedCategories)
        if (questions.length > 0) {
          setQuizQuestions(questions)
          setShowQuiz(true)
        }
      }
    }
  }, [currentIndex, videos, watchedVideoIds, videosWatched])

  const generateQuizQuestions = (watchedCategories: string[]): QuizQuestion[] => {
    const allQuestions: { [key: string]: QuizQuestion[] } = {
      tech: [
        {
          id: "tech1",
          question: "What is React's main benefit for building user interfaces?",
          options: [
            "It makes websites load faster automatically",
            "It allows for reusable components and efficient state management",
            "It eliminates the need for CSS styling",
            "It only works with mobile applications",
          ],
          correctAnswer: 1,
          explanation:
            "React's component-based architecture allows developers to create reusable UI components and manage application state efficiently, making development more organized and maintainable.",
          category: "tech",
        },
      ],
      cooking: [
        {
          id: "cook1",
          question: "Why should you salt pasta water generously?",
          options: [
            "To make the water boil faster",
            "To prevent the pasta from sticking together",
            "To season the pasta from the inside out",
            "To make the pasta cook more evenly",
          ],
          correctAnswer: 2,
          explanation:
            "Salting pasta water seasons the pasta itself as it cooks, giving it flavor from the inside out. This is the only chance to season the pasta directly.",
          category: "cooking",
        },
      ],
      motivation: [
        {
          id: "motiv1",
          question: "What's a key component of building lasting motivation?",
          options: [
            "Setting only big, ambitious goals",
            "Relying on willpower alone",
            "Creating consistent daily habits and small wins",
            "Waiting for the perfect moment to start",
          ],
          correctAnswer: 2,
          explanation:
            "Lasting motivation comes from building consistent daily habits and celebrating small wins. This creates momentum and makes progress feel achievable.",
          category: "motivation",
        },
      ],
    }

    const selectedQuestions: QuizQuestion[] = []
    watchedCategories.forEach((category) => {
      if (allQuestions[category]) {
        selectedQuestions.push(...allQuestions[category].slice(0, 2))
      }
    })

    return selectedQuestions.slice(0, 3)
  }

  const handleLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId
          ? { ...video, isLiked: !video.isLiked, likes: video.isLiked ? video.likes - 1 : video.likes + 1 }
          : video,
      ),
    )
  }

  const handleSave = (videoId: string) => {
    setVideos((prev) => prev.map((video) => (video.id === videoId ? { ...video, isSaved: !video.isSaved } : video)))
  }

  const toggleSummary = (videoId: string) => {
    setShowSummary((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }))
  }

  const copySummary = async (video: Video) => {
    if (!video.aiSummary) return

    const summaryText = `${video.title}\n\nKey Takeaways:\n${video.aiSummary.keyTakeaways.map((point) => `• ${point}`).join("\n")}\n\nTopic: ${video.aiSummary.mainTopic}\nDifficulty: ${video.aiSummary.difficulty}`

    try {
      await navigator.clipboard.writeText(summaryText)
      toast({
        title: "Summary copied!",
        description: "AI summary has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy summary to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async (video: Video) => {
    const shareData = {
      title: video.title,
      text: `Check out this amazing video: "${video.title}" by @${video.channel}`,
      url: `${window.location.origin}/video/${video.id}`,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        toast({
          title: "Shared successfully!",
          description: "Video shared using your device's native share menu.",
        })
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await copyToClipboard(shareData.url, video.title)
        }
      }
    } else {
      await copyToClipboard(shareData.url, video.title)
    }
  }

  const copyToClipboard = async (url: string, title: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link copied!",
        description: `"${title}" link has been copied to your clipboard.`,
      })
    } catch (err) {
      toast({
        title: "Share failed",
        description: "Unable to share this video. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleQuizComplete = (score: number) => {
    setQuizScore(score)
    setShowQuiz(false)
    setShowQuizResults(true)
  }

  const handleQuizSkip = () => {
    setShowQuiz(false)
  }

  const handleQuizResultsContinue = () => {
    setShowQuizResults(false)
  }

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (showQuiz) {
    return (
      <AIQuiz
        questions={quizQuestions}
        onComplete={handleQuizComplete}
        onSkip={handleQuizSkip}
        videosWatched={videosWatched}
      />
    )
  }

  if (showQuizResults) {
    return (
      <QuizResults score={quizScore} totalQuestions={quizQuestions.length} onContinue={handleQuizResultsContinue} />
    )
  }

  const currentVideo = videos[currentIndex]

  return (
    <div className="flex-1 bg-black text-white">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Your Feed</h1>
          <p className="text-gray-400">Personalized learning content just for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, 9).map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative cursor-pointer"
            >
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-900">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                  <Badge variant="secondary" className="mb-2 bg-black/60 text-white border-0 text-xs">
                    {video.category}
                  </Badge>
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{video.title}</h3>
                  <p className="text-white/70 text-xs">@{video.channel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
            onClick={() => fetchVideos(page + 1, false)}
            disabled={loadingMore || !hasMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      </div>
    </div>
  )
}
