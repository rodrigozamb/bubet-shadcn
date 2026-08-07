'use client'

import { ChevronDown, ChevronRight, Crown } from 'lucide-react'
import AvatarIcon from "./AvatarIcon";
import Image from "next/image";
import { useContext, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { AuthContext } from '@/context/AuthContext';


interface UserData{
  id: string
  name:string
  profile_url:string
  badges: BadgeProps[]
  not_obtained_badges: BadgeProps[]
} 

interface BadgeProps{
  name: string
  description: string
  image_url: string
}


export function ProfileBadgesPage({ id, name, profile_url, badges, not_obtained_badges }:UserData){
    const [selectedBadge, setSelectedBadge] = useState<BadgeProps | null>(null);
    const [isObtainedOpen, setIsObtainedOpen] = useState(true);
    const [isNotObtainedOpen, setIsNotObtainedOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const showNotObtainedBadges = Boolean(user && user.id === id);

    const renderBadgeGrid = (badgeList: BadgeProps[], isObtained: boolean) => {
        if (badgeList.length === 0) {
            return (
                <div className="flex justify-center items-center py-6">
                    <span className="text-center text-sm text-gray-600">
                        {isObtained
                            ? 'Este usuário ainda não tem medalhas obtidas.'
                            : 'Este usuário já possui todas as medalhas disponíveis.'}
                    </span>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 justify-center">
                {badgeList.map((badge, index) => (
                    <div
                        onClick={() => setSelectedBadge(badge)}
                        className="flex justify-center items-center cursor-pointer mx-2 hover:opacity-80 transition-opacity"
                        key={`${badge.name}-${index}`}
                    >
                        <Image
                            unoptimized
                            alt={badge.name}
                            src={badge.image_url}
                            width={130}
                            height={130}
                            className={isObtained ? '' : 'opacity-70 grayscale'}
                        />
                    </div>
                ))}
            </div>
        )
    }
    
    return(
        <>
        <div className="flex flex-col items-center w-full" >

            <div className="flex content-center justify-center items-center">
                <AvatarIcon name={name} size={200} src={profile_url} className="h-[200px] w-[200px]"/>
            </div>
            <div className="flex justify-center items-center my-5">
                <span className="text-3xl text-black font-bold">{ name }</span>
            </div>

            <div className="flex justify-center items-center my-5 pt-5">
                <span className="text-3xl font-bold">Medalhas</span>
            </div>

            <div className="w-full max-w-5xl px-4 space-y-3">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm ">
                    <button
                        type="button"
                        onClick={() => setIsObtainedOpen((prev) => !prev)}
                        className="flex w-full items-center justify-between px-4 py-4 text-left cursor-pointer"
                    >
                        <span className="text-lg font-semibold">Medalhas Obtidas</span>
                        {isObtainedOpen ? (
                            <ChevronDown className="size-5 text-gray-600" />
                        ) : (
                            <ChevronRight className="size-5 text-gray-600" />
                        )}
                    </button>

                    {isObtainedOpen && (
                        <div className="border-t border-gray-100 px-4 py-4">
                            {renderBadgeGrid(badges, true)}
                        </div>
                    )}
                </div>

                {showNotObtainedBadges && (
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm ">
                        <button
                            type="button"
                            onClick={() => setIsNotObtainedOpen((prev) => !prev)}
                            className="flex w-full items-center justify-between px-4 py-4 text-left cursor-pointer"
                        >
                            <span className="text-lg font-semibold">Medalhas Não Obtidas</span>
                            {isNotObtainedOpen ? (
                                <ChevronDown className="size-5 text-gray-600" />
                            ) : (
                                <ChevronRight className="size-5 text-gray-600" />
                            )}
                        </button>

                        {isNotObtainedOpen && (
                            <div className="border-t border-gray-100 px-4 py-4">
                                {renderBadgeGrid(not_obtained_badges, false)}
                            </div>
                        )}
                    </div>
                )}
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