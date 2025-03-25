"use client"

const event = {
    "name":"Principal Balatucada 2025",
    "date":"29/08/2025",
    "local":"Quadra Rosas de Ouro",
    "time":"10:00 - 18:00"
}


export function InfoPanel(){


    return (

        <div className="flex justify-center max-w-252 my-12 px-30">
            <div className="content-center w-252">

                <div className="flex justify-center text-4xl my-10 font-extrabold">
                   {event.name}
                </div>
                <div className="flex justify-between content-center">
                    <div>
                        <span className="flex justify-center content-center text-3xl font-bold">Horário</span>
                        <span className="flex justify-center content-center my-3 text-xl">{event.time}</span>
                    </div>
                    <div>
                        <span className="flex justify-center content-center text-3xl font-bold">Local</span>
                        <span className="flex justify-center content-center my-3 text-xl">{event.local}</span>
                    </div>
                    <div>
                        <span className="flex justify-center content-center text-3xl font-bold">Data</span>
                        <span className="flex justify-center content-center my-3 text-xl">{event.date}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}