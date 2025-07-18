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

interface AdminCreateEventProps{

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
        <div className="flex flex-col justify-center items-center justify-begin bg-blue-900 w-screen h-300">
            <title>BUBet | ADMIN</title>

            <div className="flex flex-col items-center bg-amber-100 w-350 py-5">
                <span className="font-medium text-2xl my-4">Crie um novo evento</span>

                <div className="flex justify-between w-230">
                    
                    <div className="my-3">
                    <Label className="flex items-center justify-center mb-1" htmlFor="email">Nome</Label>
                    <Input 
                        className="bg-white text-black w-75"
                        id="name"
                        value={name}
                        type="text"
                        placeholder="Nome do evento"
                        onChange={(e)=>setName(e.target.value)}
                        required
                    />
                    </div>
                    <div className="my-3">
                    <Label className="flex items-center justify-center mb-1" htmlFor="description">Descrição</Label>
                    <Input
                        className="bg-white text-black w-80"
                        id="description"
                        value={description}
                        type="text"
                        placeholder="Descrição do evento"
                        onChange={(e)=>setDescripion(e.target.value)}
                        required
                    />
                    </div>
                    <div className="my-3">
                    <Label className="flex items-center justify-center mb-1" htmlFor="description">Local</Label>
                    <Input
                        className="bg-white text-black w-70"
                        id="location"
                        value={location}
                        type="text"
                        placeholder="Local do evento"
                        onChange={(e)=>setLocation(e.target.value)}
                        required
                    />
                    </div>
                </div>

                <div className="flex justify-center w-230">
                
                    <div className="m-3">
                    <Label className="flex items-center justify-center" htmlFor="description">Data</Label>
                    <Input 
                        id="date"
                        className="bg-white text-black"
                        value={date}
                        type="text"
                        placeholder="Data do evento"
                        onChange={(e)=>setDate(e.target.value)}
                        required
                    />
                    </div>
                    <div className="m-3">
                    <Label className="flex items-center justify-center" htmlFor="description">Horário de Início</Label>
                    <Input 
                        className="bg-white text-black"
                        id="starts_at"
                        value={starts_at}
                        type="text"
                        placeholder="Horário de início do evento"
                        onChange={(e)=>setStartsAt(e.target.value)}
                        required
                    />
                    </div>
                    <div className="m-3">
                    <Label className="flex items-center justify-center" htmlFor="description">Horário de Término</Label>
                    <Input 
                        className="bg-white text-black"
                        id="ends_at"
                        value={ends_at}
                        type="text"
                        placeholder="Horário de Término do evento"
                        onChange={(e)=>setEndsAt(e.target.value)}
                        required
                    />
                    </div>
                
                </div>


                <div className="my-3">
                  <Label className="flex items-center justify-center" htmlFor="avatar">Foto de Evento</Label>
                  <Input
                    className="bg-white text-black"
                    id="avatar" 
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                <div className="flex justify-center mb-5"> 
                    {/* COMPETIDORES */}
                    <div className="flex ">
                        <div className="w-65 h-90 overflow-hidden shadow rounded-2xl mx-2">
                        {/* Header */}
                        <div className="flex justify-between rounded-t-2xl py-2 bg-blue-900 text-white">
                            <span className="content-center ml-5 text-mk font-bold">Competidores</span>
                        </div>
                        <div className="flex justify-center py-2 bg-blue-900">
                            <Input className="w-60  bg-amber-50" type="search" placeholder="Pesquise aqui...." value={searchCompetitorTerm} onChange={(e) => setSearchCompetitorhTerm(e.target.value)}/>         
                        </div>
                        
                        <div className="flex justify-center">
                            <div className="w-85 h-90 overflow-hidden bg-gray-300 rounded p-5 shadow">
                                
                                <div className="space-y-2 h-64 overflow-auto">
                                {
                                    availableCompetitors.map((competitor, i) => (
                                        <div 
                                            key={i} 
                                            className="flex p-2 bg-gray-100 rounded-xl cursor-pointer"
                                            onClick={()=> toggleCompetitor(competitor)}
                                        >
                                            <AvatarIcon name={competitor.name} size={40} src={competitor.profile_url}  className="mx-2"  />
                                            <span className="content-center truncate">
                                                {competitor.name}
                                            </span>  
                                        </div>
                                    ))
                                }
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="w-65 h-90 overflow-hidden shadow rounded-2xl mx-2">
                        {/* Header */}
                        <div className="flex justify-between rounded-t-2xl h-15 bg-blue-900 text-white">
                            <span className="content-center ml-5 text-mk font-bold">Selecionados</span>
                            <div className="flex flex-col mr-5 justify-center align-middle content-center ">
                            <span className="flex justify-center  content-center border-2 rounded-xl w-7 h-7 shadow-2xl font-bold"> {selectedCompetitorsCount} </span>
                            </div>
                        </div>
    
                        <div className="flex justify-center">
                            <div className="w-85 h-90 overflow-hidden bg-gray-300 rounded p-5">
                                
