import Image from "next/image";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { SelectCompetitor } from "./SelectCompetitor";
import React, { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";

interface Competitor{
  id: string,
  name: string,
  profile_url: string,
}

interface BetSheetProps {
  competitors:Competitor[],
  estandartes:{
    id: string,
    name: string
  }[]
}

export function BetSheet({ competitors, estandartes }:BetSheetProps){

  const router = useRouter();

  const params = useParams<{id: string}>()
  const { id } = params
  
  const [selected, setSelected] = useState<Competitor[]>([]);
  const [selectedCount, setSelectedCount] = useState<number>(0)
  const [selectedValues, setSelectedValues] = React.useState<{ bannerTypeId: string; competitorId: string }[]>([])
  
  const available = competitors.filter(c => !selected.some(s => s.id === c.id));
  
  const toggleCompetitor = (comp: Competitor) => {
    setSelected(prev =>
      prev.some(c => c.id === comp.id)
      ? prev.filter(c => c.id !== comp.id)
      : [comp, ...prev]
    );
  };
  
  useEffect(()=>{
    setSelectedCount(selected.length)
  },[selected])


  const handleChange = (bannerTypeId: string, competitorId: string) => {
    setSelectedValues((prev) => {
      const existingIndex = prev.findIndex(
        (entry) => entry.bannerTypeId === bannerTypeId
      );

      if (existingIndex !== -1) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = { bannerTypeId, competitorId };
        return updated;
      } else {
        // Add new entry
        return [...prev, { bannerTypeId, competitorId }];
      }
    });
  };


  const handleSubmit = async ( data: any, ests: any) =>{
    
    const bet_body = data.map((cp:any) => cp.id)
    
    try{
      const res = await api.post(`/bets/${id}`,{bets: bet_body})
      const req = await api.post(`/estandartes/${id}`,{data: ests})

      toast.success('Aposta feita com sucesso!', {
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
    } catch(error: any){
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
    }finally{
      router.push(`/events/${id}`)
    }
  }


  return(
      <Sheet>
      <SheetTrigger className="cursor-pointer w-56 h-15 text-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-200">Fazer Aposta</SheetTrigger>
      <SheetContent className="flex" side="bottom">
          <SheetHeader className="text-center ">
            <SheetTitle className="text-2xl">Fazer Aposta</SheetTitle>
            <SheetDescription>
              Coloque as baterias em ordem de pódio, além de assinalar os vencedores dos estandartes.
            </SheetDescription>
          </SheetHeader>
            <div className="flex justify-center items-center">

                {/* Aposta de Resultado */}
              <div className="flex flex-col justify-center mr-15">
                <div className="text-center my-5">
                  <div className="text-xl font-semibold">Resultado</div>
                  <div>Escolha, em ordem decrescente, os colocados de cada posição do campeonato</div>
                </div>
                <div className="flex ">
                  <div className="w-65 h-90 overflow-hidden shadow rounded-2xl mx-2">
                    {/* Header */}
                    <div className="flex justify-between rounded-t-2xl h-15 bg-blue-900 text-white">
                      <span className="content-center ml-5 text-mk font-bold">Competidores</span>
                      <div className="flex flex-col mr-5 justify-center align-middle content-center ">
                        <span className="flex justify-center  content-center border-2 rounded-xl w-7 h-7 shadow-2xl font-bold"> {competitors.length - selectedCount} </span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-85 h-90 overflow-hidden bg-gray-300 rounded p-5 shadow">
                            
                            <div className="space-y-2 h-64 overflow-auto">
                            {
                                available.map((competitor, i) => (
                                    <div 
                                      key={i} 
                                      className="flex p-2 bg-gray-100 rounded-xl cursor-pointer"
                                      onClick={()=> toggleCompetitor(competitor)}
                                    >
                                      <Image className="mx-2" src={competitor.profile_url} alt={`${i}`} width={40} height={40}/>
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
                      <span className="content-center ml-5 text-mk font-bold">Aposta</span>
                      <div className="flex flex-col mr-5 justify-center align-middle content-center ">
                        <span className="flex justify-center  content-center border-2 rounded-xl w-7 h-7 shadow-2xl font-bold"> {selectedCount} </span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-85 h-90 overflow-hidden bg-gray-300 rounded p-5">
                            
                            <div className="space-y-2 h-64 overflow-auto">
                            {
                                selected.map((competitor, i) => (
                                    <div 
                                      key={i} 
                                      className="flex p-2 bg-gray-100 rounded-xl cursor-pointer shadow"
                                      onClick={()=> toggleCompetitor(competitor)}
                                    >
                                      <span className="content-center ml-1">{i+1}º</span>
                                      <Image className="mx-2" src={competitor.profile_url} alt={`${i}`} width={40} height={40}/>
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
              </div>

              {/* Aposta de Estandartes */}
              <div className="flex flex-col justify-center w-200 ml-15">

                <div className="text-center">
                  <div className="text-xl font-semibold">Estandartes</div>
                  <div>Escolha os vencedores dos estandartes dessa competição</div>
                </div>
                
                <div className="grid grid-cols-3 my-5 ">

                  {
                    estandartes.map((est,idx)=>(
                      <div className="flex flex-col items-center text-center py-3 my-3 mx-2 border-2 bg-gray-100 rounded-2xl" key={idx}>
                        <div className="text-md font-medium py-2">{est.name}</div>
                        <SelectCompetitor 
                          options={competitors} 
                          value={
                            selectedValues.find((entry) => entry.bannerTypeId === est.id)?.competitorId ?? undefined
                          }
                          onValueChange={(v)=> handleChange(est.id,   v)} 
                        />
                      </div>
                    ))
                  }

                </div>

              </div>
            </div>
          <SheetFooter className="flex justify-center items-center mb-20">
            <SheetClose asChild>
              <Button 
                className="cursor-pointer w-56 h-15 text-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-200" 
                type="submit"
                onClick={()=> handleSubmit(selected, selectedValues) }
              >
                Fazer aposta
              </Button>
            </SheetClose>
          </SheetFooter>
      </SheetContent>
      </Sheet>
  )
}
