import { BetPanel } from "@/components/BetPanel";
import { CompetitorsList } from "@/components/CompetitorsList";
import { Header } from "@/components/Header";
import { InfoPanel } from "@/components/InfoPanel";
import { Podium } from "@/components/Podium";

// TELA CAMPEONATO
export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div>
        <Header />
      </div>
      <div className="flex flex-1 justify-center">
        <div>
            <InfoPanel/>
            <BetPanel/>
        </div>
        <div className="flex flex-col">
          <Podium/>
          <CompetitorsList/>
        </div>
      </div>
    </div>
  );
}
