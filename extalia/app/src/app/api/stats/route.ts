'use server'

import { getReadableStream } from '@/utils/xml.reader'
import { NextRequest } from 'next/server'
import path from 'path'

export async function GET(req: NextRequest) {
  const rootDir = path.join(process.cwd(), 'public', 'stats')
  const stream = getReadableStream(rootDir)

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
