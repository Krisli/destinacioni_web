'use client'

import { useState } from 'react';
import { Search, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/shared/components/LanguageProvider';
import { useFilters } from '@/contexts/EnhancedFilterContext';
import { DateRangeModal } from './DateRangeModal';
import { cn } from '@/lib/utils';

// Available locations
const locations = [
  { value: 'tirana', label: 'Tirana', labelAL: 'Tiranë' },
  { value: 'rinas-airport', label: 'Rinas Airport', labelAL: 'Aeroporti Rinas' },
  { value: 'durres', label: 'Durrës', labelAL: 'Durrës' },
  { value: 'vlore', label: 'Vlorë', labelAL: 'Vlorë' },
  { value: 'sarande', label: 'Sarandë', labelAL: 'Sarandë' },
  { value: 'shkoder', label: 'Shkodër', labelAL: 'Shkodër' },
];

export const SearchStrip = () => {
  const { t, language } = useLanguage();
  const { filters, dispatch } = useFilters();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // Format dates for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate days
  const calculateDays = (): number => {
    if (!filters.pickupDate || !filters.dropoffDate) return 0;
    const pickup = new Date(filters.pickupDate);
    const dropoff = new Date(filters.dropoffDate);
    const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const days = calculateDays();
  const hasDates = filters.pickupDate && filters.dropoffDate;
  
  // Format date display text
  const getDateDisplayText = (): string => {
    if (!hasDates) return t('rentalDates') || 'Rental dates';
    const startDate = formatDate(filters.pickupDate);
    const endDate = formatDate(filters.dropoffDate);
    return `${startDate} — ${endDate}`;
  };

  const dateDisplayText = getDateDisplayText();
  const daysText = days > 0 ? `${days} ${days === 1 ? t('day') : t('days')}` : '';

  // Get location label
  const getLocationLabel = (value: string) => {
    const location = locations.find(loc => loc.value === value);
    if (!location) return '';
    return language === 'al' ? location.labelAL : location.label;
  };

  const pickupLocationLabel = filters.pickupLocation 
    ? getLocationLabel(filters.pickupLocation) 
    : t('pickup') || 'Pick-up';
  
  const dropoffLocationLabel = filters.dropoffLocation === 'same'
    ? (t('samePlace') || 'Same place')
    : filters.dropoffLocation
    ? getLocationLabel(filters.dropoffLocation)
    : (t('dropoff') || 'Drop-off');

  // Handle dropoff location change
  const handleDropoffChange = (value: string) => {
    dispatch({ type: 'SET_DROPOFF_LOCATION', payload: value });
  };

  // Handle pickup location change
  const handlePickupChange = (value: string) => {
    dispatch({ type: 'SET_PICKUP_LOCATION', payload: value });
    // If dropoff is "same", update it to match pickup
    if (filters.dropoffLocation === 'same') {
      // Keep it as "same" - it will automatically use pickup location
    }
  };

  return (
    <>
      {/* Green bar container */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-0">
            {/* Pick-up Location */}
            <div className="flex-1">
              <div className="bg-white rounded-lg p-3 h-full">
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t('pickup') || 'Pick-up'}
                </label>
                <Select 
                  value={filters.pickupLocation || ''} 
                  onValueChange={handlePickupChange}
                >
                  <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 shadow-none w-full">
                    <SelectValue placeholder={t('pickup') || 'Pick-up'}>
                      {pickupLocationLabel}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {language === 'al' ? location.labelAL : location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-white/20 mx-1 self-stretch" />

            {/* Drop-off Location */}
            <div className="flex-1">
              <div className="bg-white rounded-lg p-3 h-full">
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t('dropoff') || 'Drop-off'}
                </label>
                <Select 
                  value={filters.dropoffLocation || 'same'} 
                  onValueChange={handleDropoffChange}
                >
                  <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 shadow-none w-full">
                    <SelectValue>
                      {dropoffLocationLabel}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="same">
                      {t('samePlace') || 'Same place'}
                    </SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {language === 'al' ? location.labelAL : location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-white/20 mx-1 self-stretch" />

            {/* Rental Dates */}
            <div className="flex-1 lg:flex-none lg:min-w-[320px]">
              <div className="bg-white rounded-lg p-3 h-full">
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t('rentalDates') || 'Rental dates'}
                </label>
                <Button
                  variant="ghost"
                  onClick={() => setIsDateModalOpen(true)}
                  className="w-full justify-between p-0 h-auto hover:bg-transparent"
                >
                  <div className="flex flex-col items-start">
                    <span className={cn(
                      "text-sm font-medium",
                      hasDates ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {dateDisplayText}
                    </span>
                    {daysText && (
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {daysText}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                </Button>
              </div>
            </div>

            {/* Search Button */}
            <div className="lg:ml-4 mt-2 lg:mt-0">
              <Button 
                className="bg-white hover:bg-white/90 text-primary w-full lg:w-auto h-12 px-8 font-semibold"
                onClick={() => {
                  // Trigger search - you can add search logic here
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                {t('searchButton') || 'SEARCH'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Modal */}
      <DateRangeModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onApply={() => {
          // Dates are already applied in the modal
        }}
      />
    </>
  );
};
