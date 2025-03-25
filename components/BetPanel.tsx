"use client"

import Image from "next/image"
import { BetDrawer } from "./Drawer"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { useState } from "react"

// const data = {
//     "created_at" : "15/07/2025",
//     "bets":["Computaria", "Incendiária", "Meritíssima", "Predadora", "Bandida", "Invasora", "Muleta", "Charangaaaaaa15265165164161616416451705461", "Predadora", "Bandida", "Invasora", "Muleta", "Charanga","S/A" ],
//     "points":125
// }

const allBets = [
    {
        "id":"1",
        "user_namer":"Rodrigo Zamboni",
        "avatar":"/cirilo.jpeg",
        "bets":["S/A","Infanteria","Ufuteria","Rateria","Percurssão","Tubatuque","Arritmia","Computaria"],
        "created_at":"12/05/2025",
        "points":135
    },
    {
        "id":"2",
        "user_namer":"Luana Soares",
        "avatar":"/cirilo.jpeg",
        "bets":["S/A","Infanteria","Ufuteria","Rateria","Percurssão","Tubatuque","Arritmia","Computaria"],
        "created_at":"11/05/2025",
        "points":205
    },
    {
        "id":"3",
        "user_namer":"Felipe Duarte",
        "avatar":"/cirilo.jpeg",
        "bets":["S/A","Infanteria","Ufuteria","Rateria","Percurssão","Tubatuque","Arritmia","Computaria"],
        "created_at":"10/05/2025",
        "points":10
    },
    {
        "id":"4",
        "user_namer":"Rodrigo Zamboni",
        "avatar":"/cirilo.jpeg",
        "bets":["S/A","Infanteria","Ufuteria","Rateria","Percurssão","Tubatuque","Arritmia","Computaria"],
        "created_at":"12/05/2025",
        "points":135
    },
    {
        "id":"5",
        "user_namer":"Luana Soares",
        "avatar":"/cirilo.jpeg",
        "bets":["S/A","Infanteria","Ufuteria","Rateria","Percurssão","Tubatuque","Arritmia","Computaria"],
        "created_at":"11/05/2025",
        "points":205
    },
    {
        "id":"6",
        "user_namer":"Felipe Duarte",
        "avatar":"/cirilo.jpeg",
        "bets":["S/A","Infanteria","Ufuteria","Rateria","Percurssão","Tubatuque","Arritmia","Computaria"],
        "created_at":"10/05/2025",
        "points":10
    },
    {
        "id":"7",
        "user_namer":"Rodrigo Zamboni",
        "avatar":"/cirilo.jpeg",
        "bets":["S/A","Infanteria","Ufuteria","Rateria","Percurssão","Tubatuque","Arritmia","Computaria"],
        "created_at":"12/05/2025",
        "points":135
    },
    {
        "id":"8",
        "user_namer":"Luana Soares",
        "avatar":"/cirilo.jpeg",
        "bets":["S/A","Infanteria","Ufuteria","Rateria","Percurssão","Tubatuque","Arritmia","Computaria"],
        "created_at":"11/05/2025",
        "points":205
    },
    {
        "id":"9",
        "user_namer":"Felipe Duarte",
        "avatar":"/cirilo.jpeg",
        "bets":["S/A","Infanteria","Ufuteria","Rateria","Percurssão","Tubatuque","Arritmia","Computaria"],
        "created_at":"10/05/2025",
        "points":10
    }
]

const data = null

