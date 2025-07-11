"use client"

import { useState } from "react"

interface Group {
  id: string
  name: string
  description: string
  avatar: string
  memberCount: number
  adminCount: number
  moderatorCount: number
  isTokenGated: boolean
  requiresToken: boolean
  tokenRequirement?: string
  activeProposals: Array<{
    id: string
    title: string
    votesFor: number
    votesAgainst: number
    timeLeft: string
  }>
}

export function useGroupChats() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      name: "TON Developers",
      description: "A community for TON blockchain developers to share knowledge and collaborate on projects.",
      avatar: "/Dolphin-3.jpg?height=50&width=50",
      memberCount: 1250,
      adminCount: 3,
      moderatorCount: 8,
      isTokenGated: true,
      requiresToken: true,
      tokenRequirement: "10 TON",
      activeProposals: [
        {
          id: "p1",
          title: "Should we implement new smart contract standards?",
          votesFor: 45,
          votesAgainst: 12,
          timeLeft: "2 days left",
        },
        {
          id: "p2",
          title: "Increase minimum token requirement to 15 TON",
          votesFor: 23,
          votesAgainst: 34,
          timeLeft: "5 days left",
        },
      ],
    },
    {
      id: "2",
      name: "NFT Creators Hub",
      description: "Artists, creators, and collectors discussing NFT trends and opportunities.",
      avatar: "/Dolphin-4.jpg?height=50&width=50",
      memberCount: 890,
      adminCount: 2,
      moderatorCount: 5,
      isTokenGated: false,
      requiresToken: false,
      activeProposals: [
        {
          id: "p3",
          title: "Weekly featured artist spotlight",
          votesFor: 67,
          votesAgainst: 8,
          timeLeft: "1 day left",
        },
      ],
    },
    {
      id: "3",
      name: "DeFi Enthusiasts",
      description: "Discussing decentralized finance protocols, yield farming, and investment strategies.",
      avatar: "/Dolphin-5.jpg?height=50&width=50",
      memberCount: 2100,
      adminCount: 4,
      moderatorCount: 12,
      isTokenGated: true,
      requiresToken: true,
      tokenRequirement: "5 TON",
      activeProposals: [],
    },
    {
      id: "4",
      name: "TON Gaming Guild",
      description: "For gamers and developers building on TON. Discuss play-to-earn, game NFTs, and more!",
      avatar: "/Dolphin-6.jpg?height=50&width=50",
      memberCount: 350,
      adminCount: 1,
      moderatorCount: 3,
      isTokenGated: false,
      requiresToken: false,
      activeProposals: [],
    },
    {
      id: "5",
      name: "Web3 Founders",
      description: "A private group for founders building decentralized applications on TON.",
      avatar: "/Dolphin-7.jpg?height=50&width=50",
      memberCount: 80,
      adminCount: 5,
      moderatorCount: 2,
      isTokenGated: true,
      requiresToken: true,
      tokenRequirement: "50 TON",
      activeProposals: [
        {
          id: "p4",
          title: "Partnership with major Web3 accelerator",
          votesFor: 70,
          votesAgainst: 5,
          timeLeft: "3 days left",
        },
      ],
    },
  ])

  const createGroup = async (groupData: { name: string; description: string; tokenRequirement?: string }) => {
    // Simulate group creation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupData.name,
      description: groupData.description,
      avatar: "/placeholder.svg?height=50&width=50", // Default avatar for new groups
      memberCount: 1, // Creator is the first member
      adminCount: 1,
      moderatorCount: 0,
      isTokenGated: !!groupData.tokenRequirement,
      requiresToken: !!groupData.tokenRequirement,
      tokenRequirement: groupData.tokenRequirement,
      activeProposals: [],
    }
    setGroups((prev) => [newGroup, ...prev])
    console.log("Creating group:", groupData)
  }

  const joinGroup = async (groupId: string) => {
    // Simulate joining group
    console.log("Joining group:", groupId)
  }

  const voteOnProposal = async (proposalId: string, vote: "yes" | "no") => {
    // Simulate voting
    console.log(`Voting ${vote} on proposal ${proposalId}`)
  }

  return {
    groups,
    createGroup,
    joinGroup,
    voteOnProposal,
  }
}
