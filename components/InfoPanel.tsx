"use client"

interface InfoPanelProps{
    name:string,
    date:string,
    local:string,
    time:string
}

export function InfoPanel({ name, date, local, time }:InfoPanelProps){


    return (

        <div className="flex justify-center max-w-252 my-12 px-30">
            <div className="content-center w-252">

                <div className="flex justify-center text-4xl my-10 font-extrabold">
                   {name}
                </div>
                <div className="flex justify-between content-center">
                    <div>
                        <span className="flex justify-center content-center text-3xl font-bold">Horário</span>
                        <span className="flex justify-center content-center my-3 text-xl">{time}</span>
                    </div>
                    <div>
                        <span className="flex justify-center content-center text-3xl font-bold">Local</span>
                        <span className="flex justify-center content-center my-3 text-xl">{local}</span>
                    </div>
                    <div>
                        <span className="flex justify-center content-center text-3xl font-bold">Data</span>
                        <span className="flex justify-center content-center my-3 text-xl">{date}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}