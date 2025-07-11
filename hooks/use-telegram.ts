"use client"

import { useState, useEffect } from "react"

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  setHeaderColor: (color: string) => void
  close: () => void
  showPopup: (params: any) => void
  initData: string
  initDataUnsafe: any
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)

  useEffect(() => {
    // Check if running in Telegram
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      setWebApp((window as any).Telegram.WebApp)
    } else {
      // Mock Telegram WebApp for development
      setWebApp({
        ready: () => console.log("Telegram WebApp ready"),
        expand: () => console.log("Telegram WebApp expanded"),
        setHeaderColor: (color: string) => console.log("Header color set to:", color),
        close: () => console.log("Telegram WebApp closed"),
        showPopup: (params: any) => console.log("Showing popup:", params),
        initData: "",
        initDataUnsafe: {},
      })
    }
  }, [])

  return { webApp }
}
