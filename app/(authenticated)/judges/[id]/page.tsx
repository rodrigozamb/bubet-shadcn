"use client"

import { Header } from "@/components/Header";
import { JudgePage } from "@/components/JudgePage";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";


interface JudgeData{
  id: string
  first_name:string
  last_name:string
  nickname:string
  description: string
  avatar:string
  events: {
    id: string,
    name: string,
    banner: string
  }[]
} 


//Tela do Jurado
export default function JudgesPage() {

  useContext(AuthContext)

  const [judge, setJudge] = useState<JudgeData | null >(null)
  const [loading, setLoading] = useState<boolean>(true)

  const params = useParams<{id: string}>()
  const { id } = params

  useEffect(() => {
      api.get(`/judges/${id}`, { withCredentials: true })
      .then((res) => {
        setJudge(res.data)
      })
      .finally(()=>{
        setLoading(false)
      })  
  }, [])

  if(loading || !judge){
    return null
  }
  const tit = `Jurado | ${judge.nickname}`
  
  return (
    <>
      <title>{tit}</title>
      <meta key="judge-page" name="judge" content="Conheça esse jurado!"/>
      
      <div className="flex flex-col h-screen bg-gray-100">
        <div>
          <Header />
        </div>
        <div className="flex justify-center items-center h-screen ">
          <JudgePage
            judge={judge}
          />
        </div>
      </div>
    </>
  );
}
