'use client'

import Card from '@/components/ui/Card'
import FeatureCard from '@/components/ui/FeatureCard'
import { motion } from 'framer-motion'
import { FaGamepad, FaScroll, FaServer } from 'react-icons/fa'
import { features, serverInfo, systems } from '../../sources/app'

export default function Docs() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-12'
        >
          <h1 className='text-4xl font-bold mb-4'>Server Info</h1>
          <p className='text-xl text-gray-600'>
            Welcome to the Extalia Server documentation. Here you'll find detailed information about our server
            features, rates, and systems.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className='p-6'>
              <h2 className='text-2xl font-semibold mb-6'>Server Information</h2>
              <div className='space-y-6'>
                <div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <span className='text-gray-600'>Version:</span>
                      <span className='ml-2 font-medium'>{serverInfo.version}</span>
                    </div>
                    {Object.entries(serverInfo.rates).map(([key, value]) => (
                      <div key={key}>
                        <span className='text-gray-600 capitalize'>{key}:</span>
                        <span className='ml-2 font-medium'>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className='text-lg font-medium mb-3'>Features</h3>
                  <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    {serverInfo.features.map((feature, index) => (
                      <li key={index} className='flex items-center space-x-2'>
                        <FaGamepad className='text-blue-600' />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className='p-6'>
              <h2 className='text-2xl font-semibold mb-6'>Getting Started</h2>
              <div className='space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <h3 className='text-lg font-medium mb-3'>Downloads</h3>
                  <ul className='space-y-2'>
                    <li className='flex items-center space-x-2'>
                      <FaServer className='text-blue-600' />
                      <a
                        href='https://www.mediafire.com/file/9huhlj0ehyas458/L2J_Mobius_Classic_Interlude_Geodata.zip'
                        className='text-blue-600 hover:underline'
                      >
                        Geodata
                      </a>
                    </li>
                    <li className='flex items-center space-x-2'>
                      <FaGamepad className='text-blue-600' />
                      <a
                        href='https://drive.google.com/file/d/1UWF88xypYWfe6u_aOCPnUbo1o8_rCDz_'
                        className='text-blue-600 hover:underline'
                      >
                        Client (password: L2jMobius)
                      </a>
                    </li>
                    <li className='flex items-center space-x-2'>
                      <FaScroll className='text-blue-600' />
                      <a
                        href='https://www.mediafire.com/file/1zwjcykzy4kpwmo/L2J_Mobius_Classic_Interlude_System_v15.zip'
                        className='text-blue-600 hover:underline'
                      >
                        System
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className='text-lg font-medium mb-3'>Useful Tools</h3>
                  <ul className='space-y-2'>
                    <li className='flex items-center space-x-2'>
                      <FaScroll className='text-blue-600' />
                      <a
                        href='https://github.com/MobiusDevelopment/l2clientdat'
                        className='text-blue-600 hover:underline'
                      >
                        L2ClientDat
                      </a>
                    </li>
                    <li className='flex items-center space-x-2'>
                      <FaScroll className='text-blue-600' />
                      <a
                        href='https://github.com/MobiusDevelopment/xdat_editor'
                        className='text-blue-600 hover:underline'
                      >
                        XdatEditor
                      </a>
                    </li>
                    <li className='flex items-center space-x-2'>
                      <FaScroll className='text-blue-600' />
                      <a href='https://github.com/MobiusDevelopment/l2tool' className='text-blue-600 hover:underline'>
                        L2Tool
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {systems.map((system, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className='p-6'>
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='text-2xl text-blue-600'>{system.icon}</div>
                  <h2 className='text-2xl font-semibold'>{system.title}</h2>
                </div>
                <ul className='space-y-2'>
                  {system.details.map((detail, index) => (
                    <li key={index} className='flex items-center space-x-2 text-gray-600'>
                      <span className='w-2 h-2 bg-blue-600 rounded-full'></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
