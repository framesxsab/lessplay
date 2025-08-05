interface PlayerStats {
  playerName: string
  totalScore: number
  gamesPlayed: number
  achievements: string[]
  level: number
  bestScores: {
    drawing: number
    gartic: number
    memory: number
  }
}

const DEFAULT_STATS: PlayerStats = {
  playerName: "Player",
  totalScore: 0,
  gamesPlayed: 0,
  achievements: [],
  level: 1,
  bestScores: {
    drawing: 0,
    gartic: 0,
    memory: 0,
  },
}

export function getPlayerStats(): PlayerStats {
  if (typeof window === "undefined") return DEFAULT_STATS

  try {
    const stored = localStorage.getItem("gameHubStats")
    if (stored) {
      return { ...DEFAULT_STATS, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error("Error loading player stats:", error)
  }

  return DEFAULT_STATS
}

export function updatePlayerStats(scoreToAdd: number, gameType?: "drawing" | "gartic" | "memory"): PlayerStats {
  if (typeof window === "undefined") return DEFAULT_STATS

  const currentStats = getPlayerStats()

  const newStats: PlayerStats = {
    ...currentStats,
    totalScore: currentStats.totalScore + scoreToAdd,
    gamesPlayed: currentStats.gamesPlayed + 1,
    level: Math.floor((currentStats.totalScore + scoreToAdd) / 100) + 1,
  }

  // Update best scores
  if (gameType && scoreToAdd > currentStats.bestScores[gameType]) {
    newStats.bestScores[gameType] = scoreToAdd
  }

  // Check for new achievements
  const newAchievements = [...currentStats.achievements]

  if (newStats.gamesPlayed >= 1 && !newAchievements.includes("First Steps")) {
    newAchievements.push("First Steps")
    playAchievementSound()
  }

  if (newStats.totalScore >= 100 && !newAchievements.includes("Score Hunter")) {
    newAchievements.push("Score Hunter")
    playAchievementSound()
  }

  if (newStats.gamesPlayed >= 3 && !newAchievements.includes("Game Master")) {
    newAchievements.push("Game Master")
    playAchievementSound()
  }

  if (newStats.totalScore >= 500 && !newAchievements.includes("High Scorer")) {
    newAchievements.push("High Scorer")
    playAchievementSound()
  }

  newStats.achievements = newAchievements

  try {
    localStorage.setItem("gameHubStats", JSON.stringify(newStats))

    // Update leaderboard
    updateLeaderboard(newStats)
  } catch (error) {
    console.error("Error saving player stats:", error)
  }

  return newStats
}

function playAchievementSound() {
  if (typeof window !== "undefined" && (window as any).playGameSound) {
    ;(window as any).playGameSound("achievement")
  }
}

function updateLeaderboard(stats: PlayerStats) {
  if (typeof window === "undefined") return

  try {
    // Import dynamically to avoid circular dependencies
    import("./leaderboard").then(({ updateLeaderboard }) => {
      updateLeaderboard({
        playerName: stats.playerName,
        totalScore: stats.totalScore,
        level: stats.level,
        bestScores: stats.bestScores,
      })
    })
  } catch (error) {
    console.error("Error updating leaderboard:", error)
  }
}

export function resetPlayerStats(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("gameHubStats")
  } catch (error) {
    console.error("Error resetting player stats:", error)
  }
}

export function exportPlayerData(): string {
  const stats = getPlayerStats()
  return JSON.stringify(stats, null, 2)
}

export function importPlayerData(data: string): boolean {
  if (typeof window === "undefined") return false

  try {
    const parsedData = JSON.parse(data)
    localStorage.setItem("gameHubStats", JSON.stringify(parsedData))
    return true
  } catch (error) {
    console.error("Error importing player data:", error)
    return false
  }
}
