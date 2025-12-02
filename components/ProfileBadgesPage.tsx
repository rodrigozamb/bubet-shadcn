import { Crown } from 'lucide-react'
import AvatarIcon from "./AvatarIcon";
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';


interface UserData{
  id: string
  name:string
  profile_url:string
  badges: BadgeProps[]
} 

interface BadgeProps{
  name: string
  description: string
  image_url: string
}


export function ProfileBadgesPage({ name, profile_url, badges }:UserData){
    
    return(

        <div className="flex flex-col items-center" >

                <div className="flex content-center justify-center items-center">
                    <AvatarIcon name={name} size={200} src={profile_url} className="h-[200px] w-[200px]"/>
                </div>
                <div className="flex justify-center items-center my-5">
                    <span className=" text-3xl text-black font-bold">{ name }</span>
                </div>



                <div className="flex justify-center items-center my-5 pt-5">
                    <span className=" text-3xl font-bold">Medalhas</span>
                </div>


                <div className="flex justify-center items-center">

                    {
                        badges.length == 0 ?
                            <div className="flex justify-center align-middle items-center my-8"> 
                                <span className="text-xl font-medium text-black text-center">
                                    Este usuário ainda não tem nenhuma medalha
                                </span>
                            </div>

                        :

                        <div className="grid grid-cols-5 gap-4 justify-center" >
                            {
                                badges.map((badge, index)=>(
                                    <HoverCard openDelay={0} closeDelay={0} key={index}>
                                        <HoverCardTrigger asChild>
                                            <div className="flex justify-center items-center cursor-pointer mx-5" key={index}>
                                                <Image alt={badge.name} src={badge.image_url} width={130} height={130} />
                                            </div>
                                        </HoverCardTrigger>
                                        <HoverCardContent className='w-60'>
                                            <div className='flex flex-col items-center text-center'>
                                            <span className='mb-2.5 flex items-center justify-center rounded-full'>
                                                <Crown className='text-yellow-300 size-6' />
                                            </span>
                                            <div className='mb-1 text-lg font-medium'>{badge.name}</div>
                                            <p className='text-sm'>{badge.description}</p>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                ))
                            }
                        </div>
                    }

                </div>

          
        </div>
    )
}