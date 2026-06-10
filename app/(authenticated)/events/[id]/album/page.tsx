/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { EventBook } from "@/components/book/EventBook";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";



interface albumProps{
  id: string,
  name: string,
  description: string,
  pages:{
    type:string,
    description:string,
    cards: {
      name: string,
      naipe: string,
      image_url: string,
      obtained_at: string
      type: string
    }[]
    horizontal_cards: {
      name: string,
      naipe: string,
      image_url: string,
      obtained_at: string
      type: string
    }[]
  }[],
  event:{
    id:string,
    name: string
  }
  
}


export default function EventBookPage() {

  useContext(AuthContext)

  const router = useRouter()
  const [isloading, setIsLoading] = useState<boolean>(true)
  const [album, setAlbum] = useState<albumProps|null>(null)
  const params = useParams<{id: string}>()
  const { id } = params


  useEffect(() => {

    api.get(`/album/${id}`, {withCredentials: true})
        .then((res) => {
            setAlbum(res.data.album)
        })
        .catch((err) => {
            console.error("Erro ao buscar o álbum:", err)
        })
        .finally(() => { setIsLoading(false) })
  }, [])

  if(isloading ){
    return null
  }

  if(!album){
    return (
          <>

      <title>{"Album de Figurinhas"}</title>
      <meta name="event" content="Conheça o evento!"/>
      
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>

        <div className="flex justify-center my-5 align-center items-center mt-50 mb-20">
          <div className="flex flex-col text-center">
            <p className="font-bold ">Ainda não existe um Álbum de Figurinhas para este evento. Por favor tente outro evento.</p>
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <Button onClick={()=>{ router.push(`/events/${id}`) }} className="cursor-pointer w-52 h-12 text-md bg-gradient-to-r from-blue-800 to-blue-700 text-white text-xl font-semibold py-2 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-opacity duration-200 mr-8">Voltar ao Evento</Button>
        </div>
      </div>
    </>
    )
  }



  const tit = `${album.name || 'Album de Figurinhas'}`
  // Total de cards em todas as páginas do álbum
  const totalCards = album?.pages?.reduce((sum, page) => sum + (page.cards?.length || 0), 0) ?? 0
  const totalHCards = album?.pages?.reduce((sum, page) => sum + (page.horizontal_cards?.length || 0), 0) ?? 0

  // Quantas cards têm o nome "Cartinha Desconhecida"
  const unknownCards = album?.pages?.reduce(
    (sum, page) => sum + (page.cards?.filter((c) => c.name === 'Cartinha Desconhecida').length || 0),
    0,
  ) ?? 0
  const unknownHCards = album?.pages?.reduce(
    (sum, page) => sum + (page.horizontal_cards?.filter((c) => c.name === 'Cartinha Desconhecida').length || 0),
    0,
  ) ?? 0
  return (
    <>

      <title>{tit}</title>
      <meta name="event" content="Conheça o evento!"/>
      
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>

        <div className="flex justify-center my-5  ">
          <div className="flex flex-col text-center">
            <p className="text-xl font-bold" >{tit}</p>
            <p className="text-gray-500 font-medium">{(totalCards+totalHCards)-(unknownCards+unknownHCards)}/{(totalCards+totalHCards)}</p>
          </div>
        </div>
        
        
        <div className="flex justify-center align-center items-center">
            <EventBook  albumId={album!.id} items={album?.pages || []}/>
        </div>

        <div className="flex justify-center mt-5">
          <Button onClick={()=>{ router.push(`/events/${id}`) }} className="cursor-pointer w-52 h-12 text-md bg-gradient-to-r from-blue-800 to-blue-700 text-white text-xl font-semibold py-2 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-opacity duration-200 mr-8">Voltar ao Evento</Button>
          <Button onClick={()=>{ router.push('/figurinhas') }} className="cursor-pointer w-52 h-12 text-md bg-gradient-to-r from-green-800 to-green-700 text-white text-xl font-semibold py-2 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-opacity duration-200 ">Comprar Pacotes</Button>
        </div>
      </div>
    </>
  );
}
