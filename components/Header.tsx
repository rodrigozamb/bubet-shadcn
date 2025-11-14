"use client"

import { DropdownConfig } from "@/components/DropdownMenu";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from "react";
import { FaBell, FaCheckCircle } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { api } from "@/services/api";

export function Header(){

    const router = useRouter()
    const { user } = useContext(AuthContext)


    const [notifications, setNotifications] = useState<{id: string, title: string, content: string, user_notification_id: string, link?: string, icon?: string}[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)


    useEffect(()=>{
      if(user){
        setNotifications(user.notifications)
      }
      setIsLoading(false)
    },[])

    if(isLoading || !user){
      return null
    }

    return (
        <div className="flex justify-between items-center pr-10 bg-cover bg-center h-16 w-screen bg-blue-900" >
          
          <div className="flex justify-center items-center">
            <Image className="p-[5px] cursor-pointer ml-10" src="/logoRetoSemSombra2.png" alt="BUBet logo" width={100} height={100} onClick={()=>{ router.push("/dashboard") }}/>
          </div>
          
          <div className="flex justify-end items-center content-center w-100 ">
            
            <div>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex">
                      <FaBell className="text-white cursor-pointer"/>
                      {
                        notifications.length > 0 ?
                        (<p className="bg-red-700 text-center rounded-full w-2 h-2"></p>)  : (<p></p>)
                      }
                      
                    </div>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent className="w-56" align="start"  side="left" sideOffset={5} alignOffset={15}>
                  <DropdownMenuLabel>Minhas Notificações</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {
                      
                      notifications.length > 0 ?
                        notifications.map((not)=>(
                          <DropdownMenuItem key={not.id}>
                            <div className="flex justify-between items-center w-100 m-2 cursor-pointer" >
                              <div onClick={()=>{ not.link ? router.push(`${process.env.NEXT_PUBLIC_WEB_URL}/${not.link}`) : null}}>
                                <p className="font-bold">{not.title}</p>
                                <p>{not.content}</p>
                              </div>
                              <div className="hover:bg-green-200 rounded-full p-2" onClick={async(e)=>{
                                e.preventDefault()
                                setNotifications( notifications.filter((noti) => noti.id != not.id))
                                await api.put(`/notifications/${not.user_notification_id}`,{ },{ withCredentials: true })
                              }}>
                                <FaCheckCircle className="text-green-800"/>
                              </div>
                            </div>
                            
                          </DropdownMenuItem>
                        ))
                      :
                        (
                          <div>
                            <p className="text-center font-light py-5">Sem notificações por enquanto.</p>
                          </div>
                        )
                    }
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              

            </div>

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