"use client"

import { useEffect, useState, useRef } from 'react';
import { getFirestore, doc, getDoc, updateDoc, onSnapshot, query, collection, orderBy, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '@/firebase';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { HiOutlineCalendar, HiOutlinePhotograph } from 'react-icons/hi';
import Post from './Post';
import TopNavbar from './TopNavbar';
import { Input } from '@headlessui/react';
import { CircularProgress } from "@mui/material";
import { useSession } from 'next-auth/react';

const db = getFirestore(app);
const storage = getStorage(app);

export default function ProfilePage({ posts }) {
  const { data: session } = useSession();
  const filePickRefHeader = useRef(null);
  const [userData, setUserData] = useState(null);
  const [pagePostOrLike, setPagePostOrLike] = useState('post');
  const [likes, setLikes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHeaderImage, setEditedHeaderImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const pathname = usePathname();
  const uid = pathname.split('/')[pathname.split('/').length - 1];

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
  }, [db, uid]);

  const likedPostIds = likes.map(like => like.id);
  const likedPosts = posts.filter(post => likedPostIds.includes(post.id));

  let postCount = 0;
  posts.map((post) => (
    post.uid === uid && (
      postCount += 1
    )
  ));

  const handleHeaderImageChange = (e) => {
    if (e.target.files[0]) {
      setEditedHeaderImage(e.target.files[0]);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {

      let headerImageUrl = userData.headerImage;
      if (editedHeaderImage) {
        const storageRef = ref(storage, `headerImages/${uid}/${editedHeaderImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, editedHeaderImage);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => {
              console.error('Upload error:', error);
              setError('Resim yükleme hatası.');
              setUploading(false);
              reject(error);
            },
            async () => {
              headerImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        headerImage: headerImageUrl,
      });
      setUserData((prev) => ({
        ...prev,
        headerImage: headerImageUrl,
      }));
      setIsEditing(false);
      setEditedHeaderImage(null);
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
    } finally {
      setUploading(false);
    }
  };

  if(!session) return null;
  return (
    <div>
      {userData ? (
        <div className="max-w-xl mx-auto border-r border-l dark:border-zinc-800 min-h-screen">
          <TopNavbar title={userData.name} />
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
                    className='rounded-full border-2 h-24 w-24 dark:border-zinc-900 border-white'
                  />
                </div>
              </div>
            </div>
          </div>
          {
            session.user.uid === uid ? (
              <div className='flex p-2 justify-end items-start'>
                <button
                  className='rounded-full border dark:border-zinc-700 dark:hover:bg-zinc-800'
                  onClick={() => setIsEditing(true)}
                >
                  <span className='p-4 text-sm'>Edit Profile</span>
                </button>
              </div>
            ) : (
              <div className='flex p-2 justify-end items-start'>
              </div>
            )
          }
          {isEditing ? (
            <form onSubmit={handleEditProfile} className='flex flex-col p-4 space-y-3'>
              <div className='flex items-center w-full justify-start gap-2'>
                <HiOutlinePhotograph onClick={() => filePickRefHeader.current.click()} className='h-10 w-10 p-2 text-sky-500 dark:hover:bg-sky-950 hover:bg-sky-100 rounded-full cursor-pointer' />
                <input hidden type='file' ref={filePickRefHeader} accept='image/*,video/*' onChange={handleHeaderImageChange}/>
                <Input
                  type="text"
                  disabled
                  value={editedHeaderImage ? 'Image selected' : 'Select an image if you want to change your header image.'}
                  placeholder="Header Image"
                  className='dark:focus:outline w-full dark:focus:outline-zinc-600 focus:outline focus:outline-gray-400 bg-gray-200 dark:bg-zinc-800 p-2 rounded-full'
                />
              </div>
              {
                uploading && 
                <div className="rounded-full border-none w-auto h-auto flex items-center justify-center mb-2">
                  <CircularProgress />
                </div>
              }
              {error && <p className='text-red-500'>{error}</p>}
              <div className='flex gap-3 items-center justify-end'>
                <button type="button" onClick={() => setIsEditing(false)} className='bg-red-500 text-white hover:bg-red-600 p-2 rounded-full'>Cancel</button>
                <button type="submit" className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md'>Save</button>
              </div>
            </form>
          ) : (
            <>
              <div className={`flex items-center justify-between gap-2 px-4 ${session.user.uid === uid ? ('pt-5') : ('pt-11')} mb-2`}>
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
                    <button onClick={() => setPagePostOrLike('post')} className={`w-full h-full hover:dark:bg-zinc-800 hover:text-blue-400 hover:bg-gray-200 ${pagePostOrLike === 'post' && 'underline-offset-4 underline text-blue-400'}`}>
                      <span className='text-sm'>Posts {postCount}</span>
                    </button>
                  </div>
                  <div className='flex-1 text-center'>
                    <button onClick={() => setPagePostOrLike('like')} className={`w-full h-full hover:dark:bg-zinc-800 hover:text-blue-400 hover:bg-gray-200 ${pagePostOrLike === 'like' && 'underline-offset-4 underline text-blue-400'}`}>
                      <span className='text-sm'>Likes {likes.length}</span>
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
            </>
          )}
        </div>
      ) : (
        <p>Kullanıcı bilgileri yükleniyor...</p>
      )}
    </div>
  );
}

// "use client"

// import { useEffect, useState } from 'react';
// import { getFirestore, doc, getDoc, onSnapshot, query, collection, orderBy } from 'firebase/firestore';
// import { app } from '@/firebase';
// import { usePathname } from 'next/navigation';
// import Image from 'next/image';
// import { HiOutlineCalendar } from 'react-icons/hi';
// import Post from './Post';
// import TopNavbar from './TopNavbar';

// const db = getFirestore(app);

// export default function ProfilePage({posts}) {
//   const [userData, setUserData] = useState(null);
//   const [pagePostOrLike, setPagePostOrLike] = useState('post'); 
//   const [likes, setLikes] = useState([]);
//   const pathname = usePathname();
//   const uid = pathname.split('/')[pathname.split('/').length - 1]

//   const formatDate = (date) => {
//     const options = { year: 'numeric', month: 'long' };
//     return new Intl.DateTimeFormat('en-US', options).format(date);
//   };

//   useEffect(() => {
//     async function fetchUserData() {
//       try {
//         const userRef = doc(db, 'users', uid);
//         const userSnap = await getDoc(userRef);

//         if (userSnap.exists()) {
//           setUserData(userSnap.data());
//         } else {
//           console.log('Kullanıcı bulunamadı.');
//         }

//       } catch (error) {
//         console.error('Firestore\'dan veri getirme hatası:', error);
//       }
//     }

//     if (uid) {
//       fetchUserData();
//     }
//   }, [db, uid]);

//   useEffect(() => {
//     onSnapshot(query(collection(db, 'users', uid, 'likes'), orderBy('timestamp', 'desc')), (snapshot) => {
//         setLikes(snapshot.docs);
//     });
//   }, [db, uid])

//   const likedPostIds = likes.map(like => like.id);
//   const likedPosts = posts.filter(post => likedPostIds.includes(post.id));

//   let postCount = 0;
//   posts.map((post) => (
//     post.uid === uid && (
//       postCount += 1
//     )
//   ))
  
//   return (
//     <div>
//       {userData ? (
//       <div className="max-w-xl mx-auto border-r border-l dark:border-zinc-800 min-h-screen">
//         <TopNavbar title={userData.name} />
//         <div className='flex flex-col border-b border-gray-200 dark:border-zinc-800 space-y-3 w-full'>
//           <div className="flex w-full items-end">
//             <div className="relative w-full">
//               <Image 
//                 src={userData.headerImage}
//                 priority={true}
//                 alt="Header Image" 
//                 width={600} 
//                 height={200} 
//                 className="object-cover w-full h-40 sm:h-60"
//               />
//               <div className='absolute -mb-3 flex items-center -bottom-8 left-4'>
//                 <Image 
//                   src={userData.image} 
//                   alt="Profile Image" 
//                   width={50} 
//                   height={50} 
//                   className='rounded-full border-2 h-auto w-auto dark:border-zinc-900 border-white' 
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='flex p-2 justify-end items-start'>
//           <button className='rounded-full border dark:border-zinc-700 dark:hover:bg-zinc-800'>
//             <span className='p-4 text-sm'>Edit Profile</span>
//           </button>
//         </div>
//         <div className='flex items-center justify-between gap-2 px-4 pt-5 mb-2'>
//           <div className="flex items-center">
//             <span className="font-bold text-sm mr-1 truncate">{userData.name}</span>
//             <span className="truncate text-xs text-gray-500">@{userData.username}</span>
//           </div>
//           <div className='flex'>
//             <span className='flex items-center text-xs text-gray-500'><HiOutlineCalendar className='mr-1' /> joined {formatDate(userData.created_time.toDate())}</span>
//           </div>
//         </div>
//         <div className='border-t dark:border-zinc-800'>
//           <div className='flex justify-between border-b dark:border-zinc-800 bg-white dark:bg-zinc-900 h-10'>
//             <div className='flex-1 text-center w-full h-full'>
//               <button onClick={() => setPagePostOrLike('post')} className={`w-full h-full hover:dark:bg-zinc-800 hover:text-blue-400 hover:bg-gray-200 ${pagePostOrLike === 'post' && 'underline-offset-4 underline text-blue-400'}`}>
//                 <span className='text-sm'>Posts {postCount}</span>
//               </button>
//             </div>
//             <div className='flex-1 text-center'>
//               <button onClick={() => setPagePostOrLike('like')}  className={`w-full h-full hover:dark:bg-zinc-800 hover:text-blue-400 hover:bg-gray-200 ${pagePostOrLike === 'like' && 'underline-offset-4 underline text-blue-400'}`}>
//                 <span className='text-sm'>Likes {likes.length}</span>
//               </button>
//             </div>
//           </div>
//           {
//             pagePostOrLike === 'post' ? (
//               posts.map((post) => (
//                 post.uid === uid && (
//                   <Post key={post.id} post={post} id={post.id} />
//                 )
//               ))
//             ) : (
//               likedPosts.map((post) => (
//                 (
//                   <Post key={post.id} post={post} id={post.id} />
//                 )
//               ))
//             )
//           }
//         </div>
//       </div>
//       ) : (
//         <p>Kullanıcı bilgileri yükleniyor...</p>
//       )}
//     </div>
//   );
// }