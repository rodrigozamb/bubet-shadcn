import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import AvatarIcon from "./AvatarIcon";

interface ProfilePageProps{
    profile:{
        name: string
        profile_url: string
        position: string
        created_at: string
    }
    bets:UserBetProps[]
}

interface EventProps{
  id: string
  name: string
  banner: string
}

interface BetProps{
  name: string
}
interface UserBetProps{
  bets:BetProps[]
  points: string
  event: EventProps
  created_at: string
}


export function ProfilePage({ profile, bets }:ProfilePageProps){

    const router = useRouter()

    let user_points = 0
    for (let index = 0; index < bets.length; index++) {
        user_points += Number(bets[index].points)
        
    }
    
    return(

        <div className="flex flex-col items-center" >

                <div className="flex content-center justify-center items-center">
                    <AvatarIcon name={profile.name} size={200} src={profile.profile_url} />
                </div>
                <div className="flex justify-center items-center my-5">
                    <span className=" text-3xl text-black font-bold">{ profile.name }</span>
                </div>

                <div className="flex justify-between w-100 my-5">
                    <div className="flex flex-col text-center">
                        <span className="font-medium text-xl">Criado em:</span>
                        <span className="font-medium">{profile.created_at.split("T")[0].split("-")[2]+"/"+profile.created_at.split("T")[0].split("-")[1]+"/"+profile.created_at.split("T")[0].split("-")[0]}</span>
                    </div>
                    <div className="flex flex-col text-center">
                        <span className="text-2xl font-bold">Pontos</span>
                        <span className="font-semibold text-2xl">{user_points}</span>
                    </div>

                    <div className="flex flex-col text-center">
                        <span className="text-2xl font-bold">Ranking</span>
                        <span className="font-semibold text-2xl">{profile.position}º</span>
                    </div>
                </div>

                <div className="flex justify-center items-center my-5 pt-5">
                    <span className=" text-3xl font-bold">Apostas</span>
                </div>

                <div className="bg-blue-900 w-250 h-100 flex justify-center p-5 rounded-3xl">
                    <div className="overflow-y-auto">
                        {
                            bets.length > 0 ? 
                                bets.map((bet, index)=>(
                                    <div className="flex w-230 h-18 border-2 border-gray-800 justify-between bg-gray-200 px-3 m" key={index}>
                                        <div className="flex justify-center items-center cursor-pointer" onClick={()=>{router.push(`/events/${bet.event.id}`)}}>
                                            <Image className="flex justify-center items-center rounded-full border-1 border-[#000000]" alt={bet.event.id} src={bet.event.banner} height={45} width={45}/>
                                            <span className="flex justify-center items-center ml-3 font-bold ">{bet.event.name}</span>
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
                                                        <DialogTitle>Apostas de {profile.name}</DialogTitle>
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
                                    <span className="text-xl font-medium text-white">
                                        Este usuário ainda não fez uma aposta!
                                    </span>
                                </div>
                            

                        }
                    </div>

                </div>
                
          
        </div>
    )
}