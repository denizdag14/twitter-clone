import HomeInput from "@/components/HomeInput";
import Feed from "@/components/Feed";
import { FaTwitter } from "react-icons/fa";

export default function page() {
  return (
    <div className='max-w-xl mx-auto border-r border-l dark:border-zinc-800 min-h-screen'>
      <div className='py-2 px-3 flex justify-between items-center sticky top-0 dark:bg-zinc-900/70 bg-white/70 border-b dark:border-zinc-800 border-gray-200 backdrop-filter backdrop-blur-sm'>
        <h2 className='text-lg sm:text-xl font-bold'>Home</h2>
        <div className='items-center p-2 gap-2 w-12 h-12 flex sm:hidden'>
          <FaTwitter className='w-10 h-10 text-blue-500' />
        </div>
      </div>
      <div className="overflow-y-auto">
        <HomeInput />
        <Feed />
      </div>
    </div>
  )
}