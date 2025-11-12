'use client'

import { Car, Truck, Crown, Wind } from 'lucide-react';
import { useLanguage } from '@/shared/components/LanguageProvider';
import { cn } from '@/lib/utils';

export const CategoryBar = () => {
  const { t } = useLanguage();

  const categories = [
    { id: 'economy', label: t('economy') + ' class', icon: Car, count: 348 },
    { id: 'standard', label: t('standard'), icon: Car, count: 335 },
    { id: 'suv', label: t('suv'), icon: Truck, count: 184 },
    { id: 'luxury', label: t('luxury'), icon: Crown, count: 34 },
    { id: 'convertibles', label: t('convertibles'), icon: Wind, count: 5 },
    { id: 'van', label: t('vanMinivan'), icon: Truck, count: 86 },
  ];

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center space-x-3 py-4 overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className={cn(
                  "flex-shrink-0 relative bg-muted rounded-lg p-2 min-w-[140px] cursor-pointer hover:bg-muted/80 transition-colors",
                  "flex flex-col items-center justify-center gap-2"
                )}
              >
                <Icon className="h-8 w-8 text-foreground" />
                <span className="text-sm font-medium text-foreground text-center">
                  {category.label}
                </span>
                <span className="absolute bottom-2 right-2 bg-background text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
