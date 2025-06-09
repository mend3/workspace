'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaUser, FaTag, FaArrowLeft } from 'react-icons/fa'
import { NewsArticle } from '@/generated/prisma'

interface Props {
  params: {
    id: string
  }
}

export default function NewsArticlePage({ params }: Props) {
  const router = useRouter()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArticle()
  }, [params.id])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/news/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch article')
      const data = await response.json()
      setArticle(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-900 text-white p-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-gray-700 rounded w-1/4'></div>
            <div className='h-4 bg-gray-700 rounded w-1/2'></div>
            <div className='h-64 bg-gray-700 rounded'></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className='min-h-screen bg-gray-900 text-white p-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg'>
            {error || 'Article not found'}
          </div>
          <button
            onClick={() => router.push('/news')}
            className='mt-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2'
          >
            <FaArrowLeft /> Back to News
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white p-8'>
      <div className='max-w-4xl mx-auto'>
        <button
          onClick={() => router.push('/news')}
          className='mb-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2'
        >
          <FaArrowLeft /> Back to News
        </button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-gray-800 rounded-lg overflow-hidden'
        >
          {article.image && (
            <div className='relative h-64'>
              <img src={article.image} alt={article.title} className='w-full h-full object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent'></div>
            </div>
          )}

          <div className='p-8'>
            <h1 className='text-4xl font-bold mb-6'>{article.title}</h1>

            <div className='flex items-center gap-6 text-sm text-gray-400 mb-8'>
              <div className='flex items-center gap-2'>
                <FaUser />
                <span>{article.author}</span>
              </div>
              <div className='flex items-center gap-2'>
                <FaCalendarAlt />
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className='prose prose-invert max-w-none mb-8'>
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className='mb-4'>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className='flex flex-wrap gap-2'>
              {(article.tags as any).map((tag: string) => (
                <span
                  key={tag}
                  className='bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2'
                >
                  <FaTag size={12} /> {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  )
}
