"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Bounce, toast } from "react-toastify"
import { Check, CircleHelp, Flag, Plus, Sparkles, TicketPercent, Trophy, Users, X } from "lucide-react"
import { api } from "@/services/api"
import AvatarIcon from "./AvatarIcon"
import { SelectCompetitor } from "./SelectCompetitor"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface Competitor {
  id: string
  name: string
  profile_url: string
}

interface BetSheetProps {
  competitors: Competitor[]
  estandartes: {
    id: string
    name: string
  }[]
  cupons: {
    id: string
    value: string
    used_at: string
    betId: string
  }[]
}

export function BetSheet({ competitors, estandartes, cupons }: BetSheetProps) {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { id } = params

  const [selected, setSelected] = useState<Competitor[]>([])
  const [selectedCupom, setSelectedCupom] = useState<string | null>(null)
  const [selectedValues, setSelectedValues] = useState<
    { bannerTypeId: string; competitorId: string }[]
  >([])

  const available = competitors.filter(
    (competitor) => !selected.some((item) => item.id === competitor.id)
  )

  const toggleCompetitor = (competitor: Competitor) => {
    setSelected((previous) =>
      previous.some((item) => item.id === competitor.id)
        ? previous.filter((item) => item.id !== competitor.id)
        : [competitor, ...previous]
    )
  }

  const handleChange = (bannerTypeId: string, competitorId: string) => {
    setSelectedValues((previous) => {
      const existingIndex = previous.findIndex(
        (entry) => entry.bannerTypeId === bannerTypeId
      )

      if (existingIndex !== -1) {
        const updated = [...previous]
        updated[existingIndex] = { bannerTypeId, competitorId }
        return updated
      }

      return [...previous, { bannerTypeId, competitorId }]
    })
  }

  const handleSubmit = async () => {
    if (selectedValues.length !== estandartes.length) {
      toast.info("Você precisa escolher um competidor para cada estandarte", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      })
      return
    }

    if (selected.length !== competitors.length) {
      toast.info("Você precisa escolher uma posição para todos os participantes", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      })
      return
    }

    const body: { bets: string[]; cupom?: string } = {
      bets: selected.map((competitor) => competitor.id),
    }

    if (selectedCupom) {
      body.cupom = selectedCupom
    }

    try {
      const betResponse = await api.post(`/bets/${id}`, body)
      await api.post(`/estandartes/${id}/${betResponse.data.id}`, {
        data: selectedValues,
      })

      toast.success("Aposta feita com sucesso!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      })
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Erro Desconhecido", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      })
    } finally {
      router.push(`/events/${id}`)
    }
  }

  return (
    <Sheet>
      <SheetTrigger className="inline-flex h-12 w-full max-w-56 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-7 text-base font-bold text-white shadow-lg transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 sm:h-14 sm:text-lg">
        Fazer Aposta
      </SheetTrigger>
      <SheetContent
        className="flex h-[92dvh] max-h-[900px] w-full flex-col gap-0 overflow-hidden border-slate-200 bg-slate-50 p-0 text-slate-900 sm:max-w-none"
        side="bottom"
      >
        <SheetHeader className="shrink-0 bg-blue-950 px-5 py-5 pr-16 text-left text-white sm:px-8 sm:py-6 sm:pr-20">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
              <Sparkles size={14} aria-hidden="true" />
              Palpite do evento
            </div>
            <SheetTitle className="text-2xl font-extrabold text-white sm:text-3xl">
              Fazer aposta
            </SheetTitle>
            <SheetDescription className="mt-1 max-w-2xl text-sm leading-relaxed text-blue-100">
              Monte seu pódio, escolha os vencedores dos estandartes e, se quiser, aplique um cupom.
            </SheetDescription>
          </div>
        </SheetHeader>

        <Tabs
          defaultValue="podium"
          className="flex min-h-0 flex-1 flex-col gap-0"
        >
          <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 sm:px-8">
            <TabsList className="mx-auto grid h-auto w-full max-w-3xl grid-cols-3 rounded-2xl bg-slate-100 p-1">
              <TabsTrigger
                value="podium"
                className="h-11 gap-2 rounded-xl text-xs font-bold text-slate-600 data-[state=active]:bg-blue-950 data-[state=active]:text-white data-[state=active]:shadow sm:text-sm"
              >
                <Trophy size={16} aria-hidden="true" />
                Pódio
              </TabsTrigger>
              <TabsTrigger
                value="estandartes"
                className="h-11 gap-2 rounded-xl text-xs font-bold text-slate-600 data-[state=active]:bg-blue-950 data-[state=active]:text-white data-[state=active]:shadow sm:text-sm"
              >
                <Flag size={16} aria-hidden="true" />
                Estandartes
              </TabsTrigger>
              <TabsTrigger
                value="cupons"
                className="h-11 gap-2 rounded-xl text-xs font-bold text-slate-600 data-[state=active]:bg-blue-950 data-[state=active]:text-white data-[state=active]:shadow sm:text-sm"
              >
                <TicketPercent size={16} aria-hidden="true" />
                Cupons
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="podium"
            className="min-h-0 flex-1 overflow-y-auto data-[state=inactive]:hidden"
          >
            <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-8 sm:py-7">
              <div className="mb-5">
                <div className="mb-1 flex items-center gap-2">
                  <Trophy className="size-5 text-amber-500" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Monte seu pódio
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  Selecione do último colocado ao campeão. Cada nova escolha sobe uma posição.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-blue-800" aria-hidden="true" />
                      <h3 className="font-bold text-slate-900">Baterias disponíveis</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold tabular-nums text-slate-600">
                      {available.length}
                    </span>
                  </div>
                  <div className="max-h-[min(48vh,420px)] min-h-36 space-y-2 overflow-y-auto p-3 sm:p-4">
                    {available.length > 0 ? (
                      available.map((competitor) => (
                        <button
                          key={competitor.id}
                          type="button"
                          onClick={() => toggleCompetitor(competitor)}
                          className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                        >
                          <AvatarIcon
                            name={competitor.name}
                            size={40}
                            src={competitor.profile_url}
                            className="shrink-0"
                          />
                          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">
                            {competitor.name}
                          </span>
                          <Plus size={18} className="shrink-0 text-blue-700" aria-hidden="true" />
                        </button>
                      ))
                    ) : (
                      <div className="flex min-h-32 flex-col items-center justify-center rounded-xl bg-emerald-50 px-4 text-center">
                        <Check size={22} className="mb-2 text-emerald-700" aria-hidden="true" />
                        <p className="text-sm font-semibold text-emerald-900">
                          Todos os competidores estão no pódio
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-2">
                      <Trophy size={18} className="text-amber-600" aria-hidden="true" />
                      <h3 className="font-bold text-slate-900">Ordem do pódio</h3>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold tabular-nums text-blue-800">
                      {selected.length}/{competitors.length}
                    </span>
                  </div>
                  <div className="max-h-[min(48vh,420px)] min-h-36 space-y-2 overflow-y-auto p-3 sm:p-4">
                    {selected.length > 0 ? (
                      selected.map((competitor, index) => (
                        <div
                          key={competitor.id}
                          className="flex min-w-0 items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-2.5"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-950 text-xs font-extrabold text-white">
                            {index + 1}
                          </span>
                          <AvatarIcon
                            name={competitor.name}
                            size={40}
                            src={competitor.profile_url}
                            className="shrink-0"
                          />
                          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">
                            {competitor.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleCompetitor(competitor)}
                            aria-label={`Remover ${competitor.name} do pódio`}
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                          >
                            <X size={16} aria-hidden="true" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex min-h-32 flex-col items-center justify-center rounded-xl bg-slate-50 px-4 text-center">
                        <CircleHelp size={22} className="mb-2 text-slate-400" aria-hidden="true" />
                        <p className="text-sm font-medium text-slate-600">
                          Escolha uma bateria para começar a montar o pódio
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="estandartes"
            className="min-h-0 flex-1 overflow-y-auto data-[state=inactive]:hidden"
          >
            <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-8 sm:py-7">
              <div className="mb-5">
                <div className="mb-1 flex items-center gap-2">
                  <Flag className="size-5 text-blue-800" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Estandartes
                  </h2>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold tabular-nums text-blue-800">
                    {selectedValues.length}/{estandartes.length}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  Escolha um vencedor para cada estandarte desta competição.
                </p>
              </div>

              {estandartes.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {estandartes.map((estandarte) => {
                    const selectedCompetitor = selectedValues.find(
                      (entry) => entry.bannerTypeId === estandarte.id
                    )?.competitorId

                    return (
                      <section
                        key={estandarte.id}
                        className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                      >
                        <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
                          <h3 className="min-w-0 font-bold text-slate-900">
                            {estandarte.name}
                          </h3>
                          {selectedCompetitor ? (
                            <Check
                              size={18}
                              className="shrink-0 text-emerald-600"
                              aria-label="Vencedor escolhido"
                            />
                          ) : (
                            <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-800">
                              Pendente
                            </span>
                          )}
                        </div>
                        <SelectCompetitor
                          options={competitors}
                          value={selectedCompetitor}
                          onValueChange={(competitorId) =>
                            handleChange(estandarte.id, competitorId)
                          }
                        />
                      </section>
                    )
                  })}
                </div>
              ) : (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 text-center">
                  <Flag size={28} className="mb-3 text-slate-400" aria-hidden="true" />
                  <p className="font-semibold text-slate-800">
                    Não há estandartes para este torneio
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Você pode seguir para a etapa de cupons.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="cupons"
            className="min-h-0 flex-1 overflow-y-auto data-[state=inactive]:hidden"
          >
            <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-8 sm:py-7">
              <div className="mb-5">
                <div className="mb-1 flex items-center gap-2">
                  <TicketPercent className="size-5 text-emerald-700" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Cupons</h2>
                  <span className="text-xs font-medium text-slate-500">opcional</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  Selecione um cupom para aumentar seus pontos nesta aposta.
                </p>
              </div>

              {cupons.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {cupons.map((cupom) => {
                    const isSelected = selectedCupom === cupom.id

                    return (
                      <button
                        key={cupom.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          setSelectedCupom(isSelected ? null : cupom.id)
                        }
                        className={`group flex min-h-32 w-full items-center gap-4 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
                        }`}
                      >
                        <span
                          className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
                            isSelected
                              ? "bg-emerald-600 text-white"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          <TicketPercent size={24} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-lg font-extrabold text-slate-900">
                            Cupom {cupom.value}%
                          </span>
                          <span className="mt-1 block text-sm text-slate-500">
                            Aumente sua pontuação
                          </span>
                        </span>
                        <span
                          className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 text-transparent"
                          }`}
                        >
                          <Check size={14} aria-hidden="true" />
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 text-center">
                  <TicketPercent size={30} className="mb-3 text-slate-400" aria-hidden="true" />
                  <p className="font-semibold text-slate-800">
                    Você ainda não tem cupons disponíveis
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Gire a roleta para tentar conseguir um cupom.
                  </p>
                  <Button
                    type="button"
                    className="mt-4 cursor-pointer rounded-full bg-blue-950 px-5 hover:bg-blue-800"
                    onClick={() => router.push("/wheel")}
                  >
                    Girar roleta
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <SheetFooter className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 sm:px-8 sm:py-4">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Trophy size={14} className="text-amber-600" aria-hidden="true" />
                Pódio: {selected.length}/{competitors.length}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Flag size={14} className="text-blue-700" aria-hidden="true" />
                Estandartes: {selectedValues.length}/{estandartes.length}
              </span>
              {selectedCupom && (
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <TicketPercent size={14} aria-hidden="true" />
                  Cupom selecionado
                </span>
              )}
            </div>
            <Button
              type="button"
              className="h-12 w-full cursor-pointer rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-8 text-base font-bold text-white shadow-md transition hover:brightness-105 sm:w-auto sm:min-w-56"
              onClick={handleSubmit}
            >
              Fazer aposta
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
