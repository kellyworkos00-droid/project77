import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Navigation } from '@/components/Navigation'
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/PostCard'
import { CreatePost } from '@/components/CreatePost'
import { JoinButton } from '@/components/JoinButton'
import { Users } from 'lucide-react'

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const { id } = await params

  const board = await prisma.bulletinBoard.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: true
        }
      },
      posts: {
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
        }
      }
    }
  })

  if (!board) {
    notFound()
  }

  const isMember = board.members.some((member: any) => member.userId === session.user.id)

  return (
    <div className="min-h-screen text-white bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.2),transparent_30%),linear-gradient(145deg,#0a0f1f,#0c1126_50%,#0a0e1c)]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Board Header */}
        <div className="glass-panel p-6">
          <div className="flex items-start gap-4">
            {board.image ? (
              <img src={board.image} alt={board.name} className="w-24 h-24 rounded-lg object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-white/10 flex items-center justify-center">
                <Users className="text-white" size={40} />
              </div>
            )}
            
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold">{board.name}</h1>
              {board.description && (
                <p className="text-muted">{board.description}</p>
              )}
              <div className="flex items-center gap-3 text-sm text-muted">
                <span>{board.members.length} members</span>
                <span>•</span>
                <span>{board.posts.length} posts</span>
              </div>
            </div>

            <JoinButton boardId={board.id} initialJoined={isMember} />
          </div>

          {/* Members */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white mb-3">Members</h3>
            <div className="flex flex-wrap gap-2">
              {board.members.slice(0, 10).map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1"
                  title={member.user.name || 'User'}
                >
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                    {member.user.name?.[0] || 'U'}
                  </div>
                  <span className="text-sm text-white">{member.user.name}</span>
                  {member.role === 'admin' && (
                    <span className="text-xs bg-white/15 text-white px-2 py-0.5 rounded">Admin</span>
                  )}
                </div>
              ))}
              {board.members.length > 10 && (
                <span className="text-sm text-muted">+{board.members.length - 10} more</span>
              )}
            </div>
          </div>
        </div>

        {isMember ? (
          <>
            <div>
              <CreatePost userId={session.user.id} bulletinBoardId={board.id} />
            </div>

            <div className="space-y-6">
              {board.posts.length === 0 ? (
                <div className="glass-panel text-center py-12">
                  <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
                  <p className="text-muted">Be the first to post in this board.</p>
                </div>
              ) : (
                board.posts.map((post: any) => (
                  <PostCard key={post.id} post={post} currentUserId={session.user.id} />
                ))
              )}
            </div>
          </>
        ) : (
          <div className="glass-panel text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Join to see posts</h2>
            <p className="text-muted mb-4">Become a member to view and create posts in this board.</p>
            <JoinButton boardId={board.id} initialJoined={false} />
          </div>
        )}
      </main>
    </div>
  )
}
