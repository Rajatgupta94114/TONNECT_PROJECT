export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

export const subscribeUserToPush = async (subscription: PushSubscription, userId: string): Promise<boolean> => {
  try {
    // Store subscription in your database
    // This is a mock implementation
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        subscription,
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Subscription error:", error)
    return false
  }
}

export const unsubscribeUserFromPush = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/push/unsubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })

    return response.ok
  } catch (error) {
    console.error("Unsubscription error:", error)
    return false
  }
}

// Client-side notification registration
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      return registration
    } catch (error) {
      console.error("Service worker registration failed:", error)
      return null
    }
  }
  return null
}

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if ("Notification" in window) {
    return await Notification.requestPermission()
  }
  return "denied"
}

export const subscribeToPushNotifications = async (
  registration: ServiceWorkerRegistration,
): Promise<PushSubscription | null> => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })

    return {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")!))),
        auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("auth")!))),
      },
    }
  } catch (error) {
    console.error("Push subscription failed:", error)
    return null
  }
}
