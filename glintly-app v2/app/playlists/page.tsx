"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Play, FolderOpen, Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

interface Playlist {
  id: string
  name: string
  description: string
  videoCount: number
  thumbnail: string
  createdAt: string
  color: string
}

interface Video {
  id: string
  title: string
  channel: string
  category: string
  thumbnail: string
  duration: string
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const playlistColors = [
    "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
    "bg-gradient-to-br from-green-500/20 to-green-600/10",
    "bg-gradient-to-br from-purple-500/20 to-purple-600/10",
    "bg-gradient-to-br from-orange-500/20 to-orange-600/10",
    "bg-gradient-to-br from-pink-500/20 to-pink-600/10",
    "bg-gradient-to-br from-teal-500/20 to-teal-600/10",
  ]

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true)
      const mockPlaylists: Playlist[] = [
        {
          id: "1",
          name: "Coding Tricks",
          description: "Advanced programming techniques and tips",
          videoCount: 12,
          thumbnail: "/placeholder.svg?key=coding",
          createdAt: "2 weeks ago",
          color: playlistColors[0],
        },
        {
          id: "2",
          name: "Quick Meals",
          description: "Fast and delicious recipes for busy days",
          videoCount: 8,
          thumbnail: "/placeholder.svg?key=cooking",
          createdAt: "1 week ago",
          color: playlistColors[1],
        },
        {
          id: "3",
          name: "Morning Motivation",
          description: "Start your day with inspiration",
          videoCount: 15,
          thumbnail: "/placeholder.svg?key=motivation",
          createdAt: "3 days ago",
          color: playlistColors[2],
        },
        {
          id: "4",
          name: "Design Inspiration",
          description: "UI/UX tips and creative ideas",
          videoCount: 6,
          thumbnail: "/placeholder.svg?key=design",
          createdAt: "5 days ago",
          color: playlistColors[3],
        },
      ]
      setPlaylists(mockPlaylists)
      setLoading(false)
    }

    fetchPlaylists()
  }, [])

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      description: newPlaylistDescription,
      videoCount: 0,
      thumbnail: "/placeholder.svg",
      createdAt: "Just now",
      color: playlistColors[Math.floor(Math.random() * playlistColors.length)],
    }

    setPlaylists((prev) => [newPlaylist, ...prev])
    setNewPlaylistName("")
    setNewPlaylistDescription("")
    setIsCreateDialogOpen(false)
  }

  const deletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId))
  }

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchQuery.toLowerCase()),
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
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Playlists</h1>
              <p className="text-muted-foreground">Organize your saved videos into collections</p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Playlist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Playlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Playlist Name</label>
                    <Input
                      placeholder="e.g., Coding Tricks"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description (optional)</label>
                    <Input
                      placeholder="Brief description of your playlist"
                      value={newPlaylistDescription}
                      onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={createPlaylist} className="flex-1">
                      Create Playlist
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-2xl"
            />
          </div>
        </motion.div>

        {/* Playlists Grid */}
        {filteredPlaylists.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-2xl flex items-center justify-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{searchQuery ? "No playlists found" : "No playlists yet"}</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Create your first playlist to organize your saved videos"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="rounded-2xl">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Playlist
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaylists.map((playlist, index) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 hover:shadow-xl group cursor-pointer">
                  <div className={`h-32 ${playlist.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-white/20 text-white border-0">
                          {playlist.videoCount} videos
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-white/80 hover:text-red-400 hover:bg-white/20"
                            onClick={(e) => {
                              e.stopPropagation()
                              deletePlaylist(playlist.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-balance">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 text-balance">
                      {playlist.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Created {playlist.createdAt}</span>
                      <Link href={`/playlists/${playlist.id}`}>
                        <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
                          <Play className="h-3 w-3 mr-1" />
                          Open
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {playlists.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/saved">
                <Button variant="outline" className="rounded-2xl bg-transparent">
                  View All Saved Videos
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
