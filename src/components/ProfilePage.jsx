"use client"

import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, getDocs } from 'firebase/firestore';
import { app } from '@/firebase';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HiArrowLeft, HiOutlineCalendar } from 'react-icons/hi';
import { FaTwitter } from 'react-icons/fa';
import Post from './Post';

const db = getFirestore(app);

export default function ProfilePage({posts}) {
  const [userData, setUserData] = useState(null);
  const pathname = usePathname();
  const uid = pathname.split('/')[pathname.split('/').length - 1]

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.log('Kullanıcı bulunamadı.');
        }
      } catch (error) {
        console.error('Firestore\'dan veri getirme hatası:', error);
      }
    }

    if (uid) {
      fetchUserData();
    }
  }, [uid]);

  return (
    <div>
      {userData ? (
        <div className="max-w-xl mx-auto border-r border-l dark:border-zinc-800 min-h-screen">
        <div className='py-2 px-3 flex justify-between items-center sticky top-0 dark:bg-zinc-900/70 bg-white/70 border-b dark:border-zinc-800 border-gray-200 backdrop-filter backdrop-blur-sm'>
          <div className="flex items-center">
            <Link href={'/'} className="hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full p-2" >
              <HiArrowLeft className="h-5 w-5" />
            </Link>
            <h2 className="sm:text-lg">Back</h2>
          </div>
          <div className='items-center p-2 gap-2 w-12 h-12 flex sm:hidden'>
            <FaTwitter className='w-10 h-10 text-blue-500' />
          </div>
        </div>
        <div className='flex flex-col border-b border-gray-200 dark:border-zinc-800 space-y-3 w-full'>
          <div className="flex w-full items-end">
            <div className="relative w-full">
              <Image 
                src={userData.headerImage}
                priority={true}
                alt="Header Image" 
                width={600} 
                height={200} 
                className="object-cover w-full h-40" 
              />
              <div className='absolute -mb-3 flex items-center -bottom-8 left-4'>
                <Image 
                  src={userData.image} 
                  alt="Profile Image" 
                  width={50} 
                  height={50} 
                  className='rounded-full border-2 h-auto w-auto dark:border-zinc-900 border-white' 
                />
              </div>
            </div>
          </div>
        </div>
        <div className='flex p-2 justify-end items-start'>
          <button className='rounded-full border dark:border-zinc-700 dark:hover:bg-zinc-800'>
            <span className='p-4 text-sm'>Edit Profile</span>
          </button>
        </div>
        <div className='flex items-center justify-between gap-2 px-4 pt-5 mb-2'>
          <div className="flex items-center">
            <span className="font-bold text-sm mr-1 truncate">{userData.name}</span>
            <span className="truncate text-xs text-gray-500">@{userData.username}</span>
          </div>
          <div className='flex'>
            <span className='flex items-center text-xs text-gray-500'><HiOutlineCalendar className='mr-1' /> joined {formatDate(userData.created_time.toDate())}</span>
          </div>
        </div>
        <div className='border-t dark:border-zinc-800'>
          <div className='flex justify-between border-b dark:border-zinc-800 bg-white dark:bg-zinc-900 h-10'>
            <div className='flex-1 text-center w-full h-full'>
              <button className='w-full h-full hover:dark:bg-zinc-800 hover:bg-gray-200'>Posts</button>
            </div>
            <div className='flex-1 text-center'>
              <button className='w-full h-full hover:dark:bg-zinc-800 hover:bg-gray-200'>Likes</button>
            </div>
          </div>
          {posts.map((post) => (
              post.uid === uid && (
                <Post key={post.id} post={post} id={post.id} />
              )
          ))}
        </div>
      </div>
      ) : (
        <p>Kullanıcı bilgileri yükleniyor...</p>
      )}
    </div>
  );
}