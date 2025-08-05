"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Medal, Home, Trophy, Users, BarChart, MedalIcon as Medal2 } from "lucide-react"
import Link from "next/link"
import { getLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard"
import { getPlayerStats } from "@/lib/storage"

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerStats, setPlayerStats] = useState({
    playerName: "Player",
    totalScore: 0,
    level: 1,
    bestScores: { drawing: 0, gartic: 0, memory: 0 },
  })
  const [playerRank, setPlayerRank] = useState<number | null>(null)

  useEffect(() => {
    // Get player stats
    const stats = getPlayerStats()
    setPlayerStats(stats)

    // Get leaderboard data
    const data = getLeaderboard()
    setLeaderboard(data)

    // Find player rank
    const playerIndex = data.findIndex((entry) => entry.playerName === stats.playerName)
    setPlayerRank(playerIndex !== -1 ? playerIndex + 1 : null)
  }, [])

  const getFilteredLeaderboard = () => {
    if (activeTab === "all") {
      return leaderboard.sort((a, b) => b.totalScore - a.totalScore)
    } else if (activeTab === "drawing") {
      return leaderboard.sort((a, b) => b.bestScores.drawing - a.bestScores.drawing)
    } else if (activeTab === "gartic") {
      return leaderboard.sort((a, b) => b.bestScores.gartic - a.bestScores.gartic)
    } else if (activeTab === "memory") {
      return leaderboard.sort((a, b) => b.bestScores.memory - a.bestScores.memory)
    }
    return leaderboard
  }

  const getMedalColor = (index: number) => {
    if (index === 0) return "text-yellow-500"
    if (index === 1) return "text-gray-400"
    if (index === 2) return "text-amber-700"
    return "text-gray-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        {/* Player Stats Card */}
        <Card className="mb-6 bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-yellow-300">
                  <AvatarFallback className="bg-yellow-500 text-white text-xl">
                    {playerStats.playerName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{playerStats.playerName}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Trophy className="h-4 w-4" />
                    <span>Level {playerStats.level}</span>
                    {playerRank && (
                      <>
                        <span className="mx-1">•</span>
                        <span>Rank #{playerRank}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{playerStats.totalScore}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              <Trophy className="h-4 w-4 mr-2" />
              Overall
            </TabsTrigger>
            <TabsTrigger value="drawing">
              <Medal className="h-4 w-4 mr-2" />
              Quick Draw
            </TabsTrigger>
            <TabsTrigger value="gartic">
              <Medal className="h-4 w-4 mr-2" />
              Draw & Guess
            </TabsTrigger>
            <TabsTrigger value="memory">
              <Medal className="h-4 w-4 mr-2" />
              Memory
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {activeTab === "all" ? (
                    <Trophy className="h-5 w-5" />
                  ) : activeTab === "drawing" ? (
                    <Medal className="h-5 w-5" />
                  ) : activeTab === "gartic" ? (
                    <Users className="h-5 w-5" />
                  ) : (
                    <BarChart className="h-5 w-5" />
                  )}
                  {activeTab === "all"
                    ? "Overall Leaderboard"
                    : activeTab === "drawing"
                      ? "Quick Draw Leaderboard"
                      : activeTab === "gartic"
                        ? "Draw & Guess Leaderboard"
                        : "Memory Match Leaderboard"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {getFilteredLeaderboard().map((entry, index) => {
                    const isCurrentPlayer = entry.playerName === playerStats.playerName
                    const score =
                      activeTab === "all"
                        ? entry.totalScore
                        : activeTab === "drawing"
                          ? entry.bestScores.drawing
                          : activeTab === "gartic"
                            ? entry.bestScores.gartic
                            : entry.bestScores.memory

                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isCurrentPlayer ? "bg-yellow-50 border border-yellow-200" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 text-center font-bold">
                            {index < 3 ? (
                              <Medal2 className={`h-5 w-5 mx-auto ${getMedalColor(index)}`} />
                            ) : (
                              <span className="text-gray-500">#{index + 1}</span>
                            )}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              className={`${
                                index === 0
                                  ? "bg-yellow-500"
                                  : index === 1
                                    ? "bg-gray-400"
                                    : index === 2
                                      ? "bg-amber-700"
                                      : "bg-gray-200"
                              } text-white`}
                            >
                              {entry.playerName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{entry.playerName}</div>
                            <div className="text-xs text-gray-500">Level {entry.level}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={isCurrentPlayer ? "default" : "secondary"} className="text-sm">
                            {score} pts
                          </Badge>
                        </div>
                      </div>
                    )
                  })}

                  {getFilteredLeaderboard().length === 0 && (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No leaderboard data available yet</p>
                      <p className="text-sm text-gray-400">Play games to see scores here!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
