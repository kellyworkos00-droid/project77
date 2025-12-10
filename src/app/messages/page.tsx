'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'
import { Send } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-bulletin-50 via-bulletin-100 to-bulletin-200">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-bulletin-900 mb-8">Messages</h1>

        <div className="grid md:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="bulletin-card relative overflow-y-auto">
            <div className="bulletin-pin"></div>
            
            <h2 className="text-xl font-bold text-bulletin-900 mb-4">Conversations</h2>
            
            {isLoading ? (
              <p className="text-gray-600 text-center py-8">Loading...</p>
            ) : conversations.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No conversations yet</p>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectUser(conv)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedUser?.id === conv.id
                        ? 'bg-bulletin-100 border-2 border-bulletin-600'
                        : 'hover:bg-bulletin-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-bulletin-400 flex items-center justify-center text-white font-bold">
                        {conv.name?.[0] || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-bulletin-900 truncate">{conv.name}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage || 'Start a conversation'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="md:col-span-2 bulletin-card relative flex flex-col">
            <div className="bulletin-pin"></div>
            
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-bulletin-400 flex items-center justify-center text-white font-bold">
                      {selectedUser.name?.[0] || 'U'}
                    </div>
                    <div>
                      <h2 className="font-bold text-bulletin-900">{selectedUser.name}</h2>
                      {selectedUser.username && (
                        <p className="text-sm text-gray-600">@{selectedUser.username}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No messages yet</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            msg.senderId === session.user.id
                              ? 'bg-bulletin-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.senderId === session.user.id ? 'text-bulletin-100' : 'text-gray-500'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bulletin-500"
                  />
                  <button type="submit" className="bulletin-button">
                    <Send size={20} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-600">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
