import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Navigation } from '@/components/Navigation'
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/PostCard'
import { FollowButton } from '@/components/FollowButton'
import { MapPin, Calendar, Link as LinkIcon, Settings } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const { username } = await params

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { id: username }
      ]
    },
    include: {
      posts: {
        include: {
          user: true,
          bulletinBoard: true,
          comments: {
            include: {
              user: true
            }
          },
          likes: true,
          reposts: true,
          shares: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      followers: true,
      following: true,
      streaks: true,
    }
  })

  if (!user) {
    notFound()
  }

  const isOwnProfile = user.id === session.user.id
  const isFollowing = user.followers.some((f: any) => f.followerId === session.user.id)

  return (
    <div className="min-h-screen text-white bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.2),transparent_30%),linear-gradient(145deg,#0a0f1f,#0c1126_50%,#0a0e1c)]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Profile Header */}
        <div className="glass-panel p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {user.image ? (
              <img src={user.image} alt={user.name || 'User'} className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover" />
            ) : (
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/10 flex items-center justify-center text-white text-4xl md:text-5xl font-bold">
                {user.name?.[0] || 'U'}
              </div>
            )}
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  {user.username && (
                    <p className="text-muted">@{user.username}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isOwnProfile && (
                    <a
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-sky-300 hover:text-sky-200 transition text-sm font-medium"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </a>
                  )}
                  {!isOwnProfile && <FollowButton userId={user.id} initialFollowing={isFollowing} />}
                </div>
              </div>

              {user.bio && (
                <p className="text-muted">{user.bio}</p>
              )}

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-3 text-sm text-muted">
                <span><strong>{user.followers.length}</strong> followers</span>
                <span><strong>{user.following.length}</strong> following</span>
                <span><strong>{user.posts.length}</strong> posts</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted">
                <Calendar size={16} />
                <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
              </div>

              {user.streaks && user.streaks.length > 0 && (
                <div className="mt-2 inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1 rounded-full">
                  <span className="text-lg">🔥</span>
                  <span className="font-semibold text-white">{user.streaks[0].currentStreak} day streak</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Posts</h2>
          <div className="space-y-6">
            {user.posts.length === 0 ? (
              <div className="glass-panel text-center py-12">
                <h3 className="text-xl font-bold mb-2">No posts yet</h3>
                <p className="text-muted">{isOwnProfile ? 'Share your first post!' : 'No posts to show'}</p>
              </div>
            ) : (
              user.posts.map((post: any) => (
                <PostCard key={post.id} post={post} currentUserId={session.user.id} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
