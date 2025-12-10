import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Navigation } from '@/components/Navigation'
import { SettingsForm } from '@/components/SettingsForm'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, username: true, bio: true, image: true, email: true }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen text-white bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.2),transparent_30%),linear-gradient(145deg,#0a0f1f,#0c1126_50%,#0a0e1c)]">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted">Edit your profile details.</p>
        </div>
        <SettingsForm user={user} />
      </main>
    </div>
  )
}
