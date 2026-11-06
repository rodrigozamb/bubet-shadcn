"use client"

import { CalendarDays, Clock3, Images, MapPin, Scale } from "lucide-react"
import { useRouter } from "next/navigation"
import AvatarIcon from "./AvatarIcon"

interface InfoPanelProps {
    name: string,
    date: string,
    local: string,
    time: string,
    event_id: string,
    judges: {
        id: string,
        nickname: string
        avatar: string
    }[]
}

export function InfoPanel({ name, date, local, time, judges, event_id }: InfoPanelProps) {
    const router = useRouter()

    const details = [
        { label: "Data", value: date, Icon: CalendarDays },
        { label: "Horário", value: time, Icon: Clock3 },
        { label: "Local", value: local, Icon: MapPin },
    ]

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 px-5 py-8 text-white sm:px-8 sm:py-10">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">Detalhes do evento</p>
                        <h1 className="break-words text-3xl font-extrabold tracking-tight sm:text-4xl">{name}</h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push(`/events/${event_id}/album`)}
                        className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                        <Images size={18} aria-hidden="true" />
                        Álbum do evento
                    </button>
                </div>
            </div>

            <div className="space-y-7 p-5 sm:p-8">
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {details.map(({ label, value, Icon }) => (
                        <div key={label} className="flex min-w-0 items-start gap-3 rounded-2xl bg-slate-50 p-4">
                            <span className="rounded-xl bg-blue-100 p-2 text-blue-800">
                                <Icon size={19} aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                                <dd className="mt-1 break-words font-semibold text-slate-900">{value || "A definir"}</dd>
                            </div>
                        </div>
                    ))}
                </dl>

                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <Scale size={18} className="text-blue-800" aria-hidden="true" />
                        <h2 className="font-bold text-slate-900">Jurados</h2>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{judges.length}</span>
                    </div>
                    {judges.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {judges.map((judge) => (
                                <button
                                    type="button"
                                    key={judge.id}
                                    onClick={() => router.push(`/judges/${judge.id}`)}
                                    className="flex min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                >
                                    <AvatarIcon name={judge.nickname} src={judge.avatar} size={34} />
                                    <span className="max-w-40 truncate">{judge.nickname}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500">Os jurados ainda não foram definidos.</p>
                    )}
                </div>
            </div>
        </section>
    )
}
