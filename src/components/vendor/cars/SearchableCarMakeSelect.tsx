'use client'

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CarMake } from "@/lib/api/cars";

interface SearchableCarMakeSelectProps {
  carMakes: CarMake[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const SearchableCarMakeSelect = ({
  carMakes,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select make..."
}: SearchableCarMakeSelectProps) => {
  const [open, setOpen] = React.useState(false);

  const selectedMake = carMakes.find((make) => make.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10"
          disabled={disabled}
        >
          {selectedMake ? selectedMake.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search makes..." />
          <CommandList>
            <CommandEmpty>No make found.</CommandEmpty>
            <CommandGroup>
              {carMakes.map((make) => (
                <CommandItem
                  key={make.id}
                  value={make.name}
                  onSelect={() => {
                    onValueChange(make.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === make.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {make.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

