'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';

export const VendorAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">View your performance metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Analytics charts will be implemented here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
