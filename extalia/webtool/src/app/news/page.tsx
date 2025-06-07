'use client'

import { newsItems } from '@/sources/app'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaCalendarAlt, FaTag, FaUser } from 'react-icons/fa'
import { NewsArticle } from '../../generated/prisma'

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>(newsItems)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/news')
      if (!response.ok) throw new Error('Failed to fetch articles')
      const data = await response.json()
      setArticles(current => [...current, ...data])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const allTags = Array.from(new Set(articles.flatMap(article => JSON.parse(article.tags)))).sort()

  const filteredArticles = selectedTag ? articles.filter(article => article.tags.includes(selectedTag)) : articles

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
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Server News</h1>
          <p className='text-gray-400'>Stay updated with the latest news and announcements</p>
        </div>

        {error && (
          <div className='bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6'>{error}</div>
        )}

        {allTags.length > 0 && (
          <div className='mb-8'>
            <div className='flex flex-wrap gap-2'>
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === null ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className='grid gap-8'>
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className='bg-gray-800 rounded-lg overflow-hidden'
            >
              {article.image && (
                <div className='relative h-48'>
                  <img src={article.image} alt={article.title} className='w-full h-full object-cover' />
                  <div className='absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent'></div>
                </div>
              )}
              <div className='p-6'>
                <h2 className='text-2xl font-bold mb-4'>{article.title}</h2>
                <div className='flex items-center gap-4 text-sm text-gray-400 mb-4'>
                  <div className='flex items-center gap-2'>
                    <FaUser />
                    <span>{article.author}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <FaCalendarAlt />
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className='text-gray-300 mb-4'>{article.summary}</p>
                <div className='flex flex-wrap gap-2'>
                  {(JSON.parse(article.tags) as string[]).map((tag: string) => (
                    <span
                      key={tag}
                      className='bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm flex items-center gap-1'
                    >
                      <FaTag size={12} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}

          {filteredArticles.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-gray-400'>No articles found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
