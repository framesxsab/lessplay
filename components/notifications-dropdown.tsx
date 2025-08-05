"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { playSound } from "@/lib/sound"
import { Bell, Trophy, Calendar, Star, Check } from "lucide-react"
import { getDailyChallenge } from "@/lib/challenges"
import { motion, AnimatePresence } from "framer-motion"

interface Notification {
  id: string
  title: string
  message: string
  type: "achievement" | "challenge" | "system"
  icon: React.ElementType
  read: boolean
  date: string
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Generate some sample notifications
    const dailyChallenges = getDailyChallenge()
    const completedChallenges = dailyChallenges.filter((c: any) => c.completed).length
    const totalChallenges = dailyChallenges.length

    const sampleNotifications: Notification[] = [
      {
        id: "1",
        title: "Daily Challenges",
        message: `You've completed ${completedChallenges}/${totalChallenges} challenges today.`,
        type: "challenge",
        icon: Calendar,
        read: false,
        date: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Achievement Unlocked",
        message: "You've unlocked the 'First Steps' achievement!",
        type: "achievement",
        icon: Trophy,
        read: false,
        date: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "3",
        title: "New High Score",
        message: "You've set a new high score in Memory Match!",
        type: "system",
        icon: Star,
        read: true,
        date: new Date(Date.now() - 86400000).toISOString(),
      },
    ]

    setNotifications(sampleNotifications)
    setUnreadCount(sampleNotifications.filter((n) => !n.read).length)
  }, [])

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      playSound("click")
    }
  }

  const markAllAsRead = () => {
    playSound("click")
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else {
      return `${diffDays}d ago`
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                {unreadCount}
              </motion.div>
            )}
          </AnimatePresence>
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
              <Check className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const Icon = notification.icon
              return (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                  <div className="flex w-full">
                    <div className={`mr-3 p-2 rounded-full ${getIconBackground(notification.type)}`}>
                      <Icon className={`h-4 w-4 ${getIconColor(notification.type)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className={`font-medium ${notification.read ? "" : "text-primary"}`}>{notification.title}</p>
                        <span className="text-xs text-muted-foreground ml-2">{formatDate(notification.date)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getIconBackground(type: string) {
  switch (type) {
    case "achievement":
      return "bg-yellow-100 dark:bg-yellow-900/30"
    case "challenge":
      return "bg-blue-100 dark:bg-blue-900/30"
    case "system":
      return "bg-green-100 dark:bg-green-900/30"
    default:
      return "bg-gray-100 dark:bg-gray-800"
  }
}

function getIconColor(type: string) {
  switch (type) {
    case "achievement":
      return "text-yellow-600 dark:text-yellow-400"
    case "challenge":
      return "text-blue-600 dark:text-blue-400"
    case "system":
      return "text-green-600 dark:text-green-400"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}
