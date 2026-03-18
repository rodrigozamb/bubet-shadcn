import { FieldSelect } from "./GuessOptionsCombobox";

interface ProfilePageProps{
    description: string,
    options: string[]
}



export function GuessPanel({ description, options }:ProfilePageProps){
    
    return(

        <div className="flex flex-col items-center" >

            <FieldSelect description={description} options={options} />
                
        </div>
    )
}   