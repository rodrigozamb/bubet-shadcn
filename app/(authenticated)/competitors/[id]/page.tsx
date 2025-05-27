"use client"

import { CompetitorPage } from "@/components/CompetitorPage";
import { Header } from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import axios from "axios";
import type { Metadata } from "next";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";


interface UserData{
  id: string
  name:string
  description: string
  created_at: string
  profile_url:string
} 

interface StatsData{
  first: number
  second: number
  third: number
  others: number
  all: number
} 

//Tela do competidor
export default function ProfilePage() {

  useContext(AuthContext)

  const [competitor, setCompetitor] = useState<UserData | null >(null)
  const [stats, setStats] = useState<StatsData | null >(null)
  const [loading, setLoading] = useState<boolean>(true)

  const params = useParams<{id: string}>()
  const { id } = params

  useEffect(() => {

      api.get(`/competitors/${id}`, { withCredentials: true })
      .then((res) => {
        setCompetitor(res.data)
        api.get(`/competitors/stats/${id}`, { withCredentials: true })
        .then((res) => {
          setStats(res.data)
        }).then(()=>{
          setLoading(false)
        })
      })  
  }, [])

  if(loading || !competitor){
    return null
  }
  const tit = `Competidor | ${competitor.name}`
  return (
    <>
      
      <title>{tit}</title>
      <meta name="competitor" content="Conheça o competidor!"/>

      <div className="flex flex-col h-screen bg-gray-100">
        <div>
          <Header />
        </div>
        <div className="flex h-screen ">
          <CompetitorPage 
            competitor={ 
              {
                name:competitor && competitor.name, 
                avatar:competitor.profile_url,
                description:competitor.description
              } 
            }
            
            stats={
              {
                first: stats!.first,
                second: stats!.second,
                third: stats!.third,
                others: stats!.others
              }
            }
          
          />
        </div>
      </div>
    </>
  );
}
