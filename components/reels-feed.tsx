"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Loader2 } from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useReels } from "@/hooks/use-reels"

export function ReelsFeed() {
  const { reels, likeReel, commentOnReel, loadMoreReels } = useReels()
  const { isAccessibilityMode, speak } = useAccessibility()

  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const scrollY = containerRef.current.scrollTop
    const reelHeight = containerRef.current.clientHeight
    const newIndex = Math.round(scrollY / reelHeight)

    if (newIndex !== currentReelIndex) {
      setCurrentReelIndex(newIndex)
    }

    // Load more reels when near the end
    if (
      !isLoadingMore &&
      newIndex >= reels.length - 10 && // Trigger when 2 reels from the end
      reels.length < 10 // Cap for demo purposes
    ) {
      setIsLoadingMore(true)
      loadMoreReels().then(() => setIsLoadingMore(false))
    }
  }, [currentReelIndex, reels.length, isLoadingMore, loadMoreReels])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentReelIndex) {
          video.play().catch((e) => console.error("Video autoplay failed:", e))
        } else {
          video.pause()
          video.currentTime = 0 // Reset video to start
        }
      }
    })
  }, [currentReelIndex])

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
    if (isAccessibilityMode) {
      speak(isMuted ? "Unmuted video" : "Muted video")
    }
  }

  const handleLike = (reelId: string) => {
    likeReel(reelId)
    if (isAccessibilityMode) {
      speak("Reel liked")
    }
  }

  const handleComment = (reelId: string, commentContent: string) => {
    if (!commentContent.trim()) return
    commentOnReel(reelId, commentContent)
    if (isAccessibilityMode) {
      speak("Comment posted")
    }
  }

  const handleShare = (reelId: string) => {
    if (isAccessibilityMode) {
      speak("Share reel functionality not yet implemented.")
    }
    console.log(`Share reel ${reelId}`)
    // Implement share logic here
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-180px)] overflow-y-scroll snap-y snap-mandatory scroll-smooth rounded-lg bg-black/20 backdrop-blur-xl border-white/10"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence initial={false}>
        {reels.map((reel, index) => (
          <motion.div
            key={reel.id}
            className="relative w-full h-full flex flex-col justify-end snap-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ scrollSnapAlign: "start" }}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={reel.videoUrl}
              loop
              playsInline
              muted={isMuted}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              poster={reel.thumbnailUrl}
              onClick={(e) => {
                const video = e.currentTarget
                if (video.paused) {
                  video.play()
                } else {
                  video.pause()
                }
              }}
              aria-label={`Video by ${reel.author.name}, description: ${reel.description}`}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 rounded-lg flex flex-col justify-between p-4">
              {/* Top controls/info */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>

              {/* Bottom content */}
              <div className="flex items-end justify-between">
                {/* Reel Info */}
                <div className="flex-1 text-white space-y-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-10 h-10 border-2 border-white">
                      <AvatarImage src={reel.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {reel.author.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{reel.author.name}</h3>
                      <p className="text-sm text-gray-300">
                        {reel.author.address.slice(0, 6)}...{reel.author.address.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{reel.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-4 ml-4">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleLike(reel.id)}
                      className="flex flex-col items-center text-white hover:bg-white/20"
                      aria-label={`Like reel. Current likes: ${reel.likes}`}
                    >
                      <Heart className={`w-6 h-6 ${reel.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                      <span className="text-xs">{reel.likes}</span>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // For demo, we'll just log and increment comment count
                        const comment = prompt("Enter your comment:")
                        if (comment) handleComment(reel.id, comment)
                      }}
                      className="flex flex-col items-center text-white hover:bg-white/20"
                      aria-label={`Comment on reel. Current comments: ${reel.commentsCount}`}
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span className="text-xs">{reel.commentsCount}</span>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare(reel.id)}
                      className="flex flex-col items-center text-white hover:bg-white/20"
                      aria-label="Share reel"
                    >
                      <Share2 className="w-6 h-6" />
                      <span className="text-xs">Share</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoadingMore && (
          <motion.div
            key="loading-more"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex items-center justify-center bg-black/50 text-white snap-start"
          >
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            Loading more reels...
          </motion.div>
        )}
        {reels.length === 0 && !isLoadingMore && (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
            No reels available.
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
