"use client"

import { Header } from "@/components/Header";
import { UserSettingsConfigPage } from "@/components/UserSettingsPage";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useContext, useEffect, useState } from "react";


interface CompetitorData{
  id: string
  name:string
  profile_url:string
}

export default function UserSettingsPage() {

  useContext(AuthContext)

  const tit = `Configurações`

  
  const [competitors, setCompetitors] = useState<CompetitorData[]>([])
  const [favoriteCompetitor, setFavoriteCompetitor] = useState<string | null >(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
      api.get(`/competitors`, { withCredentials: true })
      .then((res) => {
        setCompetitors(res.data)
      
        api.get(`/users/profile`, { withCredentials: true })
        .then((res) => {
          setFavoriteCompetitor(res.data.user.favorite_competitor.id)
        })
      })
      .finally(()=>{
        setLoading(false)
      })  
  }, [])

  if(loading || !competitors){
    return null
  }

  return (
    <>
      <title>{tit}</title>
      <meta key="profile-page" name="profile" content="Conheça essa pessoa!"/>
      
      <div className="flex flex-col h-screen bg-gray-100">
        <div>
          <Header />
        </div>
        <div className="flex justify-center items-center h-screen ">
          <UserSettingsConfigPage competitors={competitors} favoriteCompetitor={favoriteCompetitor}/>
        </div>
      </div>
    </>
  );
}
