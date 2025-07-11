// Service Worker for Push Notifications
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")
  event.waitUntil(self.clients.claim())
})

self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body,
      icon: data.icon || "/icon-192x192.png",
      badge: data.badge || "/badge-72x72.png",
      data: data.data,
      actions: data.actions || [],
      requireInteraction: true,
      tag: "tonnecta-notification",
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "open" || !event.action) {
    event.waitUntil(clients.openWindow("/"))
  }
})

self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event.notification.tag)
})
