"use client"

import { useCallback, useEffect, useState } from "react"
import { LoaderCircle, RefreshCw, UserRoundX } from "lucide-react"
import { Header } from "@/components/Header"
import { JudgePage } from "@/components/JudgePage"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { useParams } from "next/navigation"

interface JudgeData {
    id: string
    first_name: string
    last_name: string
    nickname: string
    description: string
    avatar: string
    events: {
        id: string
        name: string
        banner: string
    }[]
}

export default function JudgesPage() {
    const [judge, setJudge] = useState<JudgeData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [reloadKey, setReloadKey] = useState(0)
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        let isActive = true

        setLoading(true)
        setError("")
        setJudge(null)

        api.get<JudgeData>(`/judges/${id}`, { withCredentials: true })
            .then((response) => {
                if (isActive) setJudge(response.data)
            })
            .catch((requestError: unknown) => {
                console.error("Não foi possível carregar o perfil do jurado.", requestError)
                if (isActive) setError("Não foi possível carregar este perfil. Verifique sua conexão e tente novamente.")
            })
            .finally(() => {
                if (isActive) setLoading(false)
            })

        return () => {
            isActive = false
        }
    }, [id, reloadKey])

    const retry = useCallback(() => setReloadKey((current) => current + 1), [])

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
                <title>{judge ? `Jurado | ${judge.nickname}` : "Perfil do jurado"}</title>
                <meta name="description" content="Conheça o perfil e os eventos julgados por este jurado." />

                {loading ? (
                    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-600" role="status">
                        <LoaderCircle aria-hidden="true" className="size-8 animate-spin text-blue-900" />
                        <p>Carregando perfil do jurado...</p>
                    </div>
                ) : error ? (
                    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center" role="alert">
                        <p className="max-w-md text-slate-700">{error}</p>
                        <Button onClick={retry} className="mt-4 gap-2 bg-blue-900 text-white hover:bg-blue-800">
                            <RefreshCw aria-hidden="true" className="size-4" />
                            Tentar novamente
                        </Button>
                    </div>
                ) : judge ? (
                    <JudgePage judge={judge} />
                ) : (
                    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
                        <div className="flex size-14 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                            <UserRoundX aria-hidden="true" className="size-7" />
                        </div>
                        <h1 className="mt-4 text-xl font-bold text-slate-900">Jurado não encontrado</h1>
                        <p className="mt-1 text-slate-600">Este perfil pode ter sido removido ou o endereço está incorreto.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
