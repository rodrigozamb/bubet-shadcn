"use client"

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { api } from '@/services/api'
import { setCookie, parseCookies } from 'nookies'
import Router from 'next/router'

import { recoverUserInformation, signInRequest } from '../services/auth'
import { useRouter } from 'next/navigation'

interface AuthProviderProps {
  children: ReactNode
}

type User = {
  name: string
  email: string
  profile_url: string
  id: string
  notifications:{
      id: string,
      title: string,
      content: string,
      user_notification_id: string,
      link?: string,
      icon?: string
  }[]
}

type SignInData = {
  email: string
  password: string
}

type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  signIn: (data: SignInData) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const isAuthenticated = !!user

  const router = useRouter()

  useEffect(() => {
    const { 'bubet.token': bubetToken } = parseCookies()

    if (bubetToken) {
      const user = parseJwt(bubetToken)
      setUser(user)
      setToken(bubetToken)
    }
  }, [])

  async function signIn({ email, password }: SignInData) {
    console.log("Inside signIn function! - ", email, password)
    const response = await signInRequest({
      email,
      password,
    })

    const { 'bubet.token': buBetToken } = parseCookies()

    setToken(buBetToken)
    const res = await api.get('/users/profile', { withCredentials: true })

    if(res.data.user.notifications == undefined){
      res.data.user.notifications = []
    }else{
      res.data.user.notifications = res.data.user.notifications.map((not:any) => { return {...not.notification, user_notification_id: not.id}  })
    }

    setUser(res.data.user)

    router.push('/dashboard')
  }

  function parseJwt(token: string) {
    if (!token) {
      return
    }
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
  }

  return (
    <AuthContext value={{isAuthenticated, signIn, token, user}}>
      {children}
    </AuthContext>
  )
}
