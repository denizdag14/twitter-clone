import { app } from "@/firebase";
import { getDoc, getFirestore, doc, query } from "firebase/firestore";
import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import ForPostPage from "@/components/ForPostPage";

export default async function PostPage({params}) {

  const db = getFirestore(app);
  let data = {};
  const querySnapshot = await getDoc(doc(db, 'posts', params.id));
  data = { ...querySnapshot.data(), id: querySnapshot.id };

  return (
    <div className="max-w-xl mx-auto border-r border-l dark:border-zinc-800 min-h-screen">
      <div className="flex items-center space-x-2 py-2 px-3 sticky top-0 bg-white border-b border-gray-200 dark:border-zinc-800 dark:bg-zinc-900">
        <Link href={'/'} className="hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full p-2" >
          <HiArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="sm:text-lg">Back</h2>
      </div>
      <ForPostPage post={data} id={data.id}/>
    </div>
  )
}
