import Link from "next/link"
import AvatarIcon from "./AvatarIcon"

interface CompetitorsListProps {
    competitors: {
        id: string,
        profile_url: string,
        name: string,
    }[]
}

export function CompetitorsList({ competitors }: CompetitorsListProps) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Quem participa</p>
                    <h2 className="mt-1 text-xl font-extrabold text-slate-900">Participantes</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{competitors.length}</span>
            </div>

            {competitors.length > 0 ? (
                <ul className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                    {competitors.map((competitor) => (
                        <li key={competitor.id}>
                            <Link
                                href={`/competitors/${competitor.id}`}
                                className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50 p-2.5 transition hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                            >
                                <AvatarIcon name={competitor.name} size={40} src={competitor.profile_url} />
                                <span className="min-w-0 truncate font-medium text-slate-800">{competitor.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center">
                    <p className="font-semibold text-slate-800">Nenhum participante cadastrado</p>
                    <p className="mt-1 text-sm text-slate-500">A lista será exibida quando os participantes forem adicionados.</p>
                </div>
            )}
        </section>
    )
}
