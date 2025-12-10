import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Navigation } from '@/components/Navigation'
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/PostCard'
import { FollowButton } from '@/components/FollowButton'
import { MapPin, Calendar, Link as LinkIcon } from 'lucide-react'
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
  const isFollowing = user.followers.some(f => f.followerId === session.user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-bulletin-50 via-bulletin-100 to-bulletin-200">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="bulletin-card mb-8 relative">
          <div className="bulletin-pin"></div>
          <div className="bulletin-tape"></div>
          
          <div className="flex items-start gap-6 mt-2">
            {user.image ? (
              <img src={user.image} alt={user.name || 'User'} className="w-32 h-32 rounded-full object-cover" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-bulletin-400 flex items-center justify-center text-white text-5xl font-bold">
                {user.name?.[0] || 'U'}
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-bulletin-900">{user.name}</h1>
                  {user.username && (
                    <p className="text-gray-600">@{user.username}</p>
                  )}
                </div>
                {!isOwnProfile && <FollowButton userId={user.id} initialFollowing={isFollowing} />}
              </div>

              {user.bio && (
                <p className="text-gray-700 mt-3">{user.bio}</p>
              )}

              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <span><strong>{user.followers.length}</strong> followers</span>
                <span><strong>{user.following.length}</strong> following</span>
                <span><strong>{user.posts.length}</strong> posts</span>
              </div>

              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
              </div>

              {user.streaks && user.streaks.length > 0 && (
                <div className="mt-3 inline-block bg-orange-100 px-3 py-1 rounded-full">
                  <span className="text-orange-700 font-bold">🔥 {user.streaks[0].currentStreak} day streak</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts */}
        <h2 className="text-2xl font-bold text-bulletin-900 mb-6">Posts</h2>
        <div className="space-y-6">
          {user.posts.length === 0 ? (
            <div className="bulletin-card text-center relative py-12">
              <div className="bulletin-pin"></div>
              <h3 className="text-xl font-bold text-bulletin-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">{isOwnProfile ? 'Share your first post!' : 'No posts to show'}</p>
            </div>
          ) : (
            user.posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={session.user.id} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
