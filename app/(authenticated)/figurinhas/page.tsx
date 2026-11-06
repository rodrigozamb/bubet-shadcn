/* eslint-disable  @typescript-eslint/no-explicit-any */

"use client"

import { Header } from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useMemo, useState } from "react";
import { ArrowRightLeftIcon, BookOpen, ImageIcon, Package, Search } from "lucide-react"
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
    price: number
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
            name: string,
            event_id?: string
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
    name: string,
    event_id?: string
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
      event_id: card.album.event_id,
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
  const [isBuyConfirmationOpen, setIsBuyConfirmationOpen] = useState(false)

  const [userCardPacks, setUserCardPacks] = useState<UserCardPackProps[]>([])
  const [userAlbumCards, setUserAlbumCards] = useState<UserAlbumCardProps[]>([])
  const [allAlbumsCards, setAllAlbumsCards] = useState<AllAlbumCardsProps[]>([])
  const [albumEventIds, setAlbumEventIds] = useState<Record<string, string>>({})
  const [trades, setTrades] = useState<TradeProps[]>([])
  const [stickerFilter, setStickerFilter] = useState("")
  const [stickerAlbumFilter, setStickerAlbumFilter] = useState("all")
  const [userPackItem, setUserPackItem] = useState<typeof userCardPacks[number] | null>(null)
  const [isUserPackModalOpen, setIsUserPackModalOpen] = useState(false)
  const [selectedSticker, setSelectedSticker] = useState<UserAlbumCardProps | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [buyQuantity, setBuyQuantity] = useState<string>("1");

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
    () => userAlbumCards.filter((item) => {
      const query = stickerFilter.toLowerCase()
      return (
        (item.album_card.name.toLowerCase().includes(query) ||
          item.album_card.team.toLowerCase().includes(query) ||
          item.album_card.naipe.toLowerCase().includes(query)) &&
        (stickerAlbumFilter === "all" ||
          item.album_card.album.name === stickerAlbumFilter)
      )
    }),
    [userAlbumCards, stickerFilter, stickerAlbumFilter]
  )

  const albumOptions = useMemo(
    () => Array.from(new Set(userAlbumCards.map((item) => item.album_card.album.name))).sort(),
    [userAlbumCards]
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
                const packIds = Array.from(new Set([
                  ...res.data.map((pack: CardPackProps) => pack.id),
                  ...res2.data.packs.map((pack: UserCardPackProps) => pack.card_pack.id),
                ]))
                void Promise.allSettled(
                  packIds.map((packId) => api.get(`/packs/album/${packId}`, { withCredentials: true }))
                ).then((albumResults) => {
                  const eventIds: Record<string, string> = {}
                  albumResults.forEach((result, index) => {
                    if (result.status === "fulfilled") {
                      const album = result.value.data
                      if (album?.name && album?.event_id) {
                        eventIds[album.name] = album.event_id
                      }
                    } else {
                      console.error(`Erro ao buscar o álbum do pacote ${packIds[index]}:`, result.reason)
                    }
                  })
                  setAlbumEventIds(eventIds)
                })
              api.get("/cards/trades", {withCredentials: true})
                .then((res3) => {
                    setTrades(res3.data)
                })  
            })
        })
        .finally(() => { setIsLoading(false) })
  }, [refresh])

  if(isLoading ){
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600" role="status">
            <span className="size-5 animate-spin rounded-full border-2 border-blue-900 border-t-transparent" />
            Carregando suas figurinhas...
          </div>
        </main>
      </div>
    )
  }

  const tit = `Figurinhas`

  const handleOpenModal = (item: typeof cardPacks[number]) => {
    setbuyPackItem(item)
    setIsBuyConfirmationOpen(false)
    setIsBuyModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsBuyModalOpen(false)
    setIsBuyConfirmationOpen(false)
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
      const newResult = await api.post(`/cards/${buyPackItem!.id}/buy`,{"quantity": Number(buyQuantity)}, { withCredentials: true })
      if(newResult.status != 201){
        console.log('Falha na compra do pacote') 
      }else{
        
        toast.success('Pedido de compra feito com sucesso!!', {
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
        setBuyQuantity("1")
        window.open(newResult.data.ticketUrl, "_blank", "noopener,noreferrer");


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

  const handleReedeemAlbumPacks = async() => {

    toast.info("Realizando resgate...", {
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
      const newResult = await api.post(`/cards/${buyPackItem!.id}/reedeem`,{"quantity": 3}, { withCredentials: true })
      if(newResult.status != 201){
        console.log('Falha no resgate do pacote') 
      }else{
        
        toast.success('Pacote(s) resgatado com sucesso!!', {
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
      
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-3 pb-12 pt-6 sm:px-6 lg:pt-10">
          <section className="mb-7 space-y-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-800">Sua coleção, do seu jeito</p>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Banca de figurinhas</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Compre pacotinhos, acompanhe sua coleção e encontre figurinhas para trocar.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900"><Package className="size-5" /></span>
                <div><p className="text-xl font-bold text-slate-900">{cardPacks.length}</p><p className="text-xs text-slate-500 sm:text-sm">Pacotinhos disponíveis</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><ImageIcon className="size-5" /></span>
                <div><p className="text-xl font-bold text-slate-900">{userAlbumCards.reduce((total, item) => total + item.quantity, 0)}</p><p className="text-xs text-slate-500 sm:text-sm">Figurinhas na coleção</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ArrowRightLeftIcon className="size-5" /></span>
                <div><p className="text-xl font-bold text-slate-900">{trades.length}</p><p className="text-xs text-slate-500 sm:text-sm">Ofertas de troca</p></div>
              </div>
            </div>
          </section>

          <Tabs defaultValue="store" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm md:grid-cols-4">
            <TabsTrigger className="min-h-12 cursor-pointer whitespace-normal rounded-xl px-2 py-2 text-xs font-bold leading-tight text-slate-600 data-[state=active]:bg-blue-950 data-[state=active]:text-white data-[state=active]:shadow-sm sm:text-sm" value="store">Comprar Figurinhas</TabsTrigger>
            <TabsTrigger className="min-h-12 cursor-pointer whitespace-normal rounded-xl px-2 py-2 text-xs font-bold leading-tight text-slate-600 data-[state=active]:bg-blue-950 data-[state=active]:text-white data-[state=active]:shadow-sm sm:text-sm" value="collection">Minha Coleção</TabsTrigger>
            <TabsTrigger className="min-h-12 cursor-pointer whitespace-normal rounded-xl px-2 py-2 text-xs font-bold leading-tight text-slate-600 data-[state=active]:bg-blue-950 data-[state=active]:text-white data-[state=active]:shadow-sm sm:text-sm" value="my-cards">Minhas Figurinhas</TabsTrigger>
            <TabsTrigger className="min-h-12 cursor-pointer whitespace-normal rounded-xl px-2 py-2 text-xs font-bold leading-tight text-slate-600 data-[state=active]:bg-blue-950 data-[state=active]:text-white data-[state=active]:shadow-sm sm:text-sm" value="trade-cards">Troca de Figurinhas</TabsTrigger>
          </TabsList>
          <TabsContent value="store" className="mt-4">
            <Card className="gap-0 overflow-hidden rounded-2xl border-slate-200 py-0 shadow-sm">
              <CardHeader className="border-b border-slate-100 px-4 py-5 sm:px-6">
                <CardTitle className="text-xl font-bold text-slate-900 sm:text-2xl">Comprar pacotinhos</CardTitle>
                <CardDescription>Escolha um pacotinho para ver detalhes, resgatar ou comprar.</CardDescription>
              </CardHeader>
              <CardContent className="px-4 py-5 sm:px-6 sm:py-7">
               
                <div className="w-full">
                  {cardPacks.length === 0 ? (
                    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
                      <Package className="mb-3 size-8 text-slate-400" />
                      <p className="font-semibold text-slate-800">Nenhum pacotinho disponível no momento</p>
                      <p className="mt-1 text-sm text-slate-500">Volte mais tarde para conferir as novidades.</p>
                    </div>
                  ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                    {cardPacks.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 sm:p-3"
                        onClick={() => handleOpenModal(item)}
                        aria-label={`Ver detalhes de ${item.name}`}
                      >
                        <span className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2">
                          <Image
                            unoptimized
                            src={item.image_url}
                            alt={item.name}
                            width={220}
                            height={220}
                            className="h-full w-full object-contain transition-transform group-hover:scale-105"
                          />
                        </span>
                        <span className="mt-3 block truncate text-center text-sm font-semibold text-slate-800 sm:text-base">{item.name}</span>
                        <span className="mt-1 block text-center text-xs text-slate-500">R$ {item.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                  )}
                </div>

                <Dialog
                  open={isBuyModalOpen}
                  onOpenChange={(open) => {
                    if (!open) {
                      handleCloseModal()
                    }
                  }}
                >
                  <DialogContent className="max-h-[90vh] max-w-[calc(100vw-1.5rem)] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>
                        {isBuyConfirmationOpen ? "Confirmar compra" : buyPackItem?.name ?? "Detalhes do item"}
                      </DialogTitle>
                    </DialogHeader>

                    {buyPackItem && isBuyConfirmationOpen ? (
                      <div className="space-y-4">
                        <DialogDescription>
                          Você está prestes a comprar:
                        </DialogDescription>
                        <div className="rounded-md border p-4 space-y-2">
                          <p className="font-medium">{buyPackItem.name}</p>
                          <p>Quantidade: {buyQuantity} {Number(buyQuantity) === 1 ? "pacote" : "pacotes"}</p>
                          <p>Total: R$ {(Number(buyQuantity) * buyPackItem.price).toFixed(2)}</p>
                        </div>
                        <p>Tem certeza que deseja fazer essa compra?</p>
                        <DialogFooter>
                          <Button
                            variant="secondary"
                            onClick={() => setIsBuyConfirmationOpen(false)}
                          >
                            Não
                          </Button>
                          <Button
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => {
                              setIsBuyConfirmationOpen(false)
                              void handleBuyAlbumPacks()
                            }}
                          >
                            Sim
                          </Button>
                        </DialogFooter>
                      </div>
                    ) : buyPackItem && (
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
                          <p className="text-base leading-6 text-gray-600">Valor: R$ {buyPackItem.price.toFixed(2)}</p>
                          <p className="text-base leading-6">{buyPackItem.description}</p>
                          <div className="flex flex-col justify-center mt-5">
                              <Button className="w-50  bg-green-600 cursor-pointer hover:bg-green-700" onClick={handleReedeemAlbumPacks}>Resgatar 3 pacotes Gratuitos</Button>

                              
                              <div className="mt-5">
                                <div>
                                  Compre pacotinhos:
                                </div>
                                <Select value={buyQuantity} onValueChange={setBuyQuantity}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>

                                <SelectContent>
                                  {Array.from({ length: 30 }, (_, index) => (
                                    <SelectItem
                                      key={index + 1}
                                      value={String(index + 1)}
                                    >
                                      {index + 1}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                                <p className="text-gray-700 mt-2">Total : R${(Number(buyQuantity) * buyPackItem.price).toFixed(2)} reais</p>
                                <Button
                                  className="w-25 bg-orange-600 hover:bg-orange-700 cursor-pointer mt-3"
                                  onClick={() => setIsBuyConfirmationOpen(true)}
                                >
                                  Comprar
                                </Button>
                              </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isBuyConfirmationOpen && (
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="secondary" className="w-full sm:w-auto mt-4">
                            Fechar
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    )}
                  </DialogContent>
                </Dialog>


              </CardContent>
              
            </Card>

          </TabsContent>
          <TabsContent value="collection" className="mt-4">
            <Card className="gap-0 overflow-hidden rounded-2xl border-slate-200 py-0 shadow-sm">
              <CardHeader className="border-b border-slate-100 px-4 py-5 sm:px-6">
                <CardTitle className="text-xl font-bold text-slate-900 sm:text-2xl">Minha coleção</CardTitle>
                <CardDescription>Seus pacotinhos disponíveis para abrir e as respectivas quantidades.</CardDescription>
              </CardHeader>
              
              <CardContent className="px-4 py-5 sm:px-6 sm:py-7">
                
                <div className="w-full">
                  {userCardPacks.length === 0 ? (
                    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
                      <Package className="mb-3 size-8 text-slate-400" />
                      <p className="font-semibold text-slate-800">Você ainda não possui pacotinhos</p>
                      <p className="mt-1 text-sm text-slate-500">Encontre novos pacotinhos na área de compra.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                      {userCardPacks.slice().sort((a, b) => new Date(b.last_obtained_at).getTime() - new Date(a.last_obtained_at).getTime()).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 sm:p-3"
                          onClick={() => handleOpenUserPacksModal(item)}
                          aria-label={`Ver ${item.quantity} pacotes de ${item.card_pack.name}`}
                        >
                          <span className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2">
                            <Image
                              unoptimized
                              src={item.card_pack.image_url}
                              alt={item.card_pack.name}
                              fill
                              className="object-contain p-2 transition-transform group-hover:scale-105"
                            />
                          </span>
                          <span className="mt-3 flex items-center justify-center gap-1 text-center">
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-900">{item.quantity}x</span>
                            <span className="min-w-0 truncate text-sm font-semibold text-slate-800">{item.card_pack.name}</span>
                          </span>
                        </button>
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
                    <DialogContent className="max-h-[90vh] max-w-[calc(100vw-1.5rem)] overflow-y-auto sm:max-w-xl">
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
          <TabsContent value="my-cards" className="mt-4">
            <Card className="gap-0 overflow-hidden rounded-2xl border-slate-200 py-0 shadow-sm">
              <CardHeader className="border-b border-slate-100 px-4 py-5 sm:px-6">
                <CardTitle className="text-xl font-bold text-slate-900 sm:text-2xl">Minhas figurinhas</CardTitle>
                <CardDescription>Consulte seus itens por álbum, quantidade ou nome.</CardDescription>
              </CardHeader>
              
              <CardContent className="px-4 py-5 sm:px-6 sm:py-7">
                <div className="w-full">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                    <div className="relative min-w-0 flex-1">
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        className="h-11 pl-9"
                        aria-label="Filtrar figurinhas"
                        placeholder="Buscar por figurinha, time ou naipe..."
                        value={stickerFilter}
                        onChange={(event) => setStickerFilter(event.target.value)}
                      />
                    </div>
                    <Select value={stickerAlbumFilter} onValueChange={setStickerAlbumFilter}>
                      <SelectTrigger className="h-11 w-full bg-white sm:w-64" aria-label="Filtrar por álbum">
                        <SelectValue placeholder="Todos os álbuns" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os álbuns</SelectItem>
                        {albumOptions.map((albumName) => (
                          <SelectItem key={albumName} value={albumName}>{albumName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {userAlbumCards.length === 0 ? (
                    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
                      <ImageIcon className="mb-3 size-8 text-slate-400" />
                      <p className="font-semibold text-slate-800">Você ainda não possui figurinhas</p>
                      <p className="mt-1 text-sm text-slate-500">Abra um pacotinho para começar sua coleção.</p>
                    </div>
                  ) : filteredUserAlbumCards.length === 0 ? (
                    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
                      <Search className="mb-3 size-8 text-slate-400" />
                      <p className="font-semibold text-slate-800">Nenhuma figurinha encontrada</p>
                      <p className="mt-1 text-sm text-slate-500">Ajuste sua busca ou escolha outro álbum.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {groupedUserAlbumCards.map(([albumName, cards], index) => (
                        <details
                          key={albumName}
                          open={index === 0}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-blue-950 px-4 py-4 text-base font-semibold text-white marker:hidden sm:px-5 sm:text-lg">
                            <span className="min-w-0 truncate">{albumName}</span>
                            <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white sm:text-sm">{cards.length} figurinhas</span>
                          </summary>
                          <div className="flex flex-wrap justify-end gap-2 px-3 pt-3 sm:px-4">
                              <Button
                                variant="outline"
                                className="h-9 border-blue-200 font-semibold text-blue-900 hover:bg-blue-50"
                                onClick={() => {
                                  const eventId = albumEventIds[albumName] ??
                                    cards[0]?.album_card.album.event_id ??
                                    allAlbumsCards.find((card) => card.album.name === albumName)?.album.event_id
                                  if (eventId) router.push(`/events/${eventId}/album`)
                                  else toast.error("Não foi possível encontrar a página deste álbum.")
                                }}
                              >
                                <BookOpen className="mr-2 size-4" aria-hidden="true" />
                                Ver álbum
                              </Button>
                              <Button
                                variant="outline"
                                className="h-9 border-blue-200 font-semibold text-blue-900 hover:bg-blue-50"
                                onClick={() => handleCopyAlbumSummary(albumName, cards)}
                              >
                                Copiar Resumo
                              </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-4 lg:grid-cols-4 xl:grid-cols-5">
                            {cards.map((item) => (
                              <div key={item.id} className="min-w-0">
                                <button
                                  type="button"
                                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                                  onClick={() => openStickerModal(item)}
                                  aria-label={`Ver figurinha ${item.album_card.name}, quantidade ${item.quantity}`}
                                >
                                  <Image
                                    src={item.album_card.imageUrl}
                                    alt={item.album_card.name}
                                    fill
                                    className="object-contain transition-transform group-hover:scale-105"
                                    unoptimized
                                  />  
                                  <span className="absolute right-2 top-2 rounded-full bg-blue-950 px-2 py-1 text-xs font-bold text-white shadow">{item.quantity}x</span>
                                </button>
                                <div className="mt-2 min-w-0">
                                  <p className="truncate text-sm font-semibold text-slate-800">{item.album_card.name}</p>
                                  <p className="truncate text-xs text-slate-500">{item.album_card.naipe} · {item.album_card.team}</p>
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
                    <DialogContent className="max-h-[90vh] max-w-[calc(100vw-1.5rem)] overflow-y-auto sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-center">Figurinha</DialogTitle>
                        <DialogDescription className="text-center">
                          {selectedSticker?.album_card.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative aspect-[4/5] max-h-[60vh] w-full max-w-72 overflow-hidden rounded-xl border border-slate-200 bg-white">
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
          <TabsContent value="trade-cards" className="mt-4">
            <Card className="gap-0 overflow-hidden rounded-2xl border-slate-200 py-0 shadow-sm">
                <CardHeader className="flex flex-col gap-3 border-b border-slate-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-slate-900 sm:text-2xl">Troca de figurinhas</CardTitle>
                  <CardDescription>Encontre ofertas da comunidade ou publique a sua.</CardDescription>
                </div>
                <Button
                  disabled={!userAlbumCards.some((item) => item.quantity > 1) || isTradeLoading}
                  className="h-11 w-full shrink-0 bg-blue-950 font-bold hover:bg-blue-900 sm:w-auto"
                  onClick={() => {
                    setSelectedOfferAlbum(null)
                    setSelectedTradeAlbum(null)
                    setSelectedOfferSticker(null)
                    setSelectedTradeSticker(null)
                    setIsTradeModalOpen(true)
                  }}
                >
                  Criar oferta de troca
                </Button>
              </CardHeader>
              
              <CardContent className="px-4 py-5 sm:px-6 sm:py-7">
                <div className="flex w-full flex-col items-center">

                    {trades.length === 0 ? (
                      <div className="flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
                        <ArrowRightLeftIcon className="mb-3 size-8 text-slate-400" />
                        <p className="font-semibold text-slate-800">Nenhuma oferta de troca disponível</p>
                        <p className="mt-1 text-sm text-slate-500">Seja o primeiro a publicar uma oferta.</p>
                      </div>
                    ) : (
                      trades.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((trade) => (
                        <div key={trade.id} className="mb-3 flex w-full max-w-6xl flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                          
                          <div className="flex items-center gap-3 lg:w-36 lg:flex-col lg:justify-center">
                            <AvatarIcon name={trade.from_user.name} size={52} src={trade.from_user.profile_url} className="h-[52px] w-[52px] shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">Oferta de</p>
                              <p className="truncate font-semibold text-slate-800">{trade.from_user.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Oferta de troca</p>
                            <div className="flex w-full items-center justify-center gap-3 sm:gap-6">
                              <div className="flex flex-col justify-center align-middle items-center">
                                <p className="mb-1 text-xs text-slate-500">Oferece</p>
                                <div className="relative h-28 w-20 overflow-hidden rounded-lg bg-slate-50 sm:h-32 sm:w-24">
                                  <Image
                                    unoptimized
                                    src={trade.offered_card.imageUrl}
                                    alt={trade.offered_card.name}   
                                    fill
                                    className="object-contain p-1"
                                  />
                                </div>
                                <p className="mt-2 max-w-32 text-sm font-semibold text-slate-800">{trade.offered_quantity}x {trade.offered_card.name}</p>
                              </div>
                              <ArrowRightLeftIcon className="size-6 shrink-0 text-blue-800 sm:size-8" />
                              <div className="flex flex-col justify-center align-middle items-center">
                                <p className="mb-1 text-xs text-slate-500">Em troca por</p>
                                <div className="relative h-28 w-20 overflow-hidden rounded-lg bg-slate-50 sm:h-32 sm:w-24">
                                  <Image
                                    unoptimized
                                    src={trade.trade_card.imageUrl}
                                    alt={trade.trade_card.name}
                                    fill
                                    className="object-contain p-1"
                                  />
                                </div>
                                <p className="mt-2 max-w-32 text-sm font-semibold text-slate-800">{trade.trade_quantity}x {trade.trade_card.name}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex w-full flex-col sm:flex-row lg:w-36 lg:flex-col">
                            {
                              trade.from_user.id === user!.id ? (
                                <Button disabled={isTradeLoading} className="w-full bg-red-700 hover:bg-red-800" onClick={() => handleDeleteTroca(trade.id)}>Excluir oferta</Button>
                              ):(
                                <Button disabled={trade.from_user.id === user!.id || isTradeLoading} className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => handleFazerTroca(trade.id)}>Fazer troca</Button>
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
                    <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-5xl overflow-y-auto">
                      <DialogHeader className="text-left">
                        <DialogTitle className="text-center">Qual a sua troca?</DialogTitle>
                        <DialogDescription className="text-center">
                          Escolha o que vai oferecer e a figurinha que deseja receber.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-5">
                        
                        <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                          <div className="flex flex-col text-center justify-center">
                            <p className="mb-3 font-bold text-slate-900">Sua figurinha</p>
                            <p className="text-sm font-medium mb-2">Álbum:</p>
                            <Select
                              value={selectedOfferAlbum ?? ""}
                              onValueChange={(value) => {
                                setSelectedOfferAlbum(value)
                                setSelectedOfferSticker(null)
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione um álbum" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  new Set(userAlbumCards.filter((item) => item.quantity > 1).map((item) => item.album_card.album.name))
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
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione uma figurinha" />
                              </SelectTrigger>
                              <SelectContent>
                                {userAlbumCards
                                  .filter((item) => item.quantity > 1 && (!selectedOfferAlbum || item.album_card.album.name === selectedOfferAlbum))
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
                            <div className="relative mx-auto mt-3 aspect-[4/5] w-full max-w-52 overflow-hidden rounded-xl bg-white">
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
                                <SelectTrigger className="w-full">
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
                        
                        <ArrowRightLeftIcon className="mx-auto my-1 size-7 rotate-90 text-blue-800 lg:my-0 lg:rotate-0" />
                        
                        <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                          <div className="flex flex-col text-center justify-center">
                            <p className="mb-3 font-bold text-slate-900">Quero receber</p>
                            <p className="text-sm font-medium mb-2">Álbum:</p>
                            <Select
                              value={selectedTradeAlbum ?? ""}
                              onValueChange={(value) => {
                                setSelectedTradeAlbum(value)
                                setSelectedTradeSticker(null)
                              }}
                            >
                              <SelectTrigger className="w-full">
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
                              <SelectTrigger className="w-full">
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
                            <div className="relative mx-auto mt-3 aspect-[4/5] w-full max-w-52 overflow-hidden rounded-xl bg-white">
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
                                <SelectTrigger className="w-full">
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

                      <Button className="my-2 w-full bg-blue-950 font-bold hover:bg-blue-900 sm:mx-auto sm:max-w-sm" onClick={handleCreateCardTradeOffer}>Publicar oferta de troca</Button>
                      
                    </DialogContent>
                  </Dialog>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </main>
      </div>
    </>
  );
}
