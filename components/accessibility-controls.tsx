"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Accessibility, Volume2, VolumeX, Mic, MicOff, Eye, EyeOff, Settings, X } from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"

export function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    isAccessibilityMode,
    toggleAccessibilityMode,
    isSpeechEnabled,
    toggleSpeech,
    isVoiceCommandsEnabled,
    toggleVoiceCommands,
    isHighContrastMode,
    toggleHighContrast,
    speechRate,
    setSpeechRate,
    fontSize,
    setFontSize,
    speak,
  } = useAccessibility()

  const handleToggleAccessibility = () => {
    toggleAccessibilityMode()
    if (!isAccessibilityMode) {
      speak("Accessibility mode enabled. Voice commands and screen reader support are now active.")
    }
  }

  return (
    <>
      {/* Floating Accessibility Button */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className={`w-12 h-12 rounded-full ${
            isAccessibilityMode ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
          } text-white shadow-lg`}
          aria-label="Open accessibility controls"
        >
          <Accessibility className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="bg-black/90 backdrop-blur-xl border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Accessibility
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Accessibility Mode Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Accessibility className="w-5 h-5 text-blue-400" />
                        <div>
                          <h3 className="text-white font-medium">Accessibility Mode</h3>
                          <p className="text-gray-400 text-sm">Enable full accessibility features</p>
                        </div>
                      </div>
                      <Switch
                        checked={isAccessibilityMode}
                        onCheckedChange={handleToggleAccessibility}
                        aria-label="Toggle accessibility mode"
                      />
                    </div>

                    {/* Speech Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isSpeechEnabled ? (
                          <Volume2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <VolumeX className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <h3 className="text-white font-medium">Text-to-Speech</h3>
                          <p className="text-gray-400 text-sm">Read content aloud</p>
                        </div>
                      </div>
                      <Switch
                        checked={isSpeechEnabled}
                        onCheckedChange={toggleSpeech}
                        disabled={!isAccessibilityMode}
                        aria-label="Toggle text-to-speech"
                      />
                    </div>

                    {/* Voice Commands */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isVoiceCommandsEnabled ? (
                          <Mic className="w-5 h-5 text-green-400" />
                        ) : (
                          <MicOff className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <h3 className="text-white font-medium">Voice Commands</h3>
                          <p className="text-gray-400 text-sm">Control app with voice</p>
                        </div>
                      </div>
                      <Switch
                        checked={isVoiceCommandsEnabled}
                        onCheckedChange={toggleVoiceCommands}
                        disabled={!isAccessibilityMode}
                        aria-label="Toggle voice commands"
                      />
                    </div>

                    {/* High Contrast */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isHighContrastMode ? (
                          <Eye className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <h3 className="text-white font-medium">High Contrast</h3>
                          <p className="text-gray-400 text-sm">Improve visual clarity</p>
                        </div>
                      </div>
                      <Switch
                        checked={isHighContrastMode}
                        onCheckedChange={toggleHighContrast}
                        disabled={!isAccessibilityMode}
                        aria-label="Toggle high contrast mode"
                      />
                    </div>

                    {/* Speech Rate */}
                    {isAccessibilityMode && isSpeechEnabled && (
                      <div className="space-y-2">
                        <h3 className="text-white font-medium">Speech Rate</h3>
                        <Slider
                          value={[speechRate]}
                          onValueChange={(value) => setSpeechRate(value[0])}
                          min={0.5}
                          max={2}
                          step={0.1}
                          className="w-full"
                          aria-label="Adjust speech rate"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Slow</span>
                          <span>Normal</span>
                          <span>Fast</span>
                        </div>
                      </div>
                    )}

                    {/* Font Size */}
                    {isAccessibilityMode && (
                      <div className="space-y-2">
                        <h3 className="text-white font-medium">Font Size</h3>
                        <Slider
                          value={[fontSize]}
                          onValueChange={(value) => setFontSize(value[0])}
                          min={12}
                          max={24}
                          step={1}
                          className="w-full"
                          aria-label="Adjust font size"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Small</span>
                          <span>Medium</span>
                          <span>Large</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {isAccessibilityMode && (
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-400 text-sm">
                        ✓ Accessibility mode is active. Use voice commands like "open messages", "like post", or "send
                        message".
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
