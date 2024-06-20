import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import News from "@/components/News";
import Providers from "./Providers";
import DarkModeSwitch from "@/components/DarkModeSwitch";
import SearchBox from "@/components/SearchBox";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "twitter-clone",
  description: "A clone of Twitter built with Next.js",
};

var news;
const API_KEY = process.env.API_KEY;
fetch(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${API_KEY}`).then((response) => response.json()).then((data) => {
  news = data.articles;
})

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <div className='flex justify-between max-w-6xl mx-auto'>
              <div className='border-r dark:border-zinc-800 h-screen'>
                <Sidebar />
              </div>
              <div>{children}</div>
              <div className='lg:flex-col p-3 h-screen border-l dark:border-zinc-800 hidden lg:flex w-[24rem]'>
                <div className='sticky top-0 py-2 flex space-x-2'>
                  <SearchBox />
                  <div className='ml-auto self-center'>
                    <DarkModeSwitch />
                  </div>
                </div>
                <News news={news}/>
              </div>
            </div>
          </Providers>
        </body>
      </html>
    </SessionWrapper>
  );
}
