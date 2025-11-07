'use client'

import { useState, useEffect } from "react";
import { Grid, List, Users, Luggage, Fuel, Settings, MapPin, Star, Map } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/shared/components/card";
import { ModernHeader } from "@/components/landing/ModernHeader";
import { FilterProvider, useFilters } from "@/contexts/EnhancedFilterContext";
import { SearchStrip } from "@/components/search/SearchStrip";
import { CategoryBar } from "@/components/filters/CategoryBar";
import { FiltersModal } from "@/components/filters/FiltersModal";
import { MapSidePanel } from "@/components/map/MapSidePanel";
import { EmptyState } from "@/components/listings/EmptyState";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/shared/components/LanguageProvider";
import { SplashLoader } from "@/components/ui/SplashLoader";
import { SkeletonGrid } from "@/components/cars/SkeletonGrid";

// Car images from Unsplash
const vwGolfImage = "https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop&crop=center";
const bmwSedanImage = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=center";
const toyotaHatchbackImage = "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop&crop=center";
const mercedesSedanImage = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=center";

type LoadingPhase = 'splash' | 'skeleton' | 'idle';

const CarListingsContent = () => {
  const { filters, dispatch } = useFilters();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMap, setShowMap] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('splash');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  // Simulate data fetching with loading phases
  useEffect(() => {
    const fetchData = async () => {
      // On first mount, show splash for 700ms
      if (isInitialLoad) {
        setLoadingPhase('splash');
        await new Promise(resolve => setTimeout(resolve, 700));
        setLoadingPhase('skeleton');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoadingPhase('idle');
        setIsInitialLoad(false);
      } else {
        // On filter changes, skip splash and show skeleton
        setLoadingPhase('skeleton');
        await new Promise(resolve => setTimeout(resolve, 600));
        setLoadingPhase('idle');
      }
    };

    fetchData();
  }, [filters, isInitialLoad]);

  // Reset to skeleton when filters change (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      setLoadingPhase('skeleton');
    }
  }, [
    isInitialLoad,
    filters.carType, 
    filters.transmission, 
    filters.fuelType, 
    filters.sortBy,
    filters.priceRange,
    filters.suppliers,
    filters.quickFilters
  ]);

  // Calculate total price based on date range
  const calculateTotalPrice = (dailyPrice: number) => {
    if (!filters.pickupDate || !filters.dropoffDate) return dailyPrice;
    
    const pickup = new Date(filters.pickupDate);
    const dropoff = new Date(filters.dropoffDate);
    const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return dailyPrice * Math.max(1, diffDays);
  };

  const getDaysCount = () => {
    if (!filters.pickupDate || !filters.dropoffDate) return 0;
    
    const pickup = new Date(filters.pickupDate);
    const dropoff = new Date(filters.dropoffDate);
    const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Mock car data - removed year from titles
  const mockCars = [
    {
      id: 1,
      make: "Volkswagen",
      model: "Golf",
      year: 2020,
      image: vwGolfImage,
      price: 45,
      location: "Tirana",
      rating: 4.8,
      reviews: 24,
      seats: 5,
      luggage: 2,
      transmission: "Manual",
      fuel: "Petrol",
      available: true,
      features: ["AC", "Bluetooth", "GPS"],
      supplier: "hertz",
      unlimitedMileage: true,
      freeCancellation: true,
      instantConfirmation: false
    },
    {
      id: 2,
      make: "BMW",
      model: "320i",
      year: 2021,
      image: bmwSedanImage,
      price: 85,
      location: "Tirana",
      rating: 4.9,
      reviews: 18,
      seats: 5,
      luggage: 3,
      transmission: "Automatic",
      fuel: "Petrol",
      available: true,
      features: ["AC", "Leather", "Navigation", "Premium Audio"],
      supplier: "avis",
      unlimitedMileage: false,
      freeCancellation: true,
      instantConfirmation: true
    },
    {
      id: 3,
      make: "Toyota",
      model: "Yaris",
      year: 2019,
      image: toyotaHatchbackImage,
      price: 35,
      location: "Durrës",
      rating: 4.6,
      reviews: 31,
      seats: 5,
      luggage: 1,
      transmission: "Manual",
      fuel: "Hybrid",
      available: false,
      features: ["AC", "Bluetooth"],
      supplier: "europcar",
      unlimitedMileage: true,
      freeCancellation: false,
      instantConfirmation: true
    },
    {
      id: 4,
      make: "Mercedes",
      model: "C-Class",
      year: 2022,
      image: mercedesSedanImage,
      price: 120,
      location: "Tirana",
      rating: 5.0,
      reviews: 12,
      seats: 5,
      luggage: 3,
      transmission: "Automatic",
      fuel: "Petrol",
      available: true,
      features: ["AC", "Leather", "Navigation", "Premium Audio", "Sunroof"],
      supplier: "sixt",
      unlimitedMileage: true,
      freeCancellation: true,
      instantConfirmation: true
    },
    {
      id: 5,
      make: "Fiat",
      model: "500",
      year: 2020,
      image: vwGolfImage,
      price: 28,
      location: "Vlorë",
      rating: 4.4,
      reviews: 19,
      seats: 4,
      luggage: 1,
      transmission: "Manual",
      fuel: "Petrol",
      available: true,
      features: ["AC", "Bluetooth"],
      supplier: "budget",
      unlimitedMileage: false,
      freeCancellation: true,
      instantConfirmation: false
    },
    {
      id: 6,
      make: "Audi",
      model: "A4",
      year: 2021,
      image: bmwSedanImage,
      price: 95,
      location: "Shkodër",
      rating: 4.7,
      reviews: 15,
      seats: 5,
      luggage: 3,
      transmission: "Automatic",
      fuel: "Diesel",
      available: true,
      features: ["AC", "Leather", "Navigation", "Premium Audio"],
      supplier: "enterprise",
      unlimitedMileage: true,
      freeCancellation: false,
      instantConfirmation: true
    }
  ];

  // Apply filters
  const filteredCars = mockCars.filter(car => {
    // Price filter
    const totalPrice = calculateTotalPrice(car.price);
    if (totalPrice < filters.priceRange[0] || totalPrice > filters.priceRange[1]) return false;
    
    // Location filter
    if (filters.location.length > 0 && !filters.location.includes(car.location)) return false;
    
    // Car type filter
    if (filters.carType !== 'all') {
      const carTypeMap: Record<string, string[]> = {
        economy: ['Toyota Yaris', 'Fiat 500'],
        compact: ['VW Golf'],
        sedan: ['BMW 320i', 'Mercedes C-Class', 'Audi A4'],
        suv: [],
        luxury: ['Mercedes C-Class']
      };
      const carFullName = `${car.make} ${car.model}`;
      if (!carTypeMap[filters.carType]?.some(type => carFullName.includes(type))) return false;
    }
    
    // Transmission filter
    if (filters.transmission !== 'all' && car.transmission.toLowerCase() !== filters.transmission) return false;
    
    // Fuel type filter
    if (filters.fuelType !== 'all' && car.fuel.toLowerCase() !== filters.fuelType) return false;
    
    // Seats filter
    if (filters.seats !== 'all' && car.seats < parseInt(filters.seats)) return false;
    
    // Features filter
    if (filters.features.length > 0 && !filters.features.every((feature: string) => car.features.includes(feature))) return false;
    
    // Supplier filter
    if (filters.suppliers.length > 0 && !filters.suppliers.includes(car.supplier)) return false;
    
    // Quick filters
    if (filters.quickFilters.unlimitedMileage && !car.unlimitedMileage) return false;
    if (filters.quickFilters.freeCancellation && !car.freeCancellation) return false;
    if (filters.quickFilters.instantConfirmation && !car.instantConfirmation) return false;
    
    return true;
  });

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return calculateTotalPrice(a.price) - calculateTotalPrice(b.price);
      case 'price-high':
        return calculateTotalPrice(b.price) - calculateTotalPrice(a.price);
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      case 'recommended':
      default:
        return b.rating - a.rating;
    }
  });

  const cars = sortedCars;
  const daysCount = getDaysCount();

  const CarCard = ({ car }: { car: typeof mockCars[0] }) => {
    const totalPrice = calculateTotalPrice(car.price);
    const hasDates = filters.pickupDate && filters.dropoffDate;
    
    return (
    <Card className="group overflow-hidden bg-card hover:shadow-lg transition-smooth">
      {/* Photo-first design - 65% of card */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image 
          src={car.image} 
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-smooth"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Price badge on image */}
        <div className="absolute top-3 left-3">
          <Badge variant="default" className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-base px-3 py-1.5 font-bold">
            {hasDates ? (
              <>€{totalPrice} {t("cars.total")} ({daysCount} days)</>
            ) : (
              <>€{car.price} / {t("cars.perDay")}</>
            )}
          </Badge>
        </div>
        {/* Availability badge on image */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant={car.available ? "default" : "destructive"} 
            className="bg-background/90 backdrop-blur-sm text-foreground"
          >
            {car.available ? t("cars.available") : t("cars.booked")}
          </Badge>
        </div>
      </div>
      
      {/* Minimal text content - 35% of card */}
      <CardContent className="p-4 space-y-2">
        {/* Title: Make + Model only (NO YEAR) */}
        <h3 className="font-bold text-lg text-card-foreground group-hover:text-primary transition-smooth">
          {car.make} {car.model}
        </h3>
        
        {/* Meta row: Location + Rating */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{car.location}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{car.rating}</span>
            <span>({car.reviews})</span>
          </div>
        </div>

        {/* Spec chips - single line, max 4 */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            <Users className="h-3 w-3 mr-1" />
            {car.seats}
          </Badge>
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            <Luggage className="h-3 w-3 mr-1" />
            {car.luggage}
          </Badge>
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            <Settings className="h-3 w-3 mr-1" />
            {car.transmission}
          </Badge>
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            <Fuel className="h-3 w-3 mr-1" />
            {car.fuel}
          </Badge>
          {car.features.length > 0 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{car.features.length}
            </Badge>
          )}
        </div>
      </CardContent>

      {/* CTA Row */}
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant={car.available ? "hero" : "secondary"} 
          className="flex-1"
          disabled={!car.available}
        >
          {car.available ? t("bookNow") : t("unavailable")}
        </Button>
        <Button variant="outline" size="sm">
          {t("learnMore")}
        </Button>
      </CardFooter>
    </Card>
    );
  };

  // Show splash loader on first load
  if (loadingPhase === 'splash') {
    return (
      <SplashLoader 
        title={t("loading.title")}
        subtitle={t("loading.subtitle")}
        visible={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />
      
      {/* Add top padding to account for fixed header */}
      <div className="pt-20">
        {/* Search Strip */}
        <SearchStrip />
        
        {/* Category Bar */}
        <CategoryBar />
        
        <div className="container mx-auto px-4 lg:px-6 py-8">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="text-sm text-muted-foreground">
              {t("cars.foundCars")} {cars.length} {t("cars.carsText")}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Filters Modal Button */}
              <FiltersModal />
              
              {/* Map Toggle */}
              <Button
                variant={showMap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                {!isMobile && t("showOnMap")}
              </Button>
              
              {/* View Toggle */}
              <div className="flex border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8"
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8"
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort */}
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => dispatch({ type: 'SET_SORT_BY', payload: value })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">{t("cars.recommended")}</SelectItem>
                  <SelectItem value="price-low">{t("cars.priceLowHigh")}</SelectItem>
                  <SelectItem value="price-high">{t("cars.priceHighLow")}</SelectItem>
                  <SelectItem value="rating">{t("cars.highestRated")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Car Grid, Skeleton or Empty State */}
          {loadingPhase === 'skeleton' ? (
            <SkeletonGrid count={9} />
          ) : cars.length === 0 ? (
            <div className="py-12">
              <EmptyState />
            </div>
          ) : (
            <div 
              className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} transition-opacity duration-300`}
              style={{ opacity: loadingPhase === 'idle' ? 1 : 0 }}
            >
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {cars.length > 0 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <Button variant="outline" size="sm">
                {t("previous")}
              </Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">
                {t("next")}
              </Button>
            </div>
          )}
        </div>
        
        {/* Map Side Panel */}
        <MapSidePanel isOpen={showMap} onClose={() => setShowMap(false)} />
      </div>
    </div>
  );
};

const CarListings = () => {
  return (
    <FilterProvider>
      <CarListingsContent />
    </FilterProvider>
  );
};

export default CarListings;
