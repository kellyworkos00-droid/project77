'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Globe, Lock } from 'lucide-react'

export default function CreateBoardPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const board = await res.json()
        router.push(`/boards/${board.id}`)
      }
    } catch (error) {
      console.error('Error creating board:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bulletin-50 via-bulletin-100 to-bulletin-200">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bulletin-card relative">
          <div className="bulletin-pin"></div>
          <div className="bulletin-tape"></div>
          
          <h1 className="text-3xl font-bold text-bulletin-900 mb-6 mt-2">Create Bulletin Board</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Board Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bulletin-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bulletin-500 resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPrivate: false })}
                  className={`flex-1 p-4 rounded-lg border-2 transition ${
                    !formData.isPrivate
                      ? 'border-bulletin-600 bg-bulletin-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Globe className="mx-auto mb-2" size={24} />
                  <div className="font-medium">Public</div>
                  <div className="text-sm text-gray-600">Anyone can join</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPrivate: true })}
                  className={`flex-1 p-4 rounded-lg border-2 transition ${
                    formData.isPrivate
                      ? 'border-bulletin-600 bg-bulletin-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Lock className="mx-auto mb-2" size={24} />
                  <div className="font-medium">Private</div>
                  <div className="text-sm text-gray-600">Invite only</div>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.name.trim() || isSubmitting}
                className="flex-1 bulletin-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Board'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
