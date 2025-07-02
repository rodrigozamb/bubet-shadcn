"use client"

import AvatarIcon from "@/components/AvatarIcon";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()

  const params = useParams<{token: string}>()
  const { token } = params
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  const tok =  JSON.parse(window.atob(base64))
  if (!token){
    return 
  }
    return (
      <>
        
        <title>BUBet | Bem vindo</title>
        <meta name="welcome" content="Conta criada com sucesso"/>
        <div className="bg-cover h-screen w-screen py-15 bg-blue-900">
          
          <div>
            <div className="flex flex-col justify-center items-center">
              <span className="text-white font-extrabold text-4xl text-center mb-10">Bem vindo</span>
              <div className="flex flex-col justify-center text-center my-15">
                <AvatarIcon name={tok.name} src={tok.profile_url} size={200} key={tok.name}/>
                <span className="text-white font-medium text-2xl mt-5">{tok.name}</span>
              </div>
              <div className="text-white">
                <span> Sua conta está </span> 
                <strong>ATIVA</strong> 
                <span>, clique no botão abaixo para acessar a plataforma</span>
              </div>
              <Button 
                className="my-3 cursor-pointer bg-green-700 hover:bg-green-800"
                onClick={()=>{
                  router.push("/login")
                }}
              >
                Acessar Plataforma
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }