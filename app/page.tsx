"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SocialFeed } from "@/components/social-feed"
import { MessagingHub } from "@/components/messaging-hub"
import { ProfileManager } from "@/components/profile-manager"
import { GroupChats } from "@/components/group-chats"
import { EventsHub } from "@/components/events-hub"
import { ReelsFeed } from "@/components/reels-feed" // Import ReelsFeed
import { AccessibilityControls } from "@/components/accessibility-controls"
import { NavigationBar } from "@/components/navigation-bar"
import { useWallet } from "@/hooks/use-wallet"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useTelegram } from "@/hooks/use-telegram"
import { NotificationSettings } from "@/components/notification-settings"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { LoadingScreen } from "@/components/loading-screen"

export default function TONnectAApp() {
  const [activeTab, setActiveTab] = useState("feed")
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [isLoadingApp, setIsLoadingApp] = useState(true)
  const { wallet } = useWallet()
  const { isAccessibilityMode, speak, setVoiceCommandCallback } = useAccessibility()
  const { webApp } = useTelegram()

  useEffect(() => {
    // Simulate app loading time
    const timer = setTimeout(() => {
      setIsLoadingApp(false)
      if (isAccessibilityMode) {
        speak("Application loaded. Welcome to TONnectA.")
      }
    }, 3000) // Show loading screen for 3 seconds

    return () => clearTimeout(timer)
  }, [isAccessibilityMode, speak])

  useEffect(() => {
    // Initialize Telegram Mini App
    if (webApp) {
      webApp.ready()
      webApp.expand()
      webApp.setHeaderColor("#1a1a1a")
    }
  }, [webApp])

  useEffect(() => {
    if (isAccessibilityMode && !isLoadingApp) {
      speak("Welcome to TONnectA, your decentralized social platform")
    }
  }, [isAccessibilityMode, speak, isLoadingApp])

  // Set a callback for voice commands to change the active tab
  useEffect(() => {
    setVoiceCommandCallback((command: string) => {
      if (command.includes("open messages")) {
        setActiveTab("messages")
        speak("Opening messages")
      } else if (command.includes("open feed")) {
        setActiveTab("feed")
        speak("Opening social feed")
      } else if (command.includes("open profile")) {
        setActiveTab("profile")
        speak("Opening profile")
      } else if (command.includes("open groups")) {
        setActiveTab("groups")
        speak("Opening groups")
      } else if (command.includes("open events")) {
        setActiveTab("events")
        speak("Opening events hub")
      } else if (command.includes("open reels")) {
        // New voice command for reels
        setActiveTab("reels")
        speak("Opening reels feed")
      } else if (command.includes("connect wallet")) {
        setShowConnectModal(true)
        speak("Opening wallet connection")
      }
      // Add more specific voice command handlers here if needed
    })
  }, [setVoiceCommandCallback, speak])

  // Effect to close the modal if wallet becomes connected
  useEffect(() => {
    if (wallet.isConnected && showConnectModal) {
      setShowConnectModal(false)
    }
  }, [wallet.isConnected, showConnectModal])

  return (
    <>
      <AnimatePresence>{isLoadingApp && <LoadingScreen />}</AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AccessibilityControls />

        <div className="container mx-auto px-4 py-6 pb-20">
          <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 flex justify-start">
                {/* New "Connect Wallet" button in header */}
                {!wallet.isConnected && (
                  <Button
                    onClick={() => setShowConnectModal(true)}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/5 bg-transparent"
                    aria-label="Connect TON Wallet"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                )}
                {wallet.isConnected && (
                  <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm font-medium">Connected</span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TONnectA
                </h1>
                <p className="text-gray-300 mt-2">Decentralized Social • Web3 Native</p>
              </div>
              <div className="flex-1 flex justify-end">
                <NotificationSettings />
              </div>
            </div>
            {wallet.isConnected && (
              <div className="text-sm text-gray-400 mt-1">
                Connected: {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                {wallet.isViewOnly && <span className="ml-2 text-yellow-400">(View Only)</span>}
              </div>
            )}
          </motion.header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "feed" && <SocialFeed />}
              {activeTab === "messages" && <MessagingHub />}
              {activeTab === "profile" && <ProfileManager />}
              {activeTab === "groups" && <GroupChats />}
              {activeTab === "events" && <EventsHub />}
              {activeTab === "reels" && <ReelsFeed />} {/* New ReelsFeed component */}
            </motion.div>
          </AnimatePresence>
        </div>

        <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Wallet Connection Modal */}
        <WalletConnectModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} />
      </div>
    </>
  )
}
