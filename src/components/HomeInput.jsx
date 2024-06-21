"use client"

import { useSession } from "next-auth/react"
import Image from "next/image";
import { Textarea } from '@headlessui/react'
import { HiOutlinePhotograph } from "react-icons/hi";
import { useRef, useState, useEffect } from "react";
import { app } from "../firebase";
import { getStorage, ref, uploadBytesResumabl, getDownloadURL, uploadBytesResumable} from 'firebase/storage';

export default function HomeInput() {
    const { data:session } = useSession();
    const imagePickRef = useRef(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(null);
    const addImageToPost = (e) => {
      const file = e.target.files[0];
      if(file){
        setSelectedFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      }
    };

    useEffect(() => {
      if(selectedFile){
        uploadImageToStorage();
      }
    }, [selectedFile])

    const uploadImageToStorage = () => {
      setImageFileUploading(true);
      const storage = getStorage(app)
      const fileName = new Date().getTime() + '-' + selectedFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.log(error);
          setImageFileUploading(false);
          setImageFileUrl(null);
          setSelectedFile(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setImageFileUploading(false);
          })
        }
      )
    };

    if(!session) return null;
  return (
    <div className='flex border-b border-gray-200 dark:border-zinc-800 p-3 space-x-3 w-full'>
        <Image src={session.user.image} alt={'/no_image_available.jpg'} width={70} height={70} className='h-11 w-11 rounded-full cursor-pointer hover:brightness-95'/>
        <div className='w-full divide-y divide-gray-200 dark:divide-zinc-800'>
          <Textarea className='w-full dark:bg-zinc-900 border-none outline-none tracking-wide min-h-12' placeholder='Whats happening' rows='2'></Textarea>
          {
            selectedFile && (
              <Image src={imageFileUrl} alt='image' className='w-auto h-auto object-cover cursor-pointer' width={50} height={50}/>
            )
          }
          <div className='flex items-center justify-between pt-2.5'>
            <HiOutlinePhotograph onClick={() => imagePickRef.current.click()} className='h-10 w-10 p-2 text-sky-500 dark:hover:bg-sky-950 hover:bg-sky-100 rounded-full cursor-pointer' />
            <input hidden type='file' ref={imagePickRef} accept='image/*' onChange={addImageToPost}/>
            <button  className='bg-blue-400 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:brightness-100 disabled:opacity-50'>Post</button>
          </div>
        </div>
    </div>
  )
}
