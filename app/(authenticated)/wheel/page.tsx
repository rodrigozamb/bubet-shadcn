"use client"

import { Header } from "@/components/Header";
import SpinWheel from "@/components/Wheel";
import { AuthContext } from "@/context/AuthContext";
import { useContext} from "react";


export default function UserSettingsPage() {

  useContext(AuthContext)

  const tit = `Roleta da Sorte 🍀`

  return (
    <>
      <title>{tit}</title>
      <meta key="profile-page" name="profile" content="Conheça essa pessoa!"/>
      
      <div className="flex flex-col h-screen bg-gray-100">
        <div>
          <Header />
        </div>
        <div className="flex justify-center items-center h-screen ">
          <SpinWheel/>
        </div>
      </div>
    </>
  );
}
