/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import React, { ReactNode } from 'react'
import HTMLFlipBook from 'react-pageflip'

interface EventItem {
  id: string
  title: string
  content: string
  type: string
  [key: string]: any
}

interface EventBookProps {
  items?: EventItem[]
}



export function EventBook({ items = [
  {
    id: '1',
    title: 'Event 1',
    content: 'This is the first event with some generic content about the event details and information.',
    type: 'description'
  },
  {
    id: '2',
    title: 'Event 2',
    content: 'This is the second event with detailed information about what will happen during this event.',
    type: 'images'
  },
  {
    id: '3',
    title: 'Event 3',
    content: 'This is the third event containing important details and schedules for attendees.',
    type: 'description'
  }
] }: EventBookProps): ReactNode {
  return (
    <HTMLFlipBook
      width={300}
      height={500}
      maxShadowOpacity={0.5}
      drawShadow={true}
      showCover={true}
      size="fixed"
      startPage={0}
      minWidth={300}
      maxWidth={300}
      minHeight={500}
      maxHeight={500}
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
      disableFlipByClick={false}
    >
      <div className="page bg-red-500 text-white flex items-center justify-center" style={{ background: 'transparent' }}>
        <div className="flex flex-col justify-center items-center  page-content cover h-full w-full">
          <h1 className="text-xl font-bold">Album de Figurinhas</h1>
          <h1 className="text-xl font-semibold mt-15">XVI Principal Balatucada</h1>
        </div>
      </div>
      
      
      
      {items.length > 0 ? (
        items.map((item: EventItem) => (
          item.type === "description" ? (
            <div className="page bg-gray-300 text-black p-4" key={item.id}>
              <div className="flex flex-col items-center justify-between h-full w-full page-content">
                <h2 className="text-lg font-bold mb-4">{item.title}</h2>
                <p className="text-center font-light ">{item.content}</p>
                <p className="text-center font-light ">Confira a escalação da {item.title}</p>
              </div>
            </div>
          ) : (
            <div className="page bg-blue-200 text-black p-4" key={item.id}>
              <div className="page-content">
                <h2>{item.title}</h2>
                <div className="image-gallery">
                  <div className="flex justify-between items-center ">
                    <p className="text-center font-lightp-3">{item.title}</p>
                    <div className="bg-gray-400 h-25 w-30 rounded flex items-center justify-center">Image 1</div>
                  </div>
                  {/* Placeholder for images */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 1</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 2</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 3</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 4</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 1</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 2</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 3</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 4</div>
                    <div className="bg-gray-400 h-25 rounded flex items-center justify-center">Image 4</div>
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
      
      <div className="page bg-red-500" key="final-page">
        <div className="page-content h-full w-full" />
      </div>
    </HTMLFlipBook>
  )
}