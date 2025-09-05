"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw, Clock, Play } from "lucide-react"
import Link from "next/link"

interface RevisitVideo {
  id: string
  title: string
  channel: string
  category: string
  thumbnail: string
  savedAt: string
  daysAgo: number
  lastWatched?: string
}

export default function RevisitPage() {
  const [revisitVideos, setRevisitVideos] = useState<RevisitVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to /api/revisit
    const fetchRevisitVideos = async () => {
      setLoading(true)
      const mockRevisitVideos: RevisitVideo[] = [
        {
          id: "1",
          title: "The Science of Habit Formation",
          channel: "LifeHacker",
          category: "Learning",
          thumbnail: "/placeholder-smge9.png",
          savedAt: "2 weeks ago",
          daysAgo: 14,
          lastWatched: "2 weeks ago",
        },
        {
          id: "2",
          title: "Advanced CSS Grid Techniques",
          channel: "WebDev Pro",
          category: "Technology",
          thumbnail: "/placeholder-3me3x.png",
          savedAt: "10 days ago",
          daysAgo: 10,
          lastWatched: "1 week ago",
        },
        {
          id: "3",
          title: "Mindfulness Meditation for Beginners",
          channel: "ZenMaster",
          category: "Wellness",
          thumbnail: "/placeholder-344mv.png",
          savedAt: "1 week ago",
          daysAgo: 7,
          lastWatched: "5 days ago",
        },
        {
          id: "4",
          title: "Investment Strategies for 2024",
          channel: "FinanceGuru",
          category: "Finance",
          thumbnail: "/placeholder-9hpa8.png",
          savedAt: "5 days ago",
          daysAgo: 5,
          lastWatched: "Never",
        },
      ]
      setRevisitVideos(mockRevisitVideos)
      setLoading(false)
    }

    fetchRevisitVideos()
  }, [])

  const handleRevisit = (videoId: string) => {
    // Mark as revisited and potentially remove from list
    setRevisitVideos((prev) => prev.filter((video) => video.id !== videoId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center gap-4 p-4">
          <Link href="/saved">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Time to Revisit</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {revisitVideos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
              <RotateCcw className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">All caught up!</h2>
            <p className="text-muted-foreground mb-6">No videos need revisiting right now. Check back later!</p>
            <Link href="/feed">
              <Button>Continue Learning</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground text-center">
                These videos were saved 3+ days ago and might be worth revisiting
              </p>
            </div>

            <div className="space-y-4">
              {revisitVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="relative w-32 h-24 flex-shrink-0">
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {video.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {video.daysAgo} days ago
                            </div>
                          </div>

                          <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-balance">{video.title}</h3>

                          <p className="text-xs text-muted-foreground mb-2">@{video.channel}</p>

                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">Last watched: {video.lastWatched}</p>

                            <Button size="sm" className="rounded-full" onClick={() => handleRevisit(video.id)}>
                              Watch Again
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
