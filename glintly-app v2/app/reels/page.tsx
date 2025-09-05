"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"

interface Reel {
  id: string
  title: string
  channel: string
  category: string
  thumbnail: string
  duration: string
  likes: number
  views: number
  isLiked: boolean
  isSaved: boolean
}

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReels()
  }, [])

  const fetchReels = async () => {
    const mockReels: Reel[] = [
      {
        id: "1",
        title: "Quick React Tips",
        channel: "DevShorts",
        category: "tech",
        thumbnail: "/react-hooks-coding-tutorial.jpg",
        duration: "0:30",
        likes: 1200,
        views: 15000,
        isLiked: false,
        isSaved: false,
      },
      {
        id: "2",
        title: "30-Second Pasta Hack",
        channel: "QuickCook",
        category: "cooking",
        thumbnail: "/pasta-cooking-kitchen-food.jpg",
        duration: "0:28",
        likes: 890,
        views: 12000,
        isLiked: true,
        isSaved: false,
      },
    ]

    setReels(mockReels)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex-1 bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-black text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Reels</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {reels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative cursor-pointer"
            >
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-900">
                <img
                  src={reel.thumbnail || "/placeholder.svg"}
                  alt={reel.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-3 right-3">
                  <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">{reel.duration}</div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{reel.title}</h3>
                  <p className="text-white/70 text-xs">@{reel.channel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
