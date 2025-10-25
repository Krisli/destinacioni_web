'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Home, Upload, Wifi, Car, Coffee, Utensils } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/shared/components/LanguageProvider';

export const ApartmentCreateForm = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement apartment creation logic
    console.log('Creating new apartment...');
    
    setTimeout(() => {
      setLoading(false);
      // Redirect to apartments list
    }, 2000);
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Add New Apartment</h1>
          <p className="text-muted-foreground">
            Create a new apartment rental listing
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
                <Input id="title" placeholder="Modern Apartment in Tirana Center" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Rruga Myslym Shyri, Tirana" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" type="number" placeholder="2" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input id="bathrooms" type="number" placeholder="1" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guests">Max Guests</Label>
                  <Input id="guests" type="number" placeholder="4" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size (m²)</Label>
                  <Input id="size" type="number" placeholder="75" />
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
                  <Input id="nightlyRate" type="number" placeholder="65" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyRate">Weekly Rate (€)</Label>
                  <Input id="weeklyRate" type="number" placeholder="400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cleaningFee">Cleaning Fee (€)</Label>
                  <Input id="cleaningFee" type="number" placeholder="25" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="securityDeposit">Security Deposit (€)</Label>
                  <Input id="securityDeposit" type="number" placeholder="200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minNights">Min Nights</Label>
                  <Input id="minNights" type="number" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxNights">Max Nights</Label>
                  <Input id="maxNights" type="number" placeholder="30" />
                </div>
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
                <Select>
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
                    <Checkbox id="wifi" />
                    <Label htmlFor="wifi" className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      WiFi
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="parking" />
                    <Label htmlFor="parking" className="flex items-center gap-1">
                      <Car className="h-3 w-3" />
                      Parking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="kitchen" />
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
                    <Checkbox id="ac" />
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
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <Input id="neighborhood" placeholder="Blloku, Tirana" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkInInstructions">Check-in Instructions</Label>
                <Textarea
                  id="checkInInstructions"
                  placeholder="Meet at the main entrance at 3 PM. I'll provide the key..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nearbyAttractions">Nearby Attractions</Label>
                <Textarea
                  id="nearbyAttractions"
                  placeholder="5 min walk to Skanderbeg Square, 10 min to Blloku district..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
              <CardDescription>
                Upload high-quality photos of your apartment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop images here, or click to browse
                </p>
                <Button variant="outline" size="sm">
                  Choose Images
                </Button>
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Apartment Listing'}
          </Button>
        </div>
      </form>
    </div>
  );
};
