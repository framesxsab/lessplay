export interface LeaderboardEntry {
  playerName: string
  totalScore: number
  level: number
  bestScores: {
    drawing: number
    gartic: number
    memory: number
  }
  lastUpdated: string
}

// Sample leaderboard data
const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  {
    playerName: "GameMaster",
    totalScore: 1250,
    level: 13,
    bestScores: {
      drawing: 120,
      gartic: 180,
      memory: 150,
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    playerName: "ArtistPro",
    totalScore: 980,
    level: 10,
    bestScores: {
      drawing: 200,
      gartic: 150,
      memory: 80,
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    playerName: "MemoryKing",
    totalScore: 850,
    level: 9,
    bestScores: {
      drawing: 70,
      gartic: 90,
      memory: 220,
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    playerName: "DrawMaster",
    totalScore: 720,
    level: 8,
    bestScores: {
      drawing: 180,
      gartic: 60,
      memory: 100,
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    playerName: "GuessPro",
    totalScore: 650,
    level: 7,
    bestScores: {
      drawing: 50,
      gartic: 190,
      memory: 70,
    },
    lastUpdated: new Date().toISOString(),
  },
]

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return SAMPLE_LEADERBOARD

  try {
    // Get from localStorage
    const stored = localStorage.getItem("gameHubLeaderboard")
    if (stored) {
      const leaderboard = JSON.parse(stored)

      // Get player stats and add to leaderboard if not present
      const playerStats = JSON.parse(localStorage.getItem("gameHubStats") || "{}")
      if (playerStats.playerName) {
        const playerEntry = leaderboard.find((entry: LeaderboardEntry) => entry.playerName === playerStats.playerName)

        if (!playerEntry) {
          // Add player to leaderboard
          leaderboard.push({
            playerName: playerStats.playerName || "Player",
            totalScore: playerStats.totalScore || 0,
            level: playerStats.level || 1,
            bestScores: playerStats.bestScores || { drawing: 0, gartic: 0, memory: 0 },
            lastUpdated: new Date().toISOString(),
          })
        } else {
          // Update player entry
          playerEntry.totalScore = playerStats.totalScore || playerEntry.totalScore
          playerEntry.level = playerStats.level || playerEntry.level
          playerEntry.bestScores = playerStats.bestScores || playerEntry.bestScores
          playerEntry.lastUpdated = new Date().toISOString()
        }

        // Save updated leaderboard
        localStorage.setItem("gameHubLeaderboard", JSON.stringify(leaderboard))
      }

      return leaderboard
    }

    // If no leaderboard exists, create one with sample data and player
    const playerStats = JSON.parse(localStorage.getItem("gameHubStats") || "{}")
    const leaderboard = [...SAMPLE_LEADERBOARD]

    if (playerStats.playerName) {
      leaderboard.push({
        playerName: playerStats.playerName || "Player",
        totalScore: playerStats.totalScore || 0,
        level: playerStats.level || 1,
        bestScores: playerStats.bestScores || { drawing: 0, gartic: 0, memory: 0 },
        lastUpdated: new Date().toISOString(),
      })
    }

    localStorage.setItem("gameHubLeaderboard", JSON.stringify(leaderboard))
    return leaderboard
  } catch (error) {
    console.error("Error loading leaderboard:", error)
    return SAMPLE_LEADERBOARD
  }
}

export function updateLeaderboard(playerEntry: Partial<LeaderboardEntry>): void {
  if (typeof window === "undefined") return

  try {
    const leaderboard = getLeaderboard()
    const playerName = playerEntry.playerName || "Player"

    const existingEntry = leaderboard.find((entry) => entry.playerName === playerName)

    if (existingEntry) {
      // Update existing entry
      Object.assign(existingEntry, {
        ...playerEntry,
        lastUpdated: new Date().toISOString(),
      })
    } else {
      // Add new entry
      leaderboard.push({
        playerName,
        totalScore: playerEntry.totalScore || 0,
        level: playerEntry.level || 1,
        bestScores: playerEntry.bestScores || { drawing: 0, gartic: 0, memory: 0 },
        lastUpdated: new Date().toISOString(),
      })
    }

    // Sort by total score
    leaderboard.sort((a, b) => b.totalScore - a.totalScore)

    // Save to localStorage
    localStorage.setItem("gameHubLeaderboard", JSON.stringify(leaderboard))
  } catch (error) {
    console.error("Error updating leaderboard:", error)
  }
}

export function getPlayerRank(playerName: string): number | null {
  if (typeof window === "undefined") return null

  try {
    const leaderboard = getLeaderboard()
    const playerIndex = leaderboard.findIndex((entry) => entry.playerName === playerName)

    return playerIndex !== -1 ? playerIndex + 1 : null
  } catch (error) {
    console.error("Error getting player rank:", error)
    return null
  }
}

export function clearLeaderboard(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("gameHubLeaderboard")
  } catch (error) {
    console.error("Error clearing leaderboard:", error)
  }
}
