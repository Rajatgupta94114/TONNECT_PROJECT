"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Star, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"

interface MintNFTPopupProps {
  isOpen: boolean
  onClose: () => void
  onMint: () => Promise<boolean> // Function to trigger minting, returns success status
  isMinting: boolean
  mintError: string | null
}

export function MintNFTPopup({ isOpen, onClose, onMint, isMinting, mintError }: MintNFTPopupProps) {
  const [progress, setProgress] = useState(0)
  const [mintStatus, setMintStatus] = useState<"idle" | "success" | "error">("idle")
  const { isAccessibilityMode, speak } = useAccessibility()

  useEffect(() => {
    if (isOpen) {
      setProgress(0)
      setMintStatus("idle")
      if (isAccessibilityMode) speak("Mint NFT profile popup opened.")
    }
  }, [isOpen, isAccessibilityMode, speak])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isMinting) {
      setMintStatus("idle")
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 95) {
            return prev + Math.random() * 5 // Simulate progress
          }
          return prev
        })
      }, 200)
    } else {
      if (interval) clearInterval(interval)
      if (mintError) {
        setMintStatus("error")
        setProgress(0)
        if (isAccessibilityMode) speak(`NFT minting failed: ${mintError}.`)
      } else if (isOpen && mintStatus === "idle") {
        // Only set success if no error and modal is open and was minting
        setMintStatus("success")
        setProgress(100)
        if (isAccessibilityMode) speak("NFT profile minted successfully!")
      }
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMinting, mintError, isOpen, isAccessibilityMode, speak, mintStatus])

  const handleMintClick = async () => {
    if (isAccessibilityMode) speak("Initiating NFT minting process.")
    const success = await onMint()
    if (success) {
      // Status will be updated by useEffect based on isMinting and mintError
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mint-nft-title"
          >
            <Card className="bg-black/90 backdrop-blur-xl border border-white/20">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle id="mint-nft-title" className="text-lg text-white flex items-center">
                  <Star className="w-5 h-5 mr-2 text-purple-400" />
                  Mint NFT Profile
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close mint NFT modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 text-sm">
                  Mint a unique NFT to represent your profile on the TON blockchain. This will give you a verified badge
                  and unlock exclusive features.
                </p>

                {isMinting && (
                  <div className="space-y-2" aria-live="polite" aria-atomic="true">
                    <div className="flex items-center justify-between text-gray-400 text-sm">
                      <span>Minting in progress...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-3 bg-blue-500/20" />
                    <p className="text-xs text-gray-500">
                      This may take a few moments as your NFT is being secured on-chain.
                    </p>
                  </div>
                )}

                {mintStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                    aria-live="assertive"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-green-400 font-medium">NFT Profile Minted Successfully!</p>
                  </motion.div>
                )}

                {mintStatus === "error" && mintError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                    aria-live="assertive"
                  >
                    <XCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 font-medium">Minting Failed: {mintError}</p>
                  </motion.div>
                )}

                <Button
                  onClick={handleMintClick}
                  disabled={isMinting || mintStatus === "success"}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  aria-label={isMinting ? "Minting in progress" : "Mint NFT Profile"}
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Mint NFT Profile
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full border-white/20 text-white hover:bg-white/5 bg-transparent"
                  disabled={isMinting}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
