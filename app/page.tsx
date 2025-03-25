/* eslint-disable @typescript-eslint/no-unused-vars */
import { BetPanel } from "@/components/BetPanel";
import { BetsList } from "@/components/BetsList";
import { Carroussel } from "@/components/Carroussel";
import { CompetitorPage } from "@/components/CompetitorPage";
import { CompetitorsList } from "@/components/CompetitorsList";
import { DefaultList } from "@/components/DefaultList";
import { DropdownConfig } from "@/components/DropdownMenu";
import { Header } from "@/components/Header";
import { InfoPanel } from "@/components/InfoPanel";
import { LoginAndCreateTabs } from "@/components/LoginAndCreateTabs";
import { PageCarroussel } from "@/components/PageCarroussel";
import { Podium } from "@/components/Podium";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";


// // TELA DE LOGIN

// export default function Home() {
//   return (
//     <div className="flex bg-cover bg-center h-screen w-screen" style={{ backgroundImage: "url('/bg.jpg')" }}>
//       <div className="z-20">
//         <Image src="/BUlogo1.png" alt="BUBet logo" width={200} height={200}/>
//       </div>
//       <div className="z-10 flex items-center justify-end w-screen h-screen p-[80px]" >
//         <LoginAndCreateTabs/>
//       </div>
//     </div>
//   );
// }

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


//Tela do competidor
// export default function Home() {
//   return (
//     <div>
//       <div>
//         <Header />
//       </div>  
//       <CompetitorPage/>
//     </div>
//   );
// }


// TELA CAMPEONATO
// export default function Home() {
//   return (
//     <div className="h-screen flex flex-col">
//       <div>
//         <Header />
//       </div>
//       <div className="flex flex-1 justify-center">
//         <div>
//             <InfoPanel/>
//             <BetPanel/>
//         </div>
//         <div className="flex flex-col">
//           <Podium/>
//           <CompetitorsList/>
//         </div>
//       </div>
//     </div>
//   );
// }
