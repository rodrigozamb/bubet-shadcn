"use client"

import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { useState } from "react"
import { BetSheet } from "./BetSheet"
import AvatarIcon from "./AvatarIcon"
import Link from "next/link"
import { ArrowUpRight, CalendarDays, Check, CircleHelp, Medal, Search, TicketPercent, Trophy } from "lucide-react"


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


export function BetPanel({ allBets, userBet, competitors, estandartes, event_active = true , cupons, results}:BetsPanelProps){

    const [searchTerm, setSearchTerm] = useState("");
    const apostas = allBets.filter((item) =>
      item.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPlacementPoints = (index: number) => {
        if (results.length === 0) return 0
        return results.length - index
    }

    return (

        <section className="min-w-0 rounded-3xl bg-blue-950 px-4 py-5 shadow-sm sm:px-6 sm:py-7">

            <div className="min-w-0">
                
                <div className="flex justify-center">
                    <div className="w-full min-w-0">
                        <h2 className="mb-4 text-center text-2xl font-bold text-white sm:text-3xl">Sua aposta</h2>

                        {

                            userBet ? 
                            <div className="mx-auto w-full max-w-[920px] rounded-3xl bg-white p-4 sm:p-6">
                                <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Seu palpite</p>
                                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                            {results.length > 0 ? (
                                                <><Check size={14} className="text-emerald-600" aria-hidden="true" /> Resultado publicado · acertos destacados</>
                                            ) : (
                                                <><CircleHelp size={14} className="text-blue-700" aria-hidden="true" /> Aguardando resultado oficial</>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600">
                                            <CalendarDays size={14} aria-hidden="true" />
                                            {userBet.created_at.split("T")[0].split("-").reverse().join("/")}
                                        </span>
                                        {userBet.cupons && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-800">
                                                <TicketPercent size={14} aria-hidden="true" />
                                                Cupom de {userBet.cupons.value}% aplicado
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl bg-blue-950 px-4 py-3 text-white sm:px-5">
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-xl bg-white/10 p-2 text-amber-300">
                                            <Trophy size={20} aria-hidden="true" />
                                        </span>
                                        <div>
                                            <p className="text-xs font-medium text-blue-100">Pontuação</p>
                                            <p className="text-sm text-white/75">neste evento</p>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-extrabold tabular-nums sm:text-3xl">
                                        {userBet.points}<span className="ml-1 text-sm font-semibold text-blue-100">pts</span>
                                    </p>
                                </div>

                                {userBet.bets.length > 0 ? (
                                    <>
                                        <div className="mb-3 flex items-center gap-2">
                                            <Medal size={17} className="text-amber-600" aria-hidden="true" />
                                            <h3 className="text-sm font-bold text-slate-800">Pódio previsto</h3>
                                        </div>
                                        <div className="grid grid-cols-1 items-end gap-2 sm:grid-cols-3 sm:gap-3">
                                            {[1, 0, 2]
                                                .filter((position) => Boolean(userBet.bets[position]))
                                                .map((position) => {
                                                    const competitor = userBet.bets[position]
                                                    const isCorrectPosition = results.length > 0 && results[position]?.name === competitor.name
                                                    const placementPoints = isCorrectPosition ? getPlacementPoints(position) : 0
                                                    const medalStyle = position === 0
                                                        ? "border-amber-300 bg-amber-50"
                                                        : position === 1
                                                            ? "border-slate-300 bg-slate-50"
                                                            : "border-orange-300 bg-orange-50"

                                                    return (
                                                        <div
                                                            key={position}
                                                            className={`flex min-w-0 items-center gap-3 rounded-2xl border p-3 sm:flex-col sm:justify-center sm:px-3 sm:py-4 sm:text-center ${medalStyle} ${position === 0 ? "sm:-translate-y-2" : ""} ${isCorrectPosition ? "ring-2 ring-emerald-500 ring-offset-1" : ""}`}
                                                        >
                                                            <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${position === 0 ? "bg-amber-300 text-amber-950" : position === 1 ? "bg-slate-300 text-slate-800" : "bg-orange-300 text-orange-950"}`}>
                                                                {position + 1}º
                                                            </span>
                                                            <span className="min-w-0 flex-1 break-words text-sm font-bold text-slate-900 sm:min-h-10 sm:flex-none sm:content-center">
                                                                {competitor.name}
                                                            </span>
                                                            <span className="ml-auto shrink-0 text-right sm:ml-0">
                                                                <span className="block text-xs font-semibold text-slate-500">
                                                                    {position === 0 ? "Campeão" : `${position + 1}º lugar`}
                                                                </span>
                                                                {isCorrectPosition && (
                                                                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                                                                        <Check size={12} aria-hidden="true" /> +{placementPoints} pts
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                        </div>

                                        {userBet.bets.length > 3 && (
                                            <div className="mt-5">
                                                <h3 className="mb-3 text-sm font-bold text-slate-800">Demais colocações</h3>
                                                <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                    {userBet.bets.slice(3).map((competitor, index) => {
                                                        const position = index + 3
                                                        const isCorrectPosition = results.length > 0 && results[position]?.name === competitor.name
                                                        const placementPoints = isCorrectPosition ? getPlacementPoints(position) : 0

                                                        return (
                                                            <li
                                                                className={`flex min-w-0 items-center gap-3 rounded-xl border px-3 py-2.5 ${isCorrectPosition ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}
                                                                key={position}
                                                            >
                                                                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">{position + 1}º</span>
                                                                <span className="min-w-0 flex-1 break-words text-sm font-medium text-slate-800">{competitor.name}</span>
                                                                {isCorrectPosition && (
                                                                    <span className="shrink-0 text-xs font-bold text-emerald-800">+{placementPoints} pts</span>
                                                                )}
                                                            </li>
                                                        )
                                                    })}
                                                </ol>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                                        Esta aposta ainda não possui colocações registradas.
                                    </p>
                                )}

                                {userBet.estandartes.length > 0 && (
                                    <div className="mt-6 border-t border-slate-100 pt-5">
                                        <h3 className="mb-3 text-sm font-bold text-slate-800">Estandartes apostados</h3>
                                        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                            {userBet.estandartes.map((estandarte, index) => (
                                                <li className="min-w-0 rounded-xl border border-amber-200 bg-amber-50 p-3" key={`${estandarte.bannerType.name}-${index}`}>
                                                    <span className="block text-xs font-semibold uppercase tracking-wide text-amber-800">
                                                        {estandarte.bannerType.name.replace("Estandarte de", "").trim()}
                                                    </span>
                                                    <span className="mt-1 block break-words text-sm font-semibold text-slate-800">
                                                        {estandarte.competitor.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
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

                <div className="mt-8 flex flex-col justify-center border-t border-white/15 pt-6">
                    <div className="mb-4 text-center">
                        <h2 className="text-2xl font-bold text-white sm:text-3xl">Todas as apostas</h2>
                        <p className="mt-1 text-sm text-blue-100">Confira os palpites e a pontuação da galera.</p>
                    </div>
                    <Dialog>
                        <div className="flex justify-center items-center">
                            <DialogTrigger asChild>
                                <Button className="h-12 w-full max-w-xs cursor-pointer rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-6 text-base font-semibold text-white shadow-lg transition hover:opacity-90">
                                    Ver apostas <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-sm">{allBets.length}</span>
                                </Button>
                            </DialogTrigger>
                        </div>
                        <DialogContent className="flex max-h-[90dvh] flex-col gap-4 overflow-hidden p-4 sm:max-w-2xl sm:p-6 xl:max-w-4xl">
                            <DialogHeader className="pr-8">
                                <DialogTitle className="text-xl sm:text-2xl">Todas as apostas</DialogTitle>
                                <p className="text-sm text-muted-foreground">Busque pelo nome e abra um palpite para ver os detalhes.</p>
                            </DialogHeader>
                            <div className="flex min-h-0 flex-col">
                                <label className="relative mb-3 block">
                                    <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                                    <Input className="w-full pl-10 pr-16" type="search" aria-label="Pesquisar apostas por nome" placeholder="Pesquisar participante..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">{apostas.length} de {allBets.length}</span>
                                </label>
                                <div className="max-h-[65dvh] min-h-0 space-y-2 overflow-y-auto overscroll-contain pr-1">
                                    {
                                        apostas.length > 0 ?
                                            apostas.map((bet)=>(
                                                <article className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4" key={`${bet.user.id}-${bet.created_at}`}>
                                                    <Link href={`/profile/${bet.user.id}`} className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                                                        <AvatarIcon name={bet.user.name} size={44} src={bet.user.profile_url} />
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block truncate font-semibold text-slate-900">{bet.user.name}</span>
                                                            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                                                                <span className="inline-flex items-center gap-1"><CalendarDays size={12} aria-hidden="true" />{bet.created_at.split("T")[0].split("-").reverse().join("/")}</span>
                                                                <span>{bet.bets.length} colocações</span>
                                                            </span>
                                                        </span>
                                                        <ArrowUpRight size={15} className="shrink-0 text-slate-400" aria-label="Abrir perfil" />
                                                    </Link>

                                                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:justify-end sm:border-0 sm:pt-0">
                                                        <div className="flex min-w-0 flex-wrap gap-1.5" aria-label="Primeiras colocações da aposta">
                                                            {bet.bets.slice(0, 3).map((competitor, position) => (
                                                                <span key={`${position}-${competitor.name}`} className="max-w-28 truncate rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                                    {position + 1}º {competitor.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="flex shrink-0 items-center gap-3">
                                                            <span className="text-right">
                                                                <span className="block text-lg font-extrabold leading-tight text-blue-950">{bet.points}</span>
                                                                <span className="text-[11px] font-medium text-slate-500">pontos</span>
                                                            </span>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" className="h-9 shrink-0 rounded-full border-blue-200 px-3 text-xs font-semibold text-blue-800 hover:bg-blue-50 sm:px-4">Detalhes</Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
                                                                <DialogHeader>
                                                                    <DialogTitle>Aposta de {bet.user.name}</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="space-y-4">
                                                                    <div className="flex items-center justify-between rounded-xl bg-blue-950 px-4 py-3 text-white">
                                                                        <span className="text-sm font-medium text-blue-100">Pontuação total</span>
                                                                        <span className="text-xl font-extrabold">{bet.points} pts</span>
                                                                    </div>
                                                                    <ol className="space-y-1.5">
                                                                        {bet.bets.map((competitor, i) => {
                                                                            const isCorrectPosition = results.length > 0 && results[i]?.name === competitor.name
                                                                            const placementPoints = isCorrectPosition ? getPlacementPoints(i) : 0

                                                                            return (
                                                                                <li
                                                                                    key={`${i}-${competitor.name}`}
                                                                                    className={`flex min-w-0 items-center gap-3 rounded-xl border px-3 py-2.5 ${isCorrectPosition ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50"}`}
                                                                                >
                                                                                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-600">{i + 1}</span>
                                                                                    <span className="min-w-0 flex-1 break-words text-sm font-medium text-slate-800">{competitor.name}</span>
                                                                                    {isCorrectPosition && (
                                                                                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-800"><Check size={13} aria-hidden="true" /> +{placementPoints} pts</span>
                                                                                    )}
                                                                                </li>
                                                                            )
                                                                        })}
                                                                    </ol>
                                                                    {results.length > 0 && !bet.bets.some((competitor, i) => results[i]?.name === competitor.name) && (
                                                                        <p className="text-center text-sm text-slate-500">Nenhuma colocação acertada.</p>
                                                                    )}
                                                                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-sm text-slate-500">
                                                                        <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} aria-hidden="true" />Feita em {bet.created_at.split("T")[0].split("-").reverse().join("/")}</span>
                                                                        {results.length > 0 && (
                                                                            <span className="text-xs font-medium text-slate-500">Acertos destacados em verde</span>
                                                                        )}
                                                                    </div>
                                                                    {bet.cupons && (
                                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                                                                            <TicketPercent size={14} aria-hidden="true" /> Cupom de {bet.cupons.value}% aplicado
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                        </div>
                                                    </div>
                                                </article>
                                            ))
                                        :
                                            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center">
                                                <Search size={24} className="mb-3 text-slate-400" aria-hidden="true" />
                                                <span className="font-semibold text-slate-800">
                                                    {allBets.length === 0 ? "Ainda não há apostas neste evento" : "Nenhuma aposta encontrada"}
                                                </span>
                                                <span className="mt-1 text-sm text-slate-500">
                                                    {allBets.length === 0 ? "Quando os participantes apostarem, elas aparecerão aqui." : "Tente buscar por outro nome."}
                                                </span>
                                            </div>
                                        

                                    }


                                    
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </section>
    )
}