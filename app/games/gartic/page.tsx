"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Palette, MessageSquare, Home, Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"
import { updatePlayerStats } from "@/lib/storage"
import { getRandomWord, calculateScore } from "@/lib/game-utils"

type GamePhase = "waiting" | "drawing" | "guessing" | "results"

interface Round {
  word: string
  drawing: string
  guess: string
  score: number
}

export default function GarticGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<GamePhase>("waiting")
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds] = useState(3)
  const [rounds, setRounds] = useState<Round[]>([])
  const [currentWord, setCurrentWord] = useState("")
  const [guess, setGuess] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)
  const [isDrawing, setIsDrawing] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [brushSize, setBrushSize] = useState(3)
  const [brushColor, setBrushColor] = useState("#000000")

  useEffect(() => {
    let timer: NodeJS.Timeout
    if ((phase === "drawing" || phase === "guessing") && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0) {
      if (phase === "drawing") {
        startGuessingPhase()
      } else if (phase === "guessing") {
        finishRound()
      }
    }
    return () => clearTimeout(timer)
  }, [timeLeft, phase])

  const startGame = () => {
    setCurrentRound(1)
    setRounds([])
    setTotalScore(0)
    startDrawingPhase()
  }

  const startDrawingPhase = () => {
    const word = getRandomWord()
    setCurrentWord(word)
    setPhase("drawing")
    setTimeLeft(30)
    clearCanvas()
  }

  const startGuessingPhase = () => {
    setPhase("guessing")
    setTimeLeft(20)
    setGuess("")
  }

  const finishRound = () => {
    const canvas = canvasRef.current
    const drawing = canvas ? canvas.toDataURL() : ""

    // Calculate score based on guess accuracy and time
    const isCorrect = guess.toLowerCase().trim() === currentWord.toLowerCase()
    const roundScore = isCorrect ? calculateScore(timeLeft, 20, 100) : 0

    const newRound: Round = {
      word: currentWord,
      drawing,
      guess: guess || "No guess",
      score: roundScore,
    }

    const updatedRounds = [...rounds, newRound]
    setRounds(updatedRounds)
    setTotalScore((prev) => prev + roundScore)

    if (currentRound < totalRounds) {
      setCurrentRound((prev) => prev + 1)
      setTimeout(() => startDrawingPhase(), 2000)
    } else {
      setPhase("results")
      updatePlayerStats(totalScore + roundScore)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== "drawing") return
    setIsDrawing(true)
    draw(e)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || phase !== "drawing") return

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

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
        }
      }
    }
  }

  const submitGuess = () => {
    if (guess.trim()) {
      finishRound()
    }
  }

  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Draw & Guess Chain</h1>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        {/* Game Status */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-blue-600">
                {currentRound}/{totalRounds}
              </div>
              <div className="text-sm text-gray-600">Round</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-orange-600">{timeLeft}s</div>
              <div className="text-sm text-gray-600">Time Left</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-green-600">{totalScore}</div>
              <div className="text-sm text-gray-600">Total Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Badge variant={phase === "drawing" ? "default" : phase === "guessing" ? "secondary" : "outline"}>
                {phase === "drawing" && <Palette className="h-3 w-3 mr-1" />}
                {phase === "guessing" && <MessageSquare className="h-3 w-3 mr-1" />}
                {phase.charAt(0).toUpperCase() + phase.slice(1)}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Waiting Phase */}
        {phase === "waiting" && (
          <Card className="text-center">
            <CardContent className="p-8">
              <Users className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Draw & Guess Chain</h2>
              <p className="text-gray-600 mb-6">
                Draw the word, then guess what you drew! Complete {totalRounds} rounds to get the highest score.
              </p>
              <Button onClick={startGame} size="lg">
                Start Game
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Drawing Phase */}
        {phase === "drawing" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Draw: <span className="text-green-600">{currentWord}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Drawing Tools */}
                <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Brush:</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm">{brushSize}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Colors:</label>
                    <div className="flex gap-1">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className={`w-6 h-6 rounded border-2 ${
                            brushColor === color ? "border-gray-800" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setBrushColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="w-full cursor-crosshair bg-white"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Guessing Phase */}
        {phase === "guessing" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">What did you draw?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-4">
                  <canvas ref={canvasRef} width={600} height={400} className="w-full bg-white" />
                </div>
                <div className="flex gap-2">
                  <Input
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Enter your guess..."
                    onKeyPress={(e) => e.key === "Enter" && submitGuess()}
                    className="flex-1"
                  />
                  <Button onClick={submitGuess} disabled={!guess.trim()}>
                    Submit Guess
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Phase */}
        {phase === "results" && (
          <div className="space-y-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Total Score: {totalScore} points
                </Badge>
              </CardContent>
            </Card>

            {/* Round Results */}
            <div className="grid gap-4">
              {rounds.map((round, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Round {index + 1}</span>
                      <Badge variant={round.score > 0 ? "default" : "secondary"}>+{round.score} pts</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 items-center">
                      <div className="text-center">
                        <div className="font-medium text-blue-600">Word</div>
                        <div>{round.word}</div>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">Your Guess</div>
                        <div
                          className={
                            round.guess.toLowerCase() === round.word.toLowerCase()
                              ? "text-green-600 font-bold"
                              : "text-red-600"
                          }
                        >
                          {round.guess}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={startGame} size="lg">
                Play Again
              </Button>
              <Link href="/">
                <Button variant="outline" size="lg">
                  Back to Hub
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
