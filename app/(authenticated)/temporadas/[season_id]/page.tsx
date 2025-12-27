"use client"

import { Header } from "@/components/Header";
import { SeasonResultsPage } from "@/components/SeasonResultsPage";
import { api } from "@/services/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


//Tela do ranking geral
export default function SpecificSeasonPage() {

  const params = useParams<{season_id: string}>()
  const { season_id } = params

  const [season_name, setSeasonName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  
  useEffect(() => {
    api.get(`/temporadas/${season_id}`, { withCredentials: true })
    .then((res2)=>{ setSeasonName(res2.data.name) })
    .finally(()=>{
      setLoading(false)
    })  
  }, [])

  if(loading){
    return null
  }

  const tit = `${season_name}`
  return (
    <>
      <title>{tit}</title>
      <meta key="ranking-page" name="ranking" content="Ranking Geral!"/>
      <div className="flex flex-col h-screen bg-gray-100">
        <div>
          <Header />
        </div>
        <div className="flex justify-center items-center h-screen ">
          <SeasonResultsPage id={season_id} season_name={season_name}/>
        </div>
      </div>
    </>
  );
}
