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
          bulletinBoardId,
        }),
      })

      if (res.ok) {
        setContent('')
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
          placeholder="Start a conversation..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
          rows={3}
        />

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
