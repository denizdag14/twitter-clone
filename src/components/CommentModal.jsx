"use client"

import { useRecoilState } from 'recoil'
import { modalState, postIdState } from '@/atom/modalAtom'
import Modal from 'react-modal'
import { HiX } from 'react-icons/hi'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { doc, getFirestore, onSnapshot } from 'firebase/firestore'
import { app } from '@/firebase'
import Image from 'next/image'
import Link from 'next/link'
import { Textarea } from '@headlessui/react'

export default function CommentModal() {
    const {data: session} = useSession();
    const db = getFirestore(app);
    const [open, setOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const [post, setPost] = useState({});
    const [input, setInput] = useState('');

    useEffect(() => {
      if(postId !== ''){
        const postRef = doc(db, 'posts', postId);
        const unsubscribe = onSnapshot(
          postRef,
          (snapshot) => {
            if(snapshot.exists()){
              setPost(snapshot.data());
            } else {
              console.log('No such document!');
            }
          }
        )
        return () => unsubscribe();
      }
    }, [postId]);

    const sendComment = async () => {
      
    }

  return (
    <div>
        {
          open && (
            <Modal
              isOpen={open}
              onRequestClose={() => setOpen(false)}
              ariaHideApp={false}
              className='max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl outline-none'
            >
              <div className='p-4'>
                <div className='border-b dark:border-zinc-800 border-gray-200 py-2 px-1.5 flex justify-end'>
                  <HiX className='text-2xl text-gray-700 p-1 dark:hover:bg-zinc-800 hover:bg-gray-200 rounded-full cursor-pointer' onClick={() => setOpen(false)}/>
                </div>
                <div className='p-2 flex items-center space-x-1 relative'>
                  <span className='w-0.5 h-full z-[-1] absolute left-8 top-11 dark:bg-zinc-800 bg-gray-200' />
                  <Link href={`/profile/${post?.uid}`}><Image className='rounded-full h-11 w-11 mr-4' src={post?.profileImg} alt='user-img' width={50} height={50} /></Link>
                  <h4 className='font-bold text-[15px] sm:text-[16px] hover:underline truncate'>{post?.name}</h4>
                  <span className='text-sm sm:text-[15px] truncate text-gray-500 hover:underline'>@{post?.username}</span>
                </div>
                <p className='text-[15px] sm:text-[16px] ml-16 mb-2'>{post?.text}</p>
                <p className='ml-16 mb-2'>
                  {
                    post?.fileType === 'image' ? (
                      <Image className='rounded-xl w-auto h-auto' src={post?.file} alt='image-url' width={100} height={100} />
                    ) : (
                      post?.fileType === 'video' ? (
                        <video className='rounded-xl w-auto h-auto'  src={post?.file} controls width={50} height={50}></video>
                      ) : (
                        null
                      )
                    )
                  }
                </p>
                <div className='flex p-3 space-x-3'>
                  <Image src={session.user.image} alt='user-img' className='h-11 w-11 rounded-full cursor-pointer hover:brightness-95' width={50} height={50} />
                  <div className='w-full divide-y dark:divide-zinc-800 divide-gray-200'>
                    <div className='w-full'>
                      <Textarea className='w-full border-none outline-none tracking-wide min-h-12 dark:bg-zinc-900 placeholder:text-gray-500' placeholder='Whats happening' rows='2' value={input} onChange={(e) => setInput(e.target.value)}>
                      </Textarea>
                    </div>
                    <div className='flex items-center justify-end pt-2.5'>
                      <button className='bg-blue-400 disabled:hover:bg-blue-400 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:brightness-100 disabled:opacity-50' disabled={input.trim() === ''} onClick={sendComment}>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          )
        }
    </div>
  )
}
