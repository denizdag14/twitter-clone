"use client"

import { FaTwitter } from 'react-icons/fa'
import { HiHome, HiDotsHorizontal } from 'react-icons/hi'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import SignInOutButton from './SignInOutButton'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { signOut } from 'next-auth/react'
import DarkModeSwitch from './DarkModeSwitch'

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
            <Popover className='hover:dark:bg-zinc-700 hover:bg-gray-200 rounded-full ml-2 lg:hidden'>
              <PopoverButton>
                <HiDotsHorizontal />
              </PopoverButton>
              <Transition
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel
                  anchor="bottom"
                  className="rounded-xl dark:bg-neutral-950 bg-gray-100 text-sm"
                >
                  <div className="flex p-3">
                    <a className="rounded-lg py-2 px-2 transition block lg:hidden">
                      <p className="font-semibold dark:text-blue-500 text-blue-500"><DarkModeSwitch /></p>
                    </a>

                    <div className="border-l border-gray-400 mr-2 md:hidden"></div>

                    <a onClick={() => confirm('Are you sure you want to sign out?') === true ? signOut() : null} className="rounded-lg py-3 px-3 transition dark:hover:bg-zinc-900 hover:bg-gray-200 block md:hidden cursor-pointer">
                      <p className="font-semibold dark:text-blue-500 text-blue-500">Log out</p>
                    </a>
                  </div>
                </PopoverPanel>
              </Transition>
            </Popover>
          </div>
        )
      }
    </div>
  )
}