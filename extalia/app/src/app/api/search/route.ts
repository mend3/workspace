import { primaryColumns, TraversalResult } from '@/lib/dat/schemas'
import { TxtRepository } from '@/lib/TxtRepository'

export async function POST(request: Request) {
  const encoder = new TextEncoder()
  const visited = new Map<string, TraversalResult>()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { searchTerm, file } = await request.json()

        if (!searchTerm || !file) {
          controller.enqueue(encoder.encode(JSON.stringify({ error: 'Search term and file are required' })))
          controller.close()
          return
        }

        const repository = new TxtRepository()
        let resultCount = 0

        for await (const record of repository.lookup(file, row =>
          Object.entries(row)
            .filter(([key, value]) => key !== '__hash')
            .some(([key, value]) =>
              primaryColumns[file as keyof typeof primaryColumns].some(
                v => !!row[v] && String(row[v]) === String(searchTerm),
              ),
            ),
        )) {
          if (resultCount >= 100) break // Limit results to prevent overwhelming the client

          controller.enqueue(encoder.encode(JSON.stringify({ results: [record] }) + '\n'))
          resultCount++
        }

        controller.close()
      } catch (error) {
        console.error('Search error:', error)
        controller.enqueue(encoder.encode(JSON.stringify({ error: 'Failed to perform search' })))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Transfer-Encoding': 'chunked',
    },
  })
}
