"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { getSoundSettings } from "@/lib/sound"

type SoundType = "click" | "success" | "error" | "achievement" | "match" | "flip" | "draw" | "countdown" | "levelUp"

interface SoundControllerProps {
  children: React.ReactNode
}

export function SoundController({ children }: SoundControllerProps) {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    soundVolume: 80,
    musicEnabled: true,
    musicVolume: 60,
  })

  const soundRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    click: null,
    success: null,
    error: null,
    achievement: null,
    match: null,
    flip: null,
    draw: null,
    countdown: null,
    levelUp: null,
  })

  const musicRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Load settings
    const savedSettings = getSoundSettings()
    setSettings(savedSettings)

    // Create audio elements
    soundRefs.current.click = new Audio("/sounds/click.mp3")
    soundRefs.current.success = new Audio("/sounds/success.mp3")
    soundRefs.current.error = new Audio("/sounds/error.mp3")
    soundRefs.current.achievement = new Audio("/sounds/achievement.mp3")
    soundRefs.current.match = new Audio("/sounds/match.mp3")
    soundRefs.current.flip = new Audio("/sounds/flip.mp3")
    soundRefs.current.draw = new Audio("/sounds/draw.mp3")
    soundRefs.current.countdown = new Audio("/sounds/countdown.mp3")
    soundRefs.current.levelUp = new Audio("/sounds/level-up.mp3")

    // Create background music
    musicRef.current = new Audio("/sounds/background-music.mp3")
    if (musicRef.current) {
      musicRef.current.loop = true
      musicRef.current.volume = savedSettings.musicVolume / 100
      if (savedSettings.musicEnabled) {
        // Only start music on user interaction due to browser policies
        const startMusic = () => {
          if (musicRef.current) {
            musicRef.current.play().catch((e) => console.log("Music autoplay prevented:", e))
          }
          document.removeEventListener("click", startMusic)
        }
        document.addEventListener("click", startMusic)
      }
    }

    // Set volumes for all sounds
    Object.values(soundRefs.current).forEach((audio) => {
      if (audio) {
        audio.volume = savedSettings.soundVolume / 100
      }
    })

    // Cleanup
    return () => {
      if (musicRef.current) {
        musicRef.current.pause()
        musicRef.current = null
      }
      Object.keys(soundRefs.current).forEach((key) => {
        const audio = soundRefs.current[key as SoundType]
        if (audio) {
          audio.pause()
          soundRefs.current[key as SoundType] = null
        }
      })
    }
  }, [])

  // Update settings when they change
  useEffect(() => {
    // Update music
    if (musicRef.current) {
      musicRef.current.volume = settings.musicVolume / 100
      if (settings.musicEnabled) {
        musicRef.current.play().catch((e) => console.log("Music play prevented:", e))
      } else {
        musicRef.current.pause()
      }
    }

    // Update sound effects volume
    Object.values(soundRefs.current).forEach((audio) => {
      if (audio) {
        audio.volume = settings.soundVolume / 100
      }
    })
  }, [settings])

  // Function to play sounds
  const playSound = (type: SoundType) => {
    if (!settings.soundEnabled) return

    const sound = soundRefs.current[type]
    if (sound) {
      sound.currentTime = 0
      sound.play().catch((e) => console.log(`Sound play prevented: ${type}`, e))
    }
  }

  // Expose the playSound function to the window object
  useEffect(() => {
    ;(window as any).playGameSound = playSound
  }, [])

  return <>{children}</>
}
