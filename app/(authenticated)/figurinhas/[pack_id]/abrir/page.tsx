"use client"

import { Header } from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AlbumCard } from "@/components/AlbumCard";
import { Button } from "@/components/ui/button";

interface CardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  competitor: string | null;
  naipe: string
}

export default function EventBookPage() {
  useContext(AuthContext)

  const router = useRouter()
  const params = useParams<{pack_id: string}>()
  const { pack_id } = params

  console.log("Pack ID:", pack_id)  

  const [isloading, setIsLoading] = useState<boolean>(true)
  const [cards, setCards] = useState<CardProps[]>([])


  useEffect(() => {
    if (!pack_id) return;

    console.log("fetching cards")

    api.post(`/cards/${pack_id}/open`, {withCredentials: true})
        .then((res) => {
            setCards(res.data)
        })
        .finally(() => { setIsLoading(false) })
  }, [pack_id])  



  if(isloading ){
    return null
  }
  const tit = `Figurinhas`

  console.log(cards)

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
                    Album TIBUFU 2026
                </p>
            </div>

            <div className="flex justify-center align-center items-center">
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

            <div>
                <Button onClick={() => { router.push(`/figurinhas`) }} className="cursor-pointer w-52 h-12 text-md bg-gradient-to-r from-green-800 to-green-700 text-white text-xl font-semibold py-2 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-opacity duration-200 mr-15"> Voltar a Coleção</Button>
                <Button disabled onClick={() => { router.push(`/events/${pack_id}/book`) }} className="cursor-pointer w-52 h-12 text-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-semibold py-2 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-opacity duration-200"> Ver Album</Button>
            </div>
        </div>
      </div>
    </>
  );
}
