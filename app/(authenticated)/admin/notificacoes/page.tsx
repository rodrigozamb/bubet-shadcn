"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import {
  Bell,
  Check,
  LoaderCircle,
  Megaphone,
  Search,
  Send,
  Users,
} from "lucide-react"
import { api } from "@/services/api"
import { Header } from "@/components/Header"

interface Recipient {
  id: string
  name: string
  username?: string
  email?: string
}

interface NotificationDraft {
  id: string
  title: string
  content: string
  link: string
}

type RecipientMode = "all" | "selected"

function isRecipient(value: unknown): value is Recipient {
  if (typeof value !== "object" || value === null || !("id" in value) || !("name" in value)) {
    return false
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    (!("username" in value) || typeof value.username === "string") &&
    (!("email" in value) || typeof value.email === "string")
  )
}

export default function NotificationsAdminPage() {
  const router = useRouter()
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true)
  const [users, setUsers] = useState<Recipient[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [link, setLink] = useState("")
  const [createdNotification, setCreatedNotification] = useState<NotificationDraft | null>(null)
  const [recipientMode, setRecipientMode] = useState<RecipientMode>("all")
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [actionError, setActionError] = useState("")

  useEffect(() => {
    let active = true

    async function checkAdminAndLoadUsers() {
      const token = Cookies.get("bubet.token")
      const encodedPayload = token?.split(".")[1]

      if (!encodedPayload) {
        router.replace("/dashboard")
        setIsCheckingAdmin(false)
        setIsLoadingUsers(false)
        return
      }

      let isAdmin = false
      try {
        const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/")
        const payload = JSON.parse(window.atob(base64)) as { role?: string }
        isAdmin = payload.role === "ADMIN"
      } catch (error) {
        console.error("Não foi possível validar o acesso administrativo.", error)
      }

      if (!isAdmin) {
        router.replace("/dashboard")
        setIsCheckingAdmin(false)
        setIsLoadingUsers(false)
        return
      }

      if (active) setIsCheckingAdmin(false)

      try {
        const response = await api.get("/users/ranking", { withCredentials: true })
        if (!Array.isArray(response.data) || !response.data.every(isRecipient)) {
          throw new Error("A lista de usuários veio em um formato inválido.")
        }

        if (active) {
          const uniqueUsers = new Map(
            (response.data as Recipient[]).map((recipient) => [recipient.id, recipient]),
          )
          setUsers([...uniqueUsers.values()])
        }
      } catch (error) {
        console.error("Não foi possível carregar a lista de usuários.", error)
        if (active) {
          setUsersError("Não foi possível carregar a lista de usuários. Tente novamente.")
        }
      } finally {
        if (active) {
          setIsLoadingUsers(false)
        }
      }
    }

    void checkAdminAndLoadUsers()
    return () => {
      active = false
    }
  }, [router])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR")
    if (!query) return users

    return users.filter((user) =>
      [user.name, user.username, user.email]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLocaleLowerCase("pt-BR").includes(query)),
    )
  }, [search, users])

  const toggleUser = (userId: string) => {
    setSelectedUserIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId],
    )
  }

  const toggleVisibleUsers = () => {
    const visibleIds = filteredUsers.map((user) => user.id)
    const allVisibleSelected = visibleIds.every((id) => selectedUserIds.includes(id))

    setSelectedUserIds((current) =>
      allVisibleSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])],
    )
  }

  const createNotification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setActionError("")

    const notificationTitle = title.trim()
    const notificationContent = content.trim()
    if (!notificationTitle || !notificationContent) {
      setActionError("Preencha o título e o conteúdo da notificação.")
      return
    }

    setIsCreating(true)
    try {
      const response = await api.post(
        "/notifications",
        {
          title: notificationTitle,
          content: notificationContent,
          link: link.trim(),
        },
        { withCredentials: true },
      )
      const responseData = response.data as {
        id?: string
        notification_id?: string
        notification?: { id?: string }
      }
      const notificationId =
        responseData?.id ??
        responseData?.notification_id ??
        responseData?.notification?.id

      if (!notificationId) {
        setActionError(
          "A notificação foi criada, mas a API não retornou seu identificador. Não é possível enviá-la.",
        )
        return
      }

      setCreatedNotification({
        id: notificationId,
        title: notificationTitle,
        content: notificationContent,
        link: link.trim(),
      })
    } catch (error) {
      console.error("Não foi possível criar a notificação.", error)
      setActionError("Não foi possível criar a notificação. Confira os dados e tente novamente.")
    } finally {
      setIsCreating(false)
    }
  }

  const sendNotification = async () => {
    if (!createdNotification) return

    if (recipientMode === "selected" && selectedUserIds.length === 0) {
      setActionError("Selecione pelo menos uma pessoa para enviar a notificação.")
      return
    }

    setActionError("")
    setIsSending(true)
    try {
      await api.post(
        "/notifications/emit",
        {
          notification_id: createdNotification.id,
          to: recipientMode === "all" ? ["all"] : selectedUserIds,
        },
        { withCredentials: true },
      )
      setSent(true)
    } catch (error) {
      console.error("Não foi possível enviar a notificação.", error)
      setActionError("Não foi possível enviar a notificação. Você pode tentar novamente.")
    } finally {
      setIsSending(false)
    }
  }

  const startNewNotification = () => {
    setTitle("")
    setContent("")
    setLink("")
    setCreatedNotification(null)
    setSelectedUserIds([])
    setRecipientMode("all")
    setSearch("")
    setSent(false)
    setActionError("")
  }

  if (isCheckingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <LoaderCircle aria-hidden="true" className="mr-3 h-5 w-5 animate-spin" />
        Verificando acesso administrativo...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
            <Megaphone aria-hidden="true" className="h-6 w-6" />
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Administração
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Notificações
          </h1>
          <p className="mt-2 text-slate-600">
            Crie uma mensagem e escolha quem deve recebê-la.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Bell aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-blue-800">Etapa 1</p>
                <h2 className="text-lg font-semibold text-slate-900">Criar notificação</h2>
                <p className="mt-1 text-sm text-slate-500">
                  A mensagem será preparada antes de escolher os destinatários.
                </p>
              </div>
            </div>

            {createdNotification ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <Check aria-hidden="true" className="h-4 w-4" />
                  Notificação criada
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{createdNotification.title}</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {createdNotification.content}
                </p>
                {createdNotification.link && (
                  <p className="mt-3 text-sm text-slate-500">
                    Link: <span className="font-medium text-slate-700">{createdNotification.link}</span>
                  </p>
                )}
                <p className="mt-4 break-all font-mono text-xs text-slate-500">
                  ID: {createdNotification.id}
                </p>
                <button
                  type="button"
                  onClick={startNewNotification}
                  className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Criar outra notificação
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={createNotification}>
                <div>
                  <label htmlFor="notification-title" className="mb-2 block text-sm font-medium text-slate-700">
                    Título
                  </label>
                  <input
                    id="notification-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    maxLength={120}
                    placeholder="Ex.: Você é nosso convidado de honra!"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label htmlFor="notification-content" className="mb-2 block text-sm font-medium text-slate-700">
                    Conteúdo
                  </label>
                  <textarea
                    id="notification-content"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    required
                    rows={5}
                    maxLength={1000}
                    placeholder="Escreva a mensagem que será enviada."
                    className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">{content.length}/1000</p>
                </div>

                <div>
                  <label htmlFor="notification-link" className="mb-2 block text-sm font-medium text-slate-700">
                    Link <span className="font-normal text-slate-400">(opcional)</span>
                  </label>
                  <input
                    id="notification-link"
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    placeholder="/wheel"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-1 text-xs text-slate-500">Informe o caminho da página, por exemplo /wheel.</p>
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? (
                    <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bell aria-hidden="true" className="h-4 w-4" />
                  )}
                  {isCreating ? "Criando..." : "Criar notificação"}
                </button>
              </form>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Users aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-emerald-700">Etapa 2</p>
                <h2 className="text-lg font-semibold text-slate-900">Escolher destinatários</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {createdNotification
                    ? "Defina quem receberá esta notificação."
                    : "Crie a notificação para habilitar o envio."}
                </p>
              </div>
            </div>

            <fieldset disabled={!createdNotification || sent || isSending}>
              <legend className="sr-only">Público da notificação</legend>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50">
                  <input
                    type="radio"
                    name="recipient-mode"
                    value="all"
                    checked={recipientMode === "all"}
                    onChange={() => setRecipientMode("all")}
                    className="mt-1 accent-blue-800"
                  />
                  <span>
                    <span className="block font-medium text-slate-900">Todos os usuários</span>
                    <span className="mt-1 block text-sm text-slate-500">
                      Envia para toda a plataforma usando o destinatário &quot;all&quot;.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50">
                  <input
                    type="radio"
                    name="recipient-mode"
                    value="selected"
                    checked={recipientMode === "selected"}
                    onChange={() => setRecipientMode("selected")}
                    className="mt-1 accent-blue-800"
                  />
                  <span>
                    <span className="block font-medium text-slate-900">Pessoas selecionadas</span>
                    <span className="mt-1 block text-sm text-slate-500">
                      Escolha uma ou mais pessoas da lista abaixo.
                    </span>
                  </span>
                </label>
              </div>

              {recipientMode === "selected" && (
                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-700">
                      {selectedUserIds.length} selecionada{selectedUserIds.length === 1 ? "" : "s"}
                    </p>
                    <button
                      type="button"
                      onClick={toggleVisibleUsers}
                      disabled={isLoadingUsers || filteredUsers.length === 0}
                      className="text-sm font-semibold text-blue-700 hover:text-blue-900 disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                      {filteredUsers.length > 0 &&
                      filteredUsers.every((user) => selectedUserIds.includes(user.id))
                        ? "Desmarcar visíveis"
                        : "Selecionar visíveis"}
                    </button>
                  </div>

                  <label htmlFor="user-search" className="sr-only">
                    Buscar usuários
                  </label>
                  <div className="relative">
                    <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="user-search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Buscar por nome, usuário ou email"
                      className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-slate-200">
                    {isLoadingUsers ? (
                      <p className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500">
                        <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                        Carregando usuários...
                      </p>
                    ) : usersError ? (
                      <p role="alert" className="px-4 py-6 text-sm text-rose-700">
                        {usersError}
                      </p>
                    ) : filteredUsers.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm text-slate-500">
                        {users.length === 0 ? "Nenhum usuário encontrado." : "Nenhum resultado para esta busca."}
                      </p>
                    ) : (
                      filteredUsers.map((user) => (
                        <label
                          key={user.id}
                          className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(user.id)}
                            onChange={() => toggleUser(user.id)}
                            className="h-4 w-4 rounded accent-blue-800"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-slate-800">{user.name}</span>
                            {(user.username || user.email) && (
                              <span className="block truncate text-xs text-slate-500">
                                {user.username ? `@${user.username}` : user.email}
                              </span>
                            )}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </fieldset>

            {sent ? (
              <div role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                Notificação enviada com sucesso.
              </div>
            ) : (
              <button
                type="button"
                onClick={sendNotification}
                disabled={!createdNotification || isSending || (recipientMode === "selected" && isLoadingUsers)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSending ? (
                  <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                ) : (
                  <Send aria-hidden="true" className="h-4 w-4" />
                )}
                {isSending ? "Enviando..." : "Enviar notificação"}
              </button>
            )}
          </section>
        </div>

        {actionError && (
          <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {actionError}
          </p>
        )}
      </main>
    </div>
  )
}