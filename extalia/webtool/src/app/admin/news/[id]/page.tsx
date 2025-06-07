'use client'

import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'

interface NewsArticle {
  id: string
  title: string
  content: string
  summary: string
  image: string
  author: string
  publishedAt: Date
  updatedAt: Date
  tags: string[]
  isPublished: boolean
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function NewsEditor({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [article, setArticle] = useState<Partial<NewsArticle>>({
    title: '',
    content: '',
    summary: '',
    image: '',
    author: '',
    tags: [],
    isPublished: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (resolvedParams.id !== 'new') {
      fetchArticle()
    }
  }, [resolvedParams.id])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/news/${resolvedParams.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch article')
      }
      const data = await response.json()
      setArticle(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = resolvedParams.id === 'new' ? '/api/news' : `/api/news/${resolvedParams.id}`
      const method = resolvedParams.id === 'new' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      })

      if (!response.ok) {
        throw new Error('Failed to save article')
      }

      router.push('/admin/news')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article')
    } finally {
      setLoading(false)
    }
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!article.tags?.includes(tagInput.trim())) {
        setArticle((prev: Partial<NewsArticle>) => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()],
        }))
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setArticle((prev: Partial<NewsArticle>) => ({
      ...prev,
      tags: prev.tags?.filter((tag: string) => tag !== tagToRemove) || [],
    }))
  }

  if (loading && resolvedParams.id !== 'new') {
    return (
      <div className='min-h-screen bg-gray-100 p-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-1/4 mb-8'></div>
            <div className='space-y-4'>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
              <div className='h-32 bg-gray-200 rounded'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>
          {resolvedParams.id === 'new' ? 'Create News Article' : 'Edit News Article'}
        </h1>

        {error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Title</label>
            <input
              type='text'
              value={article.title}
              onChange={e => setArticle((prev: Partial<NewsArticle>) => ({ ...prev, title: e.target.value }))}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Summary</label>
            <textarea
              value={article.summary}
              onChange={e => setArticle((prev: Partial<NewsArticle>) => ({ ...prev, summary: e.target.value }))}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              rows={3}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Content</label>
            <textarea
              value={article.content}
              onChange={e => setArticle((prev: Partial<NewsArticle>) => ({ ...prev, content: e.target.value }))}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              rows={10}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Image URL</label>
            <input
              type='url'
              value={article.image}
              onChange={e => setArticle((prev: Partial<NewsArticle>) => ({ ...prev, image: e.target.value }))}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Author</label>
            <input
              type='text'
              value={article.author}
              onChange={e => setArticle((prev: Partial<NewsArticle>) => ({ ...prev, author: e.target.value }))}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Tags</label>
            <div className='mt-1 flex flex-wrap gap-2'>
              {article.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                >
                  {tag}
                  <button
                    type='button'
                    onClick={() => removeTag(tag)}
                    className='ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200'
                  >
                    <FaTimes className='w-2 h-2' />
                  </button>
                </span>
              ))}
            </div>
            <input
              type='text'
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder='Type a tag and press Enter'
              className='mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='isPublished'
              checked={article.isPublished}
              onChange={e => setArticle((prev: Partial<NewsArticle>) => ({ ...prev, isPublished: e.target.checked }))}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label htmlFor='isPublished' className='ml-2 block text-sm text-gray-900'>
              Publish immediately
            </label>
          </div>

          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              onClick={() => router.push('/admin/news')}
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              {loading ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
