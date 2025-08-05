// Word lists for drawing games by category
const DRAWING_WORDS = {
  animals: [
    "cat",
    "dog",
    "elephant",
    "giraffe",
    "lion",
    "tiger",
    "zebra",
    "monkey",
    "bear",
    "fox",
    "wolf",
    "rabbit",
    "deer",
    "horse",
    "cow",
    "pig",
    "sheep",
    "goat",
    "chicken",
    "duck",
  ],
  objects: [
    "chair",
    "table",
    "lamp",
    "clock",
    "book",
    "pen",
    "phone",
    "computer",
    "television",
    "cup",
    "bottle",
    "plate",
    "fork",
    "knife",
    "spoon",
    "glasses",
    "hat",
    "shoe",
    "umbrella",
    "key",
  ],
  nature: [
    "tree",
    "flower",
    "mountain",
    "river",
    "ocean",
    "beach",
    "forest",
    "desert",
    "island",
    "sun",
    "moon",
    "star",
    "cloud",
    "rain",
    "snow",
    "wind",
    "rainbow",
    "waterfall",
    "volcano",
    "canyon",
  ],
  food: [
    "apple",
    "banana",
    "orange",
    "grape",
    "strawberry",
    "pizza",
    "burger",
    "sandwich",
    "pasta",
    "rice",
    "bread",
    "cake",
    "cookie",
    "ice cream",
    "chocolate",
    "coffee",
    "tea",
    "milk",
    "juice",
    "water",
  ],
  sports: [
    "soccer",
    "basketball",
    "baseball",
    "tennis",
    "golf",
    "swimming",
    "running",
    "cycling",
    "skiing",
    "skating",
    "volleyball",
    "football",
    "hockey",
    "boxing",
    "wrestling",
    "surfing",
    "skateboarding",
    "climbing",
    "bowling",
    "archery",
  ],
}

// Words for gartic phone game
const GARTIC_WORDS = [
  // Simple concepts
  "happy",
  "sad",
  "angry",
  "surprised",
  "sleepy",
  "hungry",
  "cold",
  "hot",
  "running",
  "jumping",
  "dancing",
  "singing",
  "reading",
  "writing",
  "cooking",
  "swimming",
  "flying",
  "driving",
  "sleeping",
  "eating",

  // Objects and animals
  "dragon",
  "unicorn",
  "mermaid",
  "pirate",
  "ninja",
  "wizard",
  "princess",
  "superhero",
  "alien",
  "ghost",
  "vampire",
  "zombie",
  "fairy",
  "angel",
  "robot",
  "dinosaur",
  "monster",
  "witch",
  "knight",
  "astronaut",

  // Activities and concepts
  "birthday party",
  "camping",
  "swimming",
  "flying",
  "magic trick",
  "treasure hunt",
  "space travel",
  "time machine",
  "invisible",
  "giant",
  "tiny",
  "backwards",
  "upside down",
  "underwater",
  "on fire",
  "frozen",
  "melting",
  "exploding",
]

// Memory game emojis by difficulty
const MEMORY_EMOJIS = {
  easy: ["🌞", "🌈", "🍕", "🚀", "🐶", "⚽"],
  medium: ["🌞", "🌈", "🍕", "🚀", "🐶", "⚽", "🎉", "🎸"],
  hard: ["🌞", "🌈", "🍕", "🚀", "🐶", "⚽", "🎉", "🎸", "🦄", "🍎", "🎯", "🎭"],
}

export function getRandomWord(category = "animals", difficulty = "medium"): string {
  // If category is specified and exists in DRAWING_WORDS, use it
  if (category && DRAWING_WORDS[category as keyof typeof DRAWING_WORDS]) {
    const wordList = DRAWING_WORDS[category as keyof typeof DRAWING_WORDS]
    return wordList[Math.floor(Math.random() * wordList.length)]
  }

  // Otherwise, use gartic words
  return GARTIC_WORDS[Math.floor(Math.random() * GARTIC_WORDS.length)]
}

export function calculateScore(
  timeRemaining: number,
  totalTime: number,
  maxScore: number,
  bonusMultiplier = 1,
): number {
  // Base score calculation
  const timeBonus = Math.floor((timeRemaining / totalTime) * maxScore * 0.5)
  const baseScore = Math.floor(maxScore * 0.5)

  return Math.floor((baseScore + timeBonus) * bonusMultiplier)
}

export function calculateMemoryScore(moves: number, optimalMoves: number, timeElapsed: number, maxTime = 120): number {
  // Efficiency bonus (fewer moves = higher score)
  const moveEfficiency = Math.max(0, (optimalMoves / moves) * 100)

  // Time bonus (faster completion = higher score)
  const timeBonus = Math.max(0, ((maxTime - timeElapsed) / maxTime) * 50)

  return Math.floor(moveEfficiency + timeBonus)
}

export function getDifficultyMultiplier(difficulty: "easy" | "medium" | "hard"): number {
  const multipliers = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  }
  return multipliers[difficulty]
}

export function formatScore(score: number): string {
  if (score >= 1000000) {
    return `${(score / 1000000).toFixed(1)}M`
  }
  if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}k`
  }
  return score.toString()
}

export function getScoreRating(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100

  if (percentage >= 90) return "Perfect!"
  if (percentage >= 80) return "Excellent!"
  if (percentage >= 70) return "Great!"
  if (percentage >= 60) return "Good!"
  if (percentage >= 50) return "Not bad!"
  return "Keep trying!"
}

export function generateAchievementId(): string {
  return `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomColor(): string {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Canvas utilities for drawing games
export function resizeCanvas(canvas: HTMLCanvasElement, container: HTMLElement): void {
  const rect = container.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height
}

export function clearCanvas(canvas: HTMLCanvasElement, fillColor = "white"): void {
  const ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.fillStyle = fillColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}

export function downloadCanvasAsImage(canvas: HTMLCanvasElement, filename = "drawing.png"): void {
  const link = document.createElement("a")
  link.download = filename
  link.href = canvas.toDataURL()
  link.click()
}

export function getMemoryEmojis(difficulty: "easy" | "medium" | "hard"): string[] {
  return MEMORY_EMOJIS[difficulty] || MEMORY_EMOJIS.medium
}

export function calculateLevelFromXP(xp: number, xpPerLevel = 100): number {
  return Math.floor(xp / xpPerLevel) + 1
}

export function calculateXPToNextLevel(xp: number, xpPerLevel = 100): number {
  return xpPerLevel - (xp % xpPerLevel)
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
