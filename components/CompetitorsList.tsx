import Image from "next/image";
import Link from "next/link";

const data = [[]]

interface CompetitorsListProps{
    competitors:{
        id: string,
        profile_url: string,
        name: string,
    }[]
}

export function CompetitorsList({ competitors }:CompetitorsListProps){


    if(!competitors || competitors.length == 0){
        return(
            <div className="flex justify-center content-center">
            <div className="w-85 h-80 overflow-hidden bg-gray-300 shadow rounded-4xl p-5">
                <h2 className="flex justify-center text-xl font-bold mb-4 ">Participantes</h2>
                
                <div className="content-center h-56 overflow-auto">
                    <div className="flex justify-center content-center">
                        Nenhum participante cadastrado
                    </div>
                </div>
            </div>
        </div>
        )
    }

    return (
        <div className="flex justify-center">
            <div className="w-85 h-80 overflow-hidden bg-gray-300 rounded-4xl p-5 shadow">
                <h2 className="flex justify-center text-xl font-bold mb-4 ">Participantes</h2>
                
                <div className="space-y-2 h-56 overflow-auto">
                {
                    competitors.map((competitor, i) => (
                        <div key={i} className="p-2 bg-gray-100 rounded cursor-pointer">
                            <Link href={`/competitors/${competitor.id}`} className="flex justify-start content-center">
                                <Image src={competitor.profile_url} alt={competitor.id} width={40} height={40}/>
                                <span className="content-center ml-3 truncate">
                                    {competitor.name}
                                </span>
                            </Link>
                        </div>
                    ))
                }
                </div>
            </div>
        </div>

    )


}