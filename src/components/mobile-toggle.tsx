import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import ServerSidebar from "@/components/server/server-sidebar";



export default function MobileToggle({ serverId}: {serverId:string}){

    return(
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="md:hidden">
                    <SheetTitle>
                    <Menu className="w-8 h-8" />
                        
                    </SheetTitle>
                    <SheetDescription>
                    
                    </SheetDescription>
                </Button>
                
            </SheetTrigger>
            <SheetContent side={"left"} className="p-0 flex gap-0">
                <div className="w-[72px]">
                        <NavigationSidebar />
                </div>
                <ServerSidebar  serverId={serverId} />
            </SheetContent>
        </Sheet>
    )
}