"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { getPlayerStats } from "@/lib/storage"
import { playSound } from "@/lib/sound"
import { Home, Gamepad2, Trophy, Calendar, Settings, LogOut, X, Palette, Users, Brain } from "lucide-react"

interface SidebarNavProps {
  onClose?: () => void
}

export function SidebarNav({ onClose }: SidebarNavProps) {
  const pathname = usePathname()
  const [playerStats, setPlayerStats] = useState({
    playerName: "Player",
    totalScore: 0,
    level: 1,
    achievements: [],
  })

  useEffect(() => {
    const stats = getPlayerStats()
    setPlayerStats(stats)
  }, [])

  const navItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Games",
      href: "#",
      icon: Gamepad2,
      children: [
        {
          title: "Quick Draw",
          href: "/games/drawing",
          icon: Palette,
          color: "text-blue-500",
        },
        {
          title: "Draw & Guess Chain",
          href: "/games/gartic",
          icon: Users,
          color: "text-green-500",
        },
        {
          title: "Memory Match",
          href: "/games/memory",
          icon: Brain,
          color: "text-purple-500",
        },
      ],
    },
    {
      title: "Leaderboard",
      href: "/leaderboard",
      icon: Trophy,
    },
    {
      title: "Daily Challenges",
      href: "/daily-challenge",
      icon: Calendar,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const handleNavClick = (item: any) => {
    playSound("click")
    if (item.children) {
      setOpenSubmenu(openSubmenu === item.title ? null : item.title)
    } else {
      onClose?.()
    }
  }

  // Calculate XP progress
  const xpProgress = playerStats.totalScore % 100
  const nextLevelXP = 100 - xpProgress

  return (
    <div className="flex flex-col h-full">
      {/* Mobile close button */}
      <div className="md:hidden flex justify-end p-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Logo and title */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 w-8 h-8 rounded-lg flex items-center justify-center">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">Game Hub</h1>
        </div>
      </div>

      {/* User profile */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/diverse-avatars.png" alt={playerStats.playerName} />
            <AvatarFallback className="bg-primary-100 text-primary-800">
              {playerStats.playerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{playerStats.playerName}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Level {playerStats.level}</span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span>XP Progress</span>
            <span>{xpProgress}/100</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {nextLevelXP} XP to level {playerStats.level + 1}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <div>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start", openSubmenu === item.title && "bg-accent/50")}
                    onClick={() => handleNavClick(item)}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.title}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={cn(
                        "h-4 w-4 ml-auto transition-transform",
                        openSubmenu === item.title && "transform rotate-180",
                      )}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </Button>
                  {openSubmenu === item.title && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1 ml-4 space-y-1"
                    >
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <Link
                            href={child.href}
                            className={cn(
                              "flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent/50 transition-colors",
                              pathname === child.href && "bg-accent/50 font-medium",
                              child.color,
                            )}
                            onClick={() => {
                              playSound("click")
                              onClose?.()
                            }}
                          >
                            <child.icon className="h-4 w-4 mr-2" />
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md hover:bg-accent/50 transition-colors",
                    pathname === item.href && "bg-accent/50 font-medium",
                  )}
                  onClick={() => handleNavClick(item)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t mt-auto">
        <Button variant="outline" className="w-full bg-transparent" onClick={() => playSound("click")}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
