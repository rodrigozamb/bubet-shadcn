/* eslint-disable @typescript-eslint/no-unused-vars */
import { BetsList } from "@/components/BetsList";
import { Header } from "@/components/Header";
import { PageCarroussel } from "@/components/PageCarroussel";

// TELA INICIAL
export default function Home() {
  return (
    <div>
      <div>
        <Header />
      </div>
      <PageCarroussel/>
      <BetsList/>
    </div>
  );
}
