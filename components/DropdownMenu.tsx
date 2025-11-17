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
  
  const [name, setName] = useState<string|undefined>(undefined)
  const [password, setPassword] = useState<string|undefined>(undefined)
  const [email, setEmail] = useState<string|undefined>(undefined)
  const [avatar, setAvatarImage] = useState<File | undefined>(undefined);

  const handleFeedbackFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
  
      if (file) {
        setFeedbackImage(file);
      }
  };

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setAvatarImage(file);
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

  const handleUpdateUserData = async () => {
    
    if(name == undefined && password == undefined && email == undefined && avatar == undefined){
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
    if(name){
      formData.append("name",name)
    }
    if(email){
      formData.append("email",email)
    }
    if(password){
      formData.append("password",password)
    }
    if(avatar){
      formData.append("profile",avatar!)
    }

    setName(undefined)
    setEmail(undefined)
    setPassword(undefined)


    try{
      toast.info('Atualizando dados...', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      })
      await api.put(`/users/profile`, formData)
      toast.success('Suas informações foram atualizadas! Por favor relogue na plataforma.', {
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
        <div className="p-1  hover:bg-gray-100">
          <Dialog>
            <div>
              <DialogTrigger>
                <span className="cursor-pointer">Configurações</span>
              </DialogTrigger>
              <DialogContent className="w-250 h-140">
                  <DialogHeader>
                      <DialogTitle className="flex justify-center"> Configurações </DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col">
                    <div className="flex flex-col justify-center mb-6 text-sm">
                      <span className="text-center">Edite seus dados pessoais aqui.</span>
                      <span className="text-center font-medium">Não é necessário preencher todos os campos.</span>
                    </div>
                    <Label className="my-2 ml-3" htmlFor="name">Nome</Label>
                    <Input 
                      type="text" 
                      id="name" 
                      value={name? name: ""} 
                      placeholder="Seu novo nome"
                      className="mb-3"
                      onChange={(e)=>setName(e.target.value)}
                    />
                    <Label className="my-2 ml-3" htmlFor="name">Email</Label>
                    <Input 
                      type="email" 
                      id="email" 
                      value={email? email : ""} 
                      placeholder="Seu novo email"
                      className="mb-3"
                      onChange={(e)=>setEmail(e.target.value)}
                    />
                    <Label className="my-2 ml-3" htmlFor="name">Senha</Label>
                    <Input 
                      type="password" 
                      id="password" 
                      value={password? password : ""} 
                      placeholder="Sua nova senha"
                      className="mb-3"
                      onChange={(e)=>setPassword(e.target.value)}
                    />
                    <Label className="flex items-center justify-center my-5"  htmlFor="feedbackImage">Avatar</Label>
                    <Input
                      id="avatarImage" 
                      type="file"
                      className=""
                      onChange={handleAvatarFileChange}
                    />
                    <div className="flex justify-center">
                      <Button 
                          className=" bg-blue-800 my-5 font-bold h-15 w-50 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                          onClick={handleUpdateUserData}
                      >
                          Salvar
                      </Button>
                    </div>
                  </div>
              </DialogContent>
            </div>
          </Dialog>
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
