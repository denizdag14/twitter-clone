import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import News from "@/components/News";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "twitter-clone",
  description: "A clone of Twitter built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className='flex justify-between max-w-6xl mx-auto'>
            <div className='hidden sm:inline border-r h-screen'>
              <Sidebar />
            </div>
            <div>{children}</div>
            <div>
              <News />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
