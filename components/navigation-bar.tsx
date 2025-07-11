"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, MessageCircle, User, Users, CalendarDays, Film } from "lucide-react" // Import Film for Reels
import { useAccessibility } from "@/hooks/use-accessibility"

interface NavigationBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  const { isAccessibilityMode, speak } = useAccessibility()

  const tabs = [
    { id: "feed", label: "Feed", icon: Home },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "groups", label: "Groups", icon: Users },
    { id: "events", label: "Events", icon: CalendarDays },
    { id: "reels", label: "Reels", icon: Film }, // New Reels tab
    { id: "profile", label: "Profile", icon: User },
  ]

  const handleTabChange = (tabId: string, tabLabel: string) => {
    onTabChange(tabId)
    if (isAccessibilityMode) {
      speak(`Switched to ${tabLabel}`)
    }
  }

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 px-4 py-2"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => handleTabChange(tab.id, tab.label)}
              className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              aria-label={`Navigate to ${tab.label}`}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : ""}`} />
              </motion.div>
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"
                />
              )}
            </Button>
          )
        })}
      </div>
    </motion.nav>
  )
}
