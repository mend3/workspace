import { motion } from 'framer-motion'
import Link from 'next/link'

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  backgroundImage: string
}

export default function HeroSection({ title, subtitle, ctaText, ctaLink, backgroundImage }: HeroSectionProps) {
  return (
    <div
      className='relative h-[600px] flex items-center justify-center'
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='absolute inset-0 bg-gradient-to-b from-black/50 to-black/20' />

      <div className='relative z-10 text-center text-white px-4'>
        <motion.h1
          className='text-5xl md:text-6xl font-bold mb-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className='text-xl md:text-2xl mb-8 max-w-3xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href={ctaLink}
            className='inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors'
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
