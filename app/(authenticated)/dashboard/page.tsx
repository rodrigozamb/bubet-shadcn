"use client"

import { BetsList } from "@/components/BetsList";
import { Header } from "@/components/Header";
import { PageCarroussel } from "@/components/PageCarroussel";
import { api } from "@/services/api";
import { LoaderCircle, RefreshCw, Trophy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface EventProps {
  id: string;
  name: string;
  banner: string;
}

interface CompetitorProps {
  id: string;
  name: string;
  profile_url: string;
}

interface GuessEventProps {
  id: string;
  name: string;
  profile_url: string;
}

interface DashboardBetProps {
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

export default function Dashboard() {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [guessEvents, setGuessEvents] = useState<GuessEventProps[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorProps[]>([]);
  const [bets, setBets] = useState<DashboardBetProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);

    try {
      const [eventsResponse, competitorsResponse, guessesResponse, betsResponse] =
        await Promise.all([
          api.get("/events", { withCredentials: true }),
          api.get("/competitors", { withCredentials: true }),
          api.get("/guess-events", { withCredentials: true }),
          api.get("/bets", { withCredentials: true }),
        ]);

      setEvents(eventsResponse.data);
      setCompetitors(competitorsResponse.data);
      setGuessEvents(guessesResponse.data);
      setBets(betsResponse.data);
    } catch (error) {
      console.error("Não foi possível carregar o dashboard.", error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <>
      <title>BUBet | Dashboard</title>
      <meta name="description" content="Acompanhe torneios, baterias e suas apostas." />

      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <Header />

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-8 pt-8 sm:px-6 lg:px-8">
          <section className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-800">
                <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                Dashboard
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Seu Painel Principal
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Explore os torneios, acompanhe as baterias e confira seus palpites em um só lugar.
              </p>
            </div>
          </section>

          {loadError ? (
            <section
              className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-red-200 bg-white px-6 py-16 text-center shadow-sm"
              role="alert"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <RefreshCw className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Não foi possível carregar o painel</h2>
              <p className="mt-2 max-w-md text-sm text-slate-600">
                Verifique sua conexão e tente novamente. Seus dados não foram alterados.
              </p>
              <button
                type="button"
                onClick={() => void loadDashboard()}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Tentar novamente
              </button>
            </section>
          ) : isLoading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-sm font-medium text-slate-600" role="status">
              <LoaderCircle className="h-8 w-8 animate-spin text-blue-800" aria-hidden="true" />
              Carregando seu painel...
            </div>
          ) : (
            <>
              <PageCarroussel
                competitors={competitors}
                events={events}
                guessEvents={guessEvents}
              />
              <BetsList bets={bets} />
            </>
          )}
        </main>
      </div>
    </>
  );
}
