"use client"

import { Header } from "@/components/Header";
import { RankingEntry, RankingPage } from "@/components/RankingPage";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useContext, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";


//Tela do ranking geral
export default function RankingUserPage() {

  const { user } = useContext(AuthContext)
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [userRanking, setUserRanking] = useState<RankingEntry | null >(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!user) return

    let isActive = true
    setLoading(true)
    setError(false)

    api.get<RankingEntry[]>(`/users/ranking`, { withCredentials: true })
      .then(({ data }) => {
        if (!isActive) return
        setRanking(data)
        setUserRanking(data.find((entry) => entry.id === user.id) ?? null)
      })
      .catch((requestError) => {
        console.error("Não foi possível carregar o ranking.", requestError)
        if (isActive) setError(true)
      })
      .finally(() => {
        if (isActive) setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [user])

  if (!user) {
    return null
  }

  const tit = `Ranking Geral`
  return (
    <>
      <title>{tit}</title>
      <meta key="ranking-page" name="ranking" content="Ranking Geral!"/>
      <div className="min-h-screen bg-slate-50">
        <Header />
        {loading ? (
          <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600" role="status">
              <LoaderCircle className="h-5 w-5 animate-spin text-blue-800" aria-hidden="true" />
              Carregando ranking...
            </div>
          </main>
        ) : error ? (
          <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center justify-center px-4 text-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h1 className="text-lg font-semibold text-slate-900">Não foi possível carregar o ranking</h1>
              <p className="mt-2 text-sm text-slate-600">Tente atualizar a página em instantes.</p>
            </div>
          </main>
        ) : (
          <RankingPage
            ranking={ranking}
            userRanking={userRanking}
          />
        )}
      </div>
    </>
  );
}
