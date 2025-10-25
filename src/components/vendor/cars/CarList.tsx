import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Grid, 
  List, 
  Filter, 
  Search, 
  Car,
  Plus,
  CalendarDays
} from "lucide-react";

// Mock car images - replace with actual imports when available
const vwGolfImage = "/images/cars/vw-golf.jpg";
const bmwSedanImage = "/images/cars/bmw-sedan.jpg";
const toyotaHatchbackImage = "/images/cars/toyota-hatchback.jpg";
const mercedesSedanImage = "/images/cars/mercedes-sedan.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/shared/components/LanguageProvider";
import { cn } from "@/lib/utils";
import { CarListView } from "./CarListView";
import { CarGridView } from "./CarGridView";
import { CarCalendarView } from "./CarCalendarView";

interface Booking {
  id: string;
  startDate: string; // ISO date string from API
  endDate: string; // ISO date string from API
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
  bookings: Booking[]; // Array of bookings for this car
}

interface CalendarDay {
  date: Date;
  isBooked: boolean;
  booking?: Booking;
}


export const CarList = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'calendar'>('table');
  const [selectedCars, setSelectedCars] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data with bookings array for each car
  const cars: Car[] = [
    {
      id: 1,
      photo: vwGolfImage,
      make: "Volkswagen",
      model: "Golf",
      year: 2020,
      transmission: "Manual",
      fuel: "Petrol",
      seats: 5,
      price: 45,
      status: 'active',
      lastUpdate: "2 days ago",
      bookings: [
        {
          id: '1',
          startDate: '2024-01-15',
          endDate: '2024-01-18',
          customerName: 'John Doe',
          customerEmail: 'john.doe@email.com',
          status: 'confirmed',
          totalPrice: 180,
          notes: 'Airport pickup requested'
        },
        {
          id: '2',
          startDate: '2024-01-28',
          endDate: '2024-02-02',
          customerName: 'Mike Johnson',
          customerEmail: 'mike.johnson@email.com',
          status: 'pending',
          totalPrice: 225,
          notes: 'Extended weekend rental'
        }
      ]
    },
    {
      id: 2,
      photo: bmwSedanImage,
      make: "BMW",
      model: "320i",
      year: 2021,
      transmission: "Automatic",
      fuel: "Petrol",
      seats: 5,
      price: 85,
      status: 'active',
      lastUpdate: "1 week ago",
      bookings: [
        {
          id: '3',
          startDate: '2024-01-20',
          endDate: '2024-01-25',
          customerName: 'Jane Smith',
          customerEmail: 'jane.smith@email.com',
          status: 'confirmed',
          totalPrice: 425,
          notes: 'Business trip'
        },
        {
          id: '4',
          startDate: '2024-02-10',
          endDate: '2024-02-15',
          customerName: 'Alex Brown',
          customerEmail: 'alex.brown@email.com',
          status: 'confirmed',
          totalPrice: 425,
          notes: 'Valentine\'s weekend'
        }
      ]
    },
    {
      id: 3,
      photo: toyotaHatchbackImage,
      make: "Toyota",
      model: "Yaris",
      year: 2019,
      transmission: "Manual",
      fuel: "Hybrid",
      seats: 5,
      price: 35,
      status: 'draft',
      lastUpdate: "3 days ago",
      bookings: [
        {
          id: '5',
          startDate: '2024-01-12',
          endDate: '2024-01-14',
          customerName: 'Emma Davis',
          customerEmail: 'emma.davis@email.com',
          status: 'cancelled',
          totalPrice: 70,
          notes: 'Customer cancelled due to weather'
        }
      ]
    },
    {
      id: 4,
      photo: mercedesSedanImage,
      make: "Mercedes",
      model: "C-Class",
      year: 2022,
      transmission: "Automatic",
      fuel: "Petrol",
      seats: 5,
      price: 120,
      status: 'active',
      lastUpdate: "5 days ago",
      bookings: [
        {
          id: '6',
          startDate: '2024-01-10',
          endDate: '2024-01-12',
          customerName: 'Sarah Wilson',
          customerEmail: 'sarah.wilson@email.com',
          status: 'confirmed',
          totalPrice: 240,
          notes: 'Luxury weekend getaway'
        },
        {
          id: '7',
          startDate: '2024-02-20',
          endDate: '2024-02-25',
          customerName: 'David Lee',
          customerEmail: 'david.lee@email.com',
          status: 'pending',
          totalPrice: 600,
          notes: 'Corporate event transportation'
        }
      ]
    },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCars(cars.map(car => car.id));
    } else {
      setSelectedCars([]);
    }
  };

  const handleSelectCar = (carId: number, checked: boolean) => {
    if (checked) {
      setSelectedCars([...selectedCars, carId]);
    } else {
      setSelectedCars(selectedCars.filter(id => id !== carId));
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('cars')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your vehicle listings</p>
        </div>
        <Button variant="hero" className="gap-2 w-full sm:w-auto" onClick={() => router.push('/vendor/cars/add')}>
            <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">{t('addNewCar')}</span>
          <span className="sm:hidden">Add Car</span>
          </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                  <div className="flex border border-border rounded-lg">
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                      className="rounded-r-none flex-1 sm:flex-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'cards' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('cards')}
                      className="rounded-none flex-1 sm:flex-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('calendar')}
                      className="rounded-l-none flex-1 sm:flex-none"
                    >
                      <CalendarDays className="h-4 w-4" />
                    </Button>
                </div>
                </div>
              </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCars.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedCars.length} car{selectedCars.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Activate
                </Button>
                <Button variant="outline" size="sm">
                  Deactivate
                  </Button>
                <Button variant="outline" size="sm">
                  Duplicate
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
              </div>
            </CardContent>
          </Card>
      )}


          {/* Cars Content */}
          {viewMode === 'table' ? (
            <CarListView 
              cars={cars}
              selectedCars={selectedCars}
              onSelectAll={handleSelectAll}
              onSelectCar={handleSelectCar}
            />
          ) : viewMode === 'cards' ? (
            <CarGridView 
              cars={cars}
              selectedCars={selectedCars}
              onSelectCar={handleSelectCar}
            />
          ) : (
            <CarCalendarView cars={cars} />
          )}

      {/* Empty State */}
      {cars.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No cars yet</h3>
            <p className="text-muted-foreground mb-6">
              {t('noCarsYet')}
            </p>
            <Button variant="hero" size="lg" className="gap-2" onClick={() => router.push('/vendor/cars/add')}>
                <Plus className="h-4 w-4" />
              {t('addNewCar')}
              </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};