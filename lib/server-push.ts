// SERVER-ONLY helper (never imported in client code)

import webpush from "web-push"
import type { PushSubscription, NotificationPayload } from "./push-notifications"

// Configure VAPID once here
webpush.setVapidDetails(
  "mailto:guptarajat94114@gmail.com", // ✅ VALID URL
  "BIxlzYczArc81HWNLNTK0GUl1n1bTjICbX-hiRiSnkWFB5t-96-FjV8l4PMEAQ8jILlxAbZbBPP5GPI710XTgB4",
  "JR9Gmlcd_0U_eI01EzjZC-0ttvQ9zXUtPnwsPx0uZos"
)


/**
 * Send a Web-Push notification.
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  payload: NotificationPayload,
): Promise<boolean> {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload), {
      TTL: 60 * 60 * 24,
      urgency: "normal",
    })
    return true
  } catch (err) {
    console.error("Push notification error:", err)
    return false
  }
}
