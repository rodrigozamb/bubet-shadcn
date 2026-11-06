import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useParams, useRouter } from "next/navigation";
import AvatarIcon from "./AvatarIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ProfilePageProps {
    profile: {
        name: string
        profile_url: string
        position: string
        created_at: string
        favorite_competitor?: {
            id: string
            name: string
            profile_url: string
        }
    }
    bets: UserBetProps[]
}

interface EventProps {
    id: string
    name: string
    banner: string
}

interface BetProps {
    name: string
}

interface UserBetProps {
    bets: BetProps[]
    points: string
    event: EventProps
    created_at: string
}

function formatDate(date: string) {
    return date.split("T")[0].split("-").reverse().join("/")
}

export function ProfilePage({ profile, bets }: ProfilePageProps) {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const userPoints = bets.reduce((total, bet) => total + Number(bet.points), 0)
    const favoriteCompetitor = profile.favorite_competitor

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <div className="relative h-40 w-40 shrink-0 sm:h-48 sm:w-48">
                        <AvatarIcon
                            name={profile.name}
                            size={192}
                            src={profile.profile_url}
                            className="h-full w-full"
                        />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    aria-label={favoriteCompetitor ? `Bateria favorita: ${favoriteCompetitor.name}` : "Sem bateria favorita"}
                                    onClick={() => favoriteCompetitor && router.push(`/competitors/${favoriteCompetitor.id}`)}
                                    className="absolute -bottom-1 -right-1 rounded-full border-4 border-white bg-white"
                                >
                                    <AvatarIcon
                                        name={favoriteCompetitor?.name ?? "Sem Bateria Favorita"}
                                        size={60}
                                        src={favoriteCompetitor?.profile_url || "https://bubet-bucket.s3.sa-east-1.amazonaws.com/logos/no-competitor"}
                                        className="h-[60px] w-[60px] border border-slate-200"
                                    />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Bateria Favorita</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="min-w-0 flex-1 text-center sm:text-left">
                        <h1 className="break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            {profile.name}
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            No BUBet desde {formatDate(profile.created_at)}
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
                                <p className="text-sm font-medium text-slate-500">Pontos</p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">{userPoints}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
                                <p className="text-sm font-medium text-slate-500">Ranking</p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">{profile.position}º</p>
                            </div>
                            <div className="col-span-2 flex items-center justify-center sm:col-span-1">
                                <Button
                                    className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 font-bold text-white transition-colors hover:from-amber-700 hover:via-amber-600 hover:to-amber-700 focus-visible:ring-amber-600/30"
                                    onClick={() => router.push(`/profile/${params.id}/badges`)}
                                >
                                    Ver medalhas
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                    <h2 className="text-2xl font-bold text-slate-900">Apostas</h2>
                    <p className="mt-1 text-sm text-slate-500">Confira as apostas feitas por {profile.name}.</p>
                </div>

                <div className="max-h-[28rem] space-y-3 overflow-y-auto p-4 sm:p-6">
                    {bets.length > 0 ? (
                        bets.map((bet) => (
                            <article
                                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                                key={bet.event.id}
                            >
                                <button
                                    type="button"
                                    onClick={() => router.push(`/events/${bet.event.id}`)}
                                    className="flex min-w-0 items-center gap-3 text-left"
                                >
                                    <AvatarIcon
                                        name={bet.event.name}
                                        src={bet.event.banner}
                                        size={48}
                                        className="h-12 w-12 shrink-0 border border-slate-200"
                                    />
                                    <span className="truncate font-semibold text-slate-800">{bet.event.name}</span>
                                </button>

                                <div className="flex items-center justify-between gap-4 sm:justify-end">
                                    <div className="text-center">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pontos</p>
                                        <p className="font-bold text-slate-900">{bet.points}</p>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="shrink-0">
                                                Ver aposta
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
                                            <DialogHeader>
                                                <DialogTitle>Apostas de {profile.name}</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
                                                <ol className="min-w-0 flex-1 space-y-1">
                                                    {bet.bets.map((competitor, index) => (
                                                        <li className="break-words" key={`${competitor.name}-${index}`}>
                                                            {index + 1}º - {competitor.name}
                                                        </li>
                                                    ))}
                                                </ol>
                                                <div className="shrink-0 text-center sm:text-right">
                                                    <p className="text-xl font-bold">Pontos</p>
                                                    <p className="text-xl">{bet.points}</p>
                                                    <p className="mt-4 text-sm text-slate-500">
                                                        Aposta feita em: {formatDate(bet.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="flex min-h-40 items-center justify-center rounded-xl bg-slate-50 px-4 text-center">
                            <p className="font-medium text-slate-600">Este usuário ainda não fez uma aposta.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
