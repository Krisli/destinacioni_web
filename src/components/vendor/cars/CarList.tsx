import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Grid, 
  List, 
  Search, 
  Car,
  Plus,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/shared/components/card";
import { useLanguage } from "@/shared/components/LanguageProvider";
import { CarListView } from "./CarListView";
import { CarGridView } from "./CarGridView";
import { CarCalendarView } from "./CarCalendarView";
import { getCars, CarResponse } from "@/lib/api/cars";

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
  id: string; // Changed from number to string to match API
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
  bookings: Booking[]; // Array of bookings for this car (not in API yet)
}

export const CarList = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'calendar'>('table');
  const [selectedCars, setSelectedCars] = useState<string[]>([]); // Changed from number[] to string[]
  const [searchTerm, setSearchTerm] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const carResponses = await getCars();
        
        // Map API response to component's Car interface
        const mappedCars: Car[] = carResponses.map((carResponse: CarResponse) => ({
          id: carResponse.id,
          photo: "", // Photo not in API response yet
          make: carResponse.makeName,
          model: carResponse.model,
          year: carResponse.year,
          transmission: carResponse.transmission,
          fuel: carResponse.fuelType,
          seats: carResponse.seats,
          price: 0, // Price not in API response yet
          status: 'active' as const, // Default to active since not in API
          lastUpdate: "", // Last update not in API response yet
          bookings: [], // Bookings not in API response yet
        }));
        
        setCars(mappedCars);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError(err instanceof Error ? err.message : 'Failed to load cars. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);


  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCars(cars.map(car => car.id));
    } else {
      setSelectedCars([]);
    }
  };

  const handleSelectCar = (carId: string, checked: boolean) => {
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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('vendor.cars')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t('vendor.manageListings')}</p>
        </div>
        <Button variant="hero" className="gap-2 w-full sm:w-auto" onClick={() => router.push('/vendor/cars/add')}>
            <Plus className="h-4 w-4" />
          <span>{t('vendor.addCar')}</span>
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
                  placeholder={t('vendor.searchCars')}
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
                    <SelectValue placeholder={t('vendor.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('vendor.status')}</SelectItem>
                    <SelectItem value="active">{t('vendor.active')}</SelectItem>
                    <SelectItem value="draft">{t('vendor.draft')}</SelectItem>
                    <SelectItem value="inactive">{t('vendor.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder={t('transmission')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allTypes')}</SelectItem>
                    <SelectItem value="manual">{t('manual')}</SelectItem>
                    <SelectItem value="automatic">{t('automatic')}</SelectItem>
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

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('vendor.loadingCars')}</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-destructive">
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2 text-destructive">{t('vendor.errorLoadingCars')}</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              {t('previous')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && cars.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('vendor.noCarsFound')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('vendor.noCarsFound')}
            </p>
            <Button variant="hero" size="lg" className="gap-2" onClick={() => router.push('/vendor/cars/add')}>
                <Plus className="h-4 w-4" />
              {t('vendor.addCar')}
              </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};