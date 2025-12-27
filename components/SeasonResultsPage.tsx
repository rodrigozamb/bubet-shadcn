import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import AvatarIcon from "./AvatarIcon";

interface SeasonProps{
    points: number
    position: number
    user: {
        name: string
        profile_url: string
        id: string
    }
}

interface SeasonResultsPageProps{
    id: string
    season_name: string
}


export function SeasonResultsPage({ id, season_name }: SeasonResultsPageProps){

    const router = useRouter()

    const [seasons, setSeasons] = useState<SeasonProps[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
      api.get(`/seasons/${id}`, { withCredentials: true })
      .then((res) => {
        setSeasons(res.data)
      })
      .finally(()=>{
        setLoading(false)
      })  
    }, [])

    if(loading){
        return null
    }

    return(

        <div className="flex flex-col items-center" >

            <div>
                <h1 className="text-2xl font-bold mb-4 text-black text-center">{season_name}</h1>
                <h2 className="text-2xl font-bold mb-4 text-black text-center">Ranking geral</h2>
            </div>


            <div className="bg-blue-900 w-250 h-100 flex justify-center p-5 rounded-3xl">
                    <div className="overflow-y-auto">
                        {
                            seasons.length > 0 ? 
                                seasons.map((season, index)=>(
                                    <div className="flex w-230 h-18 border-2 border-gray-800 justify-between bg-gray-200 hover:bg-gray-100 px-5 cursor-pointer" key={index}  onClick={()=>{ router.push(`/profile/${season.user.id}`) }}>
                                        <div className="flex justify-center items-center cursor-pointer" >
                                            <span className="flex justify-center items-center font-bold mr-3">{season.position}º - </span>
                                            <AvatarIcon name={season.user.name} src={season.user.profile_url} size={45} key={season.user.id} className="flex justify-center items-center rounded-full border-1 border-[#000000]" />
                                        </div>
                                        <div className="flex justify-center items-center">
                                            <span className="font-semibold">{season.user.name}</span>
                                        </div>

                                        <div className="flex justify-center items-center">
                                            <span className="font-bold mr-2">{season.points}</span>
                                            <span>pontos</span>
                                        </div>

                                    </div>
                                ))
                            :

                                <div className="flex justify-center items-center h-80"> 
                                    <span className="text-xl font-medium text-white">
                                        Não houveram apostadores nessa temporada :/
                                    </span>
                                </div>
                            

                        }
                    </div>

                </div>
          
        </div>
    )
}