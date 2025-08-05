"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { Menu } from "lucide-react"

interface TopNavProps {
  onMenuClick: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const pathname = usePathname()
  const [pageTitle, setPageTitle] = useState("Game Hub")

  useEffect(() => {
    // Set page title based on pathname
    if (pathname === "/") {
      setPageTitle("Game Hub")
    } else if (pathname === "/games/drawing") {
      setPageTitle("Quick Draw")
    } else if (pathname === "/games/gartic") {
      setPageTitle("Draw & Guess Chain")
    } else if (pathname === "/games/memory") {
      setPageTitle("Memory Match")
    } else if (pathname === "/leaderboard") {
      setPageTitle("Leaderboard")
    } else if (pathname === "/daily-challenge") {
      setPageTitle("Daily Challenges")
    } else if (pathname === "/settings") {
      setPageTitle("Settings")
    } else {
      setPageTitle("Game Hub")
    }
  }, [pathname])

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="mr-4 hidden md:flex">
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
        </div>
        <div className="flex items-center md:hidden">
          <h1 className="text-lg font-semibold">{pageTitle}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <NotificationsDropdown />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
