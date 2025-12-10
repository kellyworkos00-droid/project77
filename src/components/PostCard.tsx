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
    <div className="bulletin-card relative">
      <div className="bulletin-pin"></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bulletin-400 flex items-center justify-center text-white font-bold">
            {post.user.name?.[0] || 'U'}
          </div>
          <div>
            <Link
              href={`/profile/${post.user.username || post.user.id}`}
              className="font-bold text-bulletin-900 hover:underline"
            >
              {post.user.name || 'Anonymous'}
            </Link>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              {post.bulletinBoard && (
                <span>
                  {' • in '}
                  <Link
                    href={`/boards/${post.bulletinBoard.id}`}
                    className="text-bulletin-600 hover:underline"
                  >
                    {post.bulletinBoard.name}
                  </Link>
                </span>
              )}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Content */}
      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Media */}
      {post.mediaUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {post.mediaType === 'image' ? (
            <img src={post.mediaUrl} alt="Post media" className="w-full" />
          ) : post.mediaType === 'video' ? (
            <video src={post.mediaUrl} controls className="w-full" />
          ) : null}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-200">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition ${
            isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
          }`}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-600 hover:text-bulletin-600 transition"
        >
          <MessageCircle size={20} />
          <span>{post.comments.length}</span>
        </button>

        <button
          onClick={handleRepost}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition"
        >
          <Repeat2 size={20} />
          <span>{post.reposts.length}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <Share2 size={20} />
          <span>{post.shares.length}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <form onSubmit={handleComment} className="mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bulletin-500"
            />
          </form>

          <div className="space-y-3">
            {post.comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-bulletin-300 flex items-center justify-center text-white text-sm font-bold">
                  {comment.user.name?.[0] || 'U'}
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                  <p className="font-medium text-sm text-bulletin-900">
                    {comment.user.name || 'Anonymous'}
                  </p>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
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
