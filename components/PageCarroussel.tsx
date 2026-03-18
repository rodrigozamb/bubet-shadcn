/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
 

import { useState, useEffect } from "react";
import { Carroussel } from "./Carroussel";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from "./ui/dialog";
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

interface GuessEventProps{
  id:string,
  name: string,
  profile_url: string
}
interface PageCarrousselProps{
  events:EventProps[]
  competitors:CompetitorProps[]
  guessEvents:GuessEventProps[]
}

export function PageCarroussel({ competitors, events, guessEvents }:PageCarrousselProps){

      const router = useRouter()

      const [index, setIndex] = useState<number>(1)
      const [searchTerm, setSearchTerm] = useState("");
  
      const allCompetitors = competitors.filter((item:{name: string}) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const allEvents = events.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const allGuessEvents = guessEvents.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const handleClickCategory = ( index: number ) => {
        setIndex(index)
      }
      
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
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  fontSize:'30px'
                }}
              >    

                <div style={{

                  display: 'flex',
                }} >
                  <h1
                    style={{
                      color: index == 0 ? 'black' : 'gray'
                    }}
                  >
                    <span className="cursor-pointer" onClick={() => handleClickCategory(0)} >Palpites</span>
                  </h1>
                  <h1 style={ {
                    color: 'gray',
                    margin: '0 1rem',
                  }} 
                  >
                    |
                  </h1> 
                  <h1
                    style={{
                      
                      color: index == 1 ? 'black' : 'gray'
                    }}
                  >
                    <span className="cursor-pointer" onClick={() => handleClickCategory(1)} >Torneios</span>
                  </h1>
                  <h1 style={ {
                    color: 'gray',
                    margin: '0 1rem',
                  }} 
                  >
                    |
                  </h1>
                  <h1
                    style={{
                      color: index == 2 ? 'black' : 'gray'
                    }}
                  >
                    <span className="cursor-pointer" onClick={() => handleClickCategory(2)}>Baterias</span>
                  </h1>
                </div>
              </div>  


              {/* Main title */}
              <div className="flex justify-center">
                <span className="ml-20 pb-5 text-4xl font-semibold">{index == 0 ? 'Palpites' : index == 1 ? 'Torneios' : 'Baterias'}</span>
                  <span className="ml-3 flex justify-center content-center items-center">
                    <DialogTrigger className="cursor-pointer">
                      <p>ver todos</p>
                    </DialogTrigger>
                  </span>
              </div>
              
              <DialogContent className="w-250 h-150">
                
                <DialogHeader>
                  <DialogTitle>
                    <span className="flex justify-center">{index == 0 ? 'Todos os Palpites' : index == 1 ? 'Todos os Torneios' : 'Todas as Baterias'}</span>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="flex justify-center">
                  <Input className="w-80 m-3" type="search" placeholder="Pesquise aqui...." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
                                
                <div className="overflow-y-auto h-100">

                    {
                      index == 0 ?
                        allGuessEvents.length > 0 ?
                          allGuessEvents.map((guessEvents: GuessEventProps, i: number) => (

                              <div className="flex items-center h-20 cursor-pointer hover:bg-gray-200 transition-opacity duration-200" key={i} onClick={()=> {router.push(`/palpites/${guessEvents.id}`)}}>
                                  <AvatarIcon name={guessEvents.name} size={60} src={guessEvents.profile_url} className="m-3" />
                                  <p className="font-medium text-md">{guessEvents.name}</p>
                                  
                              </div>

                          ))
                        :
                          <div className="flex justify-center text-md font-bold mt-15">
                            <p>Nenhum resultado encontrado</p>
                            
                          </div>
                      :
                      index == 2 ? 
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
                                <AvatarIcon name={event.name} src={event.banner} className="m-3" size={60} key={event.id} />
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
                <Carroussel items={ index == 2 ? competitors : index == 1 ? events.slice(0,5) : allGuessEvents } categoryIndex={index} />
              </div>
            </div>
          </div>
        </Dialog>
      );
}