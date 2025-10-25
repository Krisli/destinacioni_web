'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/card';
import { Button } from '@/components/ui/button';
import { Plus, Home, Edit, Trash2, Eye, MapPin, Users, Bed } from 'lucide-react';
import { useLanguage } from '@/shared/components/LanguageProvider';
import Link from 'next/link';

export const ApartmentList = () => {
  const { t } = useLanguage();

  // Mock data - replace with real data from API
  const apartments = [
    {
      id: '1',
      title: 'Modern Apartment in Tirana Center',
      location: 'Tirana, Albania',
      bedrooms: 2,
      bathrooms: 1,
      guests: 4,
      price: 65,
      status: 'active',
      image: '/images/apartments/tirana-apartment.jpg',
      bookings: 8,
      revenue: 520
    },
    {
      id: '2',
      title: 'Cozy Studio near Airport',
      location: 'Rinas, Albania',
      bedrooms: 1,
      bathrooms: 1,
      guests: 2,
      price: 45,
      status: 'active',
      image: '/images/apartments/studio-airport.jpg',
      bookings: 12,
      revenue: 540
    },
    {
      id: '3',
      title: 'Luxury Villa with Pool',
      location: 'Vlorë, Albania',
      bedrooms: 4,
      bathrooms: 3,
      guests: 8,
      price: 150,
      status: 'maintenance',
      image: '/images/apartments/villa-vlore.jpg',
      bookings: 3,
      revenue: 450
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Apartments</h1>
          <p className="text-muted-foreground">
            Manage your apartment rental listings
          </p>
        </div>
        <Link href="/vendor/apartments/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Apartment
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {apartments.map((apartment) => (
          <Card key={apartment.id} className="overflow-hidden">
            <div className="aspect-video bg-muted">
              <img
                src={apartment.image}
                alt={apartment.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg line-clamp-2">{apartment.title}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {apartment.location}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  apartment.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {apartment.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4 text-muted-foreground" />
                      <span>{apartment.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{apartment.guests} guests</span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold">€{apartment.price}/night</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Bookings</p>
                    <p className="font-semibold">{apartment.bookings}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-semibold">€{apartment.revenue}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/vendor/apartments/${apartment.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {apartments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>No apartments yet</CardTitle>
            <CardDescription className="mb-4">
              Start by adding your first apartment listing
            </CardDescription>
            <Link href="/vendor/apartments/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Apartment
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
