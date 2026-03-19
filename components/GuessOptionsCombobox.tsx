/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

interface SelectProps {
  options: string[]
  description: string
  points: string
}

import { useState } from "react"
import { Field } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button"
import { Bounce, toast } from "react-toastify"
import { api } from "@/services/api"
import { usePathname, useRouter } from "next/navigation"

export function FieldSelect( props: SelectProps  ) {


  const pathname = usePathname()

  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const handleValueChange = (value: string) => {
    const index = props.options.indexOf(value)
    setSelectedIndex(index)
  }

  const handleSubmit = async() => {
    console.log("Index selecionado:", selectedIndex)
    const guessBetId = pathname.split("/palpites/")[1]
    if(selectedIndex === -1){
      toast.warn("Você precisa selecionar um palpite...", {
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
    toast.info("Palpite está sendo criado, aguarde um minuto...", {
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
      const newResult = await api.post(`/guess-bets/${guessBetId}`,{"guess":selectedIndex}, { withCredentials: true })
      if(newResult.status != 201){
        console.log('DEU ERRO NA CRIAÇÃO DO RESULTADO DO EVENTO') 
      }else{
        
        toast.success('Palpite feito com sucesso!!', {
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


      router.push(`/palpites/${guessBetId}`)
      }
      
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
    <div>
      <p className="flex justify-center text-center font-semibold text-3xl w-150 mb-5" >{props.description}</p>
      <Field className=" my-5 ">
        <Select value={selectedIndex !== null ? props.options[selectedIndex] : ""} onValueChange={handleValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Escolha um palpite" />
          </SelectTrigger>
          <SelectContent className=" text-center">
            <SelectGroup>
              {props.options.map((item : string) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex text-center align-middle justify-center items-center">
          <p>Acerte o palpite e ganhe</p>
          <p className="mx-3 text-orange-400 font-bold text-2xl"  > {props.points}</p>
          <p>pontos</p>
        </div>
        <Button onClick={handleSubmit} className="cursor-pointer w-52 h-12 text-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-semibold py-2 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-opacity duration-200"> Fazer Palpite</Button>
      </Field>
    </div>
  )
}
