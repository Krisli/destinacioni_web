'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';

export const VendorBookings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground">Manage your vehicle bookings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bookings yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
