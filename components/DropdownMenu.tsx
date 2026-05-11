/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { useState } from "react"
import { Button } from "./ui/button"
import { AuthContext } from "@/context/AuthContext"
import { api } from "@/services/api"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"
import { Bounce, toast } from "react-toastify"

export function DropdownConfig() {

  const router = useRouter()
  const { user } = React.useContext(AuthContext)

  const [feedbackText, setFeedBackText] = useState<string>("")
  const [feedbackImage, setFeedbackImage] = useState<File | null>(null);

  const handleFeedbackFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
  
      if (file) {
        setFeedbackImage(file);
      }
  };



  const handleLogout = () =>{
    Cookies.remove('bubet.token',{ path: '/', domain: 'bu-bet.com' })
    router.push('/login')
  }

  const handleSendFeedback = async () => {
    
    if(feedbackText == "" && !feedbackImage ){
      toast.info('Preencha pelo menos um campo.', {
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
      return
    }

    const formData = new FormData()
    formData.append("content",feedbackText)
    formData.append("userId",user!.id)
    if(feedbackImage && feedbackImage){
      formData.append("image",feedbackImage)
    }

    setFeedBackText('')
    setFeedbackImage(null)

    try{
      await api.post(`/feedbacks`, formData)
      toast.success('Seu feedback foi enviado. Obrigado ajudar a melhorar a BUBet! 💙💙💙', {
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
    }
}

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer text-gray-300" >abrir menu</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel className="flex justify-center">Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-1 cursor-pointer hover:bg-gray-100" onClick={()=>{router.push(`/profile/${user!.id}`)}}>
          Ver perfil
        </div>
        <div className="p-1 cursor-pointer hover:bg-gray-100" onClick={()=>{router.push(`/ranking`)}}>
          Ranking Geral
        </div>
        <div className="p-1 cursor-pointer hover:bg-gray-100" onClick={()=>{router.push(`/temporadas`)}}>
          Temporadas
        </div>
        <div className="p-1 cursor-pointer hover:bg-gray-100" onClick={()=>{router.push(`/wheel`)}}>
          Roleta da Sorte
        </div>
        <div className="p-1 cursor-pointer hover:bg-gray-100" onClick={()=>{router.push(`/figurinhas`)}}>
          Banca de Figurinhas
        </div>
        <div className="p-1 cursor-pointer hover:bg-gray-100" onClick={()=>{router.push(`/settings`)}}>
          Configurações
        </div>
        <div className="p-1 hover:bg-gray-100">
          <Dialog>
            <div>
              <DialogTrigger>
                <span className="cursor-pointer">Enviar feedback</span>
              </DialogTrigger>
              <DialogContent className="w-250 h-120">
                  <DialogHeader>
                      <DialogTitle className="flex justify-center"> Dê seu feedback </DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col justify-center items-center">
                    <Label className="flex items-center justify-center my-5" htmlFor="name">Feedback</Label>
                    <Input 
                      type="text" 
                      id="feedback" 
                      value={feedbackText} 
                      placeholder="Deixe aqui o seu feedback"
                      onChange={(e)=>setFeedBackText(e.target.value)}
                      className="h-30"
                      required
                    />
                    <Label className="flex items-center justify-center my-5"  htmlFor="feedbackImage">Imagem*</Label>
                    <Input
                      id="feedbackImage" 
                      type="file"
                      onChange={handleFeedbackFileChange}
                    />
                    <Button 
                        className="bg-blue-800 my-10 font-bold h-15 w-50 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                        onClick={handleSendFeedback}
                    >
                        Enviar
                    </Button>
                  </div>
              </DialogContent>
            </div>
          </Dialog>
        </div>
        <DropdownMenuSeparator />
        <div 
          className="text-center p-1 cursor-pointer hover:bg-red-100"
          onClick={handleLogout}
        >
          Sair
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
