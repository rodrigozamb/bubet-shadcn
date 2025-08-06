/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
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
import { toast, Bounce } from 'react-toastify'
import { api } from "@/services/api"
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"

interface LoginFormProps{
  email: string
  password: string
}

export function LoginAndCreateTabs() {

    
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const { signIn } = useContext(AuthContext)
  const router = useRouter()

  const { register, handleSubmit } = useForm<LoginFormProps>()
  const onSubmit: SubmitHandler<LoginFormProps> = (data) => console.log(data)
    
  // Function to handle form submission
  const handleSignIn = async () => {
    setEmail('')
    setPassword('')
    try {
      toast.info('Credenciais recebidas, aguarde um momento...', {
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
  
  const handleCreate = async () => {
    
    toast.info("Sua conta está sendo criada, aguarde um minuto...", {
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

    const formData = new FormData()
    formData.append("username",name)
    formData.append("name",name)
    formData.append("email",email)
    formData.append("password",password)
    formData.append("profile",avatar!)

    setName("")
    setPassword("")
    setEmail("")
    setAvatar(null)

    try{
      await api.post(`/users`,formData)
      toast.success('Conta criada com sucesso, verifique seu email para ativá-la!!', {
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


      router.push("/dashboard")
    }catch(error:any){
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
              <form onSubmit={handleSubmit(onSubmit)}>
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
              </form>
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
                  <Label className="flex items-center justify-center" htmlFor="email">Nome</Label>
                  <Input 
                    id="name"
                    value={name}
                    type="text"
                    placeholder="Seu nome"
                    onChange={(e)=>setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center justify-center" htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    value={email}
                    type="text"
                    placeholder="Seu melhor email"
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center justify-center" htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Sua melhor senha"
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center justify-center" htmlFor="avatar">Foto de Perfil</Label>
                  <Input
                    id="avatar" 
                    type="file"
                    onChange={handleFileChange}
                    required
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
