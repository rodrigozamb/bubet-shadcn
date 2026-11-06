"use client";

import AvatarIcon from "./AvatarIcon";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { Award, ChevronRight, Medal, Trophy } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";

interface EventResultData {
  eventId: string;
  placing: string;
  score: number;
  event: {
    name: string;
    banner: string;
  };
}

interface CompetitorPageProps {
  competitor: {
    name: string;
    description: string;
    avatar: string;
    socials: {
      type: string;
      name: string;
    }[];
  };
  stats: {
    first: EventResultData[];
    second: EventResultData[];
    third: EventResultData[];
    others: EventResultData[];
    all: number;
  };
}

interface ResultsSheetProps {
  description: string;
  results: EventResultData[];
  title: string;
  accent: string;
}

function ResultsSheet({
  description,
  results,
  title,
  accent,
}: ResultsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="group flex min-h-36 flex-col items-start justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
        >
          <span className={`grid size-10 place-items-center rounded-xl ${accent}`}>
            <Trophy aria-hidden="true" className="size-5" />
          </span>
          <span className="mt-4 flex w-full items-end justify-between gap-3">
            <span>
              <span className="block text-2xl font-bold tracking-tight text-slate-900">
                {results.length}
              </span>
              <span className="mt-0.5 block text-sm font-medium text-slate-600">
                {title}
              </span>
            </span>
            <ChevronRight
              aria-hidden="true"
              className="mb-1 size-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700"
            />
          </span>
        </button>
      </SheetTrigger>

      <SheetContent className="w-full gap-0 border-slate-200 bg-white p-0 text-slate-900 sm:max-w-lg">
        <SheetHeader className="border-b border-slate-200 px-6 py-6 pr-14 text-left">
          <SheetTitle className="text-xl font-bold text-slate-900">
            {title}
          </SheetTitle>
          <SheetDescription className="text-slate-600">
            {description}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
          {results.length > 0 ? (
            results.map((result) => (
              <SheetClose asChild key={result.eventId}>
                <Link
                  href={`/events/${result.eventId}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-teal-300 hover:bg-teal-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                >
                  {result.event.banner ? (
                    <Image
                      unoptimized
                      className="size-14 shrink-0 rounded-lg object-cover"
                      src={result.event.banner}
                      alt=""
                      width={56}
                      height={56}
                    />
                  ) : (
                    <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                      <Medal aria-hidden="true" className="size-6" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-slate-900">
                      {result.event.name}
                    </span>
                    {result.placing && (
                      <span className="mt-1 block text-xs text-slate-500">
                        {result.placing}º lugar
                      </span>
                    )}
                  </span>
                  <ChevronRight
                    aria-hidden="true"
                    className="size-5 shrink-0 text-slate-400"
                  />
                </Link>
              </SheetClose>
            ))
          ) : (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-6 text-center">
              <Award aria-hidden="true" className="size-8 text-slate-400" />
              <p className="mt-3 font-semibold text-slate-700">
                Nenhum resultado por aqui ainda
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Os próximos torneios aparecerão nesta lista.
              </p>
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-slate-200 p-4 sm:p-6">
          <SheetClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Fechar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function getSocialUrl(type: string, value: string) {
  const trimmedValue = value.trim();
  if (/^https?:\/\//i.test(trimmedValue)) return trimmedValue;

  if (type === "INSTAGRAM") {
    return `https://www.instagram.com/${trimmedValue.replace(/^@/, "")}`;
  }
  if (type === "YOUTUBE") {
    return `https://www.youtube.com/${trimmedValue.replace(/^\/+/, "")}`;
  }
  return null;
}

export function CompetitorPage({ competitor, stats }: CompetitorPageProps) {
  const podiumCount =
    stats.first.length + stats.second.length + stats.third.length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(ellipse_at_top,_#e6f4f1_0%,_#f8fafc_48%,_#f8fafc_100%)]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-900/10">
          <div className="bg-[radial-gradient(ellipse_at_top_right,_rgba(13,148,136,0.35),_transparent_55%)] px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
              <AvatarIcon
                name={competitor.name}
                size={128}
                src={competitor.avatar}
                className="size-28 shrink-0 rounded-full border-4 border-white/15 shadow-lg sm:size-32"
              />

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
                  Perfil do competidor
                </p>
                <h1 className="mt-2 break-words text-3xl font-bold tracking-tight sm:text-4xl">
                  {competitor.name}
                </h1>
                <p className="mt-2 text-sm text-slate-300">
                  {stats.all} {stats.all === 1 ? "torneio disputado" : "torneios disputados"}
                  {podiumCount > 0 && (
                    <span> · {podiumCount} {podiumCount === 1 ? "pódio" : "pódios"}</span>
                  )}
                </p>

                {competitor.socials.length > 0 && (
                  <nav
                    aria-label={`Redes sociais de ${competitor.name}`}
                    className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start"
                  >
                    {competitor.socials.map((social, index) => {
                      const href = getSocialUrl(social.type, social.name);
                      if (!href) return null;

                      const isInstagram = social.type === "INSTAGRAM";
                      const label = isInstagram ? "Instagram" : "YouTube";
                      const Icon = isInstagram ? FaInstagram : FaYoutube;

                      return (
                        <a
                          key={`${social.type}-${social.name}-${index}`}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${label} de ${competitor.name} (abre em nova aba)`}
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
                        >
                          <Icon aria-hidden="true" className="size-4" />
                          {label}
                        </a>
                      );
                    })}
                  </nav>
                )}
              </div>

              <div className="hidden shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:block">
                <Trophy aria-hidden="true" className="size-10 text-amber-300" />
              </div>
            </div>
          </div>
        </section>

        {competitor.description?.trim() && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Sobre
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700 sm:text-base">
              {competitor.description}
            </p>
          </section>
        )}

        <section className="mt-8 sm:mt-10">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
              Histórico
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Colocações
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Selecione uma categoria para ver os torneios e seus resultados.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <ResultsSheet
              description={`Torneios em que ${competitor.name} conquistou o primeiro lugar.`}
              results={stats.first}
              title="1º lugar"
              accent="bg-amber-100 text-amber-800"
            />
            <ResultsSheet
              description={`Torneios em que ${competitor.name} conquistou o segundo lugar.`}
              results={stats.second}
              title="2º lugar"
              accent="bg-slate-100 text-slate-700"
            />
            <ResultsSheet
              description={`Torneios em que ${competitor.name} conquistou o terceiro lugar.`}
              results={stats.third}
              title="3º lugar"
              accent="bg-orange-100 text-orange-800"
            />
          </div>
        </section>

        <section className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="font-bold text-slate-900">Demais participações</h2>
            <p className="mt-1 text-sm text-slate-600">
              Veja os outros torneios disputados por {competitor.name}.
            </p>
          </div>
          <ResultsSheet
            description={`Outros torneios disputados por ${competitor.name}.`}
            results={stats.others}
            title="Outros torneios"
            accent="bg-teal-100 text-teal-800"
          />
        </section>
      </main>
    </div>
  );
}
