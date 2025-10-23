'use client'

import { useLanguage } from '@/shared/components/LanguageProvider';

interface CarDetailsHeaderProps {
  carId: string;
}

export const CarDetailsHeader = ({ carId }: CarDetailsHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-hero py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {t('carDetails')} - {carId}
          </h1>
          <p className="text-white/90 text-lg">
            {t('detailedCarInformation')}
          </p>
        </div>
      </div>
    </div>
  );
};
