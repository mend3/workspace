import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import type { UpdateNewsArticle } from '@/types/news'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { id: params.id },
    })

    if (!article) {
      return new NextResponse('Article not found', { status: 404 })
    }

    // Convert JSON string tags back to array
    const articleWithParsedTags = {
      ...article,
      tags: JSON.parse(JSON.stringify(article.tags)),
    }

    return NextResponse.json(articleWithParsedTags)
  } catch (error) {
    console.error('Error fetching article:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as UpdateNewsArticle
    const article = await prisma.newsArticle.update({
      where: { id: params.id },
      data: {
        ...body,
        tags: body.tags ? (JSON.stringify(body.tags) as any) : [],
        updatedAt: new Date(),
      },
    })

    // Convert JSON string tags back to array
    const articleWithParsedTags = {
      ...article,
      tags: JSON.parse(JSON.stringify(article.tags)),
    }

    return NextResponse.json(articleWithParsedTags)
  } catch (error) {
    console.error('Error updating article:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.newsArticle.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting article:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as Partial<UpdateNewsArticle>
    const article = await prisma.newsArticle.update({
      where: { id: params.id },
      data: {
        ...body,
        tags: body.tags ? (JSON.stringify(body.tags) as any) : [],
        updatedAt: new Date(),
      },
    })

    // Convert JSON string tags back to array
    const articleWithParsedTags = {
      ...article,
      tags: JSON.parse(JSON.stringify(article.tags)),
    }

    return NextResponse.json(articleWithParsedTags)
  } catch (error) {
    console.error('Error updating article:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
