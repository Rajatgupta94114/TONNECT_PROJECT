"use client"

import { useState, useCallback } from "react"

interface Reel {
  id: string
  videoUrl: string
  thumbnailUrl: string
  author: {
    name: string
    address: string
    avatar: string
  }
  description: string
  likes: number
  commentsCount: number
  isLiked: boolean
}

export function useReels() {
  const [reels, setReels] = useState<Reel[]>([
    {
      id: "r1",
      videoUrl: "/tonnect5.mp4", // Your local video
      thumbnailUrl: "/placeholder.svg?height=300&width=200",
      author: {
        name: "TON Explorer",
        address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
        avatar: "/Dolphin-15.jpg?height=40&width=40",
      },
      description: "Exploring the decentralized social future with TONnectA! #Web3 #TON",
      likes: 125,
      commentsCount: 15,
      isLiked: false,
    },
    {
      id: "r2",
      videoUrl: "/tonnect6.mp4", // Your local video
      thumbnailUrl: "/placeholder.svg?height=300&width=200",
      author: {
        name: "NFT Artist",
        address: "EQC5zVduIE_8D0LqVJIzXlFRgKXOQi_PwXhMFLjV7_AtVids",
        avatar: "/Dolphin-17.jpg?height=40&width=40",
      },
      description: "My latest NFT collection dropping soon! Get ready for some digital art magic. ✨",
      likes: 230,
      commentsCount: 28,
      isLiked: true,
    },
    {
      id: "r3",
      videoUrl: "/tonnect3.mp4", // Your local video
      thumbnailUrl: "/placeholder.svg?height=300&width=200",
      author: {
        name: "DeFiMaxi",
        address: "EQA_DEFI_MAXI_ADDRESS_1234567890ABCDEF",
        avatar: "/Dolphin-19.jpg?height=40&width=40",
      },
      description: "Yield farming on TON is next level! Don't miss out on these opportunities. 💰 #DeFi",
      likes: 98,
      commentsCount: 10,
      isLiked: false,
    },
    {
      id: "r4",
      videoUrl: "/tonnect4.mp4", // Your local video
      thumbnailUrl: "/placeholder.svg?height=300&width=200",
      author: {
        name: "CryptoBuilder",
        address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
        avatar: "/Dolphin-16.jpg?height=40&width=40",
      },
      description: "Building a new dApp on TON. The developer experience is amazing! 💻",
      likes: 180,
      commentsCount: 20,
      isLiked: false,
    },
  ])

  const likeReel = useCallback((reelId: string) => {
    setReels((prevReels) =>
      prevReels.map((reel) =>
        reel.id === reelId
          ? { ...reel, isLiked: !reel.isLiked, likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1 }
          : reel,
      ),
    )
  }, [])

  const commentOnReel = useCallback((reelId: string, commentContent: string) => {
    console.log(`Commenting on reel ${reelId}: ${commentContent}`)
    setReels((prevReels) =>
      prevReels.map((reel) => (reel.id === reelId ? { ...reel, commentsCount: reel.commentsCount + 1 } : reel)),
    )
  }, [])

  const loadMoreReels = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const newReels: Reel[] = [
      {
        id: `r${Date.now()}-5`,
        videoUrl: "/tonnect1.mp4", // Your local video
        thumbnailUrl: "/placeholder.svg?height=300&width=200",
        author: {
          name: "New Explorer",
          address: "EQ_NEW_EXPLORER_ADDRESS_1234567890",
          avatar: "/Dolphin-1.jpg?height=40&width=40",
        },
        description: "Just discovered TONnectA! This is revolutionary. #Decentralized",
        likes: 50,
        commentsCount: 5,
        isLiked: false,
      },
      {
        id: `r${Date.now()}-6`,
        videoUrl: "/tonnect2.mp4", // Your local video
        thumbnailUrl: "/placeholder.svg?height=300&width=200",
        author: {
          name: "Web3 Creator",
          address: "EQ_WEB3_CREATOR_ADDRESS_1234567890",
          avatar: "/Dolphin-5.jpg?height=40&width=40",
        },
        description: "My first short video on the blockchain! What do you think? 🎨",
        likes: 75,
        commentsCount: 8,
        isLiked: false,
      },
    ]
    setReels((prevReels) => [...prevReels, ...newReels])
  }, [])

  return {
    reels,
    likeReel,
    commentOnReel,
    loadMoreReels,
  }
}