import { useState } from "react"
import Image from "next/image"

interface AlbumCardProps {
    backgroundImage: string,
    cardbackImage: string,
    name: string,
    competitor: string,
    instrument: string,
    onFlip?: () => void
}


export function AlbumCard({ backgroundImage, name, cardbackImage, onFlip }: AlbumCardProps) {

    const [flipped, setFlipped] = useState(false)

    return (
        <div className="flex justify-center items-center my-4">
            {/* Cartinha! */}
            <div 
                className={`w-80 h-100 ${flipped ? 'bg-white' : 'bg-gray-300'} overflow-hidden rounded-lg shadow-lg flex items-center justify-center mx-4 cursor-pointer transition-transform ${flipped ? '[transform:rotateY(360deg)]' : ''}`} 
                onClick={() => {
                    if (!flipped) {
                        setFlipped(true)
                        onFlip?.()
                    }
                }}
            >   
                {!flipped &&
                <div style={{borderRadius: '10px', overflow: 'hidden'}} className="hover:transform hover:scale-105 transition-transform" >
                    <Image unoptimized  src={cardbackImage}  alt="bemvindo" layout="fit" objectFit="cover" width={320} height={400}/>
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