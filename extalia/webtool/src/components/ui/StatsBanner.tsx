import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StatItem {
  label: string
  value: string | number
  icon: ReactNode
}

interface StatsBannerProps {
  stats: StatItem[]
}

export default function StatsBanner({ stats }: StatsBannerProps) {
  return (
    <div className='bg-blue-600 py-16'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className='text-center text-white'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className='text-4xl mb-4 flex justify-center'>{stat.icon}</div>
              <div className='text-4xl font-bold mb-2'>{stat.value}</div>
              <div className='text-blue-100'>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
