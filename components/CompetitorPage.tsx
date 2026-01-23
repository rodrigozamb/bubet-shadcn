import { FaInstagram, FaYoutube } from "react-icons/fa";
import AvatarIcon from "./AvatarIcon";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import { useRouter } from "next/navigation";


interface EventResultData{
  eventId: string
  placing: string
  score: number
  event:{
    name: string
    banner: string
  }
}
interface CompetitorPageProps{
    competitor:{
        name: string
        description: string
        avatar: string
        socials:{
            type: string
            name: string
        }[]
    }
    stats:{
        first: EventResultData[]
        second: EventResultData[]
        third: EventResultData[]
        others: EventResultData[]
    }
}

export function CompetitorPage({ competitor, stats }:CompetitorPageProps){

    const router = useRouter()

    return(

        <div className="flex items-center bg-cover bg-center" >

            <div>
                <div className="flex content-center justify-center items-center mb-10">
                    <AvatarIcon name={competitor.name} size={200} src={competitor.avatar} />
                </div>
                <div className="flex justify-center items-center mt-10">
                    <span className=" text-3xl text-black font-bold">{ competitor.name }</span>
                </div>
                <div className="flex justify-center">
                    {
                        competitor.socials.map((social, index) => {
                            if(social.type === "INSTAGRAM"){
                                return(
                                    <a
                                        href={"https://www.instagram.com/"+social.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                        className="text-black text-2xl mx-1.5"
                                        key={index}
                                        >
                                        <FaInstagram size={28} />
                                    </a>
                                )
                            }
                            else if(social.type === "YOUTUBE"){
                                return(
                                    <a
                                        href={"https://www.youtube.com/"+social.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                        className="text-red-500 text-2xl mx-1.5"
                                        key={index}
                                        >
                                        <FaYoutube size={28} />
                                    </a>
                                )
                            }
                        })
                    }
                    
                </div>
                
                <div className="flex justify-center w-screen px-60">
                    <span className=" text-md">{competitor.description}</span>
                </div>
                <div className="flex justify-center items-center my-5">
                    <span className=" text-3xl">Colocações</span>
                </div>

                <div className=" flex justify-center">
                    
                    <Sheet>
                    <SheetTrigger asChild>
                        <div className="mx-10 cursor-pointer">
                            <div className="flex justify-center items-center text-gray-900 bg-[#C0C0C0] rounded-full p-1 mx-2 my-2 h-15 w-15 font-medium" >{stats.second.length}</div>
                            <div className="flex justify-center items-center top-10 text-lg font-bold" >2º lugar</div>
                        </div>
                    </SheetTrigger>
                    <SheetContent className="bg-gray-500">
                        <SheetHeader className="text-center">
                        <SheetTitle className="text-white font-bold">Resultados de 2º Lugar</SheetTitle>
                        <SheetDescription className="text-white">
                            A {competitor.name} ficou em 2º lugar nos seguintes torneios:
                        </SheetDescription>
                        </SheetHeader>
                        
                        <div className="bg-gray-500 h-150 flex justify-center p-5 rounded-3xl">
                            <div className="overflow-y-auto">
                                {
                                    stats.second.length > 0 ? 
                                        stats.second.map((event, index)=>(
                                            <div className="flex w-85 rounded-2xl border-2 border-gray-800 justify-between bg-gray-200 hover:bg-gray-100 px-5 cursor-pointer" key={index}  onClick={()=>{ router.push(`/events/${event.eventId}`) }}>
                                                <div className="flex justify-center items-center cursor-pointer" >
                                                    <Image unoptimized className="h-[50px] w-[50px] rounded-full border-1 border-[#000000] object-cover " src={event.event.banner} alt="user" width={50} height={50}/>
                                                    <span className="flex justify-center items-center pl-5">{event.event.name}</span>
                                                </div>
        
                                            </div>
                                        ))
                                    :
                                        <div className="flex justify-center items-center h-80"> 
                                            <span className="text-xl font-medium text-white">
                                                Ainda não há resultados para exibir.
                                            </span>
                                        </div>
                                }
                            </div>
                        </div>
                        <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline">Voltar</Button>
                        </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                    </Sheet>


                    <Sheet>
                    <SheetTrigger asChild>
                        <div className="mx-10 cursor-pointer">
                            <div className="flex justify-center items-center text-gray-900 bg-[#FFD700] rounded-full p-1 mx-2 my-2 h-15 w-15 font-medium">{stats.first.length}</div>
                            <div className="flex justify-center items-center top-10 text-lg font-bold" >1º lugar</div>
                        </div>
                    </SheetTrigger>
                    <SheetContent className="bg-[#EFBF04]">
                        <SheetHeader className="text-center">
                        <SheetTitle className="text-yellow-950 font-bold">Resultados de 1º Lugar</SheetTitle>
                        <SheetDescription className="text-yellow-900">
                            A {competitor.name} ficou em 1º lugar nos seguintes torneios:
                        </SheetDescription>
                        </SheetHeader>
                        
                        <div className="bg-[#EFBF04] h-150 flex justify-center p-5 rounded-3xl">
                            <div className="overflow-y-auto">
                                {
                                    stats.first.length > 0 ? 
                                        stats.first.map((event, index)=>(
                                            <div className="flex w-85 rounded-2xl border-2 border-gray-800 justify-between bg-gray-200 hover:bg-gray-100 px-5 cursor-pointer" key={index}  onClick={()=>{ router.push(`/events/${event.eventId}`) }}>
                                                <div className="flex justify-center items-center cursor-pointer" >
                                                    <Image unoptimized className="h-[50px] w-[50px] rounded-full border-1 border-[#000000] object-cover " src={event.event.banner} alt="user" width={50} height={50}/>
                                                    <span className="flex justify-center items-center pl-5">{event.event.name}</span>
                                                </div>
        
                                            </div>
                                        ))
                                    :
                                        <div className="flex justify-center items-center h-80"> 
                                            <span className="text-xl font-medium text-yellow-950">
                                                Ainda não há resultados para exibir.
                                            </span>
                                        </div>
                                }
                            </div>
                        </div>
                        <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline">Voltar</Button>
                        </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                    </Sheet>

                    
                    <Sheet>
                    <SheetTrigger asChild>
                        <div className="mx-10 cursor-pointer">
                            <div className="flex justify-center items-center text-gray-900 bg-[#cd7f32] rounded-full p-1 mx-2 my-2 h-15 w-15 font-medium">{stats.third.length}</div>
                            <div className="flex justify-center items-center top-10 text-lg font-bold" >3º lugar</div>
                        </div>
                    </SheetTrigger>
                    <SheetContent className="bg-[#cd7f32]">
                        <SheetHeader className="text-center">
                        <SheetTitle className="text-yellow-950 font-bold">Resultados de 3º Lugar</SheetTitle>
                        <SheetDescription className="text-yellow-950">
                            A {competitor.name} ficou em 3º lugar nos seguintes torneios:
                        </SheetDescription>
                        </SheetHeader>
                        
                        <div className="bg-[#cd7f32] h-150 flex justify-center p-5 rounded-3xl">
                            <div className="overflow-y-auto">
                                {
                                    stats.third.length > 0 ? 
                                        stats.third.map((event, index)=>(
                                            <div className="flex w-85 rounded-2xl border-2 border-gray-800 justify-between bg-gray-200 hover:bg-gray-100 px-5 cursor-pointer" key={index}  onClick={()=>{ router.push(`/events/${event.eventId}`) }}>
                                                <div className="flex justify-center items-center cursor-pointer" >
                                                    <Image unoptimized className="h-[50px] w-[50px] rounded-full border-1 border-[#000000] object-cover " src={event.event.banner} alt="user" width={50} height={50}/>
                                                    <span className="flex justify-center items-center pl-5">{event.event.name}</span>
                                                </div>
        
                                            </div>
                                        ))
                                    :
                                        <div className="flex justify-center items-center h-80"> 
                                            <span className="text-xl font-medium text-yellow-950">
                                                Ainda não há resultados para exibir.
                                            </span>
                                        </div>
                                }
                            </div>
                        </div>
                        <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline">Voltar</Button>
                        </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                    </Sheet>
                    
                    
                </div>
                
                <div className="flex justify-center mt-8">
                    <Sheet>
                    <SheetTrigger asChild>
                        <Button variant={"default"} className="mx-10 cursor-pointer font-medium bg-blue-900 text-white hover:bg-blue-800">
                            Outros torneios
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-blue-900">
                        <SheetHeader className="text-center">
                        <SheetTitle className="text-white font-bold">Resultados Gerais</SheetTitle>
                        <SheetDescription className="text-white">
                            Confira aqui os outros torneios que a {competitor.name} participou:
                        </SheetDescription>
                        </SheetHeader>
                        
                        <div className="bg-blue-900 h-150 flex justify-center p-5 rounded-3xl">
                            <div className="overflow-y-auto">
                                {
                                    stats.others.length > 0 ? 
                                        stats.others.map((event, index)=>(
                                            <div className="flex w-85 rounded-2xl border-2 border-gray-800 justify-between bg-gray-200 hover:bg-gray-100 px-5 cursor-pointer" key={index}  onClick={()=>{ router.push(`/events/${event.eventId}`) }}>
                                                <div className="flex justify-center items-center cursor-pointer" >
                                                    <Image unoptimized className="h-[50px] w-[50px] rounded-full border-1 border-[#000000] object-cover " src={event.event.banner} alt="user" width={50} height={50}/>
                                                    <span className="flex justify-center items-center pl-5 font-medium">{event.placing}º lugar - {event.event.name}</span>
                                                </div>
        
                                            </div>
                                        ))
                                    :
                                        <div className="flex justify-center items-center h-80"> 
                                            <span className="text-xl font-medium text-white">
                                                Ainda não há resultados para exibir.
                                            </span>
                                        </div>
                                }
                            </div>
                        </div>
                        <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline">Voltar</Button>
                        </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                    </Sheet>
                </div>
            </div>
          
        </div>
    )
}