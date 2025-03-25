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
import { useState } from "react"
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

export function LoginAndCreateTabs() {

    
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [avatar, setAvatar] = useState<File | null>(null);
    
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
    <Tabs defaultValue="entrar" className="w-[300px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger className="cursor-pointer" value="entrar" onClick={(e)=>{ setEmail(""); setPassword("")}}>Entrar</TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="create" onClick={(e)=>{ setEmail(""); setPassword("")}} >Criar Conta</TabsTrigger>
      </TabsList>
      <TabsContent value="entrar">
        <Card>
          <CardHeader className="flex items-center justify-center cursor-default" >
            <CardTitle>Entrar</CardTitle>
            <CardDescription className="text-black">
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
                placeholder="Ex: Bateria123"
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end" >
            <Button 
                className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={handleLogin}
            >
                Entrar
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="create">
        <Card>
          <CardHeader className="flex items-center justify-center" >
            <CardTitle>Crie uma conta</CardTitle>
            <CardDescription className="text-black" >
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
          <CardFooter className="flex items-center justify-start">
            <Button 
                className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={handleCreate}
            >
                Criar Conta
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
