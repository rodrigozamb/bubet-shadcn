import { useState } from "react"
import Image from "next/image"

import bgTibufu from "@/public/albuns/bg-card-tibufu.png"

interface AlbumCardProps {
    backgroundImage: string,
    name: string,
    competitor: string,
    instrument: string,
    onFlip?: () => void
}


export function AlbumCard({ backgroundImage, name, onFlip }: AlbumCardProps) {

    const [flipped, setFlipped] = useState(false)
    return (
        <div className="flex justify-center items-center my-15">
            {/* Cartinha! */}
            <div 
                className={`w-80 h-100 ${flipped ? 'bg-white' : 'bg-gray-300'} rounded-lg shadow-lg flex items-center justify-center mx-4 cursor-pointer transition-transform ${flipped ? '[transform:rotateY(360deg)]' : ''}`} 
                onClick={() => {
                    if (!flipped) {
                        setFlipped(true)
                        onFlip?.()
                    }
                }}
            >   
                {!flipped &&
                <div style={{borderRadius: '10px', overflow: 'hidden'}} className="hover:transform hover:scale-105 transition-transform" >
                    <Image src={bgTibufu}  alt="bemvindo" layout="fit" objectFit="cover"/>
                </div>
                }
                {flipped &&
                    <div style={{borderRadius: '10px', overflow: 'hidden', position: 'relative'}} >
                        
                        <Image unoptimized src={backgroundImage}  alt={name}  width={320} height={400} layout="fit" objectFit="cover"/>
                        

                    </div>
                    
                }
            </div>
        </div>
    )
}