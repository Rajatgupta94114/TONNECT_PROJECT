"use client"

import { useState, useEffect } from "react"
import {
  registerServiceWorker,
  requestNotificationPermission,
  subscribeToPushNotifications,
  subscribeUserToPush,
  unsubscribeUserFromPush,
  type PushSubscription,
} from "@/lib/push-notifications"

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if push notifications are supported
    const checkSupport = () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
      setIsSupported(supported)

      if (supported) {
        setPermission(Notification.permission)
      }
    }

    checkSupport()
  }, [])

  const enableNotifications = async (userId: string) => {
    if (!isSupported) {
      throw new Error("Push notifications are not supported")
    }

    setIsLoading(true)

    try {
      // Request permission
      const permission = await requestNotificationPermission()
      setPermission(permission)

      if (permission !== "granted") {
        throw new Error("Notification permission denied")
      }

      // Register service worker
      const registration = await registerServiceWorker()
      if (!registration) {
        throw new Error("Service worker registration failed")
      }

      // Subscribe to push notifications
      const pushSubscription = await subscribeToPushNotifications(registration)
      if (!pushSubscription) {
        throw new Error("Push subscription failed")
      }

      // Save subscription to server
      const success = await subscribeUserToPush(pushSubscription, userId)
      if (!success) {
        throw new Error("Failed to save subscription")
      }

      setSubscription(pushSubscription)
      setIsSubscribed(true)

      return true
    } catch (error) {
      console.error("Failed to enable notifications:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const disableNotifications = async (userId: string) => {
    setIsLoading(true)

    try {
      await unsubscribeUserFromPush(userId)
      setIsSubscribed(false)
      setSubscription(null)
      return true
    } catch (error) {
      console.error("Failed to disable notifications:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestNotification = () => {
    if (permission === "granted") {
      new Notification("TONnectA Test", {
        body: "Push notifications are working!",
        icon: "/icon-192x192.png",
        badge: "/badge-72x72.png",
      })
    }
  }

  return {
    isSupported,
    permission,
    isSubscribed,
    subscription,
    isLoading,
    enableNotifications,
    disableNotifications,
    sendTestNotification,
  }
}
