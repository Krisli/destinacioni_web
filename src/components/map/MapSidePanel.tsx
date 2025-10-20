'use client'

import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/shared/components/LanguageProvider';

interface MapSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MapSidePanel = ({ isOpen, onClose }: MapSidePanelProps) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="flex-1 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="w-full max-w-md bg-white shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('showOnMap')}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p>{t('mapPlaceholder')}</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('mapDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
