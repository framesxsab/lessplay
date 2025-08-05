"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, RotateCcw, Trophy, Timer, ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { updatePlayerStats } from "@/lib/storage"
import { getRandomWord, calculateScore } from "@/lib/game-utils"
import { playSound } from "@/lib/sound"
import { gameConfig } from "@/lib/theme-config"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"

export default function DrawingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentWord, setCurrentWord] = useState("")
  const [timeLeft, setTimeLeft] = useState(gameConfig.drawing.timeLimit)
  const [gameActive, setGameActive] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [brushSize, setBrushSize] = useState(3)
  const [brushColor, setBrushColor] = useState("#000000")
  const [category, setCategory] = useState("animals")
  const [difficulty, setDifficulty] = useState("medium")
  const [showSettings, setShowSettings] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)

      // Play tick sound when time is running low
      if (timeLeft <= 10) {
        playSound("countdown")
      }
    } else if (timeLeft === 0 && gameActive) {
      endGame()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, gameActive])

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout
    if (countdown > 0) {
      countdownTimer = setTimeout(() => setCountdown(countdown - 1), 1000)
      playSound("countdown")
    } else if (countdown === 0 && !gameActive && !gameOver && currentWord) {
      setGameActive(true)
      playSound("success")
    }
    return () => clearTimeout(countdownTimer)
  }, [countdown, gameActive, gameOver, currentWord])

  const startGame = () => {
    setShowSettings(false)
    setCurrentWord(getRandomWord(category, difficulty))
    setTimeLeft(gameConfig.drawing.timeLimit)
    setGameActive(false)
    setGameOver(false)
    setScore(0)
    clearCanvas()
    setDrawingHistory([])
    setHistoryIndex(-1)
    setCountdown(3)
  }

  const endGame = () => {
    setGameActive(false)
    setGameOver(true)
    const finalScore = calculateScore(
      timeLeft,
      gameConfig.drawing.timeLimit,
      gameConfig.drawing.basePoints,
      getDifficultyMultiplier(),
    )
    setScore(finalScore)
    updatePlayerStats(finalScore, "drawing")
    playSound("success")

    // Trigger confetti for a good score
    if (finalScore > gameConfig.drawing.basePoints / 2) {
      triggerConfetti()
    }
  }

  const getDifficultyMultiplier = () => {
    switch (difficulty) {
      case "easy":
        return 0.8
      case "hard":
        return 1.5
      default:
        return 1
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Save initial state to history
        saveToHistory()
      }
    }
  }

  const saveToHistory = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Get current canvas state
        const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // Remove any states after current index
        const newHistory = drawingHistory.slice(0, historyIndex + 1)

        // Add current state to history
        setDrawingHistory([...newHistory, currentState])
        setHistoryIndex(newHistory.length)
      }
    }
  }

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          const newIndex = historyIndex - 1
          ctx.putImageData(drawingHistory[newIndex], 0, 0)
          setHistoryIndex(newIndex)
          playSound("click")
        }
      }
    }
  }

  const redo = () => {
    if (historyIndex < drawingHistory.length - 1) {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          const newIndex = historyIndex + 1
          ctx.putImageData(drawingHistory[newIndex], 0, 0)
          setHistoryIndex(newIndex)
          playSound("click")
        }
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!gameActive) return
    setIsDrawing(true)
    draw(e)
    playSound("draw")
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !gameActive) return

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        let x, y

        if ("touches" in e) {
          // Touch event
          x = e.touches[0].clientX - rect.left
          y = e.touches[0].clientY - rect.top
        } else {
          // Mouse event
          x = e.clientX - rect.left
          y = e.clientY - rect.top
        }

        ctx.lineWidth = brushSize
        ctx.lineCap = "round"
        ctx.strokeStyle = brushColor
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y)
      }
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.beginPath()
          saveToHistory()
        }
      }
    }
  }

  const downloadDrawing = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `drawing-${currentWord}.png`
      link.href = dataURL
      link.click()
      playSound("click")
    }
  }

  const shareDrawing = async () => {
    const canvas = canvasRef.current
    if (canvas && navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `drawing-${currentWord}.png`, { type: "image/png" })
            await navigator.share({
              title: `My drawing of ${currentWord}`,
              text: `Check out my drawing of ${currentWord} from Game Hub!`,
              files: [file],
            })
          }
        })
        playSound("click")
      } catch (error) {
        console.error("Error sharing:", error)
      }
    }
  }

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#A52A2A",
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Quick Draw</h1>
            <p className="text-sm text-muted-foreground">Draw the word before time runs out!</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Game Settings */}
      <AnimatePresence>
        {showSettings && !gameActive && !gameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Game Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Word Category</label>
                  <Tabs defaultValue={category} onValueChange={setCategory} className="w-full">
                    <TabsList className="grid grid-cols-5 w-full">
                      {gameConfig.drawing.wordCategories.map((cat) => (
                        <TabsTrigger key={cat} value={cat} onClick={() => playSound("click")}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Tabs defaultValue={difficulty} onValueChange={setDifficulty} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full">
                      {gameConfig.drawing.difficultyLevels.map((diff) => (
                        <TabsTrigger key={diff} value={diff} onClick={() => playSound("click")}>
                          {diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <div className="pt-4">
                  <Button className="w-full" size="lg" onClick={startGame}>
                    Start Drawing!
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown */}
      <AnimatePresence>
        {countdown > 0 && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            key={countdown}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-7xl font-bold text-white"
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Info */}
      {(gameActive || gameOver) && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Timer className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <div
                className={cn(
                  "text-2xl font-bold",
                  timeLeft <= 10 && gameActive ? "text-red-600 animate-pulse" : "text-blue-600",
                )}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-green-500" />
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {currentWord && (gameActive || gameOver) ? (
                <>
                  <Palette className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                  <div className="text-xl font-bold text-purple-600">{currentWord}</div>
                  <div className="text-sm text-muted-foreground">Draw This!</div>
                </>
              ) : (
                <>
                  <Palette className="h-5 w-5 mx-auto mb-1 text-gray-400" />
                  <div className="text-xl font-bold text-gray-400">???</div>
                  <div className="text-sm text-muted-foreground">Word</div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Drawing Canvas */}
      {(gameActive || gameOver) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Drawing Canvas</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={undo} disabled={!gameActive || historyIndex <= 0}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M9 14 4 9l5-5" />
                    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
                  </svg>
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={!gameActive || historyIndex >= drawingHistory.length - 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="m15 14 5-5-5-5" />
                    <path d="M4 9h10.5a5.5 5.5 0 1 1 0 11H11" />
                  </svg>
                  Redo
                </Button>
                <Button variant="outline" size="sm" onClick={clearCanvas} disabled={!gameActive}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Drawing Tools */}
            <div className="flex flex-wrap gap-4 mb-4 p-4 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Brush Size:</label>
                <Slider
                  min={1}
                  max={20}
                  step={1}
                  value={[brushSize]}
                  onValueChange={(value) => setBrushSize(value[0])}
                  className="w-32"
                  disabled={!gameActive}
                />
                <span className="text-sm w-6">{brushSize}</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Colors:</label>
                <div className="flex flex-wrap gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-transform",
                        brushColor === color
                          ? "border-gray-800 dark:border-gray-200 scale-110"
                          : "border-gray-300 dark:border-gray-700",
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setBrushColor(color)
                        playSound("click")
                      }}
                      disabled={!gameActive}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Controls */}
      <div className="text-center">
        {!gameActive && !gameOver && !showSettings && (
          <Button onClick={startGame} size="lg" className="px-8">
            Start Drawing!
          </Button>
        )}

        {gameActive && (
          <Button onClick={endGame} variant="outline" size="lg">
            Finish Early
          </Button>
        )}

        {gameOver && (
          <div className="space-y-4">
            <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/50">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Game Complete!</h3>
                <p className="text-muted-foreground mb-4">
                  You drew: <strong>{currentWord}</strong>
                </p>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  +{score} points
                </Badge>
              </CardContent>
            </Card>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => setShowSettings(true)} size="lg">
                New Game
              </Button>
              <Button onClick={startGame} variant="secondary" size="lg">
                Play Again
              </Button>
              <Button variant="outline" size="lg" onClick={downloadDrawing}>
                <Download className="h-4 w-4 mr-2" />
                Save Drawing
              </Button>
              {navigator.share && (
                <Button variant="outline" size="lg" onClick={shareDrawing}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
