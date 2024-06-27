"use client"

import { FaTwitter } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { modalState } from '@/atom/modalAtom'
import { useRecoilState } from 'recoil'

export default function TopNavbar({title, isOpen = false}) {
    const [open] = useRecoilState(modalState);
    const router = useRouter();
  return (
        <div className={`py-2 px-3 flex justify-between items-center sticky top-0 dark:bg-zinc-900/70 bg-white/70 border-b dark:border-zinc-800 border-gray-200 backdrop-filter backdrop-blur-sm ${open || isOpen ? 'z-0' : 'z-10'}`}>
        <div className="flex items-center">
          <button onClick={() => router.back()} className="hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full p-2" >
            <HiArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="sm:text-lg ml-2">{title}</h2>
        </div>
        <div className='items-center p-2 gap-2 w-12 h-12 flex sm:hidden'>
            <FaTwitter className='w-10 h-10 text-blue-500' />
        </div>
      </div>
  )
}
