'use client'

import { useLanguage } from '@/shared/components/LanguageProvider';

export const VendorSettings = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h1 className="text-2xl font-bold text-card-foreground mb-4">
          {t('settings')}
        </h1>
        <p className="text-muted-foreground">
          {t('settingsPlaceholder')}
        </p>
      </div>
    </div>
  );
};
