"use client";

import { Header } from "@/components/Header";
import { SeasonSelect } from "@/components/SeasonSelect";

export default function TemporadaSelectPage() {
  return (
    <>
      <title>Temporadas</title>
      <meta name="description" content="Consulte as temporadas e confira os resultados das disputas." />
      <div className="min-h-screen bg-slate-50">
        <Header />
        <SeasonSelect />
      </div>
    </>
  );
}
