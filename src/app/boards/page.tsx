import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Navigation } from '@/components/Navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Users, Lock, Globe } from 'lucide-react'

export default async function BoardsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const allBoards = await prisma.bulletinBoard.findMany({
    include: {
      members: true,
      _count: {
        select: { posts: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const myBoards = await prisma.bulletinBoard.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id
        }
      }
    },
    include: {
      members: true,
      _count: {
        select: { posts: true }
      }
    }
  })

  const isMember = (boardId: string) => {
    return myBoards.some((board: any) => board.id === boardId)
  }

  return (
    <div className="min-h-screen text-white bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.2),transparent_30%),linear-gradient(145deg,#0a0f1f,#0c1126_50%,#0a0e1c)]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-1">Boards</h1>
            <p className="text-muted">Discover and join communities</p>
          </div>
          <Link href="/boards/create" className="cta-button">
            Create Board
          </Link>
        </div>

        {myBoards.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">My Boards</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBoards.map((board: any) => (
                <Link key={board.id} href={`/boards/${board.id}`}>
                  <div className="glass-panel hover:scale-[1.01] transition-transform cursor-pointer h-full p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      {board.image ? (
                        <img src={board.image} alt={board.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
                          <Users className="text-white" size={28} />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{board.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          {board.isPrivate ? <Lock size={14} /> : <Globe size={14} />}
                          <span>{board.members.length} members</span>
                          <span>•</span>
                          <span>{board._count.posts} posts</span>
                        </div>
                      </div>
                    </div>
                    {board.description && (
                      <p className="text-muted text-sm line-clamp-2">{board.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Discover Boards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBoards.filter((board: any) => !isMember(board.id)).map((board: any) => (
              <Link key={board.id} href={`/boards/${board.id}`}>
                <div className="glass-panel hover:scale-[1.01] transition-transform cursor-pointer h-full p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {board.image ? (
                      <img src={board.image} alt={board.name} className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
                        <Users className="text-white" size={28} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{board.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        {board.isPrivate ? <Lock size={14} /> : <Globe size={14} />}
                        <span>{board.members.length} members</span>
                        <span>•</span>
                        <span>{board._count.posts} posts</span>
                      </div>
                    </div>
                  </div>
                  {board.description && (
                    <p className="text-muted text-sm line-clamp-2">{board.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
