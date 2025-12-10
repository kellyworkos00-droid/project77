import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Navigation } from '@/components/Navigation'
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/PostCard'
import { CreatePost } from '@/components/CreatePost'

export default async function FeedPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Get posts from bulletin boards the user is a member of, plus their own posts
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        {
          bulletinBoard: {
            members: {
              some: {
                userId: session.user.id
              }
            }
          }
        }
      ]
    },
    include: {
      user: true,
      bulletinBoard: true,
      comments: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      likes: true,
      reposts: true,
      shares: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-bulletin-50 via-bulletin-100 to-bulletin-200">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <CreatePost userId={session.user.id} />
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bulletin-card text-center relative py-12">
              <div className="bulletin-pin"></div>
              <h2 className="text-2xl font-bold text-bulletin-900 mb-2">No posts yet</h2>
              <p className="text-gray-600">Join some bulletin boards or create your first post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={session.user.id} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