                                <div className="space-y-2 h-64 overflow-auto">
                                {
                                    selectedCompetitors.map((competitor, i) => (
                                        <div 
                                            key={i} 
                                            className="flex p-2 bg-gray-100 rounded-xl cursor-pointer shadow"
                                            onClick={()=> toggleCompetitor(competitor)}
                                        >
                                            <AvatarIcon name={competitor.name} size={40} src={competitor.profile_url} className="mx-2" />
                                            <span className="content-center truncate">
                                                {competitor.name}
                                            </span>  
                                        </div>
                                    ))
                                }
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* JURADOS */}
                    <div className="flex ">
                        <div className="w-65 h-90 overflow-hidden shadow rounded-2xl mx-2">
                        {/* Header */}
                        <div className="flex justify-between rounded-t-2xl py-2 bg-purple-900 text-white">
                            <span className="content-center ml-5 text-mk font-bold">Jurados</span>
                        </div>
                        <div className="flex justify-center py-2 bg-purple-900">
                            <Input className="w-60  bg-amber-50" type="search" placeholder="Pesquise aqui...." value={searchJudgeTerm} onChange={(e) => setSearchJudgeTerm(e.target.value)}/>         
                        </div>
                        
                        <div className="flex justify-center">
                            <div className="w-85 h-90 overflow-hidden bg-gray-300 rounded p-5 shadow">
                                
                                <div className="space-y-2 h-64 overflow-auto">
                                {
                                    availableJudges.map((judge, i) => (
                                        <div 
                                            key={i} 
                                            className="flex p-2 bg-gray-100 rounded-xl cursor-pointer"
                                            onClick={()=> toggleJudge(judge)}
                                        >
                                            <AvatarIcon name={judge.nickname} size={40} src={judge.avatar}  className="mx-2"  />
                                            <span className="content-center truncate">
                                                {judge.nickname}
                                            </span>  
                                        </div>
                                    ))
                                }
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="w-65 h-90 overflow-hidden shadow rounded-2xl mx-2">
                        {/* Header */}
                        <div className="flex justify-between rounded-t-2xl h-15 bg-purple-900 text-white">
                            <span className="content-center ml-5 text-mk font-bold">Selecionados</span>
                            <div className="flex flex-col mr-5 justify-center align-middle content-center ">
                            <span className="flex justify-center  content-center border-2 rounded-xl w-7 h-7 shadow-2xl font-bold"> {selectedJudgesCount} </span>
                            </div>
                        </div>
    
                        <div className="flex justify-center">
                            <div className="w-85 h-90 overflow-hidden bg-gray-300 rounded p-5">
                                
                                <div className="space-y-2 h-64 overflow-auto">
                                {
                                    selectedJudges.map((judge, i) => (
                                        <div 
                                            key={i} 
                                            className="flex p-2 bg-gray-100 rounded-xl cursor-pointer shadow"
                                            onClick={()=> toggleJudge(judge)}
                                        >
                                            <AvatarIcon name={judge.nickname} size={40} src={judge.avatar} className="mx-2" />
                                            <span className="content-center truncate">
                                                {judge.nickname}
                                            </span>  
                                        </div>
                                    ))
                                }
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>

                </div>

                {/* ESTANDARTES */}
                <div className="flex mb-5">
                    <div className="w-65 h-90 overflow-hidden shadow rounded-2xl mx-2">
                    {/* Header */}
                    <div className="flex justify-between rounded-t-2xl py-2 bg-purple-900 text-white">
                        <span className="content-center ml-5 text-mk font-bold">Estandartes</span>
                    </div>
                    <div className="flex justify-center py-2 bg-purple-900">
                        <Input className="w-60  bg-amber-50" type="search" placeholder="Pesquise aqui...." value={searchEstandatesTerm} onChange={(e) => setSearchEstandarteTerm(e.target.value)}/>         
                    </div>
                    
                    <div className="flex justify-center">
                        <div className="w-85 h-90 overflow-hidden bg-gray-300 rounded p-5 shadow">
                            
                            <div className="space-y-2 h-64 overflow-auto">
                            {
                                availableEstandartes.map((estandarte, i) => (
                                    <div 
                                        key={i} 
                                        className="flex p-2 bg-gray-100 rounded-xl cursor-pointer"
                                        onClick={()=> toggleEstandarte(estandarte)}
                                    >
                                        <span className="content-center truncate">
                                            {estandarte.name}
                                        </span>  
                                    </div>
                                ))
                            }
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="w-65 h-90 overflow-hidden shadow rounded-2xl mx-2">
                    {/* Header */}
                    <div className="flex justify-between rounded-t-2xl h-15 bg-purple-900 text-white">
                        <span className="content-center ml-5 text-mk font-bold">Selecionados</span>
                        <div className="flex flex-col mr-5 justify-center align-middle content-center ">
                        <span className="flex justify-center  content-center border-2 rounded-xl w-7 h-7 shadow-2xl font-bold"> {selectedEstandartesCount} </span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-85 h-90 overflow-hidden bg-gray-300 rounded p-5">
                            
                            <div className="space-y-2 h-64 overflow-auto">
                            {
                                selectedEstandartes.map((estandarte, i) => (
                                    <div 
                                        key={i} 
                                        className="flex p-2 bg-gray-100 rounded-xl cursor-pointer shadow"
                                        onClick={()=> toggleEstandarte(estandarte)}
                                    >
                                        <span className="content-center truncate">
                                            {estandarte.name}
                                        </span>  
                                    </div>
                                ))
                            }
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                    <Button className="w-65 h-20 cursor-pointer bg-yellow-500 hover:bg-yellow-600 font-extrabold text-3xl"
                    onClick={handleCreate}
                >
                Criar Evento
                </Button>
            </div>
        </div>
      </>
    );
  }