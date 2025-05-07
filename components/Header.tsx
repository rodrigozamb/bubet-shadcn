"use client"

import { DropdownConfig } from "@/components/DropdownMenu";
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation'

export function Header(){

    const router = useRouter()
    const pathname = usePathname()
    return (
        <div className="flex justify-between items-center pr-10 bg-cover bg-center h-16 w-screen bg-blue-900" >
          
          <div className="flex justify-center items-center">
            
            {/* {pathname != '/dashboard' && (
              <div className="mx-3 text-white font-bold">
                voltar
              </div>
            )} */}
            <Image className="p-[5px] cursor-pointer ml-10" src="/logoRetoSemSombra2.png" alt="BUBet logo" width={100} height={100} onClick={()=>{ router.push("/dashboard") }}/>
          </div>
          
          <div className="flex justify-end items-center content-center w-100 ">
            
            <div className="justify-center items-center m-5">
              <div className="flex justify-center items-center text-white font-medium ">Rodrigo Zamboni zantasdaso Silva</div>
              <div className="flex justify-end items-center">
                <DropdownConfig/>
              </div>
            </div>
            
            <Image className=" rounded-full border-1 border-[#000000] " src="/cirilo.jpeg" alt="user" width={50} height={50}/>
          </div>
        
        </div>
      );
}