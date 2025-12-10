'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProfileRedirectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    const usernameOrId = session.user.username || session.user.id
    router.push(`/profile/${usernameOrId}`)
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <p className="text-muted">Loading profile...</p>
    </div>
  )
}
