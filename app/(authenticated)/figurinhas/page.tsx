/* eslint-disable  @typescript-eslint/no-explicit-any */

"use client"

import { Header } from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useMemo, useState } from "react";
import { ArrowRightLeftIcon } from "lucide-react"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import AvatarIcon from "@/components/AvatarIcon";


interface CardPackProps{
    id: string,
    available: boolean,
    name: string,
    description: string,
    image_url: string,
    album_id: string
    created_at: string,
}

interface UserCardPackProps{
    id: string,
    name: string,
    description: string,
    image_url: string,
    album_id: string,
    quantity: number,
    last_obtained_at: string,
    card_pack: {
      id: string,
      name: string,
      description: string,
      image_url: string,
      album_id: string
    }
}


interface UserAlbumCardProps{
    id: string,
    obtained_at: string,
    quantity: number,
    naipe:string
    album_card: {
        id: string,
        imageUrl: string,
        naipe: string,
        name: string,
        team:string,
        type: string,
        album: {
            name: string
        }
    }
}

interface AllAlbumCardsProps{
  id: string,
  name: string,
  naipe: string,
  team: string,
  type: string,
  imageUrl?: string,
  album:{
    name: string
  }
}

const mapAllAlbumCardToUserAlbumCard = (card: AllAlbumCardsProps): UserAlbumCardProps => ({
  id: card.id,
  obtained_at: "",
  quantity: 5,
  naipe: card.naipe ?? "Desconhecido",
  album_card: {
    id: card.id,
    imageUrl: card.imageUrl ?? "",
    naipe: card.naipe ?? "Desconhecido",
    name: card.name,
    team: card.team,
    type: card.type,
    album: {
      name: card.album.name,
    },
  },
})

interface TradeProps{
  id: string,
  created_at:string,
  from_user:{
    name: string,
    id:string,
    profile_url: string
  },
  offered_card:{
    name: string,
    id:string,
    imageUrl: string
  },
  trade_card:{
    name: string,
    id:string,
    imageUrl: string
  },
  offered_quantity: string,
  trade_quantity: string
}

