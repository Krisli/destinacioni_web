'use client'

import { useState } from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/shared/components/LanguageProvider';

export const SearchStrip = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 lg:px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Location */}
          <div className="flex-1">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('enterLocation')}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Pickup Date */}
          <div className="lg:w-48">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                className="pl-10"
                placeholder={t('pickupDate')}
              />
            </div>
          </div>

          {/* Dropoff Date */}
          <div className="lg:w-48">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                className="pl-10"
                placeholder={t('dropoffDate')}
              />
            </div>
          </div>

          {/* Search Button */}
          <Button className="bg-primary hover:bg-primary-hover">
            <Search className="h-4 w-4 mr-2" />
            {t('searchButton')}
          </Button>
        </div>
      </div>
    </div>
  );
};
