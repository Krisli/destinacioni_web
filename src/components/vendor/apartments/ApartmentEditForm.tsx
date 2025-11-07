'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Home, Save, Wifi, Car, Coffee, Utensils } from 'lucide-react';
import Link from 'next/link';

interface EditApartmentFormProps {
  apartmentId: string;
}

export const ApartmentEditForm = ({ apartmentId }: EditApartmentFormProps) => {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [apartment, setApartment] = useState<any>(null);

  useEffect(() => {
    // TODO: Fetch apartment data by ID
    console.log('Fetching apartment data for ID:', apartmentId);
    // Mock data for now
    setApartment({
      id: apartmentId,
      title: 'Modern Apartment in Tirana Center',
      address: 'Rruga Myslym Shyri, Tirana',
      bedrooms: 2,
      bathrooms: 1,
      guests: 4,
      size: 75,
      nightlyRate: 65,
      cleaningFee: 25,
      securityDeposit: 200,
      propertyType: 'apartment',
      amenities: ['wifi', 'parking', 'kitchen', 'ac'],
      checkInInstructions: 'Meet at the main entrance at 3 PM. I\'ll provide the key.',
      nearbyAttractions: '5 min walk to Skanderbeg Square, 10 min to Blloku district.',
      description: 'Beautiful modern apartment in the heart of Tirana with all amenities.'
    });
  }, [apartmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement apartment update logic
    console.log('Updating apartment...', apartmentId);
    
    setTimeout(() => {
      setLoading(false);
      // Redirect to apartments list
    }, 2000);
  };

  if (!apartment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/apartments">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Apartments
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Apartment</h1>
          <p className="text-muted-foreground">
            Update your apartment rental listing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Essential details about your apartment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input id="title" defaultValue={apartment.title} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue={apartment.address} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" type="number" defaultValue={apartment.bedrooms} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input id="bathrooms" type="number" defaultValue={apartment.bathrooms} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guests">Max Guests</Label>
                  <Input id="guests" type="number" defaultValue={apartment.guests} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size (m²)</Label>
                  <Input id="size" type="number" defaultValue={apartment.size} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Availability</CardTitle>
              <CardDescription>
                Set your rental rates and availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nightlyRate">Nightly Rate (€)</Label>
                  <Input id="nightlyRate" type="number" defaultValue={apartment.nightlyRate} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cleaningFee">Cleaning Fee (€)</Label>
                  <Input id="cleaningFee" type="number" defaultValue={apartment.cleaningFee} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit (€)</Label>
                <Input id="securityDeposit" type="number" defaultValue={apartment.securityDeposit} />
              </div>
            </CardContent>
          </Card>

          {/* Property Type & Features */}
          <Card>
            <CardHeader>
              <CardTitle>Property Type & Features</CardTitle>
              <CardDescription>
                Select property type and available amenities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select defaultValue={apartment.propertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="wifi" defaultChecked={apartment.amenities.includes('wifi')} />
                    <Label htmlFor="wifi" className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      WiFi
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="parking" defaultChecked={apartment.amenities.includes('parking')} />
                    <Label htmlFor="parking" className="flex items-center gap-1">
                      <Car className="h-3 w-3" />
                      Parking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="kitchen" defaultChecked={apartment.amenities.includes('kitchen')} />
                    <Label htmlFor="kitchen" className="flex items-center gap-1">
                      <Utensils className="h-3 w-3" />
                      Kitchen
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="coffee" />
                    <Label htmlFor="coffee" className="flex items-center gap-1">
                      <Coffee className="h-3 w-3" />
                      Coffee Machine
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ac" defaultChecked={apartment.amenities.includes('ac')} />
                    <Label htmlFor="ac">Air Conditioning</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="heating" />
                    <Label htmlFor="heating">Heating</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="balcony" />
                    <Label htmlFor="balcony">Balcony</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="elevator" />
                    <Label htmlFor="elevator">Elevator</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Access */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Access</CardTitle>
              <CardDescription>
                Location details and access information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="checkInInstructions">Check-in Instructions</Label>
                <Textarea
                  id="checkInInstructions"
                  defaultValue={apartment.checkInInstructions}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nearbyAttractions">Nearby Attractions</Label>
                <Textarea
                  id="nearbyAttractions"
                  defaultValue={apartment.nearbyAttractions}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>
                Tell potential guests about your apartment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={apartment.description}
                placeholder="Describe your apartment, its location, nearby attractions, and what makes it special for guests..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/vendor/apartments">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
