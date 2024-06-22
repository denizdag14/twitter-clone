import Image from "next/image"
import { HiDotsHorizontal } from "react-icons/hi"
import Link from "next/link"

export default function Post({ post, id }) {
  return (
    <div className="flex p-3 border-b border-gray-200 dark:border-zinc-700">
        <Image className="h-11 w-11 rounded-full mr-4" src={post?.profileImg} alt="user-img" width={50} height={50} />
        <div className="flex-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 whitespace-nowrap">
                    <h4 className="font-bold text-sx truncate">{post?.name}</h4>
                    <span className="text-xs truncate">@{post?.username}</span>
                </div>
                <HiDotsHorizontal className="text-sm" />
            </div>
            <Link href={`/posts/${id}`}>
                <p className="text-sm my-3">{post?.text}</p>
            </Link>
            {post?.file !== null ? (
                <Link href={`/posts/${id}`}>
                    {post?.fileType === 'image' ? (
                        <Image src={post?.file} alt="post-img" className='rounded-xl mr-2 w-auto h-auto' width={50} height={50} />
                    ) : (
                        <video controls src={post?.file} alt="post-img" className='rounded-xl mr-2 w-auto h-auto' width={50} height={50} />
                    )}
                </Link>
            ) : (null)}
        </div>
    </div>
  )
}
