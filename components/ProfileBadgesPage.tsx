'use client'

import { Crown } from 'lucide-react'
import AvatarIcon from "./AvatarIcon";
import Image from "next/image";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';


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
    const [selectedBadge, setSelectedBadge] = useState<BadgeProps | null>(null);
    
    return(
        <>
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
                                    <div 
                                        onClick={() => setSelectedBadge(badge)}
                                        className="flex justify-center items-center cursor-pointer mx-5 hover:opacity-80 transition-opacity" 
                                        key={index}
                                    >
                                        <Image unoptimized alt={badge.name} src={badge.image_url} width={130} height={130} />
                                    </div>
                                ))
                            }
                        </div>
                    }

                </div>

          
        </div>

        <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && setSelectedBadge(null)}>
           <DialogContent className="flex flex-col items-center w-130 gap-6">
                {selectedBadge && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-center">
                                Detalhes da Medalha
                            </DialogTitle>
                        </DialogHeader>
                        
                        <Image 
                            unoptimized 
                            alt={selectedBadge.name} 
                            src={selectedBadge.image_url} 
                            width={200} 
                            height={200} 
                        />
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-3">
                                <Crown className="text-yellow-300 size-6 mr-2" />
                                <h2 className="text-2xl font-bold">{selectedBadge.name}</h2>
                            </div>
                            <p className="text-sm text-gray-600">{selectedBadge.description}</p>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
        </>
    )
}