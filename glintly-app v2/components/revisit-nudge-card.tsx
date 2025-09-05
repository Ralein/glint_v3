"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Clock, Sparkles, Heart, Target } from "lucide-react"

interface RevisitNudgeCardProps {
  video: {
    id: string
    title: string
    channel: string
    category: string
    thumbnail: string
    daysAgo: number
    priority: "high" | "medium" | "low"
    nudgeType: string
    nudgeMessage: string
  }
  onWatch: () => void
  onSkip: () => void
}

const nudgeIcons = {
  forgotten_gem: Sparkles,
  skill_reinforcement: Target,
  wellness_reminder: Heart,
  recent_save: Clock,
}

const priorityColors = {
  high: "from-orange-500/20 to-red-500/20 border-orange-500/30",
  medium: "from-blue-500/20 to-purple-500/20 border-blue-500/30",
  low: "from-green-500/20 to-teal-500/20 border-green-500/30",
}

export function RevisitNudgeCard({ video, onWatch, onSkip }: RevisitNudgeCardProps) {
  const IconComponent = nudgeIcons[video.nudgeType as keyof typeof nudgeIcons] || RotateCcw
  const gradientClass = priorityColors[video.priority]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="h-full w-full relative"
    >
      <Card className={`h-full w-full rounded-none bg-gradient-to-br ${gradientClass} border-2`}>
        <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center relative">
          {/* Background thumbnail with overlay */}
          <div className="absolute inset-0 opacity-20">
            <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
          </div>

          <div className="relative z-10 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/20 border-2 border-primary/30">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
            </div>

            <Badge variant="outline" className="mb-3 capitalize">
              {video.category}
            </Badge>

            <h2 className="text-2xl font-bold mb-3 text-balance">{video.title}</h2>

            <p className="text-muted-foreground mb-2">@{video.channel}</p>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Saved {video.daysAgo} days ago</span>
            </div>

            <p className="text-lg font-medium mb-8 text-balance text-primary">{video.nudgeMessage}</p>

            <div className="space-y-3">
              <Button size="lg" className="w-full rounded-2xl bg-primary hover:bg-primary/90" onClick={onWatch}>
                <RotateCcw className="h-5 w-5 mr-2" />
                Watch Again
              </Button>
              <Button variant="outline" size="lg" className="w-full rounded-2xl bg-transparent" onClick={onSkip}>
                Skip for Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
