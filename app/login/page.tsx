"use client"
// TELA DE LOGIN

import { LoginAndCreateTabs } from "@/components/LoginAndCreateTabs";
import Image from "next/image";
import BUBetlogo from "@/public/BUlogo1.png"
import { useEffect, useState } from "react";


export default function Home() {
  
  const [bgUrl, setBgUrl] = useState("")

  useEffect(() => {
    const rnd = Math.floor(Math.random() * 6) + 1
    setBgUrl("url('/login_wallpapers/bg_"+rnd+".jpg')")
  }, [])

  return (
      <>
        
        <title>BUBet | Login</title>
        <meta name="login" content="Faça login ou crie uma conta"/>
        
        <div className="flex bg-cover bg-center justify-between h-screen w-screen" style={{ backgroundImage: bgUrl}}>
          <div className="z-20 p-10">
            <Image src={BUBetlogo.src} alt="BUBet logo" width={200} height={200}/>
          </div>
          <div className="z-10 flex items-center justify-end h-screen p-[80px] w-120 bg-gray-950" >
            <LoginAndCreateTabs/>
          </div>
        </div>
      </>
    );
  }