"use client"

const data = [
    {
      id:1,
      ends_at: "2025-02-08T06:52:18+00:00",
      event: "Computaria",
      podium: ["Bateria S/A", "UFScar", "Computaria"],
      points: 120,
    },
    {
      id:2,
      ends_at: "2026-02-08T06:52:18+00:00",
      event: "Bateria S/A",
      podium: ["Bateria S/A", "UFScar", "Computaria"],
      points: 158,
    },
    {
        id:3,
        ends_at: "2025-02-08T06:52:18+00:00",
        event: "Computaria",
        podium: ["Bateria S/A", "UFScar", "Computaria"],
        points: 120,
      },
      {
        id:4,
        ends_at: "2026-02-08T06:52:18+00:00",
        event: "Bateria S/A",
        podium: ["Bateria S/A", "UFScar", "Computaria"],
        points: 158,
      },
      {
        id:5,
        ends_at: "2025-02-08T06:52:18+00:00",
        event: "Computaria",
        podium: ["Bateria S/A", "UFScar", "Computaria"],
        points: 120,
      },
      {
        id:6,
        ends_at: "2026-02-08T06:52:18+00:00",
        event: "Bateria S/A",
        podium: ["Bateria S/A", "UFScar", "Computaria"],
        points: 158,
      },
      {
        id:7,
        ends_at: "2025-02-08T06:52:18+00:00",
        event: "Computaria",
        podium: ["Bateria S/A", "UFScar", "Computaria"],
        points: 120,
      },
      {
        id:8,
        ends_at: "2026-02-08T06:52:18+00:00",
        event: "Bateria S/A",
        podium: ["Bateria S/A", "UFScar", "Computaria"],
        points: 158,
      }
]

export function DefaultList(){

    return(
        <div className="overflow-auto">
            <div className="flex justify-center content-center overflow-auto">
                    <div>
                        {data.map((item) => (

                            <div 
                                className="cursor-pointer w-[10px]" 
                                key={item.id}
                            >    
                                    <div className="flex justify-center content-center">
                                    {item.event}
                                    </div>
                            </div>
                        ))}
                    </div>
                
            </div>
        </div>
    )
}