"use client"

import { DropdownConfig } from "@/components/DropdownMenu";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from "react";
import { Bell, Check, ChevronDown, LoaderCircle, Music2 } from "lucide-react";
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
        <header className="w-full border-b border-blue-800/70 bg-blue-950 text-white shadow-sm">
          <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
            <Link
              href="/dashboard"
              aria-label="BUBet — ir para o dashboard"
              className="flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <Image
                unoptimized
                className="w-[76px] p-1 sm:w-[92px]"
                src="/logoRetoSemSombra2.png"
                alt="BUBet"
                width={100}
                height={100}
                priority
              />
            </Link>

            <nav aria-label="Ações da conta" className="flex min-w-0 items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => router.push("/advinhe-o-breque")}
                aria-label="Jogar Advinhe o Breque"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold text-blue-50 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:px-4"
              >
                <Music2 className="h-[18px] w-[18px] text-amber-300" aria-hidden="true" />
                <span className="hidden sm:inline">Advinhe o Breque</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={notifications.length > 0 ? `Notificações, ${notifications.length} não lidas` : "Notificações"}
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-blue-50 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <Bell className="h-5 w-5" aria-hidden="true" />
                    {notifications.length > 0 && (
                      <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-blue-950 bg-amber-400 px-1 text-[10px] font-bold leading-none text-blue-950">
                        {notifications.length > 99 ? "99+" : notifications.length}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border-slate-200 p-0 shadow-xl"
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

              <DropdownConfig
                trigger={
                  <button
                    type="button"
                    aria-label={`Menu da conta de ${user.name}`}
                    className="ml-1 inline-flex min-w-0 items-center gap-2 rounded-full p-1 pr-1.5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:ml-2 sm:gap-2.5 sm:pl-4 sm:pr-3"
                  >
                    <span className="hidden min-w-0 text-right sm:block">
                      <span className="block max-w-28 truncate text-sm font-semibold leading-tight md:max-w-44">
                        {user.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-tight text-blue-200">
                        Minha conta
                      </span>
                    </span>
                    <Image
                      unoptimized
                      className="h-9 w-9 shrink-0 rounded-full border border-white/30 object-cover sm:h-10 sm:w-10"
                      src={user.profile_url}
                      alt=""
                      width={40}
                      height={40}
                    />
                    <ChevronDown className="hidden h-4 w-4 text-blue-200 sm:block" aria-hidden="true" />
                  </button>
                }
              />
            </nav>
          </div>
        </header>
      );
}