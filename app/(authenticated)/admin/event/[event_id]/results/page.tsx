/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
// TELA DE LOGIN

import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import AvatarIcon from "@/components/AvatarIcon";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Bounce, toast } from "react-toastify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Check, Medal, Search, Send, Sparkles, Trophy, Users } from "lucide-react";
import { Header } from "@/components/Header";

interface EstandarteProps{
    id: string
    name: string
}

interface CompetitorRanking{
    id:string,
    name: string,
    profile_url: string,
    score: string
}

export default function AdminCreateEventPage({}) {


  const params = useParams<{event_id: string}>()
  const {event_id} = params
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  
  const [event_name, setEventName] = useState("")
  
  const [ranking, setRanking] = useState<CompetitorRanking[]>([]);
  const [searchCompetitorRankingTerm, setSearchCompetitorRankingTerm] = useState("");    
  const searchCompetitorsRanking = ranking.filter((item) =>
    item.name.toLowerCase().includes(searchCompetitorRankingTerm.toLowerCase())
  )

  const initial = Object.fromEntries(
    searchCompetitorsRanking.map((est) => [est.id, undefined as string | undefined])
  );
  const [selections, setSelections] = useState<Record<string, string | undefined>>(initial);

  const handleChange = (bannerTypeId: string, competitorId: string) => {
    setSelections((prev) => ({
      ...prev,
      [bannerTypeId]: competitorId,
    }));
  };



  const [estandartes, setEstandartes] = useState<EstandarteProps[]>([]);

  const handleScoreChange = (id: string, newScore: string) => {
    setRanking(prev =>
      prev.map(c => 
        c.id === id
          ? { ...c, score: newScore }
          : c
      )
    );
  };

  const handleCreate = async () => {
    
    const grouped = Object.entries(selections).reduce<Record<string, {id: string}[]>>((acc, [key, value]) => {
      if (!acc[value!]) {
        acc[value!] = [];
      }
      acc[value!].push( { id: key } );
      return acc;
    }, {});
    const resultListParam = searchCompetitorsRanking.sort((a, b) => Number(b.score) - Number(a.score)).map((cp)=>{
      return {id: cp.id, score: cp.score , banners: grouped[cp.id] ? grouped[cp.id] : [] }
    })
    const resultReq = {
      event_id,
      result: resultListParam
    }
    toast.info("Resultado está sendo criado, aguarde um minuto...", {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce,
    })
  
    try{
      const newResult = await api.post(`/results/all`,resultReq)
      if(newResult.status != 201){
       console.log('DEU ERRO NA CRIAÇÃO DO RESULTADO DO EVENTO') 
      }else{
        
        toast.success('Resultado criado com sucesso!!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        })


      router.push(`/events/${event_id}`)
      }
      
    }catch(error:any){
      if (error instanceof Error) {
        toast.error(error.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        })
      } else {
        toast.error('Erro Desconhecido', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        })
      }
    }
  }


  const handleGivePoints = async () => {


    try{
      await api.post(`/admin/applypoints`,{ event_id: event_id  })
      toast.success('Pontos gerados com sucesso!!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        })
    }catch(error){
      if (error instanceof Error) {
        toast.error(error.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        })
      } else {
        toast.error('Erro Desconhecido', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        })
      }
    }

  }
    

  useEffect(() => {

    const token = Cookies.get('bubet.token')
    const base64Url = token!.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    const tok =  JSON.parse(window.atob(base64))

    if (tok.role!="ADMIN") {
      // Not logged in → send to login
      router.replace('/dashboard')
    } else {
      // Logged in → render children
      setChecked(true)
    }

    api.get(`/events/${event_id}`, { withCredentials: true })
        .then((enventRequestResult) => {
            setEventName(enventRequestResult.data.name)
            const r = enventRequestResult.data.competitors.map((comp: { id: any; name: any; profile_url: any; }) =>{
                return {
                    id: comp.id,
                    name: comp.name,
                    profile_url: comp.profile_url,
                    score: "0"
                }
            })
            setRanking(r)
            setEstandartes(enventRequestResult.data.event_banner_types)
            console.log(enventRequestResult.data.event_banner_types)
        })

  }, [router])
  
  if (!checked) {
    return null  // or a loading spinner
  }

  return (
    <>
      <title>BUBet | Resultados</title>
      <Header />
      <main className="min-h-screen bg-blue-950 px-4 py-8 text-slate-900 sm:px-6 lg:py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 px-6 py-8 text-white shadow-lg sm:px-9 sm:py-10">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-200">
              <Trophy size={17} aria-hidden="true" />
              <span>Área administrativa · Resultados</span>
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Configurar resultado
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
              {event_name ? `Registre as pontuações e os estandartes de ${event_name}.` : "Registre as pontuações e os estandartes do evento."}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-blue-50 ring-1 ring-white/15">
                <Users size={15} aria-hidden="true" />
                {ranking.length} competidor{ranking.length === 1 ? "" : "es"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-blue-50 ring-1 ring-white/15">
                <Award size={15} aria-hidden="true" />
                {estandartes.length} estandarte{estandartes.length === 1 ? "" : "s"}
              </span>
            </div>
          </header>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Users size={21} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Pontuação dos competidores</h2>
                  <p className="mt-1 text-sm text-slate-500">Informe os pontos de cada participante.</p>
                </div>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <Input
                  className="h-10 border-slate-200 bg-slate-50 pl-9 text-slate-900 placeholder:text-slate-400"
                  type="search"
                  aria-label="Buscar competidor"
                  placeholder="Buscar competidor..."
                  value={searchCompetitorRankingTerm}
                  onChange={(e) => setSearchCompetitorRankingTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50/80 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
              <span>Competidor</span>
              <span className="pr-1">Pontos</span>
            </div>
            <div className="max-h-[28rem] space-y-2 overflow-y-auto p-3 sm:p-4">
              {searchCompetitorsRanking.length > 0 ? searchCompetitorsRanking.map((competitor) => (
                <div
                  key={competitor.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-colors hover:border-blue-100 hover:bg-blue-50/30 sm:px-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <AvatarIcon name={competitor.name} size={42} src={competitor.profile_url} />
                    <span className="truncate text-sm font-medium text-slate-800">{competitor.name}</span>
                  </div>
                  <label className="flex shrink-0 items-center gap-2 text-sm text-slate-500">
                    <span className="hidden sm:inline">Pontos</span>
                    <Input
                      className="h-10 w-20 border-slate-200 bg-slate-50 text-center font-semibold text-slate-900 focus-visible:bg-white"
                      type="text"
                      aria-label={`Pontos de ${competitor.name}`}
                      value={competitor.score}
                      onChange={e => handleScoreChange(competitor.id, e.target.value)}
                    />
                  </label>
                </div>
              )) : (
                <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
                  <Search size={20} className="mx-auto text-slate-400" aria-hidden="true" />
                  <p className="mt-2 text-sm font-medium text-slate-700">Nenhum competidor encontrado</p>
                  <p className="mt-1 text-sm text-slate-500">Tente buscar por outro nome.</p>
                </div>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 p-5 sm:px-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Medal size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Estandartes</h2>
                <p className="mt-1 text-sm text-slate-500">Escolha um competidor para cada reconhecimento.</p>
              </div>
              <span className="ml-auto shrink-0 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
                {Object.values(selections).filter(Boolean).length}/{estandartes.length}
              </span>
            </div>

            {estandartes.length > 0 ? (
              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
                {estandartes.map((est) => (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4" key={est.id}>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <Award size={16} className="shrink-0 text-amber-600" aria-hidden="true" />
                      {est.name}
                    </label>
                    <Select
                      value={selections[est.id]}
                      onValueChange={(v) => handleChange(est.id, v)}
                    >
                      <SelectTrigger aria-label={`Selecionar competidor para ${est.name}`} className="h-10 border-slate-200 bg-white">
                        <SelectValue placeholder="Selecionar competidor" />
                      </SelectTrigger>
                      <SelectContent>
                        {searchCompetitorsRanking.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selections[est.id] && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                        <Check size={14} aria-hidden="true" />
                        Competidor selecionado
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-slate-500">
                Este evento não possui estandartes para configurar.
              </div>
            )}
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3 px-1">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Sparkles size={18} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Pronto para concluir?</h2>
                <p className="mt-1 text-sm text-slate-500">Salve o resultado ou entregue os pontos aos participantes.</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="h-11 cursor-pointer bg-blue-900 px-5 font-semibold text-white hover:bg-blue-800"
                onClick={handleCreate}
              >
                <Check size={17} aria-hidden="true" />
                Atualizar Evento
              </Button>
              <Button
                className="h-11 cursor-pointer bg-orange-500 px-5 font-semibold text-white hover:bg-orange-600"
                onClick={handleGivePoints}
              >
                <Send size={17} aria-hidden="true" />
                Entregar Pontos
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}