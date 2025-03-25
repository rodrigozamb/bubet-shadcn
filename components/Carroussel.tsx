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

export function Carroussel() {

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
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/4 ">
            <div className="p-1">
              <Card 
                className="cursor-pointer" 
                onClick={() => {
                    console.log(`Card ${index + 1} clicked`);
                  }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>

                    <CardContent className="flex items-center justify-center p-6 cursor-pointer">
                      <span  className="text-2xl font-semibold cursor-pointer">{index + 1}</span>
                    </CardContent>
                      
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bateria Computaria</p>
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
