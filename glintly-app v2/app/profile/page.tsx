"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  Bookmark,
  Clock,
  Trophy,
  Flame,
  Target,
  Brain,
  Play,
  Edit,
  Save,
  X,
  BookOpen,
  Lightbulb,
  ChefHat,
  Code,
  DollarSign,
  Heart,
  Dumbbell,
  Briefcase,
  TrendingUp,
  Palette,
} from "lucide-react"

const interests = [
  {
    id: "learning",
    label: "Learning & Education",
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  {
    id: "motivation",
    label: "Motivation & Mindset",
    icon: Lightbulb,
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  },
  {
    id: "cooking",
    label: "Cooking & Recipes",
    icon: ChefHat,
    color: "bg-orange-500/10 text-orange-600 border-orange-200",
  },
  { id: "tech", label: "Tech & Programming", icon: Code, color: "bg-green-500/10 text-green-600 border-green-200" },
  {
    id: "finance",
    label: "Finance & Investing",
    icon: DollarSign,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  },
  { id: "wellness", label: "Health & Wellness", icon: Heart, color: "bg-red-500/10 text-red-600 border-red-200" },
  {
    id: "fitness",
    label: "Fitness & Exercise",
    icon: Dumbbell,
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
  },
  {
    id: "career",
    label: "Career & Business",
    icon: Briefcase,
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  },
  {
    id: "productivity",
    label: "Productivity & Growth",
    icon: TrendingUp,
    color: "bg-teal-500/10 text-teal-600 border-teal-200",
  },
  { id: "design", label: "Design & Creativity", icon: Palette, color: "bg-pink-500/10 text-pink-600 border-pink-200" },
]

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    bio: "",
    interests: [] as string[],
  })

  useEffect(() => {
    setMounted(true)

    // Load from localStorage (matching profile creation keys)
    const username = localStorage.getItem("glintly_username") || "learner_alex"
    const bio =
      localStorage.getItem("glintly_bio") ||
      "Passionate learner exploring tech, cooking, and personal growth. Always curious, always growing!"
    const savedInterests = localStorage.getItem("glintly_interests")
    const interests = savedInterests ? JSON.parse(savedInterests) : ["tech", "cooking", "wellness", "learning"]

    setFormData({
      username,
      displayName: username.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      bio,
      interests,
    })
  }, [])

  const handleSaveProfile = async () => {
    try {
      localStorage.setItem("glintly_username", formData.username)
      localStorage.setItem("glintly_bio", formData.bio)
      localStorage.setItem("glintly_interests", JSON.stringify(formData.interests))

      // Also save to userProfile for backward compatibility
      localStorage.setItem("userProfile", JSON.stringify(formData))

      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save profile:", error)
    }
  }

  const handleCancelEdit = () => {
    const username = localStorage.getItem("glintly_username") || "learner_alex"
    const bio = localStorage.getItem("glintly_bio") || ""
    const savedInterests = localStorage.getItem("glintly_interests")
    const interests = savedInterests ? JSON.parse(savedInterests) : []

    setFormData({
      username,
      displayName: username.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      bio,
      interests,
    })
    setIsEditing(false)
  }

  const toggleInterest = (interestId: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId],
    }))
  }

  if (!mounted) return null

  // Mock stats data
  const userData = {
    avatar: "/placeholder.svg?height=120&width=120",
    joinDate: "March 2024",
    stats: {
      streak: 12,
      videosWatched: 247,
      videosSaved: 34,
      totalWatchTime: "18h 32m",
      averageDaily: "45m",
    },
    achievements: [
      {
        id: 1,
        name: "First Week",
        description: "Completed your first week",
        icon: Calendar,
        earned: true,
        date: "Mar 15",
      },
      { id: 2, name: "Bookworm", description: "Saved 25+ videos", icon: Bookmark, earned: true, date: "Apr 2" },
      { id: 3, name: "Streak Master", description: "10-day learning streak", icon: Flame, earned: true, date: "Apr 8" },
      {
        id: 4,
        name: "Knowledge Seeker",
        description: "Watched 100+ videos",
        icon: Brain,
        earned: true,
        date: "Apr 12",
      },
      { id: 5, name: "Early Bird", description: "Learn before 8 AM", icon: Target, earned: false },
      { id: 6, name: "Marathon", description: "30-day streak", icon: Trophy, earned: false },
    ],
    savedVideos: [
      {
        id: 1,
        title: "5 React Hooks You Should Know",
        thumbnail: "/react-hooks-coding-tutorial.jpg",
        duration: "3:24",
        category: "Tech",
      },
      {
        id: 2,
        title: "Perfect Pasta in 10 Minutes",
        thumbnail: "/pasta-cooking-kitchen-food.jpg",
        duration: "2:15",
        category: "Cooking",
      },
      {
        id: 3,
        title: "Morning Routine for Success",
        thumbnail: "/morning-motivation-success-mindset.jpg",
        duration: "4:12",
        category: "Motivation",
      },
    ],
    revisitVideos: [
      {
        id: 4,
        title: "JavaScript Closures Explained",
        thumbnail: "/javascript-closures-programming.jpg",
        duration: "5:30",
        savedDays: 5,
        category: "Tech",
      },
      {
        id: 5,
        title: "Meditation for Beginners",
        thumbnail: "/meditation-mindfulness-peaceful.jpg",
        duration: "8:45",
        savedDays: 3,
        category: "Wellness",
      },
    ],
  }

  return (
    <div className="flex-1 bg-black text-white">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl bg-gray-800 text-white">
                    {formData.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-4 max-w-md">
                      <div>
                        <Label htmlFor="username" className="text-sm font-medium text-gray-300">
                          Username
                        </Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                          className="mt-1 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                          className="mt-1 resize-none bg-gray-800 border-gray-700 text-white"
                          rows={3}
                          maxLength={150}
                        />
                        <p className="text-xs text-gray-500 text-right mt-1">{formData.bio.length}/150 characters</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold mb-2 text-white">{formData.displayName}</h1>
                      <p className="text-gray-400 mb-1">@{formData.username}</p>
                      <p className="text-sm text-gray-500 mb-4 flex items-center justify-center md:justify-start gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {userData.joinDate}
                      </p>
                      <p className="text-gray-300 max-w-md">{formData.bio}</p>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveProfile} className="rounded-2xl bg-primary hover:bg-primary/90">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        className="rounded-2xl bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="rounded-2xl bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <Label className="text-sm font-medium mb-4 block text-gray-300">Interests</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {interests.map((interest, index) => {
                      const Icon = interest.icon
                      const isSelected = formData.interests.includes(interest.id)

                      return (
                        <motion.button
                          key={interest.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          onClick={() => toggleInterest(interest.id)}
                          className={`
                            relative p-4 rounded-2xl border-2 text-left transition-all duration-200
                            hover:shadow-lg hover:scale-[1.02] group
                            ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-gray-700 bg-gray-900/50 hover:border-primary/30"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`
                              p-2 rounded-xl transition-colors
                              ${isSelected ? "bg-primary text-primary-foreground" : "bg-gray-800 text-gray-400"}
                            `}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm text-white">{interest.label}</h3>
                            </div>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-5 w-5 rounded-full bg-primary flex items-center justify-center"
                              >
                                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Selected interests preview */}
                  {formData.interests.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-gray-800/50 rounded-xl"
                    >
                      <p className="text-sm font-medium mb-2 text-gray-300">Selected interests:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.interests.map((interestId) => {
                          const interest = interests.find((i) => i.id === interestId)
                          return (
                            <Badge key={interestId} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              {interest?.label}
                            </Badge>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold text-white">{userData.stats.streak}</span>
              </div>
              <p className="text-sm text-gray-400">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Play className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-white">{userData.stats.videosWatched}</span>
              </div>
              <p className="text-sm text-gray-400">Videos Watched</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Bookmark className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold text-white">{userData.stats.videosSaved}</span>
              </div>
              <p className="text-sm text-gray-400">Videos Saved</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold text-white">{userData.stats.totalWatchTime}</span>
              </div>
              <p className="text-sm text-gray-400">Total Time</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="saved" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-900 border-gray-800">
              <TabsTrigger value="saved" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Saved Videos
              </TabsTrigger>
              <TabsTrigger value="revisit" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Revisit
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userData.savedVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-800 rounded-xl mb-3 relative overflow-hidden">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <h3 className="font-medium text-sm mb-2 line-clamp-2 text-white">{video.title}</h3>
                      <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                        {video.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="revisit" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userData.revisitVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-800 rounded-xl mb-3 relative overflow-hidden">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          {video.savedDays}d ago
                        </div>
                      </div>
                      <h3 className="font-medium text-sm mb-2 line-clamp-2 text-white">{video.title}</h3>
                      <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                        {video.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {userData.achievements.map((achievement) => {
                  const IconComponent = achievement.icon
                  return (
                    <Card
                      key={achievement.id}
                      className={`bg-gray-900/50 backdrop-blur-sm border-gray-800 ${
                        achievement.earned ? "ring-2 ring-primary/20 bg-primary/5" : "opacity-60"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-xl ${
                              achievement.earned ? "bg-primary/20 text-primary" : "bg-gray-800 text-gray-500"
                            }`}
                          >
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white">{achievement.name}</h3>
                              {achievement.earned && (
                                <Badge
                                  variant="default"
                                  className="text-xs bg-primary/20 text-primary border-primary/30"
                                >
                                  Earned
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                            {achievement.earned && achievement.date && (
                              <p className="text-xs text-gray-500">Earned on {achievement.date}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
