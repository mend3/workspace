import { ReactNode } from 'react'
import Card from './Card'

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
  className?: string
}

export default function FeatureCard({ title, description, icon, className = '' }: FeatureCardProps) {
  return (
    <Card className={`p-6 hover:scale-105 transition-transform duration-300 ${className}`}>
      <div className='flex items-center space-x-4'>
        <div className='text-blue-600 text-2xl'>{icon}</div>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          <p className='mt-2 text-gray-600'>{description}</p>
        </div>
      </div>
    </Card>
  )
}
