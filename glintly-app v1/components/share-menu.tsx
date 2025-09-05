"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share, Copy, MessageCircle, Mail, Twitter, Facebook, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareMenuProps {
  isOpen: boolean
  onClose: () => void
  video: {
    id: string
    title: string
    channel: string
    thumbnail: string
  }
}

export function ShareMenu({ isOpen, onClose, video }: ShareMenuProps) {
  const { toast } = useToast()

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/video/${video.id}`
  const shareText = `Check out "${video.title}" by @${video.channel} on Glintly!`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied!",
        description: "Video link has been copied to your clipboard.",
      })
      onClose()
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: shareText,
          url: shareUrl,
        })
        onClose()
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopyLink()
        }
      }
    } else {
      handleCopyLink()
    }
  }

  const handleSocialShare = (platform: string) => {
    let url = ""
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(shareText)

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case "whatsapp":
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
        break
      case "telegram":
        url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
        break
      case "email":
        url = `mailto:?subject=${encodeURIComponent(video.title)}&body=${encodedText}%20${encodedUrl}`
        break
    }

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Share Video</h3>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-4">
                <div className="flex gap-3 mb-3">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 text-balance">{video.title}</h4>
                    <p className="text-xs text-muted-foreground">@{video.channel}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Native Share (Mobile) / Copy Link (Desktop) */}
                <Button
                  onClick={handleNativeShare}
                  className="w-full justify-start gap-3 h-12 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                >
                  <Share className="h-5 w-5" />
                  {navigator.share ? "Share via..." : "Copy Link"}
                </Button>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="justify-start gap-2 h-10 rounded-xl bg-transparent"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialShare("whatsapp")}
                    className="justify-start gap-2 h-10 rounded-xl bg-transparent"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>

                {/* Social Media Options */}
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSocialShare("twitter")}
                    className="h-12 rounded-xl bg-transparent"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSocialShare("facebook")}
                    className="h-12 rounded-xl bg-transparent"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSocialShare("telegram")}
                    className="h-12 rounded-xl bg-transparent"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSocialShare("email")}
                    className="h-12 rounded-xl bg-transparent"
                  >
                    <Mail className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
