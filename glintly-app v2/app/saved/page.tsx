"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Trash2, FolderOpen, Plus, Search, ArrowUp } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

interface SavedVideo {
  id: string
  title: string
  channel: string
  category: string
  thumbnail: string
  savedAt: string
  duration: string
}

interface Playlist {
  id: string
  name: string
  videoCount: number
  thumbnail: string
  color: string
}

export default function SavedPage() {
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showScrollTop, setShowScrollTop] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8])
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.95])

  useEffect(() => {
    const fetchSavedData = async () => {
      setLoading(true)

      const mockSavedVideos: SavedVideo[] = [
        {
          id: "1",
          title: "Advanced React Patterns You Should Know",
          channel: "CodeMaster",
          category: "Technology",
          thumbnail: "/react-hooks-coding-tutorial.jpg",
          savedAt: "2 days ago",
          duration: "8:45",
        },
        {
          id: "2",
          title: "Morning Motivation: Start Your Day Right",
          channel: "MotivationDaily",
          category: "Motivation",
          thumbnail: "/morning-motivation-success-mindset.jpg",
          savedAt: "1 week ago",
          duration: "3:22",
        },
        {
          id: "3",
          title: "Perfect Homemade Pizza Recipe",
          channel: "QuickChef",
          category: "Cooking",
          thumbnail: "/pasta-cooking-kitchen-food.jpg",
          savedAt: "3 days ago",
          duration: "12:15",
        },
        {
          id: "4",
          title: "JavaScript Closures Explained",
          channel: "DevTips",
          category: "Technology",
          thumbnail: "/javascript-closures-programming.jpg",
          savedAt: "5 days ago",
          duration: "6:30",
        },
        {
          id: "5",
          title: "Meditation for Beginners",
          channel: "MindfulMoments",
          category: "Wellness",
          thumbnail: "/meditation-mindfulness-peaceful.jpg",
          savedAt: "1 week ago",
          duration: "10:00",
        },
        {
          id: "6",
          title: "Knife Skills Masterclass",
          channel: "CulinaryBasics",
          category: "Cooking",
          thumbnail: "/knife-skills-cooking-techniques.jpg",
          savedAt: "3 days ago",
          duration: "15:20",
        },
      ]

      const mockPlaylists: Playlist[] = [
        {
          id: "1",
          name: "Coding Tricks",
          videoCount: 12,
          thumbnail: "/react-hooks-coding-tutorial.jpg",
          color: "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
        },
        {
          id: "2",
          name: "Quick Meals",
          videoCount: 8,
          thumbnail: "/pasta-cooking-kitchen-food.jpg",
          color: "bg-gradient-to-br from-green-500/20 to-green-600/10",
        },
        {
          id: "3",
          name: "Morning Motivation",
          videoCount: 15,
          thumbnail: "/morning-motivation-success-mindset.jpg",
          color: "bg-gradient-to-br from-purple-500/20 to-purple-600/10",
        },
        {
          id: "4",
          name: "Wellness Journey",
          videoCount: 6,
          thumbnail: "/meditation-mindfulness-peaceful.jpg",
          color: "bg-gradient-to-br from-teal-500/20 to-teal-600/10",
        },
      ]

      setSavedVideos(mockSavedVideos)
      setPlaylists(mockPlaylists)
      setLoading(false)
    }

    fetchSavedData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleRemove = (videoId: string) => {
    setSavedVideos((prev) => prev.filter((video) => video.id !== videoId))
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const filteredVideos = savedVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex-1 bg-black text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="flex-1 bg-black text-white" ref={containerRef}>
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ opacity: headerOpacity, scale: headerScale }}
          className="mb-8 sticky top-0 bg-black/80 backdrop-blur-sm z-10 py-4 -mx-6 px-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Saved Content</h1>
              <p className="text-gray-400">Your saved videos and playlists</p>
            </div>
            <Link href="/playlists">
              <Button className="rounded-2xl bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </Link>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search saved content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-2xl bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </motion.div>

        <Tabs defaultValue="playlists" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-900 border-gray-700">
            <TabsTrigger value="playlists" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Playlists ({playlists.length})
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              All Videos ({savedVideos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playlists" className="space-y-6">
            {playlists.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <FolderOpen className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-white">No playlists yet</h2>
                <p className="text-gray-400 mb-6">Create playlists to organize your saved videos</p>
                <Link href="/playlists">
                  <Button className="rounded-2xl bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Playlist
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map((playlist, index) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Link href={`/playlists/${playlist.id}`}>
                      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl group cursor-pointer overflow-hidden">
                        <div className={`h-32 ${playlist.color} relative overflow-hidden`}>
                          <img
                            src={playlist.thumbnail || "/placeholder.svg"}
                            alt={playlist.name}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <Badge variant="secondary" className="bg-white/20 text-white border-0">
                              {playlist.videoCount} videos
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 text-balance text-white">{playlist.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">{playlist.videoCount} videos</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-xl bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Open
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            {filteredVideos.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-white">
                  {searchQuery ? "No videos found" : "No saved videos yet"}
                </h2>
                <p className="text-gray-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Start saving videos from your feed to watch them later"}
                </p>
                {!searchQuery && (
                  <Link href="/explore">
                    <Button className="rounded-2xl bg-primary hover:bg-primary/90">Browse Explore</Button>
                  </Link>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    layout
                  >
                    <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:shadow-lg group overflow-hidden">
                      <div className="relative">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="icon" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                            <Play className="h-5 w-5 text-white" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {video.category}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                            onClick={() => handleRemove(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-balance text-white">
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-400 mb-1">@{video.channel}</p>
                        <p className="text-xs text-gray-500">Saved {video.savedAt}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        {(savedVideos.length > 0 || playlists.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/revisit">
                <Button
                  variant="outline"
                  className="rounded-2xl bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  View Revisit Recommendations
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  variant="outline"
                  className="rounded-2xl bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Discover More Content
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
