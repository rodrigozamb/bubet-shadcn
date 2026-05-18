/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */  

"use client"

import { Header } from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AlbumCard } from "@/components/AlbumCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Bounce, toast } from "react-toastify";
import { AxiosError } from "axios";

interface CardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  competitor: string | null;
  naipe: string
}

interface AlbumProps{
  name:string
  id:string
  event_id:string
}

export default function EventBookPage() {
  useContext(AuthContext)

  const router = useRouter()
  const params = useParams<{pack_id: string}>()
  const { pack_id } = params


  const [isloading, setIsLoading] = useState<boolean>(true)
  const [cards, setCards] = useState<CardProps[]>([])
  const [album,setAlbum] = useState<AlbumProps|null>(null)


  useEffect(() => {


    api.get(`/packs/album/${pack_id}`, {withCredentials: true})
        .then((res) => {
            setAlbum(res.data)

        })
        .finally(() => { setIsLoading(false) })
  }, [])  
  

  if(isloading ){
    return null
  }


const handleOpenPack = async () => {
    

    try{
      await api.post(`/cards/${pack_id}/open`, {withCredentials: true})
      .then((res) => {
            setCards(res.data)
        })

    } catch(error: any){
      if (error instanceof AxiosError) {      
        toast.error(error.response?.data?.message || 'Erro desconhecido', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
      })}
      else if (error instanceof Error) {
        toast.error(error.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        })
      } else {
        toast.error('Erro Desconhecido', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        })
      }
    }
  }

  const tit = `Abrir Pacote de Figurinhas`


  return (
    <>

      <title>{tit}</title>
      <meta name="event" content="Conheça o evento!"/>
      
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>
        

        <div className="flex flex-col justify-center items-center align-middle">
            
            <div className="flex flex-col text-center mt-10">
                <p className="text-xl font-semibold" >Pacote de figurinhas</p>
                <p className="text-2xl font-bold my-3">
                    {album?.name}
                </p>
                <p className="text-gray-500">Clique no pacote ou no botão para abrir</p>
            </div>
      
            <div className={`transition-all duration-500 ease-in-out ${cards.length === 0 ? 'max-h-[1200px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-5 overflow-hidden pointer-events-none'}`}>
              <Image
                src={`https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/24171c2e-0744-4582-8da1-f7d1bb48f114/pack.png`}
                alt={'Pacote de Figurinhas'}
                width={220}
                height={220}
                className="object-contain mb-8 mt-25 animate-bounce cursor-pointer"
                onClick={ handleOpenPack }
              />

              <div className="flex justify-center align-middle items-center text-center ">
                <Button onClick={handleOpenPack} className="cursor-pointer w-52 h-12 text-md bg-gradient-to-r from-green-800 to-green-700 text-white text-xl font-semibold py-2 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-opacity duration-200 ">Abrir Pacote</Button>
              </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out ${cards.length > 0 ? 'max-h-[1200px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-5 overflow-hidden pointer-events-none'}`}>
              <div className="flex justify-center align-center items-center mt-8">
                {cards.map((card) => (
                    <AlbumCard
                        key={card.id}
                        instrument={card.naipe}
                        name={card.name}
                        competitor={card.competitor ?? "Desconhecido" }
                        backgroundImage={card.imageUrl}
                    />
                ))}
              </div>
              <div className="flex  justify-between px-50">
                <Button onClick={()=>{ router.push('/figurinhas') }} className="cursor-pointer w-52 h-12 text-md bg-gradient-to-r from-green-800 to-green-700 text-white text-xl font-semibold py-2 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-opacity duration-200 ">Voltar a coleção</Button>
                <Button onClick={()=>{ setCards([]) }} className="cursor-pointer w-52 h-12 text-md bg-gradient-to-r from-green-800 to-green-700 text-white text-xl font-semibold py-2 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-opacity duration-200 ">Abrir outro Pacote</Button>
                <Button onClick={()=>{ router.push(`/events/${album?.event_id}/album`) }} className="cursor-pointer w-52 h-12 text-md bg-gradient-to-r from-orange-800 to-orange-700 text-white text-xl font-semibold py-2 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-opacity duration-200 ">Ver Album</Button>
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
