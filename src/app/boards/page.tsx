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
    return myBoards.some(board => board.id === boardId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bulletin-50 via-bulletin-100 to-bulletin-200">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-bulletin-900 mb-2">Bulletin Boards</h1>
            <p className="text-gray-600">Discover and join communities</p>
          </div>
          <Link href="/boards/create" className="bulletin-button">
            Create Board
          </Link>
        </div>

        {myBoards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-bulletin-800 mb-4">My Boards</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBoards.map((board) => (
                <Link key={board.id} href={`/boards/${board.id}`}>
                  <div className="bulletin-card relative hover:shadow-lg transition cursor-pointer h-full">
                    <div className="bulletin-pin"></div>
                    
                    <div className="flex items-start gap-3 mb-3">
                      {board.image ? (
                        <img src={board.image} alt={board.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-bulletin-400 flex items-center justify-center">
                          <Users className="text-white" size={32} />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-bulletin-900 mb-1">{board.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {board.isPrivate ? <Lock size={14} /> : <Globe size={14} />}
                          <span>{board.members.length} members</span>
                          <span>•</span>
                          <span>{board._count.posts} posts</span>
                        </div>
                      </div>
                    </div>
                    
                    {board.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">{board.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-bulletin-800 mb-4">Discover Boards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBoards.filter(board => !isMember(board.id)).map((board) => (
              <Link key={board.id} href={`/boards/${board.id}`}>
                <div className="bulletin-card relative hover:shadow-lg transition cursor-pointer h-full">
                  <div className="bulletin-pin"></div>
                  
                  <div className="flex items-start gap-3 mb-3">
                    {board.image ? (
                      <img src={board.image} alt={board.name} className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-bulletin-300 flex items-center justify-center">
                        <Users className="text-white" size={32} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-bulletin-900 mb-1">{board.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {board.isPrivate ? <Lock size={14} /> : <Globe size={14} />}
                        <span>{board.members.length} members</span>
                        <span>•</span>
                        <span>{board._count.posts} posts</span>
                      </div>
                    </div>
                  </div>
                  
                  {board.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">{board.description}</p>
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
