import { SystemRow, TraversalResult } from '@/lib/dat/schemas'
import React, { useState } from 'react'

// Helper to pretty-print key-value pairs, skipping __source and __hash
export function RecordTable({ record }: { record: SystemRow }) {
  if (!record) return null
  return (
    <table className='min-w-full text-xs text-left border border-gray-200 mb-2'>
      <tbody>
        {Object.entries(record)
          .filter(([k]) => !['__source', '__hash'].includes(k))
          .map(([key, value]) => (
            <tr key={key} className='border-b last:border-b-0'>
              <td className='px-2 py-1 font-semibold text-gray-700 bg-gray-50'>{key}</td>
              <td className='px-2 py-1 text-gray-900'>{String(value)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}

// Recursive component
function RecursiveRecordViewer({ data, level = 0 }: { data: TraversalResult; level?: number }) {
  const [expanded, setExpanded] = useState(level === 0) // root expanded by default
  if (!data) return null

  return (
    <div className={`border rounded-lg p-4 mb-4 bg-white shadow-sm ${level > 0 ? 'ml-4' : ''}`}>
      <div className='mb-2 flex flex-wrap items-center gap-2'>
        {data.file && (
          <span className='inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold uppercase'>
            {data.file}
          </span>
        )}
        {/* {data.sql && Object.keys(data.sql).length > 0 && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                    <code lang="sql">INSERT INTO table ({Object.entries(data.sql).map(([k, v]) => k).join(", ")}) VALUES ({Object.entries(data.sql).map(([k, v]) => typeof v === "string" ? `'${v}'` : v).join(", ")})</code>
                </span>
            )} */}
      </div>
      {data.record && (
        <div className='mb-2'>
          <RecordTable record={data.record} />
        </div>
      )}
      {data.related && data.related.length > 0 && (
        <div className='mt-2'>
          <button
            className='mb-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-xs font-semibold transition'
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'Hide Related ▲' : 'Show Related ▼'}
          </button>
          {expanded && (
            <div>
              <div className='font-semibold text-gray-600 mb-1'>Related:</div>
              <div>
                {data.related.map((rel, idx) => (
                  <RecursiveRecordViewer key={idx} data={rel} level={level + 1} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RecursiveRecordViewer
