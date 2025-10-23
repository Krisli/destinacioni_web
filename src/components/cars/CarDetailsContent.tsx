'use client'

import { useLanguage } from '@/shared/components/LanguageProvider';

interface CarDetailsContentProps {
  carId: string;
}

export const CarDetailsContent = ({ carId }: CarDetailsContentProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-4">
          {t('carDetails')} - {carId}
        </h2>
        <p className="text-muted-foreground">
          {t('carDetailsContentPlaceholder')}
        </p>
      </div>
    </div>
  );
};
