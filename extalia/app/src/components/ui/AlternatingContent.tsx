import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AlternatingContentProps {
  title: string
  description: string
  image: string
  reverse?: boolean
  children?: ReactNode
}

export default function AlternatingContent({
  title,
  description,
  image,
  reverse = false,
  children,
}: AlternatingContentProps) {
  return (
    <div className={`py-16 ${reverse ? 'bg-gray-50' : ''}`}>
      <div className='container mx-auto px-4'>
        <div className={`flex flex-col lg:flex-row items-center gap-12 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          {/* Image container - hidden on mobile, shown on desktop */}
          <motion.div
            className='hidden lg:block lg:w-1/2'
            initial={{ opacity: 0, x: reverse ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img src={image} alt={title} className='rounded-lg shadow-xl w-full h-[400px] object-cover' />
          </motion.div>

          {/* Content container with background image on mobile */}
          <motion.div
            className='w-full lg:w-1/2 relative'
            initial={{ opacity: 0, x: reverse ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Mobile background image */}
            <div className='lg:hidden absolute inset-0 z-0'>
              <div className='absolute inset-0 bg-black/60' />
              <img src={image} alt='' className='w-full h-full object-cover' />
            </div>

            {/* Content */}
            <div className='relative z-10 p-8 lg:p-0'>
              <h2 className='text-3xl font-bold mb-4 text-white lg:text-gray-900'>{title}</h2>
              <p className='text-gray-200 lg:text-gray-600 mb-6'>{description}</p>
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
