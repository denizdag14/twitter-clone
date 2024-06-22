import HomeInput from "@/components/HomeInput";
import Feed from "@/components/Feed";

export default function page() {
  return (
    <div className='max-w-xl mx-auto border-r border-l dark:border-zinc-800 min-h-screen'>
      <div className='py-2 px-3 sticky top-0 z-50 border-b dark:border-zinc-800 border-gray-200'>
        <h2 className='text-lg sm:text-xl font-bold'>Home</h2>
      </div>
      <HomeInput />
      <Feed />
    </div>
  )
}