"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Coins } from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"

interface TipModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmTip: (amount: number) => void
  postAuthorName: string
  postAuthorAddress: string
}

export function TipModal({ isOpen, onClose, onConfirmTip, postAuthorName, postAuthorAddress }: TipModalProps) {
  const [tipAmount, setTipAmount] = useState("0.1") // Default tip amount
  const { isAccessibilityMode, speak } = useAccessibility()

  const handleConfirm = () => {
    const amount = Number.parseFloat(tipAmount)
    if (isNaN(amount) || amount <= 0) {
      if (isAccessibilityMode) speak("Please enter a valid tip amount.")
      return
    }
    onConfirmTip(amount)
    onClose()
    if (isAccessibilityMode) speak(`Tipped ${amount} TON to ${postAuthorName}.`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm"
          >
            <Card className="bg-black/90 backdrop-blur-xl border border-white/20">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-lg text-white flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                  Tip {postAuthorName}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close tip modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">
                  You are about to tip {postAuthorName} ({postAuthorAddress.slice(0, 6)}...{postAuthorAddress.slice(-4)}
                  )
                </p>
                <div>
                  <label htmlFor="tip-amount" className="sr-only">
                    Tip Amount (TON)
                  </label>
                  <Input
                    id="tip-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Enter amount in TON"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    aria-label="Tip amount in TON"
                  />
                </div>
                <Button
                  onClick={handleConfirm}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                  aria-label="Confirm tip"
                >
                  Confirm Tip
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
