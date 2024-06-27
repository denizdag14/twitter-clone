"use client"

import { FaTwitter } from 'react-icons/fa'
import { HiHome, HiArchive, HiUser, HiChatAlt } from 'react-icons/hi'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import SignInOutButton from './SignInOutButton'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { signOut } from 'next-auth/react'
import DarkModeSwitch from './DarkModeSwitch'
import { useState, useEffect } from 'react'
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from '@/firebase'

export default function Sidebar() {

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
  }, [session]);

  if(status === 'loading') return null;
  return (
    <div className='flex flex-col p-3 justify-between h-screen'>
      <div className='flex flex-col gap-4'>
        <Link href='/' className='flex items-center p-2 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 mb-3 w-14 md:w-20 lg:w-fit'>
          <FaTwitter className='w-10 h-10 text-blue-500' />
        </Link>
        <Link href='/' className='flex items-center p-2 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-fit'>
          <HiHome className='w-7 h-7' />
          <span className='font-bold hidden md:inline'>Home</span>
        </Link>
        {
          session ? (
            <>
              <Link href={`/profile/${userInfo?.uid}`} className='flex items-center p-2 hover:dark:bg-zinc-800 hover:bg-gray-100 hover:rounded-full transition-all duration-200 gap-2 w-fit'>
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
                <Image className='rounded-full h-10 w-10 md:mr-2 lg:mr-3' src={userInfo?.image} alt='user-img' width={50} height={50} />
                <div className='hidden md:inline md:mr-2 lg:mr-3'>
                  <h4 className='font-bold'>{userInfo?.name}</h4>
                  <p className='text-gray-500'>@{userInfo?.username}</p>
                </div>
                <SignInOutButton session={session} />
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
                  className="rounded-xl dark:bg-neutral-950 bg-gray-100 text-sm lg:hidden"
                >
                  <div className="flex p-3">
                    <a className="rounded-lg py-2 ml-2 px-2 transition block lg:hidden">
                      <p className="font-semibold dark:text-blue-500 text-blue-500"><DarkModeSwitch /></p>
                    </a>

                    <div className="border-l border-gray-300 dark:border-zinc-800 mr-2 md:hidden"></div>

                    <a onClick={() => confirm('Are you sure you want to sign out?') === true ? signOut() : null} className="rounded-lg py-3 px-3 transition dark:hover:bg-zinc-900 hover:bg-gray-200 block md:hidden cursor-pointer">
                      <p className="font-semibold dark:text-blue-500 text-blue-500">Log out</p>
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