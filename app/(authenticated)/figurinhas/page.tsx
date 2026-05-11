"use client"

import { Header } from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Bounce, toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AxiosError } from "axios";


interface CardPackProps{
    id: string,
    available: boolean,
    name: string,
    description: string,
    image_url: string,
    album_id: string
}

interface UserCardPackProps{
    id: string,
    name: string,
    description: string,
    image_url: string,
    album_id: string,
    quantity: number,
    card_pack: {
      id: string,
      name: string,
      description: string,
      image_url: string,
      album_id: string
    }
}


export default function EventBookPage() {

  useContext(AuthContext)

  const [refresh, setRefresh] = useState(false)

  const [cardPacks, setCardPacks] = useState<CardPackProps[]>([])
  const [buyPackItem, setbuyPackItem] = useState<typeof cardPacks[number] | null>(null)
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)

  const [userCardPacks, setUserCardPacks] = useState<UserCardPackProps[]>([])
  const [userPackItem, setUserPackItem] = useState<typeof userCardPacks[number] | null>(null)
  const [isUserPackModalOpen, setIsUserPackModalOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {

    api.get("/cards/loja", {withCredentials: true})
        .then((res) => {
            setCardPacks(res.data)

            api.get("/cards/collection", {withCredentials: true})
            .then((res2) => {
                setUserCardPacks(res2.data.packs)
            })
        })
        .finally(() => { setIsLoading(false) })
  }, [refresh])

  if(isLoading ){
    return null
  }

  const tit = `Figurinhas`

  const handleOpenModal = (item: typeof cardPacks[number]) => {
    setbuyPackItem(item)
    setIsBuyModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsBuyModalOpen(false)
    setbuyPackItem(null)
  }


  const handleOpenUserPacksModal = (item: typeof userCardPacks[number]) => {
    setUserPackItem(item)
    setIsUserPackModalOpen(true)
  }

  const handleCloseUserPacksModal = () => {
    setIsUserPackModalOpen(false)
    setUserPackItem(null)
  }

  const handleBuyAlbumPacks = async() => {

    toast.info("Realizando compra...", {
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
    // Faça algo com o selectedIndex
    try{
      const newResult = await api.post(`/cards/${buyPackItem!.id}/buy`, { withCredentials: true })
      if(newResult.status != 201){
        console.log('Falha na compra do pacote') 
      }else{
        
        toast.success('Pacote comprado com sucesso!!', {
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
        setRefresh((refresh) => !refresh)


      }
      
    }catch(error:any){
      if (error instanceof AxiosError) {
        
        toast.error(error.response?.data?.message || 'Erro desconhecido', {
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
      } else
      if (error instanceof Error) {
        console.log(error)
        toast.error(error.message+' AIIN', {
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

      <title>{tit}</title>
      <meta name="event" content="Conheça o evento!"/>
      
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>  
        

        <div className="flex flex-col justify-center items-center align-middle mt-5">
            
          <Tabs defaultValue="store" className="  ">
          <TabsList className="grid w-full bg-blue-900 h-15 grid-cols-2">
            <TabsTrigger className="cursor-pointer h-13 font-bold text-xl" value="store" >Comprar Figurinhas</TabsTrigger>
            <TabsTrigger className="cursor-pointer h-13 font-bold text-xl" value="collection" >Minha Coleção</TabsTrigger>
          </TabsList>
          <TabsContent value="store">
            <Card>
              <CardHeader className="flex items-center justify-center cursor-default" >
                <CardTitle className=" text-2xl">Banca de Figurinhas</CardTitle>
                <CardDescription>Compre e colecione figurinhas para completar seus álbuns favoritos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
               
                <div className="w-full max-w-6xl px-4 py-10">
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {cardPacks.map((item) => (
                      <div key={item.id} className="hover:transform hover:scale-105 transition-transform">
                        <div
                          className="rounded-3xl overflow-hidden border p-3 flex items-center justify-center cursor-pointer"
                          onClick={() => handleOpenModal(item)}
                        >
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            width={180}
                            height={180}
                            className="object-contain"
                          />
                        </div>
                        <p className="text-center mt-2 font-medium">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Dialog
                  open={isBuyModalOpen}
                  onOpenChange={(open) => {
                    if (!open) {
                      handleCloseModal()
                    }
                  }}
                >
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>{buyPackItem?.name ?? "Detalhes do item"}</DialogTitle>
                      
                    </DialogHeader>

                    {buyPackItem && (
                      <div className="grid gap-4 md:grid-cols-[160px_1fr] items-center">
                        <div className="rounded-3xl overflow-hidden p-3">
                          <Image
                            src={buyPackItem.image_url}
                            alt={buyPackItem.name}
                            width={220}
                            height={220}
                            className="object-contain"
                          />
                        </div>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">Item selecionado</p>
                          <p className="text-base leading-6">{buyPackItem.description}</p>
                          <div className="flex justify-center mt-5">
                              <Button className="w-25 mr-4 bg-orange-600 cursor-pointer" onClick={handleBuyAlbumPacks}>Comprar</Button>
                              <Button disabled className="w-35 ml-4 bg-green-600 cursor-pointer" onClick={handleBuyAlbumPacks}>Comprar e Abrir</Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="secondary" className="w-full sm:w-auto mt-4">
                          Fechar
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>


              </CardContent>
              
            </Card>

          </TabsContent>
          <TabsContent value="collection">
            <Card>
              <CardHeader className="flex items-center justify-center" >
                <CardTitle className="text-2xl">Coleção</CardTitle>
                <CardDescription>Aqui estão todos os pacotes que você possui</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-5">
                
                
                <div className="w-full max-w-6xl px-4 py-10">
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {userCardPacks.map((item) => (
                      <div key={item.id} className="hover:transform hover:scale-105 transition-transform">
                        <div
                          className="rounded-3xl overflow-hidden border p-3 flex items-center justify-center cursor-pointer"
                          onClick={() => handleOpenUserPacksModal(item)}
                        >
                          <Image
                            src={item.card_pack.image_url}
                            alt={item.card_pack.name}
                            width={180}
                            height={180}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex justify-center items-center align-middle mt-2">
                          <p className="font-bold">{item.quantity}</p>
                          <p className="ml-0.5 mr-2">x</p>
                          <p className="text-center font-medium">{item.card_pack.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                  <Dialog
                    open={isUserPackModalOpen}
                    onOpenChange={(open) => {
                      if (!open) {
                        handleCloseUserPacksModal()
                      }
                    }}
                  >
                    <DialogContent className="flex flex-col justify-center align-middle items-center max-w-xl">
                      <DialogHeader>
                        <DialogTitle>{userPackItem?.card_pack.name ?? "Detalhes do item"}</DialogTitle>
                        
                      </DialogHeader>

                      {userPackItem && (
                        <div className="grid gap-4 md:grid-cols-[160px_1fr] items-center">
                          <div className="rounded-3xl overflow-hidden p-3">
                            <Image
                              src={userPackItem.card_pack.image_url}
                              alt={userPackItem.card_pack.name}
                              width={220}
                              height={220}
                              className="object-contain"
                            />
                          </div>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Item selecionado</p>
                            <p className="text-base leading-6">{userPackItem.card_pack.description}</p>
                            
                          </div>
                        </div>
                      )}

                      <DialogFooter className="flex justify-center align-middle items-center">
                        <DialogClose asChild>
                          <Button disabled className="w-25 mr-4 bg-orange-600 cursor-pointer" onClick={ () => router.push(`/figurinhas/${userPackItem!.card_pack.id}/abrir`) }>Abrir Pacote</Button>      
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>







            

        </div>
      </div>
    </>
  );
}
