"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Heart, Bookmark, Share } from "lucide-react"
import { Header } from "@/components/header"

interface Video {
  id: string
  title: string
  channel: string
  category: string
  thumbnail: string
  likes: number
  description: string
}

export default function VideoPage() {
  const params = useParams()
  const router = useRouter()
  const videoId = params.id as string

  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock video data - in real app, this would fetch from API
    const mockVideo: Video = {
      id: videoId,
      title: "Master React Hooks in 60 Seconds",
      channel: "CodeMaster",
      category: "Technology",
      thumbnail: "/react-hooks-coding-tutorial.jpg",
      likes: 1234,
      description:
        "Learn the essential React hooks that every developer should know. This quick tutorial covers useState, useEffect, and custom hooks with practical examples.",
    }

    setVideo(mockVideo)
    setLoading(false)
  }, [videoId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Video not found</h2>
          <Button onClick={() => router.push("/feed")} variant="outline">
            Back to Feed
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Shared Video</h1>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
            <div className="aspect-video bg-black relative">
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button size="lg" className="rounded-full w-16 h-16">
                  <Play className="h-8 w-8" />
                </Button>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2">
                    {video.category}
                  </Badge>
                  <h2 className="text-xl font-semibold mb-2 text-balance">{video.title}</h2>
                  <p className="text-muted-foreground">@{video.channel}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 text-balance">{video.description}</p>

              <div className="flex gap-4">
                <Button className="rounded-2xl">Watch on Glintly</Button>
                <Button variant="outline" onClick={() => router.push("/feed")} className="rounded-2xl bg-transparent">
                  Explore More Videos
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
