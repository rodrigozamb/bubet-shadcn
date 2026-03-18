import { useRouter } from "next/navigation";
import { FieldSelect } from "./GuessOptionsCombobox";

interface ProfilePageProps{
    description: string,
    options: string[]
}



export function GuessPanel({ description, options }:ProfilePageProps){

    const router = useRouter()

    
    return(

        <div className="flex flex-col items-center" >

            <FieldSelect description={description} options={options} />
                
        </div>
    )
}   