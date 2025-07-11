"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Send, Coins, ImageIcon, Video, Mic, X, Plus, BarChart2, Lightbulb } from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useSocialFeed } from "@/hooks/use-social-feed"
import { TipModal } from "./tip-modal"

export function SocialFeed() {
  const [newPost, setNewPost] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({})
  const [showCommentsForPost, setShowCommentsForPost] = useState<{ [key: string]: boolean }>({})
  const [showTipModal, setShowTipModal] = useState(false)
  const [currentTippingPost, setCurrentTippingPost] = useState<{
    id: string
    authorName: string
    authorAddress: string
  } | null>(null)
  const [activeComposerTab, setActiveComposerTab] = useState<"post" | "poll">("post")
  const [newPollQuestion, setNewPollQuestion] = useState("")
  const [newPollOptions, setNewPollOptions] = useState<string[]>(["", ""])
  const [isCreatingPoll, setIsCreatingPoll] = useState(false)
  const [sortOrder, setSortOrder] = useState<"latest" | "most-liked" | "most-commented">("latest")
  const [summarizingPostId, setSummarizingPostId] = useState<string | null>(null)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const { isAccessibilityMode, speak } = useAccessibility()
  const { posts, createPost, createPoll, voteOnPoll, likePost, tipUser, commentOnPost, summarizePost, getSortedPosts } =
    useSocialFeed()

  const sortedPosts = getSortedPosts(sortOrder)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0])
      if (isAccessibilityMode) {
        speak("Image selected for post")
      }
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
    if (isAccessibilityMode) {
      speak("Selected image removed")
    }
  }

  const handlePost = async () => {
    if (!newPost.trim() && !selectedImage) return

    setIsPosting(true)
    if (isAccessibilityMode) {
      speak("Publishing your post to the blockchain")
    }

    try {
      await createPost(newPost, selectedImage || undefined)
      setNewPost("")
      setSelectedImage(null)
      if (imageInputRef.current) {
        imageInputRef.current.value = ""
      }
      if (isAccessibilityMode) {
        speak("Post published successfully")
      }
    } catch (error) {
      if (isAccessibilityMode) {
        speak("Failed to publish post")
      }
    } finally {
      setIsPosting(false)
    }
  }

  const handleCreatePoll = async () => {
    if (!newPollQuestion.trim() || newPollOptions.filter(Boolean).length < 2) {
      if (isAccessibilityMode) speak("Please enter a question and at least two options for the poll.")
      return
    }

    setIsCreatingPoll(true)
    if (isAccessibilityMode) {
      speak("Creating your decentralized poll.")
    }

    try {
      await createPoll(
        newPollQuestion,
        newPollOptions.filter(Boolean), // Filter out empty options
      )
      setNewPollQuestion("")
      setNewPollOptions(["", ""])
      if (isAccessibilityMode) {
        speak("Poll created successfully.")
      }
    } catch (error) {
      if (isAccessibilityMode) {
        speak("Failed to create poll.")
      }
    } finally {
      setIsCreatingPoll(false)
    }
  }

  const handleAddPollOption = () => {
    setNewPollOptions([...newPollOptions, ""])
    if (isAccessibilityMode) speak("Added new poll option field.")
  }

  const handlePollOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newPollOptions]
    updatedOptions[index] = value
    setNewPollOptions(updatedOptions)
  }

  const handleRemovePollOption = (index: number) => {
    const updatedOptions = newPollOptions.filter((_, i) => i !== index)
    setNewPollOptions(updatedOptions)
    if (isAccessibilityMode) speak("Removed poll option.")
  }

  const handleVoteOnPoll = async (postId: string, optionId: string, optionText: string) => {
    await voteOnPoll(postId, optionId)
    if (isAccessibilityMode) {
      speak(`Voted for ${optionText} on the poll.`)
    }
  }

  const handleLike = async (postId: string) => {
    await likePost(postId)
    if (isAccessibilityMode) {
      speak("Post liked")
    }
  }

  const handleTip = async (postId: string, authorName: string, authorAddress: string) => {
    setCurrentTippingPost({ id: postId, authorName, authorAddress })
    setShowTipModal(true)
    if (isAccessibilityMode) {
      speak(`Opening tip dialog for ${authorName}.`)
    }
  }

  const handleConfirmTip = async (amount: number) => {
    if (currentTippingPost) {
      await tipUser(currentTippingPost.id, amount)
      if (isAccessibilityMode) {
        speak(`Successfully tipped ${amount} TON to ${currentTippingPost.authorName}.`)
      }
    }
    setShowTipModal(false)
    setCurrentTippingPost(null)
  }

  const handleCommentChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }))
  }

  const handleCommentSubmit = async (postId: string) => {
    const commentContent = commentInputs[postId]
    if (!commentContent || !commentContent.trim()) return

    await commentOnPost(postId, commentContent)
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
    setShowCommentsForPost((prev) => ({ ...prev, [postId]: true }))
    if (isAccessibilityMode) {
      speak("Comment posted")
    }
  }

  const toggleCommentsVisibility = (postId: string) => {
    setShowCommentsForPost((prev) => ({ ...prev, [postId]: !prev[postId] }))
    if (isAccessibilityMode) {
      speak(showCommentsForPost[postId] ? "Hiding comments" : "Showing comments")
    }
  }

  const handleSummarizePost = async (postId: string, content: string) => {
    setSummarizingPostId(postId)
    if (isAccessibilityMode) speak("Generating summary for post.")
    try {
      await summarizePost(postId, content)
      if (isAccessibilityMode) speak("Summary generated.")
    } catch (error) {
      if (isAccessibilityMode) speak("Failed to generate summary.")
    } finally {
      setSummarizingPostId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Post/Poll Composer */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-black/20 backdrop-blur-xl border-white/10">
          <CardHeader className="pb-0">
            <div className="flex border-b border-white/10">
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveComposerTab("post")
                  if (isAccessibilityMode) speak("Switched to create post tab.")
                }}
                className={`flex-1 rounded-b-none ${
                  activeComposerTab === "post"
                    ? "border-b-2 border-blue-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                aria-selected={activeComposerTab === "post"}
                role="tab"
                aria-controls="post-composer-panel"
              >
                <Send className="w-4 h-4 mr-2" />
                New Post
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveComposerTab("poll")
                  if (isAccessibilityMode) speak("Switched to create poll tab.")
                }}
                className={`flex-1 rounded-b-none ${
                  activeComposerTab === "poll"
                    ? "border-b-2 border-purple-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                aria-selected={activeComposerTab === "poll"}
                role="tab"
                aria-controls="poll-composer-panel"
              >
                <BarChart2 className="w-4 h-4 mr-2" />
                New Poll
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <AnimatePresence mode="wait">
              {activeComposerTab === "post" && (
                <motion.div
                  key="post-composer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  id="post-composer-panel"
                  role="tabpanel"
                >
                  <Textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's happening in the decentralized world?"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-[100px]"
                    aria-label="Create new post content"
                  />

                  <AnimatePresence>
                    {selectedImage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10 mt-4"
                      >
                        <img
                          src={URL.createObjectURL(selectedImage) || "/placeholder.svg"}
                          alt="Selected preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 rounded-full p-1"
                          onClick={handleRemoveImage}
                          aria-label="Remove selected image"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                          onClick={() => imageInputRef.current?.click()}
                          aria-label="Upload image"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                          aria-label="Upload video"
                        >
                          <Video className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                          aria-label="Record audio"
                        >
                          <Mic className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>

                    <Button
                      onClick={handlePost}
                      disabled={(!newPost.trim() && !selectedImage) || isPosting}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      {isPosting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post to Chain
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {activeComposerTab === "poll" && (
                <motion.div
                  key="poll-composer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  id="poll-composer-panel"
                  role="tabpanel"
                >
                  <Input
                    placeholder="Poll Question"
                    value={newPollQuestion}
                    onChange={(e) => setNewPollQuestion(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400 mb-4"
                    aria-label="Poll question input"
                  />
                  <div className="space-y-2">
                    {newPollOptions.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center space-x-2"
                      >
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => handlePollOptionChange(index, e.target.value)}
                          className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                          aria-label={`Poll option ${index + 1}`}
                        />
                        {newPollOptions.length > 2 && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemovePollOption(index)}
                              className="text-gray-400 hover:text-red-400"
                              aria-label={`Remove option ${index + 1}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleAddPollOption}
                    className="w-full border-white/20 text-white hover:bg-white/5 bg-transparent mt-4"
                    aria-label="Add another poll option"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                  <Button
                    onClick={handleCreatePoll}
                    disabled={isCreatingPoll || newPollOptions.filter(Boolean).length < 2}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 mt-4"
                    aria-label="Create poll"
                  >
                    {isCreatingPoll ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <BarChart2 className="w-4 h-4 mr-2" />
                        Create Poll
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feed Controls (Sorting) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-end mb-4">
          <span className="text-gray-400 text-sm mr-2">Sort by:</span>
          <Select
            value={sortOrder}
            onValueChange={(value: "latest" | "most-liked" | "most-commented") => {
              setSortOrder(value)
              if (isAccessibilityMode) speak(`Sorting feed by ${value.replace("-", " ")}.`)
            }}
          >
            <SelectTrigger className="w-[180px] bg-black/20 border-white/10 text-white">
              <SelectValue placeholder="Sort by" aria-label="Select sort order for feed" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white">
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="most-liked">Most Liked</SelectItem>
              <SelectItem value="most-commented">Most Commented</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Feed */}
      <div className="space-y-4">
        <AnimatePresence mode="sync">
          {sortedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
            >
              <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {post.author.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-white">{post.author.name}</h3>
                        <span className="text-xs text-gray-400">
                          {post.author.address.slice(0, 6)}...{post.author.address.slice(-4)}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{post.timestamp}</span>
                      </div>

                      {post.type === "post" && (
                        <>
                          <p className="text-gray-200 mb-4 leading-relaxed">{post.content}</p>

                          {post.media && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              className="mb-4 rounded-lg overflow-hidden"
                            >
                              <img
                                src={post.media.url || "/placeholder.svg"}
                                alt={post.media.alt}
                                className="w-full h-auto max-h-96 object-cover"
                              />
                            </motion.div>
                          )}

                          {post.content.length > 200 && (
                            <div className="mb-4" aria-live="polite">
                              {summarizingPostId === post.id ? (
                                <div className="flex items-center text-blue-400 text-sm">
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full mr-2"
                                  />
                                  Generating summary...
                                </div>
                              ) : post.summary ? (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-3 bg-white/5 rounded-lg border border-white/10"
                                >
                                  <h5 className="text-white font-semibold text-sm flex items-center mb-1">
                                    <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                                    AI Summary:
                                  </h5>
                                  <p className="text-gray-300 text-sm">{post.summary}</p>
                                </motion.div>
                              ) : (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSummarizePost(post.id, post.content)}
                                    className="border-white/20 text-white hover:bg-white/5 bg-transparent"
                                    aria-label={`Summarize post by ${post.author.name}`}
                                  >
                                    <Lightbulb className="w-4 h-4 mr-2" />
                                    Summarize with AI
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </>
                      )}

                      {post.type === "poll" && post.poll && (
                        <div className="mb-4 space-y-3" aria-live="polite" aria-atomic="true">
                          <h4 className="text-white font-semibold text-lg">{post.poll.question}</h4>
                          <div className="space-y-2">
                            {post.poll.options.map((option) => {
                              const percentage =
                                post.poll!.totalVotes > 0 ? (option.votes / post.poll!.totalVotes) * 100 : 0
                              return (
                                <motion.div
                                  key={option.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="relative"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Button
                                    variant="outline"
                                    onClick={() => handleVoteOnPoll(post.id, option.id, option.text)}
                                    disabled={!!post.poll?.userVotedOptionId}
                                    className={`w-full justify-start text-left border-white/20 text-white hover:bg-white/5 bg-transparent relative overflow-hidden ${
                                      post.poll?.userVotedOptionId === option.id ? "border-blue-500 bg-blue-500/20" : ""
                                    }`}
                                    aria-label={`Vote for ${option.text}. Current votes: ${option.votes}`}
                                  >
                                    <motion.div
                                      className="absolute inset-0 bg-blue-500/10"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      transition={{ duration: 0.5 }}
                                    />
                                    <span className="relative z-10 flex justify-between items-center w-full">
                                      <span>{option.text}</span>
                                      <span className="text-xs text-gray-300">
                                        {option.votes} votes ({percentage.toFixed(1)}%)
                                      </span>
                                    </span>
                                  </Button>
                                </motion.div>
                              )
                            })}
                          </div>
                          <p className="text-xs text-gray-400 text-right">
                            Total Votes: {post.poll.totalVotes}
                            {post.poll.userVotedOptionId && <span className="ml-2 text-green-400"> (You voted)</span>}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-6">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                            aria-label={`Like post by ${post.author.name}`}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-red-400 text-red-400" : ""}`} />
                            {post.likes}
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCommentsVisibility(post.id)}
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                            aria-label={`Comment on post by ${post.author.name}`}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments.length}
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTip(post.id, post.author.name, post.author.address)}
                            className="text-gray-400 hover:text-yellow-400 transition-colors"
                            aria-label={`Tip ${post.author.name} with TON tokens`}
                          >
                            <Coins className="w-4 h-4 mr-1" />
                            Tip TON
                          </Button>
                        </motion.div>
                      </div>

                      {/* Comments Section */}
                      <AnimatePresence>
                        {showCommentsForPost[post.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: 10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6 pt-4 border-t border-white/10 space-y-4"
                          >
                            <h4 className="text-white font-semibold text-sm mb-3">Comments</h4>
                            <div className="space-y-3">
                              <AnimatePresence>
                                {post.comments.map((comment, commentIndex) => (
                                  <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: commentIndex * 0.05 }}
                                    className="flex items-start space-x-3 bg-white/5 p-3 rounded-lg"
                                  >
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                                      <AvatarFallback className="bg-gradient-to-r from-gray-500 to-gray-700 text-white text-xs">
                                        {comment.author.name.slice(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-1">
                                        <span className="font-medium text-white text-sm">{comment.author.name}</span>
                                        <span className="text-xs text-gray-400">• {comment.timestamp}</span>
                                      </div>
                                      <p className="text-gray-200 text-sm mt-1">{comment.content}</p>
                                    </div>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>

                            {/* New Comment Input */}
                            <div className="flex items-center space-x-2 mt-4">
                              <Input
                                placeholder="Write a comment..."
                                value={commentInputs[post.id] || ""}
                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit(post.id)}
                                className="flex-1 bg-white/5 border-white/10 text-white"
                                aria-label={`Type a comment for post by ${post.author.name}`}
                              />
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  onClick={() => handleCommentSubmit(post.id)}
                                  disabled={!commentInputs[post.id]?.trim()}
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                  aria-label="Submit comment"
                                >
                                  <Send className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Tip Modal */}
      {currentTippingPost && (
        <TipModal
          isOpen={showTipModal}
          onClose={() => setShowTipModal(false)}
          onConfirmTip={handleConfirmTip}
          postAuthorName={currentTippingPost.authorName}
          postAuthorAddress={currentTippingPost.authorAddress}
        />
      )}
    </div>
  )
}
