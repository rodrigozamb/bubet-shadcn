"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";

export default function Home() {

  const router = useRouter()

  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");

  const params = useParams<{token: string}>()
  const { token } = params


  const handlePasswordRecover = async () => {
    
    try {
      
      if(password == confirmedPassword){
        await api.post(`/redefine`,{password:password, token: token})

        toast.success('Sua senha foi redefinida com sucesso!', {
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
        router.push("/login")
      }else{
        toast.warning('As senhas não coincidem! Tente novamente...', {
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
      
    } catch (error) {
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


  if (!token){
    return 
  }
    return (
      <>
        
        <title>BUBet | Redefinir Senha</title>
        <meta name="redefinir" content="Redefinir senha"/>
        <div className="bg-cover h-screen w-screen py-15 bg-blue-900">
          
          <div>
            <div className="flex flex-col justify-center items-center">
              <span className="text-white font-extrabold text-4xl text-center mb-10">Redefinir Senha</span>
              
              
                <div className="flex flex-col justify-center bg-gray-300  h-100 rounded-2xl">

                    <div className="px-5">
                        <Label  className="flex items-center justify-start my-3" htmlFor="password">Nova senha:</Label>
                        <Input 
                        className="bg-white w-80"
                        type="text" 
                        id="password" 
                        value={password} 
                        placeholder="Nova senha"
                        onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>

                    <div className="px-5 mt-5">
                        <Label  className="flex items-center justify-start my-3" htmlFor="new_password">Confirme sua nova senha:</Label>
                        <Input 
                        className="bg-white w-80"
                        type="text" 
                        id="new_password" 
                        value={confirmedPassword} 
                        placeholder="Nova senha"
                        onChange={(e)=>setConfirmedPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-center pt-8">
                        <Button 
                            className="my-3 cursor-pointer bg-green-700 hover:bg-green-800 w-40 font-semibold"
                            onClick={handlePasswordRecover}
                        >
                            Redefinir Senha
                        </Button>
                    </div>

                </div>

              
              
            </div>
          </div>
        </div>
      </>
    );
  }