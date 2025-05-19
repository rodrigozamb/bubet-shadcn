"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { KanbanBoard } from "./board/KanbanBoard"


export function BetDrawer() {
  const [goal, setGoal] = React.useState(350)
  const [bets, setBeats] = React.useState([])


  return (
    <Drawer>
      <DrawerTrigger asChild>
      <Button className="cursor-pointer w-56 h-15 text-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-200"> Fazer Aposta</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto">
          <DrawerHeader>
            <DrawerTitle>Fazer aposta</DrawerTitle>
            <DrawerDescription>Coloque em ordem os competidores de acordo com sua resposta</DrawerDescription>
          </DrawerHeader>
            <div className="flex">
              <div className="h-full">
                <KanbanBoard onUpdateBets={setBeats}/>
              </div>
              <div className="flex flex-col justify-center items-center pl-10">
                <Button 
                  className="cursor-pointer w-56 h-15 text-xl flex bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-200"
                > 
                    Fazer Aposta
                </Button>  
                <DrawerClose asChild>
                  <Button className="cursor-pointer mt-10 bg-gray-200 font-medium" variant="outline">Cancelar</Button>
                </DrawerClose>
              </div>
            </div>
          <DrawerFooter>
            
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
