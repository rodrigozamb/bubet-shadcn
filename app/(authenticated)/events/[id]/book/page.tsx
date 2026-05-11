/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { EventBook } from "@/components/book/EventBook";
import { Header } from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";






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
