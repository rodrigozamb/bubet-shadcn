"use client";

import { Header } from "@/components/Header";
import { SeasonResultsPage } from "@/components/SeasonResultsPage";
import { api } from "@/services/api";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SeasonDetails {
  name: string;
}

export default function SpecificSeasonPage() {
  const { season_id } = useParams<{ season_id: string }>();
  const [seasonName, setSeasonName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setError(false);

    api.get<SeasonDetails>(`/temporadas/${season_id}`, { withCredentials: true })
      .then(({ data }) => {
        if (isActive) setSeasonName(data.name);
      })
      .catch((requestError) => {
        console.error("Não foi possível carregar a temporada.", requestError);
        if (isActive) setError(true);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [season_id]);

  return (
    <>
      <title>{seasonName || "Temporada"}</title>
      <meta name="description" content="Confira a classificação e os resultados desta temporada." />
      <div className="min-h-screen bg-slate-50">
        <Header />
        {loading ? (
          <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600" role="status">
              <LoaderCircle className="h-5 w-5 animate-spin text-blue-800" aria-hidden="true" />
              Carregando temporada...
            </div>
          </main>
        ) : error ? (
          <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center justify-center px-4 text-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm" role="alert">
              <h1 className="text-lg font-semibold text-slate-900">Não foi possível carregar esta temporada</h1>
              <p className="mt-2 text-sm text-slate-600">Tente atualizar a página em instantes.</p>
            </div>
          </main>
        ) : (
          <SeasonResultsPage id={season_id} season_name={seasonName} />
        )}
      </div>
    </>
  );
}
