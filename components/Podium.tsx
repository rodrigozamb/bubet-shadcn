import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import Link from "next/link";

const data =[
    {
        "id":"1",
        "name":"Bateria Bandida",
        "logo":"/logos/Bandida Logo.png"
    },
    {
        "id":"2",
        "name":"Bateria C7",
        "logo":"/logos/Bateria C7 Logo.png"
    },
    {
        "id":"3",
        "name":"BaterECA",
        "logo":"/logos/BaterECA logo.png"
    },
    {
        "id":"4",
        "name":"UFUteria",
        "logo":"/logos/UFUteria logo.png"
    },
    {
        "id":"5",
        "name":"Rateria",
        "logo":"/logos/Rateria Logo.png"
    },
    {
        "id":"6",
        "name":"Meritissima",
        "logo":"/logos/Meritissima-logo.png"
    },
    {
        "id":"7",
        "name":"Psicolata",
        "logo":"/logos/Logo Psicolata.png"
    }
]

// const data = null

interface PodiumProps{

    ranking:{
        id: string,
        name: string,
        logo: string
    }[]
}

export function Podium({ ranking }: PodiumProps){

    return (

        <div className="h-68 my-5">
            <div className="flex flex-col justify-center p-6">
                
                <span className="text-center text-2xl font-bold">Pódio Oficial</span>

                <Dialog>
                    <div className="flex justify-center items-center">
                        <DialogTrigger asChild>
                            <span className="text-center text-sm cursor-pointer">ver todos</span>
                        </DialogTrigger>
                    </div>
                    <DialogContent className="w-250 h-100">
                        <DialogHeader>
                            <DialogTitle className="flex justify-center"> Ranking Geral </DialogTitle>
                        </DialogHeader>

                        <div className="h-80 overflow-y-auto ">

                            {
                                ranking.length > 0 ?
                                    ranking.map((competitor, i) => (
                                        <Link className="flex items-center h-15 hover:bg-gray-100" key={i} href={`/profile/${competitor.id}`}>
                                            { i < 3 ? <span className="font-black text-lg ml-3">{i+1}º - </span> : <span className="ml-3">{i+1}º - </span>}
                                            <Image className="m-3" src={competitor.logo} alt={competitor.name} width={40} height={40}/>
                                            {competitor.name}
                                        </Link>
                                    ))
                                :
                                    <div className="flex justify-center items-center content-center h-60">
                                        Os jurados ainda estão passando as súmulas....
                                    </div>
                            }
                        </div>
                    </DialogContent>
                </Dialog>
                
            </div>

            <div className="flex justify-center items-center font-bold">

                
                {
                        ranking.length >0 ? 

                        <div className="flex">
                            <div className="flex content-center items-center mx-5 translate-y-1/6">
                                <div>
                                    <span className="flex justify-center mb-1">2º Lugar</span>
                                    <Image className="" src={ranking[1].logo} alt={ranking[1].name} width={80} height={80}/>
                                </div>
                            </div>
                            <div className="flex content-center items-center mx-5">
                                <div>
                                    <span className="flex justify-center  mb-1">Campeão</span>
                                    <Image className="" src={ranking[0].logo} alt={ranking[0].name} width={80} height={80}/>
                                </div>
                            </div>
                            <div className="flex content-center items-center mx-5 translate-y-1/4">
                                <div>
                                    <span className="flex justify-center mb-1">3º Lugar</span>
                                    <Image className="" src={ranking[2].logo} alt={ranking[2].name} width={80} height={80}/>
                                </div>    
                            </div>
                        </div>
                
                        :

                        <div className="flex justify-center items-center content-center h-40">

                            Aguardando resultados...
                        </div>
                        
            }

                


            </div>
        </div>

    )
}