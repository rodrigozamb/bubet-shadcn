"use client"

import Image from "next/image";
import BUBetlogo from "../public/logoRetoSemSombra2.png"
import { NavigationMenuLandingPage } from "@/components/NavigationMenu";
import { Button } from "@/components/ui/button";

import p1 from "@/public/prints/p1.png"
import p2 from "@/public/prints/p2.png"
import p3 from "@/public/prints/p3.png"
import bemvindo from "@/public/bemvindo.png"
import bubetlogo from '@/public/logoRetoSemSombra2.png'
import { useRouter } from "next/navigation";



export default function Home() {

  const router = useRouter()

  return (
    <div className="flex flex-col absolute justify-begin bg-blue-900 w-screen h-full">

      <title>BUBet | Apostas em BU</title>
      <meta name="landing-page" content="Bem vindo ao BUBet"/>

      <div className="flex justify-center my-10">
        <div className="flex justify-between bg-blue-950 w-7xl h-20 px-15 py-3 rounded-3xl">
          <div className="flex">
            <Image className="" src={BUBetlogo.src} alt="BUBet logo" width={100} height={100}/>
            <NavigationMenuLandingPage />
          </div>

          <div className="flex justify-center items-center">
            <Button className="w-25 h-12 cursor-pointer bg-yellow-500 hover:bg-yellow-600 font-extrabold"
              onClick={()=>{ router.push(`/login`)}}
            >
              Entrar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center">


        <div className="relative flex justify-center z-3 top-10">
          <Image src={bemvindo.src} alt="bemvindo" width={700} height={700}/>
        </div>

        <div>

          <div className="relative flex justify-center z-4">
            <Image className="shadow-2xl rounded-3xl" src={p1.src} alt="p1" width={1000} height={1000}/>
          </div>

          {/* <div className="relative flex justify-center z-2 bottom-110 left-150">
            <Image className="shadow-2xl rounded-3xl" src={p2.src} alt="p2" width={700} height={700}/>
          </div>

          <div className="relative flex justify-center z-1 right-10">
            <Image className="shadow-2xl rounded-3xl" src={p3.src} alt="p3" width={1000} height={1000}/>
          </div> */}
        </div>

        <div className="relative flex justify-center z-5 bottom-50 ">
          <Image className="" src={bubetlogo.src} alt="bubetlogo" width={500} height={500}/>
        </div>

      </div>
    </div>
  );
}
