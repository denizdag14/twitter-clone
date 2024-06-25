"use client"

import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { modalState } from '@/atom/modalAtom'
import { useRecoilState } from 'recoil'
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
  const [pagePostOrLike, setPagePostOrLike] = useState('post'); 
  const [likes, setLikes] = useState([]);
  const [open] = useRecoilState(modalState);
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
  }, [db, uid]);

  useEffect(() => {
    onSnapshot(query(collection(db, 'users', uid, 'likes'), orderBy('timestamp', 'desc')), (snapshot) => {
        setLikes(snapshot.docs);
    });
  }, [db, uid])

  const likedPostIds = likes.map(like => like.id);
  const likedPosts = posts.filter(post => likedPostIds.includes(post.id));
  
  return (
    <div>
      {userData ? (
      <div className="max-w-xl mx-auto border-r border-l dark:border-zinc-800 min-h-screen">
        <div className={`py-2 px-3 flex justify-between items-center sticky top-0 dark:bg-zinc-900/70 bg-white/70 border-b dark:border-zinc-800 border-gray-200 backdrop-filter backdrop-blur-sm ${open ? 'z-0' : 'z-10'}`}>
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
                className="object-cover w-full h-40 sm:h-60"
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
              <button onClick={() => setPagePostOrLike('post')} className='w-full h-full hover:dark:bg-zinc-800 hover:text-blue-400 hover:bg-gray-200'>
                Posts
                <span className='text-sm ml-2'>{posts.length}</span>
              </button>
            </div>
            <div className='flex-1 text-center'>
              <button onClick={() => setPagePostOrLike('like')}  className='w-full h-full hover:dark:bg-zinc-800 hover:text-blue-400 hover:bg-gray-200'>
                Likes 
                <span className='text-sm ml-2'>{likes.length}</span>
              </button>
            </div>
          </div>
          {
            pagePostOrLike === 'post' ? (
              posts.map((post) => (
                post.uid === uid && (
                  <Post key={post.id} post={post} id={post.id} />
                )
              ))
            ) : (
              likedPosts.map((post) => (
                (
                  <Post key={post.id} post={post} id={post.id} />
                )
              ))
            )
          }
        </div>
      </div>
      ) : (
        <p>Kullanıcı bilgileri yükleniyor...</p>
      )}
    </div>
  );
}