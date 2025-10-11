"use client"

import { Header } from "@/components/Header";
import { RankingPage } from "@/components/RankingPage";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useContext, useEffect, useState } from "react";


interface RankingData{
  id: string
  name:string
  username: string
  profile_url:string
  position: number
  points: number
}



//Tela do ranking geral
export default function RankingUserPage() {

  const { user } = useContext(AuthContext)
  const [ranking, setRanking] = useState<RankingData[]>([])
  const [userRanking, setUserRanking] = useState<RankingData | null >(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
      api.get(`/users/ranking`, { withCredentials: true })
      .then((res) => {
        setRanking(res.data)
        setUserRanking(res.data.filter((data: RankingData) => data.id == user!.id)[0]) 
      })
      .finally(()=>{
        setLoading(false)
      })  
  }, [])

  if(loading || !ranking || !user){
    return null
  }
  const tit = `Ranking Geral`
  return (
    <>
      <title>{tit}</title>
      <meta key="ranking-page" name="ranking" content="Ranking Geral!"/>
      <div className="flex flex-col h-screen bg-gray-100">
        <div>
          <Header />
        </div>
        <div className="flex justify-center items-center h-screen ">
          <RankingPage
            ranking={ ranking }
            userRanking = { userRanking! }
          />
        </div>
      </div>
    </>
  );
}
