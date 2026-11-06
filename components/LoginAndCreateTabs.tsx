"use client"

import { FormEvent, useContext, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
import { Bounce, toast } from "react-toastify"
import { api } from "@/services/api"
import { AxiosError } from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

const toastOptions = {
  position: "top-right" as const,
  autoClose: 5000,
  theme: "dark" as const,
  transition: Bounce,
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message
    return typeof message === "string" ? message : fallback
  }

  return error instanceof Error ? error.message : fallback
}

const MAX_AVATAR_SIZE = 5 * 1024 * 1024
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg"]

export function LoginAndCreateTabs() {
  const [activeTab, setActiveTab] = useState("entrar")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [recoverEmail, setRecoverEmail] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState<File | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isRecovering, setIsRecovering] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const { signIn } = useContext(AuthContext)

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSigningIn(true)

    try {
      toast.info("Entrando na sua conta...", toastOptions)
      await signIn({ email: loginEmail.trim(), password: loginPassword })
      setLoginEmail("")
      setLoginPassword("")
      toast.success("Login feito com sucesso.", toastOptions)
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível fazer login."), toastOptions)
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setAvatar(null)
      return
    }

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setAvatar(null)
      event.currentTarget.value = ""
      toast.error("Selecione uma imagem PNG ou JPG/JPEG.", toastOptions)
      return
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatar(null)
      event.currentTarget.value = ""
      toast.error("A imagem deve ter no máximo 5 MB.", toastOptions)
      return
    }

    setAvatar(file)
  }

  const handlePasswordRecover = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsRecovering(true)

    try {
      await api.post("/forget", { email: recoverEmail.trim() })
      toast.success(
        `Se houver uma conta associada a ${recoverEmail.trim()}, você receberá um email para redefinir a senha.`,
        toastOptions,
      )
      setRecoverEmail("")
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Não foi possível solicitar a redefinição de senha."),
        toastOptions,
      )
    } finally {
      setIsRecovering(false)
    }
  }

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()

    if (trimmedName.length < 2) {
      toast.error("Informe um nome com pelo menos 2 caracteres.", toastOptions)
      return
    }

    if (!avatar) {
      toast.error("Selecione uma imagem PNG ou JPG/JPEG para o perfil.", toastOptions)
      return
    }

    setIsCreating(true)
    const formData = new FormData()
    formData.append("username", trimmedName)
    formData.append("name", trimmedName)
    formData.append("email", signupEmail.trim())
    formData.append("password", signupPassword)
    formData.append("profile", avatar)

    try {
      await api.post("/users", formData)
      toast.success(
        "Conta criada com sucesso. Verifique seu email para ativá-la antes de entrar.",
        toastOptions,
      )
      setLoginEmail(signupEmail.trim())
      setName("")
      setSignupEmail("")
      setSignupPassword("")
      setAvatar(null)
      if (avatarInputRef.current) avatarInputRef.current.value = ""
      setActiveTab("entrar")
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Não foi possível criar a conta. Tente novamente."),
        toastOptions,
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center align-middle">
      <div className="my-4 text-center text-3xl font-extrabold text-white">
        Crie uma conta ou faça login
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[300px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger className="cursor-pointer" value="entrar">Entrar</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="create">Criar Conta</TabsTrigger>
        </TabsList>
        <TabsContent value="entrar">
          <Card>
            <form onSubmit={handleSignIn}>
              <CardHeader className="flex cursor-default items-center justify-center">
                <CardTitle className="mb-10 text-2xl">Acesse já!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label className="flex items-center justify-start" htmlFor="login-email">Email</Label>
                  <Input
                    type="email"
                    id="login-email"
                    name="email"
                    autoComplete="email"
                    value={loginEmail}
                    placeholder="repique@batefofo.com"
                    onChange={(event) => setLoginEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center justify-start" htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={loginPassword}
                    placeholder="********"
                    onChange={(event) => setLoginPassword(event.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <Button
                    type="submit"
                    disabled={isSigningIn}
                    className="mt-5 h-12 w-28 cursor-pointer rounded-lg bg-blue-800 font-bold text-white transition hover:bg-blue-700"
                  >
                    {isSigningIn ? "Entrando..." : "Entrar"}
                  </Button>

                  <div className="my-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button type="button" variant="ghost" className="p-2 text-sm font-bold">
                          Esqueci minha senha
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-center">Redefinir Senha</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handlePasswordRecover} className="space-y-4">
                          <Label htmlFor="recover-email">Insira aqui o email da sua conta:</Label>
                          <Input
                            type="email"
                            id="recover-email"
                            name="email"
                            autoComplete="email"
                            value={recoverEmail}
                            placeholder="repique@batefofo.com"
                            onChange={(event) => setRecoverEmail(event.target.value)}
                            required
                          />
                          <div className="flex justify-center">
                            <Button
                              type="submit"
                              disabled={isRecovering}
                              className="w-35 cursor-pointer bg-green-900 hover:bg-green-700"
                            >
                              {isRecovering ? "Enviando..." : "Redefinir Senha"}
                            </Button>
                          </div>
                        </form>
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
            <form onSubmit={handleCreate}>
              <CardHeader className="flex items-center justify-center">
                <CardTitle className="text-2xl">Crie uma conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="signup-name">Nome</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    type="text"
                    minLength={2}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    autoComplete="email"
                    value={signupEmail}
                    type="email"
                    onChange={(event) => setSignupEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={signupPassword}
                    onChange={(event) => setSignupPassword(event.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">A senha deve ter pelo menos 8 caracteres.</p>
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center justify-center" htmlFor="signup-avatar">Foto de Perfil</Label>
                  <Input
                    id="signup-avatar"
                    name="profile"
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    aria-describedby="signup-avatar-help"
                    ref={avatarInputRef}
                    onChange={handleFileChange}
                    required
                  />
                  <p id="signup-avatar-help" className="text-xs text-muted-foreground">
                    PNG ou JPG/JPEG, até 5 MB.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-center">
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="h-12 w-28 cursor-pointer rounded-lg bg-blue-800 px-6 py-2 font-bold text-white transition hover:bg-blue-700"
                >
                  {isCreating ? "Criando..." : "Criar Conta"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
