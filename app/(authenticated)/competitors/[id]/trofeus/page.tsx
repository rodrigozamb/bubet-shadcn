"use client"

import { CompetitorTrophyShelf } from "@/components/CompetitorTrophyShelf";
import { Header } from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import type { Prize } from "@/components/TrophyModelGallery";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";


interface UserData{
  id: string
  name:string
  description: string
  created_at: string
  profile_url:string
  socials:{
    type: string
    name: string
  }[]
} 

//Tela do competidor
export default function ProfilePage() {

  useContext(AuthContext)

  const [competitor, setCompetitor] = useState<UserData | null >(null)
  const [prizes, setPrizes] = useState<Prize[] | null >(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [loadError, setLoadError] = useState(false)

  const params = useParams<{id: string}>()
  const { id } = params

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const [competitorResponse, prizesResponse] = await Promise.all([
          api.get(`/competitors/${id}`, { withCredentials: true }),
          api.get<{ premios: Prize[] }>(`/premios/${id}`, { withCredentials: true }),
        ])

        if (active) {
          setCompetitor(competitorResponse.data)
          setPrizes(prizesResponse.data.premios)
        }
      } catch (error) {
        console.error("Não foi possível carregar os prêmios do competidor.", error)
        if (active) setLoadError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadData()
    return () => {
      active = false
    }
  }, [id])

  if(loading){
    return null
  }
  if (loadError || !competitor || !prizes) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Header />
        <main className="flex-1 bg-[#f2f0e8] p-6">
          <p role="alert" className="text-center text-stone-700">
            Não foi possível carregar os prêmios deste competidor.
          </p>
        </main>
      </div>
    )
  }

  const tit = `Sala de Troféus | ${competitor.name}`

  return (
    <>
      
      <title>{tit}</title>
      <meta name="competitor" content="Conheça o competidor!"/>

      <div className="flex flex-col h-screen bg-gray-100">
        <div>
          <Header />
        </div>
        <main className="min-h-[calc(100vh-4rem)] flex-1 overflow-y-auto bg-[#f2f0e8]">
          <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-8">
            <Link
              href={`/competitors/${id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-[#4e3525] bg-[#64452f] px-4 py-2.5 text-sm font-semibold text-[#fffaf0] shadow-[0_3px_0_#4e3525] transition hover:-translate-y-0.5 hover:bg-[#805638] hover:shadow-[0_4px_0_#4e3525] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 active:translate-y-0 active:shadow-[0_2px_0_#4e3525]"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Voltar
            </Link>
          </div>
          <CompetitorTrophyShelf competitorName={competitor.name} prizes={prizes} />
        </main>
      </div>
    </>
  );
}
