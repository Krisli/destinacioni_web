'use client'

import { Car, Home, Plane, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/shared/components/LanguageProvider';

export const CategoryBar = () => {
  const { t } = useLanguage();

  const categories = [
    { id: 'cars', label: t('carsTitle'), icon: Car, active: true },
    { id: 'apartments', label: t('apartments'), icon: Home, active: false },
    { id: 'flights', label: 'Flights', icon: Plane, active: false },
    { id: 'destinations', label: t('popularDestinations'), icon: MapPin, active: false },
  ];

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center space-x-1 py-3 overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={category.active ? 'default' : 'ghost'}
                size="sm"
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  category.active 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{category.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
