"use client"

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useContext, useEffect, useState } from "react";


interface TransactionProps{
  id:string,
  description: string,
  status: string,
  payed: string,
  link?: string,
  created_at: string
  value:string
}


export default function ComprasPage() {

  useContext(AuthContext)

  const [transactions, setTransactions] = useState<TransactionProps[]>([]) 


    useEffect(()=>{
      api.get(`/transactions`, { withCredentials: true })
        .then((res)=>{
          console.log(res.data)
          setTransactions(res.data)
        })
    },[])

  const tit = `Histórico de Compras`

  return (
    <>

      <title>{tit}</title>
      <meta name="event" content="Histórico de compras!"/>
      
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>

        <div className="font-extrabold text-2xl flex justify-center align-middle items-center my-5">
          Transações
        </div>

        <div className="flex flex-col items-center" >
        
          {
            transactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((tra)=>{
              return (
                <div key={`${tra.id}`}>
                <div className="flex justify-between w-200 my-5 border-2 rounded-xl px-3"  >
                    <div className="flex flex-col text-center text-gray-700 m-3">
                        <span className="font-medium">Feito em:</span>
                        <span className="font-medium">{tra.created_at.split("T")[0].split("-")[2]+"/"+tra.created_at.split("T")[0].split("-")[1]+"/"+tra.created_at.split("T")[0].split("-")[0]}</span>
                    </div>
                    <div className="flex flex-col text-center text-gray-700 m-3">
                        <span className="font-medium">Valor:</span>
                        <span className="font-medium">R$ {tra.value}</span>
                    </div>
                    <div className="flex flex-col text-center items-center justify-center ">
                        <span className="font-semibold ">{tra.description}</span>
                    </div>

                    <div className="flex flex-col text-center items-center justify-center">
                      {
                        tra.status === "PAYED" ?
                          <Button className="font-semibold bg-green-800 hover:bg-green-800 ">Pago</Button>
                        :
                          (new Date().getTime() - new Date(tra.created_at).getTime()) >= (24 * 60 * 60 * 1000) || !tra.link ?
                            <Button disabled className="font-semibold bg-red-800 hover:bg-red-800">Expirado</Button>
                          :
                            <Button className="font-semibold bg-blue-700 hover:bg-blue-800 cursor-pointer" onClick={()=>{window.open(tra.link, "_blank", "noopener,noreferrer");}} >Pagar</Button>
                      }
                        
                    </div>                    
                </div>

                </div>
              )
            })
          }

          
        
                        
                        
                  
        </div>
      </div>
    </>
  );
}
