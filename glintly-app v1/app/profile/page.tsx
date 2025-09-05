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
import { Calendar, Bookmark, Clock, Trophy, Flame, Target, Brain, Play, Edit, Save, X } from "lucide-react"
import { Header } from "@/components/header"

const interestCategories = [
  { id: "learning", name: "Learning", icon: "📚" },
  { id: "motivation", name: "Motivation", icon: "💪" },
  { id: "cooking", name: "Cooking", icon: "🍳" },
  { id: "tech", name: "Tech", icon: "💻" },
  { id: "finance", name: "Finance", icon: "💰" },
  { id: "wellness", name: "Wellness", icon: "🧘" },
  { id: "fitness", name: "Fitness", icon: "🏋️" },
  { id: "career", name: "Career Tips", icon: "📈" },
  { id: "creativity", name: "Design & Creativity", icon: "🎨" },
  { id: "improvement", name: "Self-Improvement", icon: "🌱" },
]

// Mock user data
const userData = {
  username: "learner_alex",
  displayName: "Alex Chen",
  bio: "Passionate learner exploring tech, cooking, and personal growth. Always curious, always growing!",
  avatar: "/placeholder.svg?height=120&width=120",
  joinDate: "March 2024",
  interests: ["tech", "cooking", "wellness", "learning"],
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
    { id: 4, name: "Knowledge Seeker", description: "Watched 100+ videos", icon: Brain, earned: true, date: "Apr 12" },
    { id: 5, name: "Early Bird", description: "Learn before 8 AM", icon: Target, earned: false },
    { id: 6, name: "Marathon", description: "30-day streak", icon: Trophy, earned: false },
  ],
  savedVideos: [
    {
      id: 1,
      title: "5 React Hooks You Should Know",
      thumbnail: "/placeholder.svg?height=200&width=200",
      duration: "3:24",
      category: "Tech",
    },
    {
      id: 2,
      title: "Perfect Pasta in 10 Minutes",
      thumbnail: "/placeholder.svg?height=200&width=200",
      duration: "2:15",
      category: "Cooking",
    },
    {
      id: 3,
      title: "Morning Routine for Success",
      thumbnail: "/placeholder.svg?height=200&width=200",
      duration: "4:12",
      category: "Motivation",
    },
  ],
  revisitVideos: [
    {
      id: 4,
      title: "JavaScript Closures Explained",
      thumbnail: "/placeholder.svg?height=200&width=200",
      duration: "5:30",
      savedDays: 5,
      category: "Tech",
    },
    {
      id: 5,
      title: "Meditation for Beginners",
      thumbnail: "/placeholder.svg?height=200&width=200",
      duration: "8:45",
      savedDays: 3,
      category: "Wellness",
    },
  ],
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: userData.username,
    displayName: userData.displayName,
    bio: userData.bio,
    interests: userData.interests,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveProfile = async () => {
    try {
      // Update localStorage
      localStorage.setItem("userProfile", JSON.stringify(formData))

      // Here you would typically make an API call to update the profile
      // await fetch('/api/user/update', { method: 'POST', body: JSON.stringify(formData) })

      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save profile:", error)
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      username: userData.username,
      displayName: userData.displayName,
      bio: userData.bio,
      interests: userData.interests,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {(isEditing ? formData.displayName : userData.displayName)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-4 max-w-md">
                      <div>
                        <Label htmlFor="displayName" className="text-sm font-medium">
                          Display Name
                        </Label>
                        <Input
                          id="displayName"
                          value={formData.displayName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="username" className="text-sm font-medium">
                          Username
                        </Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio" className="text-sm font-medium">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                          className="mt-1 resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold mb-2">{formData.displayName}</h1>
                      <p className="text-muted-foreground mb-1">@{formData.username}</p>
                      <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center md:justify-start gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {userData.joinDate}
                      </p>
                      <p className="text-muted-foreground max-w-md">{formData.bio}</p>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveProfile} className="rounded-2xl">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" className="rounded-2xl bg-transparent">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-2xl bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <Label className="text-sm font-medium mb-4 block">Interests</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {interestCategories.map((category) => (
                      <Button
                        key={category.id}
                        onClick={() => toggleInterest(category.id)}
                        variant={formData.interests.includes(category.id) ? "default" : "outline"}
                        className="h-auto p-4 flex flex-col items-center gap-2 rounded-2xl transition-all hover:scale-105"
                      >
                        <span className="text-2xl">{category.icon}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </Button>
                    ))}
                  </div>
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
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">{userData.stats.streak}</span>
              </div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Play className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{userData.stats.videosWatched}</span>
              </div>
              <p className="text-sm text-muted-foreground">Videos Watched</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Bookmark className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{userData.stats.videosSaved}</span>
              </div>
              <p className="text-sm text-muted-foreground">Videos Saved</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{userData.stats.totalWatchTime}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Time</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="saved" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="saved">Saved Videos</TabsTrigger>
              <TabsTrigger value="revisit">Revisit</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userData.savedVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-colors group cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-xl mb-3 relative overflow-hidden">
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
                      <h3 className="font-medium text-sm mb-2 line-clamp-2">{video.title}</h3>
                      <Badge variant="secondary" className="text-xs">
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
                    className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-colors group cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-xl mb-3 relative overflow-hidden">
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
                      <h3 className="font-medium text-sm mb-2 line-clamp-2">{video.title}</h3>
                      <Badge variant="secondary" className="text-xs">
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
                      className={`bg-card/50 backdrop-blur-sm border-border/50 ${
                        achievement.earned ? "ring-2 ring-primary/20 bg-primary/5" : "opacity-60"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-xl ${
                              achievement.earned ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{achievement.name}</h3>
                              {achievement.earned && (
                                <Badge variant="default" className="text-xs bg-primary/20 text-primary">
                                  Earned
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                            {achievement.earned && achievement.date && (
                              <p className="text-xs text-muted-foreground">Earned on {achievement.date}</p>
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
