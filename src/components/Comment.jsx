"use client"

import Image from "next/image"
import Link from "next/link"
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { HiDotsHorizontal, HiHeart, HiOutlineHeart, HiOutlineTrash } from "react-icons/hi"
import { useSession, signIn } from "next-auth/react"
import { app } from "@/firebase"
import { deleteDoc, doc, getFirestore, onSnapshot, collection, setDoc, serverTimestamp } from "firebase/firestore"
import { useState, useEffect } from "react"

export default function Comment({comment, commentId, postId, postOwnerId}) {

    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const db = getFirestore(app);
    const { data: session } = useSession();

    const likePost = async () => {

        if(session){
            if(isLiked){
                await deleteDoc(doc(db, 'posts', postId, 'comments', commentId, 'likes', session.user.uid));
            } else{
                await setDoc(doc(db, 'posts', postId, 'comments', commentId, 'likes', session.user.uid), {
                    username: session.user.username,
                    timestamp: serverTimestamp(),
                })
            }
        } else {
            signIn();
        }
    };

    useEffect(() => {
        onSnapshot(collection(db, 'posts', postId, 'comments', commentId, 'likes'), (snapshot) => {
            setLikes(snapshot.docs);
        })
    }, [db]);

    useEffect(() => {
        setIsLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1);
    }, [likes]);

    const deleteComment = async () => {
        if(window.confirm('Are you sure you want to delete this comment?')) {
            if(session?.user?.uid === comment.uid || session?.user?.uid === postOwnerId) {
                deleteDoc(doc(db, 'posts', postId, 'comments', commentId)).then(() => {
                    console.log('Document successfully deleted!');
                    window.location.reload();
                }).catch((error) => {
                    console.error('Error removing post: ', error);
                });
            } else {
                alert('You are not authorized to delete this post');
            }
        }
    };

  return (
    <div className="flex p-3 border-b border-gray-200 dark:border-zinc-700 pl-10">
        <Link className="h-9 w-9 rounded-full mr-2" href={`/profile/${comment?.uid}?username=${comment?.username}`}>
            <Image className="rounded-full" src={comment?.profileImg} alt="user-img" width={50} height={50} />
        </Link>
        <div className="flex-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 whitespace-nowrap">
                    <Link href={`/profile/${comment?.uid}?username=${comment?.username}`} className="font-bold text-sm truncate hover:underline">{comment?.name}</Link>
                    <Link href={`/profile/${comment?.uid}?username=${comment?.username}`} className="truncate hover:underline text-xs text-gray-500">@{comment?.username}</Link>
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
                            {
                                session?.user?.uid === comment.uid || session?.user?.uid === postOwnerId ? (
                                    <div className="flex p-2">
                                        <a className="rounded-lg transition cursor-pointer">
                                            <div onClick={deleteComment} className="flex items-center space-x-1">
                                                <p className="py-3 px-3 text-gray-500 hover:text-red-500 hover:dark:bg-red-950 hover:bg-red-100 rounded-lg flex items-center space-x-2">
                                                    <HiOutlineTrash />
                                                    <span className="text-sm hidden lg:inline">Delete the comment</span>
                                                </p>
                                            </div>
                                        </a>
                                    </div>
                                ) : (
                                    null
                                )
                            }
                        </PopoverPanel>
                    </Transition>
                </Popover>
            </div>
            <p className="text-xs my-3">{comment?.comment}</p>
            {comment?.file !== null ? (
                <>
                    {comment?.fileType === 'image' ? (
                        <Image src={comment?.file} alt="post-img" className='rounded-xl mr-2 w-auto h-auto' width={50} height={50} />
                    ) : (
                        <video controls src={comment?.file} alt="post-img" className='rounded-xl mr-2 w-auto h-auto' width={50} height={50} />
                    )}
                </>
            ) : (null)}
            <div className="flex items-center mt-2 text-gray-500">
                {
                    isLiked ? (
                        <HiHeart onClick={likePost} className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-950"/>
                    ) : (
                        <HiOutlineHeart onClick={likePost} className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-950"/>
                    )}
                    {likes.length > 0 && <span className={`text-xs ${isLiked && 'text-red-600'}`}>{likes.length}</span>
                }
            </div>
        </div>
    </div>
  )
}
