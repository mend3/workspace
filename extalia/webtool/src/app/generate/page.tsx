'use client'

import { useState } from 'react'
import { ItemSetData, GeneratedFiles, CalculatedIds } from '@/lib/itemset'
import { calculateIds, generateFiles } from '@/utils/fileGenerators'

export default function Home() {
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFiles | null>(null)
  const [calculatedIds, setCalculatedIds] = useState<CalculatedIds | null>(null)
  const [includeHelmet, setIncludeHelmet] = useState(true)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const baseId = parseInt(formData.get('baseId') as string)
    const includeShield = formData.get('includeShield') === 'true'
    const includeHelmet = formData.get('includeHelmet') === 'true'
    const existingHelmetId = formData.get('existingHelmetId')
      ? parseInt(formData.get('existingHelmetId') as string)
      : undefined

    const ids = calculateIds({ baseId, includeShield, existingHelmetId })
    setCalculatedIds(ids)

    const data: ItemSetData = {
      setName: formData.get('setName') as string,
      baseId,
      setBonusDesc: formData.get('setBonusDesc') as string,
      shieldBonusDesc: formData.get('shieldBonusDesc') as string,
      enchantBonusDesc: formData.get('enchantBonusDesc') as string,
      includeShield,
      includeHelmet,
      existingHelmetId,
    }

    const files = generateFiles(data)
    setGeneratedFiles(files)
  }

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <main className='min-h-screen p-8 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-8'>Item Set Generator</h1>

      <form onSubmit={handleSubmit} className='space-y-8'>
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold'>Basic Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='setName' className='block text-sm font-medium mb-1'>
                Set Name
              </label>
              <input type='text' id='setName' name='setName' required className='w-full px-3 py-2 border rounded-md' />
            </div>
            <div>
              <label htmlFor='baseId' className='block text-sm font-medium mb-1'>
                Base ID
              </label>
              <input type='number' id='baseId' name='baseId' required className='w-full px-3 py-2 border rounded-md' />
              <p className='text-sm text-gray-500 mt-1'>
                Other IDs will be calculated automatically (Base ID + 1, +2, etc.)
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <h2 className='text-xl font-semibold'>Set Configuration</h2>
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='includeHelmet'
                name='includeHelmet'
                value='true'
                checked={includeHelmet}
                onChange={e => setIncludeHelmet(e.target.checked)}
                className='rounded border-gray-300'
              />
              <label htmlFor='includeHelmet' className='text-sm font-medium'>
                Create New Helmet
              </label>
            </div>

            {!includeHelmet && (
              <div>
                <label htmlFor='existingHelmetId' className='block text-sm font-medium mb-1'>
                  Existing Helmet ID
                </label>
                <input
                  type='number'
                  id='existingHelmetId'
                  name='existingHelmetId'
                  required
                  className='w-full px-3 py-2 border rounded-md'
                />
              </div>
            )}

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='includeShield'
                name='includeShield'
                value='true'
                className='rounded border-gray-300'
              />
              <label htmlFor='includeShield' className='text-sm font-medium'>
                Include Shield in Set
              </label>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <h2 className='text-xl font-semibold'>Set Bonuses</h2>
          <div className='space-y-4'>
            <div>
              <label htmlFor='setBonusDesc' className='block text-sm font-medium mb-1'>
                Set Bonus Description
              </label>
              <textarea
                id='setBonusDesc'
                name='setBonusDesc'
                required
                placeholder='Set Bonus Description'
                defaultValue='Set Bonus Description'
                rows={3}
                className='w-full px-3 py-2 border rounded-md'
              />
            </div>
            <div>
              <label htmlFor='shieldBonusDesc' className='block text-sm font-medium mb-1'>
                Shield Bonus Description
              </label>
              <textarea
                id='shieldBonusDesc'
                name='shieldBonusDesc'
                placeholder='Shield Bonus Description'
                defaultValue='Shield Bonus Description'
                rows={3}
                className='w-full px-3 py-2 border rounded-md'
              />
            </div>
            <div>
              <label htmlFor='enchantBonusDesc' className='block text-sm font-medium mb-1'>
                Enchant Bonus Description
              </label>
              <textarea
                id='enchantBonusDesc'
                name='enchantBonusDesc'
                required
                placeholder='Enchant Bonus Description'
                defaultValue='Enchant Bonus Description'
                rows={3}
                className='w-full px-3 py-2 border rounded-md'
              />
            </div>
          </div>
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'
        >
          Generate Files
        </button>
      </form>

      {calculatedIds && (
        <div className='mt-8 p-4 bg-gray-50 rounded-lg'>
          <h2 className='text-xl font-semibold mb-4'>Calculated IDs</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            <div>
              <span className='text-sm font-medium'>Chest:</span>
              <span className='ml-2'>{calculatedIds.chest}</span>
            </div>
            <div>
              <span className='text-sm font-medium'>Legs:</span>
              <span className='ml-2'>{calculatedIds.legs}</span>
            </div>
            <div>
              <span className='text-sm font-medium'>Head:</span>
              <span className='ml-2'>{calculatedIds.helmet}</span>
            </div>
            <div>
              <span className='text-sm font-medium'>Gloves:</span>
              <span className='ml-2'>{calculatedIds.gloves}</span>
            </div>
            <div>
              <span className='text-sm font-medium'>Feet:</span>
              <span className='ml-2'>{calculatedIds.feet}</span>
            </div>
            {calculatedIds.shield && (
              <div>
                <span className='text-sm font-medium'>Shield:</span>
                <span className='ml-2'>{calculatedIds.shield}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {generatedFiles && (
        <div className='mt-8 space-y-6'>
          <h2 className='text-2xl font-bold'>Generated Files</h2>
          <div className='space-y-4'>
            {Object.entries(generatedFiles).map(([filename, content]) => (
              <div key={filename} className='border rounded-lg p-4'>
                <h3 className='text-lg font-semibold mb-2'>{filename}</h3>
                <div className='relative'>
                  <pre className='bg-gray-100 p-4 rounded-md overflow-x-auto text-sm'>{content.concat('\n')}</pre>
                </div>
                <div className='flex grow justify-between'>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(content)
                      const button = document.getElementById(`copy-${filename}`)
                      if (button) {
                        button.textContent = 'Copied!'
                        const timeout = setTimeout(() => {
                          button.textContent = 'Copy'
                          clearTimeout(timeout)
                        }, 2000)
                      }
                    }}
                    id={`copy-${filename}`}
                    className='mt-2 bg-gray-600 text-white py-1 px-3 rounded-md hover:bg-gray-700 transition-colors text-sm'
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => downloadFile(filename, content)}
                    className='mt-2 bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors'
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
