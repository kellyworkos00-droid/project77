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

  const isMember = board.members.some(member => member.userId === session.user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-bulletin-50 via-bulletin-100 to-bulletin-200">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Board Header */}
        <div className="bulletin-card mb-8 relative">
          <div className="bulletin-pin"></div>
          <div className="bulletin-tape"></div>
          
          <div className="flex items-start gap-4 mt-2">
            {board.image ? (
              <img src={board.image} alt={board.name} className="w-24 h-24 rounded-lg object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-bulletin-400 flex items-center justify-center">
                <Users className="text-white" size={48} />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-bulletin-900 mb-2">{board.name}</h1>
              {board.description && (
                <p className="text-gray-700 mb-3">{board.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{board.members.length} members</span>
                <span>•</span>
                <span>{board.posts.length} posts</span>
              </div>
            </div>

            <JoinButton boardId={board.id} initialJoined={isMember} />
          </div>

          {/* Members */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Members</h3>
            <div className="flex flex-wrap gap-2">
              {board.members.slice(0, 10).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 bg-bulletin-50 rounded-full px-3 py-1"
                  title={member.user.name || 'User'}
                >
                  <div className="w-6 h-6 rounded-full bg-bulletin-400 flex items-center justify-center text-white text-xs font-bold">
                    {member.user.name?.[0] || 'U'}
                  </div>
                  <span className="text-sm">{member.user.name}</span>
                  {member.role === 'admin' && (
                    <span className="text-xs bg-bulletin-600 text-white px-2 py-0.5 rounded">Admin</span>
                  )}
                </div>
              ))}
              {board.members.length > 10 && (
                <span className="text-sm text-gray-600">+{board.members.length - 10} more</span>
              )}
            </div>
          </div>
        </div>

        {isMember ? (
          <>
            <div className="mb-8">
              <CreatePost userId={session.user.id} bulletinBoardId={board.id} />
            </div>

            <div className="space-y-6">
              {board.posts.length === 0 ? (
                <div className="bulletin-card text-center relative py-12">
                  <div className="bulletin-pin"></div>
                  <h2 className="text-2xl font-bold text-bulletin-900 mb-2">No posts yet</h2>
                  <p className="text-gray-600">Be the first to post in this board!</p>
                </div>
              ) : (
                board.posts.map((post) => (
                  <PostCard key={post.id} post={post} currentUserId={session.user.id} />
                ))
              )}
            </div>
          </>
        ) : (
          <div className="bulletin-card text-center relative py-12">
            <div className="bulletin-pin"></div>
            <h2 className="text-2xl font-bold text-bulletin-900 mb-2">Join to see posts</h2>
            <p className="text-gray-600 mb-4">Become a member to view and create posts in this board</p>
            <JoinButton boardId={board.id} initialJoined={false} />
          </div>
        )}
      </main>
    </div>
  )
}
