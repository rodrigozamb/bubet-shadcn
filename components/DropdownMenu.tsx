"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownConfig() {

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer text-gray-300" >abrir menu</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel className="flex justify-center">Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-1 cursor-pointer">
          Ver perfil
        </div>
        <div className="p-1 cursor-pointer">
          Configurações
        </div>
        <div className="p-1 cursor-pointer">
          Enviar feedback
        </div>
        <DropdownMenuSeparator />
        <div className="text-center p-1 cursor-pointer">
          Sair
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
