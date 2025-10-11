import { useRouter } from "next/navigation";
import AvatarIcon from "./AvatarIcon";

interface RankingPageProps{
    ranking:{
        name: string
        profile_url: string
        position: number
        username: string
        id: string
        points: number
    }[],
    userRanking:{
        name: string
        profile_url: string
        position: number
        username: string
        id: string
        points: number
    }
}

export function RankingPage({ ranking, userRanking }:RankingPageProps){

    const router = useRouter()

    console.log(userRanking)
    return(

        <div className="flex flex-col items-center" >


                <div className="flex justify-center items-center my-5">
                    <span className=" text-3xl text-black font-bold">Ranking Geral</span>
                </div>

                <div className="bg-blue-900 w-250 h-180 flex flex-col justify-between p-5 rounded-3xl">
                    <div className="overflow-y-auto">
                        {
                            ranking.length > 0 ? 
                                ranking.map((user, index)=>(
                                    <div className="flex w-230 h-18 border-2 border-gray-800 justify-between bg-gray-200 px-3 m" key={index}>
                                        <div className="flex justify-center items-center cursor-pointer" onClick={()=>{router.push(`/profile/${user.id}`)}}>
                                            {
                                                user.position > 0 ?
                                                    <span className="flex justify-center items-center ml-3 font-bold mr-4">{user.position} º - </span>
                                                :
                                                    <span className="flex justify-center items-center ml-3 font-bold mr-4">---</span>
                                            }
                                            <AvatarIcon name={user.name} src={user.profile_url} size={45} key={user.id} className="flex justify-center items-center h-[45px] w-[45px] rounded-full border-1 border-[#000000]" />
                                            <span className="flex justify-center items-center ml-3 font-bold ">{user.name}</span>
                                        </div>
                                        <div className="flex justify-center items-center px-6">
                                            <span className="mr-2">pontos: </span>
                                            <span className="text-center font-bold">{user.points}</span>
                                        </div>
                                    </div>
                                ))
                            :

                                <div className="flex justify-center items-center h-80"> 
                                    <span className="text-xl font-medium text-white">
                                        Se você achou essa mensagem eu te devo uma cerveja!
                                    </span>
                                </div>
                            

                        }
                    </div>

                    
                    <div className="flex justify-center flex-col">
                        <span className="text-white text-center font-bold">Seu Ranking: </span>
                        <div className="flex w-230 h-18 border-2 border-gray-800 justify-between bg-gray-200 px-3 my-4">
                            <div className="flex justify-center items-center cursor-pointer" onClick={()=>{router.push(`/profile/${userRanking.id}`)}}>
                                {
                                    userRanking.position > 0 ?
                                        <span className="flex justify-center items-center ml-3 font-bold mr-4">{userRanking.position} º - </span>
                                    :
                                        <span className="flex justify-center items-center ml-3 font-bold mr-4">---</span>
                                }
                                <AvatarIcon name={userRanking.name} src={userRanking.profile_url} size={45} key={userRanking.id} className="flex justify-center items-center h-[45px] w-[45px] rounded-full border-1 border-[#000000]" />
                                <span className="flex justify-center items-center ml-3 font-bold ">{userRanking.name}</span>
                            </div>
                            <div className="flex justify-center items-center px-6">
                                <span className="mr-2">pontos: </span>
                                <span className="text-center font-bold">{userRanking.points}</span>
                            </div>
                        </div>
                    </div>

                </div>


                
          
        </div>
    )
}