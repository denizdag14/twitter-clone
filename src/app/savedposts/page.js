import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore"
import { app } from "@/firebase";
import SavedPost from "@/components/SavedPost";

export default async function page() {
    const db = getFirestore(app);
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    let posts = [];
    querySnapshot.forEach((doc) => {
        posts.push({id: doc.id, ...doc.data()});
    });
  return (
    <div>
        <SavedPost posts={posts}/>
    </div>
  )
}
