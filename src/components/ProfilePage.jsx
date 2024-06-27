"use client"

import { useEffect, useState, useRef } from 'react';
import { getFirestore, doc, getDoc, updateDoc, onSnapshot, query, collection, orderBy, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '@/firebase';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { HiOutlineCalendar, HiOutlinePhotograph, HiX } from 'react-icons/hi';
import Post from './Post';
import TopNavbar from './TopNavbar';
import { useSession } from 'next-auth/react';
import Modal from 'react-modal';
import { MdOutlineAddPhotoAlternate, MdOutlineCheck } from 'react-icons/md';
import { Field, Input, Label, Textarea } from '@headlessui/react';
import { CircularProgress } from '@mui/material';

const db = getFirestore(app);
const storage = getStorage(app);

export default function ProfilePage({ posts }) {
  const { data: session, update } = useSession();
  const filePickRefHeader = useRef(null);
  const filePickRefProfile = useRef(null);
  const [userData, setUserData] = useState(null);
  const [pagePostOrLike, setPagePostOrLike] = useState('post');
  const [likes, setLikes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [editedName, setEditedName] = useState('');
  const [editedUsername, setEditedUsername] = useState('');
  const [editedHeaderImage, setEditedHeaderImage] = useState(null);
  const [forShowHeaderImage, setForShowHeaderImage] = useState(null);
  const [editedProfileImage, setEditedProfileImage] = useState(null);
  const [forShowProfileImage, setForShowProfileImage] = useState(null);
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

  const handleHeaderImageChange = async (e) => {
    const file = e.target.files[0];
    setEditedHeaderImage(e.target.files[0]);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForShowHeaderImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    setEditedProfileImage(e.target.files[0]);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForShowProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {

      const usernameQuery = query(collection(db, 'users'), where('username', '==', editedUsername));
      const usernameSnapshot = await getDocs(usernameQuery);

      if (!usernameSnapshot.empty && usernameSnapshot.length > 1) {
        setError('Bu kullanıcı adı zaten kullanılıyor.');
        setUploading(false);
        return;
      }

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
      
      let profileImageUrl = userData.image;
      if (editedProfileImage) {
        const storageRef = ref(storage, `profileImages/${uid}/${editedProfileImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, editedProfileImage);

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
              profileImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const userRef = doc(db, 'users', uid);

      let updatedData = {};
      if (editedName) updatedData.name = editedName;
      if (editedUsername) updatedData.username = editedUsername;
      updatedData.bio = editedBio;
      if (editedHeaderImage) updatedData.headerImage = headerImageUrl;
      if (editedProfileImage) updatedData.image = profileImageUrl;

      await updateDoc(userRef, updatedData);
      setUserData((prev) => ({
        ...prev,
        ...updatedData
      }));
      setIsEditing(false);
      setEditedBio('');
      setEditedName('');
      setEditedUsername('');
      setEditedHeaderImage(null);
      setEditedProfileImage(null);
      update();
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
    }
    return () => {};
  }, [isEditing])

  if(!session) return null;
  return (
    <div>
      {userData && !uploading ? (
        <div className={`max-w-xl mx-auto border-r border-l dark:border-zinc-800 min-h-screen`}>
          <TopNavbar title={userData.name} isOpen={isEditing} />
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
                <div className='absolute h-24 w-24 -mb-3 flex items-center -bottom-8 left-4'>
                  <Image
                    src={userData.image}
                    alt="Profile Image"
                    width={50}
                    height={50}
                    className='rounded-full object-cover border-2 h-24 w-24 dark:border-zinc-900 border-white'
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
          <Modal
            isOpen={isEditing}
            onAfterOpen={() => {
              setEditedBio(userData.bio);
              setEditedName(userData.name);
              setEditedUsername(userData.username);
            }}
            onRequestClose={() => {
              setIsEditing(false);
            }}
            ariaHideApp={false}
            contentLabel="Edit Profile"
            className="max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl outline-none"
          >

              <div className='p-4 max-h-[80vh] overflow-y-auto scrollbar-hide'>
                <div className='sticky top-0 dark:bg-zinc-800 bg-gray-200 rounded-xl border-b dark:border-zinc-800 border-gray-200 py-2 px-1.5 flex justify-between z-[1]'>
                  <span className='ml-4'>Edit Profile</span>
                  <HiX className='text-2xl text-gray-700 p-1 dark:hover:bg-zinc-800 hover:bg-gray-200 rounded-full cursor-pointer' onClick={() => {
                    setIsEditing(false);
                    setEditedHeaderImage(null);
                    setEditedProfileImage(null);
                    setForShowHeaderImage(null);
                    setForShowProfileImage(null);
                  }}/>
                </div>
                <div className='flex flex-col border-b mt-3 border-gray-200 dark:border-zinc-800 space-y-3 w-full'>
                  <div className="flex w-full items-end">
                    <div className="relative w-full">
                      <Image
                        src={forShowHeaderImage || userData.headerImage}
                        priority={true}
                        alt="Header Image"
                        width={600}
                        height={200}
                        className="object-cover w-full h-40 sm:h-60"
                      />
                      <div className="absolute inset-0 flex justify-center items-center">
                        {
                            editedHeaderImage !== null ? 
                              (<MdOutlineCheck
                                onClick={() => filePickRefHeader.current.click()}
                                className='absolute hover:bg-zinc-400/50 bg-zinc-500/50 h-10 w-10 p-2 rounded-full cursor-pointer z-10'
                              />
                            ) : (
                              <MdOutlineAddPhotoAlternate
                                onClick={() => filePickRefHeader.current.click()}
                                className='absolute hover:bg-zinc-400/50 bg-zinc-500/50 h-10 w-10 p-2 rounded-full cursor-pointer z-10'
                              />
                            )
                          }
                      </div>
                      <input hidden type='file' ref={filePickRefHeader} accept='image/*' onChange={handleHeaderImageChange} />
                      <div className='absolute -mb-3 flex items-center -bottom-8 left-4'>
                        <Image
                          src={forShowProfileImage || userData.image}
                          alt="Profile Image"
                          width={50}
                          height={50}
                          className='rounded-full object-cover border-2 h-24 w-24 dark:border-zinc-900 border-white'
                        />
                        <div className="absolute inset-0 flex justify-center items-center">
                          {
                            editedProfileImage !== null ? 
                              (<MdOutlineCheck
                                onClick={() => filePickRefProfile.current.click()}
                                className='absolute hover:bg-zinc-400/50 bg-zinc-500/50 h-10 w-10 p-2 rounded-full cursor-pointer z-10'
                              />
                            ) : (
                              <MdOutlineAddPhotoAlternate
                                onClick={() => filePickRefProfile.current.click()}
                                className='absolute hover:bg-zinc-400/50 bg-zinc-500/50 h-10 w-10 p-2 rounded-full cursor-pointer z-10'
                              />
                            )
                          }
                        </div>
                        <input hidden type='file' ref={filePickRefProfile} accept='image/*' onChange={handleProfileImageChange} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex p-3 space-x-3'>
                  <div className='w-full mt-12 space-y-2'>
                    <div className="w-full max-w-md px-4">
                      <Field className={''}>
                        <Label className="text-sm/6 font-medium text-zinc-900 dark:text-white">Biography</Label>
                        <Textarea
                          type="text"
                          value={editedBio}
                          onChange={(e) => setEditedBio(e.target.value)}
                          className={
                            'mt-3 block min-h-14 w-full rounded-lg border-none bg-gray-100 dark:bg-white/5 py-1.5 px-3 text-sm/6 dark:text-white focus:outline-none'
                          }
                        />
                      </Field>
                    </div>
                    <div className="w-full max-w-md px-4">
                      <Field className={''}>
                        <Label className="text-sm/6 font-medium text-zinc-900 dark:text-white">Name</Label>
                        <Input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className={
                            'mt-3 block w-full rounded-lg border-none bg-gray-100 dark:bg-white/5 py-1.5 px-3 text-sm/6 dark:text-white focus:outline-none'
                          }
                        />
                      </Field>
                    </div>
                    <div className="w-full max-w-md px-4">
                      <Field className={''}>
                        <Label className="text-sm/6 font-medium text-zinc-900 dark:text-white">Username</Label>
                        <Input
                          type="text"
                          value={editedUsername}
                          onChange={(e) => setEditedUsername(e.target.value)}
                          className={
                            'mt-3 block w-full rounded-lg border-none bg-gray-100 dark:bg-white/5 py-1.5 px-3 text-sm/6 dark:text-white focus:outline-none'
                          }
                        />
                      </Field>
                    </div>
                    <div className='flex items-center justify-end pt-2.5'>
                      <button className='bg-blue-400 disabled:hover:bg-blue-400 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:brightness-100 disabled:opacity-50' disabled={(!editedName || !editedUsername)} onClick={handleEditProfile}>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          </Modal>
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
              <div className='px-4 py-2 text-sm'>
                {userData.bio}
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
                      <span className='text-sm'>Likes {likedPosts.length}</span>
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
        </div>
      ) : (
        <div className='flex w-full h-screen items-center justify-center'>
          <CircularProgress />
        </div>
      )}
    </div>
  );
}