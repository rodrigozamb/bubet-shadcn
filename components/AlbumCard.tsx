import { useState } from "react"
import Image from "next/image"

import bgTibufu from "@/public/albuns/bg-card-tibufu.png"

interface AlbumCardProps {
    backgroundImage: string,
    name: string,
    competitor: string,
    instrument: string
}


export function AlbumCard({ backgroundImage, name, competitor, instrument }: AlbumCardProps) {

    const [flipped, setFlipped] = useState(false)
    return (
        <div className="flex justify-center items-center my-15">
            {/* Cartinha! */}
            <div 
                className={`w-80 h-100 ${flipped ? 'bg-white' : 'bg-gray-300'} rounded-lg shadow-lg flex items-center justify-center mx-4 transition-transform ${flipped ? '[transform:rotateY(180deg)]' : ''}`} 
                onClick={()=>setFlipped(true)}
            >   
                {!flipped &&
                <div style={{borderRadius: '10px', overflow: 'hidden'}} className="hover:transform hover:scale-105 transition-transform" >
                    <Image src={bgTibufu}  alt="bemvindo" layout="fit" objectFit="cover"/>
                </div>
                }
                {flipped &&
                    <div style={{borderRadius: '10px', overflow: 'hidden', position: 'relative'}} >
                        
                        <Image src={backgroundImage}  alt="bemvindo"  width={320} height={400} layout="fit" objectFit="cover"/>
                        <div className={`[transform:rotateY(180deg)] absolute top-0 left-0 z-10 w-full h-full flex flex-col justify-end p-4 text-white`}>
                            <div >
                                <h3 className="text-xl font-bold text-center">{name}</h3>
                                <p className="text-center font-semibold">{competitor}</p>
                                <p className="text-center font-semibold">{instrument}</p>
                            </div>
                        </div>

                    </div>
                    
                }
            </div>
        </div>
    )
}