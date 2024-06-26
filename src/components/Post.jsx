"use client"

import Image from "next/image";
import { HiDotsHorizontal } from "react-icons/hi";
import Link from "next/link";
import Icons from "./Icons";
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { useSession } from "next-auth/react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase";
import { useState, useEffect } from "react";

export default function Post({ post, id }) {
  const db = getFirestore(app);
  const [userInfo, setUserInfo] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (post?.uid) {
        const userDoc = await getDoc(doc(db, "users", post.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        }
      }
    };

    fetchUserInfo();
  }, [post?.uid]);

  const handlePostClick = (e) => {
    if (
      !e.target.closest('a') && 
      !e.target.closest('button') && 
      !e.target.closest('svg')
    ) {
      window.location.href = `/posts/${id}`;
    }
  };

  if(status === 'loading') return null;
  console.log(userInfo);
  return (
    <div onClick={handlePostClick} className="flex p-3 border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer">
      <Link className="h-11 w-11 rounded-full mr-2" href={`/profile/${userInfo?.uid}`} onClick={(e) => e.stopPropagation()}>
        <Image className="rounded-full object-cover w-11 h-11" src={userInfo?.image} alt="user-img" width={50} height={50} />
      </Link>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <Link href={`/profile/${userInfo?.uid}`} className="font-bold text-sm truncate hover:underline" onClick={(e) => e.stopPropagation()}>{userInfo?.name}</Link>
            <Link href={`/profile/${userInfo?.uid}`} className="truncate hover:underline text-xs text-gray-500" onClick={(e) => e.stopPropagation()}>@{userInfo?.username}</Link>
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
                  <Icons isTrash={true} id={id} uid={userInfo?.uid} />
                </div>
              </PopoverPanel>
            </Transition>
          </Popover>
        </div>
        <p className="text-sm my-3">{post?.text}</p>
        {post?.file !== null ? (
          <>
            {post?.fileType === 'image' ? (
              <Image src={post?.file} alt="post-img" className='rounded-xl mr-2 w-auto h-auto' width={50} height={50} onClick={(e) => e.stopPropagation()} />
            ) : (
              <video controls src={post?.file} alt="post-img" className='rounded-xl mr-2 w-auto h-auto' width={50} height={50} onClick={(e) => e.stopPropagation()} />
            )}
          </>
        ) : (null)}
        <Icons isTrash={false} id={id} />
      </div>
    </div>
  );
}
