"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Zap,
  ChefHat,
  Code,
  DollarSign,
  Heart,
  ArrowRight,
  Check,
  Dumbbell,
  Briefcase,
  Lightbulb,
  Palette,
  Sparkles,
} from "lucide-react"
import { useRouter } from "next/navigation"

const interests = [
  {
    id: "learning",
    name: "Learning",
    icon: BookOpen,
    color: "from-blue-500/20 to-blue-600/20",
    description: "Educational content & tutorials",
    gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    id: "motivation",
    name: "Motivation",
    icon: Zap,
    color: "from-yellow-500/20 to-orange-600/20",
    description: "Inspiration & personal growth",
    gradient: "bg-gradient-to-br from-yellow-500 to-orange-600",
  },
  {
    id: "cooking",
    name: "Cooking",
    icon: ChefHat,
    color: "from-red-500/20 to-pink-600/20",
    description: "Recipes & culinary techniques",
    gradient: "bg-gradient-to-br from-red-500 to-pink-600",
  },
  {
    id: "tech",
    name: "Technology",
    icon: Code,
    color: "from-green-500/20 to-emerald-600/20",
    description: "Programming & tech trends",
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  {
    id: "finance",
    name: "Finance",
    icon: DollarSign,
    color: "from-purple-500/20 to-violet-600/20",
    description: "Money management & investing",
    gradient: "bg-gradient-to-br from-purple-500 to-violet-600",
  },
  {
    id: "wellness",
    name: "Wellness",
    icon: Heart,
    color: "from-teal-500/20 to-cyan-600/20",
    description: "Mental health & mindfulness",
    gradient: "bg-gradient-to-br from-teal-500 to-cyan-600",
  },
  {
    id: "fitness",
    name: "Fitness",
    icon: Dumbbell,
    color: "from-orange-500/20 to-red-600/20",
    description: "Workouts & physical health",
    gradient: "bg-gradient-to-br from-orange-500 to-red-600",
  },
  {
    id: "career",
    name: "Career Tips",
    icon: Briefcase,
    color: "from-indigo-500/20 to-purple-600/20",
    description: "Professional development",
    gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
  },
  {
    id: "self-improvement",
    name: "Self-Improvement",
    icon: Lightbulb,
    color: "from-amber-500/20 to-yellow-600/20",
    description: "Personal development & habits",
    gradient: "bg-gradient-to-br from-amber-500 to-yellow-600",
  },
  {
    id: "creativity",
    name: "Design & Creativity",
    icon: Palette,
    color: "from-pink-500/20 to-rose-600/20",
    description: "Art, design & creative skills",
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
]

export default function OnboardingPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const router = useRouter()

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId],
    )
  }

  const handleContinue = async () => {
    localStorage.setItem("userInterests", JSON.stringify(selectedInterests))
    router.push("/feed")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              What sparks your curiosity?
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-4 text-balance">
            Choose topics that inspire you to create a personalized learning experience
          </p>
          <Badge variant="outline" className="text-sm">
            Select at least 3 topics to get started
          </Badge>
        </motion.div>

        {/* Interest Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {interests.map((interest, index) => {
            const Icon = interest.icon
            const isSelected = selectedInterests.includes(interest.id)
            const isHovered = hoveredCard === interest.id

            return (
              <motion.div
                key={interest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setHoveredCard(interest.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden ${
                    isSelected ? "ring-2 ring-primary bg-primary/5 shadow-lg" : "hover:bg-muted/50 hover:shadow-lg"
                  }`}
                  onClick={() => toggleInterest(interest.id)}
                >
                  <CardContent className="p-4 text-center relative">
                    {/* Animated background gradient on hover */}
                    <motion.div
                      className={`absolute inset-0 ${interest.gradient} opacity-0`}
                      animate={{
                        opacity: isHovered ? 0.1 : 0,
                        scale: isHovered ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                      >
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </motion.div>
                    )}

                    {/* Icon container */}
                    <motion.div
                      className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${interest.color} flex items-center justify-center relative z-10`}
                      animate={{
                        scale: isSelected ? 1.1 : 1,
                        rotate: isHovered ? 5 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-foreground"}`} />
                    </motion.div>

                    {/* Text content */}
                    <div className="relative z-10">
                      <h3 className="font-semibold text-sm mb-1 text-balance">{interest.name}</h3>
                      <p className="text-xs text-muted-foreground text-balance leading-tight">{interest.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Selected interests preview */}
        {selectedInterests.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-3 text-center">Your Selected Interests</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedInterests.map((interestId) => {
                    const interest = interests.find((i) => i.id === interestId)
                    if (!interest) return null
                    const Icon = interest.icon

                    return (
                      <Badge key={interestId} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                        <Icon className="h-3 w-3" />
                        {interest.name}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={selectedInterests.length < 3}
            className="rounded-2xl px-12 py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
          >
            Start My Learning Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>{selectedInterests.length}/10 selected</span>
            <span>•</span>
            <span>Minimum 3 required</span>
          </div>

          {selectedInterests.length < 3 && (
            <p className="text-xs text-muted-foreground mt-2">
              Select {3 - selectedInterests.length} more topic{3 - selectedInterests.length !== 1 ? "s" : ""} to
              continue
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
