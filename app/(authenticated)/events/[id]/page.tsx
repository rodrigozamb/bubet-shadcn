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
  created_at: string,
  bets: {
      name: string
  }[],
  estandartes:{
      competitor:{
          name: string
      },
      bannerType:{
          name: string
      }
  }[],
  points: string,
  cupons:{
    value: string
  } | null
}

interface defaultBet{
  user:{
  
      id: string,
      name: string,
      profile_url: string,
      username: string
  }
  bets: {
      name: string
  }[],
  estandartes:{
    competitor:{
        name: string
    },
    bannerType:{
        name: string
    }
  }[],
  created_at: string,
  points: string,
  cupons:{
    value: string
  }
}

interface ResultProps{
  id: string,
  name: string,
  profile_url: string
  score: string,
  estandartes: {
    name: string
  }[]
}

interface EventResultProps{
  competitor: CompetitorProps,
  score: string,
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

interface CuponsProps{
  id: string,
  value: string,
  used_at:string,
  betId: string
}

export default function Home() {

  useContext(AuthContext)

  const [event, setEvent] = useState<EventData|null>(null)
  const [allBets, setAllBets] = useState<defaultBet[]>([])
  const [userBet, setUserBet] = useState<UserBetData | null >(null)
  const [results, setResults] = useState<ResultProps[]>([])
  const [cupons, setCupons] = useState<CuponsProps[]>([])
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
            const ranking = res.data.map((cmp: EventResultProps)=>{
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

                api.get(`/users/profile`,{withCredentials: true})
                .then((res)=>{
                  const cups = res.data.user.cupons.map((cp: CuponsProps)=>{
                    return {
                      id: cp.id,
                      value: cp.value,
                      betId: cp.betId,
                      used_at: cp.used_at
                    }
                  })
                  setCupons(cups)
                  
              })
              })
            })

          })
        })
      })

    })
    .finally(()=>{
      setIsLoading(false)
    })
  }, [id])

  if(isloading || !event){
    return null
  }
  const tit = `Evento | ${event.name}`

  return (
    <>

      <title>{tit}</title>
      <meta name="event" content="Conheça o evento!"/>
      
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:gap-8 lg:px-8">
          <InfoPanel
            name={event.name}
            date={event.date.split("T")[0].split("-").reverse().join("/")}
            local={event.local}
            event_id={event.id}
            time={`${event.starts_at.substring(11, 16)} - ${event.ends_at.substring(11, 16)}`}
            judges={event.judges}
          />
          <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(20rem,0.85fr)] xl:gap-8">
            <BetPanel
              results={results}
              cupons={cupons}
              allBets={allBets}
              userBet={userBet}
              competitors={competitors}
              estandartes={bannersTypes}
              event_active={new Date(event.starts_at) >= new Date()}
            />
            <aside className="flex min-w-0 flex-col gap-6">
              <Podium ranking={results} />
              <CompetitorsList competitors={competitors} />
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
