"use client"

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Trophy, Users } from "lucide-react";
import AvatarIcon from "./AvatarIcon";
import { Carroussel } from "./Carroussel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

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

interface PageCarrousselProps {
  events: EventProps[];
  competitors: CompetitorProps[];
  guessEvents: GuessEventProps[];
}

const categories = [
  { label: "Palpites", icon: Sparkles },
  { label: "Torneios", icon: Trophy },
  { label: "Baterias", icon: Users },
];

export function PageCarroussel({
  competitors,
  events,
  guessEvents,
}: PageCarrousselProps) {
  const router = useRouter();
  const [categoryIndex, setCategoryIndex] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const items = categoryIndex === 0
    ? guessEvents
    : categoryIndex === 1
      ? events
      : competitors;

  const filteredItems = useMemo(
    () => items.filter((item) => item.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())),
    [items, searchTerm],
  );
  const activeCategory = categories[categoryIndex];
  const ActiveIcon = activeCategory.icon;

  const getItemPath = (id: string) => {
    if (categoryIndex === 0) return `/palpites/${id}`;
    if (categoryIndex === 2) return `/competitors/${id}`;
    return `/events/${id}`;
  };

  return (
    <section className="mb-10 rounded-3xl border border-slate-300 bg-slate-200 px-4 py-6 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] sm:px-7 sm:py-8 lg:px-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">
            Encontre sua próxima aposta
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Explore a competição
          </h2>
        </div>

        <div
          className="inline-flex w-full items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 sm:w-auto"
          role="tablist"
          aria-label="Categorias"
        >
          {categories.map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              type="button"
              role="tab"
              id={`dashboard-category-${index}`}
              aria-selected={categoryIndex === index}
              aria-controls="dashboard-carousel-panel"
              onClick={() => setCategoryIndex(index)}
              className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 sm:flex-none sm:px-4 ${
                categoryIndex === index
                  ? "bg-blue-900 text-white shadow-sm"
                  : "bg-white/80 text-slate-700 shadow-sm hover:bg-white hover:text-slate-950"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        id="dashboard-carousel-panel"
        role="tabpanel"
        aria-labelledby={`dashboard-category-${categoryIndex}`}
        className="mt-7"
      >
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
              <ActiveIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-slate-900">{activeCategory.label}</h3>
              <p className="text-sm text-slate-500">
                {items.length} {items.length === 1 ? "opção disponível" : "opções disponíveis"}
              </p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
              >
                Ver todos
              </button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[85dvh] w-full max-w-2xl flex-col gap-5 overflow-hidden rounded-2xl p-5 sm:p-7">
              <DialogHeader>
                <DialogTitle className="text-xl">{`Todos os ${activeCategory.label.toLocaleLowerCase()}`}</DialogTitle>
                <DialogDescription>
                  Busque e selecione uma opção para abrir os detalhes.
                </DialogDescription>
              </DialogHeader>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <Input
                  className="h-11 pl-9"
                  type="search"
                  placeholder={`Buscar ${activeCategory.label.toLocaleLowerCase()}...`}
                  aria-label={`Buscar ${activeCategory.label.toLocaleLowerCase()}`}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-slate-100">
                {filteredItems.length > 0 ? (
                  <ul className="divide-y divide-slate-100">
                    {filteredItems.map((item) => {
                      const image = "banner" in item ? item.banner : item.profile_url;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => router.push(getItemPath(item.id))}
                            className="flex min-h-[4.5rem] w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700 sm:px-4"
                          >
                            <AvatarIcon name={item.name} size={44} src={image} />
                            <span className="min-w-0 flex-1 truncate font-medium text-slate-800">{item.name}</span>
                            <span className="text-sm font-semibold text-blue-800">Abrir</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="px-4 py-12 text-center text-sm text-slate-500">
                    Nenhum resultado encontrado.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {items.length > 0 ? (
          <Carroussel items={items} categoryIndex={categoryIndex} />
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 text-center">
            <ActiveIcon className="mb-3 h-7 w-7 text-slate-400" aria-hidden="true" />
            <p className="font-semibold text-slate-700">Ainda não há {activeCategory.label.toLocaleLowerCase()} disponíveis</p>
            <p className="mt-1 text-sm text-slate-500">Volte em breve para conferir as novidades.</p>
          </div>
        )}
      </div>
    </section>
  );
}
