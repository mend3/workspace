import { ReactNode } from 'react'
import Card from './Card'

interface StatItem {
  label: string
  value: string | number
  description?: string
  icon?: ReactNode
}

interface StatsGridProps {
  title: string
  description?: string
  stats: StatItem[]
  columns?: 1 | 2 | 3 | 4
}

export default function StatsGrid({ title, description, stats, columns = 2 }: StatsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
        {description && <p className='mt-1 text-sm text-gray-500'>{description}</p>}
      </div>

      <div className={`grid ${gridCols[columns]} gap-6`}>
        {stats.map((stat, index) => (
          <Card key={index} className='p-6'>
            <div className='flex items-start space-x-4'>
              {stat.icon && <div className='flex-shrink-0 text-blue-600'>{stat.icon}</div>}
              <div>
                <div className='text-sm font-medium text-gray-500'>{stat.label}</div>
                <div className='mt-1 text-2xl font-semibold text-gray-900'>{stat.value}</div>
                {stat.description && <div className='mt-1 text-sm text-gray-500'>{stat.description}</div>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
