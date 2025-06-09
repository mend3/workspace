import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { CreateNewsArticle, UpdateNewsArticle } from '@/types/news'

// GET /api/news - Get all published news articles
export async function GET() {
  try {
    const articles = await prisma.newsArticle.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })

    // Convert JSON string tags back to arrays
    const articlesWithParsedTags = articles.map(article => ({
      ...article,
      tags: JSON.parse(article.tags),
    }))

    return NextResponse.json(articlesWithParsedTags)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news articles' }, { status: 500 })
  }
}

// POST /api/news - Create a new news article
export async function POST(request: Request) {
  try {
    const body: CreateNewsArticle = await request.json()

    const article = await prisma.newsArticle.create({
      data: {
        ...body,
        tags: JSON.stringify(body.tags), // Convert array to JSON string
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Convert JSON string tags back to array for response
    const articleWithParsedTags = {
      ...article,
      tags: JSON.parse(article.tags),
    }

    return NextResponse.json(articleWithParsedTags)
  } catch (error) {
    console.error('Error creating news article:', error)
    return NextResponse.json({ error: 'Failed to create news article' }, { status: 500 })
  }
}
