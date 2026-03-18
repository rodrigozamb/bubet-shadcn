"use client"

import { Header } from "@/components/Header";
import { GuessPanel } from "@/components/GuessPanel";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GuessOptionsChart } from "@/components/GuessOptionsChart";


interface GuessEventData{
    id: string,
    name: string,
    description: string,
    date: string,
    banner: string,
    ends_at: string,
    created_at: string,
    points: string,
    guess_options: string[]
}

interface UserGuessBetData{
  created_at: string,
  guess: string,
  custom_guess: string | null,
  points: string,
}


interface ResultProps{
  id: string,
  name: string,
  guess: string,
  custom_guess: string | null,
  profile_url: string
  points: string,
  competitor: CompetitorProps,

}

interface CompetitorProps{
  id: string,
  name: string,
  profile_url: string,
  description: string
}

export default function Home() {

  useContext(AuthContext)

  const [event, setEvent] = useState<GuessEventData|null>(null)
  const [userGuess, setUserGuess] = useState<UserGuessBetData|null>(null)
  const [results, setResults] = useState<ResultProps[]>([])

  const [isloading, setIsLoading] = useState<boolean>(true)

  const params = useParams<{id: string}>()
  const { id } = params

  useEffect(() => {
    api.get(`/guess-events/${id}`, { withCredentials: true })
    .then((res) => {
      setEvent(res.data)
      console.log(res.data)
      api.get(`/guess-bets/${id}/me`, { withCredentials: true })
        .then((res2) => {
          setUserGuess(res2.data)


          api.get(`/guess-bets/${id}`, { withCredentials: true })
          .then((res3) => {
            setResults(res3.data)

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
  const tit = `Palpite | ${event.name}`
  
  return (
    <>

      <title>{tit}</title>
      <meta name="palpite" content="Conheça o palpite!"/>
      
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>
        <div className="flex flex-col items-center justify-center align-middle h-full">
          
          {
            userGuess ? 

              <div className="flex flex-col justify-center items-center">
                <p className="flex justify-center text-center font-semibold text-3xl w-150 mb-5" >{event.description}</p>

                <div className=" text-center p-3 mb-2 rounded-2xl bg-blue-100 border-1 border-[#000000]">
                    <p className="text-xl font-bold" >{userGuess.guess}</p>
                    <p className="text-sm text-gray-500">Seu palpite</p>
                </div>
                <div className="flex text-center align-middle justify-center items-center">
                  <p>Acerte o palpite e ganhe</p>
                  <p className="mx-3 text-orange-400 font-bold text-2xl"  >{event.points}</p>
                  <p>pontos</p>
                </div>

              </div>
            :
              <div>
                <GuessPanel description={event.description} options={event.guess_options} />
              </div>
            
          }
          

          <div className="bg-gray-200 h-0.75 w-300 rounded-3xl my-5"></div>

          <div className="flex flex-col justify-center items-center h-100 w-300 mt-5 " >
            <p className="font-bold text-2xl mb-3" >🌡️ Palpitômetro 🌡️</p>
            <GuessOptionsChart options={event.guess_options} results={results} />

          </div>
        </div>
      </div>
    </>
  );
}
