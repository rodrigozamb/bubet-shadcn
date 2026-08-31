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
        cupons:{
            value: string,
        } | null
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
        points: string,
        cupons:{
            value: string,
        } | null
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
    cupons:{
        id: string,
        value: string,
        used_at:string,
        betId: string
    }[],
    event_active?: boolean,
    results: {
        id: string,
        name: string,
        profile_url: string,
        score: string,
        estandartes: {
            name: string
        }[]
    }[]
    
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


export function BetPanel({ allBets, userBet, competitors, estandartes, event_active = true , cupons, results}:BetsPanelProps){

    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter()
    const apostas = allBets.filter((item) =>
      item.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPlacementPoints = (index: number) => {
        if (results.length === 0) return 0
        return results.length - index
    }

    return (

        <div className="flex justify-center bg-blue-900  rounded-3xl py-5">

            <div className="content-center">
                
                <div className="flex justify-center">
                    <div className= "">
                        <div className="flex justify-center text-3xl mb-2 text-white font-bold">Sua aposta</div>

                        {

                            userBet ? 
                            <div className="flex flex-col justify-center items-center py-5 bg-zinc-100 rounded-3xl w-230 p-4">
                                <div className="flex ">
                                    <div>
                                        <div className="flex justify-center font-bold text-xl mb-3">
                                            {[0,1,2].map((position) => {
                                                const isCorrectPosition = results.length > 0 && results[position]?.name === userBet.bets[position].name
                                                const placementPoints = isCorrectPosition ? getPlacementPoints(position) : 0

                                                return (
                                                    <div
                                                        key={position}
                                                        className={`flex justify-center items-center mx-5 rounded-full px-2 ${isCorrectPosition ? "bg-green-200 border border-green-600 text-green-900" : ""}`}
                                                    >
                                                        <div className={`flex justify-center items-center text-gray-900 text-sm rounded-full mx-2 size-7 ${position === 0 ? "bg-[#FFD700]" : position === 1 ? "bg-[#C0C0C0]" : "bg-[#cd7f32]"}`}>
                                                            {position + 1}º
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span>{userBet.bets[position].name}</span>
                                                            {isCorrectPosition && (
                                                                <span className="text-xs font-bold text-green-800">+{placementPoints}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="flex w-full max-w-[720px] overflow-x-auto rounded-3xl bg-zinc-200 p-2">
                                            <div className="grid min-w-[540px] grid-cols-5 gap-1 content-center justify-center m-h-20">
                                                {
                                                    userBet.bets.slice(3).map((competitor, index) => {
                                                        const actualIndex = index + 3
                                                        const isCorrectPosition = results.length > 0 && results[actualIndex]?.name === competitor.name
                                                        const placementPoints = isCorrectPosition ? getPlacementPoints(actualIndex) : 0

                                                        return (
                                                            <div
                                                                className={`min-h-[52px] rounded-md px-2 py-1 text-center ${isCorrectPosition ? "bg-green-200 text-green-900 font-semibold" : ""}`}
                                                                key={actualIndex}
                                                            >
                                                                <div className="flex h-full flex-col items-center justify-center gap-1">
                                                                    <span className="text-[11px] font-medium">{actualIndex + 1}º</span>
                                                                    <span className="break-words text-center text-[11px] leading-tight font-bold">{competitor.name}</span>
                                                                    {isCorrectPosition && (
                                                                        <span className="text-[9px] font-bold">(+{placementPoints})</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
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

                                <div className="mt-2">
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
                                    <BetSheet competitors={ competitors } estandartes={ estandartes } cupons={cupons}/>
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
                                                        <span className="flex justify-center items-center ml-3">{bet.user.name.length > 23 ? bet.user.name.substring(0,21)+"..." : bet.user.name}</span>
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
                                                                <div className="flex justify-between gap-4">
                                                                    <div className="flex flex-col items-start w-70">
                                                                        {bet.bets.map((competitor, i) => {
                                                                            const isCorrectPosition = results.length > 0 && results[i]?.name === competitor.name
                                                                            const placementPoints = isCorrectPosition ? getPlacementPoints(i) : 0

                                                                            return (
                                                                                <div
                                                                                    key={i}
                                                                                    className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 ${isCorrectPosition ? "bg-green-200 text-green-900 font-semibold" : "bg-transparent"}`}
                                                                                >
                                                                                    <span>{i + 1}º - {competitor.name}</span>
                                                                                    {isCorrectPosition && (
                                                                                        <span className="text-xs font-bold">(+{placementPoints})</span>
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>

                                                                    <div className="flex flex-col justify-center items-center mr-10">
                                                                        <span className="font-bold  text-xl">Pontos</span>
                                                                        <span className=" text-xl">{bet.points}</span>
                                                                        {results.length > 0 && (
                                                                            <div className="mt-3 flex flex-col items-center gap-1 text-center">
                                                                                {(() => {
                                                                                    const correctOnThisBet = bet.bets.reduce<{ position: number; points: number }[]>((acc, competitor, i) => {
                                                                                        if (results[i]?.name === competitor.name) {
                                                                                            acc.push({ position: i + 1, points: getPlacementPoints(i) })
                                                                                        }
                                                                                        return acc
                                                                                    }, [])

                                                                                    return correctOnThisBet.length > 0 ? (
                                                                                        correctOnThisBet.map((placement) => (
                                                                                            <span key={placement.position} className="rounded-full border border-green-600 bg-green-    00 px-2 py-1 text-[10px] font-semibold text-green-800">
                                                                                                {placement.position}º: +{placement.points} pts
                                                                                            </span>
                                                                                        ))
                                                                                    ) : (
                                                                                        <span className="text-xs text-gray-500">Nenhuma colocação acertada</span>
                                                                                    )
                                                                                })()}
                                                                            </div>
                                                                        )}
                                                                        {
                                                                            bet?.cupons ? 
                                                                            <span className="text-sm text-green-700">Cupon de {bet.cupons.value}% aplicado!</span>
                                                                            :
                                                                            <></>
                                                                        }
                                                                        <span className="text-sm text-gray-700 mt-15 text-center">aposta feita em: {bet.created_at.split("T")[0].split("-")[2]+"/"+bet.created_at.split("T")[0].split("-")[1]+"/"+bet.created_at.split("T")[0].split("-")[0]}</span>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <div className="flex flex-col justify-center items-center">
                                                            <span className="text-sm font-black">Pontos</span>
                                                            <span>{bet.points}</span>
                                                            {
                                                                bet?.cupons ? 
                                                                <span className="text-xs text-green-700">Cupon de {bet.cupons.value}% aplicado!</span>
                                                                :
                                                                <></>
                                                            }
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