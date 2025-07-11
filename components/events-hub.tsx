"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Plus, X, UserPlus, Check } from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useEvents } from "@/hooks/use-events"

export function EventsHub() {
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    isOnline: true,
  })
  const { isAccessibilityMode, speak } = useAccessibility()
  const { events, createEvent, joinEvent, leaveEvent } = useEvents()

  const handleCreateEvent = async () => {
    if (!newEvent.name.trim() || !newEvent.date.trim() || !newEvent.time.trim() || !newEvent.location.trim()) {
      if (isAccessibilityMode) speak("Please fill all required event fields.")
      return
    }
    if (isAccessibilityMode) speak("Creating new decentralized event.")
    try {
      await createEvent(newEvent)
      setNewEvent({ name: "", description: "", date: "", time: "", location: "", isOnline: true })
      setShowCreateEvent(false)
      if (isAccessibilityMode) speak("Event created successfully.")
    } catch (error) {
      if (isAccessibilityMode) speak("Failed to create event.")
    }
  }

  const handleJoinEvent = async (eventId: string, eventName: string) => {
    // Mock current user address
    const currentUserAddress = "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t"
    await joinEvent(eventId, currentUserAddress)
    if (isAccessibilityMode) speak(`Joined event ${eventName}.`)
  }

  const handleLeaveEvent = async (eventId: string, eventName: string) => {
    // Mock current user address
    const currentUserAddress = "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t"
    await leaveEvent(eventId, currentUserAddress)
    if (isAccessibilityMode) speak(`Left event ${eventName}.`)
  }

  // Mock current user address for checking attendance
  const currentUserAddress = "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t"

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-white">Decentralized Events</h1>
        <Button
          onClick={() => setShowCreateEvent(true)}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          aria-label="Create new event"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </motion.div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
            >
              <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={event.creator.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {event.creator.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{event.name}</h3>
                      <p className="text-xs text-gray-400">by {event.creator.name}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-400 mb-4">
                    <p className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                      {event.date}
                    </p>
                    <p className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-green-400" />
                      {event.time} UTC
                    </p>
                    <p className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-red-400" />
                      {event.location}
                    </p>
                    <p className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-yellow-400" />
                      {event.attendees.length} Attendees
                    </p>
                  </div>
                  <div className="flex justify-end">
                    {event.attendees.includes(currentUserAddress) ? (
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLeaveEvent(event.id, event.name)
                        }}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
                        aria-label={`Leave event ${event.name}`}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Leave Event
                      </Button>
                    ) : (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleJoinEvent(event.id, event.name)
                        }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        aria-label={`Join event ${event.name}`}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join Event
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateEvent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-event-title"
            >
              <Card className="bg-black/90 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle id="create-event-title" className="text-white flex items-center justify-between">
                    Create New Event
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateEvent(false)}
                      className="text-gray-400 hover:text-white"
                      aria-label="Close create event modal"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Event Name"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    aria-label="Event name"
                  />
                  <Textarea
                    placeholder="Description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                    aria-label="Event description"
                  />
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    aria-label="Event date"
                  />
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    aria-label="Event time"
                  />
                  <Input
                    placeholder="Location (e.g., Virtual (Zoom), Decentraland, City Name)"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    aria-label="Event location"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleCreateEvent} className="flex-1 bg-gradient-to-r from-green-500 to-blue-500">
                      <Check className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateEvent(false)}
                      className="border-white/20 text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
