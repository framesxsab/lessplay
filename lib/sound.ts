interface SoundSettings {
  soundEnabled: boolean
  soundVolume: number
  musicEnabled: boolean
  musicVolume: number
}

const DEFAULT_SETTINGS: SoundSettings = {
  soundEnabled: true,
  soundVolume: 80,
  musicEnabled: true,
  musicVolume: 60,
}

export function getSoundSettings(): SoundSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS

  try {
    const stored = localStorage.getItem("gameHubSoundSettings")
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error("Error loading sound settings:", error)
  }

  return DEFAULT_SETTINGS
}

export function updateSoundSettings(settings: Partial<SoundSettings>): SoundSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS

  const currentSettings = getSoundSettings()
  const newSettings = { ...currentSettings, ...settings }

  try {
    localStorage.setItem("gameHubSoundSettings", JSON.stringify(newSettings))
  } catch (error) {
    console.error("Error saving sound settings:", error)
  }

  // If window.playGameSound exists, play a test sound
  if (settings.soundEnabled && (window as any).playGameSound) {
    ;(window as any).playGameSound("click")
  }

  return newSettings
}

export function playSound(type: string): void {
  if (typeof window === "undefined") return

  const settings = getSoundSettings()
  if (!settings.soundEnabled) return

  // Use the global function if available
  if ((window as any).playGameSound) {
    ;(window as any).playGameSound(type)
  }
}
