'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';

export const VendorCalendar = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground">View your booking calendar</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Calendar component will be implemented here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
