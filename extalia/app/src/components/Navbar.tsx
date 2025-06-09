import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className='bg-gray-800 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <Link href='/' className='text-xl font-bold'>
              Extalia Server
            </Link>
          </div>
          <div className='flex space-x-4'>
            <Link href='/' className='px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700'>
              Home
            </Link>
            <Link href='/getting-started' className='px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700'>
              Getting Started
            </Link>
            <Link href='/rules' className='px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700'>
              Rules
            </Link>
            <Link href='/info' className='px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700'>
              Server Info
            </Link>
            <Link href='/search' className='px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700'>
              Fuzzy Search
            </Link>
            <Link href='/news' className='px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700'>
              News
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
