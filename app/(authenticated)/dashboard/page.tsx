"use client"

import { BetsList } from "@/components/BetsList";
import { Header } from "@/components/Header";
import { PageCarroussel } from "@/components/PageCarroussel";
import { api } from "@/services/api";
import { useEffect, useState } from "react";

interface EventProps{
  id:  string,
  name:  string,
  banner:  string,
}

interface CompetitorProps{
  id:  string,
  name:  string,
  profile_url:  string,
}

interface DashboardBetProps{
  id: string,
  points: string,
  bets:{
    name:string,
  }[],
  event:{
    id: string,
    name:string,
    ends_at: string,
  },
}

export default function Dashboard() {

  const [events, setEvents] = useState<EventProps[]>([])
  const [competitors, setCompetitors] = useState<CompetitorProps[]>([])
  const [bets, setBets] = useState<DashboardBetProps[]>([])
  const [isloading, setIsLoading] = useState<boolean>(true)


  useEffect(()=>{
    api.get(`/events`, { withCredentials: true })
    .then((res) => {
      setEvents(res.data)

      api.get(`/competitors`, { withCredentials: true })
      .then((res) => {
        setCompetitors(res.data)  
        
        api.get(`/bets`, { withCredentials: true })
        .then((res) => {
          setBets(res.data)  
        })
      
      })
    })
    .finally(()=>{
      setIsLoading(false)
    })
  },[])

  if(isloading){
    return null
  }

  return (
    <>
      <title>BUBet | Dashboard</title>
      <meta name="dashboard" content="Faça sua aposta!"/>

      <div className="flex flex-col h-screen justify-between bg-gray-300">
        <div>
          <Header />
        </div>
        <PageCarroussel competitors={competitors} events={events}/>
        <BetsList bets={bets}/>
      </div>
    </>
  );
}