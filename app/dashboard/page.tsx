import { BetsList } from "@/components/BetsList";
import { Header } from "@/components/Header";
import { PageCarroussel } from "@/components/PageCarroussel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BUbet | Dashboard",
  description: "Faça suas apostas!",
};

export default function Dashboard() {
  return (
      <div className="flex flex-col h-screen justify-between bg-gray-300">
        <div>
          <Header />
        </div>
        <PageCarroussel/>
        <BetsList/>
      </div>
  );
}