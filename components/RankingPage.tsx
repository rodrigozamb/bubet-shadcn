"use client";

import AvatarIcon from "./AvatarIcon";
import { useRouter } from "next/navigation";
import { Award, Crown, Medal, Trophy } from "lucide-react";

export interface RankingEntry {
  id: string;
  name: string;
  profile_url: string;
  position: number;
  username: string;
  points: number;
}

interface RankingPageProps {
  ranking: RankingEntry[];
  userRanking: RankingEntry | null;
}

function PositionIcon({ position }: { position: number }) {
  if (position === 1) {
    return <Trophy className="h-5 w-5 text-amber-500" aria-label="1º lugar" />;
  }

  if (position === 2) {
    return <Medal className="h-5 w-5 text-slate-400" aria-label="2º lugar" />;
  }

  if (position === 3) {
    return <Award className="h-5 w-5 text-orange-500" aria-label="3º lugar" />;
  }

  return null;
}

export function RankingPage({ ranking, userRanking }: RankingPageProps) {
  const router = useRouter();
  const orderedRanking = [
    ...ranking
      .filter((entry) => entry.points > 0)
      .sort((a, b) => b.points - a.points || a.position - b.position),
    ...ranking.filter((entry) => entry.points <= 0),
  ];

  const openProfile = (id: string) => router.push(`/profile/${id}`);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 p-6 text-white shadow-lg sm:p-9">
        <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-100">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
              PLACAR DA COMUNIDADE
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Ranking Geral</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
              Confira quem está liderando e acompanhe sua pontuação na disputa.
            </p>
          </div>
          <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Crown className="h-5 w-5 text-amber-300" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{ranking.length}</p>
              <p className="mt-1 text-xs text-blue-100">
                {ranking.length === 1 ? "participante" : "participantes"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold text-slate-900">Classificação</h2>
            <p className="mt-0.5 text-sm text-slate-500">Pontuação acumulada dos participantes</p>
          </div>
          <span className="hidden text-xs font-medium uppercase tracking-wide text-slate-400 sm:block">
            Pontos
          </span>
        </div>

        {orderedRanking.length > 0 ? (
          <ol className="max-h-[min(60vh,38rem)] overflow-y-auto p-2 sm:p-3">
            {orderedRanking.map((entry) => {
              const isCurrentUser = userRanking?.id === entry.id;
              const hasPosition = entry.position > 0;

              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => openProfile(entry.id)}
                    aria-label={`Ver perfil de ${entry.name}, ${hasPosition ? `${entry.position}º lugar` : "sem classificação"}, ${entry.points} pontos`}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:gap-4 sm:px-4 ${
                      isCurrentUser ? "bg-blue-50/80 hover:bg-blue-50" : ""
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                        entry.position === 1
                          ? "bg-amber-100 text-amber-700"
                          : entry.position === 2
                            ? "bg-slate-100 text-slate-600"
                            : entry.position === 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      {hasPosition ? entry.position : "—"}
                    </span>
                    <AvatarIcon
                      name={entry.name}
                      src={entry.profile_url}
                      size={42}
                      className="h-[42px] w-[42px] shrink-0 border border-slate-200"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-semibold text-slate-800 group-hover:text-blue-900">
                          {entry.name}
                        </span>
                        {isCurrentUser && (
                          <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-800">
                            Você
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {hasPosition ? `${entry.position}º lugar` : "Ainda sem pontuação"}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 sm:min-w-24 sm:justify-end sm:px-3">
                      <PositionIcon position={entry.position} />
                      <span className="font-bold tabular-nums text-slate-800">{entry.points}</span>
                      <span className="hidden text-xs text-slate-500 sm:inline">pts</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="px-6 py-12 text-center">
            <Trophy className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
            <p className="mt-3 font-medium text-slate-700">Ainda não há participantes no ranking</p>
            <p className="mt-1 text-sm text-slate-500">Volte mais tarde para conferir a classificação.</p>
          </div>
        )}
      </section>

      {userRanking ? (
        <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-950">
            <Crown className="h-4 w-4 text-blue-700" aria-hidden="true" />
            Sua posição
          </div>
          <button
            type="button"
            onClick={() => openProfile(userRanking.id)}
            className="flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:gap-4 sm:p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-800">
              {userRanking.position > 0 ? userRanking.position : "—"}
            </span>
            <AvatarIcon
              name={userRanking.name}
              src={userRanking.profile_url}
              size={42}
              className="h-[42px] w-[42px] shrink-0 border border-slate-200"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-slate-900">{userRanking.name}</span>
              <span className="mt-0.5 block text-xs text-slate-500">
                {userRanking.position > 0 ? `${userRanking.position}º lugar` : "Ainda sem pontuação"}
              </span>
            </span>
            <span className="shrink-0 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold tabular-nums text-blue-900">
              {userRanking.points} <span className="font-medium">pts</span>
            </span>
          </button>
        </section>
      ) : (
        <p className="mt-4 text-center text-sm text-slate-500">
          Sua posição ainda não está disponível no ranking.
        </p>
      )}
    </main>
  );
}
