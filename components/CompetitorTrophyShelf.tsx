"use client";

import { Trophy } from "lucide-react";
import { TrophyModelGallery } from "@/components/TrophyModelGallery";
import type { Prize, PrizeType } from "@/components/TrophyModelGallery";

interface CompetitorTrophyShelfProps {
  competitorName: string;
  prizes: Prize[];
}

const shelves: {
  key: PrizeType;
  title: string;
  placement: string;
  marker: string;
  headerClassName: string;
  placementClassName: string;
}[] = [
  {
    key: "PRIMEIRO",
    title: "Campeão",
    placement: "1º lugar",
    marker: "1º",
    headerClassName: "border-amber-500 bg-amber-50 text-amber-950",
    placementClassName: "bg-amber-200 text-amber-950",
  },
  {
    key: "SEGUNDO",
    title: "Vice-campeão",
    placement: "2º lugar",
    marker: "2º",
    headerClassName: "border-slate-400 bg-slate-50 text-slate-900",
    placementClassName: "bg-slate-200 text-slate-900",
  },
  {
    key: "TERCEIRO",
    title: "3º Lugar",
    placement: "3º lugar",
    marker: "3º",
    headerClassName: "border-orange-700 bg-orange-50 text-orange-950",
    placementClassName: "bg-orange-200 text-orange-950",
  },
  {
    key: "ESTANDARTE",
    title: "Estandartes",
    placement: "conquistas especiais",
    marker: "★",
    headerClassName: "border-teal-700 bg-teal-50 text-teal-950",
    placementClassName: "bg-teal-200 text-teal-950",
  },
] as const;

export function CompetitorTrophyShelf({
  competitorName,
  prizes,
}: CompetitorTrophyShelfProps) {
  const total = prizes.length;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
            Salinha da Bateria
          </p>
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            Prateleira de {competitorName}
          </h1>
        </div>
        <div className="flex items-center gap-2 border-b-2 border-amber-600 pb-2 text-stone-700">
          <Trophy aria-hidden="true" className="size-5 text-amber-600" />
          <span className="text-sm font-semibold">{total} prêmios</span>
        </div>
      </header>

      <div className="overflow-hidden border-x-[10px] border-t-[10px] border-[#64452f] bg-[#e7e4d8] shadow-[0_18px_35px_rgba(48,36,25,0.18)] sm:border-x-[16px] sm:border-t-[16px]">
        <div className="space-y-0 bg-[linear-gradient(135deg,#efede4_25%,#e8e5da_25%,#e8e5da_50%,#efede4_50%,#efede4_75%,#e8e5da_75%)] bg-[length:24px_24px] p-3 sm:p-6">
          {shelves.map((shelf) => {
            const shelfPrizes = prizes.filter((prize) => prize.type === shelf.key);

            return (
              <section
                aria-label={`${shelf.title}: ${shelfPrizes.length}`}
                className="pt-4"
                key={shelf.key}
              >
                <header
                  className={`mb-2 flex items-center justify-between gap-3 border-l-4 px-3 py-2 ${shelf.headerClassName} sm:px-4`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-extrabold ${shelf.placementClassName}`}
                    >
                      {shelf.marker}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-75 sm:text-xs">
                        {shelf.placement}
                      </p>
                      <h2 className="truncate text-base font-extrabold sm:text-lg">
                        {shelf.title}
                      </h2>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
                    {shelfPrizes.length} {shelfPrizes.length === 1 ? "prêmio" : "prêmios"}
                  </span>
                </header>
                {shelfPrizes.length > 0 ? (
                  <TrophyModelGallery prizes={shelfPrizes} shelfTitle={shelf.title} />
                ) : (
                  <div className="flex min-h-36 items-center px-2 text-sm text-stone-500 sm:min-h-44 sm:px-5">
                    Nenhum prêmio nesta categoria ainda
                  </div>
                )}
                <div className="relative z-10 h-3 bg-[linear-gradient(180deg,#a77a50_0%,#805638_42%,#5f3e2b_100%)] shadow-[0_7px_10px_rgba(50,35,22,0.22)] sm:h-4" />
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}