"use client"

import { useSession } from "next-auth/react"
import Image from "next/image";
import { Textarea } from '@headlessui/react'
import { HiOutlinePhotograph } from "react-icons/hi";
import { useRef, useState, useEffect } from "react";
import { app } from "../firebase";
import { getStorage, ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage';
import { CircularProgress } from "@mui/material";

export default function HomeInput() {
    const { data:session } = useSession();

    const filePickRef = useRef(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploading, setFileUploading] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addFileToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileType(file.type.split("/")[0]);
      setFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (selectedFile) {
      uploadFileToStorage();
    }
  }, [selectedFile]);

  const uploadFileToStorage = () => {
    setFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
        setFileUploading(false);
        setFileUrl(null);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileUrl(downloadURL);
          setFileUploading(false);
        });
      }
    );
  };

    if(!session) return null;
  return (
    <div className='flex border-b border-gray-200 dark:border-zinc-800 p-3 space-x-3 w-full'>
        <Image src={session.user.image} alt={'/no_image_available.jpg'} width={70} height={70} className='h-11 w-11 rounded-full cursor-pointer hover:brightness-95'/>
        <div className='w-full divide-y divide-gray-200 dark:divide-zinc-800'>
          <Textarea className='w-full dark:bg-zinc-900 border-none outline-none tracking-wide min-h-12' placeholder='Whats happening' rows='2'></Textarea>
          {/* {
            selectedFile && (
              <Image src={imageFileUrl} alt='image' className='w-auto h-auto object-cover cursor-pointer' width={50} height={50}/>
            )
          } */}
          {selectedFile && fileType === "image" && (
            fileUploading ? (
              <div className="rounded-full border-none w-auto h-auto flex items-center justify-center mb-2">
                <CircularProgress variant="determinate" value={uploadProgress}/>
              </div>
            ) : (
              <Image
                src={fileUrl}
                alt="file"
                className="w-auto h-auto object-cover cursor-pointer rounded-md mb-2"
                width={50}
                height={50}
              />
            )
          )}
          {selectedFile && fileType === "video" && (
            fileUploading ? (
              <div className="rounded-full border-none w-auto h-auto flex items-center justify-center mb-2">
                <CircularProgress variant="determinate" value={uploadProgress}/>
              </div>
            ) : (
              <video
                src={fileUrl}
                controls
                className="w-auto h-auto object-cover cursor-pointer rounded-md mb-2"
                width={50}
                height={50}
              />
            )
          )}
          <div className='flex items-center justify-between pt-2.5'>
            <HiOutlinePhotograph onClick={() => filePickRef.current.click()} className='h-10 w-10 p-2 text-sky-500 dark:hover:bg-sky-950 hover:bg-sky-100 rounded-full cursor-pointer' />
            <input hidden type='file' ref={filePickRef} accept='image/*,video/*' onChange={addFileToPost}/>
            <button  className='bg-blue-400 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:brightness-100 disabled:opacity-50'>Post</button>
          </div>
        </div>
    </div>
  )
}
