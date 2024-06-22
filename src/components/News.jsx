"use client"

import { useState } from "react"
import Image from "next/image";

export default function News({news}) {

  const [articleNumber, setArticleNumber] = useState(3);

  return (
    <div className='space-y-3 shadow-md dark:bg-zinc-800 bg-gray-100 rounded-xl pt-2'>
      <h4 className='font-bold text-xl px-4'>Whats happening</h4>
      {news.slice(0, articleNumber).map((article, index) => (
        <div key={index}>
          <a href={article.url} target='_blank'>
            <div className='flex items-center justify-between px-4 py-2 space-x-1 dark:hover:bg-zinc-700 hover:bg-gray-200 transition duration-200'>
              <div className='space-y-0.5'>
                <h6 className='text-sm font-bold'>{article.title}</h6>
                <p className='text-xs font-medium text-gray-500'>{article.source.name}</p>
              </div>
              <Image src={article.urlToImage ? article.urlToImage : '/no_image_available.jpg'} width={70} height={70} alt='' className='rounded-xl'></Image>
            </div>
          </a>
        </div>
      ))}
      <div className='flex '>
        {articleNumber === 3 ? (
          <button 
          className='w-full py-2 rounded-b-xl text-blue-400 hover:text-blue-600 dark:hover:bg-zinc-700 hover:bg-gray-200 transition duration-200'
          onClick={() => setArticleNumber(articleNumber + 3)}
          >
            Show More
        </button>
        ) : (
          <>
            <button 
              className='w-full py-2 rounded-bl-xl text-blue-400 hover:text-blue-600 dark:hover:bg-zinc-700 hover:bg-gray-200 transition duration-200'
              onClick={() => setArticleNumber(3)}
              >
                Show Less
            </button>
            <button 
              className='w-full py-2 rounded-br-xl text-blue-400 hover:text-blue-600 dark:hover:bg-zinc-700 hover:bg-gray-200 transition duration-200'
              onClick={() => setArticleNumber(articleNumber + 3)}
            >
              Show More
            </button>
          </>
        )}
        
      </div>
    </div>
  )
}
