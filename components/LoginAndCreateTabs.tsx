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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

interface LoginFormProps{
  email: string
  password: string
}

export function LoginAndCreateTabs() {

    
  const [email, setEmail] = useState<string>("");
  const [recoverEmail, setRecoverEmail] = useState<string>("");
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
  
  // Function to handle form submission
  const handlePasswordRecover = async () => {
    
    try {
      
      const res = await api.post(`/forget`,{email:recoverEmail})
      if(res.status == 400){
        toast.warn('Este email não existe em nossa plataforma. Tente novamente.', {
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
      }else{
        toast.success('Um email de redefinição de senha foi enviado para: '+recoverEmail, {
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
      setRecoverEmail('')
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
                <CardTitle className="mb-10 text-2xl">Acesse já!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label  className="flex items-center justify-start" htmlFor="name">Email</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    value={email} 
                    placeholder="repique@batefofo.com"
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center justify-start" htmlFor="password">Senha</Label>
                  <Input 
                    id="password"
                    type="password"
                    value={password}
                    placeholder="********"
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-center" >
                <div className="flex flex-col justify-center items-center">

                  <Button 
                      className="bg-blue-800 font-bold h-12 w-28 text-white mt-5 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                      onClick={handleSignIn}
                  >
                      Entrar
                  </Button>

                  <div className="my-2">
                    <Dialog>
                      <DialogTrigger>
                        <div className="p-2 hover:bg-gray-200 hover:rounded-md">
                          <p className="cursor-pointer text-sm font-bold" >Esqueci minha senha</p>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="h-60 w-150">
                        <DialogHeader>
                          <DialogTitle className="text-center"> Redefinir Senha </DialogTitle>
                        </DialogHeader>

                        <Label  className="flex items-center justify-start" htmlFor="name">Insira aqui o email da sua conta:</Label>
                        <Input 
                          type="text" 
                          id="name" 
                          value={recoverEmail} 
                          placeholder="repique@batefofo.com"
                          onChange={(e)=>setRecoverEmail(e.target.value)}
                        />

                        <div className="flex justify-center">
                          <Button className="w-35 cursor-pointer bg-green-900 hover:bg-green-700" onClick={handlePasswordRecover}>Redefinir Senha</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardFooter>
              </form>
            </Card>

          </TabsContent>
          <TabsContent value="create">
            <Card>
              <CardHeader className="flex items-center justify-center" >
                <CardTitle className="text-2xl">Crie uma conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label className="flex items-center justify-" htmlFor="email">Nome</Label>
                  <Input 
                    id="name"
                    value={name}
                    type="text"
                    onChange={(e)=>setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center justify-" htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    value={email}
                    type="text"
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center justify-" htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
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
