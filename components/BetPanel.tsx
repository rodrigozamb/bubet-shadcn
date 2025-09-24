"use client"

import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { useState } from "react"
import { BetSheet } from "./BetSheet"
import { useRouter } from "next/navigation"
import AvatarIcon from "./AvatarIcon"


interface BetsPanelProps{
    userBet:{
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
    } | null
    allBets:{
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
        points: string
    }[],
    competitors:{
        id: string,
        profile_url: string,
        name: string
    }[],
    estandartes:{
        id: string,
        name: string
    }[],
    event_active?: boolean 
    
}

const colors1 = ["#FF0000","#00FF00","#0000FF","#FFFF00","#00FFFF","#FF00FF","#FFA500","#800080","#8B4513","#808080"]

const colors = [
  "#FFCCCC", // Vermelho pastel
  "#CCFFCC", // Verde pastel
  "#CCCCFF", // Azul pastel
  "#FFFFCC", // Amarelo pastel
  "#CCFFFF", // Ciano pastel
  "#FFCCFF", // Magenta pastel
  "#FFE0B3", // Laranja pastel
  "#E0CCFF", // Roxo pastel
  "#D2B48C", // Marrom claro pastel (tom claro de Tan)
  "#E0E0E0"  // Cinza bem claro
];


export function BetPanel({ allBets, userBet, competitors, estandartes, event_active = true }:BetsPanelProps){

    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter()
    const apostas = allBets.filter((item) =>
      item.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (

        <div className="flex justify-center bg-blue-900  rounded-3xl py-5">

            <div className="content-center">
                
                <div className="flex justify-center">
                    <div className= "">
                        <div className="flex justify-center text-3xl mb-2 text-white font-bold">Sua aposta</div>

                        {

                            userBet ? 
                            <div className="flex flex-col justify-center items-center py-5 bg-zinc-100 rounded-3xl w-230">
                                <div className="flex ">
                                    <div>
                                        <div className="flex justify-center font-bold text-xl mb-3">
                                            <div className="flex justify-center items-center mx-5">
                                                <div className="flex justify-center items-center text-gray-900 text-sm bg-[#FFD700] rounded-full mx-2 size-7">1º</div>
                                                <div>{ userBet.bets[0].name }</div> 
                                            </div>
                                            <div className="flex justify-center items-center  mx-5">
                                                <div className="flex justify-center items-center text-gray-900 text-sm bg-[#C0C0C0] rounded-full mx-2 size-7">2º</div>
                                                <div>
                                                    { userBet.bets[1].name }
                                                </div>
                                            </div>
                                            <div className="flex justify-center items-center mx-5">
                                                <div className="flex justify-center items-center text-gray-900 text-sm bg-[#cd7f32] rounded-full mx-2 size-7">3º</div>
                                                <div>
                                                    {userBet.bets[2].name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex bg-zinc-200 w-3xl rounded-3xl p-1">
                                            <div className="justify-center content-center m-h-20 grid grid-cols-5">
                                                {
                                                    userBet.bets.slice(3).map((competitor, index) => (
                                                        <div className="px-1 text-center truncate" key={index+4}>{index+4}º - {competitor.name}</div>    
                                                    ))
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className="items-center ml-3">
                                        <span className="text-zinc-700">{userBet.created_at.split("T")[0].split("-")[2]+"/"+userBet.created_at.split("T")[0].split("-")[1]+"/"+userBet.created_at.split("T")[0].split("-")[0]}</span>
                                        <div>
                                            <div className="items-center text-2xl font-bold">
                                                <div className="flex justify-center">Pontos</div>
                                                <div className="flex justify-center">{userBet.points}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                <div className="">
                                    <span className="flex justify-center font-bold text-xl text-center">
                                        Estandartes
                                    </span>
                                    <div className="grid grid-cols-5 px-2" >
                                        {
                                            userBet.estandartes.map((estandarte, index) => (
                                                <div 
                                                    className="flex flex-col text-center m-1 rounded-2xl" 
                                                    style={
                                                        {
                                                            backgroundColor: colors[index], 
                                                            border:"1px solid" ,
                                                            borderColor: colors1[index] 
                                                        }
                                                    }  
                                                    key={index+4}>
                                                        <span className="font-bold my-1" >{estandarte.bannerType.name.split("Estandarte de")[1]}</span>
                                                        <span className="mb-2">{estandarte.competitor.name}</span>
                                                        
                                                        
                                                </div>    
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                                :
                                event_active?
                                <div className="flex justify-center items-center h-30 max-h-30">
                                    <BetSheet competitors={ competitors } estandartes={ estandartes }/>
                                </div>
                                    :
                                    <div className="h-25 flex justify-center items-center text-xl">
                                        <span className="text-gray-400 font-semibold" >As apostas estão encerradas para esse evento.</span>
                                    </div>
                        }
                        
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <span className="text-center text-3xl text-white font-bold my-4">Todas apostas</span>
                    <Dialog>
                        <div className="flex justify-center items-center">
                            <DialogTrigger asChild>
                                <Button className="cursor-pointer w-52 h-12 text-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-200"> visualizar respostas</Button>
                            </DialogTrigger>
                        </div>
                        <DialogContent className="xl:max-w-[1025px]">
                            <DialogHeader className="flex justify-center items-center">
                                <DialogTitle>Todas as Apostas</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center items-center flex-col">
                                <Input className="w-80 m-3" type="search" placeholder="Pesquise aqui...." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                                <div className="h-100 overflow-y-auto">
                                    {
                                        apostas.length > 0 ? 
                                            apostas.map((bet, index)=>(
                                                <div className="flex w-130 h-18 border-2 border-gray-800 justify-between bg-amber-200 px-3 m" key={index}>
                                                    <div className="flex justify-center items-center cursor-pointer" onClick={()=>{ router.push(`/profile/${bet.user.id}`) }}>
                                                        <AvatarIcon name={bet.user.name} size={45} src={bet.user.profile_url} className="flex justify-center items-center h-[50px] w-[50px] rounded-full border-1 border-[#000000]" />
                                                        <span className="flex justify-center items-center ml-3">{bet.user.name}</span>
                                                    </div>

                                                    {/* botão de ver a aposta */}
                                                    <div className="flex">
                                                        <Dialog>
                                                            <div className="flex justify-center items-center ">
                                                                <DialogTrigger asChild>
                                                                    <Button variant="outline" className="mr-5 text-sm cursor-pointer">ver aposta</Button>
                                                                </DialogTrigger>
                                                            </div>
                                                            <DialogContent className="sm:max-w-[500px]">
                                                                <DialogHeader>
                                                                    <DialogTitle>Aposta de {bet.user.name}</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="flex justify-between">

                                                                    <div className="flex flex-col items-start w-70">
                                                                        {
                                                                            bet.bets.map((competitor, i) =>(
                                                                                <span key={i}>{i+1}º - {competitor.name}</span>  
                                                                            ))
                                                                        }
                                                                    </div>

                                                                    <div className="flex flex-col justify-center items-center mr-10">
                                                                        <span className="font-bold  text-xl">Pontos</span>
                                                                        <span className=" text-xl">{bet.points}</span>

                                                                        <span className="text-sm text-gray-700 mt-15 text-center">aposta feita em: {bet.created_at.split("T")[0].split("-")[2]+"/"+bet.created_at.split("T")[0].split("-")[1]+"/"+bet.created_at.split("T")[0].split("-")[0]}</span>
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