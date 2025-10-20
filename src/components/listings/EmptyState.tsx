'use client'

import { Car, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFilters } from '@/contexts/EnhancedFilterContext';
import { useLanguage } from '@/shared/components/LanguageProvider';

export const EmptyState = () => {
  const { dispatch } = useFilters();
  const { t } = useLanguage();

  const handleClearFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Car className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-foreground mb-3">
          {t('noCarsFound')}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {t('tryAdjustingFilters')}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {t('clearFilters')}
          </Button>
          
          <Button
            variant="default"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {t('adjustFilters')}
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">
            {t('searchTips')}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 text-left">
            <li>• {t('tip1')}</li>
            <li>• {t('tip2')}</li>
            <li>• {t('tip3')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
