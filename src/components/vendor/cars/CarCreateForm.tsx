'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Car, Upload } from 'lucide-react';
import Link from 'next/link';

export const CarCreateForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement car creation logic
    console.log('Creating new car...');
    
    setTimeout(() => {
      setLoading(false);
      // Redirect to cars list
    }, 2000);
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Add New Car</h1>
          <p className="text-muted-foreground">
            Create a new car rental listing
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
                  <Input id="make" placeholder="BMW" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="3 Series" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" placeholder="2023" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" placeholder="White" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input id="licensePlate" placeholder="ABC-123" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vin">VIN Number</Label>
                <Input id="vin" placeholder="1HGBH41JXMN109186" />
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
                  <Input id="dailyRate" type="number" placeholder="89" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyRate">Weekly Rate (€)</Label>
                  <Input id="weeklyRate" type="number" placeholder="500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deposit">Security Deposit (€)</Label>
                  <Input id="deposit" type="number" placeholder="500" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minRentalDays">Min Rental Days</Label>
                  <Input id="minRentalDays" type="number" placeholder="1" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <Input id="pickupLocation" placeholder="Tirana Airport" required />
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
                  <Select>
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
                  <Select>
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
                  <Input id="seats" type="number" placeholder="5" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doors">Number of Doors</Label>
                  <Input id="doors" type="number" placeholder="4" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelCapacity">Fuel Capacity (L)</Label>
                <Input id="fuelCapacity" type="number" placeholder="60" />
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
                  <Checkbox id="airConditioning" />
                  <Label htmlFor="airConditioning">Air Conditioning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="bluetooth" />
                  <Label htmlFor="bluetooth">Bluetooth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="gps" />
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

          {/* Images */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Car Images</CardTitle>
              <CardDescription>
                Upload high-quality photos of your car
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
                Tell potential renters about your car
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Car Listing'}
          </Button>
        </div>
      </form>
    </div>
  );
};
