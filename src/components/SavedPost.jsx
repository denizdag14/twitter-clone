"use client"

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { app } from '@/firebase';
import { getFirestore, onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import Post from './Post';
import TopNavbar from './TopNavbar';

export default function SavedPost({ posts }) {
    const [savedPosts, setSavedPosts] = useState([]);
    const { data:session } = useSession();
    const db = getFirestore(app);

    useEffect(() => {
        if(session?.user?.uid){
            onSnapshot(query(collection(db, 'users', session.user.uid, 'savedPosts'), orderBy('timestamp', 'desc')), (snapshot) => {
                setSavedPosts(snapshot.docs);
            });
        }
    }, [db, session?.user?.uid]);

    const savedPostIds = savedPosts.map(post => post.id);
    const savedPostsToShow = posts.filter(post => savedPostIds.includes(post.id));

  return (
    <div>
        <TopNavbar title={'Saved Posts'} />
        {savedPostsToShow.map((post) => (
            <Post key={post.id} post={post} id={post.id} />
        ))}
    </div>
  )
}
