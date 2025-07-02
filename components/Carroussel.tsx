/* eslint-disable @typescript-eslint/no-unused-expressions */ 
"use client"
 
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { useRouter } from 'next/navigation'
import AvatarIcon from "./AvatarIcon";

interface CarrousselItem{
  id: string
  name: string
  profile_url?: string
  banner?: string
} 

interface CarrousselProps{
  items: CarrousselItem[]
  isCompetitor: boolean
}

export function Carroussel({ items, isCompetitor }:CarrousselProps) {

  const router = useRouter()

  return (
    <Carousel 

        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
            stopOnMouseEnter: true
          }),
        ]}
        className="w-full max-w-4xl"
        opts={{
            align:"start",
            loop: true
        }}
    >
      <CarouselContent className="-ml-1 cursor-pointer">
        {items.map((item, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/4 ">
            <div className="p-1">
              <Card 
                className="cursor-pointer" 
                onClick={() => {
                    isCompetitor ?
                      router.push(`/competitors/${item.id}`)
                    :
                      router.push(`/events/${item.id}`)
                  }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>

                    <CardContent className="flex items-center justify-center h-30 cursor-pointer">
                      <AvatarIcon name={item.name} size={100} src={isCompetitor ?  item.profile_url! : item.banner! } />
                    </CardContent>
                      
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="cursor-pointer"/>
      <CarouselNext className="cursor-pointer"/>
    </Carousel>
  )
}
