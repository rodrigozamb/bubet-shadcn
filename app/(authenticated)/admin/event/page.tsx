/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
// TELA DE LOGIN
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AvatarIcon from "@/components/AvatarIcon";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Bounce, toast } from "react-toastify";
import { Award, CalendarDays, Check, Clock3, ImagePlus, MapPin, Search, Users } from "lucide-react";
import { Header } from "@/components/Header";

interface Competitor{
  id: string,
  name: string,
  profile_url: string,
}

interface Judge{
    id: string,
    nickname: string,
    avatar: string
}

interface Estandarte{
    id: string,
    name: string,
    description: string
}

interface SelectionPanelProps<T extends { id: string }> {
  title: string;
  description: string;
  items: T[];
  selectedItems: T[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onToggle: (item: T) => void;
  getLabel: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  accent: "blue" | "violet" | "amber";
}

function SelectionPanel<T extends { id: string }>({
  title,
  description,
  items,
  selectedItems,
  searchTerm,
  onSearchChange,
  onToggle,
  getLabel,
  renderItem,
  accent,
}: SelectionPanelProps<T>) {
  const accentStyles = {
    blue: { icon: "bg-blue-100 text-blue-700", count: "bg-blue-50 text-blue-700" },
    violet: { icon: "bg-violet-100 text-violet-700", count: "bg-violet-50 text-violet-700" },
    amber: { icon: "bg-amber-100 text-amber-700", count: "bg-amber-50 text-amber-700" },
  }[accent];
  const SelectionIcon = accent === "amber" ? Award : Users;

  const listClassName = "min-h-36 max-h-64 space-y-2 overflow-y-auto p-3";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${accentStyles.icon}`}>
            <SelectionIcon size={19} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${accentStyles.count}`}>
          {selectedItems.length} selecionado{selectedItems.length === 1 ? "" : "s"}
        </span>
      </header>

      <div className="grid gap-4 p-4 md:grid-cols-2 md:p-5">
        <div className="min-w-0">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Disponíveis <span className="text-slate-400">({items.length})</span>
          </label>
          <div className="relative mb-2">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={`Buscar ${title.toLowerCase()}...`}
              aria-label={`Buscar ${title.toLowerCase()} disponíveis`}
              className="h-10 border-slate-200 bg-slate-50 pl-9 text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className={`${listClassName} rounded-xl bg-slate-50`}>
            {items.length > 0 ? items.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => onToggle(item)}
                className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-white p-2.5 text-left text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={`Adicionar ${getLabel(item)}`}
              >
                <span className="min-w-0 flex-1">{renderItem(item)}</span>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <span aria-hidden="true" className="text-lg leading-none">+</span>
                </span>
              </button>
            )) : (
              <p className="px-2 py-6 text-center text-sm text-slate-500">
                {searchTerm ? "Nenhum resultado para essa busca." : "Todos já foram selecionados."}
              </p>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-2 block text-sm font-medium text-slate-700">No evento</p>
          <div className={`${listClassName} rounded-xl border border-dashed border-slate-200 bg-white`}>
            {selectedItems.length > 0 ? selectedItems.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => onToggle(item)}
                className="flex w-full items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-2.5 text-left text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label={`Remover ${getLabel(item)}`}
              >
                <span className="min-w-0 flex-1">{renderItem(item)}</span>
                <Check size={18} className="shrink-0 text-emerald-600" aria-hidden="true" />
              </button>
            )) : (
              <p className="px-2 py-6 text-center text-sm text-slate-500">
                Selecione itens disponíveis para adicioná-los aqui.
              </p>
            )}
          </div>
          {selectedItems.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">Clique em um item para removê-lo.</p>
          )}
        </div>
      </div>
    </section>
  );
}


