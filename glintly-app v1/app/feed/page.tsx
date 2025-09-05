"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Bookmark,
  Share,
  MessageCircle,
  Home,
  Search,
  User,
  RotateCcw,
  Brain,
  Copy,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
} from "lucide-react"
import Link from "next/link"
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
    <div
      className="h-screen bg-background overflow-hidden relative select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={containerRef}
        className="h-full w-full relative"
        onWheel={(e) => {
          e.preventDefault()
          if (Math.abs(e.deltaY) > 10) {
            if (e.deltaY > 0) {
              handleScroll("down")
            } else {
              handleScroll("up")
            }
          }
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideo?.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-full w-full relative"
          >
            {currentVideo?.isRevisit ? (
              <Card className="h-full w-full rounded-none bg-gradient-to-br from-primary/10 to-primary/5 border-0">
                <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <RotateCcw className="h-16 w-16 text-primary mb-6" />
                  <h2 className="text-2xl font-bold mb-4">Time to Revisit!</h2>
                  <p className="text-lg text-muted-foreground mb-2">
                    You saved this video {currentVideo.savedDaysAgo} days ago
                  </p>
                  <p className="text-xl font-semibold mb-8 text-balance">"{currentVideo.title}"</p>
                  <div className="space-y-4">
                    <Button size="lg" className="rounded-2xl">
                      Watch Again
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-2xl bg-transparent">
                      Skip for Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full w-full bg-black relative flex items-center justify-center">
                <div className="w-full max-w-sm mx-auto h-full relative" style={{ aspectRatio: "9/16" }}>
                  <img
                    src={currentVideo?.thumbnail || "/placeholder.svg"}
                    alt={currentVideo?.title}
                    className="w-full h-full object-cover rounded-none"
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-16 w-16 rounded-full bg-black/30 hover:bg-black/50 text-white"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                    </Button>
                  </div>

                  {currentVideo?.aiSummary && showSummary[currentVideo.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute inset-x-4 bottom-32 z-10"
                    >
                      <Card className="bg-background/95 backdrop-blur-sm border-border/50 shadow-2xl">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Brain className="h-5 w-5 text-primary" />
                              <span className="font-semibold text-sm">AI Summary</span>
                              <Badge variant="outline" className="text-xs">
                                {currentVideo.aiSummary.difficulty}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copySummary(currentVideo)}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleSummary(currentVideo.id)}
                                className="h-8 w-8 p-0"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <h4 className="font-medium text-sm mb-2">{currentVideo.aiSummary.mainTopic}</h4>

                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground font-medium">Key Takeaways:</p>
                            <ul className="space-y-1">
                              {currentVideo.aiSummary.keyTakeaways.map((takeaway, index) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span className="text-balance">{takeaway}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                            <span className="text-xs text-muted-foreground">
                              {currentVideo.aiSummary.estimatedReadTime}
                            </span>
                            <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                              Save to Notes
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                    <div className="flex items-end justify-between">
                      <div className="flex-1 mr-4">
                        <Badge variant="secondary" className="mb-2 rounded-full">
                          {currentVideo?.category}
                        </Badge>
                        <h3 className="text-white text-lg font-semibold mb-1 text-balance">{currentVideo?.title}</h3>
                        <p className="text-white/80 text-sm mb-2">@{currentVideo?.channel}</p>

                        {currentVideo?.aiSummary && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleSummary(currentVideo.id)}
                            className="text-white/80 hover:text-white p-0 h-auto font-normal"
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            <span className="text-sm">{showSummary[currentVideo.id] ? "Hide" : "Show"} AI Summary</span>
                            {showSummary[currentVideo.id] ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            )}
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            className={`rounded-full h-12 w-12 ${currentVideo?.isLiked ? "text-red-500" : "text-white"}`}
                            onClick={() => handleLike(currentVideo?.id || "")}
                          >
                            <Heart className={`h-6 w-6 ${currentVideo?.isLiked ? "fill-current" : ""}`} />
                          </Button>
                          <span className="text-white text-xs text-center mt-1">{currentVideo?.likes}</span>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          className={`rounded-full h-12 w-12 ${currentVideo?.isSaved ? "text-yellow-500" : "text-white"}`}
                          onClick={() => handleSave(currentVideo?.id || "")}
                        >
                          <Bookmark className={`h-6 w-6 ${currentVideo?.isSaved ? "fill-current" : ""}`} />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full h-12 w-12 text-white hover:text-blue-400 transition-colors"
                          onClick={() => handleShare(currentVideo)}
                        >
                          <Share className="h-6 w-6" />
                        </Button>

                        <Button size="icon" variant="ghost" className="rounded-full h-12 w-12 text-white">
                          <MessageCircle className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {loadingMore && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-black/50 rounded-full p-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-around py-3 px-4">
          <Link href="/feed">
            <Button variant="ghost" size="icon" className="h-12 w-12">
              <Home className="h-6 w-6" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-12 w-12">
            <Search className="h-6 w-6" />
          </Button>
          <Link href="/saved">
            <Button variant="ghost" size="icon" className="h-12 w-12">
              <Bookmark className="h-6 w-6" />
            </Button>
          </Link>
          <Link href="/news">
            <Button variant="ghost" size="icon" className="h-12 w-12">
              <MessageCircle className="h-6 w-6" />
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="h-12 w-12">
              <User className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
        {videos.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, index) => {
          const actualIndex = Math.max(0, currentIndex - 2) + index
          return (
            <div
              key={actualIndex}
              className={`w-1 h-6 rounded-full transition-all duration-300 ${
                actualIndex === currentIndex ? "bg-primary h-8" : "bg-white/30"
              }`}
            />
          )
        })}
      </div>

      {currentIndex === 0 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm">Swipe up for next video</div>
        </motion.div>
      )}
    </div>
  )
}
