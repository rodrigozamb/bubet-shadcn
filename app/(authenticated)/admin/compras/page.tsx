"use client"

import { Header } from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import Cookies from 'js-cookie'
import { api } from "@/services/api";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AvatarIcon from "@/components/AvatarIcon";

interface TransactionsProps{
  payment_id: string,
  id:string
  value:number
  amount:number
  status:string
  payed?:string
  description:string
  created_at:string
  payer:{
    id:string
    name:string
    profile_url:string
  }
}


export default function ComprasPage() {

  useContext(AuthContext)

  const router = useRouter()
  const [transactions, setTransactions] = useState<TransactionsProps[]>([])

    useEffect(()=>{
      const token = Cookies.get('bubet.token')
      const base64Url = token!.split('.')[1]
      const base64 = base64Url.replace('-', '+').replace('_', '/')
      const tok =  JSON.parse(window.atob(base64))

      if (tok.role!="ADMIN") {
        // Not logged in → send to login
        router.replace('/dashboard')
      }

      api.get(`/admin/transactions`, { withCredentials: true })
        .then((res)=>{
          setTransactions(res.data)
        })
    },[])

  const tit = `Extrato de Compras`


  return (
    <>

      <title>{tit}</title>
      <meta name="event" content="Extrato de Compras!"/>
      
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>

        <div className="font-extrabold text-2xl flex flex-col justify-center align-middle items-center my-5">
          Extrato de Compras
        
        </div>
        <div className="flex-1 flex flex-col items-center px-4 w-full">
          <div className="w-full max-w-3xl max-h-[60vh] overflow-y-auto space-y-4 px-2 py-2">
            {
              [...transactions]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((tra) => (
                  <div key={`${tra.id}`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between w-full border-2 rounded-xl px-3 py-4 gap-3">
                      <div className="flex flex-col text-center text-gray-700 m-3">
                        <span className="font-medium">Id:</span>
                        <span className="font-medium">{tra.payment_id}</span>
                      </div>
                      <div className="flex flex-col text-center align-middle items-center text-gray-700 m-3 cursor-pointer" onClick={()=>{ router.push(`/profile/${ tra.payer.id}`) }}>
                        <span className="font-medium">Comprador:</span>
                        <AvatarIcon name={tra.payer.name} size={50} src={tra.payer.profile_url} className="mx-2" />
                        <span className="font-medium">{tra.payer.name}</span>
                      </div>
                      <div className="flex flex-col text-center text-gray-700 m-3">
                        <span className="font-medium">Item:</span>
                        <span className="font-medium">{tra.description} por R${tra.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col text-center text-gray-700 m-3">
                        <span className="font-medium">Quando:</span>
                        <span className="font-medium">{tra.created_at.split("T")[0].split("-")[2]+"/"+tra.created_at.split("T")[0].split("-")[1]+"/"+tra.created_at.split("T")[0].split("-")[0]}</span>
                      </div>
                      <div className="flex flex-col text-center items-center justify-center m-3">
                        <span className="font-medium">Pago:</span>
                        <span className="font-semibold">{tra.payed ? tra.payed.split("T")[0].split("-")[2]+"/"+tra.payed.split("T")[0].split("-")[1]+"/"+tra.payed.split("T")[0].split("-")[0] : 'Não Pago'}</span>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </div>


    </>
  );
}
