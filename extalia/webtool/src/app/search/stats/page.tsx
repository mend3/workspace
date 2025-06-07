'use client'

import { useEffect, useState } from 'react'

type XmlFile = { path: string; content: string }

export default function XmlFilesClient() {
  const [files, setFiles] = useState<XmlFile[]>([])

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch('/api/stats')
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      if (!reader) return

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let lines = buffer.split('\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (line.trim()) {
            const file = JSON.parse(line)
            setFiles(prev => [...prev, file])
          }
        }
      }
      if (buffer.trim()) {
        const file = JSON.parse(buffer)
        setFiles(prev => [...prev, file])
      }
    }

    fetchFiles()
  }, [])

  return (
    <main>
      <h1>XML Files (Streamed)</h1>
      <ul>
        {files.map((file, idx) => (
          <li key={idx}>
            <strong>{file.path}</strong>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(file.content, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </main>
  )
}
