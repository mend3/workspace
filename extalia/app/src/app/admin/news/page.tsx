'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa'
import { type NewsArticle } from '@/generated/prisma'
import { newsItems } from '@/sources/app'

export default function NewsManagement() {
  const [articles, setArticles] = useState<NewsArticle[]>(newsItems)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/news')
      if (!response.ok) throw new Error('Failed to fetch articles')
      const data = await response.json()
      setArticles(current => [...data, ...current])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublishToggle = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      })
      if (!response.ok) throw new Error('Failed to update article')
      fetchArticles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete article')
      fetchArticles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-900 text-white p-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-gray-700 rounded w-1/4'></div>
            <div className='h-4 bg-gray-700 rounded w-1/2'></div>
            <div className='space-y-2'>
              {[1, 2, 3].map(i => (
                <div key={i} className='h-24 bg-gray-700 rounded'></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>News Management</h1>
            <p className='text-gray-400'>Manage your server news articles</p>
          </div>
          <button
            onClick={() => (window.location.href = '/admin/news/new')}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'
          >
            <FaPlus /> New Article
          </button>
        </div>

        {error && (
          <div className='bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6'>{error}</div>
        )}

        <div className='grid gap-6'>
          {articles.map(article => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-gray-800 rounded-lg p-6'
            >
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h2 className='text-xl font-semibold mb-2'>{article.title}</h2>
                  <p className='text-gray-400 text-sm'>
                    By {article.author} • {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handlePublishToggle(article.id, article.isPublished)}
                    className='p-2 text-gray-400 hover:text-white transition-colors'
                    title={article.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {article.isPublished ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    onClick={() => (window.location.href = `/admin/news/${article.id}`)}
                    className='p-2 text-gray-400 hover:text-white transition-colors'
                    title='Edit'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className='p-2 text-gray-400 hover:text-red-500 transition-colors'
                    title='Delete'
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className='text-gray-300 mb-4'>{article.summary}</p>
              <div className='flex flex-wrap gap-2'>
                {(typeof article.tags === 'string' ? JSON.parse(article.tags) : (article.tags as any)).map(
                  (tag: string) => (
                    <span key={tag} className='bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm'>
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
