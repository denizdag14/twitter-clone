import { app } from "@/firebase";
import { getDoc, getFirestore, doc, query } from "firebase/firestore";
import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import ForPostPage from "@/components/ForPostPage";
import Comments from "@/components/Comments";
import { FaTwitter } from "react-icons/fa";

export default async function PostPage({params}) {

  const db = getFirestore(app);
  let data = {};
  const querySnapshot = await getDoc(doc(db, 'posts', params.id));
  data = { ...querySnapshot.data(), id: querySnapshot.id };

  return (
    <div className="max-w-xl mx-auto border-r border-l dark:border-zinc-800 min-h-screen">
      <div className='py-2 px-3 flex justify-between items-center sticky top-0 dark:bg-zinc-900/70 bg-white/70 border-b dark:border-zinc-800 border-gray-200 backdrop-filter backdrop-blur-sm'>
        <div className="flex items-center">
          <Link href={'/'} className="hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full p-2" >
            <HiArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="sm:text-lg">Back</h2>
        </div>
        <div className='items-center p-2 gap-2 w-12 h-12 flex sm:hidden'>
            <FaTwitter className='w-10 h-10 text-blue-500' />
        </div>
      </div>
      <ForPostPage post={data} id={data.id}/>
      <Comments id={params.id} postOwnerId={data.uid} />
    </div>
  )
}
