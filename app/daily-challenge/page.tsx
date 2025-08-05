"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Home, Trophy, Star, Clock, CheckCircle, XCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { getDailyChallenge, completeDailyChallenge, type DailyChallenge } from "@/lib/challenges"
import { updatePlayerStats } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export default function DailyChallengeHub() {
  const { toast } = useToast()
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([])
  const [completedToday, setCompletedToday] = useState(0)
  const [streakDays, setStreakDays] = useState(0)
  const [todayDate, setTodayDate] = useState("")

  useEffect(() => {
    // Get today's date in a readable format
    const today = new Date()
    setTodayDate(
      today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )

    // Get daily challenges
    const challenges = getDailyChallenge()
    setDailyChallenges(challenges)

    // Count completed challenges
    const completed = challenges.filter((challenge) => challenge.completed).length
    setCompletedToday(completed)

    // Get streak days
    const streak = localStorage.getItem("challengeStreak")
    setStreakDays(streak ? Number.parseInt(streak) : 0)
  }, [])

  const handleCompleteChallenge = (challengeId: string) => {
    // Find the challenge
    const challenge = dailyChallenges.find((c) => c.id === challengeId)
    if (!challenge || challenge.completed) return

    // Mark as completed
    const updatedChallenges = dailyChallenges.map((c) => (c.id === challengeId ? { ...c, completed: true } : c))
    setDailyChallenges(updatedChallenges)
    setCompletedToday(completedToday + 1)

    // Update in storage
    completeDailyChallenge(challengeId)

    // Add bonus points
    updatePlayerStats(challenge.points)

    // Show toast
    toast({
      title: "Challenge Completed!",
      description: `You earned ${challenge.points} points!`,
    })

    // Update streak if all challenges completed
    if (completedToday + 1 === dailyChallenges.length) {
      const newStreak = streakDays + 1
      setStreakDays(newStreak)
      localStorage.setItem("challengeStreak", newStreak.toString())

      // Bonus for completing all challenges
      const streakBonus = Math.min(newStreak * 10, 100)
      updatePlayerStats(streakBonus)

      toast({
        title: "All Challenges Completed!",
        description: `Streak Bonus: +${streakBonus} points!`,
      })
    }
  }

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case "drawing":
        return <Star className="h-5 w-5 text-blue-500" />
      case "gartic":
        return <Star className="h-5 w-5 text-green-500" />
      case "memory":
        return <Star className="h-5 w-5 text-purple-500" />
      default:
        return <Star className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Daily Challenges</h1>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        {/* Daily Status */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-200">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h2 className="text-lg font-medium mb-1">{todayDate}</h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Refreshes in 12 hours</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Daily Progress</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold">
                    {completedToday}/{dailyChallenges.length} Completed
                  </span>
                </div>
                <Progress value={(completedToday / dailyChallenges.length) * 100} className="h-2" />
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Current Streak</div>
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">{streakDays} days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Challenge List */}
        <div className="grid gap-4 mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Today's Challenges
          </h2>

          {dailyChallenges.map((challenge) => (
            <Card key={challenge.id} className={challenge.completed ? "bg-gray-50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        challenge.completed ? "bg-gray-200" : "bg-indigo-100"
                      }`}
                    >
                      {getChallengeIcon(challenge.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{challenge.title}</h3>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={challenge.completed ? "outline" : "default"} className="text-sm">
                      +{challenge.points} pts
                    </Badge>
                    {challenge.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Link href={challenge.gameLink}>
                        <Button size="sm" onClick={() => handleCompleteChallenge(challenge.id)}>
                          Play Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {dailyChallenges.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <XCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-600">No Challenges Available</h3>
                <p className="text-gray-500">Check back tomorrow for new challenges!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Streak Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Streak Rewards
            </CardTitle>
            <CardDescription>Complete all daily challenges to maintain your streak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {[1, 3, 5, 7, 10].map((day, index) => (
                <Card key={index} className={streakDays >= day ? "bg-yellow-50 border-yellow-200" : ""}>
                  <CardContent className="p-3 text-center">
                    <div className="text-sm font-medium mb-1">Day {day}</div>
                    <Badge variant={streakDays >= day ? "default" : "outline"} className="text-xs">
                      +{day * 10} pts
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
