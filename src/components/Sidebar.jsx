import { FaTwitter, FaSignInAlt } from 'react-icons/fa'
import { HiHome } from 'react-icons/hi'
import Link from 'next/link'

export default function Sidebar() {
  return (
    <div className='flex flex-col gap-4 p-3'>
      <Link href='/' className='flex items-center p-3 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-fit'>
          <FaTwitter className='w-10 h-10 text-blue-500' />
      </Link>
      <Link href='/' className='flex items-center p-3 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-fit'>
          <HiHome className='w-7 h-7' />
          <span className='font-bold hidden xl:inline'>Home</span>
      </Link>
      <button className='bg-blue-400 text-white rounded-full hover:bg-blue-600 transition-all duration-200 w-48 h-9 shadow-md hidden xl:inline'>
        Sign In
      </button>
    </div>
  )
}