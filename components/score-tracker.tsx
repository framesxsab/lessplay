"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Target, TrendingUp, Award, Medal } from "lucide-react"
import { getPlayerStats } from "@/lib/storage"
import { formatScore } from "@/lib/game-utils"
import { cn } from "@/lib/utils"

interface ScoreTrackerProps {
  showDetailed?: boolean
  className?: string
  compact?: boolean
}

export function ScoreTracker({ showDetailed = false, className = "", compact = false }: ScoreTrackerProps) {
  const [stats, setStats] = useState({
    playerName: "Player",
    totalScore: 0,
    gamesPlayed: 0,
    achievements: [],
    level: 1,
    bestScores: { drawing: 0, gartic: 0, memory: 0 },
  })
  const [activeTab, setActiveTab] = useState("progress")
  const [animateScore, setAnimateScore] = useState(false)

  useEffect(() => {
    const playerStats = getPlayerStats()
    setStats(playerStats)

    // Trigger animation when stats change
    setAnimateScore(true)
    const timer = setTimeout(() => setAnimateScore(false), 1000)

    return () => clearTimeout(timer)
  }, [])

  const nextLevelScore = stats.level * 100
  const currentLevelProgress = stats.totalScore % 100
  const progressPercentage = (currentLevelProgress / 100) * 100

  if (compact) {
    return (
      <Card
        className={cn(
          "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 dark:from-yellow-950/30 dark:to-amber-950/30 dark:border-yellow-900/50",
          className,
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stats.totalScore}
                    initial={animateScore ? { scale: 1.5, color: "#f59e0b" } : { scale: 1 }}
                    animate={{ scale: 1, color: "#000000" }}
                    className="font-bold text-lg dark:text-white"
                  >
                    {formatScore(stats.totalScore)}
                  </motion.div>
                </AnimatePresence>
                <div className="text-sm text-muted-foreground">Level {stats.level}</div>
              </div>
            </div>
            <Badge variant="secondary">{stats.achievements.length} achievements</Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!showDetailed) {
    return (
      <Card
        className={cn(
          "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 dark:from-yellow-950/30 dark:to-amber-950/30 dark:border-yellow-900/50",
          className,
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stats.totalScore}
                    initial={animateScore ? { scale: 1.5, color: "#f59e0b" } : { scale: 1 }}
                    animate={{ scale: 1, color: "#000000" }}
                    className="font-bold text-lg dark:text-white"
                  >
                    {formatScore(stats.totalScore)}
                  </motion.div>
                </AnimatePresence>
                <div className="text-sm text-muted-foreground">Level {stats.level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Next Level</div>
              <div className="w-32">
                <div className="flex justify-between text-xs mb-1">
                  <span>{currentLevelProgress}</span>
                  <span>100</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 dark:from-yellow-950/30 dark:to-amber-950/30 dark:border-yellow-900/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Score</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stats.totalScore}
                    initial={animateScore ? { scale: 1.5, color: "#f59e0b" } : { scale: 1 }}
                    animate={{ scale: 1, color: "#000000" }}
                    className="text-3xl font-bold dark:text-white"
                  >
                    {formatScore(stats.totalScore)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Level</div>
              <div className="text-2xl font-bold">{stats.level}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="progress" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progress">
            <TrendingUp className="h-4 w-4 mr-2" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="stats">
            <Target className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Level {stats.level}</span>
                  <span className="text-sm text-muted-foreground">{currentLevelProgress}/100 XP</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="text-xs text-muted-foreground text-center">
                  {100 - currentLevelProgress} XP to next level
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5" />
                Best Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">QD</span>
                    </div>
                    <span className="text-sm">Quick Draw</span>
                  </div>
                  <Badge variant="outline">{formatScore(stats.bestScores.drawing)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-sm font-medium">DG</span>
                    </div>
                    <span className="text-sm">Draw & Guess Chain</span>
                  </div>
                  <Badge variant="outline">{formatScore(stats.bestScores.gartic)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">MM</span>
                    </div>
                    <span className="text-sm">Memory Match</span>
                  </div>
                  <Badge variant="outline">{formatScore(stats.bestScores.memory)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Game Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.gamesPlayed}</div>
                  <div className="text-sm text-muted-foreground">Games Played</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatScore(stats.totalScore)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Quick Draw</span>
                    <span className="text-sm text-muted-foreground">33%</span>
                  </div>
                  <Progress value={33} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Draw & Guess Chain</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Memory Match</span>
                    <span className="text-sm text-muted-foreground">22%</span>
                  </div>
                  <Progress value={22} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements ({stats.achievements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.achievements.length > 0 ? (
                <div className="space-y-3">
                  {stats.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                        <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <div className="font-medium">{achievement}</div>
                        <div className="text-xs text-muted-foreground">Achievement unlocked</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No achievements yet</p>
                  <p className="text-sm">Play games to unlock achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
