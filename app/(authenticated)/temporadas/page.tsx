"use client"

import { Header } from "@/components/Header";
import { SeasonSelect } from "@/components/SeasonSelect";

export default function TemporadaSelectPage() {

  const tit = `Temporadas`
  return (
    <>
      <title>{tit}</title>
      <meta key="ranking-page" name="ranking" content="Ranking Geral!"/>
      <div className="flex flex-col h-screen bg-gray-100">
        <div>
          <Header />
        </div>
        <div className="flex justify-center items-center h-screen ">
          <SeasonSelect />
        </div>
      </div>
    </>
  );
}
