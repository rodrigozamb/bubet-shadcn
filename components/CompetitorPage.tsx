import AvatarIcon from "./AvatarIcon";

interface CompetitorPageProps{
    competitor:{
        name: string
        description: string
        avatar: string
    }
    stats:{
        first: number
        second: number
        third: number
        others: number
    }
}

export function CompetitorPage({ competitor, stats }:CompetitorPageProps){


    return(

        <div className="flex items-center bg-cover bg-center" >

            <div>
                <div className="flex content-center justify-center items-center mb-10">
                    <AvatarIcon name={competitor.name} size={200} src={competitor.avatar} />
                </div>
                <div className="flex justify-center items-center my-10">
                    <span className=" text-3xl text-black font-bold">{ competitor.name }</span>
                </div>
                <div className="flex justify-center w-screen px-60">
                    <span className=" text-md">{competitor.description}</span>
                </div>
                <div className="flex justify-center items-center my-5">
                    <span className=" text-3xl">Colocações</span>
                </div>

                <div className=" flex justify-center">

                    <div className="mx-10">
                        <div className="flex justify-center items-center text-gray-900 bg-[#C0C0C0] rounded-full p-1 mx-2 my-2 h-15 w-15 font-medium" >{stats.second}</div>
                        <div className="flex justify-center items-center top-10 text-lg font-bold" >2º lugar</div>
                    </div>
                    <div className="mx-10">
                        <div className="flex justify-center items-center text-gray-900 bg-[#FFD700] rounded-full p-1 mx-2 my-2 h-15 w-15 font-medium">{stats.first}</div>
                        <div className="flex justify-center items-center top-10 text-lg font-bold" >1º lugar</div>
                    </div>
                    <div className="mx-10">
                        <div className="flex justify-center items-center text-gray-900 bg-[#cd7f32] rounded-full p-1 mx-2 my-2 h-15 w-15 font-medium">{stats.third}</div>
                        <div className="flex justify-center items-center top-10 text-lg font-bold" >3º lugar</div>
                    </div>
                </div>
                
            </div>
          
        </div>
    )
}