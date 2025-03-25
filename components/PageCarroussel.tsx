/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
 

import { useState } from "react";
import { Carroussel } from "./Carroussel";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from "./ui/dialog";
import Image from "next/image";
import { Input } from "./ui/input";

const event_data =[
  {
      "name":"Bateria Bandida",
      "logo":"/logos/Bandida Logo.png"
  },
  {
      "name":"Bateria C7",
      "logo":"/logos/Bateria C7 Logo.png"
  },
  {
      "name":"BaterECA",
      "logo":"/logos/BaterECA logo.png"
  },
  {
      "name":"UFUteria",
      "logo":"/logos/UFUteria logo.png"
  },
  {
      "name":"Rateria",
      "logo":"/logos/Rateria Logo.png"
  },
  {
      "name":"Meritissima",
      "logo":"/logos/Meritissima-logo.png"
  },
  {
      "name":"Psicolata",
      "logo":"/logos/Logo Psicolata.png"
  }
]

const comp_data =[
  {
      "name":"Bateria Mercenária",
      "logo":"/logos/Mercenária Logo.png"
  },
  {
      "name":"Bateria C7",
      "logo":"/logos/Bateria C7 Logo.png"
  },
  {
      "name":"BaterECA",
      "logo":"/logos/BaterECA logo.png"
  },
  {
      "name":"UFUteria",
      "logo":"/logos/UFUteria logo.png"
  },
  {
      "name":"Rateria",
      "logo":"/logos/Rateria Logo.png"
  },
  {
      "name":"Meritissima",
      "logo":"/logos/Meritissima-logo.png"
  },
  {
      "name":"Psicolata",
      "logo":"/logos/Logo Psicolata.png"
  },
  {
    "name":"Bateria Mercenária",
    "logo":"/logos/Mercenária Logo.png"
  },
  {
    "name":"Bateria Mercenária",
    "logo":"/logos/Mercenária Logo.png"
  },
  {
    "name":"Bateria Mercenária",
    "logo":"/logos/Mercenária Logo.png"
  },
  {
    "name":"Bateria Mercenária",
    "logo":"/logos/Mercenária Logo.png"
  },
  {
    "name":"Bateria Mercenária",
    "logo":"/logos/Mercenária Logo.png"
  },
  {
    "name":"Bateria Mercenária",
    "logo":"/logos/Mercenária Logo.png"
  },
  {
    "name":"Bateria Mercenária",
    "logo":"/logos/Mercenária Logo.png"
  }
]

export function PageCarroussel(){

      const [isCompetitor,setIsCompetitor] = useState<boolean>(true)
      const [competitorColor, setCompetitorColor] = useState<string>('gray')
      const [eventColor, setEventColor] = useState<string>('white')
      const [searchTerm, setSearchTerm] = useState("");

      const allCompetitors = comp_data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const allEvents = event_data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const handleClickComp = () => {
        setIsCompetitor(true)
        setEventColor('gray')
        setCompetitorColor('white')
      }
      const handleClickEvent = () => {
        setIsCompetitor(false)
        setEventColor('white')
        setCompetitorColor('gray')
      }
      return (
        <Dialog>
          <div className="content-center justify-center items-center h-82 w-screen bg-gray-500" >
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
                  color: 'white',
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
                <span className="ml-20 pb-3 text-4xl">{isCompetitor ? 'Baterias' : 'Torneios'}</span>
                <DialogTrigger>
                  <span className="ml-3 justify-center content-center cursor-pointer">
                    ver todos
                  </span>
                </DialogTrigger>
              </div>
              
              <DialogContent className="w-250 h-150">
                <DialogHeader>
                  <DialogTitle>
                    <span className="flex justify-center">{isCompetitor ? "Todas as Baterias":"Todas as competições"}</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="flex justify-center">
                  <Input className="w-80 m-3" type="search" placeholder="Pesquise aqui...." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
                                
                <div className="overflow-y-auto ">

                    {
                      isCompetitor ? 
                        allCompetitors.map((competitor, i) => (

                            <div className="flex items-center h-15" key={i}>
                                <Image className="m-3" src={competitor.logo} alt={competitor.name} width={40} height={40}/>
                                {competitor.name}
                            </div>

                        ))
                        :
                        allEvents.map((event, i) => (

                          <div className="flex items-center h-15" key={i}>
                              <Image className="m-3" src={event.logo} alt={event.name} width={40} height={40}/>
                              {event.name}
                          </div>

                      ))

                    }
                </div>
              </DialogContent>

              <div className="flex justify-center">
                <Carroussel/>
              </div>
            </div>
          </div>
        </Dialog>
      );
}