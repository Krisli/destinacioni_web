'use client'

import { useLanguage } from '@/shared/components/LanguageProvider';

interface CarDetailsSidebarProps {
  carId: string;
  searchParams: {
    book?: string;
  };
}

export const CarDetailsSidebar = ({ carId, searchParams }: CarDetailsSidebarProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-2xl shadow-card p-6">
      <h2 className="text-xl font-semibold text-card-foreground mb-4">
        {t('bookThisCar')}
      </h2>
      <p className="text-muted-foreground mb-4">
        {t('bookingSidebarPlaceholder')} - {carId}
      </p>
      <div className="space-y-4">
        <div className="text-2xl font-bold text-primary">
          €89 {t('perDay')}
        </div>
        <button className="w-full bg-primary hover:bg-primary-hover text-white py-3 px-6 rounded-lg font-semibold transition-smooth">
          {t('bookNow')}
        </button>
      </div>
    </div>
  );
};
