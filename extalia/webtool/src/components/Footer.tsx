import Link from 'next/link'
import { communityLinks } from '@/sources/app'

export default function Footer() {
  return (
    <footer className='bg-gray-800 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Navigation Links */}
          <div>
            <Link href='/' className='text-lg font-semibold'>
              Extalia Server
            </Link>
            <div className='flex flex-col space-y-2 mt-4'>
              <Link href='/getting-started' className='text-sm hover:text-gray-300'>
                Getting Started
              </Link>
              <Link href='/generate' className='text-sm hover:text-gray-300'>
                Item Set Generator
              </Link>
              <Link href='/stats' className='text-sm hover:text-gray-300'>
                Server Stats
              </Link>
              <Link href='/info' className='text-sm hover:text-gray-300'>
                Server Info
              </Link>
            </div>
          </div>

          {/* Community Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Community</h3>
            <div className='flex flex-col space-y-2'>
              {communityLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm hover:text-gray-300 flex items-center space-x-2'
                >
                  <span className='text-blue-400'>{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>About</h3>
            <p className='text-sm text-gray-400'>© {new Date().getFullYear()} Extalia Server. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
