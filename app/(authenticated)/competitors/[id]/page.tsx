"use client";

import { CompetitorPage } from "@/components/CompetitorPage";
import { Header } from "@/components/Header";
import { api } from "@/services/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  description: string;
  created_at: string;
  profile_url: string;
  socials: {
    type: string;
    name: string;
  }[];
}

interface EventResultData {
  eventId: string;
  placing: string;
  score: number;
  event: {
    name: string;
    banner: string;
  };
}

interface StatsData {
  first: EventResultData[];
  second: EventResultData[];
  third: EventResultData[];
  others: EventResultData[];
  all: number;
}

export default function ProfilePage() {
  const [competitor, setCompetitor] = useState<UserData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [competitorResponse, statsResponse] = await Promise.all([
          api.get<UserData>(`/competitors/${id}`, { withCredentials: true }),
          api.get<StatsData>(`/competitors/stats/${id}`, {
            withCredentials: true,
          }),
        ]);

        if (active) {
          setCompetitor(competitorResponse.data);
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error("Não foi possível carregar o perfil do competidor.", error);
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadData();
    return () => {
      active = false;
    };
  }, [id, retryCount]);

  const title = competitor
    ? `Competidor | ${competitor.name}`
    : "Perfil do competidor";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content="Conheça o perfil e os resultados do competidor." />

      <div className="flex min-h-screen flex-col bg-stone-50">
        <Header />
        <main className="flex-1">
          {loading ? (
            <div
              className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-600"
              role="status"
            >
              <LoaderCircle className="size-8 animate-spin text-teal-700" />
              <p className="text-sm font-medium">Carregando perfil...</p>
            </div>
          ) : loadError || !competitor || !stats ? (
            <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
              <h1 className="text-xl font-bold text-slate-900">
                Não foi possível carregar este perfil
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Confira sua conexão e tente novamente.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoadError(false);
                  setLoading(true);
                  setRetryCount((count) => count + 1);
                }}
                className="mt-5 rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <CompetitorPage
              competitorId={competitor.id}
              competitor={{
                name: competitor.name,
                avatar: competitor.profile_url,
                description: competitor.description,
                socials: competitor.socials ?? [],
              }}
              stats={{
                first: stats.first ?? [],
                second: stats.second ?? [],
                third: stats.third ?? [],
                others: stats.others ?? [],
                all: stats.all ?? 0,
              }}
            />
          )}
        </main>
      </div>
    </>
  );
}
