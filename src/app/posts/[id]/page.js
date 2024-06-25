import { app } from "@/firebase";
import { getDoc, getFirestore, doc, query } from "firebase/firestore";
import ForPostPage from "@/components/ForPostPage";
import Comments from "@/components/Comments";
import TopNavbar from "@/components/TopNavbar";

export default async function PostPage({params}) {

  const db = getFirestore(app);
  let data = {};
  const querySnapshot = await getDoc(doc(db, 'posts', params.id));
  data = { ...querySnapshot.data(), id: querySnapshot.id };

  return (
    <div className="max-w-xl mx-auto border-r border-l dark:border-zinc-800 min-h-screen">
      <TopNavbar />
      <ForPostPage post={data} id={data.id}/>
      <Comments id={params.id} postOwnerId={data.uid} />
    </div>
  )
}
