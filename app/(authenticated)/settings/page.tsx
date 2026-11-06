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
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadSettings = async () => {
      try {
        const [competitorsResponse, profileResponse] = await Promise.all([
          api.get(`/competitors`, { withCredentials: true }),
          api.get(`/users/profile`, { withCredentials: true }),
        ])

        if (!isMounted) return

        setCompetitors(competitorsResponse.data)
        setFavoriteCompetitor(
          profileResponse.data.user?.favorite_competitor?.id ?? null
        )
      } catch {
        if (isMounted) {
          setLoadError('Não foi possível carregar as configurações.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void loadSettings()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return null
  }

  if (loadError) {
    return <p role="alert" className="p-6 text-center">{loadError}</p>
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
