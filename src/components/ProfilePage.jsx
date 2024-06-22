"use client"

import { useSearchParams } from "next/navigation"

export default function ProfilePage() {
    const searchParams = useSearchParams();
    const username = searchParams.get('username');
  return (
    <div>{username}</div>
  )
}
