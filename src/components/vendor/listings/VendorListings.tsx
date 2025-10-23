'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export const VendorListings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Car Listings</h1>
          <p className="text-muted-foreground">Manage your vehicle listings</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Listing
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No listings yet. Add your first vehicle to get started.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
