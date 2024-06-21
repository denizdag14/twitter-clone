import React from 'react'
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { signIn, signOut } from 'next-auth/react'

export default function SignInOutButton({session}) {
  return (
    <div>
        {session ? (
          <button className='bg-blue-400 text-white rounded-full hover:bg-blue-600 transition-all duration-200 w-11 h-9 shadow-md items-center justify-center space-x-2 ml-2 md:ml-0 hidden md:flex' onClick={() => confirm('Are you sure you want to sign out?') === true ? signOut() : null}>
            <FaSignOutAlt className='w-5 h-5' />
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
