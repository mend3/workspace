'use client'

import AlternatingContent from '@/components/ui/AlternatingContent'
import FeatureCard from '@/components/ui/FeatureCard'
import HeroSection from '@/components/ui/HeroSection'
import StatsBanner from '@/components/ui/StatsBanner'
import { features, serverStatus } from '@/sources/app'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

export default function Home() {
  const getFeatures = React.useCallback((count = 6) => {
    const arr = [...features]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, count)
  }, [])

  return (
    <main>
      <HeroSection
        title='Welcome to Extalia Server'
        subtitle='Experience the most advanced and secure Lineage 2 Interlude server with custom features, enhanced PvP, and a thriving community.'
        ctaText='Start Playing Now'
        ctaLink='/getting-started'
        backgroundImage='/images/hero-bg.jpg'
      />

      <StatsBanner stats={serverStatus} />

      <div className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className='text-center mb-12'
          >
            <h2 className='text-4xl font-bold mb-4'>Server Features</h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Discover what makes Extalia Server unique with our comprehensive feature set
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {getFeatures().map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AlternatingContent
        title='Enhanced PvP Experience'
        description='Our server features an advanced PvP system with color indicators, dedicated chat channels, and improved clan war mechanics. The Rank PvP System allows players to track their progress and compete for top positions.'
        image='/images/pvp.jpg'
      >
        <Link
          href='/info#pvp'
          className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
        >
          Learn More About PvP
        </Link>
      </AlternatingContent>

      <AlternatingContent
        title='VIP System'
        description='Enjoy exclusive benefits with our four-tier VIP system. Get increased offline shop duration, additional buff slots, expanded inventory space, and more. Choose the level that suits your playstyle.'
        image='/images/vip.jpg'
        reverse
      >
        <Link
          href='/info#vip'
          className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
        >
          View VIP Benefits
        </Link>
      </AlternatingContent>

      <AlternatingContent
        title='Custom Content'
        description='Explore new raid bosses, zones, and item sets. Our server regularly receives updates with fresh content to keep the game exciting and engaging for all players.'
        image='/images/content.jpg'
      >
        <Link
          href='/info#content'
          className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
        >
          Explore Content
        </Link>
      </AlternatingContent>

      <div className='bg-gray-900 text-white py-16'>
        <div className='container mx-auto px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className='text-4xl font-bold mb-6'>Ready to Start Your Adventure?</h2>
            <p className='text-xl text-gray-300 mb-8 max-w-3xl mx-auto'>
              Join thousands of players in the most advanced Lineage 2 Interlude server
            </p>
            <Link
              href='/info'
              className='inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors'
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
