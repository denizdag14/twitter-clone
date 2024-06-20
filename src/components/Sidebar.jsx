"use client"

import { FaTwitter, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { HiHome } from 'react-icons/hi'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Sidebar() {
  const { data: session} = useSession();
  return (
    <div className='flex flex-col gap-4 p-3'>
      <Link href='/' className='flex items-center p-3 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-fit'>
        <FaTwitter className='w-10 h-10 text-blue-500' />
      </Link>
      <Link href='/' className='flex items-center p-3 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-fit'>
        <HiHome className='w-7 h-7' />
        <span className='font-bold hidden md:inline'>Home</span>
      </Link>
      {session ? (
        <button className='bg-blue-400 text-white rounded-full hover:bg-blue-600 transition-all duration-200 w-14 md:w-28 lg:w-32 xl:w-36 2xl:w-40 h-9 shadow-md flex items-center justify-center space-x-2' onClick={() => signOut()}>
        <FaSignOutAlt className='w-5 h-5' />
        <span className='hidden md:inline'>Sign Out</span>
        </button>
      ) : (
        <button className='bg-blue-400 text-white rounded-full hover:bg-blue-600 transition-all duration-200 w-14 md:w-28 lg:w-32 xl:w-36 2xl:w-40 h-9 shadow-md flex items-center justify-center space-x-2' onClick={() => signIn()}>
        <FaSignInAlt className='w-5 h-5' />
        <span className='hidden md:inline'>Sign In</span>
      </button>
      )}
    </div>
  )
}