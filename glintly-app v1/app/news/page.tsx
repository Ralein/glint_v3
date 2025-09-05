"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface NewsPost {
  id: string
  title: string
  category: string
  content: string
  backgroundColor: string
  textColor: string
  accentColor: string
  timestamp: string
}

export default function NewsPage() {
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const constraintsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate API call to /api/news
    const fetchNews = async () => {
      setLoading(true)
      const mockNews: NewsPost[] = [
        {
          id: "1",
          title: "AI Breakthrough: New Language Model Achieves Human-Level Reasoning",
          category: "AI",
          content:
            "Researchers at leading tech companies have developed a revolutionary AI system that demonstrates unprecedented reasoning capabilities, potentially transforming how we interact with artificial intelligence.",
          backgroundColor: "from-blue-600 to-purple-700",
          textColor: "text-white",
          accentColor: "text-blue-200",
          timestamp: "2 hours ago",
        },
        {
          id: "2",
          title: "The Future of Remote Work: Virtual Reality Offices",
          category: "Tech",
          content:
            "Companies are increasingly adopting VR technology to create immersive remote work environments, offering employees the benefits of in-person collaboration from anywhere in the world.",
          backgroundColor: "from-emerald-500 to-teal-600",
          textColor: "text-white",
          accentColor: "text-emerald-200",
          timestamp: "4 hours ago",
        },
        {
          id: "3",
          title: "Mindful Productivity: The Science Behind Focus",
          category: "Motivation",
          content:
            "New research reveals how mindfulness practices can dramatically improve focus and productivity, with simple techniques that can be implemented in just 5 minutes a day.",
          backgroundColor: "from-orange-500 to-red-600",
          textColor: "text-white",
          accentColor: "text-orange-200",
          timestamp: "6 hours ago",
        },
        {
          id: "4",
          title: "Sustainable Cooking: Plant-Based Innovations",
          category: "Lifestyle",
          content:
            "Discover the latest plant-based cooking innovations that are revolutionizing sustainable eating, from lab-grown ingredients to zero-waste cooking techniques.",
          backgroundColor: "from-green-600 to-lime-600",
          textColor: "text-white",
          accentColor: "text-green-200",
          timestamp: "8 hours ago",
        },
      ]
      setNewsPosts(mockNews)
      setLoading(false)
    }

    fetchNews()
  }, [])

  const handleSwipe = (event: any, info: PanInfo) => {
    const swipeThreshold = 50

    if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (info.offset.x < -swipeThreshold && currentIndex < newsPosts.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const nextPost = () => {
    if (currentIndex < newsPosts.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevPost = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const currentPost = newsPosts[currentIndex]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center gap-4 p-4">
          <Link href="/feed">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">AI News</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {newsPosts.length}
            </span>
          </div>
        </div>
      </div>

      {/* News Carousel */}
      <div className="relative h-[calc(100vh-80px)] overflow-hidden" ref={constraintsRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPost?.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0.2}
            onDragEnd={handleSwipe}
            className="h-full w-full cursor-grab active:cursor-grabbing"
          >
            <Card className={`h-full w-full rounded-none border-0 bg-gradient-to-br ${currentPost?.backgroundColor}`}>
              <CardContent className="h-full flex flex-col justify-between p-8">
                {/* Header */}
                <div>
                  <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                    {currentPost?.category}
                  </Badge>
                  <p className={`text-sm ${currentPost?.accentColor} mb-2`}>{currentPost?.timestamp}</p>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <h1
                    className={`text-3xl md:text-4xl font-bold mb-6 ${currentPost?.textColor} text-balance leading-tight`}
                  >
                    {currentPost?.title}
                  </h1>
                  <p className={`text-lg ${currentPost?.accentColor} leading-relaxed text-balance`}>
                    {currentPost?.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30 rounded-2xl"
                  >
                    Read More
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevPost}
                      disabled={currentIndex === 0}
                      className="text-white hover:bg-white/20 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextPost}
                      disabled={currentIndex === newsPosts.length - 1}
                      className="text-white hover:bg-white/20 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Swipe Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {newsPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
