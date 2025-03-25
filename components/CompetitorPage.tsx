import Image from "next/image";



export function CompetitorPage(){


    return(

        <div className="flex content-center justify-center items-center bg-cover bg-center h-148 w-screen bg-gray-200" >

            <div>
                <div className="flex content-center justify-center items-center ">
                    <Image className="" src="/logos/Logo Computaria.png" alt="Bateria Computaria" width={200} height={200}/>
                </div>
                <div className="flex justify-center items-center my-2.5">
                    <span className=" text-3xl">Bateria Computaria</span>
                </div>
                <div className="flex justify-center w-screen px-60">
                    <span className=" text-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis accumsan felis vel leo egestas hendrerit sed eget lacus. Pellentesque ut purus a odio tincidunt fermentum non a risus. Nulla commodo porttitor risus sed laoreet. Nam sollicitudin volutpat magna at tristique. Sed dignissim, metus sit amet vulputate venenatis, augue arcu convallis ligula, eget lacinia elit neque vel tellus. Duis eget nisi ac ex tempor pretium sagittis ac tortor.</span>
                </div>
                <div className="flex justify-center items-center my-5">
                    <span className=" text-3xl">Colocações</span>
                </div>

                <div className=" flex justify-center">

                    <div className="mx-10">
                        <div className="flex justify-center items-center text-gray-900 bg-[#C0C0C0] rounded-full p-1 mx-2 h-15 w-15" >prata</div>
                        <div className="flex justify-center items-center top-10 text-lg" >2º lugar</div>
                    </div>
                    <div className="mx-10">
                        <div className="flex justify-center items-center text-gray-900 bg-[#FFD700] rounded-full p-1 mx-2 h-15 w-15">ouro</div>
                        <div className="flex justify-center items-center top-10 text-lg" >1º lugar</div>
                    </div>
                    <div className="mx-10">
                        <div className="flex justify-center items-center text-gray-900 bg-[#cd7f32] rounded-full p-1 mx-2 h-15 w-15">bronze</div>
                        <div className="flex justify-center items-center top-10 text-lg" >3º lugar</div>
                    </div>
                </div>
                
            </div>
          
        </div>
    )
}