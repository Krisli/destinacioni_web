'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  MoreHorizontal, 
  Edit, 
  Calendar, 
  Eye,
  Car,
  Copy,
  Trash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/shared/components/LanguageProvider";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  id: string;
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

interface CarGridViewProps {
  cars: Car[];
  selectedCars: string[];
  onSelectCar: (carId: string, checked: boolean) => void;
}

export const CarGridView = ({ cars, selectedCars, onSelectCar }: CarGridViewProps) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (carId: string) => {
    setCarToDelete(carId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!carToDelete) return;
    
    try {
      setIsDeleting(true);
      const { deleteCar } = await import('@/lib/api/cars');
      await deleteCar(carToDelete);
      // Refresh the page to update the car list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting car:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete car. Please try again.');
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCarToDelete(null);
    }
  };

  const handleEditClick = (carId: string) => {
    router.push(`/vendor/cars/${carId}`);
  };

  const getStatusBadge = (status: Car['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success">{t('vendor.active')}</Badge>;
      case 'draft':
        return <Badge variant="secondary">{t('vendor.draft')}</Badge>;
      case 'inactive':
        return <Badge variant="destructive">{t('vendor.inactive')}</Badge>;
      default:
        return null;
    }
  };

  const CarCard = ({ car }: { car: Car }) => (
    <Card className="group hover:shadow-card transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={selectedCars.includes(car.id)}
              onCheckedChange={(checked) => onSelectCar(car.id, checked as boolean)}
            />
            <Image 
              src={car.photo} 
              alt={`${car.make} ${car.model}`}
              width={64}
              height={48}
              className="object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-foreground">
                {car.make} {car.model} {car.year}
              </h3>
              <p className="text-sm text-muted-foreground">
                {car.transmission} • {car.fuel} • {car.seats} seats
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditClick(car.id)}>
                <Edit className="h-4 w-4 mr-2" />
                {t('vendor.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Availability
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Listing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteClick(car.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                {t('vendor.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusBadge(car.status)}
            <span className="text-lg font-semibold">€{car.price}/day</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Updated {car.lastUpdate}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('vendor.deleteCar')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('vendor.deleteCarConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('vendor.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t('vendor.delete') + '...' : t('vendor.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
