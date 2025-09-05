"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  User,
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
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"

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

export default function ProfileCreationPage() {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId],
    )
  }

  const handleNext = () => {
    if (step === 1 && username.trim()) {
      setStep(2)
    }
  }

  const handleComplete = async () => {
    if (selectedInterests.length === 0) return

    setIsLoading(true)

    // Simulate profile creation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    localStorage.setItem("glintly_profile_completed", "true")
    localStorage.setItem("glintly_username", username)
    localStorage.setItem("glintly_bio", bio)
    localStorage.setItem("glintly_interests", JSON.stringify(selectedInterests))

    router.push("/explore")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center gap-2"
            >
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary">Glintly</h1>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <CardTitle className="text-3xl font-bold">
                {step === 1 ? "Welcome to Glintly" : "Let's personalize your experience"}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                {step === 1
                  ? "Tell us a bit about yourself to get started"
                  : "Choose topics that interest you for a curated feed"}
              </CardDescription>
            </motion.div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className={`h-2 w-8 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
              <div className={`h-2 w-8 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Choose a unique username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-12 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Bio (Optional)</label>
                  <Textarea
                    placeholder="Tell us about yourself in a few words..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-[100px] text-base resize-none"
                    maxLength={150}
                  />
                  <p className="text-xs text-muted-foreground text-right">{bio.length}/150 characters</p>
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!username.trim()}
                  className="w-full h-12 text-base font-semibold"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interests.map((interest, index) => {
                    const Icon = interest.icon
                    const isSelected = selectedInterests.includes(interest.id)

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
                              : "border-border bg-card hover:border-primary/30"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                            p-2 rounded-xl transition-colors
                            ${isSelected ? "bg-primary text-primary-foreground" : interest.color}
                          `}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{interest.label}</h3>
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

                {selectedInterests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-muted/50 rounded-xl"
                  >
                    <p className="text-sm font-medium mb-2">Selected interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedInterests.map((interestId) => {
                        const interest = interests.find((i) => i.id === interestId)
                        return (
                          <Badge key={interestId} variant="secondary" className="text-xs">
                            {interest?.label}
                          </Badge>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 text-base">
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={selectedInterests.length === 0 || isLoading}
                    className="flex-1 h-12 text-base font-semibold"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                      />
                    ) : (
                      "Complete Setup"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
