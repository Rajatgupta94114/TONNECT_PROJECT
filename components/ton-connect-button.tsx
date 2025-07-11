"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Wallet, ExternalLink, Copy, Check } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useAccessibility } from "@/hooks/use-accessibility"

export function TonConnectButton() {
  const [copied, setCopied] = useState(false)
  const { isConnected, address, balance, isConnecting, connect, disconnect } = useWallet()
  const { isAccessibilityMode, speak } = useAccessibility()

  const handleConnect = async () => {
    try {
      if (isAccessibilityMode) {
        speak("Opening TON Connect wallet selection")
      }
      await connect()
    } catch (error) {
      if (isAccessibilityMode) {
        speak("Failed to connect wallet. Please try again.")
      }
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      if (isAccessibilityMode) {
        speak("Wallet disconnected successfully")
      }
    } catch (error) {
      if (isAccessibilityMode) {
        speak("Failed to disconnect wallet")
      }
    }
  }

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      if (isAccessibilityMode) {
        speak("Wallet address copied to clipboard")
      }
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Connected</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={copyAddress}
          className="border-white/20 text-white hover:bg-white/5 bg-transparent"
          aria-label="Copy wallet address"
        >
          {copied ? <Check className="w-4 h-4 mr-2 text-green-400" /> : <Copy className="w-4 h-4 mr-2" />}
          {address.slice(0, 6)}...{address.slice(-4)}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 transform hover:scale-105"
      aria-label="Connect TON Wallet"
    >
      {isConnecting ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
          />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect TON Wallet
          <ExternalLink className="w-3 h-3 ml-2" />
        </>
      )}
    </Button>
  )
}
