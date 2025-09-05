"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, HelpCircle, Shield, LogOut, Moon, Bell, Download } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MorePage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("glintly_profile_completed")
    localStorage.removeItem("glintly_username")
    localStorage.removeItem("glintly_bio")
    localStorage.removeItem("glintly_interests")
    localStorage.removeItem("userProfile")
    router.push("/")
  }

  const menuItems = [
    { icon: Settings, label: "Settings", action: () => {} },
    { icon: Bell, label: "Notification Settings", action: () => {} },
    { icon: Moon, label: "Dark Mode", action: () => {} },
    { icon: Download, label: "Download App", action: () => {} },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
    { icon: Shield, label: "Privacy Policy", action: () => {} },
    { icon: LogOut, label: "Log Out", action: handleLogout, danger: true },
  ]

  return (
    <div className="flex-1 bg-black text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">More</h1>

        <div className="space-y-3 max-w-md">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <CardContent className="p-0">
                    <Button
                      variant="ghost"
                      onClick={item.action}
                      className={`w-full justify-start p-4 h-auto text-left ${
                        item.danger
                          ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          : "text-white hover:bg-gray-800/50"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span className="text-base">{item.label}</span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
