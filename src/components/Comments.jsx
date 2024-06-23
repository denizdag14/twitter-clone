"use client"

import { collection, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore"
import Comment from "./Comment"
import { app } from "@/firebase"
import { useEffect, useState } from "react";
import { HiOutlineChat } from "react-icons/hi";


export default function Comments({id}) {
    const db = getFirestore(app);
    const [comments, setComments] = useState([]);
    
    useEffect(() => {
        onSnapshot(query(collection(db, 'posts', id, 'comments'), orderBy('timestamp', 'desc')), (snapshot) => {
            setComments(snapshot.docs);
        });
    }, [db, id])

  return (
    <div>
        <div className="flex items-center">
            <HiOutlineChat className="ml-3 text-lg" />
            <h2 className="px-3 py-2">Comments</h2>
        </div>
        {
            comments.map((comment) => (
                <Comment key={comment.id} comment={comment.data()} commentId={comment.id} postId={id} />
            ))
        }
    </div>
  )
}
