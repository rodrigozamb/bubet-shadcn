import { CompetitorPage } from "@/components/CompetitorPage";
import { Header } from "@/components/Header";

//Tela do competidor
export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div>
        <Header />
      </div>
      <div className="flex h-screen ">
        <CompetitorPage/>
      </div>
    </div>
  );
}
