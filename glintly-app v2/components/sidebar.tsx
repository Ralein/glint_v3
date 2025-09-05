"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, Search, Compass, Play, Bell, User, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { name: "Home", icon: Home, path: "/feed", label: "Home" },
    { name: "Search", icon: Search, path: "/search", label: "Search" },
    { name: "Explore", icon: Compass, path: "/explore", label: "Explore" },
    { name: "Reels", icon: Play, path: "/reels", label: "Reels" },
    { name: "Notifications", icon: Bell, path: "/notifications", label: "Notifications" },
    { name: "Profile", icon: User, path: "/profile", label: "Profile" },
    { name: "More", icon: MoreHorizontal, path: "/more", label: "More" },
  ]

  const isActive = (path: string) => {
    if (path === "/feed" && pathname === "/") return true
    return pathname === path
  }

  return (
    <div
      className={`w-20 lg:w-64 h-screen bg-black border-r border-gray-800 flex flex-col py-6 px-2 lg:px-4 ${className}`}
    >
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-white font-bold text-xl lg:text-2xl text-center lg:text-left">
          <span className="lg:hidden">G</span>
          <span className="hidden lg:inline">Glintly</span>
        </h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <motion.button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-4 mb-2 p-3 rounded-xl w-full text-left transition-colors
                ${active ? "bg-white text-black font-semibold" : "text-white hover:bg-gray-900"}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              <span className="hidden lg:inline text-base">{item.label}</span>
            </motion.button>
          )
        })}
      </nav>
    </div>
  )
}
