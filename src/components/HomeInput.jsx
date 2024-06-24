"use client"

import { useSession } from "next-auth/react"
import Image from "next/image";
import { Textarea } from '@headlessui/react'
import { HiOutlinePhotograph } from "react-icons/hi";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { app } from "../firebase";
import { getStorage, ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage';
import { CircularProgress } from "@mui/material";
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';

export default function HomeInput() {
  const router = useRouter();
  const { data:session } = useSession();
  const filePickRef = useRef(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploading, setFileUploading] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [text, setText] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  const db = getFirestore(app);

  const addFileToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileType(file.type.split("/")[0]);
      setFileUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setPostLoading(true);

    let uploadedFileUrl = null;

    if (selectedFile) {
      uploadedFileUrl = await uploadFileToStorage();
    }

    const docRef = await addDoc(collection(db, 'posts'), {
      uid: session.user.uid,
      name: session.user.name,
      username: session.user.username,
      text: text,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
      file: uploadedFileUrl,
      fileType: fileType,
    });
    setPostLoading(false);
    setText('');
    setFileUrl(null);
    setSelectedFile(null);
    location.reload();
  };

  const uploadFileToStorage = () => {

    return new Promise((resolve, reject) => {
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
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUrl(downloadURL);
            setFileUploading(false);
            resolve(downloadURL);
          });
        }
      );
    });
  };

    if(!session) return null;
  return (
    <div className='flex border-b border-gray-200 dark:border-zinc-800 p-3 space-x-3 w-full'>
        <Image onClick={() => router.push(`/profile/${session?.user?.uid}`)} src={session.user.image} alt={'/no_image_available.jpg'} width={50} height={50} className='rounded-full w-11 h-11 cursor-pointer'/>
        
        <div className='w-full divide-y divide-gray-200 dark:divide-zinc-800'>
          <Textarea className='w-full dark:bg-zinc-900 border-none outline-none tracking-wide min-h-12' placeholder='Whats happening' rows='2' value={text} onChange={(e) => setText(e.target.value)}></Textarea>
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
            <button
              disabled={text.trim() === '' && !selectedFile || postLoading || fileUploading}
              className='disabled:bg-blue-400 bg-blue-500 disabled:hover:bg-blue-400 hover:bg-blue-600 text-white disabled:text-white/50 px-4 py-1 rounded-full font-bold disabled:shadow-none shadow-md'
              onClick={handleSubmit}
            >
              Post
            </button>
          </div>
        </div>
    </div>
  )
}