export function BetPanel(){

    const [searchTerm, setSearchTerm] = useState("");

    const apostas = allBets.filter((item) =>
      item.user_namer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (

        <div className="flex justify-center bg-gray-300 rounded-3xl py-5">

            <div className="content-center">
                
                <div className="flex justify-center h-52">
                    <div className= "">
                        <div className="flex justify-center text-3xl mb-2 text-black font-bold">Sua aposta</div>

                        {

                            data ? 
                                <div className="flex justify-center items-center h-35 max-h-35 bg-zinc-100 rounded-3xl w-4xl">
                                    <div>
                                        <div className="flex justify-center font-bold text-xl mb-3">
                                            <div className="flex justify-center items-center mx-5">
                                                <div className="flex justify-center items-center text-gray-900 text-sm bg-[#FFD700] rounded-full mx-2 size-7">1º</div>
                                                <div>{data.bets[0]}</div> 
                                            </div>
                                            <div className="flex justify-center items-center  mx-5">
                                                <div className="flex justify-center items-center text-gray-900 text-sm bg-[#C0C0C0] rounded-full mx-2 size-7">2º</div>
                                                <div>
                                                    {data.bets[1]}
                                                </div>
                                            </div>
                                            <div className="flex justify-center items-center mx-5">
                                                <div className="flex justify-center items-center text-gray-900 text-sm bg-[#cd7f32] rounded-full mx-2 size-7">3º</div>
                                                <div>
                                                    {data.bets[2]}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex bg-zinc-200 w-3xl rounded-3xl p-1">
                                            <div className="justify-center m-h-20 grid grid-cols-5">
                                                {
                                                    data.bets.slice(3).map((competitor, index) => (
                                                        <span className=" mx-3 text-center truncate" key={index+4}>{index+4}º - {competitor}</span>    
                                                    ))
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className="items-center ml-3">
                                        <span className="text-zinc-700">{data.created_at}</span>
                                        <div>
                                            <div className="items-center text-2xl font-bold">
                                                <div className="flex justify-center">Pontos</div>
                                                <div className="flex justify-center">{data.points}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : 
                                <div className="flex justify-center items-center h-30 max-h-30">
                                    <BetDrawer/>
                                    {/* <Button className="cursor-pointer w-56 h-15 text-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-200"> Fazer Aposta</Button> */}
                                </div>
                        }
                        
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <span className="text-center text-3xl text-black font-bold mb-2">Todas apostas</span>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="flex justify-center items-center">
                                <Button className="cursor-pointer w-52 h-12 text-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-200"> visualizar respostas</Button>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="xl:max-w-[1025px]">
                            <DialogHeader className="flex justify-center items-center">
                                <DialogTitle>Todas as Apostas</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center items-center flex-col">
                                <Input className="w-80 m-3" type="search" placeholder="Pesquise aqui...." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                                <div className="h-100 overflow-y-auto">
                                    {
                                        apostas.length > 0 ? 
                                            apostas.map((bet)=>(
                                                <div className="flex w-130 h-18 border-2 border-gray-800 justify-between bg-amber-200 px-3 m" key={bet.id}>
                                                    <div className="flex justify-center items-center">
                                                        <Image className="flex justify-center items-center rounded-full border-1 border-[#000000]" alt={bet.user_namer} src={bet.avatar} height={45} width={45}/>
                                                        <span className="flex justify-center items-center ml-3">{bet.user_namer}</span>
                                                    </div>

                                                    {/* botão de ver a aposta */}
                                                    <div className="flex">
                                                        <Dialog>
                                                            <div className="flex justify-center items-center ">
                                                                <DialogTrigger asChild>
                                                                    <Button variant="outline" className="mr-5 text-sm cursor-pointer">ver aposta</Button>
                                                                </DialogTrigger>
                                                            </div>
                                                            <DialogContent className="sm:max-w-[425px]">
                                                                <DialogHeader>
                                                                    <DialogTitle>Aposta de {bet.user_namer}</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="flex justify-between">

                                                                    <div className="flex flex-col items-start">
                                                                        {
                                                                            bet.bets.map((competitor, i) =>(
                                                                                <span key={i}>{i+1}º - {competitor}</span>  
                                                                            ))
                                                                        }
                                                                    </div>

                                                                    <div className="flex flex-col justify-center items-center mr-10">
                                                                        <span className="font-bold  text-xl">Pontos</span>
                                                                        <span className=" text-xl">{bet.points}</span>

                                                                        <span className="text-sm text-gray-700 mt-15">feita em: {bet.created_at}</span>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <div className="flex flex-col justify-center items-center">
                                                            <span className="text-sm font-black">Pontos</span>
                                                            <span>{bet.points}</span>
                                                        </div>
                                                    </div>

                                                </div>
                                            ))
                                        :

                                            <div className="flex justify-center items-center h-80"> 
                                                <span className="text-xl font-black">
                                                    Nenhuma aposta correspondente!
                                                </span>
                                            </div>
                                        

                                    }


                                    
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}