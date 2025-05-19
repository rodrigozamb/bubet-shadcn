'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const token = Cookies.get('bubet.token')

    if (!token) {
      // Not logged in → send to login
      router.replace('/login')
    } else {
      // Logged in → render children
      setChecked(true)
    }
  }, [router])

  // Prevent rendering protected UI until we've checked the cookie
  if (!checked) {
    return null  // or a loading spinner
  }

  return <>{children}</>
}