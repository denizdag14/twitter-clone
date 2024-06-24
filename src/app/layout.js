import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from "./Providers";
import DarkModeSwitch from "@/components/DarkModeSwitch";
import SearchBox from "@/components/SearchBox";
import SessionWrapper from "@/components/SessionWrapper";
import FetchNews from "@/components/FetchNews";
import CommentModal from "@/components/CommentModal";
import BottomNavbar from "@/components/BottomNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "twitter-clone",
  description: "A clone of Twitter built with Next.js",
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <div className='flex justify-between max-w-6xl mx-auto'>
              <div className='hidden sm:inline border-r dark:border-zinc-800 h-screen sticky top-0'>
                <Sidebar />
              </div>
              <div className='w-2xl flex-1 h-screens scrollbar-hide'>
                {children}
                <div className="py-2 px-3 border-t-2 dark:border-zinc-800 border-gray-200 sticky bottom-0 dark:bg-zinc-900 bg-white block sm:hidden">
                  <BottomNavbar />
                </div>
              </div>
              <div className='sticky top-0 lg:flex-col p-3 h-screen border-l dark:border-zinc-800 hidden lg:flex w-[24rem] overflow-y-auto scrollbar-hide'>
                <div className='dark:bg-zinc-800 shadow-md bg-gray-100 rounded-xl sticky top-0 py-2 flex space-x-2 mb-4'>
                  <SearchBox />
                  <div className="border-r dark:border-zinc-700"></div>
                  <div className='dark:bg-zinc-800 rounded-xl ml-auto self-center'>
                    <DarkModeSwitch isMobile={false}/>
                  </div>
                </div>
                <FetchNews />
              </div>
            </div>
            <CommentModal />
          </Providers>
        </body>
      </html>
    </SessionWrapper>
  );
}
