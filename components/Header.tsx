import { DropdownConfig } from "@/components/DropdownMenu";
import Image from "next/image";

export function Header(){
    return (
        <div className="flex justify-between items-center px-10 bg-cover bg-center h-16 w-screen bg-blue-900" >
          <Image className="p-[5px]" src="/logoRetoSemSombra2.png" alt="BUBet logo" width={100} height={100}/>
          
          <div className="flex justify-end items-center content-center w-100 ">
            
            <div className="justify-center items-center m-5">
              <div className="flex justify-center items-center text-[#ffffff]">Rodrigo Zamboni zantasdaso Silva</div>
              <div className="flex justify-end items-center">
                <DropdownConfig/>
              </div>
            </div>
            
            <Image className=" rounded-full border-1 border-[#000000] " src="/cirilo.jpeg" alt="user" width={50} height={50}/>
          </div>
        
        </div>
      );
}