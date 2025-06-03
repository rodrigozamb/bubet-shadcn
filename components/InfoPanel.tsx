"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

interface InfoPanelProps{
    name:string,
    date:string,
    local:string,
    time:string
    judges:{
        id: string,
        nickname: string
        avatar: string
    }[]
}

export function InfoPanel({ name, date, local, time, judges }:InfoPanelProps){

    const router = useRouter()

    return (

        <div className="flex justify-center my-2 px-30">
            <div className="content-center w-200">

                <div className="flex justify-center text-4xl my-10 font-extrabold">
                   {name}
                </div>
                <div className="flex justify-between content-center">
                    <div>
                        <span className="flex justify-center content-center text-3xl font-bold">Horário</span>
                        <span className="flex justify-center content-center my-3 text-xl">{time}</span>
                    </div>
                    <div>
                        <span className="flex justify-center content-center text-3xl font-bold">Local</span>
                        <span className="flex justify-center content-center my-3 text-xl">{local}</span>
                    </div>
                    <div>
                        <span className="flex justify-center content-center text-3xl font-bold">Data</span>
                        <span className="flex justify-center content-center my-3 text-xl">{date}</span>
                    </div>
                </div>

                <div className="flex flex-col mt-8 font-extrabold text-center">
                   <span className="text-3xl mb-2">Jurados</span>
                   <div className="grid grid-cols-8 gap-4 justify-center" >
                        {
                            judges.map((jurado, index) => (
                                <div 
                                    className="flex flex-col cursor-pointer items-center" 
                                    key={index+4}
                                    onClick={()=>{ router.push(`/judges/${jurado.id}`) }}    
                                >
                                        <Image className="rounded-full border-1 border-black" src={jurado.avatar} alt={jurado.id} width={55} height={55}/>
                                        <span className="font-semibold" >{jurado.nickname}</span>
                                </div>    
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}