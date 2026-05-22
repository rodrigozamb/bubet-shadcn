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
}

interface StickerCard {
  image_url: string
  name: string
  naipe: string
  obtained_at: string
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
  console.log(items)
  return (
    <>
      <HTMLFlipBook
      width={500}
      height={700}
      maxShadowOpacity={0.5}
      drawShadow={true}
      showCover={true}
      size="fixed"
      startPage={0}
      minWidth={500}
      maxWidth={500}
      minHeight={700}
      maxHeight={700}
      className="event-book"
      style={{ background: 'transparent' }}
      flippingTime={1000}
      usePortrait={false}
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
            <div className="page bg-cover bg-center text-black " key={idx}>
              <div className="page-content p-4 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/album-bg-1.png)` }}>
                <div className="image-gallery">
                  <div className="flex h-35 w-55 items-center justify-center bg-cover bg-center ">
                    <div className=" page-content  rounded-md p-4 w-full h-full bg-cover bg-center "  style={{ backgroundImage: `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/cards/group-default.png)` }}></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4">
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
                        className="rounded "
                        onClick={() => openStickerModal(sticker)}
                      >
                        <Image
                          src={sticker.image_url}
                          alt={sticker.name}
                          width={130}
                          height={130}
                          className="object-contain"
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
            <div className="page bg-cover bg-center text-black" key={idx}>
              <div className="page-content p-4 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/album-bg-1.png)` }}>
                <div className="image-gallery">
                  <div className="flex h-35 w-55 items-center justify-center bg-cover bg-center ">
                    <div className=" page-content  rounded-md p-4 w-full h-full bg-cover bg-center "  style={{ backgroundImage: `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/cards/group-default.png)` }}></div>
                  </div>
                  {/* Placeholder for images */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
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
                        className="rounded "
                        onClick={() => openStickerModal(sticker)}
                      >
                        <Image
                          src={sticker.image_url}
                          alt={sticker.name}
                          width={130}
                          height={130}
                          className="object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) :
          ( 
            <div className="page bg-cover bg-center text-black" key={idx}>
              <div className="page-content p-4 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/album-bg-1.png)` }}>
                <div className="image-gallery">
                  <div className="flex h-35 w-55 items-center justify-center bg-cover bg-center ">
                    <div className=" page-content  rounded-md p-4 w-full h-full bg-cover bg-center "  style={{ backgroundImage: `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/cards/group-default.png)` }}></div>
                  </div>
                  {/* Placeholder for images */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
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
                        className="rounded "
                        onClick={() => openStickerModal(sticker)}
                      >
                        <Image
                          src={sticker.image_url}
                          alt={sticker.name}
                          width={130}
                          height={130}
                          className="object-contain"
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
            <div className="flex flex-col justify-center items-center  page-content bg-cover bg-center h-full w-full" style={{ backgroundImage: `url(https://bubet-bucket.s3.sa-east-1.amazonaws.com/albuns/${albumId}/album-bg-1.png)` }}>
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{selectedSticker?.name}</DialogTitle>
          <DialogDescription className="text-center">
            {selectedSticker?.naipe}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-102 w-82 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {selectedSticker && (
              <Image
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