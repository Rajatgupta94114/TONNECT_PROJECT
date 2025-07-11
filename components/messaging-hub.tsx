"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Lock, Search, Phone, Video, MoreVertical, CircleDot, CircleOff, MinusCircle } from "lucide-react" // Import status icons
import { useAccessibility } from "@/hooks/use-accessibility"
import { useMessaging } from "@/hooks/use-messaging"

export function MessagingHub() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isAccessibilityMode, speak } = useAccessibility()
  const { chats, messages, sendMessage, searchUsers, simulateIncomingMessage } = useMessaging()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate incoming messages for the selected chat
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (selectedChat) {
      interval = setInterval(() => {
        simulateIncomingMessage(selectedChat)
      }, 10000) // Simulate a new message every 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [selectedChat, simulateIncomingMessage])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return

    if (isAccessibilityMode) {
      speak("Sending encrypted message")
    }

    await sendMessage(selectedChat, newMessage)
    setNewMessage("")

    if (isAccessibilityMode) {
      speak("Message sent securely")
    }
  }

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId)
    const chat = chats.find((c) => c.id === chatId)
    if (isAccessibilityMode && chat) {
      speak(`Opening chat with ${chat.name}`)
    }
  }

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CircleDot className="w-3 h-3 text-green-500" />
      case "busy":
        return <MinusCircle className="w-3 h-3 text-yellow-500" />
      case "offline":
        return <CircleOff className="w-3 h-3 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Chat List */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/10 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Lock className="w-5 h-5 mr-2 text-green-400" />
            Encrypted Chats
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="pl-10 bg-white/5 border-white/10 text-white"
              aria-label="Search contacts"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChatSelect(chat.id)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedChat === chat.id ? "bg-blue-500/20 border-l-4 border-blue-500" : "hover:bg-white/5"
                }`}
                role="button"
                aria-label={`Chat with ${chat.name}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {chat.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-400">{chat.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                    {chat.unreadCount > 0 && <Badge className="mt-1 bg-blue-500 text-white">{chat.unreadCount}</Badge>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/10 lg:col-span-2 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={chats.find((c) => c.id === selectedChat)?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {chats
                        .find((c) => c.id === selectedChat)
                        ?.name.slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-white">{chats.find((c) => c.id === selectedChat)?.name}</h3>
                    <p className="text-xs text-green-400 flex items-center">
                      <Lock className="w-3 h-3 mr-1" />
                      End-to-end encrypted
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages
                    .filter((msg) => msg.chatId === selectedChat)
                    .map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.isSent
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                              : "bg-white/10 text-gray-200"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-70">{message.timestamp}</span>
                            {message.isSent && (
                              <div className="flex items-center">
                                <Lock className="w-3 h-3 ml-2 opacity-70" />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type an encrypted message..."
                  className="flex-1 bg-white/5 border-white/10 text-white"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  aria-label="Type message"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Secure Messaging</h3>
              <p className="text-gray-400">Select a chat to start encrypted messaging</p>
            </motion.div>
          </div>
        )}
      </Card>
    </div>
  )
}
