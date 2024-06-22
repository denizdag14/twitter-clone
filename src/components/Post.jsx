import Image from "next/image"
import { HiDotsHorizontal, HiOutlineTrash } from "react-icons/hi"
import Link from "next/link"
import Icons from "./Icons"
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'

export default function Post({ post, id }) {
  return (
    <div className="flex p-3 border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">
        <Image className="h-11 w-11 rounded-full mr-4" src={post?.profileImg} alt="user-img" width={50} height={50} />
        <div className="flex-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 whitespace-nowrap">
                    <h4 className="font-bold text-sx truncate">{post?.name}</h4>
                    <span className="text-xs truncate text-gray-500">@{post?.username}</span>
                </div>
                {/* <HiDotsHorizontal className="text-sm" /> */}
                <Popover>
                    <PopoverButton className='focus:outline-none'>
                        <HiDotsHorizontal className="text-sm" />
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
                        className="rounded-xl dark:bg-neutral-950 bg-gray-100 text-sm"
                        >
                        <div className="flex p-2">
                            <a className="rounded-lg transition cursor-pointer">
                                <p className="py-3 px-3 text-gray-500 hover:text-red-500 hover:dark:bg-red-950 hover:bg-red-100 rounded-lg flex items-center space-x-2">
                                    <HiOutlineTrash  />
                                    <span>Delete</span>
                                </p>
                            </a>
                        </div>
                        </PopoverPanel>
                    </Transition>
                </Popover>
            </div>
            <Link href={`/posts/${id}`}>
                <p className="text-sm my-3">{post?.text}</p>
            </Link>
            {post?.file !== null ? (
                <>
                    {post?.fileType === 'image' ? (
                        <Image src={post?.file} alt="post-img" className='rounded-xl mr-2 w-auto h-auto' width={50} height={50} />
                    ) : (
                        <video controls src={post?.file} alt="post-img" className='rounded-xl mr-2 w-auto h-auto' width={50} height={50} />
                    )}
                </>
            ) : (null)}
            <Icons trashIcon={false} />
        </div>
    </div>
  )
}
