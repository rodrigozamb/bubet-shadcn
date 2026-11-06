"use client"

import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AvatarIcon from "./AvatarIcon";

interface CarrousselItem {
  id: string;
  name: string;
  profile_url?: string;
  banner?: string;
}

interface CarrousselProps {
  items: CarrousselItem[];
  categoryIndex: number;
}

export function Carroussel({ items, categoryIndex }: CarrousselProps) {
  const router = useRouter();
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 5000,
        playOnInit: true,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        stopOnFocusIn: false,
      }),
    [],
  );
  const slideBasis =
    items.length === 2
      ? "basis-[85%] sm:basis-[65%]"
      : items.length === 3
        ? "basis-[85%] sm:basis-1/2 lg:basis-[45%]"
        : items.length === 4
          ? "basis-[85%] sm:basis-1/2 lg:basis-1/3"
          : "basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4";

  const openItem = (id: string) => {
    if (categoryIndex === 0) router.push(`/palpites/${id}`);
    else if (categoryIndex === 2) router.push(`/competitors/${id}`);
    else router.push(`/events/${id}`);
  };

  return (
    <Carousel
      plugins={[autoplay]}
      className="mx-auto w-full max-w-6xl px-10 sm:px-12"
      opts={{
        align: "start",
        loop: items.length > 1,
        slidesToScroll: 1,
      }}
    >
      <CarouselContent className="-ml-3 py-2">
        {items.map((item) => (
          <CarouselItem key={item.id} className={`${slideBasis} pl-3`}>
            <Card className="h-full overflow-hidden rounded-2xl border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
              <button
                type="button"
                onClick={() => openItem(item.id)}
                aria-label={`Abrir ${item.name}`}
                className="group flex h-full w-full flex-col items-center justify-center rounded-2xl text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700"
              >
                <CardContent className="flex min-h-48 w-full flex-col items-center justify-center gap-3 p-5">
                  {categoryIndex === 0 ? (
                    <>
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-800 transition-transform group-hover:scale-105">
                        <span className="text-2xl font-bold" aria-hidden="true">?</span>
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Deixe seu palpite
                      </span>
                    </>
                  ) : (
                    <AvatarIcon
                      name={item.name}
                      size={categoryIndex === 1 ? 112 : 96}
                      src={categoryIndex === 1 ? item.banner ?? "" : item.profile_url ?? ""}
                      className="transition-transform duration-200 group-hover:scale-105"
                    />
                  )}
                  <span className="line-clamp-2 max-w-full text-base font-semibold leading-snug text-slate-800 group-hover:text-blue-900">
                    {item.name}
                  </span>
                </CardContent>
              </button>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {items.length > 1 && (
        <>
          <CarouselPrevious
            aria-label="Item anterior"
            className="left-0 h-9 w-9 border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
          />
          <CarouselNext
            aria-label="Próximo item"
            className="right-0 h-9 w-9 border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
          />
        </>
      )}
    </Carousel>
  );
}
