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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      let mediaUrl = ''
      let mediaType = ''

      if (imageFile) {
        const reader = new FileReader()
        mediaUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(imageFile)
        })
        mediaType = imageFile.type.startsWith('video/') ? 'video' : 'image'
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          bulletinBoardId,
          mediaUrl: mediaUrl || undefined,
          mediaType: mediaType || undefined,
        }),
      })

      if (res.ok) {
        setContent('')
        setImageFile(null)
        setImagePreview('')
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const preview = URL.createObjectURL(file)
      setImagePreview(preview)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
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

        {imagePreview && (
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="cursor-pointer px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-sky-300 hover:text-sky-200 transition text-sm">
            📷 Photo/Video
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
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
