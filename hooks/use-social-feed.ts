"use client"

import { useState } from "react"

interface Comment {
  id: string
  author: {
    name: string
    address: string
    avatar: string
  }
  content: string
  timestamp: string
}

interface PollOption {
  id: string
  text: string
  votes: number
}

interface Poll {
  question: string
  options: PollOption[]
  totalVotes: number
  userVotedOptionId: string | null // To track if current user voted
}

interface Post {
  id: string
  content: string
  author: {
    name: string
    address: string
    avatar: string
  }
  timestamp: string
  likes: number
  comments: Comment[]
  isLiked: boolean
  media?: {
    url: string
    alt: string
    hash?: string
  }
  ipfsHash?: string
  type: "post" | "poll" // New: type of content
  poll?: Poll // New: optional poll data
  summary?: string // New: optional AI-generated summary
}

export function useSocialFeed() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      content:
        "Just minted my first NFT profile on TON! The future of decentralized identity is here. No more centralized platforms controlling our data! 🚀 This is a longer post to demonstrate the summarization feature. It talks about the benefits of decentralized identity, how it empowers users, and removes the need for intermediaries. The user expresses excitement about the possibilities of Web3 and how it will change the way we interact online, giving us true ownership and control over our digital lives. This is a significant step towards a more open and fair internet.",
      author: {
        name: "CryptoBuilder",
        address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
        avatar: "/Dolphin-1.jpg?height=40&width=40",
      },
      timestamp: "2h ago",
      likes: 24,
      comments: [
        {
          id: "c1-1",
          author: {
            name: "Web3Native",
            address: "EQBvW8Z5huBkMJYdnfAEM5JqTNkuJmt_cX1-Ti6p4dhk2Sub",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: "Awesome! Love seeing more decentralized identities.",
          timestamp: "1h ago",
        },
        {
          id: "c1-2",
          author: {
            name: "DAOEnthusiast",
            address: "EQC5zVduIE_8D0LqVJIzXlFRgKXOQi_PwXhMFLjV7_AtVids",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: "Congrats! What platform did you use?",
          timestamp: "30m ago",
        },
      ],
      isLiked: false,
      type: "post",
    },
    {
      id: "2",
      content:
        "Love how TONnectA gives us true ownership of our social interactions. No algorithms, no ads, just pure human connection powered by blockchain technology. This platform truly embodies the spirit of Web3, allowing users to connect freely without worrying about their data being exploited. It's a refreshing change from traditional social media, offering a more secure and private environment for communication and community building. The future of social is decentralized!",
      author: {
        name: "Web3Native",
        address: "EQBvW8Z5huBkMJYdnfAEM5JqTNkuJmt_cX1-Ti6p4dhk2Sub",
        avatar: "/Dolphin-2.jpg?height=40&width=40",
      },
      timestamp: "4h ago",
      likes: 18,
      comments: [
        {
          id: "c2-1",
          author: {
            name: "CryptoBuilder",
            address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: "Exactly! It's a breath of fresh air.",
          timestamp: "2h ago",
        },
      ],
      isLiked: true,
      media: {
        url: "/tonblockchain1.jpg?height=300&width=500",
        alt: "Decentralized social network visualization",
      },
      type: "post",
    },
    {
      id: "poll-1",
      content: "Decentralized Poll: What's your favorite aspect of Web3?",
      author: {
        name: "DAOEnthusiast",
        address: "EQC5zVduIE_8D0LqVJIzXlFRgKXOQi_PwXhMFLjV7_AtVids",
        avatar: "/Dolphin-3.jpg?height=40&width=40",
      },
      timestamp: "1h ago",
      likes: 10,
      comments: [],
      isLiked: false,
      type: "poll",
      poll: {
        question: "What's your favorite aspect of Web3?",
        options: [
          { id: "opt1", text: "Decentralization", votes: 50 },
          { id: "opt2", text: "User Ownership", votes: 75 },
          { id: "opt3", text: "Transparency", votes: 30 },
          { id: "opt4", text: "Innovation", votes: 60 },
        ],
        totalVotes: 215,
        userVotedOptionId: null,
      },
    },
    {
      id: "3",
      content:
        "The DAO voting system in groups is revolutionary. Finally, community governance that actually works! Just voted on our first proposal. 🗳️",
      author: {
        name: "DAOEnthusiast",
        address: "EQC5zVduIE_8D0LqVJIzXlFRgKXOQi_PwXhMFLjV7_AtVids",
        avatar: "/Dolphin-4.jpg?height=40&width=40",
      },
      timestamp: "6h ago",
      likes: 31,
      comments: [],
      isLiked: false,
      type: "post",
    },
    {
      id: "4",
      content: "Exploring the new TON DeFi protocols. So much innovation happening in this space! #TON #DeFi",
      author: {
        name: "DeFiMaxi",
        address: "EQA_DEFI_MAXI_ADDRESS_1234567890ABCDEF",
        avatar: "/Dolphin-5.jpg?height=40&width=40",
      },
      timestamp: "8h ago",
      likes: 45,
      comments: [
        {
          id: "c4-1",
          author: {
            name: "BlockchainGeek",
            address: "EQB_BLOCKCHAIN_GEEK_ADDRESS_1234567890ABCDEF",
            avatar: "/Dolphin-6.jpg?height=40&width=40",
          },
          content: "Any specific protocols you'd recommend checking out?",
          timestamp: "1h ago",
        },
      ],
      isLiked: false,
      type: "post",
    },
    {
      id: "poll-2",
      content: "Quick Poll: Should TONnectA add video calls?",
      author: {
        name: "TONnectA Admin",
        address: "EQ_TONNECTA_ADMIN_ADDRESS_1234567890ABCDEF",
        avatar: "/Dolphin-7.jpg?height=40&width=40",
      },
      timestamp: "1 day ago",
      likes: 20,
      comments: [],
      isLiked: false,
      type: "poll",
      poll: {
        question: "Should TONnectA add video calls?",
        options: [
          { id: "optA", text: "Yes, absolutely!", votes: 120 },
          { id: "optB", text: "Maybe later", votes: 40 },
          { id: "optC", text: "No, focus on core features", votes: 15 },
        ],
        totalVotes: 175,
        userVotedOptionId: null,
      },
    },
    {
      id: "5",
      content: "Just finished a deep dive into TON's sharding mechanism. Truly scalable blockchain architecture! 🤯",
      author: {
        name: "BlockchainGeek",
        address: "EQB_BLOCKCHAIN_GEEK_ADDRESS_1234567890ABCDEF",
        avatar: "/Dolphin-6.jpg?height=40&width=40",
      },
      timestamp: "1 day ago",
      likes: 50,
      comments: [],
      isLiked: true,
      media: {
        url: "/tonblockchain2.jpg?height=400&width=600",
        alt: "Blockchain architecture diagram",
      },
      type: "post",
    },
    {
      id: "6",
      content:
        "Excited for the upcoming TON Hackathon! Who else is participating? Let's build something amazing! #TONHackathon",
      author: {
        name: "DevBuilder",
        address: "EQC_DEV_BUILDER_ADDRESS_1234567890ABCDEF",
        avatar: "/Dolphin-8.jpg?height=40&width=40",
      },
      timestamp: "1 day ago",
      likes: 28,
      comments: [
        {
          id: "c6-1",
          author: {
            name: "CryptoBuilder",
            address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: "I'm in! Looking forward to it.",
          timestamp: "12h ago",
        },
        {
          id: "c6-2",
          author: {
            name: "Web3Native",
            address: "EQBvW8Z5huBkMJYdnfAEM5JqTNkuJmt_cX1-Ti6p4dhk2Sub",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: "Count me in too! What are you planning to build?",
          timestamp: "8h ago",
        },
      ],
      isLiked: false,
      type: "post",
    },
  ])

  const createPost = async (content: string, media?: File) => {
    try {
      let mediaHash = null
      let mediaUrl = null

      if (media) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        mediaHash = `mock-ipfs-hash-${Date.now()}`
        mediaUrl = URL.createObjectURL(media)
      }

      const postData = {
        content,
        author: {
          name: "You",
          address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        timestamp: "now",
        media: mediaHash
          ? {
              hash: mediaHash,
              url: mediaUrl,
              alt: "User uploaded content",
            }
          : undefined,
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      const postResultHash = `mock-post-ipfs-hash-${Date.now()}`

      const newPost: Post = {
        id: Date.now().toString(),
        content,
        author: postData.author,
        timestamp: "now",
        likes: 0,
        comments: [],
        isLiked: false,
        ipfsHash: postResultHash,
        media: postData.media
          ? {
              url: postData.media.url,
              alt: postData.media.alt,
              hash: postData.media.hash,
            }
          : undefined,
        type: "post", // Default to post type
      }

      setPosts((prev) => [newPost, ...prev])
      return postResultHash
    } catch (error) {
      console.error("Failed to create post:", error)
      throw error
    }
  }

  const createPoll = async (question: string, options: string[]) => {
    if (!question.trim() || options.length < 2) {
      throw new Error("Poll requires a question and at least two options.")
    }

    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    const newPoll: Post = {
      id: `poll-${Date.now()}`,
      content: `Decentralized Poll: ${question}`, // Content for feed display
      author: {
        name: "You",
        address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: "just now",
      likes: 0,
      comments: [],
      isLiked: false,
      type: "poll",
      poll: {
        question,
        options: options.map((text, index) => ({ id: `opt${index + 1}-${Date.now()}`, text, votes: 0 })),
        totalVotes: 0,
        userVotedOptionId: null,
      },
    }
    setPosts((prev) => [newPoll, ...prev])
  }

  const voteOnPoll = async (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && post.type === "poll" && post.poll) {
          const newOptions = post.poll.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt,
          )
          const newTotalVotes = post.poll.totalVotes + 1
          return {
            ...post,
            poll: {
              ...post.poll,
              options: newOptions,
              totalVotes: newTotalVotes,
              userVotedOptionId: optionId, // Mark as voted
            },
          }
        }
        return post
      }),
    )
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay
  }

  const likePost = async (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    )
  }

  const tipUser = async (postId: string, amount: number) => {
    // Simulate tipping with TON tokens
    console.log(`Tipping ${amount} TON to post ${postId}`)
    // In a real app, this would involve a TON transaction
  }

  const commentOnPost = async (postId: string, content: string) => {
    if (!content.trim()) return

    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "You", // Replace with actual user's name
        address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t", // Replace with actual user's address
        avatar: "/placeholder.svg?height=40&width=40", // Replace with actual user's avatar
      },
      content,
      timestamp: "just now",
    }

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
            }
          : post,
      ),
    )
    console.log(`Commented on post ${postId}: ${content}`)
    // In a real app, this would involve storing the comment on IPFS/blockchain
  }

  const summarizePost = async (postId: string, content: string): Promise<string | null> => {
    try {
      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textToSummarize: content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch summary")
      }

      const data = await response.json()
      setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, summary: data.summary } : post)))
      return data.summary
    } catch (error) {
      console.error("Error summarizing post:", error)
      return null
    }
  }

  // Sorting logic
  const getSortedPosts = (sortOrder: "latest" | "most-liked" | "most-commented") => {
    return [...posts].sort((a, b) => {
      if (sortOrder === "latest") {
        // For simplicity, using Date.now() for "now" and parsing "Xh ago"
        const timeA = a.timestamp === "now" ? Date.now() : Date.now() - Number.parseInt(a.timestamp) * 3600 * 1000 // Rough estimate
        const timeB = b.timestamp === "now" ? Date.now() : Date.now() - Number.parseInt(b.timestamp) * 3600 * 1000
        return timeB - timeA
      } else if (sortOrder === "most-liked") {
        return b.likes - a.likes
      } else if (sortOrder === "most-commented") {
        return b.comments.length - a.comments.length
      }
      return 0
    })
  }

  return {
    posts,
    createPost,
    createPoll,
    voteOnPoll,
    likePost,
    tipUser,
    commentOnPost,
    summarizePost, // Expose new summarize function
    getSortedPosts,
  }
}
