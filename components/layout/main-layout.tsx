"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { TopNav } from "@/components/layout/top-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SoundController } from "@/components/sound-controller"
import { Toaster } from "@/components/ui/toaster"
import { useMediaQuery } from "@/hooks/use-media-query"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      if (isMobile) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
  }, [isMobile, isMounted])

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  if (!isMounted) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
        <div className="flex flex-col flex-1">
          <div className="h-14 border-b bg-background/95 backdrop-blur" />
          <main className="flex-1 px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto w-full">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <SoundController>
      <div className="flex min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Sidebar for desktop */}
        {sidebarOpen && (
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 bg-white dark:bg-neutral-900 shadow-lg transition-transform duration-300 ease-in-out",
              isMobile ? "w-full" : "w-[280px]",
            )}
          >
            <SidebarNav onClose={() => isMobile && setSidebarOpen(false)} />
          </div>
        )}

        {/* Main content */}
        <div
          className={cn(
            "flex flex-col flex-1 transition-all duration-300 ease-in-out",
            sidebarOpen && !isMobile ? "ml-[280px]" : "ml-0",
          )}
        >
          <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto w-full">
            <nav className="flex space-x-4">
              <a href="/quiz" className="text-blue-500 hover:underline">Quiz Game</a>
            </nav>
            <div className="w-full">{children}</div>
          </main>
        </div>

        {/* Mobile navigation */}
        {isMobile && <MobileNav />}

        {/* Overlay when sidebar is open on mobile */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
        )}

        <Toaster />
      </div>
    </SoundController>
  )
}
