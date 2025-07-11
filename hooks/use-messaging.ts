"use client"

import { useState, useCallback } from "react"

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
}

interface Message {
  id: string
  chatId: string // Added chatId to link messages to chats
  content: string
  timestamp: string
  isSent: boolean
}

export function useMessaging() {
  const [chats] = useState<Chat[]>([
    {
      id: "1",
      name: "Alice Cooper",
      avatar: "/Dolphin-10.jpg?height=40&width=40",
      lastMessage: "Hey! How are you doing?",
      lastMessageTime: "2m ago",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: "2",
      name: "Bob Wilson",
      avatar: "/Dolphin-1.jpg?height=40&width=40",
      lastMessage: "Thanks for the tip! 🙏",
      lastMessageTime: "1h ago",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "3",
      name: "Carol Smith",
      avatar: "/Dolphin-5.jpg?height=40&width=40",
      lastMessage: "The new DAO proposal looks interesting",
      lastMessageTime: "3h ago",
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: "4",
      name: "TON Community",
      avatar: "/Dolphin-9.jpg?height=40&width=40",
      lastMessage: "Don't forget the AMA tomorrow!",
      lastMessageTime: "5h ago",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: "5",
      name: "NFT Artists",
      avatar: "/Dolphin-6.jpg?height=40&width=40",
      lastMessage: "My latest collection is live!",
      lastMessageTime: "1d ago",
      unreadCount: 0,
      isOnline: false,
    },
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      chatId: "1",
      content: "Hey there! Welcome to TONnectA",
      timestamp: "10:30 AM",
      isSent: false,
    },
    {
      id: "2",
      chatId: "1",
      content: "Thanks! This platform is amazing",
      timestamp: "10:32 AM",
      isSent: true,
    },
    {
      id: "3",
      chatId: "1",
      content: "I love how everything is encrypted and decentralized",
      timestamp: "10:33 AM",
      isSent: true,
    },
    {
      id: "4",
      chatId: "1",
      content: "No more data harvesting by big tech",
      timestamp: "10:35 AM",
      isSent: false,
    },
    {
      id: "5",
      chatId: "2",
      content: "Hey Bob, how's your project going?",
      timestamp: "09:00 AM",
      isSent: true,
    },
    {
      id: "6",
      chatId: "2",
      content: "It's going well! Making good progress on the smart contract.",
      timestamp: "09:05 AM",
      isSent: false,
    },
    {
      id: "7",
      chatId: "3",
      content: "Did you see the new DAO proposal?",
      timestamp: "Yesterday",
      isSent: true,
    },
    {
      id: "8",
      chatId: "3",
      content: "Yes, I'm reviewing it now. Looks promising!",
      timestamp: "Yesterday",
      isSent: false,
    },
  ])

  const sendMessage = async (chatId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSent: true,
    }
    setMessages((prev) => [...prev, newMessage])
    // Simulate sending encrypted message
    console.log(`Sending encrypted message to ${chatId}: ${content}`)
  }

  const simulateIncomingMessage = useCallback(
    (chatId: string) => {
      const chat = chats.find((c) => c.id === chatId)
      if (!chat) return

      const mockResponses = [
        "That's great to hear!",
        "Interesting point, I agree.",
        "What are your thoughts on this?",
        "I'll look into that, thanks!",
        "Got it. Anything else?",
      ]
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]

      const incomingMessage: Message = {
        id: Date.now().toString() + "-incoming",
        chatId,
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSent: false,
      }
      setMessages((prev) => [...prev, incomingMessage])
    },
    [chats],
  )

  const searchUsers = async (query: string) => {
    // Simulate user search
    return chats.filter((chat) => chat.name.toLowerCase().includes(query.toLowerCase()))
  }

  return {
    chats,
    messages,
    sendMessage,
    searchUsers,
    simulateIncomingMessage,
  }
}
