import Image from "next/image"
import { HiDotsHorizontal } from "react-icons/hi"
import Link from "next/link"
import Icons from "./Icons"
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'

export default function ForPostPage({ post, id }) {
  return (
    <div className="flex p-3 border-b border-gray-200 dark:border-zinc-700">
        <Link className="h-11 w-11 rounded-full mr-2" href={`/profile/${post?.uid}?username=${post?.username}`}>
            <Image className="rounded-full" src={post?.profileImg} alt="user-img" width={50} height={50} />
        </Link>
        <div className="flex-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 whitespace-nowrap">
                    <Link href={`/profile/${post?.uid}?username=${post?.username}`} className="font-bold text-sm truncate hover:underline">{post?.name}</Link>
                    <Link href={`/profile/${post?.uid}?username=${post?.username}`} className="truncate hover:underline text-xs text-gray-500">@{post?.username}</Link>
                </div>
                <Popover>
                    <PopoverButton className='focus:outline-none w-6 h-6 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full flex items-center justify-center'>
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
                        anchor="top"
                        className="rounded-xl dark:bg-neutral-950 bg-gray-100 text-sm"
                        >
                        <div className="flex p-2">
                            <a className="rounded-lg transition cursor-pointer">
                                <Icons isTrash={true} id={id} uid={post.uid} />
                            </a>
                        </div>
                        </PopoverPanel>
                    </Transition>
                </Popover>
            </div>
            <p className="text-sm my-3">{post?.text}</p>
            {post?.file !== null ? (
                <>
                    {post?.fileType === 'image' ? (
                        <Image src={post?.file} alt="post-img" className='rounded-xl mr-2 w-auto h-auto' width={50} height={50} />
                    ) : (
                        <video controls src={post?.file} alt="post-img" className='rounded-xl mr-2 w-auto h-auto' width={50} height={50} />
                    )}
                </>
            ) : (null)}
            <Icons isTrash={false} id={id} uid={post.uid}/>
        </div>
    </div>
  )
}