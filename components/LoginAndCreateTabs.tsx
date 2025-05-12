/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
 
// import { z } from "zod"
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"]

// // const formSchema = z.object({
// //   email: z.string().email(),
// //   password: z.string().min(5).max(25),
// //   avatar: z.any().refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
// //   "Only .jpg, .jpeg, .png formats are supported.")
// // })
import { useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { AuthContext } from "@/context/AuthContext"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast, Bounce } from 'react-toastify'

type FormInputs = {
  email: string
  password: string
}

export function LoginAndCreateTabs() {

    
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [avatar, setAvatar] = useState<File | null>(null);

    const{ register, handleSubmit } = useForm<FormInputs>()
    const { signIn } = useContext(AuthContext)
    
  // Function to handle form submission
  const handleSignIn = async () => {
    setEmail('')
    setPassword('')
    console.log("VAI FAZER LOGIN")
    console.log(email, password)
    try {
      await signIn({ email, password })
      toast.success('Login feito com successo', {
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
    
        if (file) {
          setAvatar(file);
        }
    };

    const handleLogin = async () => {
        console.log("Logging in with:", { email, password });
    }
    
    const handleCreate= async () => {
        console.log("Creating in with:", { email, password });
    }
    
  return (
    <>
      <div className="flex flex-col justify-center items-center align-middle">
        <div>
          <div className="my-4 text-white font-extrabold text-3xl text-center">
            Crie uma conta ou faça login
          </div>
        </div>
        <Tabs defaultValue="entrar" className="w-[300px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="cursor-pointer" value="entrar" onClick={(e)=>{ setEmail(""); setPassword("")}}>Entrar</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="create" onClick={(e)=>{ setEmail(""); setPassword("")}} >Criar Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="entrar">
            <Card>
              <CardHeader className="flex items-center justify-center cursor-default" >
                <CardTitle className="text-2xl">Entrar</CardTitle>
                <CardDescription className="flex text-black  my-1.5 text-center text-md">
                  Faça login na plataforma para apostar...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label  className="flex items-center justify-center" htmlFor="name">Email</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    value={email} 
                    placeholder="Ex: ritmista@bateria.com"
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center justify-center" htmlFor="password">Senha</Label>
                  <Input 
                    id="password"
                    type="password"
                    value={password}
                    placeholder="Ex: Bateria123"
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-center" >
                <Button 
                    className="bg-blue-800 font-bold h-12 w-28 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                    onClick={handleSignIn}
                >
                    Entrar
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="create">
            <Card>
              <CardHeader className="flex items-center justify-center" >
                <CardTitle className="text-2xl">Crie uma conta</CardTitle>
                <CardDescription className="flex text-black  my-1.5 text-center text-md" >
                  Crie uma conta em nossa plataforma e comece a apostar já!!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label className="flex items-center justify-center" htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    value={email}
                    type="text"
                    placeholder="Seu melhor email"
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center justify-center" htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Sua melhor senha"
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center justify-center" htmlFor="avatar">Foto de Perfil</Label>
                  <Input
                    id="avatar" 
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-center">
                <Button 
                    className="bg-blue-800 font-bold h-12 w-28 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                    onClick={handleCreate}
                >
                    Criar Conta
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
