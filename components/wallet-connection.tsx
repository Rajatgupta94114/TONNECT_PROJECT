"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wallet, Shield, Zap, Users, ExternalLink, Eye } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useAccessibility } from "@/hooks/use-accessibility"

interface WalletConnectionProps {
  onClose?: () => void // Added onClose prop
}

export function WalletConnection({ onClose }: WalletConnectionProps) {
  const [pastedAddress, setPastedAddress] = useState("")
  const { wallet, connect, connectViewOnly } = useWallet()
  const { isAccessibilityMode, speak } = useAccessibility()

  const handleConnectClick = async () => {
    if (isAccessibilityMode) {
      speak("Initiating TON wallet connection. Please follow instructions on the next page.")
    }
    await connect() // This calls the TON Connect flow
    if (onClose) onClose() // Close modal after connection attempt
  }

  const handleViewOnlyClick = () => {
    if (pastedAddress.trim()) {
      connectViewOnly(pastedAddress.trim()) // This calls the view-only flow
      if (isAccessibilityMode) {
        speak(`Viewing content for address ${pastedAddress.trim()}`)
      }
      if (onClose) onClose() // Close modal after view-only connection
    }
  }

  const features = [
    {
      icon: Shield,
      title: "Anonymous Login",
      description: "No phone, email, or password needed",
    },
    {
      icon: Zap,
      title: "Encrypted Messaging",
      description: "End-to-end encrypted private chats",
    },
    {
      icon: Users,
      title: "Decentralized Social",
      description: "Your data, your control, no ads",
    },
  ]

  return (
    <div className="p-0">
      {" "}
      {/* Removed min-h-screen and flex centering */}
      <CardHeader className="text-center p-0 mb-6">
        {" "}
        {/* Adjusted padding */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4"
        >
          <Wallet className="w-8 h-8 text-white" />
        </motion.div>
        <CardTitle className="text-2xl text-white">Welcome to TONnectA</CardTitle>
        <CardDescription className="text-gray-300">
          Connect your TON wallet to enter the decentralized social universe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-0">
        {" "}
        {/* Adjusted padding */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg bg-white/5"
            >
              <feature.icon className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-white font-medium">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Button
            onClick={handleConnectClick}
            disabled={wallet.isConnecting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            aria-label="Connect TON Wallet"
          >
            {wallet.isConnecting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Redirecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect TON Wallet (Full Access)
                <ExternalLink className="w-3 h-3 ml-2" />
              </>
            )}
          </Button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-700" />
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-700" />
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Paste TON Wallet Address"
              value={pastedAddress}
              onChange={(e) => setPastedAddress(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-gray-400"
              aria-label="Paste TON Wallet Address"
            />
            <Button
              onClick={handleViewOnlyClick}
              disabled={!pastedAddress.trim()}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/5 bg-transparent"
              aria-label="View with pasted address"
            >
              <Eye className="w-4 h-4 mr-2" />
              View with Address (Read Only)
            </Button>
            <p className="text-xs text-gray-500 text-center">
              * Read-only mode allows browsing but not interactive features like posting or tipping.
            </p>
          </div>
        </motion.div>
        <p className="text-xs text-gray-400 text-center">
          By connecting, you agree to our decentralized terms. Your privacy is protected by blockchain technology.
        </p>
      </CardContent>
    </div>
  )
}
