"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Plus, Vote, Crown, Shield, Coins, Search, UserPlus, X } from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useGroupChats } from "@/hooks/use-group-chats"
import { Textarea } from "@/components/ui/textarea"

export function GroupChats() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [newGroupTokenRequirement, setNewGroupTokenRequirement] = useState("")
  const { isAccessibilityMode, speak } = useAccessibility()
  const { groups, createGroup, joinGroup, voteOnProposal } = useGroupChats()

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId)
    const group = groups.find((g) => g.id === groupId)
    if (isAccessibilityMode && group) {
      speak(`Opened ${group.name} group chat`)
    }
  }

  const handleVote = async (proposalId: string, vote: "yes" | "no") => {
    await voteOnProposal(proposalId, vote)
    if (isAccessibilityMode) {
      speak(`Voted ${vote} on proposal`)
    }
  }

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !newGroupDescription.trim()) {
      if (isAccessibilityMode) speak("Group name and description are required.")
      return
    }
    if (isAccessibilityMode) speak("Creating new DAO group.")
    await createGroup({
      name: newGroupName,
      description: newGroupDescription,
      tokenRequirement: newGroupTokenRequirement || undefined,
    })
    setNewGroupName("")
    setNewGroupDescription("")
    setNewGroupTokenRequirement("")
    setShowCreateGroup(false)
    if (isAccessibilityMode) speak("DAO group created successfully.")
  }

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-white">DAO Groups</h1>
        <Button
          onClick={() => setShowCreateGroup(true)}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups..."
            className="pl-10 bg-black/20 border-white/10 text-white"
            aria-label="Search groups"
          />
        </div>
      </motion.div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }} // Faster animation
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => handleGroupSelect(group.id)}
            >
              <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={group.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        {group.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{group.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {group.memberCount}
                        </Badge>
                        {group.isTokenGated && (
                          <Badge className="bg-yellow-500 text-black text-xs">
                            <Coins className="w-3 h-3 mr-1" />
                            Token Gated
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">{group.description}</p>

                  {/* Active Proposals */}
                  {group.activeProposals.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-white font-medium flex items-center">
                        <Vote className="w-4 h-4 mr-2 text-blue-400" />
                        Active Votes
                      </h4>
                      {group.activeProposals.slice(0, 2).map((proposal) => (
                        <div key={proposal.id} className="p-3 bg-white/5 rounded-lg">
                          <p className="text-white text-sm mb-2">{proposal.title}</p>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">
                              {proposal.votesFor} Yes • {proposal.votesAgainst} No
                            </span>
                            <span className="text-xs text-gray-400">{proposal.timeLeft}</span>
                          </div>
                          <Progress
                            value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}
                            className="h-2"
                          />
                          <div className="flex space-x-2 mt-2">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleVote(proposal.id, "yes")
                              }}
                              className="bg-green-500 hover:bg-green-600 text-xs"
                            >
                              Yes
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleVote(proposal.id, "no")
                              }}
                              className="bg-red-500 hover:bg-red-600 text-xs"
                            >
                              No
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Group Stats */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span className="flex items-center">
                        <Crown className="w-3 h-3 mr-1" />
                        {group.adminCount} Admins
                      </span>
                      <span className="flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        {group.moderatorCount} Mods
                      </span>
                    </div>
                    {group.requiresToken && (
                      <Badge variant="outline" className="text-xs">
                        {group.tokenRequirement} TON
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Featured Groups */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-black/20 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-400" />
              Featured Communities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "TON Builders",
                  description: "Building the future of TON ecosystem",
                  members: 1250,
                  category: "Development",
                },
                {
                  name: "DeFi Innovators",
                  description: "Decentralized finance discussions and proposals",
                  members: 890,
                  category: "Finance",
                },
                {
                  name: "NFT Creators",
                  description: "Artists and creators in the NFT space",
                  members: 2100,
                  category: "Art",
                },
              ].map((group, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{group.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {group.category}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{group.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{group.members.toLocaleString()} members</span>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      <UserPlus className="w-3 h-3 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateGroup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="bg-black/90 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Create DAO Group
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateGroup(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    aria-label="Group name"
                  />
                  <Textarea
                    placeholder="Description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                    aria-label="Group description"
                  />
                  <Input
                    placeholder="Token requirement (e.g., 5 TON, optional)"
                    value={newGroupTokenRequirement}
                    onChange={(e) => setNewGroupTokenRequirement(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    aria-label="Token requirement"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleCreateGroup} className="flex-1 bg-gradient-to-r from-green-500 to-blue-500">
                      Create Group
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateGroup(false)}
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
