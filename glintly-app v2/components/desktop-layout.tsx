"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Sidebar from "./sidebar"

interface DesktopLayoutProps {
  children: React.ReactNode
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const pathname = usePathname()

  // Don't show sidebar on landing, login, signup, or onboarding pages
  const hideSidebar = ["/", "/login", "/signup", "/onboarding", "/profile-creation"].includes(pathname)

  if (hideSidebar) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen w-full bg-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
