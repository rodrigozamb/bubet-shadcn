import Link from "next/link";
import AvatarIcon from "./AvatarIcon";

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
            <div className="w-85 h-130 overflow-hidden bg-blue-900 shadow rounded-4xl p-5">
                <span className="flex justify-center text-xl font-bold text-white mb-4 ">Participantes</span>
                
                <div className="content-center h-56 overflow-auto">
                    <div className="flex justify-center content-center text-white font-semibold">
                        Nenhum participante cadastrado
                    </div>
                </div>
            </div>
        </div>
        )
    }

    return (
        <div className="flex justify-center">
            <div className="w-85 h-130 overflow-hidden bg-blue-900 rounded-4xl p-5 shadow">
                <span className="flex justify-center text-xl font-bold text-white mb-4 shadow">Participantes</span>
                
                <div className="space-y-2 h-100 overflow-auto">
                {
                    competitors.map((competitor, i) => (
                        <div key={i} className="p-2 bg-gray-100 rounded cursor-pointer">
                            <Link href={`/competitors/${competitor.id}`} className="flex justify-start content-center">
                                <AvatarIcon name={competitor.name} size={40} src={competitor.profile_url} />
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