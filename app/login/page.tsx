// TELA DE LOGIN

import { LoginAndCreateTabs } from "@/components/LoginAndCreateTabs";
import Image from "next/image";

export default function Home() {
    return (
      <div className="flex bg-cover bg-center h-screen w-screen" style={{ backgroundImage: "url('/bg.jpg')" }}>
        <div className="z-20">
          <Image src="/BUlogo1.png" alt="BUBet logo" width={200} height={200}/>
        </div>
        <div className="z-10 flex items-center justify-end w-screen h-screen p-[80px]" >
          <LoginAndCreateTabs/>
        </div>
      </div>
    );
  }