'use client'

import { useState } from 'react'
import { SystemFileName, SystemRow, TraversalResult } from '@/lib/dat/schemas'
import RecursiveRecordViewer, { RecordTable } from '@/components/ui/SearchRender'

const AVAILABLE_FILES: SystemFileName[] = [
  'itemname',
  'actionname',
  'castlename',
  'commandname',
  'questname',
  'npcname',
  'zonename',
  'skillname',
  'servername',
  'symbolname',
  'armorgrp',
  'weapongrp',
  'etcitemgrp',
  'classinfo',
  'clientdata',
  'creditgrp',
  'staticobject',
  'sysstring',
  'systemmsg',
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<TraversalResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchingFiles, setSearchingFiles] = useState<Set<SystemFileName>>(new Set())

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsSearching(true)
    setResults([])
    setError(null)
    setSearchingFiles(new Set(AVAILABLE_FILES))

    const searchPromises = AVAILABLE_FILES.map(async file => {
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchTerm,
            file,
          }),
        })

        if (!response.ok) {
          throw new Error(`Search failed for ${file}`)
        }

        if (!response.body) {
          throw new Error(`No response body for ${file}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter(Boolean)

          for (const line of lines) {
            try {
              const data = JSON.parse(line)
              if (data.error) {
                throw new Error(data.error)
              }
              if (data.results) {
                setResults(current => current.concat(data.results))
              }
            } catch (error) {
              console.error(`Error parsing chunk for ${file}:`, error)
            }
          }
        }
      } catch (error) {
        console.error(`Search error for ${file}:`, error)
        setError(prev => (prev ? `${prev}\nFailed to search ${file}` : `Failed to search ${file}`))
      } finally {
        setSearchingFiles(current => {
          const next = new Set(current)
          next.delete(file)
          return next
        })
      }
    })

    await Promise.all(searchPromises)
    setIsSearching(false)
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Search Database</h1>

      <form onSubmit={handleSearch} className='mb-8'>
        <div className='flex gap-4 mb-4'>
          <input
            type='text'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Enter ID to search...'
            className='flex-1 px-4 py-2 border rounded-lg'
          />

          <button
            type='submit'
            disabled={isSearching}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 whitespace-pre-line'>
          {error}
        </div>
      )}

      {searchingFiles.size > 0 && (
        <div className='mb-4'>
          <h3 className='text-sm font-medium text-gray-700 mb-2'>Searching in:</h3>
          <div className='flex flex-wrap gap-2'>
            {Array.from(searchingFiles).map((file, index) => (
              <span key={`${file}-${index}`} className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
                {file}
              </span>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 ? (
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold'>Results ({results.length})</h2>
            <button onClick={() => setResults([])} className='text-sm text-gray-500 hover:text-gray-700'>
              Clear results
            </button>
          </div>
          {results.map((result, index) => (
            <div key={`${result.record.__hash}-${index}`} className='p-4 border rounded-lg bg-white shadow-sm'>
              <RecursiveRecordViewer data={result} />
            </div>
          ))}
        </div>
      ) : searchTerm && !isSearching && !error ? (
        <p className='text-gray-500'>No results found</p>
      ) : null}
    </div>
  )
}
