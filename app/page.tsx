"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Users, Brain, Calendar, Trophy, Star, Sparkles } from "lucide-react"
import { GameCard } from "@/components/game-card"
import { ScoreTracker } from "@/components/score-tracker"
import { getPlayerStats } from "@/lib/storage"
import { getDailyChallenge } from "@/lib/challenges"
import { playSound } from "@/lib/sound"

export default function GameHub() {
  const [playerStats, setPlayerStats] = useState({
    playerName: "Player",
    totalScore: 0,
    gamesPlayed: 0,
    achievements: [],
    level: 1,
    bestScores: { drawing: 0, gartic: 0, memory: 0 },
  })
  const [dailyChallenges, setDailyChallenges] = useState<any[]>([])
  const [completedChallenges, setCompletedChallenges] = useState(0)
  const [activeTab, setActiveTab] = useState("featured")

  useEffect(() => {
    const stats = getPlayerStats()
    setPlayerStats(stats)

    // Get daily challenges
    const challenges = getDailyChallenge()
    setDailyChallenges(challenges)
    setCompletedChallenges(challenges.filter((c: any) => c.completed).length)
  }, [])

  const games = [
    {
      id: "drawing",
      title: "Quick Draw",
      description: "Draw the word before time runs out!",
      icon: Palette,
      color: "bg-blue-500",
      difficulty: "Easy",
      points: "10-50 pts",
      bestScore: playerStats.bestScores.drawing,
      timesPlayed: Math.floor(Math.random() * 10) + 1, // Placeholder
    },
    {
      id: "gartic",
      title: "Draw & Guess Chain",
      description: "Draw what you see, guess what others drew!",
      icon: Users,
      color: "bg-green-500",
      difficulty: "Medium",
      points: "20-100 pts",
      bestScore: playerStats.bestScores.gartic,
      timesPlayed: Math.floor(Math.random() * 10) + 1, // Placeholder
    },
    {
      id: "memory",
      title: "Memory Match",
      description: "Find matching pairs in the grid!",
      icon: Brain,
      color: "bg-purple-500",
      difficulty: "Hard",
      points: "30-150 pts",
      bestScore: playerStats.bestScores.memory,
      timesPlayed: Math.floor(Math.random() * 10) + 1, // Placeholder
    },
  ]

  const achievements = [
    { name: "First Steps", description: "Play your first game", unlocked: playerStats.gamesPlayed > 0 },
    { name: "Score Hunter", description: "Reach 100 total points", unlocked: playerStats.totalScore >= 100 },
    { name: "Game Master", description: "Play all 3 games", unlocked: playerStats.gamesPlayed >= 3 },
    { name: "High Scorer", description: "Reach 500 total points", unlocked: playerStats.totalScore >= 500 },
  ]

  const handleTabChange = (value: string) => {
    playSound("click")
    setActiveTab(value)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 md:p-8">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Game Hub!</h1>
          <p className="text-primary-100 max-w-xl mb-6">
            Challenge yourself with three exciting games. Earn points, unlock achievements, and compete on the
            leaderboard. Start your gaming journey today!
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => playSound("click")}>
              Start Playing
            </Button>
            <Link href="/daily-challenge">
              <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 border-white/20">
                <Calendar className="h-4 w-4 mr-2" />
                Daily Challenges
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-10">
          <Sparkles className="w-full h-full" />
        </div>
      </section>

      {/* Player Stats */}
      <ScoreTracker />

      {/* Games Section */}
      <section>
        <Tabs defaultValue="featured" value={activeTab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Games</h2>
            <TabsList>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="featured" className="mt-0">
            <div className="grid md:grid-cols-3 gap-6">
              {games.map((game) => (
                <div key={game.id} className="animate-fadeIn">
                  <GameCard
                    id={game.id}
                    title={game.title}
                    description={game.description}
                    icon={game.icon}
                    color={game.color}
                    difficulty={game.difficulty}
                    points={game.points}
                    bestScore={game.bestScore}
                    timesPlayed={game.timesPlayed}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="mt-0">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Show the same games but in different order */}
              {[...games]
                .sort((a, b) => b.timesPlayed - a.timesPlayed)
                .map((game) => (
                  <div key={game.id} className="animate-fadeIn">
                    <GameCard
                      id={game.id}
                      title={game.title}
                      description={game.description}
                      icon={game.icon}
                      color={game.color}
                      difficulty={game.difficulty}
                      points={game.points}
                      bestScore={game.bestScore}
                      timesPlayed={game.timesPlayed}
                    />
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="mt-0">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Show one real game and two locked games */}
              <GameCard
                id={games[0].id}
                title={games[0].title}
                description={games[0].description}
                icon={games[0].icon}
                color={games[0].color}
                difficulty={games[0].difficulty}
                points={games[0].points}
                bestScore={games[0].bestScore}
                timesPlayed={games[0].timesPlayed}
              />
              <GameCard
                id="puzzle"
                title="Puzzle Master"
                description="Solve challenging puzzles against the clock!"
                icon={Brain}
                color="bg-amber-500"
                difficulty="Medium"
                points="20-80 pts"
                isLocked={true}
                requiredLevel={5}
              />
              <GameCard
                id="trivia"
                title="Trivia Challenge"
                description="Test your knowledge across various categories!"
                icon={Trophy}
                color="bg-indigo-500"
                difficulty="Easy"
                points="10-60 pts"
                isLocked={true}
                requiredLevel={3}
              />
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Daily Challenges */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Daily Challenges</h2>
          <Link href="/daily-challenge">
            <Button variant="outline" size="sm" onClick={() => playSound("click")}>
              View All
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Today's Challenges</CardTitle>
            <CardDescription>Complete daily challenges to earn bonus points and rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyChallenges.length > 0 ? (
                dailyChallenges.slice(0, 3).map((challenge: any, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      challenge.completed ? "bg-green-50 dark:bg-green-900/20" : "bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          challenge.type === "drawing"
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : challenge.type === "gartic"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-purple-100 dark:bg-purple-900/30"
                        }`}
                      >
                        {challenge.type === "drawing" ? (
                          <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        ) : challenge.type === "gartic" ? (
                          <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{challenge.title}</div>
                        <div className="text-xs text-muted-foreground">{challenge.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={challenge.completed ? "outline" : "default"}>+{challenge.points} pts</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No challenges available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Achievements */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Achievements</h2>
          <Badge variant="outline">
            {achievements.filter((a) => a.unlocked).length}/{achievements.length} Unlocked
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <Card
              key={index}
              className={`overflow-hidden transition-colors ${
                achievement.unlocked
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-900/50"
                  : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.unlocked
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  >
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
