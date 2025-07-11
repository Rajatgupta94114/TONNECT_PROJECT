"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useAccessibility() {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false)
  const [isVoiceCommandsEnabled, setIsVoiceCommandsEnabled] = useState(false)
  const [isHighContrastMode, setIsHighContrastMode] = useState(false)
  const [speechRate, setSpeechRate] = useState(1)
  const [fontSize, setFontSize] = useState(16)
  const voiceCommandCallbackRef = useRef<(command: string) => void | null>(null)

  const speak = useCallback(
    (text: string) => {
      if (!isSpeechEnabled || !isAccessibilityMode) return

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = speechRate
        utterance.volume = 0.8
        speechSynthesis.speak(utterance)
      }
    },
    [isSpeechEnabled, isAccessibilityMode, speechRate],
  )

  const toggleAccessibilityMode = () => {
    const newMode = !isAccessibilityMode
    setIsAccessibilityMode(newMode)
    if (newMode) {
      setIsSpeechEnabled(true)
      setIsVoiceCommandsEnabled(true)
      speak("Accessibility mode enabled. Voice commands and screen reader support are now active.")
    } else {
      speak("Accessibility mode disabled.")
    }
  }

  const toggleSpeech = () => {
    const newState = !isSpeechEnabled
    setIsSpeechEnabled(newState)
    if (isAccessibilityMode) {
      speak(newState ? "Text-to-speech enabled." : "Text-to-speech disabled.")
    }
  }

  const toggleVoiceCommands = () => {
    const newState = !isVoiceCommandsEnabled
    setIsVoiceCommandsEnabled(newState)
    if (isAccessibilityMode) {
      speak(newState ? "Voice commands enabled." : "Voice commands disabled.")
    }
  }

  const toggleHighContrast = () => {
    const newState = !isHighContrastMode
    setIsHighContrastMode(newState)
    if (isAccessibilityMode) {
      speak(newState ? "High contrast mode enabled." : "High contrast mode disabled.")
    }
  }

  const setVoiceCommandCallback = useCallback((callback: (command: string) => void) => {
    voiceCommandCallbackRef.current = callback
  }, [])

  // Voice commands setup
  useEffect(() => {
    if (!isVoiceCommandsEnabled || !isAccessibilityMode) return

    let recognition: any = null

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase()
        console.log("Voice command detected:", command)

        if (voiceCommandCallbackRef.current) {
          voiceCommandCallbackRef.current(command)
        }

        if (command.includes("like post")) {
          speak("Liking post")
        } else if (command.includes("send message")) {
          speak("Opening message composer")
        } else if (command.includes("create post")) {
          speak("Opening new post composer")
        } else if (command.includes("go back")) {
          speak("Going back")
          window.history.back()
        } else if (command.includes("scroll down")) {
          speak("Scrolling down")
          window.scrollBy({ top: window.innerHeight / 2, behavior: "smooth" })
        } else if (command.includes("scroll up")) {
          speak("Scrolling up")
          window.scrollBy({ top: -window.innerHeight / 2, behavior: "smooth" })
        }
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        if (event.error === "not-allowed") {
          speak("Microphone access denied. Please enable it in your browser settings to use voice commands.")
        }
      }

      recognition.onend = () => {
        if (isVoiceCommandsEnabled && isAccessibilityMode) {
          recognition.start()
        }
      }

      recognition.start()
    } else {
      console.warn("SpeechRecognition API not supported in this browser.")
      if (isAccessibilityMode) {
        speak("Voice commands are not supported in your browser.")
      }
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [isVoiceCommandsEnabled, isAccessibilityMode, speak, setVoiceCommandCallback])

  // Apply high contrast styles
  useEffect(() => {
    if (isHighContrastMode) {
      document.documentElement.style.setProperty("--contrast-multiplier", "1.5")
    } else {
      document.documentElement.style.setProperty("--contrast-multiplier", "1")
    }
  }, [isHighContrastMode])

  // Apply font size
  useEffect(() => {
    document.documentElement.style.setProperty("--base-font-size", `${fontSize}px`)
  }, [fontSize])

  // ✅ Accessibility: Speak on button clicks for blind users
  useEffect(() => {
    if (!isSpeechEnabled || !isAccessibilityMode) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target) return

      const button = target.closest("button, [role='button']") as HTMLElement | null
      if (!button) return

      const label =
        button.getAttribute("aria-label") ||
        button.getAttribute("alt") ||
        button.innerText.trim() ||
        "Button clicked"

      speak(label)
    }

    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [isSpeechEnabled, isAccessibilityMode, speak])

  return {
    isAccessibilityMode,
    isSpeechEnabled,
    isVoiceCommandsEnabled,
    isHighContrastMode,
    speechRate,
    fontSize,
    speak,
    toggleAccessibilityMode,
    toggleSpeech,
    toggleVoiceCommands,
    toggleHighContrast,
    setSpeechRate,
    setFontSize,
    setVoiceCommandCallback,
  }
}
