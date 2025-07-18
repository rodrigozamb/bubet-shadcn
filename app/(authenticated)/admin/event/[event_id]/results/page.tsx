"use client"
// TELA DE LOGIN

import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { useParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AvatarIcon from "@/components/AvatarIcon";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Bounce, toast } from "react-toastify";
import { SelectCompetitor } from "@/components/SelectCompetitor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Competitor{
  id: string,
  name: string,
  profile_url: string,
}

interface Judge{
    id: string,
    nickname: string,
    avatar: string
}

interface Estandarte{
    id: string,
    name: string,
    description: string
}

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
      const points = await api.post(`/admin/applypoints`,{ event_id: event_id  })
      console.log(points)
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
        <div className="flex flex-col justify-center items-center justify-begin bg-blue-900 w-screen h-300">
            <title>BUBet | ADMIN</title>

            <div className="flex flex-col items-center bg-amber-100 w-350 py-5">
                <span className="font-medium text-2xl my-4">Crie um resultado para {event_name}</span>



                <div className="flex justify-center mb-5"> 
                    {/* COMPETIDORES */}
                    <div className="flex ">
                        <div className="w-165 h-90 overflow-hidden shadow rounded-2xl mx-2">
                        {/* Header */}
                            <div className="flex justify-between rounded-t-2xl py-2 bg-blue-900 text-white">
                                <span className="content-center ml-5 text-mk font-bold">Competidores</span>
                            </div>
                            <div className="flex justify-center py-2 bg-blue-900">
                                <Input className="w-150  bg-amber-50" type="search" placeholder="Pesquise aqui...." value={searchCompetitorRankingTerm} onChange={(e) => setSearchCompetitorRankingTerm(e.target.value)}/>         
                            </div>
                        
                            <div className="flex justify-center">
                                <div className="w-165 h-90 overflow-hidden bg-gray-300 rounded p-5 shadow">
                                    
                                    <div className="space-y-2 h-64 overflow-auto">
                                    {
                                        searchCompetitorsRanking.map((competitor, i) => (
                                            <div 
                                                key={i} 
                                                className="flex p-2 justify-between bg-gray-100 rounded-xl cursor-pointer"
                                            >
                                                <AvatarIcon name={competitor.name} size={40} src={competitor.profile_url}  className="mx-2"  />
                                                <span className="content-center truncate">
                                                    {competitor.name}
                                                </span>
                                                <div className="flex justify-center text-center">
                                                    <span className="mr-3 items-center">Pontos</span>
                                                    <Input className="w-20  bg-amber-50" type="text" value={competitor.score} onChange={e => handleScoreChange(competitor.id, e.target.value)}  />
                                                
                                                </div>  
                                            </div>
                                        ))
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>


                </div>

                {/* ESTANDARTES */}
                
                <div className="flex flex-col justify-center w-200 ml-15">
                
                <div className="text-center">
                    <div className="text-xl font-semibold">Estandartes</div>
                </div>
                
                <div className="grid grid-cols-3 my-5 ">

                    {
                    estandartes.map((est,idx)=>(
                        <div className="flex flex-col items-center text-center py-3 my-3 mx-2 border-2 bg-gray-100 rounded-2xl" key={idx}>
                        <div className="text-md font-medium py-2">{est.name}</div>
                          <Select 
                            key={est.id}
                            value={selections[est.id]}
                            onValueChange={(v) => handleChange(est.id, v)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select competitor" />
                              </SelectTrigger>

                              <SelectContent>
                                {searchCompetitorsRanking.map(c => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                        </div>
                    ))
                    }

                </div>

                </div>


                <Button className="w-65 h-20 cursor-pointer bg-yellow-500 hover:bg-yellow-600 font-extrabold text-3xl"
                    onClick={handleCreate}
                >
                Atualizar Evento
                </Button>
                <Button className="w-65 h-20 cursor-pointer bg-orange-500 hover:bg-orange-600 font-extrabold text-3xl my-5"
                    onClick={handleGivePoints}
                >
                Entregar Pontos
                </Button>
            </div>
        </div>
      </>
    );
  }