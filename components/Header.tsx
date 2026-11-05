"use client"

import { DropdownConfig } from "@/components/DropdownMenu";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from "react";
import { FaMusic } from "react-icons/fa";
import { Bell, Check, LoaderCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { api } from "@/services/api";

interface Notification {
  id: string
  title: string
  content: string
  user_notification_id: string
  link?: string
  icon?: string
}

export function Header(){

    const router = useRouter()
    const { user } = useContext(AuthContext)

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [markingNotificationIds, setMarkingNotificationIds] = useState<string[]>([])
    const [notificationError, setNotificationError] = useState("")


    useEffect(() => {
      let isActive = true

      if (!user) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      api.get('/users/profile', { withCredentials: true })
        .then((res) => {
          if (isActive) {
            setNotificationError("")
            setNotifications(res.data.user.notifications.map((not: { notification: Notification; id: string }) => ({
              ...not.notification,
              user_notification_id: not.id,
            })))
          }
        })
        .catch((error) => {
          console.error("Não foi possível carregar as notificações.", error)
          if (isActive) {
            setNotificationError("Não foi possível carregar suas notificações.")
          }
        })
        .finally(() => {
          if (isActive) setIsLoading(false)
        })

      return () => {
        isActive = false
      }
    }, [user])

    if(!user){
      return null
    }

    const handleNotificationRedirect = async (to?:string) => {
      if(to){
        router.push(`${process.env.NEXT_PUBLIC_WEB_URL}/${to}`)
      }
    }

    const handleMarkAsRead = async (notification: Notification) => {
      setMarkingNotificationIds((current) => [...current, notification.user_notification_id])
      setNotificationError("")

      try {
        await api.put(`/notifications/${notification.user_notification_id}`, {}, { withCredentials: true })
        setNotifications((current) => current.filter((item) => item.user_notification_id !== notification.user_notification_id))
      } catch (error) {
        console.error("Não foi possível marcar a notificação como lida.", error)
        setNotificationError("Não foi possível marcar como lida. Tente novamente.")
      } finally {
        setMarkingNotificationIds((current) => current.filter((id) => id !== notification.user_notification_id))
      }
    }

    return (
        <div className="flex justify-between items-center pr-10 bg-cover bg-center h-16 w-screen bg-blue-900" >
          
          <div className="flex justify-center items-center">
            <Image unoptimized className="p-[5px] cursor-pointer ml-10" src="/logoRetoSemSombra2.png" alt="BUBet logo" width={100} height={100} onClick={()=>{ router.push("/dashboard") }}/>
          </div>
          
          <div className="flex justify-end items-center content-center w-100 ">
            
            <FaMusic className="text-white cursor-pointer mr-8" onClick={()=>{router.push(`/advinhe-o-breque`)}}/>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={notifications.length > 0 ? `Notificações, ${notifications.length} não lidas` : "Notificações"}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Bell className="h-5 w-5" aria-hidden="true" />
                  {notifications.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-blue-900 bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                      {notifications.length > 99 ? "99+" : notifications.length}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border-slate-200 p-0 shadow-xl"
                align="end"
                side="bottom"
                sideOffset={10}
              >
                <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
                  <span className="text-base font-semibold text-slate-900">Notificações</span>
                  {notifications.length > 0 && (
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {notifications.length} {notifications.length === 1 ? "nova" : "novas"}
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="m-0" />

                <DropdownMenuGroup>
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500" role="status">
                      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Carregando notificações...
                    </div>
                  ) : notifications.length > 0 ? (
                    <div className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
                      {notifications.map((notification) => {
                        const isMarkingAsRead = markingNotificationIds.includes(notification.user_notification_id)

                        return (
                          <div
                            key={notification.user_notification_id}
                            className="group relative flex items-start gap-2 rounded-lg p-2 transition-colors hover:bg-slate-50"
                          >
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                            <DropdownMenuItem
                              className="min-w-0 flex-1 items-start rounded-md p-1.5 focus:bg-white"
                              onSelect={() => handleNotificationRedirect(notification.link)}
                            >
                              <span className="block min-w-0 whitespace-normal">
                                <span className="block truncate text-sm font-semibold text-slate-900">
                                  {notification.title}
                                </span>
                                <span className="mt-1 line-clamp-3 block text-xs leading-relaxed text-slate-600">
                                  {notification.content}
                                </span>
                                {notification.link && (
                                  <span className="mt-2 block text-xs font-medium text-blue-700">
                                    Ver detalhes
                                  </span>
                                )}
                              </span>
                            </DropdownMenuItem>
                            <button
                              type="button"
                              aria-label={`Marcar "${notification.title}" como lida`}
                              title="Marcar como lida"
                              disabled={isMarkingAsRead}
                              onClick={() => handleMarkAsRead(notification)}
                              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-wait disabled:opacity-60"
                            >
                              {isMarkingAsRead ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                              ) : (
                                <Check className="h-4 w-4" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  ) : notificationError ? (
                    <div className="px-6 py-8 text-center" role="alert">
                      <p className="text-sm font-semibold text-slate-800">Não foi possível carregar as notificações.</p>
                      <p className="mt-1 text-xs text-slate-500">Tente novamente mais tarde.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center px-6 py-8 text-center">
                      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Bell className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-semibold text-slate-800">Tudo em dia!</p>
                      <p className="mt-1 text-xs text-slate-500">Você não tem notificações novas.</p>
                    </div>
                  )}
                </DropdownMenuGroup>

                {notificationError && notifications.length > 0 && (
                  <p className="border-t border-red-100 bg-red-50 px-4 py-2.5 text-xs text-red-700" role="alert">
                    {notificationError}
                  </p>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="justify-center items-center m-5">
              <div className="flex justify-center items-center text-white font-medium ">{user.name.length > 30 ? user.name.substring(0,30)+"..." : user.name}</div>
              <div className="flex justify-end items-center">
                <DropdownConfig/>
              </div>
            </div>
            

            <div className=" h-[50px] w-[50px]">
              <Image unoptimized={true} className="h-[50px] w-[50px] rounded-full border-1 border-[#000000] object-cover " src={user.profile_url} alt="user" width={50} height={50}/>
            </div>
          </div>
        
        </div>
      );
}