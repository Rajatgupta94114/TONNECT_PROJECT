"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Bell, BellOff, Check } from "lucide-react"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { useAccessibility } from "@/hooks/use-accessibility"

export function NotificationSettings() {
  const [showSettings, setShowSettings] = useState(false)
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    enableNotifications,
    disableNotifications,
    sendTestNotification,
  } = usePushNotifications()
  const { isAccessibilityMode, speak } = useAccessibility()

  const handleToggleNotifications = async () => {
    const userId = "current-user-id" // Get from your auth context

    try {
      if (isSubscribed) {
        await disableNotifications(userId)
        if (isAccessibilityMode) {
          speak("Push notifications disabled")
        }
      } else {
        await enableNotifications(userId)
        if (isAccessibilityMode) {
          speak("Push notifications enabled")
        }
      }
    } catch (error) {
      if (isAccessibilityMode) {
        speak("Failed to update notification settings")
      }
    }
  }

  const handleTestNotification = () => {
    sendTestNotification()
    if (isAccessibilityMode) {
      speak("Test notification sent")
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <>
      <Button
        onClick={() => setShowSettings(true)}
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-white"
        aria-label="Notification settings"
      >
        {isSubscribed ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
      </Button>

      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="bg-black/90 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Push Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Enable Notifications</h3>
                    <p className="text-gray-400 text-sm">Get notified about messages, likes, and comments</p>
                  </div>
                  <Switch
                    checked={isSubscribed}
                    onCheckedChange={handleToggleNotifications}
                    disabled={isLoading || permission === "denied"}
                    aria-label="Toggle push notifications"
                  />
                </div>

                {permission === "denied" && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">
                      Notifications are blocked. Please enable them in your browser settings.
                    </p>
                  </div>
                )}

                {isSubscribed && (
                  <Button
                    onClick={handleTestNotification}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/5 bg-transparent"
                  >
                    Send Test Notification
                  </Button>
                )}

                <div className="flex space-x-2">
                  <Button onClick={() => setShowSettings(false)} className="flex-1 bg-blue-500 hover:bg-blue-600">
                    <Check className="w-4 h-4 mr-2" />
                    Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
