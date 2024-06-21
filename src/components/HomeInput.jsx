"use client"

import { useSession } from "next-auth/react"
import Image from "next/image";
import { Textarea } from '@headlessui/react'
import { HiOutlinePhotograph } from "react-icons/hi";

export default function HomeInput() {
    const { data:session } = useSession();

    if(!session) return null;
  return (
    <div className='flex border-b border-gray-200 dark:border-zinc-800 p-3 space-x-3 w-full'>
        <Image src={session.user.image} alt={'/no_image_available.jpg'} width={70} height={70} className='h-11 w-11 rounded-full cursor-pointer hover:brightness-95'/>
        <div className='w-full divide-y divide-gray-200 dark:divide-zinc-800'>
          <Textarea className='w-full dark:bg-zinc-900 border-none outline-none tracking-wide min-h-12' placeholder='Whats happening' rows='2'></Textarea>
          <div className='flex items-center justify-between pt-2.5'>
            <HiOutlinePhotograph className='h-10 w-10 p-2 text-sky-500 dark:hover:bg-sky-950 hover:bg-sky-100 rounded-full cursor-pointer' />
            <button  className='bg-blue-400 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:brightness-100 disabled:opacity-50'>Post</button>
          </div>
        </div>
    </div>
  )
}
