"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sound"
import { Home, Gamepad2, Trophy, Calendar, Settings } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Games",
      href: "/games",
      icon: Gamepad2,
    },
    {
      title: "Leaderboard",
      href: "/leaderboard",
      icon: Trophy,
    },
    {
      title: "Challenges",
      href: "/daily-challenge",
      icon: Calendar,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  const handleNavClick = () => {
    playSound("click")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <nav className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/games" && pathname.startsWith("/games/"))
          return (
            <Link
              key={item.title}
              href={item.href === "/games" ? "/" : item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 text-xs",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
              onClick={handleNavClick}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