export default function AdminCreateEventPage({}) {

  const router = useRouter()
  const [checked, setChecked] = useState(false)
    
  const [name, setName] = useState<string>("");
  const [description, setDescripion] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [starts_at, setStartsAt] = useState<string>("");
  const [ends_at, setEndsAt] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [avatar, setAvatar] = useState<File | null>(null);

  
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [searchCompetitorTerm, setSearchCompetitorhTerm] = useState("");    
  const searchCompetitors = competitors.filter((item) =>
    item.name.toLowerCase().includes(searchCompetitorTerm.toLowerCase())
  );
  const [selectedCompetitors, setSelectedCompetitors] = useState<Competitor[]>([]);
  const [selectedCompetitorsCount, setSelectedCompetitorsCount] = useState<number>(0)
  const availableCompetitors = searchCompetitors.filter(c => !selectedCompetitors.some(s => s.id === c.id));
  
  const [judges, setJudges] = useState<Judge[]>([]);
  const [searchJudgeTerm, setSearchJudgeTerm] = useState("");    
  const searchJudges = judges.filter((item) =>
    item.nickname.toLowerCase().includes(searchJudgeTerm.toLowerCase())
  );
  const [selectedJudges, setSelectedJudges] = useState<Judge[]>([]);
  const [selectedJudgesCount, setSelectedJudgesCount] = useState<number>(0)
  const availableJudges = searchJudges.filter(c => !selectedJudges.some(s => s.id === c.id));

  const [estandartes, setEstandartes] = useState<Estandarte[]>([]);
  const [searchEstandatesTerm, setSearchEstandarteTerm] = useState("");    
  const searchEstandartes = estandartes.filter((item) =>
    item.name.toLowerCase().includes(searchEstandatesTerm.toLowerCase())
  );
  const [selectedEstandartes, setSelectedEstandartes] = useState<Estandarte[]>([]);
  const [selectedEstandartesCount, setSelectedEstandartesCount] = useState<number>(0)
  const availableEstandartes = searchEstandartes.filter(c => !selectedEstandartes.some(s => s.id === c.id));    
    
    const toggleCompetitor = (comp: Competitor) => {
      setSelectedCompetitors(prev =>
        prev.some(c => c.id === comp.id)
        ? prev.filter(c => c.id !== comp.id)
        : [comp, ...prev]
      );
    };

    const toggleJudge = (judge: Judge) => {
      setSelectedJudges(prev =>
        prev.some(c => c.id === judge.id)
        ? prev.filter(c => c.id !== judge.id)
        : [judge, ...prev]
      );
    };

    const toggleEstandarte = (estandarte: Estandarte) => {
      setSelectedEstandartes(prev =>
        prev.some(c => c.id === estandarte.id)
        ? prev.filter(c => c.id !== estandarte.id)
        : [estandarte, ...prev]
      );
    };
    
    useEffect(()=>{
      setSelectedCompetitorsCount(selectedCompetitors.length)
      setSelectedJudgesCount(selectedJudges.length)
      setSelectedEstandartesCount(selectedEstandartes.length)
    },[selectedCompetitors, selectedEstandartes, selectedJudges])
  
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
  
      if (file) {
        setAvatar(file);
      }
  };


  const handleCreate = async () => {
    
    toast.info("Evento está sendo criado, aguarde um minuto...", {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce,
    })
    const ds = date.split("/")
    const sa = starts_at.split(":")
    const ea = ends_at.split(":")

    

    const req_competitors = selectedCompetitors.map((cmp) => { return {id:cmp.id}})
    const req_judges = selectedJudges.map((jdg) => { return {id:jdg.id}})
    const req_banner_types = selectedEstandartes.map((ests) => { return {id:ests.id}})

    setName("")
    setDescripion("")
    setDate("")
    setStartsAt("")
    setEndsAt("")
    setAvatar(null)

    try{
      const newEventReq = {
        name: name,
        description,
        date: ds[2]+"-"+ds[1]+"-"+ds[0]+" 00:00:00.000",
        starts_at: ds[2]+"-"+ds[1]+"-"+ds[0]+" "+sa[0]+":"+sa[1]+":00.000",
        ends_at: ds[2]+"-"+ds[1]+"-"+ds[0]+" "+ea[0]+":"+ea[1]+":00.000",
        local: location,
        judges: req_judges,
        competitors: req_competitors,
        event_banner_types: req_banner_types
      }
      const newEvent = await api.post(`/events`,newEventReq)
      if(newEvent.status != 201){
       console.log('DEU ERRO NA CRIAÇÃO DO EVENTO') 
      }else{

        const formData = new FormData()
        formData.append("banner",avatar!)
        const addBanner = await api.post(`/event-banner/${newEvent.data.id}`, formData)
        console.log(addBanner)
        toast.success('Evento criado com sucesso!!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        })


      router.push(`/events/${newEvent.data.id}`) 
      }
      
    }catch(error:any){
      console.log(error)
      if (error instanceof Error) {
        toast.error(error.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        })
      } else {
        toast.error('Erro Desconhecido', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        })
      }
    }
  }

  useEffect(() => {
    const token = Cookies.get('bubet.token')
    const base64Url = token!.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    const tok =  JSON.parse(window.atob(base64))

    if (tok.role!="ADMIN") {
      // Not logged in → send to login
      router.replace('/dashboard')
    } else {
      // Logged in → render children
      setChecked(true)
    }

    api.get(`/competitors`, { withCredentials: true })
        .then((res) => {
            setCompetitors(res.data)
            api.get(`/judges`, { withCredentials: true })
            .then((res2) => {
                setJudges(res2.data)
                api.get(`/estandartes`, { withCredentials: true })
                .then((res3) => {
                    setEstandartes(res3.data)
                })
            })
        })
  }, [router])
  
  if (!checked) {
    return null  // or a loading spinner
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-blue-950 pb-12">
        <title>BUBet | Criar evento</title>

      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 px-5 pb-20 pt-10 text-white sm:px-8 sm:pt-14">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Painel administrativo</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Crie um novo evento</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
            Informe os dados principais e escolha quem vai participar. Você poderá revisar suas seleções antes de criar o evento.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100">
            <span className="inline-flex items-center gap-2"><CalendarDays size={16} aria-hidden="true" /> Informações do evento</span>
            <span className="inline-flex items-center gap-2"><Users size={16} aria-hidden="true" /> Participantes e estandartes</span>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-10 max-w-6xl space-y-6 px-4 sm:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Informações do evento</h2>
            <p className="mt-1 text-sm text-slate-500">Defina os detalhes que serão exibidos para os participantes.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Nome do evento</Label>
              <Input
                id="name"
                value={name}
                type="text"
                placeholder="Ex.: Campeonato de inverno"
                onChange={(event) => setName(event.target.value)}
                required
                className="h-11 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700">Descrição</Label>
              <Input
                id="description"
                value={description}
                type="text"
                placeholder="Conte um pouco sobre o evento"
                onChange={(event) => setDescripion(event.target.value)}
                required
                className="h-11 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location" className="flex items-center gap-2 text-slate-700">
                <MapPin size={16} aria-hidden="true" /> Local
              </Label>
              <Input
                id="location"
                value={location}
                type="text"
                placeholder="Endereço, cidade ou link do local"
                onChange={(event) => setLocation(event.target.value)}
                required
                className="h-11 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2 text-slate-700">
                <CalendarDays size={16} aria-hidden="true" /> Data
              </Label>
              <Input
                id="date"
                value={date}
                type="text"
                placeholder="DD/MM/AAAA"
                onChange={(event) => setDate(event.target.value)}
                required
                className="h-11 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500">Use o formato dia/mês/ano.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="starts_at" className="flex items-center gap-2 text-slate-700">
                <Clock3 size={16} aria-hidden="true" /> Horário de início
              </Label>
              <Input
                id="starts_at"
                value={starts_at}
                type="text"
                placeholder="HH:MM"
                onChange={(event) => setStartsAt(event.target.value)}
                required
                className="h-11 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ends_at" className="flex items-center gap-2 text-slate-700">
                <Clock3 size={16} aria-hidden="true" /> Horário de término
              </Label>
              <Input
                id="ends_at"
                value={ends_at}
                type="text"
                placeholder="HH:MM"
                onChange={(event) => setEndsAt(event.target.value)}
                required
                className="h-11 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="avatar" className="flex items-center gap-2 text-slate-700">
              <ImagePlus size={16} aria-hidden="true" /> Foto do evento
            </Label>
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="border-0 bg-transparent text-slate-700 shadow-none file:mr-4 file:rounded-lg file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:font-semibold file:text-blue-800 hover:file:bg-blue-200"
              />
              <p className="mt-2 text-xs text-slate-500">
                {avatar ? `Imagem selecionada: ${avatar.name}` : "Escolha uma imagem para identificar seu evento."}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <SelectionPanel
            title="Competidores"
            description="Quem vai competir neste evento"
            items={availableCompetitors}
            selectedItems={selectedCompetitors}
            searchTerm={searchCompetitorTerm}
            onSearchChange={setSearchCompetitorhTerm}
            onToggle={toggleCompetitor}
            getLabel={(competitor) => competitor.name}
            renderItem={(competitor) => (
              <span className="flex min-w-0 items-center gap-3">
                <AvatarIcon name={competitor.name} size={36} src={competitor.profile_url} />
                <span className="truncate">{competitor.name}</span>
              </span>
            )}
            accent="blue"
          />
          <SelectionPanel
            title="Jurados"
            description="Quem vai avaliar as apresentações"
            items={availableJudges}
            selectedItems={selectedJudges}
            searchTerm={searchJudgeTerm}
            onSearchChange={setSearchJudgeTerm}
            onToggle={toggleJudge}
            getLabel={(judge) => judge.nickname}
            renderItem={(judge) => (
              <span className="flex min-w-0 items-center gap-3">
                <AvatarIcon name={judge.nickname} size={36} src={judge.avatar} />
                <span className="truncate">{judge.nickname}</span>
              </span>
            )}
            accent="violet"
          />
        </div>

        <SelectionPanel
          title="Estandartes"
          description="Escolha os estandartes disponíveis neste evento"
          items={availableEstandartes}
          selectedItems={selectedEstandartes}
          searchTerm={searchEstandatesTerm}
          onSearchChange={setSearchEstandarteTerm}
          onToggle={toggleEstandarte}
          getLabel={(estandarte) => estandarte.name}
          renderItem={(estandarte) => <span className="truncate">{estandarte.name}</span>}
          accent="amber"
        />

        <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-semibold text-slate-900">Tudo pronto?</p>
            <p className="mt-1 text-sm text-slate-500">
              {selectedCompetitorsCount} competidor{selectedCompetitorsCount === 1 ? "" : "es"},{" "}
              {selectedJudgesCount} jurado{selectedJudgesCount === 1 ? "" : "s"} e{" "}
              {selectedEstandartesCount} estandarte{selectedEstandartesCount === 1 ? "" : "s"} selecionado{selectedEstandartesCount === 1 ? "" : "s"}.
            </p>
          </div>
          <Button
            className="h-12 w-full cursor-pointer bg-amber-400 px-8 font-bold text-slate-950 shadow-sm transition hover:bg-amber-300 sm:w-auto"
            onClick={handleCreate}
          >
            Criar evento
          </Button>
        </div>
      </div>
      </main>
    </>
    );
  }