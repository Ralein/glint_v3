"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Clock, Hash, User, TrendingUp as Trending, Play, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface SearchResult {
  id: string
  type: "video" | "user" | "hashtag"
  title: string
  channel?: string
  category?: string
  thumbnail?: string
  followers?: number
  posts?: number
  views?: number
  duration?: string
  isVerified?: boolean
}

interface RecentSearch {
  id: string
  query: string
  type: "user" | "hashtag" | "video"
  timestamp: Date
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [trendingTopics, setTrendingTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "users" | "hashtags">("all")
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }

    // Load trending topics
    setTrendingTopics([
      "#ReactTips",
      "#CookingHacks",
      "#MorningMotivation",
      "#ProductivityTips",
      "#HealthyEating",
      "#CodeLife",
      "#MindfulMoments",
      "#FitnessGoals",
    ])

    // Focus input on mount
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (query.trim()) {
      const debounceTimer = setTimeout(() => {
        performSearch(query)
      }, 300)
      return () => clearTimeout(debounceTimer)
    } else {
      setResults([])
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    try {
      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: "1",
          type: "video",
          title: "React Hooks Complete Guide",
          channel: "CodeMaster",
          category: "tech",
          thumbnail: "/react-hooks-coding-tutorial.jpg",
          views: 15600,
          duration: "12:45",
        },
        {
          id: "2",
          type: "user",
          title: "CodeMaster",
          followers: 125000,
          posts: 342,
          thumbnail: "/developer-avatar.png",
          isVerified: true,
        },
        {
          id: "3",
          type: "hashtag",
          title: "#ReactTips",
          posts: 8900,
        },
        {
          id: "4",
          type: "video",
          title: "Perfect Pasta in 5 Minutes",
          channel: "QuickCook",
          category: "cooking",
          thumbnail: "/pasta-cooking-kitchen-food.jpg",
          views: 23400,
          duration: "5:12",
        },
        {
          id: "5",
          type: "user",
          title: "ChefLife",
          followers: 89000,
          posts: 156,
          thumbnail: "/chef-avatar.png",
          isVerified: false,
        },
      ]

      // Filter results based on active tab and search query
      let filteredResults = mockResults.filter((result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      if (activeTab !== "all") {
        const typeMap = { videos: "video", users: "user", hashtags: "hashtag" }
        filteredResults = filteredResults.filter((result) => result.type === typeMap[activeTab])
      }

      setResults(filteredResults)
    } catch (error) {
      console.error("Search failed:", error)
      toast({
        title: "Search failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addToRecentSearches = (searchQuery: string, type: "user" | "hashtag" | "video") => {
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query: searchQuery,
      type,
      timestamp: new Date(),
    }

    const updated = [newSearch, ...recentSearches.filter((s) => s.query !== searchQuery)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  const handleResultClick = (result: SearchResult) => {
    addToRecentSearches(result.title, result.type)
    toast({
      title: "Opening result",
      description: `"${result.title}"`,
    })
  }

  const handleRecentSearchClick = (search: RecentSearch) => {
    setQuery(search.query)
  }

  const handleTrendingClick = (topic: string) => {
    setQuery(topic)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    inputRef.current?.focus()
  }

  const tabs = [
    { id: "all", label: "All" },
    { id: "videos", label: "Videos" },
    { id: "users", label: "Users" },
    { id: "hashtags", label: "Hashtags" },
  ] as const

  return (
    <div className="flex-1 bg-black text-white">
      <div className="p-6">
        {/* Search Header */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search videos, users, or hashtags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-12 py-3 bg-gray-900 border-gray-700 text-white placeholder-gray-400 rounded-xl text-base focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {query && (
              <Button
                size="icon"
                variant="ghost"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Tabs */}
          {query && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary text-white border-0"
                      : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </motion.div>
          ) : query && results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleResultClick(result)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  {result.type === "video" ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      <img
                        src={result.thumbnail || "/placeholder.svg"}
                        alt={result.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white fill-white" />
                      </div>
                      {result.duration && (
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                          {result.duration}
                        </div>
                      )}
                    </div>
                  ) : result.type === "user" ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex-shrink-0 flex items-center justify-center">
                      {result.thumbnail ? (
                        <img
                          src={result.thumbnail || "/placeholder.svg"}
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                      <Hash className="h-6 w-6 text-primary" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{result.title}</h3>
                      {result.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {result.type === "video" && (
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>@{result.channel}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {result.views?.toLocaleString()} views
                        </span>
                        {result.category && (
                          <Badge variant="outline" className="text-xs">
                            {result.category}
                          </Badge>
                        )}
                      </div>
                    )}

                    {result.type === "user" && (
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{result.followers?.toLocaleString()} followers</span>
                        <span>{result.posts} posts</span>
                      </div>
                    )}

                    {result.type === "hashtag" && (
                      <div className="text-sm text-gray-400">
                        <span>{result.posts?.toLocaleString()} posts</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : query && results.length === 0 && !loading ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No results found</h3>
              <p className="text-gray-500">Try searching for something else</p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Recent Searches</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-gray-400 hover:text-white"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.slice(0, 5).map((search) => (
                      <div
                        key={search.id}
                        onClick={() => handleRecentSearchClick(search)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900/50 cursor-pointer transition-colors"
                      >
                        <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-300 flex-1">{search.query}</span>
                        <Badge variant="outline" className="text-xs text-gray-500 border-gray-600">
                          {search.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Topics */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Trending className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-white">Trending</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {trendingTopics.map((topic, index) => (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleTrendingClick(topic)}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/30 hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <Hash className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-gray-300 font-medium">{topic}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
