export interface DailyChallenge {
  id: string
  title: string
  description: string
  type: string
  points: number
  gameLink: string
  completed: boolean
}

// Generate a deterministic set of challenges based on the current date
export function getDailyChallenge(): DailyChallenge[] {
  if (typeof window === "undefined") return []

  try {
    // Check if we already have today's challenges
    const today = new Date().toISOString().split("T")[0]
    const storedDate = localStorage.getItem("lastChallengeDate")
    const storedChallenges = localStorage.getItem("dailyChallenges")

    // If we have challenges from today, return them
    if (storedDate === today && storedChallenges) {
      return JSON.parse(storedChallenges)
    }

    // Otherwise, generate new challenges
    const challenges = generateDailyChallenges()

    // Store them
    localStorage.setItem("lastChallengeDate", today)
    localStorage.setItem("dailyChallenges", JSON.stringify(challenges))

    return challenges
  } catch (error) {
    console.error("Error getting daily challenges:", error)
    return []
  }
}

function generateDailyChallenges(): DailyChallenge[] {
  // Use the current date to seed the challenges
  const today = new Date()
  let seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

  // Pseudo-random number generator with seed
  const random = () => {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }

  // Challenge templates
  const drawingChallenges = [
    {
      title: "Speed Artist",
      description: "Complete a drawing in under 30 seconds",
      points: 50,
    },
    {
      title: "Precision Drawing",
      description: "Draw with at least 80% accuracy",
      points: 75,
    },
    {
      title: "Color Master",
      description: "Use at least 5 different colors in your drawing",
      points: 40,
    },
  ]

  const garticChallenges = [
    {
      title: "Chain Reaction",
      description: "Complete a full chain with 100% accuracy",
      points: 80,
    },
    {
      title: "Quick Guesser",
      description: "Guess correctly with at least 10 seconds remaining",
      points: 60,
    },
    {
      title: "Perfect Match",
      description: "Match your drawing exactly to the word",
      points: 70,
    },
  ]

  const memoryChallenges = [
    {
      title: "Memory Master",
      description: "Complete the memory game with fewer than 20 moves",
      points: 90,
    },
    {
      title: "Speed Matcher",
      description: "Complete the memory game in under 60 seconds",
      points: 85,
    },
    {
      title: "Hard Mode Hero",
      description: "Complete the hard difficulty memory game",
      points: 100,
    },
  ]

  // Select one challenge from each category
  const drawingIndex = Math.floor(random() * drawingChallenges.length)
  const garticIndex = Math.floor(random() * garticChallenges.length)
  const memoryIndex = Math.floor(random() * memoryChallenges.length)

  return [
    {
      id: `drawing-${today.toISOString().split("T")[0]}-${drawingIndex}`,
      ...drawingChallenges[drawingIndex],
      type: "drawing",
      gameLink: "/games/drawing",
      completed: false,
    },
    {
      id: `gartic-${today.toISOString().split("T")[0]}-${garticIndex}`,
      ...garticChallenges[garticIndex],
      type: "gartic",
      gameLink: "/games/gartic",
      completed: false,
    },
    {
      id: `memory-${today.toISOString().split("T")[0]}-${memoryIndex}`,
      ...memoryChallenges[memoryIndex],
      type: "memory",
      gameLink: "/games/memory",
      completed: false,
    },
  ]
}

export function completeDailyChallenge(challengeId: string): boolean {
  if (typeof window === "undefined") return false

  try {
    const challenges = getDailyChallenge()
    const updatedChallenges = challenges.map((challenge) =>
      challenge.id === challengeId ? { ...challenge, completed: true } : challenge,
    )

    localStorage.setItem("dailyChallenges", JSON.stringify(updatedChallenges))

    // Check if all challenges are completed
    const allCompleted = updatedChallenges.every((challenge) => challenge.completed)
    if (allCompleted) {
      // Update streak
      const currentStreak = Number.parseInt(localStorage.getItem("challengeStreak") || "0")
      localStorage.setItem("challengeStreak", (currentStreak + 1).toString())

      // Store last completion date
      localStorage.setItem("lastChallengeCompletionDate", new Date().toISOString().split("T")[0])
    }

    return true
  } catch (error) {
    console.error("Error completing challenge:", error)
    return false
  }
}

export function resetDailyChallenges(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("dailyChallenges")
    localStorage.removeItem("lastChallengeDate")
  } catch (error) {
    console.error("Error resetting challenges:", error)
  }
}

export function getStreakDays(): number {
  if (typeof window === "undefined") return 0

  try {
    return Number.parseInt(localStorage.getItem("challengeStreak") || "0")
  } catch (error) {
    console.error("Error getting streak days:", error)
    return 0
  }
}

// Check if streak should be reset (if a day was missed)
export function checkAndUpdateStreak(): void {
  if (typeof window === "undefined") return

  try {
    const today = new Date().toISOString().split("T")[0]
    const lastCompletionDate = localStorage.getItem("lastChallengeCompletionDate")

    if (!lastCompletionDate) return

    // Calculate days between last completion and today
    const lastDate = new Date(lastCompletionDate)
    const currentDate = new Date(today)
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // If more than 1 day has passed, reset streak
    if (diffDays > 1) {
      localStorage.setItem("challengeStreak", "0")
    }
  } catch (error) {
    console.error("Error checking streak:", error)
  }
}
