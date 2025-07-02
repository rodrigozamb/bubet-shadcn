import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import Link from "next/link";
import AvatarIcon from "./AvatarIcon";


// const data = null

interface PodiumProps{

    ranking:{
        id: string,
        name: string,
        profile_url: string
        score: string
        competitor:{
            id:string,
            name: string,
            description: string,
            profile_url: string
        }
        estandartes: {
            name:string
        }[]
    }[]
}

export function Podium({ ranking }: PodiumProps){
    console.log(ranking)
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
                    <DialogContent className="w-200 h-[450px]">
                        <DialogHeader>
                            <DialogTitle className="flex justify-center"> Ranking Geral </DialogTitle>
                        </DialogHeader>

                        <div className="h-80 overflow-y-auto ">

                            {
                                ranking.length > 0 ?
                                    ranking.map((competitor, i) => (
                                        <div key={i} className="hover:bg-gray-100">
                                            <Link className="flex items-center justify-between h-15 hover:bg-gray-100 my-1" key={i} href={`/competitors/${competitor.id}`}>
                                                <div className="flex items-center">
                                                    { i < 3 ? <span className="font-black text-lg ml-3">{i+1}º - </span> : <span className="ml-3">{i+1}º - </span>}
                                                    <AvatarIcon name={competitor.name} size={200} src={competitor.profile_url} className="m-3"/>
                                                    {competitor.name}
                                                </div>
                                                <span className="flex mr-5 font-medium">{competitor.score}</span>
                                            </Link>
                                            {
                                                competitor.estandartes.length > 0 ? 
                                                
                                                    (
                                                        <>
                                                            <span className="flex justify-center font-bold mb-2">Estandartes</span>
                                                            <div className="grid grid-cols-5 justify-center ml-15 pb-3">
                                                                {
                                                                    competitor.estandartes.map((estandarte, idx) => (

                                                                        <div key={idx}>
                                                                            <span className="mx-1">
                                                                                {estandarte.name.split("Estandarte de")[1]}
                                                                            </span>

                                                                        </div>

                                                                    ))

                                                                }
                                                            </div>
                                                        </>
                                                    )
                                                :
                                                    <div></div>    
                                            }
                                            
                                        </div>

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
                                    <AvatarIcon name={ranking[1].name} size={80} src={ranking[1].profile_url} />
                                    <span className="flex justify-center text-center">{ranking[1].score}</span>
                                </div>
                            </div>
                            <div className="flex content-center items-center mx-5">
                                <div>
                                    <span className="flex justify-center  mb-1">Campeão</span>
                                    <AvatarIcon name={ranking[0].name} size={80} src={ranking[0].profile_url} />
                                    <span className="flex justify-center text-center">{ranking[0].score}</span>
                                </div>
                            </div>
                            <div className="flex content-center items-center mx-5 translate-y-1/4">
                                <div>
                                    <span className="flex justify-center mb-1">3º Lugar</span>
                                    <AvatarIcon name={ranking[2].name} size={80} src={ranking[2].profile_url} />
                                    <span className="flex justify-center text-center">{ranking[2].score}</span>
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