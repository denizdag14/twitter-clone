import Link from 'next/link'
import React from 'react'
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { HiHome } from 'react-icons/hi'

export default function AboutMe() {
  return (
    <div className='flex gap-4 items-center justify-center p-4 mt-4 shadow-md dark:bg-zinc-800 bg-gray-100 rounded-xl'>
        <Link target='_blank' href="https://github.com/denizdag14" className='flex items-center text-blue-500'>
            <FaGithub />
            <span className='text-xs ml-1'>denizdag14</span>
        </Link>
        <Link target='_blank' href="https://www.linkedin.com/in/denizdag14/" className='flex items-center text-blue-500'>
            <FaLinkedin />
            <span className='text-xs ml-1'>denizdag14</span>
        </Link>
        <Link target='_blank' href="https://www.instagram.com/denizdag" className='flex items-center text-blue-500'>
            <FaInstagram />
            <span className='text-xs ml-1'>denizdag</span>
        </Link>
    </div>
  )
}
