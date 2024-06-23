"use client"

import { HiOutlineChat, HiOutlineHeart, HiHeart, HiOutlineTrash, HiOutlineSave } from "react-icons/hi"
import { useSession, signIn } from "next-auth/react"
import { app } from '../firebase';
import { getFirestore, serverTimestamp, setDoc, doc, onSnapshot, collection, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "@/atom/modalAtom";

export default function Icons({id, uid, isTrash}) {
    const { data: session } = useSession();
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const [open, setOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const db = getFirestore(app);
    const likePost = async () => {

        if(session){
            if(isLiked){
                await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid));
            } else{
                await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
                    username: session.user.username,
                    timestamp: serverTimestamp(),
                })
            }
        } else {
            signIn();
        }
    };

    const savePost = async () => {

        if(session){
            
        } else {
            signIn();
        }
    };
    
    useEffect(() => {
        onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) => {
            setLikes(snapshot.docs);
        })
    }, [db]);

    useEffect(() => {
        setIsLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1);
    }, [likes]);

    const deletePost = async () => {
        if(window.confirm('Are you sure you want to delete this post?')) {
            if(session?.user?.uid === uid) {
                deleteDoc(doc(db, 'posts', id )).then(() => {
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
    <>
        {isTrash ? (
            session?.user?.uid === uid ? (
                <div onClick={deletePost} className="flex items-center space-x-1">
                    <p className="py-3 px-3 text-gray-500 hover:text-red-500 hover:dark:bg-red-950 hover:bg-red-100 rounded-lg flex items-center space-x-2">
                        <HiOutlineTrash />
                        <span className="text-sm hidden lg:inline">Delete the post</span>
                    </p>
                </div>
            ) : (
                <div onClick={savePost} className="flex items-center space-x-1">
                    <p className="py-3 px-3 text-gray-500 hover:text-sky-500 hover:dark:bg-sky-950 hover:bg-sky-100 rounded-lg flex items-center space-x-2">
                        <HiOutlineSave />
                        <span className="text-sm hidden lg:inline">Save the post</span>
                    </p>
                </div>
            )
        ) : (
            <div className="flex justify-start gap-5 p-2 text-gray-500">
                <HiOutlineChat className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-950" 
                onClick={() => {
                    if(!session){
                        signIn();
                    }else{
                        setOpen(!open);
                        setPostId(id)
                    }
                }} />
                <div className="flex items-center">
                    {isLiked ? (
                        <HiHeart onClick={likePost} className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-950"/>
                    ) : (
                        <HiOutlineHeart onClick={likePost} className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-950"/>
                    )}
                    {likes.length > 0 && <span className={`text-xs ${isLiked && 'text-red-600'}`}>{likes.length}</span>}
                </div>
            </div>     
        )}
    </>
  )
}
