"use client"

import { Header } from "@/components/Header";
import { ProfileBadgesPage } from "@/components/ProfileBadgesPage";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";


interface UserData{
  id: string
  name:string
  created_at: string
  profile_url:string
  position: string
  badges: BadgeProps[]
  not_obtained_badges: BadgeProps[]
} 

interface BadgeProps{
  name: string
  description: string
  image_url: string
}


export default function ProfileUserBadgesPage() {

  useContext(AuthContext)

  const [profile, setProfile] = useState<UserData | null >(null)
  const [loading, setLoading] = useState<boolean>(true)

  const params = useParams<{id: string}>()
  const { id } = params

  useEffect(() => {
      api.get(`/users/profile/${id}`, { withCredentials: true })
      .then((res) => {
        setProfile(res.data.user)
      })
      .finally(()=>{
        setLoading(false)
      })  
  }, [id])

  if(loading || !profile){
    return null
  }
  const tit = `Perfil | ${profile.name}`

  return (
    <>
      <title>{tit}</title>
      <meta key="profile-page" name="profile" content="Conheça essa pessoa!"/>
      
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ProfileBadgesPage
            badges={profile.badges}
            not_obtained_badges={profile.not_obtained_badges}
            name={profile.name}
            profile_url={profile.profile_url}
            id={profile.id}
          />
        </main>
      </div>
    </>
  );
}
