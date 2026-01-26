/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Save, Upload, X, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Separator } from './ui/separator';
import { useForm } from 'react-hook-form';
import { Bounce, toast } from 'react-toastify';
import { api } from '@/services/api';

const userSettingsSchema = z.object({
  name: z.string().min(2, {
    message: 'Nome deve ter pelo menos 2 caracteres.',
  }).optional().or(z.literal('')),
  email: z.string().email({
    message: 'Por favor, insira um endereço de email válido.',
  }).optional().or(z.literal('')),
  senha: z.string().min(8, {
    message: 'Senha deve ter pelo menos 8 caracteres.',
  }).optional().or(z.literal('')),
  favoriteCompetitorId: z.string().optional(),
}).refine(
  (data) => {
    const hasName = data.name && data.name.trim().length > 0;
    const hasEmail = data.email && data.email.trim().length > 0;
    const hasSenha = data.senha && data.senha.trim().length > 0;
    return hasName || hasEmail || hasSenha;
  },
  {
    message: 'Pelo menos um campo (Nome, Email ou Senha) deve ser preenchido.',
    path: ['name'],
  }
)

type UserSettingsFormValues = z.infer<typeof userSettingsSchema>

interface UserSettingsPageProps {
    competitors:{
        id: string
        name: string
        profile_url:string
    }[],
    favoriteCompetitor: string | null
}

