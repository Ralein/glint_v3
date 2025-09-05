"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Trash2, FolderOpen, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
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

  useEffect(() => {
    const fetchSavedData = async () => {
      setLoading(true)

      const mockSavedVideos: SavedVideo[] = [
        {
          id: "1",
          title: "Advanced React Patterns You Should Know",
          channel: "CodeMaster",
          category: "Technology",
          thumbnail: "/placeholder.svg?key=react-patterns",
          savedAt: "2 days ago",
          duration: "8:45",
        },
        {
          id: "2",
          title: "Morning Motivation: Start Your Day Right",
          channel: "MotivationDaily",
          category: "Motivation",
          thumbnail: "/placeholder.svg?key=morning-motivation",
          savedAt: "1 week ago",
          duration: "3:22",
        },
        {
          id: "3",
          title: "Perfect Homemade Pizza Recipe",
          channel: "QuickChef",
          category: "Cooking",
          thumbnail: "/placeholder.svg?key=pizza-recipe",
          savedAt: "3 days ago",
          duration: "12:15",
        },
      ]

      const mockPlaylists: Playlist[] = [
        {
          id: "1",
          name: "Coding Tricks",
          videoCount: 12,
          thumbnail: "/placeholder.svg?key=coding-playlist",
          color: "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
        },
        {
          id: "2",
          name: "Quick Meals",
          videoCount: 8,
          thumbnail: "/placeholder.svg?key=meals-playlist",
          color: "bg-gradient-to-br from-green-500/20 to-green-600/10",
        },
        {
          id: "3",
          name: "Morning Motivation",
          videoCount: 15,
          thumbnail: "/placeholder.svg?key=motivation-playlist",
          color: "bg-gradient-to-br from-purple-500/20 to-purple-600/10",
        },
      ]

      setSavedVideos(mockSavedVideos)
      setPlaylists(mockPlaylists)
      setLoading(false)
    }

    fetchSavedData()
  }, [])

  const handleRemove = (videoId: string) => {
    setSavedVideos((prev) => prev.filter((video) => video.id !== videoId))
  }

  const filteredVideos = savedVideos.filter(
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Saved Content</h1>
              <p className="text-muted-foreground">Your saved videos and playlists</p>
            </div>
            <Link href="/playlists">
              <Button className="rounded-2xl">
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </Link>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search saved content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-2xl"
            />
          </div>
        </motion.div>

        <Tabs defaultValue="playlists" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="playlists">Playlists ({playlists.length})</TabsTrigger>
            <TabsTrigger value="videos">All Videos ({savedVideos.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="playlists" className="space-y-6">
            {playlists.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-2xl flex items-center justify-center">
                  <FolderOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No playlists yet</h2>
                <p className="text-muted-foreground mb-6">Create playlists to organize your saved videos</p>
                <Link href="/playlists">
                  <Button className="rounded-2xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Playlist
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map((playlist, index) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/playlists/${playlist.id}`}>
                      <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 hover:shadow-xl group cursor-pointer">
                        <div className={`h-32 ${playlist.color} relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <Badge variant="secondary" className="bg-white/20 text-white border-0">
                              {playlist.videoCount} videos
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 text-balance">{playlist.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{playlist.videoCount} videos</span>
                            <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
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
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-2xl flex items-center justify-center">
                  <Play className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  {searchQuery ? "No videos found" : "No saved videos yet"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Start saving videos from your feed to watch them later"}
                </p>
                {!searchQuery && (
                  <Link href="/feed">
                    <Button className="rounded-2xl">Browse Feed</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 hover:shadow-lg group">
                      <div className="relative">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="icon" className="rounded-full">
                            <Play className="h-5 w-5" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {video.category}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemove(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-balance">{video.title}</h3>
                        <p className="text-xs text-muted-foreground mb-1">@{video.channel}</p>
                        <p className="text-xs text-muted-foreground">Saved {video.savedAt}</p>
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
                <Button variant="outline" className="rounded-2xl bg-transparent">
                  View Revisit Recommendations
                </Button>
              </Link>
              <Link href="/feed">
                <Button variant="outline" className="rounded-2xl bg-transparent">
                  Discover More Content
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
