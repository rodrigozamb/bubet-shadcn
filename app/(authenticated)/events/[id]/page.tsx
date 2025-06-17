"use client"

import { BetPanel } from "@/components/BetPanel";
import { CompetitorsList } from "@/components/CompetitorsList";
import { Header } from "@/components/Header";
import { InfoPanel } from "@/components/InfoPanel";
import { Podium } from "@/components/Podium";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";


interface EventData{
    id: string,
    name: string,
    description: string,
    date: string,
    banner: string,
    starts_at: string,
    ends_at: string,
    created_at: string,
    local: string,
    judges:{
      id: string,
      nickname: string,
      avatar: string
    }[]
}

interface UserBetData{
  bets: [{
    name: string
  }],
  points: string,
  created_at: string
}

interface defaultBet{
  user:{
  
      id: string,
      name: string,
      profile_url: string,
      username: string
  }
  bets: [{
      name: string
  }],
  created_at: string,
  points: string
}

interface ResultProps{
  id: string,
  name: string,
  profile_url: string
  score: string,
  competitor: CompetitorProps,
  estandartes: {
    name: string
  }[]
}

interface CompetitorProps{
  id: string,
  name: string,
  profile_url: string,
  description: string
}

interface BannersTypesProps{
  id: string,
  name: string
}

export default function Home() {

  useContext(AuthContext)

  const [event, setEvent] = useState<EventData|null>(null)
  const [allBets, setAllBets] = useState<defaultBet[]>([])
  const [userBet, setUserBet] = useState<UserBetData|null>(null)
  const [results, setResults] = useState<ResultProps[]>([])
  const [competitors, setCompetitors] = useState<CompetitorProps[]>([])
  const [bannersTypes, setBannersTypes] = useState<BannersTypesProps[]>([])
  const [isloading, setIsLoading] = useState<boolean>(true)

  const params = useParams<{id: string}>()
  const { id } = params

  useEffect(() => {
    api.get(`/events/${id}`, { withCredentials: true })
    .then((res) => {
      setEvent(res.data)

      api.get(`/bets/${id}`, {withCredentials: true})
      .then((res)=>{
        setAllBets(res.data)
      
        api.get(`/bets/${id}/me`,{withCredentials: true})
        .then((res)=>{
          setUserBet(res.data)
          
          api.get(`/results/${id}`,{withCredentials: true})
          .then((res)=>{
            const ranking = res.data.map((cmp: ResultProps)=>{
              return {
                id: cmp.competitor.id,
                name:cmp.competitor.name,
                profile_url: cmp.competitor.profile_url,
                score: cmp.score,
                estandartes: cmp.estandartes
              }
            })
            setResults(ranking)

            api.get(`/events/${id}/competitors`,{withCredentials: true})
            .then((res)=>{
              setCompetitors(res.data)

              api.get(`/events/${id}/estandartes/types`,{withCredentials: true})
              .then((res)=>{
                setBannersTypes(res.data)

                /* api.get(``) */
              })
            })

          })
        })
      })

    })
    .finally(()=>{
      setIsLoading(false)
    })
  }, [])

  if(isloading || !event){
    return null
  }
  const tit = `Evento | ${event.name}`
  console.log(event)
  return (
    <>

      <title>{tit}</title>
      <meta name="event" content="Conheça o evento!"/>
      
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>
        <div className="flex items-center justify-center">
          <div>
              <InfoPanel 
                name={event!.name} 
                date={event!.date.split("T")[0].split("-")[2]+"/"+event!.date.split("T")[0].split("-")[1]+"/"+event!.date.split("T")[0].split("-")[0]} 
                local={event!.local}
                time={event!.starts_at.substring(11,16)+' - '+event!.ends_at.substring(11,16)}
                judges={event.judges}
              />
              <BetPanel allBets={ allBets } userBet={ userBet } competitors={ competitors } estandartes={ bannersTypes } />
          </div>
          <div className="flex mx-4 flex-col">
            <Podium ranking={results}/>
            <CompetitorsList competitors={ competitors }/>
          </div>
        </div>
      </div>
    </>
  );
}
