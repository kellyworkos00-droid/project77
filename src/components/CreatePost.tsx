'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <div className="glass-panel p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start a conversation... add #hashtags and @mentions"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none text-sm"
          rows={2}
        />

        <div className="flex items-center justify-end">
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
