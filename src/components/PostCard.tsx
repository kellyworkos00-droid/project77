'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Repeat2, Share2, MoreVertical } from 'lucide-react'

interface PostCardProps {
  post: any
  currentUserId: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(
    post.likes.some((like: any) => like.userId === currentUserId)
  )
  const [likesCount, setLikesCount] = useState(post.likes.length)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')

  const handleLike = async () => {
    try {
      const res = await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      })

      if (res.ok) {
        setIsLiked(!isLiked)
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const res = await fetch('/api/posts/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          content: newComment,
        }),
      })

      if (res.ok) {
        setNewComment('')
        router.refresh()
      }
    } catch (error) {
      console.error('Error commenting:', error)
    }
  }

  const handleRepost = async () => {
    try {
      await fetch('/api/posts/repost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      })
      router.refresh()
    } catch (error) {
      console.error('Error reposting:', error)
    }
  }

  const handleShare = async () => {
    try {
      await fetch('/api/posts/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      })
      alert('Post shared!')
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <div className="glass-panel p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-sky-400 flex items-center justify-center text-white font-semibold">
            {post.user.name?.[0] || 'U'}
          </div>
          <div className="space-y-1">
            <Link
              href={`/profile/${post.user.username || post.user.id}`}
              className="font-semibold text-white hover:text-sky-200 transition"
            >
              {post.user.name || 'Anonymous'}
            </Link>
            <p className="text-sm text-muted">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              {post.bulletinBoard && (
                <span>
                  {' • '}
                  <Link
                    href={`/boards/${post.bulletinBoard.id}`}
                    className="text-sky-300 hover:text-sky-100 transition"
                  >
                    {post.bulletinBoard.name}
                  </Link>
                </span>
              )}
            </p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-white/5 text-muted hover:text-white transition">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Content */}
      <p className="text-lg leading-relaxed text-white/90 whitespace-pre-wrap">{post.content}</p>

      {/* Media */}
      {post.mediaUrl && (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {post.mediaType === 'image' ? (
            <img src={post.mediaUrl} alt="Post media" className="w-full" />
          ) : post.mediaType === 'video' ? (
            <video src={post.mediaUrl} controls className="w-full" />
          ) : null}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-white/5">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition ${
            isLiked ? 'bg-rose-500/10 text-rose-300' : 'text-muted hover:bg-white/5 hover:text-white'
          }`}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-sm font-semibold">{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-muted hover:bg-white/5 hover:text-white transition"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-semibold">{post.comments.length}</span>
        </button>

        <button
          onClick={handleRepost}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-muted hover:bg-white/5 hover:text-white transition"
        >
          <Repeat2 size={18} />
          <span className="text-sm font-semibold">{post.reposts.length}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-muted hover:bg-white/5 hover:text-white transition"
        >
          <Share2 size={18} />
          <span className="text-sm font-semibold">{post.shares.length}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="space-y-3 pt-4 border-t border-white/5">
          <form onSubmit={handleComment}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </form>

          <div className="space-y-3">
            {post.comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                  {comment.user.name?.[0] || 'U'}
                </div>
                <div className="flex-1 bg-white/3 border border-white/5 rounded-xl px-3 py-2">
                  <p className="font-semibold text-white text-sm">
                    {comment.user.name || 'Anonymous'}
                  </p>
                  <p className="text-white/80 text-sm">{comment.content}</p>
                  <p className="text-xs text-muted mt-1">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
