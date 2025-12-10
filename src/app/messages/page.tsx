'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'
import { Send, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function MessagesPage() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      redirect('/auth/signin')
    }
    loadConversations()
  }, [session])

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/messages/conversations')
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/messages/${userId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSelectUser = (user: any) => {
    setSelectedUser(user)
    loadMessages(user.id)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          content: newMessage,
        }),
      })

      if (res.ok) {
        setNewMessage('')
        loadMessages(selectedUser.id)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (!session) return null

  return (
    <div className="min-h-screen text-white bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.2),transparent_30%),linear-gradient(145deg,#0a0f1f,#0c1126_50%,#0a0e1c)]">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted uppercase tracking-[0.18em] text-xs">Direct messages</p>
            <h1 className="text-3xl font-bold">Messages</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 min-h-[560px]">
          {/* Conversations List */}
          <div className="glass-panel p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Conversations</h2>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
            </div>

            {isLoading ? (
              <p className="text-muted text-center py-6">Loading...</p>
            ) : conversations.length === 0 ? (
              <div className="text-center text-muted py-10">No conversations yet</div>
            ) : (
              <div className="space-y-2 overflow-y-auto pr-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectUser(conv)}
                    className={`w-full text-left px-3 py-3 rounded-xl transition flex items-center gap-3 border border-transparent ${
                      selectedUser?.id === conv.id
                        ? 'bg-white/10 border-white/15'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-sky-400 flex items-center justify-center text-white font-semibold">
                      {conv.name?.[0] || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{conv.name}</p>
                      <p className="text-sm text-muted truncate">
                        {conv.lastMessage || 'Start a conversation'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="md:col-span-2 glass-panel p-4 flex flex-col">
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-sky-400 flex items-center justify-center text-white font-bold">
                    {selectedUser.name?.[0] || 'U'}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{selectedUser.name}</h2>
                    {selectedUser.username && (
                      <p className="text-sm text-muted">@{selectedUser.username}</p>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-1">
                  {messages.length === 0 ? (
                    <p className="text-muted text-center py-10">No messages yet</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                            msg.senderId === session.user.id
                              ? 'bg-gradient-to-r from-violet-600 to-sky-500 text-white'
                              : 'bg-white/5 text-white border border-white/10'
                          }`}
                        >
                          <p className="leading-relaxed">{msg.content}</p>
                          <p className={`text-[11px] mt-2 ${
                            msg.senderId === session.user.id ? 'text-white/70' : 'text-white/60'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <button type="submit" className="cta-button px-4 py-3 flex items-center justify-center" disabled={!newMessage.trim()}>
                    <Send size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted text-center">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
