import { BetsList } from "@/components/BetsList";
import { Header } from "@/components/Header";
import { PageCarroussel } from "@/components/PageCarroussel";

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