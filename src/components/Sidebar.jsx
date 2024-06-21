"use client"

import { FaTwitter } from 'react-icons/fa'
import { HiHome, HiDotsHorizontal } from 'react-icons/hi'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import SignInOutButton from './SignInOutButton'

export default function Sidebar() {
  const { data: session, status} = useSession();
  return (
    <div className='flex flex-col p-3 justify-between h-screen'>
      <div className='flex flex-col gap-4'>
        <Link href='/' className='flex items-center p-3 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-fit mb-3'>
          <FaTwitter className='w-10 h-10 text-blue-500' />
        </Link>
        <Link href='/' className='flex items-center p-3 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-fit mb-3'>
          <HiHome className='w-7 h-7' />
          <span className='font-bold hidden md:inline'>Home</span>
        </Link>
        {status === 'loading' ? (null) : session ? null : (<SignInOutButton session={session} />)}
      </div>
      {
        session && (
          <div className='text-sm flex items-center cursor-pointer p-3 border dark:border-zinc-800 rounded-full justify-between hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200'>
            <Image className='rounded-full h-10 w-10 md:mr-2 lg:mr-3' src={session.user.image} alt='user-img' width={50} height={50} />
            <div className='hidden md:inline md:mr-2 lg:mr-3'>
              <h4 className='font-bold'>{session.user.name}</h4>
              <p className='text-gray-500'>@{session.user.username}</p>
            </div>
            <SignInOutButton session={session} />
            <HiDotsHorizontal className='h-5 ml-2 hidden md:inline'/>
          </div>
        )
      }
    </div>
  )
}