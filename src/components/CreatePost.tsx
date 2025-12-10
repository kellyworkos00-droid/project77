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
    <div className="bulletin-card relative">
      <div className="bulletin-pin"></div>
      <div className="bulletin-tape"></div>
      
      <form onSubmit={handleSubmit} className="mt-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bulletin-500 resize-none"
          rows={3}
        />

        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 rounded-md hover:bg-bulletin-100 transition"
              title="Add image"
            >
              <ImagePlus size={20} className="text-bulletin-600" />
            </button>
            <button
              type="button"
              className="p-2 rounded-md hover:bg-bulletin-100 transition"
              title="Add video"
            >
              <Video size={20} className="text-bulletin-600" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="bulletin-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
