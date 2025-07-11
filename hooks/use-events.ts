"use client"

import { useState } from "react"

interface Event {
  id: string
  name: string
  description: string
  date: string
  time: string
  location: string
  attendees: string[] // Mock attendee addresses
  isOnline: boolean
  creator: {
    name: string
    address: string
    avatar: string
  }
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "e1",
      name: "TON Dev Meetup",
      description: "A casual meetup for TON developers to discuss new features and projects.",
      date: "2025-08-15",
      time: "18:00 UTC",
      location: "Virtual (Zoom)",
      attendees: [
        "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
        "EQBvW8Z5huBkMJYdnfAEM5JqTNkuJmt_cX1-Ti6p4dhk2Sub",
      ],
      isOnline: true,
      creator: {
        name: "CryptoBuilder",
        address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
        avatar: "/Dolphin-1.jpg?height=40&width=40",
      },
    },
    {
      id: "e2",
      name: "NFT Art Exhibition",
      description: "Showcasing the latest NFT art on the TON blockchain. Discover new artists!",
      date: "2025-09-01",
      time: "14:00 UTC",
      location: "Decentraland (coordinates: -50, 100)",
      attendees: ["EQC5zVduIE_8D0LqVJIzXlFRgKXOQi_PwXhMFLjV7_AtVids"],
      isOnline: true,
      creator: {
        name: "NFT Artist",
        address: "EQC5zVduIE_8D0LqVJIzXlFRgKXOQi_PwXhMFLjV7_AtVids",
        avatar: "/Dolphin-10.jpg?height=40&width=40",
      },
    },
    {
      id: "e3",
      name: "TON DeFi Workshop",
      description: "An interactive workshop on building and using DeFi protocols on TON.",
      date: "2025-08-20",
      time: "10:00 UTC",
      location: "Online (Google Meet)",
      attendees: [],
      isOnline: true,
      creator: {
        name: "DeFiMaxi",
        address: "EQA_DEFI_MAXI_ADDRESS_1234567890ABCDEF",
        avatar: "/Dolphin-8.jpg?height=40&width=40",
      },
    },
  ])

  const createEvent = async (eventData: Omit<Event, "id" | "attendees" | "creator">) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    const newEvent: Event = {
      id: `e-${Date.now()}`,
      ...eventData,
      attendees: ["EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t"], // Creator is first attendee
      creator: {
        name: "You",
        address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    }
    setEvents((prev) => [newEvent, ...prev])
    return newEvent
  }

  const joinEvent = async (eventId: string, userAddress: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId && !event.attendees.includes(userAddress)
          ? { ...event, attendees: [...event.attendees, userAddress] }
          : event,
      ),
    )
  }

  const leaveEvent = async (eventId: string, userAddress: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, attendees: event.attendees.filter((addr) => addr !== userAddress) } : event,
      ),
    )
  }

  return {
    events,
    createEvent,
    joinEvent,
    leaveEvent,
  }
}
