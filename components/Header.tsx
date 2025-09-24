"use client"

import { DropdownConfig } from "@/components/DropdownMenu";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useContext } from "react";

export function Header(){

    const router = useRouter()
    const { user } = useContext(AuthContext)

    if(!user){
      return null
    }

    return (
        <div className="flex justify-between items-center pr-10 bg-cover bg-center h-16 w-screen bg-blue-900" >
          
          <div className="flex justify-center items-center">
            <Image className="p-[5px] cursor-pointer ml-10" src="/logoRetoSemSombra2.png" alt="BUBet logo" width={100} height={100} onClick={()=>{ router.push("/dashboard") }}/>
          </div>
          
          <div className="flex justify-end items-center content-center w-100 ">
            
            <div className="justify-center items-center m-5">
              <div className="flex justify-center items-center text-white font-medium ">{user.name}</div>
              <div className="flex justify-end items-center">
                <DropdownConfig/>
              </div>
            </div>
            

            <div className=" h-[50px] w-[50px]">
              <Image className="h-[50px] w-[50px] rounded-full border-1 border-[#000000] object-cover " src={user.profile_url} alt="user" width={50} height={50}/>
            </div>
          </div>
        
        </div>
      );
}