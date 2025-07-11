import { type NextRequest, NextResponse } from "next/server"
import { sendPushNotification } from "@/lib/server-push"
import type { PushSubscription, NotificationPayload } from "@/lib/push-notifications"

export async function POST(request: NextRequest) {
  try {
    const { userId, notification } = await request.json()

    // Get user's push subscription from database
    // This is a mock implementation
    const userSubscription: PushSubscription = {
      endpoint: "mock-endpoint",
      keys: {
        p256dh: "mock-p256dh",
        auth: "mock-auth",
      },
    }

    const payload: NotificationPayload = {
      title: notification.title,
      body: notification.body,
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      data: notification.data,
      actions: [
        {
          action: "open",
          title: "Open App",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    }

    const success = await sendPushNotification(userSubscription, payload)

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Push send error:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
