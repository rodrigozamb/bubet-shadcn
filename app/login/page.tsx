// TELA DE LOGIN

import { LoginAndCreateTabs } from "@/components/LoginAndCreateTabs";
import Image from "next/image";
import BUBetlogo from "@/public/BUlogo1.png"

export default function Home() {
    return (
      <div className="flex bg-cover bg-center justify-between h-screen w-screen" style={{ backgroundImage: "url('/bg.jpg')" }}>
        <div className="z-20 p-10">
          <Image src={BUBetlogo.src} alt="BUBet logo" width={200} height={200}/>
        </div>
        <div className="z-10 flex items-center justify-end h-screen p-[80px] bg-gray-950" >
          <LoginAndCreateTabs/>
        </div>
      </div>
    );
  }