'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  MoreHorizontal, 
  Edit, 
  Calendar, 
  Eye,
  Car,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/shared/components/LanguageProvider";

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  customerName: string;
  customerEmail: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
  notes?: string;
}

interface Car {
  id: number;
  photo: string;
  make: string;
  model: string;
  year: number;
  transmission: string;
  fuel: string;
  seats: number;
  price: number;
  status: 'active' | 'draft' | 'inactive';
  lastUpdate: string;
  bookings: Booking[];
}

interface CarListViewProps {
  cars: Car[];
  selectedCars: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectCar: (carId: number, checked: boolean) => void;
}

export const CarListView = ({ cars, selectedCars, onSelectAll, onSelectCar }: CarListViewProps) => {
  const { t } = useLanguage();
  const router = useRouter();

  const getStatusBadge = (status: Car['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success">Active</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedCars.length === cars.length}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Car</TableHead>
            <TableHead className="hidden sm:table-cell">Transmission</TableHead>
            <TableHead className="hidden md:table-cell">Fuel</TableHead>
            <TableHead className="hidden md:table-cell">Seats</TableHead>
            <TableHead>Price/day</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Last Update</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>
                <Checkbox
                  checked={selectedCars.includes(car.id)}
                  onCheckedChange={(checked) => onSelectCar(car.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <img 
                    src={car.photo} 
                    alt={`${car.make} ${car.model}`}
                    className="w-12 h-9 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium">
                      {car.make} {car.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {car.year}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{car.transmission}</TableCell>
              <TableCell className="hidden md:table-cell">{car.fuel}</TableCell>
              <TableCell className="hidden md:table-cell">{car.seats}</TableCell>
              <TableCell className="font-medium">€{car.price}</TableCell>
              <TableCell className="hidden sm:table-cell">{getStatusBadge(car.status)}</TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">{car.lastUpdate}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="h-4 w-4 mr-2" />
                      Availability
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
