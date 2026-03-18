import { FieldSelect } from "./GuessOptionsCombobox";

interface ProfilePageProps{
    description: string,
    options: string[]
    points: string
}



export function GuessPanel({ description, options, points }:ProfilePageProps){
    
    return(

        <div className="flex flex-col items-center" >

            <FieldSelect description={description} options={options} points={points} />
                
        </div>
    )
}   