"use client"

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface CodigosProps{
  id:string,
  codigo: string,
  created_at: string,
  item: {
    name:string,
    image_url:string
  },
  quantity: string,
  reedeemed?: string,
  reedeemer?: {
    name: string
  }
}

interface ItemsProps{
  name: string,
  id:string
}


export default function ComprasPage() {

  useContext(AuthContext)

  const [codigos, setCodigos] = useState<CodigosProps[]>([])
  const [items, setItems] = useState<ItemsProps[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [itemSearch, setItemSearch] = useState("")
  const [formData, setFormData] = useState({
    code: "",
    item: "",
    item_id: "",
    quantity: 1,
  }) 


    useEffect(()=>{
      api.get(`/codigos`, { withCredentials: true })
        .then((res)=>{
          setCodigos(res.data.codigos)
          api.get(`/codigos/items`, { withCredentials: true })
            .then((res2) => {
              setItems(res2.data.items)
            })
        })
    },[])

  const tit = `Codigos Promocionais`

  const handleInputChange = (field: string, value: string) => {
    const normalizedValue = field === "code" ? value.toUpperCase() : value

    setFormData(prev => ({
      ...prev,
      [field]: normalizedValue
    }))
  }

  const handleItemSearchChange = (value: string) => {
    setItemSearch(value)

    const selectedItem = items.find((item) => item.name.toLowerCase() === value.toLowerCase())

    handleInputChange("item_id", selectedItem?.id ?? "")
  }

  const handleCreateCodigo = async () => {
    try {
      await api.post("/codigos", formData, { withCredentials: true })
      
      // Reset form
      setFormData({
        code: "",
        item: "",
        item_id: "",
        quantity: 1,
      })
      setItemSearch("")
      setIsModalOpen(false)
      
      // Refresh codigos list
      api.get(`/codigos`, { withCredentials: true })
        .then((res) => {
          setCodigos(res.data.codigos)
        })
    } catch (error) {
      console.error("Erro ao criar código:", error)
    }
  }

  return (
    <>

      <title>{tit}</title>
      <meta name="event" content="Codigos promocionais!"/>
      
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>

        <div className="font-extrabold text-2xl flex flex-col justify-center align-middle items-center my-5">
          Codigos Promocionais
        <Button 
          onClick={() => setIsModalOpen(true)}
          className=" bg-blue-500 text-white hover:bg-blue-600 mt-4 w-50">
          Criar Código
        </Button>
        </div>
        <div className="flex-1 flex flex-col items-center px-4 w-full">
          <div className="w-full max-w-3xl max-h-[60vh] overflow-y-auto space-y-4 px-2 py-2">
            {
              [...codigos]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((tra) => (
                  <div key={`${tra.id}`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between w-full border-2 rounded-xl px-3 py-4 gap-3">
                      <div className="flex flex-col text-center text-gray-700 m-3">
                        <span className="font-medium">codigo:</span>
                        <span className="font-medium">{tra.codigo}</span>
                      </div>
                      <div className="flex flex-col text-center text-gray-700 m-3">
                        <span className="font-medium">Item:</span>
                        <span className="font-medium">{tra.quantity} x {tra.item.name}</span>
                      </div>
                      <div className="flex flex-col text-center items-center justify-center m-3">
                        <span className="font-semibold">{tra.reedeemer ? tra.reedeemer.name : 'Não resgatado'}</span>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} >
        <DialogContent className="max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Código</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 ">
            {/* Campo Código */}
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                placeholder="Digite o código"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                style={{ textTransform: "uppercase" }}
              />
            </div>

            {/* Campo Item */}
            <div className="space-y-2">
              <Label htmlFor="item">Tipo do Item</Label>
              <Select value={formData.item} onValueChange={(value) => handleInputChange("item", value)}>
                <SelectTrigger id="item">
                  <SelectValue placeholder="Selecione um item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CARD">CARD</SelectItem>
                  <SelectItem value="CARDPACK">CARDPACK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo Item */}
            <div className="space-y-2">
              <Label htmlFor="item_id">Item</Label>
              <Input
                id="item_id"
                list="item-options"
                placeholder="Digite o nome do item"
                value={itemSearch}
                onChange={(e) => handleItemSearchChange(e.target.value)}
              />
              <datalist id="item-options">
                {items.map((item) => (
                  <option key={item.id} value={item.name} />
                ))}
              </datalist>
            </div>

            {/* Campo Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Digite a quantidade"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCodigo}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
