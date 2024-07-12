import { cn } from "@/lib/utils";




interface IconSetupProps{
    icons: {
        value: string;
        label: string;
        icon: React.ComponentType<{ className?: string}> | string;   
    }[];
    target: string;
    className?: string;

}

export default function IconSetup({icons,target,className}:IconSetupProps){
    
    const data = icons.find((data) => (data.value === target))
    if(!data || !data?.icon){
        return null;
    }
    
    const { icon: IconComponent } = data


    return (
        <IconComponent
        className={cn(
             className ? className : "h-4 w-5"
        )}
        />
    )
}