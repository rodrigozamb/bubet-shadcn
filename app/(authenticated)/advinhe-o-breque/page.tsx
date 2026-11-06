"use client"

import { AuthContext } from "@/context/AuthContext";
import { AdvinheOBrequeGame } from "@/components/AdvinheOBrequeGame";
import { useContext } from "react";
import { Header } from "@/components/Header";

export default function AdvinheOBrequePage() {
  useContext(AuthContext);
  return (
    <main className="flex min-h-screen flex-col bg-[#121516] pb-10 text-[#f0f0f0]">
      <title>Adivinhe o Breque</title>
      <meta name="description" content="Adivinhe o Breque!" />
      <Header />
      <AdvinheOBrequeGame />
    </main>
  );
}
