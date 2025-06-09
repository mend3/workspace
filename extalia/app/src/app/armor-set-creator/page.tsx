'use client'

import { useState, useRef } from 'react'
import { ArmorSetData, ArmorSetEffects, JewelrySetEffects, WeaponEffects } from '@/types/armor-set'
import { generateIDs } from '@/utils/id-generator'
import {
  generateArmorSetItems,
  generateJewelrySetItems,
  generateWeaponItems,
  generateShieldItems,
  generateSkillNames,
  generateSkillGrp,
} from '@/utils/template-generator'

interface BatchItem {
  tag: number
  id: string
  name: string
  icon: string
  effectDescription?: string
  effectBonus?: string
  enchantBonus?: string
}

export default function ArmorSetCreator() {
  const [armorSetData, setArmorSetData] = useState<ArmorSetData>({
    setName: '',
    helmetId: null,
    effects: {
      setBonus: '',
      setEnchantBonus: '',
      setEffectDescription: '',
    },
    includeShield: false,
  })

  const [showJewelrySet, setShowJewelrySet] = useState(false)
  const [showWeapon, setShowWeapon] = useState(false)
  const [generatedData, setGeneratedData] = useState<string>('')
  const [generateHelmet, setGenerateHelmet] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [batchItems, setBatchItems] = useState<BatchItem[]>([])
  const [batchMode, setBatchMode] = useState(false)
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleArmorSetChange = (field: keyof ArmorSetEffects, value: string) => {
    setArmorSetData(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [field]: value,
      },
    }))
  }

  const handleJewelrySetChange = (field: keyof JewelrySetEffects, value: string) => {
    setArmorSetData(prev => ({
      ...prev,
      jewelrySet: {
        ...prev.jewelrySet!,
        effects: {
          ...prev.jewelrySet!.effects,
          [field]: value,
        },
      },
    }))
  }

  const handleWeaponChange = (field: keyof WeaponEffects, value: string) => {
    setArmorSetData(prev => ({
      ...prev,
      weapon: {
        ...prev.weapon!,
        effects: {
          ...prev.weapon!.effects,
          [field]: value,
        },
      },
    }))
  }

  const handleBatchFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target?.result as string
      processBatchText(text)
    }
    reader.readAsText(file)
  }

  const handleBatchTextPaste = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    processBatchText(text)
  }

  const processBatchText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    const items: BatchItem[] = lines.map(line => {
      // 1	9209	Titanium	icon.armor_t1004_u_i00
      // 1	9221	Night Crystal
      // 1	9231	Purple Crystal
      // 1	9243	Purple Crystal PvP
      // 1	9255	Vesper Dawn
      // 1	9267	Vesper Dusk
      // 1	9279	Vesper Twillight
      // 1	9291	Vesper Fire
      // 1	9303	Vesper Ice
      // 1	9315	Vesper Nature
      // 1	9327	Vesper Shadow
      // 1	9339	Vesper Abyssal
      // 1	9351	Vesper Crusade
      // 1	9363	Vesper Carmine
      // 1	9375	Vesper Carmine Pvp
      // 1	9388	Vesper Cobalt
      // 1	9400	Vesper Cobalt PvP
      // 1	9413	Vesper Crystal
      // 1	9425	Vesper Ixion
      // 1	9437	Moirai
      // 1	9449	Transcedent
      // 1	9461	Moirai V2
      // 1	9473	Dynasty
      // 1	9485	Dynasty Shoulders
      // 1	9507	Dynasty Ash
      // 1	9519	Dynasty Green
      // 1	9531	Dynasty Elegia
      // 1	9543	Unique
      // 1	9555	R99
      // 1	9567	R99 Blue
      // 1	9579	R99 Gold
      // 1	9591	R95
      // 1	9603	R87
      // 1	9615	R87 V2
      // 1	9627	R85
      // 1	9639	Ertheia
      // 1	9651	Pvp Dragon
      // 1	9663	Pvp Eagle
      // 1	9675	Noble Silver
      // 1	9687	Exodus
      // 1	9699	Exodus V2
      // 1	9711	Noble Gold
      // 1	9723	Red Dragon
      // 1	9735	Blue Dragon

      const [tag, id, name, icon, effectDescription, effectBonus, enchantBonus] = line
        .split('\t')
        .map(item => item.trim())
      return { tag: +tag, id, name, icon, effectDescription, effectBonus, enchantBonus }
    })
    setBatchItems(items)
  }

  const generateBatch = async () => {
    if (batchItems.length === 0) return

    setIsGenerating(true)
    setBatchProgress({ current: 0, total: batchItems.length })
    let allOutput = ''

    const _effectDescription = 'DEX-2, STR+2, P. Def. +8%, and maximum HP +445. Chance to get Sleep/Hold attack -70%.'
    const _effectBonus = 'Chance to get Poison/Bleed attack -80%.'
    const _enchantBonus =
      'When all set items are enchanted by 6 or higher, P. Def. and MP regeneration rate will increase.'

    for (let i = 0; i < batchItems.length; i++) {
      const item = batchItems[i]
      setBatchProgress(prev => ({ ...prev, current: i + 1 }))

      // Create armor set data for this item
      const itemData: ArmorSetData = {
        setName: item.name,
        chestId: +item.id,
        icon: item.icon,
        effects: {
          setBonus: item.effectBonus || _effectBonus,
          setEnchantBonus: item.enchantBonus || _enchantBonus,
          setEffectDescription: item.effectDescription || _effectDescription,
        },
        includeShield: false,
        helmetId: generateHelmet ? 9774 : null,
      }

      const ids = generateIDs(itemData)
      let output = ''

      output += generateArmorSetItems(itemData, ids)
      if (itemData.jewelrySet) {
        output += generateJewelrySetItems(itemData.jewelrySet, ids)
      }
      if (itemData.weapon) {
        output += generateWeaponItems(itemData.weapon, ids)
      }
      if (itemData.includeShield) {
        output += generateShieldItems(itemData.setName, ids)
      }
      output += generateSkillNames(itemData, ids)
      output += generateSkillGrp(itemData, ids)

      allOutput += output + '\n\n'
    }

    setGeneratedData(allOutput)
    setIsGenerating(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8'>
      <div className='container mx-auto px-4 max-w-4xl'>
        <div className='bg-white rounded-2xl shadow-xl p-6 mb-8 transform transition-all duration-300 hover:shadow-2xl'>
          <h1 className='text-3xl font-bold mb-6 text-gray-800 text-center'>Armor Set Creator</h1>

          {/* Mode Toggle */}
          <div className='flex justify-center mb-8'>
            <div className='inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50'>
              <button
                onClick={() => setBatchMode(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  !batchMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Single Set
              </button>
              <button
                onClick={() => setBatchMode(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  batchMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Batch Process
              </button>
            </div>
          </div>

          {batchMode ? (
            <div className='space-y-6'>
              <div className='flex flex-col space-y-4'>
                <div className='flex items-center justify-around space-x-4'>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300'
                  >
                    Upload File
                  </button>
                  <input
                    type='file'
                    ref={fileInputRef}
                    onChange={handleBatchFileUpload}
                    accept='.txt'
                    className='hidden'
                  />
                  <span className='text-gray-500'>or</span>
                  <button
                    onClick={() => setBatchItems([])}
                    className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300'
                  >
                    Clear
                  </button>
                  <label className='flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer transform transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02]'>
                    <input
                      type='checkbox'
                      checked={generateHelmet}
                      onChange={e => setGenerateHelmet(current => !current)}
                      className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500 transition-all duration-300'
                    />
                    <span className='ml-3 text-gray-700 font-medium'>Include Helmet</span>
                  </label>
                </div>
                <textarea
                  placeholder='Paste your batch data here (ID, Name, Icon separated by tabs)'
                  onChange={handleBatchTextPaste}
                  className='w-full h-40 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300'
                />
              </div>

              {batchItems.length > 0 && (
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h3 className='text-lg font-semibold mb-2'>Items to Process ({batchItems.length})</h3>
                  <div className='max-h-60 overflow-y-auto'>
                    {batchItems.map((item, index) => (
                      <div key={index} className='flex items-center space-x-2 py-1'>
                        <span className='text-gray-500'>{item.id}</span>
                        <span className='font-medium'>{item.name}</span>
                        <span className='text-gray-400'>{item.icon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className='flex justify-center'>
                <button
                  onClick={generateBatch}
                  disabled={isGenerating || batchItems.length === 0}
                  className={`px-8 py-4 rounded-lg text-white font-semibold transform transition-all duration-300 ${
                    isGenerating || batchItems.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isGenerating ? (
                    <span className='flex items-center'>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Processing {batchProgress.current} of {batchProgress.total}
                    </span>
                  ) : (
                    'Generate Batch'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Armor Set Form */}
              <div className='mb-8 space-y-6'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-700 flex items-center'>
                  <span className='mr-2'>🛡️</span> Armor Set
                </h2>
                <div className='grid grid-cols-1 gap-6'>
                  <div className='transform transition-all duration-300 hover:scale-[1.02]'>
                    <input
                      type='text'
                      placeholder='Set Name'
                      value={armorSetData.setName}
                      onChange={e => setArmorSetData(prev => ({ ...prev, setName: e.target.value }))}
                      className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300'
                    />
                  </div>
                  <div className='transform transition-all duration-300 hover:scale-[1.02]'>
                    <textarea
                      placeholder='Set Effect Description'
                      value={armorSetData.effects.setEffectDescription}
                      onChange={e => handleArmorSetChange('setEffectDescription', e.target.value)}
                      className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[100px]'
                    />
                  </div>
                  <div className='transform transition-all duration-300 hover:scale-[1.02]'>
                    <textarea
                      placeholder='Set Bonus'
                      value={armorSetData.effects.setBonus}
                      onChange={e => handleArmorSetChange('setBonus', e.target.value)}
                      className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[100px]'
                    />
                  </div>
                  <div className='transform transition-all duration-300 hover:scale-[1.02]'>
                    <textarea
                      placeholder='Set Enchant Bonus'
                      value={armorSetData.effects.setEnchantBonus}
                      onChange={e => handleArmorSetChange('setEnchantBonus', e.target.value)}
                      className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[100px]'
                    />
                  </div>
                </div>
              </div>

              {/* Toggles Section */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                <label className='flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer transform transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02]'>
                  <input
                    type='checkbox'
                    checked={showJewelrySet}
                    onChange={e => {
                      setShowJewelrySet(e.target.checked)
                      if (e.target.checked) {
                        setArmorSetData(prev => ({
                          ...prev,
                          jewelrySet: {
                            name: '',
                            effects: {
                              ringEffect: '',
                              earringEffect: '',
                              necklaceEffect: '',
                              setEffect: '',
                            },
                          },
                        }))
                      } else {
                        setArmorSetData(prev => {
                          const { jewelrySet, ...rest } = prev
                          return rest
                        })
                      }
                    }}
                    className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500 transition-all duration-300'
                  />
                  <span className='ml-3 text-gray-700 font-medium'>Include Jewelry Set</span>
                </label>

                <label className='flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer transform transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02]'>
                  <input
                    type='checkbox'
                    checked={showWeapon}
                    onChange={e => {
                      setShowWeapon(e.target.checked)
                      if (e.target.checked) {
                        setArmorSetData(prev => ({
                          ...prev,
                          weapon: {
                            name: '',
                            effects: {
                              description: '',
                            },
                          },
                        }))
                      } else {
                        setArmorSetData(prev => {
                          const { weapon, ...rest } = prev
                          return rest
                        })
                      }
                    }}
                    className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500 transition-all duration-300'
                  />
                  <span className='ml-3 text-gray-700 font-medium'>Include Weapon</span>
                </label>

                <label className='flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer transform transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02]'>
                  <input
                    type='checkbox'
                    checked={armorSetData.includeShield}
                    onChange={e => setArmorSetData(prev => ({ ...prev, includeShield: e.target.checked }))}
                    className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500 transition-all duration-300'
                  />
                  <span className='ml-3 text-gray-700 font-medium'>Include Shield</span>
                </label>
              </div>

              {/* Jewelry Set Form */}
              {showJewelrySet && armorSetData.jewelrySet && (
                <div className='mb-8 space-y-6 transform transition-all duration-500 ease-in-out'>
                  <h2 className='text-2xl font-semibold mb-4 text-gray-700 flex items-center'>
                    <span className='mr-2'>💎</span> Jewelry Set
                  </h2>
                  <div className='grid grid-cols-1 gap-6'>
                    <div className='transform transition-all duration-300 hover:scale-[1.02]'>
                      <input
                        type='text'
                        placeholder='Jewelry Set Name'
                        value={armorSetData.jewelrySet.name}
                        onChange={e =>
                          setArmorSetData(prev => ({
                            ...prev,
                            jewelrySet: { ...prev.jewelrySet!, name: e.target.value },
                          }))
                        }
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300'
                      />
                    </div>
                    <div className='transform transition-all duration-300 hover:scale-[1.02]'>
                      <textarea
                        placeholder='Ring Effect'
                        value={armorSetData.jewelrySet.effects.ringEffect}
                        onChange={e => handleJewelrySetChange('ringEffect', e.target.value)}
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[100px]'
                      />
                    </div>
                    <div className='transform transition-all duration-300 hover:scale-[1.02]'>
                      <textarea
                        placeholder='Earring Effect'
                        value={armorSetData.jewelrySet.effects.earringEffect}
                        onChange={e => handleJewelrySetChange('earringEffect', e.target.value)}
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[100px]'
                      />
                    </div>
                    <div className='transform transition-all duration-300 hover:scale-[1.02]'>
                      <textarea
                        placeholder='Necklace Effect'
                        value={armorSetData.jewelrySet.effects.necklaceEffect}
                        onChange={e => handleJewelrySetChange('necklaceEffect', e.target.value)}
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[100px]'
                      />
                    </div>
                    <div className='transform transition-all duration-300 hover:scale-[1.02]'>
                      <textarea
                        placeholder='Set Effect'
                        value={armorSetData.jewelrySet.effects.setEffect}
                        onChange={e => handleJewelrySetChange('setEffect', e.target.value)}
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[100px]'
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Weapon Form */}
              {showWeapon && armorSetData.weapon && (
                <div className='mb-8 space-y-6 transform transition-all duration-500 ease-in-out'>
                  <h2 className='text-2xl font-semibold mb-4 text-gray-700 flex items-center'>
                    <span className='mr-2'>⚔️</span> Weapon
                  </h2>
                  <div className='grid grid-cols-1 gap-6'>
                    <div className='transform transition-all duration-300 hover:scale-[1.02]'>
                      <input
                        type='text'
                        placeholder='Weapon Name'
                        value={armorSetData.weapon.name}
                        onChange={e =>
                          setArmorSetData(prev => ({
                            ...prev,
                            weapon: { ...prev.weapon!, name: e.target.value },
                          }))
                        }
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300'
                      />
                    </div>
                    <div className='transform transition-all duration-300 hover:scale-[1.02]'>
                      <textarea
                        placeholder='Weapon Description'
                        value={armorSetData.weapon.effects.description}
                        onChange={e => handleWeaponChange('description', e.target.value)}
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[100px]'
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                      {[1, 2, 3].map(num => (
                        <div key={num} className='space-y-4 transform transition-all duration-300 hover:scale-[1.02]'>
                          <input
                            type='text'
                            placeholder={`Effect ${num}`}
                            value={armorSetData.weapon?.effects[`effect${num}` as keyof WeaponEffects] || ''}
                            onChange={e => handleWeaponChange(`effect${num}` as keyof WeaponEffects, e.target.value)}
                            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300'
                          />
                          <textarea
                            placeholder={`Effect ${num} Description`}
                            value={armorSetData.weapon?.effects[`effectDescription${num}` as keyof WeaponEffects] || ''}
                            onChange={e =>
                              handleWeaponChange(`effectDescription${num}` as keyof WeaponEffects, e.target.value)
                            }
                            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[100px]'
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className='flex justify-center mb-8'>
                <button
                  onClick={generateBatch}
                  disabled={isGenerating || batchItems.length === 0}
                  className={`px-8 py-4 rounded-lg text-white font-semibold transform transition-all duration-300 ${
                    isGenerating || batchItems.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isGenerating ? (
                    <span className='flex items-center'>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Processing {batchProgress.current} of {batchProgress.total}
                    </span>
                  ) : (
                    'Generate Batch'
                  )}
                </button>
              </div>
            </>
          )}

          {/* Generated Data Display */}
          {generatedData && (
            <div className='transform transition-all duration-500 ease-in-out mt-8'>
              <h2 className='text-2xl font-semibold mb-4 text-gray-700 flex items-center'>
                <span className='mr-2'>📋</span> Generated Data
              </h2>
              <div className='relative'>
                <pre className='bg-gray-50 p-6 rounded-lg overflow-auto max-h-[500px] text-sm font-mono border border-gray-200 shadow-inner'>
                  {generatedData}
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedData)}
                  className='absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-300'
                  title='Copy to clipboard'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
