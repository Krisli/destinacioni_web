'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Car, Upload, Save } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/shared/components/LanguageProvider';

interface EditCarFormProps {
  carId: string;
}

export const CarEditForm = ({ carId }: EditCarFormProps) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState(null);

  useEffect(() => {
    // TODO: Fetch car data by ID
    console.log('Fetching car data for ID:', carId);
    // Mock data for now
    setCar({
      id: carId,
      make: 'BMW',
      model: '3 Series',
      year: 2023,
      color: 'White',
      licensePlate: 'ABC-123',
      dailyRate: 89,
      deposit: 500,
      pickupLocation: 'Tirana Airport',
      engineType: 'petrol',
      transmission: 'automatic',
      seats: 5,
      doors: 4,
      features: ['airConditioning', 'bluetooth', 'gps'],
      description: 'Well-maintained BMW 3 Series in excellent condition.'
    });
  }, [carId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement car update logic
    console.log('Updating car...', carId);
    
    setTimeout(() => {
      setLoading(false);
      // Redirect to cars list
    }, 2000);
  };

  if (!car) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/cars">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cars
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Car</h1>
          <p className="text-muted-foreground">
            Update your car rental listing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Essential details about your car
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input id="make" defaultValue={car.make} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" defaultValue={car.model} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" defaultValue={car.year} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" defaultValue={car.color} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input id="licensePlate" defaultValue={car.licensePlate} required />
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
                  <Label htmlFor="dailyRate">Daily Rate (€)</Label>
                  <Input id="dailyRate" type="number" defaultValue={car.dailyRate} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Security Deposit (€)</Label>
                  <Input id="deposit" type="number" defaultValue={car.deposit} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <Input id="pickupLocation" defaultValue={car.pickupLocation} required />
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>
                Engine and performance details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="engineType">Engine Type</Label>
                  <Select defaultValue={car.engineType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select engine type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select defaultValue={car.transmission}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatic">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seats">Number of Seats</Label>
                  <Input id="seats" type="number" defaultValue={car.seats} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doors">Number of Doors</Label>
                  <Input id="doors" type="number" defaultValue={car.doors} required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features & Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
              <CardDescription>
                Select available features and amenities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="airConditioning" defaultChecked={car.features.includes('airConditioning')} />
                  <Label htmlFor="airConditioning">Air Conditioning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="bluetooth" defaultChecked={car.features.includes('bluetooth')} />
                  <Label htmlFor="bluetooth">Bluetooth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="gps" defaultChecked={car.features.includes('gps')} />
                  <Label htmlFor="gps">GPS Navigation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="usb" />
                  <Label htmlFor="usb">USB Ports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="parkingSensors" />
                  <Label htmlFor="parkingSensors">Parking Sensors</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cruiseControl" />
                  <Label htmlFor="cruiseControl">Cruise Control</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>
                Tell potential renters about your car
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={car.description}
                placeholder="Describe your car, its condition, special features, and any important information for renters..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/vendor/cars">
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
