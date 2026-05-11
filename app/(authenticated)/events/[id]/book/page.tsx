"use client"

import { BetPanel } from "@/components/BetPanel";
import { CompetitorsList } from "@/components/CompetitorsList";
import { EventBook } from "@/components/book/EventBook";
import { Header } from "@/components/Header";
import { InfoPanel } from "@/components/InfoPanel";
import { Podium } from "@/components/Podium";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";


interface EventData{
    id: string,
    name: string,
    description: string,
    date: string,
    banner: string,
    starts_at: string,
    ends_at: string,
    created_at: string,
    local: string,
    judges:{
      id: string,
      nickname: string,
      avatar: string
    }[]
}

interface UserBetData{
  created_at: string,
  bets: {
      name: string
  }[],
  estandartes:{
      competitor:{
          name: string
      },
      bannerType:{
          name: string
      }
  }[],
  points: string,
  cupons:{
    value: string
  } | null
}

interface defaultBet{
  user:{
  
      id: string,
      name: string,
      profile_url: string,
      username: string
  }
  bets: {
      name: string
  }[],
  estandartes:{
    competitor:{
        name: string
    },
    bannerType:{
        name: string
    }
  }[],
  created_at: string,
  points: string,
  cupons:{
    value: string
  }
}

interface ResultProps{
  id: string,
  name: string,
  profile_url: string
  score: string,
  competitor: CompetitorProps,
  estandartes: {
    name: string
  }[]
}

interface CompetitorProps{
  id: string,
  name: string,
  profile_url: string,
  description: string
}

interface BannersTypesProps{
  id: string,
  name: string
}

interface CuponsProps{
  id: string,
  value: string,
  used_at:string,
  betId: string
}





export default function EventBookPage() {

  useContext(AuthContext)

  const [isloading, setIsLoading] = useState<boolean>(true)

  const params = useParams<{id: string}>()
  const { id } = params


/*   if(isloading ){
    return null
  } */
  const tit = `Album de Figurinhas`

  const items = [
    {
      id: '1',
      type:"description",
      title: 'Bateria Computaria',
      faculdade:"",
      profile_url:"",
      content: 'Participando pela primeira vez nessa Etapa, a Computaria vem com sangue no olho pra levar o título.'
    },
    {
      id: '2',
      type:"images",
      title: 'Event 2',
      images:[{url: 'image2.jpg', name:"Fulano"},{url: null, name:"Beltrano"},{url: 'image3.jpg', name:"Beltrano"},{url: 'image1.jpg', name:"Ciclano"}],
      content: 'This is the second event with detailed information about what will happen during this event.'
    },
    {
      id: '3',
      type:"images",
      title: 'Event 3',
      images:[{url: 'image2.jpg', name:"Fulano"},{url: null, name:"Beltrano"},{url: 'image3.jpg', name:"Beltrano"},{url: 'image1.jpg', name:"Ciclano"}],
      content: 'This is the third event containing important details and schedules for attendees.'
    },
    {
      id: '4',
      type:"images",
      title: 'Event 4',
      images:[{url: 'image2.jpg', name:"Fulano"},{url: null, name:"Beltrano"},{url: 'image3.jpg', name:"Beltrano"},{url: 'image1.jpg', name:"Ciclano"}],
      content: 'This is the fourth event containing important details and schedules for attendees.'
    },
    {
      id: '5',
      type:"final",
      title: 'Event 4',
      content: 'This is the fourth event containing important details and schedules for attendees.'
    }
  ]

  return (
    <>

      <title>{tit}</title>
      <meta name="event" content="Conheça o evento!"/>
      
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>
        
        <div className="flex justify-center align-center items-center">
            <EventBook items={items}/>
        </div>
      </div>
    </>
  );
}
