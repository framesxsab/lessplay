"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Home, Volume2, VolumeX, Trash2, Download, Upload, User } from "lucide-react"
import Link from "next/link"
import { getPlayerStats, resetPlayerStats, exportPlayerData, importPlayerData } from "@/lib/storage"
import { getSoundSettings, updateSoundSettings } from "@/lib/sound"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [playerName, setPlayerName] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundVolume, setSoundVolume] = useState(80)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [musicVolume, setMusicVolume] = useState(60)
  const [darkMode, setDarkMode] = useState(false)
  const [highContrastMode, setHighContrastMode] = useState(false)
  const [importData, setImportData] = useState("")

  useEffect(() => {
    // Load player name from storage
    const stats = getPlayerStats()
    setPlayerName(stats.playerName || "Player")

    // Load sound settings
    const soundSettings = getSoundSettings()
    setSoundEnabled(soundSettings.soundEnabled)
    setSoundVolume(soundSettings.soundVolume)
    setMusicEnabled(soundSettings.musicEnabled)
    setMusicVolume(soundSettings.musicVolume)

    // Load theme settings
    const savedTheme = localStorage.getItem("gameHubTheme")
    if (savedTheme) {
      const themeSettings = JSON.parse(savedTheme)
      setDarkMode(themeSettings.darkMode || false)
      setHighContrastMode(themeSettings.highContrastMode || false)
    }
  }, [])

  const handleSaveSettings = () => {
    // Save player name
    const stats = getPlayerStats()
    stats.playerName = playerName
    localStorage.setItem("gameHubStats", JSON.stringify(stats))

    // Save sound settings
    updateSoundSettings({
      soundEnabled,
      soundVolume,
      musicEnabled,
      musicVolume,
    })

    // Save theme settings
    localStorage.setItem(
      "gameHubTheme",
      JSON.stringify({
        darkMode,
        highContrastMode,
      }),
    )

    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    })
  }

  const handleResetStats = () => {
    if (confirm("Are you sure you want to reset all your game progress? This cannot be undone.")) {
      resetPlayerStats()
      toast({
        title: "Stats Reset",
        description: "All your game progress has been reset.",
        variant: "destructive",
      })
    }
  }

  const handleExportData = () => {
    const data = exportPlayerData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "game-hub-data.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Data Exported",
      description: "Your game data has been exported successfully.",
    })
  }

  const handleImportData = () => {
    try {
      const success = importPlayerData(importData)
      if (success) {
        toast({
          title: "Data Imported",
          description: "Your game data has been imported successfully.",
        })
        // Reload the page to reflect changes
        window.location.reload()
      } else {
        throw new Error("Import failed")
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "There was an error importing your data. Please check the format.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="playerName" className="text-base">
                    <User className="h-4 w-4 inline mr-2" />
                    Player Name
                  </Label>
                  <Input
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="max-w-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Tutorials</Label>
                    <div className="text-sm text-gray-500">Show game tutorials for first-time players</div>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications</Label>
                    <div className="text-sm text-gray-500">Receive notifications about daily challenges</div>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Confetti Effects</Label>
                    <div className="text-sm text-gray-500">Show celebration effects when achieving high scores</div>
                  </div>
                  <Switch checked={true} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Settings */}
          <TabsContent value="audio">
            <Card>
              <CardHeader>
                <CardTitle>Audio Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                      <Label className="text-base">Sound Effects</Label>
                    </div>
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                  </div>

                  <div className="pl-7 space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm text-gray-500">Volume</Label>
                      <span className="text-sm">{soundVolume}%</span>
                    </div>
                    <Slider
                      disabled={!soundEnabled}
                      value={[soundVolume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setSoundVolume(value[0])}
                      className="max-w-md"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {musicEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                      <Label className="text-base">Background Music</Label>
                    </div>
                    <Switch checked={musicEnabled} onCheckedChange={setMusicEnabled} />
                  </div>

                  <div className="pl-7 space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm text-gray-500">Volume</Label>
                      <span className="text-sm">{musicVolume}%</span>
                    </div>
                    <Slider
                      disabled={!musicEnabled}
                      value={[musicVolume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setMusicVolume(value[0])}
                      className="max-w-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <div className="text-sm text-gray-500">Use dark color theme</div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">High Contrast</Label>
                    <div className="text-sm text-gray-500">Increase contrast for better visibility</div>
                  </div>
                  <Switch checked={highContrastMode} onCheckedChange={setHighContrastMode} />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Animation Speed</Label>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Slower</span>
                    <span>Normal</span>
                    <span>Faster</span>
                  </div>
                  <Slider defaultValue={[50]} min={0} max={100} step={10} className="max-w-md" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium">Export Game Data</h3>
                    <p className="text-sm text-gray-500">
                      Download your game progress, achievements, and settings as a JSON file
                    </p>
                    <Button onClick={handleExportData} className="w-fit">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium">Import Game Data</h3>
                    <p className="text-sm text-gray-500">Upload a previously exported game data file</p>
                    <div className="flex flex-col gap-2">
                      <Input
                        placeholder="Paste JSON data here"
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                      />
                      <Button onClick={handleImportData} className="w-fit" disabled={!importData}>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t">
                    <h3 className="text-lg font-medium text-red-600">Reset Game Progress</h3>
                    <p className="text-sm text-gray-500">
                      This will permanently delete all your game progress, scores, and achievements
                    </p>
                    <Button variant="destructive" onClick={handleResetStats} className="w-fit">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Reset All Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveSettings} size="lg">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
