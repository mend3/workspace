import { useState } from 'react'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  children: React.ReactNode[]
}

export default function Tabs({ tabs, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <div className='border-b border-gray-200'>
        <div className='overflow-x-auto'>
          <nav className='flex min-w-max' aria-label='Tabs'>
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={`
                  whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm
                  flex items-center space-x-2
                  ${
                    activeTab === index
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className='text-lg'>{tab.icon}</span>
                <span className='hidden sm:inline'>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className='mt-6'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {children[activeTab]}
        </motion.div>
      </div>
    </div>
  )
}
