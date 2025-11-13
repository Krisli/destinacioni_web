'use client'

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Location {
  value: string;
  label: string;
  labelAL: string;
}

interface SearchableLocationSelectProps {
  locations: Location[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  language?: 'en' | 'al';
  includeSamePlace?: boolean;
  samePlaceLabel?: string;
}

export const SearchableLocationSelect = ({
  locations,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select location...",
  language = 'en',
  includeSamePlace = false,
  samePlaceLabel = "Same place"
}: SearchableLocationSelectProps) => {
  const [open, setOpen] = React.useState(false);

  const getDisplayLabel = (val: string): string => {
    if (includeSamePlace && val === 'same') {
      return samePlaceLabel;
    }
    const location = locations.find((loc) => loc.value === val);
    if (!location) return placeholder;
    return language === 'al' ? location.labelAL : location.label;
  };

  const displayValue = value ? getDisplayLabel(value) : placeholder;

  // Combine locations with "same place" option if needed
  const allOptions = includeSamePlace 
    ? [{ value: 'same', label: samePlaceLabel, labelAL: samePlaceLabel }, ...locations]
    : locations;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto p-0 border-0 shadow-none hover:bg-transparent"
          disabled={disabled}
        >
          <span className="text-sm font-medium text-foreground">
            {displayValue}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search locations..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {allOptions.map((location) => {
                const displayLabel = language === 'al' ? location.labelAL : location.label;
                return (
                  <CommandItem
                    key={location.value}
                    value={displayLabel}
                    onSelect={() => {
                      onValueChange(location.value);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === location.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {displayLabel}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

