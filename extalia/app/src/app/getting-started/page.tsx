'use client'

import { motion } from 'framer-motion'
import { gettingStarted, faq, highlights } from '@/sources/app'
import { FaCheckCircle, FaQuestionCircle, FaStar } from 'react-icons/fa'

export default function GettingStarted() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-4xl mx-auto'
      >
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4'>Getting Started</h1>
          <p className='text-xl text-gray-600'>
            Welcome to Extalia Server! Follow these steps to begin your adventure.
          </p>
        </div>

        {/* Getting Started Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mb-16'
        >
          <h2 className='text-2xl font-semibold mb-6 flex items-center'>
            <FaCheckCircle className='text-blue-600 mr-2' />
            Getting Started Steps
          </h2>
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <ol className='space-y-4'>
              {gettingStarted.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className='flex items-start space-x-3'
                >
                  <span className='flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold'>
                    {index + 1}
                  </span>
                  <span className='text-gray-700'>{step}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='mb-16'
        >
          <h2 className='text-2xl font-semibold mb-6 flex items-center'>
            <FaStar className='text-yellow-500 mr-2' />
            Server Highlights
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className='bg-white rounded-lg shadow-lg p-4 flex items-start space-x-3'
              >
                <FaStar className='text-yellow-500 mt-1 flex-shrink-0' />
                <span className='text-gray-700'>{highlight}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className='text-2xl font-semibold mb-6 flex items-center'>
            <FaQuestionCircle className='text-blue-600 mr-2' />
            Frequently Asked Questions
          </h2>
          <div className='space-y-4'>
            {faq.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className='bg-white rounded-lg shadow-lg p-6'
              >
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>{item.question}</h3>
                <p className='text-gray-600'>{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
