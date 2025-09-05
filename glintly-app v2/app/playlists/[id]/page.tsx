"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Trash2, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"

interface Video {
  id: string
  title: string
  channel: string
  category: string
  thumbnail: string
  duration: string
  addedAt: string
}

interface Playlist {
  id: string
  name: string
  description: string
  videoCount: number
  color: string
}

export default function PlaylistDetailPage() {
  const params = useParams()
  const playlistId = params.id as string

  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchPlaylistData = async () => {
      setLoading(true)

      // Mock playlist data
      const mockPlaylist: Playlist = {
        id: playlistId,
        name: playlistId === "1" ? "Coding Tricks" : playlistId === "2" ? "Quick Meals" : "Morning Motivation",
        description:
          playlistId === "1"
            ? "Advanced programming techniques and tips"
            : playlistId === "2"
              ? "Fast and delicious recipes for busy days"
              : "Start your day with inspiration",
        videoCount: 12,
        color: "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
      }

      const mockVideos: Video[] = [
        {
          id: "1",
          title: "Advanced React Patterns You Should Know",
          channel: "CodeMaster",
          category: "Technology",
          thumbnail: "/placeholder.svg?key=react",
          duration: "8:45",
          addedAt: "2 days ago",
        },
        {
          id: "2",
          title: "JavaScript Closures Explained Simply",
          channel: "DevTips",
          category: "Technology",
          thumbnail: "/placeholder.svg?key=js",
          duration: "6:30",
          addedAt: "5 days ago",
        },
        {
          id: "3",
          title: "CSS Grid vs Flexbox: When to Use What",
          channel: "DesignCode",
          category: "Technology",
          thumbnail: "/placeholder.svg?key=css",
          duration: "12:15",
          addedAt: "1 week ago",
        },
      ]

      setPlaylist(mockPlaylist)
      setVideos(mockVideos)
      setLoading(false)
    }

    fetchPlaylistData()
  }, [playlistId])

  const removeFromPlaylist = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId))
    if (playlist) {
      setPlaylist((prev) => (prev ? { ...prev, videoCount: prev.videoCount - 1 } : null))
    }
  }

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Playlist not found</h2>
          <Link href="/playlists">
            <Button variant="outline">Back to Playlists</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Playlist Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/playlists">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
              <p className="text-muted-foreground">{playlist.description}</p>
            </div>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <div className={`h-32 ${playlist.color} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {playlist.videoCount} videos
                  </Badge>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                    <Play className="h-4 w-4 mr-2" />
                    Play All
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos in playlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-2xl"
            />
          </div>
          <Button variant="outline" className="rounded-2xl bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Videos
          </Button>
        </motion.div>

        {/* Videos List */}
        {filteredVideos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-2xl flex items-center justify-center">
              <Play className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {searchQuery ? "No videos found" : "No videos in this playlist"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? "Try adjusting your search terms" : "Add some videos to get started"}
            </p>
            {!searchQuery && (
              <Button className="rounded-2xl">
                <Plus className="h-4 w-4 mr-2" />
                Add Videos
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-colors group">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-32 h-20 flex-shrink-0">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <Button size="icon" variant="ghost" className="text-white">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                          {video.duration}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {video.category}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFromPlaylist(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-balance">{video.title}</h3>
                        <p className="text-xs text-muted-foreground mb-1">@{video.channel}</p>
                        <p className="text-xs text-muted-foreground">Added {video.addedAt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
