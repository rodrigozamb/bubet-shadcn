"use client";

import AvatarIcon from "@/components/AvatarIcon";
import { api } from "@/services/api";
import { Award, LoaderCircle, Medal, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SeasonResult {
  points: number;
  position: number;
  user: {
    name: string;
    profile_url: string;
    id: string;
  };
}

interface SeasonResultsPageProps {
  id: string;
  season_name: string;
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

export function SeasonResultsPage({ id, season_name }: SeasonResultsPageProps) {
  const router = useRouter();
  const [results, setResults] = useState<SeasonResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setError(false);

    api.get<SeasonResult[]>(`/seasons/${id}`, { withCredentials: true })
      .then(({ data }) => {
        if (isActive) setResults(data);
      })
      .catch((requestError) => {
        console.error("Não foi possível carregar os resultados da temporada.", requestError);
        if (isActive) setError(true);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 p-6 text-white shadow-lg sm:p-9">
        <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:h-14 sm:w-14">
            <Trophy className="h-6 w-6 text-amber-300 sm:h-7 sm:w-7" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-wide text-blue-200">RESULTADO DA TEMPORADA</p>
            <h1 className="mt-1 break-words text-2xl font-bold tracking-tight sm:text-3xl">{season_name}</h1>
          </div>
        </div>
        <p className="relative mt-4 text-sm leading-relaxed text-blue-100 sm:text-base">
          Confira a classificação final e a pontuação dos participantes.
        </p>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold text-slate-900">Classificação geral</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {results.length > 0
                ? `${results.length} ${results.length === 1 ? "participante" : "participantes"}`
                : "Resultados da disputa"}
            </p>
          </div>
          <span className="hidden text-xs font-medium uppercase tracking-wide text-slate-400 sm:block">Pontos</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-12 text-sm font-medium text-slate-600" role="status">
            <LoaderCircle className="h-5 w-5 animate-spin text-blue-800" aria-hidden="true" />
            Carregando classificação...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center" role="alert">
            <p className="font-medium text-slate-800">Não foi possível carregar os resultados</p>
            <p className="mt-1 text-sm text-slate-500">Tente atualizar a página em instantes.</p>
          </div>
        ) : results.length > 0 ? (
          <ol className="max-h-[min(60vh,38rem)] overflow-y-auto p-2 sm:p-3">
            {results.map((result) => (
              <li key={result.user.id}>
                <button
                  type="button"
                  onClick={() => router.push(`/profile/${result.user.id}`)}
                  aria-label={`Ver perfil de ${result.user.name}, ${result.position}º lugar, ${result.points} pontos`}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:gap-4 sm:px-4"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      result.position === 1
                        ? "bg-amber-100 text-amber-700"
                        : result.position === 2
                          ? "bg-slate-100 text-slate-600"
                          : result.position === 3
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-50 text-slate-500"
                    }`}
                  >
                    {result.position > 0 ? result.position : "—"}
                  </span>
                  <AvatarIcon
                    name={result.user.name}
                    src={result.user.profile_url}
                    size={42}
                    className="h-[42px] w-[42px] shrink-0 border border-slate-200"
                  />
                  <span className="min-w-0 flex-1 truncate font-semibold text-slate-800 group-hover:text-blue-900">
                    {result.user.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 sm:min-w-24 sm:justify-end sm:px-3">
                    <PositionIcon position={result.position} />
                    <span className="font-bold tabular-nums text-slate-800">{result.points}</span>
                    <span className="hidden text-xs text-slate-500 sm:inline">pts</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <div className="px-6 py-12 text-center">
            <Trophy className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
            <p className="mt-3 font-medium text-slate-700">Ainda não há resultados nesta temporada</p>
            <p className="mt-1 text-sm text-slate-500">A classificação aparecerá aqui quando houver participantes.</p>
          </div>
        )}
      </section>
    </main>
  );
}
