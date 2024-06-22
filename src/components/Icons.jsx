"use client"

import { HiOutlineChat, HiOutlineHeart } from "react-icons/hi"

export default function Icons() {
  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
        <HiOutlineChat className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-950"/>
        <HiOutlineHeart className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-950"/>
    </div>     
  )
}
