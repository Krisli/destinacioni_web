'use client'

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFilters } from '@/contexts/EnhancedFilterContext';
import { useLanguage } from '@/shared/components/LanguageProvider';

export const FiltersModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, dispatch, getActiveFilterCount } = useFilters();
  const { t } = useLanguage();

  const activeFilterCount = getActiveFilterCount();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        {t('filters')}
        {activeFilterCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{t('filters')}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3">{t('maxPricePerDay')}</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.priceRange[1]}
                    onChange={(e) => dispatch({
                      type: 'SET_PRICE_RANGE',
                      payload: [filters.priceRange[0], parseInt(e.target.value)]
                    })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>€{filters.priceRange[0]}</span>
                    <span>€{filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h3 className="font-medium mb-3">{t('quickFilters')}</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.quickFilters.freeCancellation}
                      onChange={(e) => dispatch({
                        type: 'SET_QUICK_FILTER',
                        payload: { key: 'freeCancellation', value: e.target.checked }
                      })}
                    />
                    <span className="text-sm">{t('freeCancellation')}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.quickFilters.unlimitedMileage}
                      onChange={(e) => dispatch({
                        type: 'SET_QUICK_FILTER',
                        payload: { key: 'unlimitedMileage', value: e.target.checked }
                      })}
                    />
                    <span className="text-sm">{t('unlimitedMileage')}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.quickFilters.instantConfirmation}
                      onChange={(e) => dispatch({
                        type: 'SET_QUICK_FILTER',
                        payload: { key: 'instantConfirmation', value: e.target.checked }
                      })}
                    />
                    <span className="text-sm">{t('instantConfirmation')}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t">
              <Button
                variant="outline"
                onClick={() => dispatch({ type: 'RESET_FILTERS' })}
              >
                {t('clearAll')}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-primary hover:bg-primary-hover"
              >
                {t('applyFilters')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
