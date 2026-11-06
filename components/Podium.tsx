import { Award, Medal, Trophy } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import Link from "next/link"
import AvatarIcon from "./AvatarIcon"

interface PodiumProps {
    ranking: {
        id: string,
        name: string,
        profile_url: string
        score: string
        estandartes: {
            name: string
        }[]
    }[]
}

const places = [
    { position: 2, label: "2º lugar", color: "border-slate-300 bg-slate-50", Icon: Medal, avatarSize: 64 },
    { position: 1, label: "Campeão", color: "border-amber-300 bg-amber-50 sm:-translate-y-3", Icon: Trophy, avatarSize: 80 },
    { position: 3, label: "3º lugar", color: "border-orange-300 bg-orange-50", Icon: Award, avatarSize: 64 },
]

export function Podium({ ranking }: PodiumProps) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Classificação</p>
                    <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">Pódio oficial</h2>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <button type="button" className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800">
                            Ver ranking
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[85dvh] overflow-hidden sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Ranking geral</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[68dvh] space-y-2 overflow-y-auto pr-1">
                            {ranking.length > 0 ? ranking.map((competitor, index) => (
                                <div key={competitor.id} className="rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50">
                                    <Link href={`/competitors/${competitor.id}`} className="flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="w-8 shrink-0 text-center text-sm font-bold text-slate-500">{index + 1}º</span>
                                            <AvatarIcon name={competitor.name} size={40} src={competitor.profile_url} />
                                            <span className="truncate font-semibold text-slate-900">{competitor.name}</span>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-900">{competitor.score} pts</span>
                                    </Link>
                                    {competitor.estandartes.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2 pl-11">
                                            {competitor.estandartes.map((estandarte, estandarteIndex) => (
                                                <span key={`${competitor.id}-${estandarteIndex}`} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900">
                                                    {estandarte.name.replace("Estandarte de", "").trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="rounded-2xl bg-slate-50 px-4 py-10 text-center">
                                    <Trophy className="mx-auto mb-3 text-slate-400" size={30} aria-hidden="true" />
                                    <p className="font-semibold text-slate-800">Resultados em apuração</p>
                                    <p className="mt-1 text-sm text-slate-500">O ranking aparecerá quando os jurados enviarem as súmulas.</p>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {ranking.length > 0 ? (
                <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
                    {places.map(({ position, label, color, Icon, avatarSize }) => {
                        const competitor = ranking[position - 1]

                        return (
                            <div key={position} className={`flex min-w-0 flex-col items-center rounded-2xl border px-2 pb-3 pt-4 text-center sm:px-4 ${color}`}>
                                <Icon size={20} className={position === 1 ? "mb-2 text-amber-600" : "mb-2 text-slate-500"} aria-hidden="true" />
                                {competitor ? (
                                    <>
                                        <Link href={`/competitors/${competitor.id}`} className="flex w-full min-w-0 flex-col items-center gap-2">
                                            <AvatarIcon
                                                name={competitor.name}
                                                size={avatarSize}
                                                src={competitor.profile_url}
                                                className="ring-4 ring-white"
                                            />
                                            <span
                                                title={competitor.name}
                                                className="line-clamp-2 min-h-10 w-full break-words text-xs font-bold leading-5 text-slate-900 [overflow-wrap:anywhere] sm:text-sm"
                                            >
                                                {competitor.name}
                                            </span>
                                        </Link>
                                        <span className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">{competitor.score} pts</span>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center" style={{ height: avatarSize }}>
                                        <span className="text-xs font-medium text-slate-500">Aguardando</span>
                                        <span className="text-xs text-slate-400">resultado</span>
                                    </div>
                                )}
                                <span className="mt-3 w-full rounded-lg bg-white/80 py-2 text-xs font-extrabold text-slate-700 sm:text-sm">{label}</span>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center rounded-2xl bg-slate-50 px-4 py-9 text-center">
                    <Trophy size={34} className="mb-3 text-amber-500" aria-hidden="true" />
                    <p className="font-bold text-slate-800">Aguardando resultados</p>
                    <p className="mt-1 text-sm text-slate-500">O pódio será atualizado assim que as notas forem publicadas.</p>
                </div>
            )}
        </section>
    )
}
