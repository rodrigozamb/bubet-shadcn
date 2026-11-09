"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function AvatarPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <title>BUBet | Seu Avatar</title>
      <meta
        name="description"
        content="Em breve você poderá criar e personalizar seu personagem no BUBet."
      />

      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <Header />

        <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <section className="flex w-full max-w-3xl flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-12 sm:py-14">
            <Link
              href={`/profile/${id}`}
              className="mb-6 inline-flex min-h-11 items-center gap-2 self-start rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Voltar ao perfil
            </Link>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-blue-800">
              <Sparkles className="size-4" aria-hidden="true" />
              Novidade em breve
            </div>

            <h1 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
              Seu Batuqueiro
            </h1>

            <div className="relative mb-8 flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-amber-50">
              <div
                className="absolute size-64 rounded-full bg-blue-100/60 blur-3xl"
                aria-hidden="true"
              />
              <Image
                src="/Funko.png"
                alt="Exemplo de personagem virtual"
                width={520}
                height={520}
                priority
                className="relative h-full w-full object-contain p-5"
              />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Seu personagem, do seu jeito
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Em breve você poderá criar e customizar seu personagem da forma
              que mais gostar, com camisas e itens das suas BUs favoritas.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}