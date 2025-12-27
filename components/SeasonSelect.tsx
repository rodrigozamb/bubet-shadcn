import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

interface SeasonProps{
    name: string
    id: string
    created_at: string
}


export function SeasonSelect(){

    const router = useRouter()

    const [seasons, setSeasons] = useState<SeasonProps[]>([])
    const [loading, setLoading] = useState<boolean>(true)


    useEffect(() => {
      api.get(`/temporadas`, { withCredentials: true })
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
                <h1 className="text-2xl font-bold mb-4">Selecione a Temporada</h1>
            </div>

            {
                seasons.map((season, i) => (
                    <div 
                        key={i} 
                        className="flex justify-center p-2 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer shadow w-80 h-20 my-3"
                    >
                        <span className="content-center truncate text-center" onClick={()=>{router.push(`/temporadas/${season.id}`)}}>
                            {season.name}
                        </span>  
                    </div>
                ))
            }
          
        </div>
    )
}