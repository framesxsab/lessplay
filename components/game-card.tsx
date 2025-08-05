"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { playSound } from "@/lib/sound"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Lock, Info } from "lucide-react"

interface GameCardProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  difficulty: string
  points: string
  isLocked?: boolean
  requiredLevel?: number
  bestScore?: number
  timesPlayed?: number
  className?: string
}

export function GameCard({
  id,
  title,
  description,
  icon: Icon,
  color,
  difficulty,
  points,
  isLocked = false,
  requiredLevel = 1,
  bestScore = 0,
  timesPlayed = 0,
  className,
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleClick = () => {
    if (!isLocked) {
      playSound("click")
    }
  }

  return (
    <div
      className={cn("h-full transition-transform hover:-translate-y-1", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className={cn("h-full overflow-hidden", isLocked ? "opacity-80" : "")}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-transform",
                color,
                isHovered && !isLocked && "scale-110",
              )}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            {isLocked ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Unlock at level {requiredLevel}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : bestScore > 0 ? (
              <Badge variant="outline" className="font-mono">
                Best: {bestScore}
              </Badge>
            ) : null}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex justify-between items-center">
            <Badge variant="secondary">{difficulty}</Badge>
            <span className="text-sm text-muted-foreground">{points}</span>
          </div>
          {timesPlayed > 0 && (
            <div className="mt-3 text-xs text-muted-foreground flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Played {timesPlayed} {timesPlayed === 1 ? "time" : "times"}
            </div>
          )}
        </CardContent>
        <CardFooter>
          {isLocked ? (
            <Button disabled className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </Button>
          ) : (
            <Link href={`/games/${id}`} className="w-full" onClick={handleClick}>
              <Button className="w-full">Play Now</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
