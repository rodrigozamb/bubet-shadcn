"use client"

import { useRouter } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Clock3, Trophy } from "lucide-react";

interface BetProps {
  id: string;
  points: string;
  bets: {
    name: string;
  }[];
  event: {
    id: string;
    name: string;
    ends_at: string;
  };
}

interface BetListProps {
  bets: BetProps[];
}

const podiumStyles = [
  "bg-amber-100 text-amber-900 ring-amber-200",
  "bg-slate-100 text-slate-700 ring-slate-200",
  "bg-orange-100 text-orange-900 ring-orange-200",
];

export function BetsList({ bets }: BetListProps) {
  const router = useRouter();

  return (
    <section
      aria-labelledby="bets-heading"
      className="mt-auto rounded-3xl bg-slate-950 p-4 text-white shadow-[0_16px_48px_-26px_rgba(15,23,42,0.65)] sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
            Seu histórico
          </p>
          <h2 id="bets-heading" className="mt-1 flex items-center gap-2 text-xl font-bold sm:text-2xl">
            <Trophy className="h-5 w-5 text-amber-300" aria-hidden="true" />
            Minhas apostas
          </h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-medium text-slate-200">
          {bets.length} {bets.length === 1 ? "aposta" : "apostas"}
        </span>
      </div>

      <div className="max-h-[min(34rem,55vh)] overflow-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        {bets.length > 0 ? (
          <div role="list" aria-label="Suas apostas">
            <div className="sticky top-0 z-10 hidden grid-cols-12 items-center gap-3 border-b border-white/10 bg-slate-900 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid">
              <span className="col-span-5">Torneio</span>
              <span className="col-span-4">Seu pódio</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-1 text-right">Pontos</span>
            </div>

            {bets.map((item) => {
              const endTime = Date.parse(item.event.ends_at);
              const isFinished = Number.isFinite(endTime) && endTime <= Date.now();

              return (
                <div key={item.id} role="listitem" className="border-b border-white/10 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => router.push(`/events/${item.event.id}`)}
                    aria-label={`Ver aposta para ${item.event.name}`}
                    className="grid w-full grid-cols-2 gap-x-3 gap-y-3 px-4 py-4 text-left transition-colors hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 sm:px-5 md:grid-cols-12 md:items-center md:gap-3"
                  >
                  <span className="col-span-2 flex min-w-0 items-center justify-between gap-3 md:col-span-5">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-white">{item.event.name}</span>
                      <span className="mt-1 block text-xs text-slate-400 md:hidden">
                        {item.bets.length} {item.bets.length === 1 ? "palpite" : "palpites"}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 md:mr-2" aria-hidden="true" />
                  </span>

                  <span className="col-span-2 flex min-w-0 flex-wrap gap-1.5 md:col-span-4">
                    {item.bets.length > 0 ? (
                      item.bets.slice(0, 3).map((bet, index) => (
                        <span
                          key={`${item.id}-${index}`}
                          title={`${index + 1}º lugar: ${bet.name}`}
                          className={`max-w-full truncate rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${podiumStyles[index]}`}
                        >
                          <span className="mr-1 opacity-70">{index + 1}º</span>
                          {bet.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">Sem palpites registrados</span>
                    )}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-medium sm:text-sm md:col-span-2">
                    {isFinished ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                        <span className="text-emerald-300">Encerrado</span>
                      </>
                    ) : (
                      <>
                        <Clock3 className="h-4 w-4 text-sky-300" aria-hidden="true" />
                        <span className="text-sky-200">Em andamento</span>
                      </>
                    )}
                  </span>

                  <span className="justify-self-end text-right md:col-span-1">
                    <span className="block text-xs text-slate-400 md:hidden">Pontos</span>
                    <span className="font-bold tabular-nums text-amber-300">{item.points ?? "—"}</span>
                  </span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-44 flex-col items-center justify-center px-5 py-8 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-slate-300">
              <Trophy className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 font-semibold text-white">Suas apostas aparecerão aqui</p>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Escolha um torneio acima e faça seus palpites para acompanhar seus pontos.
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        Plataforma desenvolvida por{" "}
        <a
          className="font-semibold text-slate-300 underline-offset-4 transition-colors hover:text-white hover:underline"
          href="https://www.linkedin.com/in/rodrigozamboni/"
          target="_blank"
          rel="noreferrer"
        >
          Rodrigo Zamboni
        </a>
      </p>
    </section>
  );
}
