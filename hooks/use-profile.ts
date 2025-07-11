"use client"

import { useState } from "react"

interface NFT {
  id: string
  name: string
  imageUrl: string
  collection: string
  price?: number
}

interface Profile {
  name: string
  bio: string
  avatar: string // Can now be a data URL
  address: string
  joinedDate: string
  isVerified: boolean
  hasNFT: boolean
  postsCount: number
  followersCount: number
  followingCount: number
  tokensEarned: number
  recentActivity: Array<{
    description: string
    timestamp: string
  }>
  status: "online" | "offline" | "busy" | "custom"
  customStatusText?: string
  nfts: NFT[] // New: user's NFTs
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>({
    name: "TON Explorer",
    bio: "Building the future of decentralized social networks. Web3 enthusiast, blockchain developer, and community builder.",
    avatar: "/RajatDopeDolphin.jpg?height=100&width=100",
    address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
    joinedDate: "January 2024",
    isVerified: true,
    hasNFT: false, // Set to false initially for demo
    postsCount: 42,
    followersCount: 1250,
    followingCount: 380,
    tokensEarned: 15.7,
    recentActivity: [
      {
        description: "Received 2.5 TON in tips from your latest post",
        timestamp: "2 hours ago",
      },
      {
        description: 'Voted on DAO proposal in "TON Builders" group',
        timestamp: "5 hours ago",
      },
      {
        description: "Posted new content to social feed",
        timestamp: "1 day ago",
      },
      {
        description: 'Joined "DeFi Innovators" group',
        timestamp: "2 days ago",
      },
    ],
    status: "online",
    customStatusText: undefined,
    nfts: [
      // Mock NFT data
      {
        id: "nft1",
        name: "TONnectA Genesis Pass",
        imageUrl: "/Dolphin-5.jpg?height=150&width=150",
        collection: "TONnectA Originals",
        price: 10,
      },
      {
        id: "nft2",
        name: "CryptoPunk #7804",
        imageUrl: "/Dolphin-3.jpg?height=150&width=150",
        collection: "CryptoPunks",
        price: 4200,
      },
      {
        id: "nft3",
        name: "Bored Ape #1234",
        imageUrl: "/Dolphin-7.jpg?height=150&width=150",
        collection: "Bored Ape Yacht Club",
        price: 8000,
      },
      {
        id: "nft4",
        name: "TON Ecosystem Badge",
        imageUrl: "/Dolphin-9.jpg?height=150&width=150",
        collection: "TON Community",
        price: 0.5,
      },
    ],
  })

  const [isMinting, setIsMinting] = useState(false)
  const [mintError, setMintError] = useState<string | null>(null)

  const updateProfile = async (updates: Partial<Profile>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setProfile((prev) => ({ ...prev, ...updates }))
  }

  const mintProfileNFT = async (): Promise<boolean> => {
    setIsMinting(true)
    setMintError(null)
    try {
      // Simulate NFT minting process with a random success/failure
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate network delay

      const success = Math.random() > 0.2 // 80% chance of success

      if (success) {
        setProfile((prev) => ({ ...prev, hasNFT: true }))
        return true
      } else {
        throw new Error("Transaction failed or network error.")
      }
    } catch (error: any) {
      setMintError(error.message || "An unknown error occurred during minting.")
      return false
    } finally {
      setIsMinting(false)
    }
  }

  const updateStatus = async (newStatus: "online" | "offline" | "busy" | "custom", customText?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call
    setProfile((prev) => ({
      ...prev,
      status: newStatus,
      customStatusText: newStatus === "custom" ? customText : undefined,
    }))
  }

  return {
    profile,
    updateProfile,
    mintProfileNFT,
    isMinting,
    mintError,
    updateStatus,
  }
}
