import Image from "next/image";


import p1 from "@/public/prints/p1.png"
import bemvindo from "@/public/bemvindo.png"
import bubetlogo from '@/public/logoRetoSemSombra2.png'

export default function WelcomeImage(){
    return(

        <div className="flex flex-col justify-center">


        <div className="absolute flex justify-center z-3">
          <Image src={bemvindo.src} alt="bemvindo" width={700} height={700}/>
        </div>

        <div className="absolute flex justify-center z-5 left-50 top-50">
          <Image src={bubetlogo.src} alt="bubetlogo" width={500} height={500}/>
        </div>

        <div className="absolute flex justify-center z-1">
          <Image className="shadow-2xl rounded-3xl" src={p1.src} alt="p1" width={1000} height={1000}/>
        </div>
      </div>
    )
}