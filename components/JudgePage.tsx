import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface ProfilePageProps{
    judge:{
        nickname: string,
        first_name: string,
        last_name: string,
        avatar: string,
        description: string,
        events:{
            id: string,
            name: string,
            banner: string
        }[]
    }
}



export function JudgePage({ judge }:ProfilePageProps){

    const router = useRouter()

    
    return(

        <div className="flex flex-col items-center" >

                <div className="flex content-center justify-center items-center">
                    <Image className="rounded-full shadow-2xl" src={judge.avatar} alt={judge.nickname} width={200} height={200}/>
                </div>
                <div className="flex justify-center items-center my-5">
                    <span className=" text-3xl text-black font-bold">{ judge.nickname }</span>
                </div>

                <div className="flex justify-center items-center ">
                    <span className=" text-xl"> {judge.description} </span>
                </div>

                <div className="flex justify-center items-center my-5 pt-5">
                    <span className=" text-3xl font-bold">Eventos Julgados</span>
                </div>

                <div className="bg-blue-900 w-250 h-100 flex justify-center p-5 rounded-3xl">
                    <div className="overflow-y-auto">
                        {
                            judge.events.length > 0 ? 
                                judge.events.map((event, index)=>(
                                    <div className="flex w-230 h-18 border-2 border-gray-800 justify-between bg-gray-200 px-3 m" key={index}>
                                        <div className="flex justify-center items-center cursor-pointer" onClick={()=>{router.push(`/events/${event.id}`)}}>
                                            <Image className="flex justify-center items-center rounded-full border-1 border-[#000000]" alt={event.id} src={event.banner} height={45} width={45}/>
                                            <span className="flex justify-center items-center ml-3 font-bold ">{event.name}</span>
                                        </div>

                                    </div>
                                ))
                            :

                                <div className="flex justify-center items-center h-80"> 
                                    <span className="text-xl font-medium text-white">
                                        Este usuário ainda não julgou um campeonato!
                                    </span>
                                </div>
                            

                        }
                    </div>

                </div>
                
          
        </div>
    )
}