"use client"
import { useState } from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export default function TestPage(){
    const [ isOpen, SetIsOpen ] = useState(false)

    return(
        <CommandDialog open={true} onOpenChange={SetIsOpen}>
        <CommandInput placeholder="Search all channels and members"/>
        <CommandList>
            <CommandEmpty>No Result found
            </CommandEmpty>
            <CommandGroup heading="Suggestions">
            <CommandItem>
                
                <span>Calendar</span>
            </CommandItem>
            <CommandItem>
                
                <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
                
                <span>Calculator</span>
            </CommandItem>
            </CommandGroup>
        
            <CommandGroup heading="Settings">
            <CommandItem>
      
                <span>Profile</span>
              
            </CommandItem>
            <CommandItem>
                
                <span>Billing</span>
       
            </CommandItem>
            <CommandItem>
            
                <span>Settings</span>
            
            </CommandItem>
            </CommandGroup>
        </CommandList>
    </CommandDialog>
    )
}