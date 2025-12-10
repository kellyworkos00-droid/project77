import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function ProfileRedirectPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const usernameOrId = session.user.username || session.user.id
  redirect(`/profile/${usernameOrId}`)
}
