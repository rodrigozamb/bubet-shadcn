/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { EventBook } from "@/components/book/EventBook";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import Cookies from 'js-cookie'
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";



interface albumProps{
  id: string,
  name: string,
  description: string,
  available: boolean,
  pages:{
    type:string,
    description:string,
    bg_image: string | null ,
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

  const token = Cookies.get('bubet.token')
  const base64Url = token!.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  const tok =  JSON.parse(window.atob(base64))

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

  if(!album || (album.available === false && tok.role!="ADMIN" )){
    return (
          <>

      <title>{"Album de Figurinhas"}</title>
      <meta name="event" content="Conheça o evento!"/>
      
      <div className="flex min-h-dvh flex-col">
        <div className="shrink-0">
          <Header />
        </div>

        <main className="flex flex-1 flex-col items-center px-4 py-8 text-center sm:py-12">
          <div className="flex flex-col">
            <p className="font-bold">Ainda não existe um Álbum de Figurinhas para este evento. Por favor tente outro evento.</p>
          </div>

          <div className="mt-6 flex w-full max-w-xs justify-center sm:max-w-none">
            <Button onClick={()=>{ router.push(`/events/${id}`) }} className="h-12 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-blue-800 to-blue-700 px-6 py-2 text-xl font-semibold text-white shadow-lg transition-opacity duration-200 hover:opacity-90 sm:w-52">Voltar ao Evento</Button>
          </div>
        </main>
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
    (sum, page) => sum + (page.cards?.filter((c) => c.obtained_at === 'Desconhecido').length || 0),
    0,
  ) ?? 0
  const unknownHCards = album?.pages?.reduce(
    (sum, page) => sum + (page.horizontal_cards?.filter((c) => c.obtained_at === 'Desconhecido').length || 0),
    0,
  ) ?? 0
  return (
    <>

      <title>{tit}</title>
      <meta name="event" content="Conheça o evento!"/>
      
      <div className="flex min-h-dvh flex-col">
        <div className="shrink-0">
          <Header />
        </div>

        <main className="flex flex-1 flex-col items-center px-2 pb-6 sm:px-4 sm:pb-8">
          <div className="my-4 flex flex-col text-center sm:my-5">
            <p className="max-w-full break-words text-lg font-bold sm:text-xl">{tit}</p>
            <p className="font-medium text-gray-500">{(totalCards+totalHCards)-(unknownCards+unknownHCards)}/{(totalCards+totalHCards)}</p>
          </div>

          <div className="flex w-full flex-1 justify-center">
            <div className="w-full max-w-[1000px]">
              <EventBook albumId={album.id} items={album.pages || []}/>
            </div>
          </div>

          <div className="mt-5 flex w-full max-w-xs flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
            <Button onClick={()=>{ router.push(`/events/${id}`) }} className="h-12 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-blue-800 to-blue-700 px-6 py-2 text-xl font-semibold text-white shadow-lg transition-opacity duration-200 hover:opacity-90 sm:w-52">Voltar ao Evento</Button>
            <Button onClick={()=>{ router.push('/figurinhas') }} className="h-12 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-green-800 to-green-700 px-6 py-2 text-xl font-semibold text-white shadow-lg transition-opacity duration-200 hover:opacity-90 sm:w-52">Comprar Pacotes</Button>
          </div>
        </main>
      </div>
    </>
  );
}
