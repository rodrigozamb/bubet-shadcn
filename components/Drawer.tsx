"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"

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

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
]

export function BetDrawer() {
  const [goal, setGoal] = React.useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

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
                <KanbanBoard/>
              </div>
              <div className="flex flex-col justify-center items-center pl-10">
                <Button className="cursor-pointer w-56 h-15 text-xl flex bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-200"> Fazer Aposta</Button>  
                <DrawerClose asChild>
                  <Button className="cursor-pointer" variant="outline">Cancelar</Button>
                </DrawerClose>
              </div>
            </div>
          {/* <div className="p-4 pb-0 bg-red-500">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-10)}
                disabled={goal <= 200}
              >
                <Minus />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {goal}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Calories/day
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(10)}
                disabled={goal >= 400}
              >
                <Plus />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            <div className="mt-3 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar
                    dataKey="goal"
                    style={
                      {
                        fill: "hsl(var(--foreground))",
                        opacity: 0.9,
                      } as React.CSSProperties
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div> */}
          <DrawerFooter>
            {/* <div className="flex flex-col justify-center items-center">
              <Button className="cursor-pointer w-56 h-15 text-xl flex bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-200"> Fazer Aposta</Button>  
              <DrawerClose asChild>
                <Button className="cursor-pointer" variant="outline">Cancelar</Button>
              </DrawerClose>
            </div> */}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
