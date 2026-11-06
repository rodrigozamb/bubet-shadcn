'use client'

import { ArrowLeft, ChevronDown, ChevronRight, Crown } from 'lucide-react'
import AvatarIcon from "./AvatarIcon";
import Image from "next/image";
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { AuthContext } from '@/context/AuthContext';
import { Button } from './ui/button';


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
    const router = useRouter();
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
            <div className="grid grid-cols-2 justify-center gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                {badgeList.map((badge, index) => (
                    <button
                        type="button"
                        onClick={() => setSelectedBadge(badge)}
                        aria-label={`Ver detalhes da medalha ${badge.name}`}
                        className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-amber-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        key={`${badge.name}-${index}`}
                    >
                        <Image
                            unoptimized
                            alt={badge.name}
                            src={badge.image_url}
                            width={130}
                            height={130}
                            className={`h-24 w-24 object-contain sm:h-28 sm:w-28 ${isObtained ? '' : 'opacity-60 grayscale'}`}
                        />
                        <span className="line-clamp-2 text-center text-sm font-medium text-slate-700">{badge.name}</span>
                    </button>
                ))}
            </div>
        )
    }
    
    return(
        <>
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/profile/${id}`)}
                className="w-fit gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            >
                <ArrowLeft aria-hidden="true" />
                Voltar ao perfil
            </Button>

            <section className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:flex-row sm:text-left">
                <AvatarIcon
                    name={name}
                    size={144}
                    src={profile_url}
                    className="h-28 w-28 shrink-0 border-4 border-white shadow-md sm:h-36 sm:w-36"
                />
                <div>
                    <h1 className="break-words text-3xl font-bold tracking-tight text-slate-900">{name}</h1>
                    <p className="mt-1 text-slate-500">Coleção de medalhas</p>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Medalhas</h2>
                <div className="space-y-3">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <button
                        type="button"
                        onClick={() => setIsObtainedOpen((prev) => !prev)}
                        aria-expanded={isObtainedOpen}
                        className="flex w-full cursor-pointer items-center justify-between px-4 py-4 text-left transition-colors hover:bg-slate-50"
                    >
                        <span className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                            Medalhas Obtidas
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-bold text-amber-800">
                                {badges.length}
                            </span>
                        </span>
                        {isObtainedOpen ? (
                            <ChevronDown className="size-5 text-slate-600" />
                        ) : (
                            <ChevronRight className="size-5 text-slate-600" />
                        )}
                    </button>

                    {isObtainedOpen && (
                        <div className="border-t border-slate-100 p-4 sm:p-5">
                            {renderBadgeGrid(badges, true)}
                        </div>
                    )}
                </div>

                {showNotObtainedBadges && (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <button
                            type="button"
                            onClick={() => setIsNotObtainedOpen((prev) => !prev)}
                            aria-expanded={isNotObtainedOpen}
                            className="flex w-full cursor-pointer items-center justify-between px-4 py-4 text-left transition-colors hover:bg-slate-50"
                        >
                            <span className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                                Medalhas Não Obtidas
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-bold text-slate-700">
                                    {not_obtained_badges.length}
                                </span>
                            </span>
                            {isNotObtainedOpen ? (
                                <ChevronDown className="size-5 text-slate-600" />
                            ) : (
                                <ChevronRight className="size-5 text-slate-600" />
                            )}
                        </button>

                        {isNotObtainedOpen && (
                            <div className="border-t border-slate-100 p-4 sm:p-5">
                                {renderBadgeGrid(not_obtained_badges, false)}
                            </div>
                        )}
                    </div>
                )}
                </div>
            </section>
        </div>

        <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && setSelectedBadge(null)}>
           <DialogContent className="flex w-[calc(100vw-2rem)] max-w-md flex-col items-center gap-6">
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
                            className="h-40 w-40 object-contain"
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