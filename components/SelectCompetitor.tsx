// components/SelectCompetitor.tsx
'use client';
import * as React from "react";
import {
  Select as ShadcnSelect,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Option{
    id: string,
    name: string
  }

interface SelectProps{
  options:Option[],
  value?: string;
  onValueChange: (value: string) => void;
}

export function SelectCompetitor({ options, value, onValueChange }:SelectProps) {

  return (
    <ShadcnSelect value={value} onValueChange={onValueChange} >
      <SelectTrigger className="w-[180px] text-white bg-gray-100">
        <div className="text-black">
          <SelectValue placeholder="Escolha uma bateria"/>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-black font-bold">Competidores</SelectLabel>
          {options.map((v) => (
            <SelectItem 
              className="cursor-pointer" 
              key={v.id} 
              value={v.id}
            >
              {v.name.charAt(0).toUpperCase() + v.name.slice(1)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </ShadcnSelect>
  );
}
