"use client"

import { FaSignOutAlt } from 'react-icons/fa'
import { HiArchive, HiHome, HiUser } from 'react-icons/hi'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import SignInOutButton from './SignInOutButton'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { signOut, signIn } from 'next-auth/react'
import DarkModeSwitch from './DarkModeSwitch'
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from '@/firebase'
import { useState, useEffect } from 'react'

export default function BottomNavbar() {

    const db = getFirestore(app);
    const { data: session, status} = useSession();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
      const fetchUserInfo = async () => {
        if (session?.user?.uid) {
          const userDoc = await getDoc(doc(db, "users", session?.user?.uid));
          if (userDoc.exists()) {
            setUserInfo(userDoc.data());
          }
        }
      };
  
      fetchUserInfo();
    }, [session?.user?.uid]);

    if(status === 'loading') return null;
  return (
    <div className='flex items-center justify-between h-12'>
      <div className='flex items-center justify-between space-x-10'>
        <Link href='/' className='flex items-center p-3 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-12 h-12'>
          <HiHome className='w-7 h-7' />
        </Link>
        {
          session ? (
            <>
              <Link href={`/profile/${session.user.uid}`} className='flex items-center p-2 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-fit'>
                <HiUser className='w-7 h-7' />
                <span className='font-bold hidden md:inline'>Profile</span>
              </Link>
              <Link href='/savedposts' className='flex items-center p-2 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-fit'>
                <HiArchive className='w-7 h-7' />
                <span className='font-bold hidden md:inline'>Saved Posts</span>
              </Link>
            </>
          ) : (
            <>
              <Link href='' onClick={signIn} className='flex items-center p-2 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-fit'>
                <HiUser className='w-7 h-7' />
                <span className='font-bold hidden md:inline'>Profile</span>
              </Link>
              <Link href='' onClick={signIn} className='flex items-center p-2 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-fit'>
                <HiArchive className='w-7 h-7' />
                <span className='font-bold hidden md:inline'>Saved Posts</span>
              </Link>
            </>
          )
        }
        {status === 'loading' ? (null) : session ? (null) : (<SignInOutButton session={session} />)}
      </div>
      {
        session && (

          <Popover>
              <PopoverButton className='focus:outline-none'>
              <div className='text-sm flex items-center cursor-pointer p-2 border dark:border-zinc-800 rounded-full justify-between hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200'>
                <Image className='rounded-full h-10 w-10' src={userInfo?.image} alt='user-img' width={50} height={50} />
              </div>
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
                  anchor="top"
                  className="rounded-xl dark:bg-neutral-950 bg-gray-100"
                >
                  <div className="flex p-1">
                    <a className="rounded-lg py-3 ml-2 px-2 transition block">
                      <p className="font-semibold dark:text-blue-500 text-blue-500"><DarkModeSwitch isMobile={true} /></p>
                    </a>

                    <div className="border-l border-gray-300 dark:border-zinc-800 mr-2"></div>

                    <a onClick={() => confirm('Are you sure you want to sign out?') === true ? signOut() : null} className="rounded-lg py-3 mr-1 px-3 transition dark:hover:bg-zinc-900 hover:bg-gray-200  cursor-pointer flex items-center">
                      <p className="font-semibold dark:text-blue-500 text-blue-500"><FaSignOutAlt /></p>
                    </a>
                  </div>
                </PopoverPanel>
              </Transition>
            </Popover>
        )
      }
    </div>
  )
}
