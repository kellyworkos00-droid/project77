'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface JoinButtonProps {
  boardId: string
  initialJoined: boolean
}

export function JoinButton({ boardId, initialJoined }: JoinButtonProps) {
  const router = useRouter()
  const [isJoined, setIsJoined] = useState(initialJoined)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)

    try {
      const res = await fetch(`/api/boards/${boardId}/join`, {
        method: 'POST',
      })

      if (res.ok) {
        const data = await res.json()
        setIsJoined(data.joined)
        router.refresh()
      }
    } catch (error) {
      console.error('Error toggling membership:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`bulletin-button ${
        isJoined ? 'bg-gray-500 hover:bg-gray-600' : ''
      } disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
    >
      {isLoading ? 'Loading...' : isJoined ? 'Leave Board' : 'Join Board'}
    </button>
  )
}
