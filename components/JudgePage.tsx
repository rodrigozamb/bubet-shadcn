"use client"

import { CalendarDays, Gavel, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import AvatarIcon from "./AvatarIcon"

interface JudgePageProps {
    judge: {
        nickname: string
        first_name: string
        last_name: string
        avatar: string
        description: string
        events: {
            id: string
            name: string
            banner: string
        }[]
    }
}

export function JudgePage({ judge }: JudgePageProps) {
    const router = useRouter()
    const events = Array.isArray(judge.events) ? judge.events : []
    const fullName = [judge.first_name, judge.last_name].filter(Boolean).join(" ")
    const judgeName = judge.nickname || fullName || "Jurado"

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 p-6 text-white shadow-lg sm:p-10">
                <div aria-hidden="true" className="absolute -right-12 -top-20 size-64 rounded-full bg-blue-400/10 blur-2xl" />
                <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
                    <AvatarIcon
                        name={judgeName}
                        size={160}
                        src={judge.avatar}
                        className="h-36 w-36 shrink-0 border-4 border-white/20 shadow-xl sm:h-40 sm:w-40"
                    />

                    <div className="min-w-0 flex-1">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-blue-100">
                            <Gavel aria-hidden="true" className="size-4" />
                            Perfil do jurado
                        </div>
                        <h1 className="break-words text-3xl font-bold tracking-tight sm:text-4xl">{judgeName}</h1>
                        {fullName && fullName !== judgeName && (
                            <p className="mt-1 text-blue-100">{fullName}</p>
                        )}
                        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-blue-50/90 sm:text-base">
                            {judge.description?.trim() || "Este jurado ainda não adicionou uma descrição."}
                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3">
                            <Sparkles aria-hidden="true" className="size-5 text-amber-300" />
                            <span className="font-semibold">
                                {events.length} {events.length === 1 ? "evento julgado" : "eventos julgados"}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                            <CalendarDays aria-hidden="true" className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Eventos julgados</h2>
                            <p className="mt-1 text-sm text-slate-500">Competições que contaram com a avaliação deste jurado.</p>
                        </div>
                    </div>
                </div>

                {events.length > 0 ? (
                    <ul className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
                        {events.map((event) => (
                            <li key={event.id}>
                                <button
                                    type="button"
                                    onClick={() => router.push(`/events/${event.id}`)}
                                    className="group flex w-full min-w-0 items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-300 hover:bg-blue-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                                >
                                    <AvatarIcon
                                        name={event.name || "Evento"}
                                        src={event.banner}
                                        size={56}
                                        className="h-14 w-14 shrink-0 rounded-xl border border-slate-200"
                                    />
                                    <span className="min-w-0 flex-1 truncate font-semibold text-slate-800 group-hover:text-blue-900">
                                        {event.name || "Evento sem nome"}
                                    </span>
                                    <span aria-hidden="true" className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-800">
                                        →
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center px-6 py-12 text-center">
                        <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <CalendarDays aria-hidden="true" className="size-7" />
                        </div>
                        <h3 className="mt-4 font-semibold text-slate-800">Nenhum evento por enquanto</h3>
                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                            Este jurado ainda não julgou nenhum campeonato.
                        </p>
                    </div>
                )}
            </section>
        </div>
    )
}
