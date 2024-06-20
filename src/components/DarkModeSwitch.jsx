"use client";

import { MdLightMode, MdDarkMode } from "react-icons/md";
import { Switch } from '@headlessui/react';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DarkModeSwitch() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Switch
      checked={currentTheme === "dark"}
      onChange={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="group relative flex h-7 w-14 cursor-pointer rounded-full dark:bg-zinc-800 p-1 transition-colors bg-gray-100 duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-blue-500 ring-0 shadow-lg transition duration-200 ease-in-out ${currentTheme === "dark" ? 'translate-x-7' : 'translate-x-0'}`}
      />
      {
        currentTheme === "dark" ? 
        (
          <MdLightMode
            onClick={() => setTheme('light')}
            className="absolute top-1/2 left-1 transform -translate-y-1/2 text-xl cursor-pointer"
          />
        ) : 
        (
          <MdDarkMode
            onClick={() => setTheme('dark')}
            className="absolute top-1/2 right-1 transform -translate-y-1/2 text-xl cursor-pointer"
          />
        )
      }
    </Switch>
  );
}