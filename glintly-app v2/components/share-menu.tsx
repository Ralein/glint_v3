"use client"
import { Share, Copy, MessageCircle, Mail, Twitter, Facebook, X } from "lucide-react"

// Mock components since we don't have access to the actual UI library
const Button = ({ children, variant = "default", size = "default", className = "", onClick, ...props }: any) => (
  <button
    className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${
      variant === "outline" ? 
        "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50" :
      variant === "ghost" ?
        "hover:bg-gray-100 text-gray-700" :
      size === "icon" ?
        "h-10 w-10" :
      "bg-blue-600 text-white hover:bg-blue-700"
    } ${
      size === "icon" ? "h-10 w-10" : "px-4 py-2"
    } ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
)

const Card = ({ children, className = "" }: any) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
)

const CardContent = ({ children, className = "" }: any) => (
  <div className={`${className}`}>
    {children}
  </div>
)

// Mock toast hook
const useToast = () => ({
  toast: ({ title, description, variant }: any) => {
    // Create a simple toast notification
    const toastEl = document.createElement('div')
    toastEl.className = `fixed top-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-sm z-[60] transform transition-all duration-300 ${
      variant === 'destructive' ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`
    toastEl.innerHTML = `
      <div class="font-medium ${variant === 'destructive' ? 'text-red-800' : 'text-gray-900'}">${title}</div>
      <div class="text-sm ${variant === 'destructive' ? 'text-red-600' : 'text-gray-600'} mt-1">${description}</div>
    `
    
    document.body.appendChild(toastEl)
    
    // Animate in
    requestAnimationFrame(() => {
      toastEl.style.transform = 'translateX(0)'
      toastEl.style.opacity = '1'
    })
    
    // Remove after 3 seconds
    setTimeout(() => {
      toastEl.style.transform = 'translateX(100%)'
      toastEl.style.opacity = '0'
      setTimeout(() => {
        document.body.removeChild(toastEl)
      }, 300)
    }, 3000)
  }
})

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
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4 opacity-0"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out forwards'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md transform translate-y-full opacity-0"
        style={{
          animation: 'slideUp 0.3s ease-out 0.1s forwards'
        }}
      >
        <Card className="bg-white/95 backdrop-blur-sm border-gray-200 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-900">Share Video</h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-4">
              <div className="flex gap-3 mb-3">
                <img
                  src={video.thumbnail || "https://via.placeholder.com/64x48/374151/ffffff?text=Video"}
                  alt={video.title}
                  className="w-16 h-12 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/64x48/374151/ffffff?text=Video"
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 text-gray-900 break-words">{video.title}</h4>
                  <p className="text-xs text-gray-600">@{video.channel}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Native Share (Mobile) / Copy Link (Desktop) */}
              <Button
                onClick={handleNativeShare}
                className="w-full justify-start gap-3 h-12 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
              >
                <Share className="h-5 w-5" />
                {typeof navigator !== 'undefined' && 'share' in navigator ? "Share via..." : "Copy Link"}
              </Button>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="justify-start gap-2 h-10 rounded-xl bg-transparent border-gray-300 hover:bg-gray-50"
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialShare("whatsapp")}
                  className="justify-start gap-2 h-10 rounded-xl bg-transparent border-gray-300 hover:bg-gray-50"
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
                  className="h-12 rounded-xl bg-transparent border-gray-300 hover:bg-gray-50"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSocialShare("facebook")}
                  className="h-12 rounded-xl bg-transparent border-gray-300 hover:bg-gray-50"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSocialShare("telegram")}
                  className="h-12 rounded-xl bg-transparent border-gray-300 hover:bg-gray-50"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSocialShare("email")}
                  className="h-12 rounded-xl bg-transparent border-gray-300 hover:bg-gray-50"
                >
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}