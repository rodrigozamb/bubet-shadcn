"use client";

import { api } from "@/services/api";
import { CalendarDays, ChevronRight, LoaderCircle, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Season {
  name: string;
  id: string;
  created_at: string;
}

export function SeasonSelect() {
  const router = useRouter();
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isActive = true;

    api.get<Season[]>("/temporadas", { withCredentials: true })
      .then(({ data }) => {
        if (isActive) setSeasons(data);
      })
      .catch((requestError) => {
        console.error("Não foi possível carregar as temporadas.", requestError);
        if (isActive) setError(true);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 p-6 text-white shadow-lg sm:p-9">
        <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:h-14 sm:w-14">
            <Trophy className="h-6 w-6 text-amber-300 sm:h-7 sm:w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-blue-200">HISTÓRICO DE DISPUTAS</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Temporadas</h1>
          </div>
        </div>
        <p className="relative mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
          Escolha uma temporada para conferir a classificação e os resultados dos participantes.
        </p>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <h2 className="font-semibold text-slate-900">Todas as temporadas</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {seasons.length > 0
              ? `${seasons.length} ${seasons.length === 1 ? "temporada disponível" : "temporadas disponíveis"}`
              : "Consulte os resultados de cada disputa"}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-12 text-sm font-medium text-slate-600" role="status">
            <LoaderCircle className="h-5 w-5 animate-spin text-blue-800" aria-hidden="true" />
            Carregando temporadas...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center" role="alert">
            <p className="font-medium text-slate-800">Não foi possível carregar as temporadas</p>
            <p className="mt-1 text-sm text-slate-500">Tente atualizar a página em instantes.</p>
          </div>
        ) : seasons.length > 0 ? (
          <ul className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
            {seasons.map((season) => {
              const date = new Date(season.created_at);
              const formattedDate = Number.isNaN(date.getTime())
                ? null
                : new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);

              return (
                <li key={season.id}>
                  <button
                    type="button"
                    onClick={() => router.push(`/temporadas/${season.id}`)}
                    className="group flex min-h-28 w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800 transition-colors group-hover:bg-blue-100">
                      <CalendarDays className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-slate-900">{season.name}</span>
                      <span className="mt-1 block text-sm capitalize text-slate-500">
                        {formattedDate ?? "Ver classificação"}
                      </span>
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
            <p className="mt-3 font-medium text-slate-700">Nenhuma temporada disponível</p>
            <p className="mt-1 text-sm text-slate-500">As temporadas aparecerão aqui quando forem criadas.</p>
          </div>
        )}
      </section>
    </main>
  );
}
