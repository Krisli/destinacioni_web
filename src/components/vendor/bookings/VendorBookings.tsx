'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { useLanguage } from '@/shared/components/LanguageProvider';

export const VendorBookings = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('vendor.bookings')}</h1>
        <p className="text-muted-foreground">{t('vendor.manageBookings')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('vendor.recentBookings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('vendor.noBookings')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
