"use client"

import { Header } from "@/components/Header";
import { ProfileBadgesPage } from "@/components/ProfileBadgesPage";
import { ProfilePage } from "@/components/ProfilePage";
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
  }, [])

  if(loading || !profile){
    return null
  }
  const tit = `Perfil | ${profile.name}`

  return (
    <>
      <title>{tit}</title>
      <meta key="profile-page" name="profile" content="Conheça essa pessoa!"/>
      
      <div className="flex flex-col h-screen bg-gray-100">
        <div>
          <Header />
        </div>
        <div className="flex justify-center items-center h-screen ">
          <ProfileBadgesPage
            badges={profile.badges}
            name={profile.name}
            profile_url={profile.profile_url}
            id={profile.id}
          />
        </div>
      </div>
    </>
  );
}