export default function EventBookPage() {

  const { user } = useContext(AuthContext)

  const [refresh, setRefresh] = useState(false)

  const [cardPacks, setCardPacks] = useState<CardPackProps[]>([])
  const [buyPackItem, setbuyPackItem] = useState<typeof cardPacks[number] | null>(null)
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)

  const [userCardPacks, setUserCardPacks] = useState<UserCardPackProps[]>([])
  const [userAlbumCards, setUserAlbumCards] = useState<UserAlbumCardProps[]>([])
  const [allAlbumsCards, setAllAlbumsCards] = useState<AllAlbumCardsProps[]>([])
  const [trades, setTrades] = useState<TradeProps[]>([])
  const [stickerFilter, setStickerFilter] = useState("")
  const [userPackItem, setUserPackItem] = useState<typeof userCardPacks[number] | null>(null)
  const [isUserPackModalOpen, setIsUserPackModalOpen] = useState(false)
  const [selectedSticker, setSelectedSticker] = useState<UserAlbumCardProps | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Trade-cards modal state
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)
  const [selectedOfferAlbum, setSelectedOfferAlbum] = useState<string | null>(null)
  const [selectedTradeAlbum, setSelectedTradeAlbum] = useState<string | null>(null)
  const [selectedOfferSticker, setSelectedOfferSticker] = useState<UserAlbumCardProps | null>(null)
  const [selectedTradeSticker, setSelectedTradeSticker] = useState<UserAlbumCardProps | null>(null)
  const [offerQuantity, setOfferQuantity] = useState(1)
  const [tradeQuantity, setTradeQuantity] = useState(1)
  const [isTradeLoading, setIsTradeLoading] = useState(false)

  useEffect(() => {
    if (selectedOfferSticker) {
      setOfferQuantity((current) =>
        Math.min(Math.max(current, 1), selectedOfferSticker.quantity)
      )
    } else {
      setOfferQuantity(1)
    }
  }, [selectedOfferSticker])

  const filteredUserAlbumCards = useMemo(
    () => userAlbumCards.filter((item) =>
      item.album_card.name.toLowerCase().includes(stickerFilter.toLowerCase())
    ),
    [userAlbumCards, stickerFilter]
  )

  const groupedUserAlbumCards = useMemo(() => {
    const groups = new Map<string, UserAlbumCardProps[]>()

    const sortedCards = filteredUserAlbumCards.slice().sort((a, b) => {
      const albumCompare = a.album_card.album.name.localeCompare(b.album_card.album.name)
      if (albumCompare !== 0) return albumCompare

      const teamCompare = a.album_card.team.localeCompare(b.album_card.team)
      if (teamCompare !== 0) return teamCompare

      const naipeCompare = a.album_card.naipe.localeCompare(b.album_card.naipe)
      if (naipeCompare !== 0) return naipeCompare

      return a.album_card.name.localeCompare(b.album_card.name)
    })

    sortedCards.forEach((item) => {
      const albumName = item.album_card.album.name || "Sem álbum"
      const currentGroup = groups.get(albumName)

      if (currentGroup) {
        currentGroup.push(item)
      } else {
        groups.set(albumName, [item])
      }
    })

    return Array.from(groups.entries())
  }, [filteredUserAlbumCards])

  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const openStickerModal = (sticker: UserAlbumCardProps) => {
    setSelectedSticker(sticker)
    setIsModalOpen(true)
  }

  const handleCopyAlbumSummary = async (albumName: string, cards: UserAlbumCardProps[]) => {
    const repeatedCards = cards.filter((item) => item.quantity > 1)
    const summaryLines = repeatedCards.map((item) => `*${item.quantity} x ${item.album_card.name} - ${item.album_card.naipe} - ${item.album_card.team}*`)
    const summaryText = `Álbum: ${albumName}\n${summaryLines.join("\n")}`

    try {
      await navigator.clipboard.writeText(summaryText)
      toast.success("Resumo copiado para a área de transferência!", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (error) {
      console.error("Erro ao copiar resumo:", error)
      toast.error("Não foi possível copiar o resumo. Tente novamente.")
    }
  }

  useEffect(()=>{
    api.get(`/cards/album`,{withCredentials: true})
      .then((res)=>{
        setAllAlbumsCards(res.data.cards)
      })
  },[])

  useEffect(() => {

    api.get("/cards/loja", {withCredentials: true})
        .then((res) => {
            setCardPacks(res.data)

            api.get("/cards/collection", {withCredentials: true})
            .then((res2) => {
                setUserCardPacks(res2.data.packs)
                setUserAlbumCards(res2.data.cards)
              api.get("/cards/trades", {withCredentials: true})
                .then((res3) => {
                    setTrades(res3.data)
                })  
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
      const newResult = await api.post(`/cards/${buyPackItem!.id}/buy`,{"quantity": 3}, { withCredentials: true })
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

  const handleBuyAlbumPackAndOpen = async() => {

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
      const newResult = await api.post(`/cards/${buyPackItem!.id}/buy`,{"quantity": 3}, { withCredentials: true })
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
        router.push(`/figurinhas/${buyPackItem!.id}/abrir`)


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


  const handleCreateCardTradeOffer = async() => {

    if(!selectedOfferSticker){
      toast.warn(`Você precisa escolher uma figurinha para oferecer nessa troca!`, {
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

    if(!selectedTradeSticker){
      toast.warn(`Você precisa escolher uma figurinha para trocar por ${offerQuantity}  "${selectedOfferSticker?.album_card.name}"`, {
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

    if(!selectedOfferSticker || !selectedOfferSticker?.quantity || selectedOfferSticker.quantity <= 1){
      toast.warn(`Você precisa ter mais de uma figurinha de "${selectedOfferSticker?.album_card.name}" para fazer a oferta de troca`, {
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
    
    if(selectedOfferSticker?.album_card.id === selectedTradeSticker?.id){
      toast.warn(`Você não pode oferecer uma figurinha em troca de si mesma`, {
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

    toast.info("Realizando oferta de troca...", {
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
    
    try{
      const data ={
        "offered_card_id":selectedOfferSticker.album_card.id,
        "offered_quantity":offerQuantity,
        "trade_card_id":selectedTradeSticker.album_card.id,
        "trade_quantity":tradeQuantity
      }
      const newResult = await api.post(`/cards/trades`,data, { withCredentials: true })
      if(newResult.status != 200){
        console.log('Falha na criação da oferta de troca') 
      }else{
        
        toast.success('Oferta de troca criada com sucesso!!', {
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
        setSelectedTradeSticker(null)
        setSelectedOfferSticker(null)
        setOfferQuantity(1)
        setTradeQuantity(1)
        setIsTradeModalOpen(false)

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

  const handleFazerTroca = async (tradeId: string) => {
    setIsTradeLoading(true)

    toast.info("Realizando Troca...", {
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
    try{
      const newResult = await api.post(`/cards/trades/${tradeId}/accept`, { withCredentials: true })
      if(newResult.status != 200){
        console.log('Falha na execução da troca') 
      }else{
        
        toast.success('Troca realizada com sucesso!!', {
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
      setIsTradeLoading(false)
    }
  }

  const handleDeleteTroca = async (tradeId: string) => {
    setIsTradeLoading(true)

    toast.info("Deletando Troca...", {
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
    try{
      const newResult = await api.delete(`/cards/trades/${tradeId}`, { withCredentials: true })
      if(newResult.status != 200){
        console.log('Falha na execução da troca') 
      }else{
        
        toast.success('Troca deletada com sucesso!!', {
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
      setIsTradeLoading(false)
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
          <TabsList className="grid w-full bg-blue-900 h-15 grid-cols-4">
            <TabsTrigger className="cursor-pointer h-13 font-bold text-xl" value="store" >Comprar Figurinhas</TabsTrigger>
            <TabsTrigger className="cursor-pointer h-13 font-bold text-xl" value="collection" >Minha Coleção</TabsTrigger>
            <TabsTrigger className="cursor-pointer h-13 font-bold text-xl" value="my-cards" >Minhas Figurinhas</TabsTrigger>
            <TabsTrigger className="cursor-pointer h-13 font-bold text-xl" value="trade-cards" >Troca de Figurinhas</TabsTrigger>
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
                    {cardPacks.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((item) => (
                      <div key={item.id} className="hover:transform hover:scale-105 transition-transform">
                        <div
                          className="rounded-3xl overflow-hidden border p-3 flex items-center justify-center cursor-pointer"
                          onClick={() => handleOpenModal(item)}
                        >
                          <Image
                            unoptimized
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
                            unoptimized
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
                              <Button className="w-35 ml-4 bg-green-600 cursor-pointer" onClick={handleBuyAlbumPackAndOpen}>Comprar e Abrir</Button>
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
                  {userCardPacks.length === 0 ? (
                    <div className="flex items-center w-218 h-50 justify-center">
                      <p className="font-extrabold text-xl">Você ainda não possui pacotinhos</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                      {userCardPacks.sort((a, b) => new Date(b.last_obtained_at).getTime() - new Date(a.last_obtained_at).getTime()).map((item) => (
                        <div key={item.id} className="hover:transform hover:scale-105 transition-transform">
                          <div
                            className="rounded-3xl overflow-hidden border p-3 flex items-center justify-center cursor-pointer"
                            onClick={() => handleOpenUserPacksModal(item)}
                          >
                            <Image
                              unoptimized
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
                  )}
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
                              unoptimized
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
                          <Button className="w-25 mr-4 bg-orange-600 cursor-pointer" onClick={ () => router.push(`/figurinhas/${userPackItem!.card_pack.id}/abrir`) }>Abrir Pacote</Button>      
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="my-cards">
            <Card>
              <CardHeader className="flex items-center justify-center" >
                <CardTitle className="text-2xl">Suas Figurinhas</CardTitle>
                <CardDescription>Aqui estão todos as figurinhas que você possui</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-5">
                <div className="flex justify-center align-middle items-center flex-col w-full px-4 ">
                  <div className=" mb-5 w-70">
                    <Input
                      placeholder="Filtrar figurinhas por nome..."
                      value={stickerFilter}
                      onChange={(event) => setStickerFilter(event.target.value)}
                    />
                  </div>

                  {userAlbumCards.length === 0 ? (
                    <div className="flex items-center w-218 h-50 justify-center">
                      <p className="font-extrabold text-xl">Você ainda não possui figurinhas</p>
                    </div>
                  ) : filteredUserAlbumCards.length === 0 ? (
                    <div className="flex items-center w-218 h-50 justify-center">
                      <p className="font-extrabold text-xl">Nenhuma figurinha corresponde ao filtro</p>
                    </div>
                  ) : (
                    <div className="space-y-4 w-218 ">
                      {groupedUserAlbumCards.map(([albumName, cards], index) => (
                        <details
                          key={albumName}
                          open={index === 0}
                          className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
                        >
                          <summary className="cursor-pointer flex items-center justify-between gap-4 px-5 py-4 text-lg font-semibold text-white bg-blue-900">
                            <span>{albumName}</span>
                            <span className="text-sm font-medium text-white">{cards.length} figurinhas</span>
                          </summary>
                          <div className="flex justify-center align-middle items-center mt-4">
                              <Button
                                className="bg-blue-900 hover:bg-blue-800 font-bold cursor-pointer"
                                onClick={() => handleCopyAlbumSummary(albumName, cards)}
                              >
                                Copiar Resumo
                              </Button>
                          </div>
                          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 p-4 w-full">
                            {cards.map((item) => (
                              <div key={item.id} className="hover:transform hover:scale-105 transition-transform">
                                <div
                                  className="h-[250px] w-[200px] rounded-md relative overflow-hidden border cursor-pointer"
                                  onClick={() => openStickerModal(item)}
                                >
                                  <Image
                                    src={item.album_card.imageUrl}
                                    alt={item.album_card.name}
                                    fill
                                    className=""
                                    unoptimized
                                  />  
                                </div>
                                <div className="flex flex-col justify-center items-center align-middle mt-2">
                                  <p>{item.album_card.album.name}</p>
                                  <div className="flex">
                                    <p className="font-bold mr-2 whitespace-nowrap">{item.quantity} x </p>
                                    <p className="text-center font-medium">{item.album_card.name} - {item.album_card.naipe}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  )}
                </div>

                  <Dialog
                    open={isModalOpen}
                    onOpenChange={(open) => {
                      if (!open) setSelectedSticker(null)
                      setIsModalOpen(open)
                    }}
                  >
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-center">Figurinha</DialogTitle>
                        <DialogDescription className="text-center">
                          {selectedSticker?.album_card.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative h-102 w-82 overflow-hidden rounded-xl border border-slate-200 bg-white">
                          {selectedSticker && (
                            <Image
                              unoptimized
                              src={selectedSticker.album_card.imageUrl}
                              alt={selectedSticker.album_card.name}
                              fill
                              className="object-contain"
                            />
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Data de obtenção</p>

                          {
                            selectedSticker?.obtained_at && selectedSticker.obtained_at !== "Desconhecido" ? 
                            (
                              <p className="text-lg font-semibold">
                                {selectedSticker?.obtained_at ? new Date(selectedSticker.obtained_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: '2-digit',
                                }) : 'Data desconhecida'}
                              </p>
                            )
                            :
                            (
                              <p className="text-lg font-semibold">Ainda não adquirida</p>
                            )
                          }

                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trade-cards">
            <Card>
                <CardHeader className="flex items-center justify-center" >
                <CardTitle className="text-2xl">Troca de Figurinhas</CardTitle>
                <CardDescription>Aqui você pode trocar suas figurinhas com outros usuários</CardDescription>
                <Button
                  disabled={userAlbumCards.length === 0 || isTradeLoading}
                  className="w-35 h-12 mt-5 bg-blue-800 hover:bg-blue-700 cursor-pointer font-extrabold"
                  onClick={() => {
                    setSelectedOfferAlbum(null)
                    setSelectedTradeAlbum(null)
                    setSelectedOfferSticker(null)
                    setSelectedTradeSticker(null)
                    setIsTradeModalOpen(true)
                  }}
                >
                  Criar troca
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-5">
                <div className="flex justify-center align-middle items-center flex-col w-full px-4 ">

                    {trades.length === 0 ? (
                      <div className="flex flex-col items-center w-218 h-50 justify-center">
                        <p className="font-extrabold text-xl">Nenhuma oferta de troca disponível</p>
                      </div>
                    ) : (
                      trades.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((trade) => (
                        <div key={trade.id} className="flex justify-between w-218 h-60 align-middle items-center border-2 border-gray-300 rounded-lg px-12 mb-3">
                          
                          <div className="flex flex-col justify-center align-middle items-center">
                            <p className="mb-2">{trade.from_user.name}</p>
                            <AvatarIcon name={trade.from_user.name} size={60} src={trade.from_user.profile_url}  className="mx-2 h-[60px] w-[60px] "  />
                          </div>
                          
                          <div className="flex flex-col justify-center align-middle items-center text-center">
                            <p className="font-bold mb-3" >Oferta de troca</p>
                            <div className="flex justify-center align-middle items-center text-center">
                              <div className="flex flex-col justify-center align-middle items-center">
                                <p className="font-extralight">Oferecendo:</p>
                                <div className="relative h-32 w-22 overflow-hidden rounded-xl ">
                                  <Image
                                    unoptimized
                                    src={trade.offered_card.imageUrl}
                                    alt={trade.offered_card.name}   
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <p className="font-bold text-xl">{trade.offered_quantity} x {trade.offered_card.name}</p>
                              </div>
                              <ArrowRightLeftIcon className="size-10 text-black mx-4 " />
                              <div className="flex flex-col justify-center align-middle items-center">
                                <p className="font-extralight">Pedindo:</p>
                                <div className="relative  h-32 w-22 overflow-hidden rounded-xl ">
                                  <Image
                                    unoptimized
                                    src={trade.trade_card.imageUrl}
                                    alt={trade.trade_card.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <p className="font-bold text-xl">{trade.trade_quantity} x {trade.trade_card.name}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            {
                              trade.from_user.id === user!.id ? (
                                <Button disabled={isTradeLoading} className="mt-4 bg-red-700 hover:bg-red-800 cursor-pointer" onClick={() => handleDeleteTroca(trade.id)}>Excluir troca</Button>
                              ):(
                                <Button disabled={trade.from_user.id === user!.id || isTradeLoading} className=" bg-green-600 hover:bg-green-700 cursor-pointer" onClick={() => handleFazerTroca(trade.id)}> Fazer Troca</Button>
                              )
                            }
                          </div>
                        </div>
                      ))
                    )}
                </div>

                  <Dialog
                    open={isTradeModalOpen}
                    onOpenChange={(open) => {
                      if (!open) {
                        setSelectedOfferAlbum(null)
                        setSelectedTradeAlbum(null)
                        setSelectedOfferSticker(null)
                        setSelectedTradeSticker(null)
                      }
                      setIsTradeModalOpen(open)
                    }}
                  >
                    <DialogContent className="w-220 flex flex-col justify-center align-middle items-center">
                      <DialogHeader>
                        <DialogTitle className="text-center">Qual a sua troca?</DialogTitle>
                        <DialogDescription className="text-center">
                          Ofereça uma figurinha que você tem
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-between gap-10 justify-center items-center align-middle ">
                        
                        <div>
                          <div className="flex flex-col text-center justify-center">
                            <p className="font-bold mb-3" >Sua figurinha:</p>
                            <p className="text-sm font-medium mb-2">Álbum:</p>
                            <Select
                              value={selectedOfferAlbum ?? ""}
                              onValueChange={(value) => {
                                setSelectedOfferAlbum(value)
                                setSelectedOfferSticker(null)
                              }}
                            >
                              <SelectTrigger className="w-52">
                                <SelectValue placeholder="Selecione um álbum" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  new Set(userAlbumCards.map((item) => item.album_card.album.name))
                                )
                                  .sort()
                                  .map((albumName) => (
                                    <SelectItem key={albumName} value={albumName}>
                                      {albumName}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <p className="text-sm font-medium mb-2 mt-3">Figurinha:</p>
                            <Select
                              value={selectedOfferSticker?.id ?? ""}
                              onValueChange={(value) => {
                                const card = userAlbumCards.find((item) => item.id === value)
                                if (card) setSelectedOfferSticker(card)
                              }}
                              disabled={!selectedOfferAlbum}
                            >
                              <SelectTrigger className="w-52">
                                <SelectValue placeholder="Selecione uma figurinha" />
                              </SelectTrigger>
                              <SelectContent>
                                {userAlbumCards
                                  .filter((item) => !selectedOfferAlbum || item.album_card.album.name === selectedOfferAlbum)
                                  .sort((a, b) => {
                                    const teamCompare = a.album_card.team.localeCompare(b.album_card.team)
                                    if (teamCompare !== 0) return teamCompare

                                    const naipeCompare = a.album_card.naipe.localeCompare(b.album_card.naipe)
                                    if (naipeCompare !== 0) return naipeCompare

                                    return a.album_card.name.localeCompare(b.album_card.name)
                                  })
                                  .map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                      {item.album_card.name} - {item.album_card.naipe} - {item.album_card.team}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <div className="relative h-72 w-52 overflow-hidden rounded-xl ">
                              <Image
                                unoptimized
                                src={selectedOfferSticker?.album_card.imageUrl ?? "https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/24171c2e-0744-4582-8da1-f7d1bb48f114/cards/bg-card-empty.png"}
                                alt={selectedOfferSticker?.album_card.name ?? "card-empty"}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div className="flex flex-col items-center gap-2 mt-2">
                              <p className="font-semibold" >Quantidade:</p>
                              <Select
                                value={String(offerQuantity)}
                                onValueChange={(value) => setOfferQuantity(Number(value))}
                                disabled={!selectedOfferSticker}
                              >
                                <SelectTrigger className="w-52">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedOfferSticker &&
                                    Array.from(
                                      { length: selectedOfferSticker.quantity - 1 },
                                      (_, i) => i + 1
                                    ).map((quantity) => (
                                      <SelectItem key={quantity} value={String(quantity)}>
                                        {quantity}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        
                        <ArrowRightLeftIcon className="size-10 text-muted-foreground" />
                        
                        <div>
                          <div className="flex flex-col text-center justify-center">
                            <p className="font-bold mb-3" >Troco por:</p>
                            <p className="text-sm font-medium mb-2">Álbum:</p>
                            <Select
                              value={selectedTradeAlbum ?? ""}
                              onValueChange={(value) => {
                                setSelectedTradeAlbum(value)
                                setSelectedTradeSticker(null)
                              }}
                            >
                              <SelectTrigger className="w-52">
                                <SelectValue placeholder="Selecione um álbum" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  new Set(allAlbumsCards.map((item) => item.album.name))
                                )
                                  .sort()
                                  .map((albumName) => (
                                    <SelectItem key={albumName} value={albumName}>
                                      {albumName}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <p className="text-sm font-medium mb-2 mt-3">Figurinha:</p>
                            <Select
                              value={selectedTradeSticker?.id ?? ""}
                              onValueChange={(value) => {
                                const card = allAlbumsCards.find((item) => item.id === value)
                                if (card) setSelectedTradeSticker(mapAllAlbumCardToUserAlbumCard(card))
                              }}
                              disabled={!selectedTradeAlbum}
                            >
                              <SelectTrigger className="w-52">
                                <SelectValue placeholder="Selecione uma figurinha" />
                              </SelectTrigger>
                              <SelectContent>
                                {allAlbumsCards
                                  .filter((item) => item.id !== selectedOfferSticker?.id && (!selectedTradeAlbum || item.album.name === selectedTradeAlbum))
                                  .sort((a, b) => {
                                    const teamCompare = a.team.localeCompare(b.team)
                                    if (teamCompare !== 0) return teamCompare

                                    const naipeCompare = a.naipe.localeCompare(b.naipe)
                                    if (naipeCompare !== 0) return naipeCompare

                                    return a.name.localeCompare(b.name)
                                  })
                                  .map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                      {item.name} - {item.naipe} - {item.team}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <div className="relative h-72 w-52 overflow-hidden rounded-xl ">
                              <Image
                                unoptimized
                                src={selectedTradeSticker?.album_card.imageUrl ?? "https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/24171c2e-0744-4582-8da1-f7d1bb48f114/cards/bg-card-empty.png"}
                                alt={selectedTradeSticker?.album_card.name ?? "card-empty"}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div className="flex flex-col items-center gap-2 mt-2">
                              <p className="font-semibold" >Quantidade:</p>
                              <Select
                                value={String(tradeQuantity)}
                                onValueChange={(value) => setTradeQuantity(Number(value))}
                                disabled={!selectedTradeSticker}
                              >
                                <SelectTrigger className="w-52">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedTradeSticker &&
                                    Array.from(
                                      { length: 5 },
                                      (_, i) => i + 1
                                    ).map((quantity) => (
                                      <SelectItem key={quantity} value={String(quantity)}>
                                        {quantity}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        
                        
                        
                      </div>

                      <Button className="w-80 my-8 cursor-pointer bg-blue-950 hover:bg-blue-900 font-bold" onClick={handleCreateCardTradeOffer} >Fazer Oferta de Troca</Button>
                      
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
