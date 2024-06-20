import React from 'react'
import { Input } from '@headlessui/react'

export default function SearchBox() {
  return (
    <Input
        className={
        'block w-full rounded-3xl border-none dark:bg-zinc-800 bg-gray-100 py-1.5 px-3 text-sm/6 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
        }
        placeholder='Search'
    />
  )
}
