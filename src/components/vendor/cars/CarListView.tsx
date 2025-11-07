'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  MoreHorizontal, 
  Edit, 
  Calendar, 
  Eye,
  Car,
  Plus,
  Trash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/shared/components/LanguageProvider";
import { deleteCar } from "@/lib/api/cars";
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

interface CarListViewProps {
  cars: Car[];
  selectedCars: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectCar: (carId: string, checked: boolean) => void;
}

export const CarListView = ({ cars, selectedCars, onSelectAll, onSelectCar }: CarListViewProps) => {
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
            <TableHead>{t('vendor.cars')}</TableHead>
            <TableHead className="hidden sm:table-cell">{t('transmission')}</TableHead>
            <TableHead className="hidden md:table-cell">{t('vendor.fuelType')}</TableHead>
            <TableHead className="hidden md:table-cell">{t('vendor.seats')}</TableHead>
            <TableHead>{t('cars.perDay')}</TableHead>
            <TableHead className="hidden sm:table-cell">{t('vendor.status')}</TableHead>
            <TableHead className="hidden lg:table-cell">Last Update</TableHead>
            <TableHead className="w-12">{t('vendor.actions')}</TableHead>
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
                    <DropdownMenuItem onClick={() => handleEditClick(car.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t('vendor.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('vendor.availability')}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      {t('viewDetails')}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
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
    </Card>
  );
};
