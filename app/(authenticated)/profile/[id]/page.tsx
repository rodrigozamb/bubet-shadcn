"use client"

import { CompetitorPage } from "@/components/CompetitorPage";
import { Header } from "@/components/Header";
import { ProfilePage } from "@/components/ProfilePage";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import axios from "axios";
import type { Metadata } from "next";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";


interface UserData{
  id: string
  name:string
  created_at: string
  profile_url:string
  position: string
} 

interface EventProps{
  id: string
  name: string
  banner: string
}

interface BetProps{
  name: string
}
interface UserBetProps{
  bets:BetProps[]
  points: string
  event: EventProps
  created_at: string
}

interface ProfileUserPageProps{
  user_bets: UserBetProps[]
}

//Tela do competidor
export default function ProfileUserPage() {

  useContext(AuthContext)

  const [profile, setProfile] = useState<UserData | null >(null)
  const [user_bets, setUserBets] = useState<UserBetProps[] >([])
  const [loading, setLoading] = useState<boolean>(true)

  const params = useParams<{id: string}>()
  const { id } = params

  useEffect(() => {
      api.get(`/users/profile/${id}`, { withCredentials: true })
      .then((res) => {
        setProfile(res.data.user)

        api.get(`/bets/user/${id}`, { withCredentials: true })
        .then((res) => {
          setUserBets(res.data)
        })
      })
      .finally(()=>{
        setLoading(false)
      })  
  }, [])

  if(loading || !profile){
    return null
  }
  
  return (
      <div className="flex flex-col h-screen bg-gray-100">
        <div>
          <Header />
        </div>
        <div className="flex justify-center items-center h-screen ">
          <ProfilePage  
            profile={profile}
            bets={user_bets}
          />
        </div>
      </div>
  );
}
