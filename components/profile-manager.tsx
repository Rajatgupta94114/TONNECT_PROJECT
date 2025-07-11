"use client"

import type React from "react"

import { useState, useRef } from "react"

import {
  TrendingUp,
  User,
  Coins,
  Star,
  Award,
  Shield,
  Zap,
  CircleDot,
  MinusCircle,
  CircleOff,
  Edit,
  Camera,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useProfile } from "@/hooks/use-profile"
import { MintNFTPopup } from "@/components/mint-nft-popup"
import { AnimatedNumber } from "@/components/animated-number" // Import AnimatedNumber

export function ProfileManager() {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    bio: "",
    avatar: "",
  })
  const [showMintPopup, setShowMintPopup] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null)

  const { isAccessibilityMode, speak } = useAccessibility()
  const { profile, updateProfile, mintProfileNFT, isMinting, mintError, updateStatus } = useProfile()

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProfile({
      name: profile.name,
      bio: profile.bio,
      avatar: profile.avatar,
    })
    if (isAccessibilityMode) {
      speak("Editing profile mode activated. Focus is on name input.")
    }
    setTimeout(() => nameInputRef.current?.focus(), 100)
  }

  const handleSave = async () => {
    await updateProfile(editedProfile)
    setIsEditing(false)
    if (isAccessibilityMode) {
      speak("Profile updated successfully.")
    }
  }

  const handleMintNFTClick = () => {
    setShowMintPopup(true)
    if (isAccessibilityMode) {
      speak("Opening mint NFT profile dialog.")
    }
  }

  const handleMintConfirm = async () => {
    const success = await mintProfileNFT()
    if (success) {
      // The popup will handle success/error messages via its own state
    }
    return success
  }

  const handleMintPopupClose = () => {
    setShowMintPopup(false)
    if (isAccessibilityMode) {
      speak("Mint NFT profile dialog closed.")
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (isAccessibilityMode) {
      speak("Profile editing cancelled.")
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedProfile((prev) => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
      if (isAccessibilityMode) {
        speak("New avatar selected.")
      }
    }
  }

  const handleStatusChange = async (newStatus: "online" | "offline" | "busy" | "custom") => {
    await updateStatus(newStatus, profile.customStatusText)
    if (isAccessibilityMode) speak(`Status set to ${newStatus}.`)
  }

  const handleCustomStatusTextChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateStatus("custom", e.target.value)
    if (isAccessibilityMode) speak(`Custom status text updated to ${e.target.value}.`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CircleDot className="w-4 h-4 text-green-500" />
      case "busy":
        return <MinusCircle className="w-4 h-4 text-yellow-500" />
      case "offline":
        return <CircleOff className="w-4 h-4 text-gray-500" />
      case "custom":
        return <CircleDot className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  const stats = [
    { label: "Posts", value: profile.postsCount, icon: TrendingUp },
    { label: "Followers", value: profile.followersCount, icon: User },
    { label: "Following", value: profile.followingCount, icon: User },
    { label: "TON Earned", value: profile.tokensEarned, icon: Coins, decimals: 1, suffix: " TON" },
  ]

  const achievements = [
    { name: "Early Adopter", icon: Star, color: "text-yellow-400" },
    { name: "Content Creator", icon: Award, color: "text-purple-400" },
    { name: "Community Builder", icon: Shield, color: "text-blue-400" },
    { name: "Crypto Native", icon: Zap, color: "text-green-400" },
  ]

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-black/20 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar
                  className="w-24 h-24 md:w-32 md:h-32 border-4 border-transparent transition-all duration-300 ease-in-out"
                  style={{ borderColor: profile.hasNFT ? "url(#gradient-border)" : "transparent" }}
                >
                  <AvatarImage src={isEditing ? editedProfile.avatar : profile.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                    {(isEditing ? editedProfile.name : profile.name).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* SVG for gradient border */}
                {profile.hasNFT && (
                  <svg width="0" height="0" className="absolute">
                    <defs>
                      <linearGradient id="gradient-border" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" /> {/* Purple */}
                        <stop offset="100%" stopColor="#EC4899" /> {/* Pink */}
                      </linearGradient>
                    </defs>
                  </svg>
                )}
                {isEditing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      id="avatar-upload"
                      className="hidden"
                      onChange={handleAvatarChange}
                      aria-label="Upload new profile picture"
                    />
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600"
                      aria-label="Change profile picture"
                      onClick={() => document.getElementById("avatar-upload")?.click()}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      ref={nameInputRef}
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Your name"
                      aria-label="Edit name"
                    />
                    <Textarea
                      ref={bioTextareaRef}
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Tell us about yourself..."
                      rows={3}
                      aria-label="Edit bio"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="border-white/20 text-white hover:bg-white/5 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                      <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                      {profile.isVerified && (
                        <Badge className="bg-blue-500 text-white" aria-label="Verified profile">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {profile.hasNFT && (
                        <Badge className="bg-purple-500 text-white" aria-label="NFT profile owned">
                          <Star className="w-3 h-3 mr-1" />
                          NFT Profile
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4">{profile.bio}</p>
                    <div className="text-sm text-gray-400 mb-4">
                      <p>
                        Wallet: {profile.address.slice(0, 8)}...{profile.address.slice(-6)}
                      </p>
                      <p className="flex items-center">
                        Status: {getStatusIcon(profile.status)}
                        <span className="ml-1 capitalize">
                          {profile.status === "custom" ? profile.customStatusText : profile.status}
                        </span>
                      </p>
                      <p>Joined: {profile.joinedDate}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleEdit}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/5 bg-transparent"
                        aria-label="Edit your profile"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      {!profile.hasNFT && (
                        <Button
                          onClick={handleMintNFTClick}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          aria-label="Mint a new NFT profile"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Mint NFT Profile
                        </Button>
                      )}
                    </div>
                    {/* Status Selector */}
                    <div className="mt-4 flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">Set Status:</span>
                      <Select value={profile.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[180px] bg-black/20 border-white/10 text-white">
                          <SelectValue placeholder="Set Status" aria-label="Select your online status" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10 text-white">
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      {profile.status === "custom" && (
                        <Input
                          placeholder="Custom status message"
                          value={profile.customStatusText || ""}
                          onChange={handleCustomStatusTextChange}
                          className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                          aria-label="Enter custom status message"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="bg-black/20 backdrop-blur-xl border-white/10">
              <CardContent className="p-4 text-center">
                <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" aria-hidden="true" />
                <div className="text-2xl font-bold text-white">
                  <AnimatedNumber value={stat.value as number} decimals={stat.decimals} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-black/20 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-400" aria-hidden="true" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                  aria-label={`Achievement: ${achievement.name}`}
                >
                  <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${achievement.color}`} aria-hidden="true" />
                  <p className="text-white text-sm font-medium">{achievement.name}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* NFT Showcase */}
      {profile.nfts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-purple-400" aria-hidden="true" />
                My NFTs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <AnimatePresence>
                  {profile.nfts.map((nft, index) => (
                    <motion.div
                      key={nft.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative group rounded-lg overflow-hidden border border-white/10 bg-white/5 hover:scale-105 transition-transform duration-300"
                      aria-label={`NFT: ${nft.name} from ${nft.collection}`}
                    >
                      <img
                        src={nft.imageUrl || "/placeholder.svg"}
                        alt={nft.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="text-white font-medium text-sm truncate">{nft.name}</h4>
                        <p className="text-gray-400 text-xs truncate">{nft.collection}</p>
                        {nft.price !== undefined && (
                          <p className="text-blue-400 text-xs font-semibold mt-1">{nft.price} TON</p>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button variant="secondary" size="sm" aria-label={`View details for ${nft.name}`}>
                          View NFT
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="bg-black/20 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" aria-live="polite">
              {profile.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.description}</p>
                    <p className="text-gray-400 text-xs">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mint NFT Profile Popup */}
      <MintNFTPopup
        isOpen={showMintPopup}
        onClose={handleMintPopupClose}
        onMint={handleMintConfirm}
        isMinting={isMinting}
        mintError={mintError}
      />
    </div>
  )
}
