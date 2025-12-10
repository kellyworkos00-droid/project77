'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, Video } from 'lucide-react'

interface CreatePostProps {
  userId: string
  bulletinBoardId?: string
}

export function CreatePost({ userId, bulletinBoardId }: CreatePostProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video' | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          mediaUrl: mediaUrl.trim() || undefined,
          mediaType: mediaType || undefined,
          bulletinBoardId,
        }),
      })

      if (res.ok) {
        setContent('')
        setMediaUrl('')
        setMediaType('')
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass-panel p-5">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start a conversation... add #hashtags and @mentions"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
          rows={3}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Media URL (optional)</label>
            <input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg or video.mp4"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Media type</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-3 rounded-xl border ${mediaType === 'image' ? 'border-sky-400 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-muted'} transition`}
              >
                <ImagePlus size={18} /> Image
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-3 rounded-xl border ${mediaType === 'video' ? 'border-sky-400 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-muted'} transition`}
              >
                <Video size={18} /> Video
              </button>
            </div>
            <p className="text-xs text-muted">Paste a hosted link (e.g., .jpg/.png/.mp4). Both fields are optional.</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-sky-300 hover:text-sky-200 transition"
              title="Add image"
            >
              <ImagePlus size={18} />
            </button>
            <button
              type="button"
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-sky-300 hover:text-sky-200 transition"
              title="Add video"
            >
              <Video size={18} />
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="cta-button disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Share' }
          </button>
        </div>
      </form>
    </div>
  )
}
