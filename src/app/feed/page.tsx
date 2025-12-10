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
    <div className="min-h-screen text-white bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.2),transparent_30%),linear-gradient(145deg,#0a0f1f,#0c1126_50%,#0a0e1c)]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <div>
          <CreatePost userId={session.user.id} />
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="glass-panel text-center py-12">
              <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
              <p className="text-muted">Join some boards or create your first post.</p>
            </div>
          ) : (
            posts.map((post: any) => (
              <PostCard key={post.id} post={post} currentUserId={session.user.id} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
