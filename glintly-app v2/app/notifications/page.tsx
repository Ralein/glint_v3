"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Heart, MessageCircle, UserPlus, Trophy } from "lucide-react"

interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "achievement"
  title: string
  message: string
  timestamp: string
  read: boolean
  avatar?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "achievement",
        title: "New Achievement Unlocked!",
        message: "You've earned the 'Streak Master' badge for maintaining a 10-day learning streak.",
        timestamp: "2 hours ago",
        read: false,
      },
      {
        id: "2",
        type: "like",
        title: "Video Liked",
        message: "Someone liked your saved video 'React Hooks Explained'",
        timestamp: "4 hours ago",
        read: false,
      },
      {
        id: "3",
        type: "follow",
        title: "New Follower",
        message: "CodeMaster started following you",
        timestamp: "1 day ago",
        read: true,
      },
    ]

    setNotifications(mockNotifications)
    setLoading(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />
      case "comment":
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case "follow":
        return <UserPlus className="h-5 w-5 text-green-500" />
      case "achievement":
        return <Trophy className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex-1 bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-black text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>

        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                  !notification.read ? "ring-1 ring-primary/30" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{notification.title}</h3>
                        {!notification.read && (
                          <Badge variant="default" className="bg-primary/20 text-primary text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                      <p className="text-gray-500 text-xs">{notification.timestamp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
