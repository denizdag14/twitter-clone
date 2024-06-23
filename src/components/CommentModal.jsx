"use client"

import { useRecoilState } from 'recoil'
import { modalState, postIdState } from '@/atom/modalAtom'
import Modal from 'react-modal'
import { HiX, HiOutlinePhotograph } from 'react-icons/hi'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useRef } from 'react'
import { getFirestore, onSnapshot, addDoc, serverTimestamp, doc, collection } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage';
import { app } from '@/firebase'
import Image from 'next/image'
import Link from 'next/link'
import { Textarea } from '@headlessui/react'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function CommentModal() {
    const filePickRef = useRef(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileUploading, setFileUploading] = useState(null);
    const [fileType, setFileType] = useState(null);
    const {data: session} = useSession();
    const db = getFirestore(app);
    const [open, setOpen] = useRecoilState(modalState);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [postId, setPostId] = useRecoilState(postIdState);
    const [post, setPost] = useState({});
    const [input, setInput] = useState('');
    const [postLoading, setPostLoading] = useState(false);
    const router = useRouter();

    const addFileToPost = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        setFileType(file.type.split("/")[0]);
        setFileUrl(URL.createObjectURL(file));
      }
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

    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
      
      return () => {
        document.body.style.overflow = 'auto';
      }
    }, [open]);

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
      setPostLoading(true);

      let uploadedFileUrl = null;

      if (selectedFile) {
        uploadedFileUrl = await uploadFileToStorage();
      }

      const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), {
        uid: session.user.uid,
        name: session.user.name,
        username: session.user.username,
        comment: input,
        profileImg: session.user.image,
        timestamp: serverTimestamp(),
        file: uploadedFileUrl,
        fileType: fileType,
      }).then(() => {
        setPostLoading(false);
        setOpen(false);
        setInput('');
        setFileUrl(null);
        setSelectedFile(null);
        router.push(`/posts/${postId}`)
      }).catch(err => {console.error(err)});
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
              <div className='p-4 max-h-[80vh] overflow-y-auto'>
                <div className='sticky top-0 dark:bg-zinc-800 bg-gray-200 rounded-xl border-b dark:border-zinc-800 border-gray-200 py-2 px-1.5 flex justify-between z-10'>
                  <span className='ml-4'>Leave a comment</span>
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
                      {selectedFile && fileType === "image" && (
                        fileUploading ? (
                          <div className="rounded-full border-none w-auto h-auto flex items-center justify-center mb-2">
                            <CircularProgress variant="determinate" value={uploadProgress}/>
                          </div>
                        ) : (
                          <Image
                            src={fileUrl}
                            alt="file"
                            className="w-auto h-auto object-cover rounded-md mb-2"
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
                      <HiOutlinePhotograph onClick={() => filePickRef.current.click()} className='h-10 w-10 p-2 text-sky-500 dark:hover:bg-sky-950 hover:bg-sky-100 rounded-full cursor-pointer' />
                      <input hidden type='file' ref={filePickRef} accept='image/*,video/*' onChange={addFileToPost}/>
                    </div>
                    <div className='flex items-center justify-end pt-2.5'>
                      <button className='bg-blue-400 disabled:hover:bg-blue-400 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:brightness-100 disabled:opacity-50' disabled={input.trim() === '' && !selectedFile || postLoading || fileUploading} onClick={sendComment}>
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
