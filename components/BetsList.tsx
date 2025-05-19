"use client"
 
import { useRouter } from 'next/navigation'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
interface BetProps{
  id: string,
  points: string,
  bets:{
    name:string,
  }[],
  event:{
    id: string,
    name:string,
    ends_at: string,
  },
}

interface BetListProps{
  bets:BetProps[]
}

export function BetsList({ bets }:BetListProps){

    const router = useRouter()
    console.log(bets)
    return(
        <div className="h-120 w-screen justify-end items-end align-bottom bg-gray-800 px-5 py-2" >
            <div className="text-2xl m-2 text-white font-bold">Apostas</div>
            <div className="h-95 w-full rounded-md border shadow-md relative overflow-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-secondary ">
                        <TableRow>
                        <TableHead className="w-[5vw] text-black pl-4 font-bold">Status</TableHead>
                        <TableHead className="w-[15vw]">

                            <div className="flex justify-center content-center text-black font-bold">
                              Torneios
                            </div>

                        </TableHead>
                        <TableHead className="text-black font-bold content-center justify-center">
                          
                            <div className="flex justify-center content-center">
                              Pódio
                            </div>

                        </TableHead>
                        <TableHead className="text-right text-black font-bold pr-15">Pontos</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bets.map((item, idx) => (
                        <TableRow 
                            className="cursor-pointer" 
                            key={idx} 
                            onClick={() => {
                                router.push(`/events/${item.event.id}`)
                              }}
                        >
                            
                            <TableCell className="font-medium pl-5">
                            {new Date(item.event.ends_at) > new Date() ? <div className="w-8 h-8 bg-red-500 rounded-full border-black border-1"></div> : <div className="w-8 h-8 bg-green-500 rounded-full border-black border-1"></div>}
                            </TableCell>
                              
                              <TableCell>
                                <div className="flex justify-center content-center items-center text-white font-bold">
                                  {item.event.name}
                                </div>
                              </TableCell>
                           
                            <TableCell>
                              <div className="flex justify-center content-center font-medium">
                                <span className="text-gray-900 bg-[#FFD700] rounded-full p-1.25 mx-2">{item.bets[0].name}</span>
                                <span className="text-gray-900 bg-[#C0C0C0] rounded-full p-1 mx-2">{item.bets[1].name}</span>
                                <span className="text-gray-900 bg-[#cd7f32] rounded-full p-1 mx-2">{item.bets[2].name}</span>
                              </div>
                                
                            </TableCell>
                            <TableCell className="text-right pr-18 text-white font-bold">{item.points}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-center text-white text-sm m-3 font-medium">
              <p>
                Plataforma desenvolvida por 
              </p>
              
              <a className="font-bold mx-2" href="https://www.linkedin.com/in/rodrigozamboni/" target="_blank"> Rodrigo Zamboni</a>
            </div>
        </div>
    )
}