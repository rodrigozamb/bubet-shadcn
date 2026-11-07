/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import Image from 'next/image'
import React, { ReactNode, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

interface AlbumPageProps {
  description: string
  type: string
  cards:StickerCard[]
  bg_image: string | null
  horizontal_cards:StickerCard[]
}

interface StickerCard {
  image_url: string
  name: string
  naipe: string
  obtained_at: string
  type: string
}

interface EventBookProps {
  items: AlbumPageProps[]
  albumId: string
}



export function EventBook({ items, albumId }: EventBookProps): ReactNode {
  const [selectedSticker, setSelectedSticker] = useState<StickerCard | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openStickerModal = (sticker: StickerCard) => {
    setSelectedSticker(sticker)
    setIsModalOpen(true)
  }
  return (
    <>
      <HTMLFlipBook
      width={500}
      height={700}
      maxShadowOpacity={0.5}
      drawShadow={true}
      showCover={true}
      size="stretch"
      startPage={0}
      minWidth={260}
      maxWidth={500}
      minHeight={364}
      maxHeight={700}
      className="event-book mx-auto"
      style={{ background: 'transparent', margin: '0 auto' }}
      flippingTime={1000}
      usePortrait={true}
      startZIndex={0}
      autoSize={true}
      mobileScrollSupport={true}
      clickEventForward={true}
      onFlip={() => {}}
      onChangeOrientation={() => {}}
      onChangeState={() => {}}
      useMouseEvents={true}
      swipeDistance={10}
      showPageCorners={true}
      disableFlipByClick={true}
    >
      <div className="page text-white flex items-center justify-center" style={{ background: 'transparent' }}>
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/album-capa.png)` }}>
        </div>
      </div>
      
      
      
      {items.length > 0 ? (
        items.map((item: AlbumPageProps, idx: number) => (
          item.type === "DESCRIPTION" ? (
            <div className="page bg-cover bg-center text-black" key={idx}>
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.description})` }}>
              </div>
            </div>
          ) : 
          item.type === "IMAGESR" ?
          (
            <div className="page album-sticker-page bg-cover bg-center text-black " key={idx}>
              <div className="page-content w-full h-full bg-cover bg-center p-[3.2cqw]" style={{ backgroundImage: item.bg_image ? `url(${item.bg_image})` : `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/album-bg-1.png)` }}>
                <div className={`image-gallery ${item.horizontal_cards.length > 0 ? 'relative' : ''}`}>

                  <>
                    <div className={`flex ${item.horizontal_cards.length > 0 ? 'absolute right-[12cqw] -top-[8cqw] h-[44cqw] w-[28cqw]' : 'h-[28cqw] w-[44cqw]'} items-center justify-center bg-cover bg-center`}>
                      <div
                        className={`page-content rounded-md p-[3.2cqw] ${item.horizontal_cards.length > 0 ? 'h-[44cqw] w-[28cqw] rotate-90 cursor-pointer' : item.cards.length > 0 ? 'h-full w-full cursor-pointer' : 'h-full w-full'} bg-cover bg-center`}
                        style={{
                          backgroundImage: item.horizontal_cards.length > 0
                            ? `url(${item.horizontal_cards[0].image_url})`
                            : `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/cards/group-default.png)`,
                        }}
                        onClick={item.horizontal_cards.length > 0 || item.cards.length > 0 ? () => openStickerModal(
                          item.horizontal_cards.length > 0
                            ? item.horizontal_cards[0]
                            : {
                                image_url: `https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/cards/group-default.png`,
                                name: 'Figurinha Desconhecida',
                                naipe: 'desconhecido',
                                obtained_at: 'Desconhecido',
                                type: 'DEFAULT',
                              }
                        ) : undefined}
                        onKeyDown={item.horizontal_cards.length > 0 || item.cards.length > 0 ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            openStickerModal(
                              item.horizontal_cards.length > 0
                                ? item.horizontal_cards[0]
                                : {
                                    image_url: `https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/cards/group-default.png`,
                                    name: 'Figurinha Desconhecida',
                                    naipe: 'desconhecido',
                                    obtained_at: 'Desconhecido',
                                    type: 'DEFAULT',
                                  }
                            )
                          }
                        } : undefined}
                        role={item.horizontal_cards.length > 0 || item.cards.length > 0 ? 'button' : undefined}
                        tabIndex={item.horizontal_cards.length > 0 || item.cards.length > 0 ? 0 : undefined}
                      ></div>
                    </div>
                    {
                      item.horizontal_cards.length > 0 && (
                        <div className='h-[28cqw]' />
                      )
                    }
                  </>
                  
                  
                  <div className="mt-[3.2cqw] grid grid-cols-3 gap-[1.6cqw]">
                    {item.cards
                    .sort((a, b) => {
                        const naipeCompare = a.naipe.localeCompare(b.naipe)
                        if (naipeCompare !== 0) return naipeCompare
                        return a.name.localeCompare(b.name)
                      })
                    .map((sticker, index) => (
                      <button
                        type="button"
                        key={`sticker-${index}`}
                        className="block w-full min-w-0 overflow-hidden rounded"
                        onClick={() => openStickerModal(sticker)}
                      >
                        <Image
                          unoptimized
                          src={sticker.image_url}
                          alt={sticker.name}
                          width={130}
                          height={130}
                          className="h-auto w-[26cqw] max-w-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) :
          item.type === "IMAGESL" ? 
          (
            <div className="page album-sticker-page bg-cover bg-center text-black" key={idx}>
              <div className="page-content w-full h-full bg-cover bg-center p-[3.2cqw]" style={{ backgroundImage: item.bg_image ? `url(${item.bg_image})` : `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/album-bg-1.png)` }}>
                <div className={`image-gallery ${item.horizontal_cards.length > 0 ? 'relative' : ''}`}>

                  <>
                    <div className={`flex ${item.horizontal_cards.length > 0 ? 'absolute left-[8cqw] -top-[8cqw] h-[44cqw] w-[28cqw]' : 'h-[28cqw] w-[44cqw]'} items-center justify-center bg-cover bg-center`}>
                      <div
                        className={`page-content rounded-md p-[3.2cqw] ${item.horizontal_cards.length > 0 ? 'h-[44cqw] w-[28cqw] rotate-90 cursor-pointer' : item.cards.length > 0 ? 'h-full w-full cursor-pointer' : 'h-full w-full'} bg-cover bg-center`}
                        style={{
                          backgroundImage: item.horizontal_cards.length > 0
                            ? `url(${item.horizontal_cards[0].image_url})`
                            : `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/cards/group-default.png)`,
                        }}
                        onClick={item.horizontal_cards.length > 0 || item.cards.length > 0 ? () => openStickerModal(
                          item.horizontal_cards.length > 0
                            ? item.horizontal_cards[0]
                            : {
                                image_url: `https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/cards/group-default.png`,
                                name: 'Figurinha Desconhecida',
                                naipe: 'desconhecido',
                                obtained_at: 'Desconhecido',
                                type: 'DEFAULT',
                              }
                        ) : undefined}
                        onKeyDown={item.horizontal_cards.length > 0 || item.cards.length > 0 ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            openStickerModal(
                              item.horizontal_cards.length > 0
                                ? item.horizontal_cards[0]
                                : {
                                    image_url: `https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/cards/group-default.png`,
                                    name: 'Figurinha Desconhecida',
                                    naipe: 'desconhecido',
                                    obtained_at: 'Desconhecido',
                                    type: 'DEFAULT',
                                  }
                            )
                          }
                        } : undefined}
                        role={item.horizontal_cards.length > 0 || item.cards.length > 0 ? 'button' : undefined}
                        tabIndex={item.horizontal_cards.length > 0 || item.cards.length > 0 ? 0 : undefined}
                      ></div>
                    </div>
                    {
                      item.horizontal_cards.length > 0 && (
                        <div className='h-[28cqw]' />
                      )
                    }
                  </>
                  
                  {/* Placeholder for images */}
                  <div className="mt-[3.2cqw] grid grid-cols-3 gap-[1.6cqw]">
                    {item.cards
                    .sort((a, b) => {
                        const naipeCompare = a.naipe.localeCompare(b.naipe)
                        if (naipeCompare !== 0) return naipeCompare
                        return a.name.localeCompare(b.name)
                      })
                    .map((sticker, index) => (
                      <button
                        type="button"
                        key={`sticker-${index}`}
                        className="block w-full min-w-0 overflow-hidden rounded"
                        onClick={() => openStickerModal(sticker)}
                      >
                        <Image
                          unoptimized
                          src={sticker.image_url}
                          alt={sticker.name}
                          width={130}
                          height={130}
                          className="h-auto w-[26cqw] max-w-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) :
          ( 
            <div className="page album-sticker-page bg-cover bg-center text-black" key={idx}>
              <div className="page-content w-full h-full bg-cover bg-center p-[3.2cqw]" style={{ backgroundImage: item.bg_image ? `url(${item.bg_image})` : `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/album-bg-1.png)` }}>
                <div className="image-gallery">
                  {/* Placeholder for images */}
                  <div className="mt-[31.2cqw] grid grid-cols-3 gap-[1.6cqw]">
                    {item.cards
                    .sort((a, b) => {
                        const naipeCompare = a.naipe.localeCompare(b.naipe)
                        if (naipeCompare !== 0) return naipeCompare
                        return a.name.localeCompare(b.name)
                      })
                    .map((sticker, index) => (
                      <button
                        type="button"
                        key={`sticker-${index}`}
                        className="block w-full min-w-0 overflow-hidden rounded"
                        onClick={() => openStickerModal(sticker)}
                      >
                        <Image
                          unoptimized
                          src={sticker.image_url}
                          alt={sticker.name}
                          width={130}
                          height={130}
                          className="h-auto w-[26cqw] max-w-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) 
        ))
      ) : (
        <div className="page">
          <div className="page-content">
            <p>No events available</p>
          </div>
        </div>
      )}
      
      {
        items.length % 2 != 0 ? (
          <div className="page bg-blue-950" key="semi-final-page">
            <div className="flex flex-col justify-center items-center  page-content bg-cover bg-center h-full w-full" style={{ backgroundImage:  `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/album-bg-1.png)` }}>
            </div>
          </div>
        ):(
          <></>
        )
      }
      <div className="page bg-blue-500" key="final-page">
        <div className="flex flex-col justify-center items-center  page-content bg-cover bg-center h-full w-full" style={{ backgroundImage: `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/album-final.png)` }}>
        </div>
      </div>
    </HTMLFlipBook>

    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) setSelectedSticker(null)
        setIsModalOpen(open)
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{selectedSticker?.name}</DialogTitle>
          <DialogDescription className="text-center">
            {selectedSticker?.naipe}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="relative aspect-square w-full max-w-[18rem] overflow-hidden rounded-xl border border-slate-200 bg-white">
            {selectedSticker && (
              <Image
                unoptimized
                src={selectedSticker!.image_url}
                alt={selectedSticker!.name}
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
  </>
  )
}