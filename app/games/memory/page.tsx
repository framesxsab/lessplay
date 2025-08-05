"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, RotateCcw, Home, Trophy, Timer, Target } from "lucide-react"
import Link from "next/link"
import { updatePlayerStats } from "@/lib/storage"
import { calculateScore } from "@/lib/game-utils"

interface MemoryCard {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")

  const emojis = {
    easy: ["🌞", "🌈", "🍕", "🚀", "🐶", "⚽"],
    medium: ["🌞", "🌈", "🍕", "🚀", "🐶", "⚽", "🎉", "🎸"],
    hard: ["🌞", "🌈", "🍕", "🚀", "🐶", "⚽", "🎉", "🎸", "🦄", "🍎", "🎯", "🎭"],
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameActive && !gameComplete) {
      timer = setTimeout(() => setTimeElapsed((prev) => prev + 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [timeElapsed, gameActive, gameComplete])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      if (first.emoji === second.emoji) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first.id || card.id === second.id ? { ...card, isMatched: true, isFlipped: true } : card,
            ),
          )
          setMatchedPairs((prev) => prev + 1)
          setFlippedCards([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) => (card.id === first.id || card.id === second.id ? { ...card, isFlipped: false } : card)),
          )
          setFlippedCards([])
        }, 1000)
      }
      setMoves((prev) => prev + 1)
    }
  }, [flippedCards])

  useEffect(() => {
    const totalPairs = emojis[difficulty].length
    if (matchedPairs === totalPairs && gameActive) {
      setGameComplete(true)
      setGameActive(false)
      const finalScore = calculateScore(moves, totalPairs * 2, 150) + calculateScore(120 - timeElapsed, 120, 100)
      setScore(finalScore)
      updatePlayerStats(finalScore)
    }
  }, [matchedPairs, difficulty, moves, timeElapsed, gameActive])

  const initializeGame = (selectedDifficulty: "easy" | "medium" | "hard") => {
    const gameEmojis = emojis[selectedDifficulty]
    const duplicatedEmojis = [...gameEmojis, ...gameEmojis]
    const shuffledCards = duplicatedEmojis
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setTimeElapsed(0)
    setGameActive(true)
    setGameComplete(false)
    setScore(0)
    setDifficulty(selectedDifficulty)
  }

  const handleCardClick = (clickedCard: MemoryCard) => {
    if (!gameActive || clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length >= 2) {
      return
    }

    const updatedCards = cards.map((card) => (card.id === clickedCard.id ? { ...card, isFlipped: true } : card))
    setCards(updatedCards)
    setFlippedCards((prev) => [...prev, clickedCard])
  }

  const resetGame = () => {
    initializeGame(difficulty)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyInfo = (diff: "easy" | "medium" | "hard") => {
    const info = {
      easy: { pairs: 6, grid: "grid-cols-3", color: "bg-green-500" },
      medium: { pairs: 8, grid: "grid-cols-4", color: "bg-yellow-500" },
      hard: { pairs: 12, grid: "grid-cols-4", color: "bg-red-500" },
    }
    return info[diff]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Memory Match</h1>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        {/* Game Stats */}
        {gameActive || gameComplete ? (
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Timer className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <div className="text-xl font-bold text-blue-600">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-600">Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                <div className="text-xl font-bold text-orange-600">{moves}</div>
                <div className="text-sm text-gray-600">Moves</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-5 w-5 text-green-500 mx-auto mb-1" />
                <div className="text-xl font-bold text-green-600">
                  {matchedPairs}/{emojis[difficulty].length}
                </div>
                <div className="text-sm text-gray-600">Pairs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Difficulty Selection */}
        {!gameActive && !gameComplete && (
          <Card className="text-center mb-6">
            <CardHeader>
              <CardTitle>Choose Difficulty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {(["easy", "medium", "hard"] as const).map((diff) => {
                  const info = getDifficultyInfo(diff)
                  return (
                    <Card key={diff} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4" onClick={() => initializeGame(diff)}>
                        <div
                          className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center mx-auto mb-3`}
                        >
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold capitalize mb-2">{diff}</h3>
                        <p className="text-sm text-gray-600">{info.pairs} pairs</p>
                        <Badge variant="outline" className="mt-2">
                          {diff === "easy" ? "3x4 Grid" : diff === "medium" ? "4x4 Grid" : "4x6 Grid"}
                        </Badge>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Board */}
        {(gameActive || gameComplete) && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  Memory Grid
                  <Badge variant="outline" className="capitalize">
                    {difficulty}
                  </Badge>
                </CardTitle>
                <Button variant="outline" size="sm" onClick={resetGame}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`grid ${getDifficultyInfo(difficulty).grid} gap-3 max-w-md mx-auto`}>
                {cards.map((card) => (
                  <button
                    key={card.id}
                    className={`aspect-square rounded-lg shadow-md flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                      card.isFlipped || card.isMatched
                        ? "bg-white border-2 border-purple-200"
                        : "bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700"
                    } ${!gameActive ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                    onClick={() => handleCardClick(card)}
                    disabled={!gameActive}
                  >
                    {card.isFlipped || card.isMatched ? (
                      <span className="text-3xl">{card.emoji}</span>
                    ) : (
                      <span className="text-white">?</span>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Complete */}
        {gameComplete && (
          <Card className="bg-green-50 border-green-200 text-center">
            <CardContent className="p-6">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
              <p className="text-gray-600 mb-4">
                You completed the {difficulty} level in {formatTime(timeElapsed)} with {moves} moves!
              </p>
              <Badge variant="secondary" className="text-lg px-4 py-2 mb-6">
                +{score} points
              </Badge>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetGame}>Play Again</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGameActive(false)
                    setGameComplete(false)
                    setCards([])
                  }}
                >
                  Change Difficulty
                </Button>
                <Link href="/">
                  <Button variant="outline">Back to Hub</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
