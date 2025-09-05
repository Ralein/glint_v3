"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Heart, Bookmark, Eye, Share, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ShareMenu } from "@/components/share-menu"

interface ExplorePost {
  id: string
  type: "image" | "video" | "reel"
  title: string
  channel: string
  category: string
  thumbnail: string
  likes: number
  views: number
  comments: number
  isLiked: boolean
  isSaved: boolean
  duration?: string
}

export default function ExplorePage() {
  const [posts, setPosts] = useState<ExplorePost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<ExplorePost | null>(null)
  const { toast } = useToast()

  const categories = [
    { id: "all", label: "All", color: "bg-primary" },
    { id: "tech", label: "Tech", color: "bg-blue-500" },
    { id: "cooking", label: "Cooking", color: "bg-orange-500" },
    { id: "motivation", label: "Motivation", color: "bg-green-500" },
    { id: "fitness", label: "Fitness", color: "bg-red-500" },
    { id: "learning", label: "Learning", color: "bg-purple-500" },
    { id: "wellness", label: "Wellness", color: "bg-teal-500" },
  ]

  useEffect(() => {
    fetchExplorePosts()
  }, [selectedCategory])

  const fetchExplorePosts = async () => {
    setLoading(true)
    try {
      const mockPosts: ExplorePost[] = [
        {
          id: "1",
          type: "video",
          title: "React Hooks Explained in 60 Seconds",
          channel: "CodeMaster",
          category: "tech",
          thumbnail: "/react-hooks-coding-tutorial.jpg",
          likes: 1240,
          views: 15600,
          comments: 89,
          isLiked: false,
          isSaved: false,
          duration: "0:58",
        },
        {
          id: "2",
          type: "reel",
          title: "Perfect Pasta Every Time",
          channel: "ChefLife",
          category: "cooking",
          thumbnail: "/pasta-cooking-kitchen-food.jpg",
          likes: 890,
          views: 12300,
          comments: 45,
          isLiked: true,
          isSaved: false,
          duration: "1:15",
        },
        {
          id: "3",
          type: "image",
          title: "Morning Motivation Quote",
          channel: "DailyInspire",
          category: "motivation",
          thumbnail: "/morning-motivation-success-mindset.jpg",
          likes: 2100,
          views: 8900,
          comments: 156,
          isLiked: false,
          isSaved: true,
        },
        {
          id: "4",
          type: "video",
          title: "5-Minute Meditation Guide",
          channel: "MindfulMoments",
          category: "wellness",
          thumbnail: "/meditation-mindfulness-peaceful.jpg",
          likes: 1560,
          views: 18700,
          comments: 78,
          isLiked: false,
          isSaved: false,
          duration: "5:12",
        },
        {
          id: "5",
          type: "reel",
          title: "JavaScript Closures Simplified",
          channel: "DevTips",
          category: "tech",
          thumbnail: "/javascript-closures-programming.jpg",
          likes: 980,
          views: 11200,
          comments: 34,
          isLiked: false,
          isSaved: false,
          duration: "0:45",
        },
        {
          id: "6",
          type: "video",
          title: "Knife Skills for Beginners",
          channel: "CulinaryBasics",
          category: "cooking",
          thumbnail: "/knife-skills-cooking-techniques.jpg",
          likes: 1340,
          views: 16800,
          comments: 92,
          isLiked: true,
          isSaved: true,
          duration: "3:22",
        },
      ]

      // Filter by category if not "all"
      const filteredPosts =
        selectedCategory === "all" ? mockPosts : mockPosts.filter((post) => post.category === selectedCategory)

      setPosts(filteredPosts)
    } catch (error) {
      console.error("Failed to fetch explore posts:", error)
      toast({
        title: "Error loading content",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )

    const post = posts.find((p) => p.id === postId)
    if (post && !post.isLiked) {
      toast({
        title: "Liked!",
        description: `You liked "${post.title}"`,
      })
    }
  }

  const handleSave = (postId: string) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, isSaved: !post.isSaved } : post)))

    const post = posts.find((p) => p.id === postId)
    if (post) {
      toast({
        title: post.isSaved ? "Removed from saved" : "Saved!",
        description: post.isSaved
          ? `Removed "${post.title}" from saved videos`
          : `"${post.title}" saved to your collection`,
      })
    }
  }

  const handleShare = (post: ExplorePost) => {
    setSelectedPost(post)
    setShareMenuOpen(true)
  }

  const handleComment = (post: ExplorePost) => {
    toast({
      title: "Comments",
      description: `Opening comments for "${post.title}"`,
    })
  }

  const handlePostClick = (post: ExplorePost) => {
    toast({
      title: "Opening post",
      description: `"${post.title}" by @${post.channel}`,
    })
  }

  if (loading) {
    return (
      <div className="flex-1 bg-black text-white">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded mb-6 w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
          <div className="flex-1 bg-black text-white">      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Explore</h1>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full whitespace-nowrap ${
                  selectedCategory === category.id
                    ? `${category.color} text-white border-0`
                    : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative cursor-pointer"
              onClick={() => handlePostClick(post)}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-900">
                <img
                  src={post.thumbnail || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {post.type === "video" || post.type === "reel" ? (
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </div>
                    ) : (
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Eye className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Type Indicator */}
                {(post.type === "video" || post.type === "reel") && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-black/60 backdrop-blur-sm rounded-full p-1.5">
                      <Play className="h-4 w-4 text-white fill-white" />
                    </div>
                  </div>
                )}

                {/* Duration for videos */}
                {post.duration && (
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">{post.duration}</div>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-black/60 text-white border-0 text-xs">
                    {post.category}
                  </Badge>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{post.title}</h3>
                  <p className="text-white/70 text-xs mb-2">@{post.channel}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white/70 text-xs">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-8 w-8 ${post.isLiked ? "text-red-500" : "text-white/70"} hover:text-red-400 transition-colors`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(post.id)
                        }}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white/70 hover:text-blue-400 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleComment(post)
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white/70 hover:text-green-400 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShare(post)
                        }}
                      >
                        <Share className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-8 w-8 ${post.isSaved ? "text-yellow-500" : "text-white/70"} hover:text-yellow-400 transition-colors`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSave(post.id)
                        }}
                      >
                        <Bookmark className={`h-4 w-4 ${post.isSaved ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {posts.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800">
              Load More
            </Button>
          </div>
        )}
      </div>

      {selectedPost && (
        <ShareMenu
          isOpen={shareMenuOpen}
          onClose={() => {
            setShareMenuOpen(false)
            setSelectedPost(null)
          }}
          video={{
            id: selectedPost.id,
            title: selectedPost.title,
            channel: selectedPost.channel,
            thumbnail: selectedPost.thumbnail,
          }}
        />
      )}
    </div>
  )
}