export function UserSettingsConfigPage( { competitors, favoriteCompetitor }:UserSettingsPageProps ){
  const { user } = useContext(AuthContext)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(user?.profile_url || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [competitorFilter, setCompetitorFilter] = useState('')
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>( favoriteCompetitor || '')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedCompetitor(favoriteCompetitor || '')
  }, [favoriteCompetitor])
  
  useEffect(() => {
   
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCompetitors = useMemo(() => {
    return competitors.filter(competitor =>
      competitor.name.toLowerCase().includes(competitorFilter.toLowerCase())
    )
  }, [competitors, competitorFilter])

    const form = useForm<UserSettingsFormValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
        name: user?.name || '',
        email: user?.email || '',
        senha: '',
        favoriteCompetitorId: '',
    },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsImageLoading(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setImagePreview(result)
        setProfileImage(file)
        setIsImageLoading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview('')
    setProfileImage(null)
  }

  const onSubmit = async (values: UserSettingsFormValues) => {
    const hasChanges = 
      (values.name && values.name.trim().length > 0) ||
      (values.email && values.email.trim().length > 0) ||
      (values.senha && values.senha.trim().length > 0) ||
      profileImage
    
    if (!hasChanges) {
      console.warn('Nenhuma alteração foi feita')
      return
    }

    setIsSaving(true)
    const formData = new FormData()
    if(values.name){
      formData.append("name",values.name)
    }
    if(values.email){
      formData.append("email",values.email)
    }
    if(values.senha){
      formData.append("password",values.senha)
    }
    if(profileImage){
      formData.append("profile",profileImage!)
    }
    try {
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
      values.favoriteCompetitorId = selectedCompetitor
      console.log('Updating user settings:', values, profileImage)
      
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

      // Add your API call here
    } catch (error: any) {
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
    } finally {
      setIsSaving(false)
    }
  }
    
    return(

        <div className="flex items-center space-x-5" >

            <div className='flex flex-col items-center'>

                {/* Profile Picture Card */}
                <Card className='w-[400px]'>
                  <CardHeader className='pt-4'>
                    <CardTitle>Foto de Perfil</CardTitle>
                    <CardDescription>
                      Envie uma nova foto de perfil
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                      {/* Avatar Preview */}
                      <Avatar className="h-32 w-32 border-2 border-border">
                        <AvatarImage
                          src={imagePreview || user!.profile_url}
                          alt={user!.name}
                        />
                        <AvatarFallback className="text-lg">
                          {user!.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
        
                      {/* Upload Button */}
                      <div className="flex w-full gap-2">
                        <Label htmlFor="profile-image" className="flex-1">
                          <div className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
                            <Upload className="h-4 w-4" />
                            {isImageLoading ? 'Carregando...' : 'Selecione uma imagem'}
                          </div>
                        </Label>
                        <Input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          disabled={isImageLoading}
                        />
                        {imagePreview && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={clearImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG ou GIF (máx. 5MB)
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Separator className='my-4'/>

                {/* Bateria Favorita Card */}
                <Card className='w-[400px] h-[280px] flex items-center justify-center   '>
                  <CardHeader className='text-center'>
                    <CardTitle>Bateria Favorita</CardTitle>
                    <CardDescription>
                      Escolha sua bateria favorita
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                    {/* Selected Competitor Preview */}
                      {selectedCompetitor ? (
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3 w-[350px]">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={competitors.find(c => c.id === selectedCompetitor)?.profile_url}
                              alt={competitors.find(c => c.id === selectedCompetitor)?.name}
                            />
                            <AvatarFallback>
                              {competitors
                                .find(c => c.id === selectedCompetitor)?.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {competitors.find(c => c.id === selectedCompetitor)?.name}
                            </p>
                          </div>
                        </div>
                      ) :(
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src="https://bubet-bucket.s3.sa-east-1.amazonaws.com/logos/no-competitor"
                              alt="no-competitor"
                            />
                            <AvatarFallback>
                              {competitors
                                .find(c => c.id === selectedCompetitor)?.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Bateria não selecionada
                            </p>
                          </div>
                        </div>

                      )
                      
                      }

                      {/* Search Filter and Dropdown Combined */}
                      <div className="relative " ref={dropdownRef}>
                        <div className="relative ">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                          <Input
                            placeholder="Procure uma bateria..."
                            className="pl-10 pr-4"
                            value={competitorFilter}
                            onChange={(e) => {
                              setCompetitorFilter(e.target.value)
                              setIsOpen(true)
                            }}
                            onFocus={() => setIsOpen(true)}
                          />
                        </div>

                        {/* Dropdown List */}
                        {isOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                            {filteredCompetitors.length > 0 ? (
                              filteredCompetitors.map((competitor) => (
                                <button
                                  key={competitor.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCompetitor(competitor.id)
                                    setCompetitorFilter('')
                                    setIsOpen(false)
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 border-b border-border last:border-b-0"
                                >
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={competitor.profile_url} alt={competitor.name} />
                                    <AvatarFallback className="text-xs">
                                      {competitor.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{competitor.name}</span>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                                Nenhuma bateria encontrada.
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </CardContent>
                </Card>
            </div>
        
                {/* Account Information Card */}
                <Card className='h-[600px] justify-center'>
                    <CardHeader className='text-center'>
                    <CardTitle>Informações da Conta</CardTitle>
                    <CardDescription>
                        Atualize suas informações pessoais
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl>
                                <Input
                                    placeholder="Insira seu nome completo"
                                    {...field}
                                />
                                </FormControl>
                                <FormDescription>
                                Este é o seu nome de exibição público
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
        
                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Endereço de Email</FormLabel>
                                <FormControl>
                                <Input
                                    
                                    type="email"
                                    placeholder="Insira seu endereço de email"
                                    {...field}
                                />
                                </FormControl>
                                <FormDescription>
                                Seu endereço de email para recuperação de conta e notificações
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
        
                        <Separator />

                         <FormField
                            control={form.control}
                            name="senha"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Insira sua senha"
                                    {...field}
                                />
                                </FormControl>
                                <FormDescription>
                                Sua senha deve ter pelo menos 8 caracteres
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
        
                        <Separator />
        
                        {/* Submit Button */}
                        <div className="flex gap-2 justify-center">
                            <Button
                            type="submit"
                            disabled={isSaving}
                            className="gap-2 cursor-pointer"
                            >
                            <Save className="h-4 w-4" />
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                            <Button
                            type="button"
                            variant="outline"
                            className='cursor-pointer'
                            onClick={() => form.reset()}
                            >
                            Cancelar
                            </Button>
                        </div>
                        </form>
                    </Form>
                    </CardContent>
                </Card>
                
          
        </div>
    )
}