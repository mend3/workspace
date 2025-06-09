import { ReactNode } from 'react'
import Card from './Card'

interface StatusItemProps {
  label: string
  value: string | number
  icon: ReactNode
  status?: 'online' | 'offline' | 'maintenance'
}

function StatusItem({ label, value, icon, status = 'online' }: StatusItemProps) {
  const statusColors = {
    online: 'text-green-500',
    offline: 'text-red-500',
    maintenance: 'text-yellow-500',
  }

  return (
    <div className='flex items-center justify-between p-4 border-b last:border-b-0'>
      <div className='flex items-center space-x-3'>
        <div className={`text-xl ${statusColors[status]}`}>{icon}</div>
        <span className='text-gray-700'>{label}</span>
      </div>
      <span className='font-medium'>{value}</span>
    </div>
  )
}

interface ServerStatusProps {
  items: StatusItemProps[]
  className?: string
}

export default function ServerStatus({ items, className = '' }: ServerStatusProps) {
  return (
    <Card className={className}>
      <div className='p-4 bg-gray-50 border-b'>
        <h3 className='text-lg font-semibold text-gray-900'>Server Status</h3>
      </div>
      <div className='divide-y'>
        {items.map((item, index) => (
          <StatusItem key={index} {...item} />
        ))}
      </div>
    </Card>
  )
}
