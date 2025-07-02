/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
 

import { useState, useEffect } from "react";
import { Carroussel } from "./Carroussel";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from "./ui/dialog";
import Image from "next/image";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation"
import AvatarIcon from "./AvatarIcon";


interface EventProps{
  id:string,
  name:string,
  banner: string
}

interface CompetitorProps{
  id:string,
  name:string,
  profile_url: string
}
interface PageCarrousselProps{
  events:EventProps[]
  competitors:CompetitorProps[]
}

export function PageCarroussel({ competitors, events }:PageCarrousselProps){

      const router = useRouter()

      const [isCompetitor,setIsCompetitor] = useState<boolean>(false)
      const [competitorColor, setCompetitorColor] = useState<string>('gray')
      const [eventColor, setEventColor] = useState<string>('black')
      const [searchTerm, setSearchTerm] = useState("");
  
      const allCompetitors = competitors.filter((item:{name: string}) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const allEvents = events.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const handleClickComp = () => {
        setIsCompetitor(true)
        setEventColor('gray')
        setCompetitorColor('black')
      }
      const handleClickEvent = () => {
        setIsCompetitor(false)
        setEventColor('black')
        setCompetitorColor('gray')
      }

      useEffect(()=>{
        setIsCompetitor(false)
        setEventColor('black')
        setCompetitorColor('gray')
      },[])
      
      return (
        <Dialog>
          <div className="content-center justify-center items-center h-auto w-screen" >
            <div>
              {/* Select Category */}
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  padding: '1rem',
                  textAlign: 'center',
                  justifyContent: 'space-between',
                  alignContent: 'center',
                  position: 'relative',
                  fontSize:'30px'
                  // alignItems: 'center',
                }}
              >
                <h1
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    marginRight: '1rem',
                    display: 'inline-block',
                    color: eventColor
                  }}
                >
                  <span className="cursor-pointer" onClick={handleClickEvent} >Torneios</span>
                </h1>
                <h1 style={ {
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'gray',
                }} 
                >
                  |
                </h1>
                <h1
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    marginLeft: '1rem',
                    display: 'inline-block',
                    color: competitorColor
                  }}
                >
                  <span className="cursor-pointer" onClick={handleClickComp}>Baterias</span>
                </h1>
              </div>  


              {/* Main title */}
              <div className="flex justify-center">
                <span className="ml-20 pb-5 text-4xl font-semibold">{isCompetitor ? 'Baterias' : 'Torneios'}</span>
                  <span className="ml-3 flex justify-center content-center items-center">
                    <DialogTrigger className="cursor-pointer">
                      <p>ver todos</p>
                    </DialogTrigger>
                  </span>
              </div>
              
              <DialogContent className="w-250 h-150">
                
                <DialogHeader>
                  <DialogTitle>
                    <span className="flex justify-center">{isCompetitor ? "Todas as Baterias":"Todas os torneios"}</span>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="flex justify-center">
                  <Input className="w-80 m-3" type="search" placeholder="Pesquise aqui...." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
                                
                <div className="overflow-y-auto h-100">

                    {
                      isCompetitor ? 
                        allCompetitors.length > 0 ?
                          allCompetitors.map((competitor, i) => (

                              <div className="flex items-center h-20 cursor-pointer hover:bg-gray-200 transition-opacity duration-200" key={i} onClick={()=> {router.push(`/competitors/${competitor.id}`)}}>
                                  <AvatarIcon name={competitor.name} size={60} src={competitor.profile_url} className="m-3" />
                                  <p className="font-medium text-md">{competitor.name}</p>
                                  
                              </div>

                          ))
                        :
                          <div className="flex justify-center text-md font-bold mt-15">
                            <p>Nenhum resultado encontrado</p>
                            
                          </div>
                      :
                        allEvents.length > 0 ?

                          allEvents.map((event, i) => (

                            <div className="flex items-center h-20 cursor-pointer hover:bg-gray-200 transition-opacity duration-200" key={i} onClick={()=> {router.push(`/events/${event.id}`)}}>
                                <Image className="m-3" src={event.banner} alt={event.name} width={60} height={60}/>
                                <p className="font-medium text-md">{event.name}</p>
                            </div>

                          ))
                        :
                          <div className="flex justify-center text-md font-bold mt-15">
                            <p>Nenhum resultado encontrado</p>
                          </div>



                    }
                </div>
              </DialogContent>

              <div className="flex justify-center">
                <Carroussel items={ isCompetitor ? competitors : events } isCompetitor={isCompetitor}/>
              </div>
            </div>
          </div>
        </Dialog>
      );
}