"use client"

import { LoginAndCreateTabs } from "@/components/LoginAndCreateTabs";
import Image from "next/image";
import BUBetlogo from "@/public/BUlogo1.png";
import { useEffect, useState } from "react";

export default function Home() {
  const [bgUrl, setBgUrl] = useState("");

  useEffect(() => {
    const rnd = Math.floor(Math.random() * 13) + 1;
    setBgUrl("url('/login_wallpapers/bg_" + rnd + ".jpg')");
  }, []);

  return (
    <>
      <title>BUBet | Login</title>
      <meta name="login" content="Faça login ou crie uma conta" />

      <div
        className="flex bg-cover bg-center justify-between h-screen w-screen"
        style={{ backgroundImage: bgUrl }}
      >
        <div className="z-20 p-10 hidden md:block">
          <Image src={BUBetlogo.src} alt="BUBet logo" width={200} height={200} />
        </div>

        <div
          className="
            z-10 flex h-screen p-[80px]
            bg-[rgba(255,255,255,0.2)] backdrop-blur-sm

            /* MOBILE */
            w-full justify-center items-center

            /* DESKTOP */
            md:w-120 md:justify-end md:items-center
          "
        >
          <LoginAndCreateTabs />
        </div>
      </div>
    </>
  );
}
