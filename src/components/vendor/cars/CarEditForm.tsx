'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Car, Save } from 'lucide-react';
import { useLanguage } from '@/shared/components/LanguageProvider';
import { getCarById, updateCar, getCarMakes, CarResponse, CarMake, CreateCarRequest } from '@/lib/api/cars';

interface EditCarFormProps {
  carId: string;
}

export const CarEditForm = ({ carId }: EditCarFormProps) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carMakes, setCarMakes] = useState<CarMake[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(true);
  
  const [formData, setFormData] = useState<CreateCarRequest>({
    makeId: '',
    model: '',
    year: 0,
    bodyType: '',
    transmission: '',
    fuelType: '',
    drive: '',
    seats: 0,
    doors: 0,
    luggage: 0,
    color: '',
    licensePlate: '',
    vin: '',
  });

  // Fetch car data and car makes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        setError(null);
        
        // Fetch car makes
        const makes = await getCarMakes();
        setCarMakes(makes);
        setLoadingMakes(false);
        
        // Fetch car data
        const car = await getCarById(carId);
        
        // Map API response to form data
        setFormData({
          makeId: car.makeId,
          model: car.model,
          year: car.year,
          bodyType: car.bodyType || '',
          transmission: car.transmission,
          fuelType: car.fuelType,
          drive: car.drive || '',
          seats: car.seats,
          doors: car.doors,
          luggage: car.luggage,
          color: car.color || '',
          licensePlate: car.licensePlate || '',
          vin: car.vin || '',
        });
      } catch (err) {
        console.error('Error fetching car data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load car data. Please try again.');
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [carId]);

  const updateField = (field: keyof CreateCarRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.makeId || !formData.model || !formData.year || !formData.transmission || !formData.fuelType) {
        alert('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      await updateCar(carId, formData);
      
      // Redirect to cars list on success
      router.push('/vendor/cars');
    } catch (err) {
      console.error('Error updating car:', err);
      setError(err instanceof Error ? err.message : 'Failed to update car. Please try again.');
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !formData.makeId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => router.push('/vendor/cars')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Cars
          </Button>
        </div>
        <Card className="border-destructive">
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2 text-destructive">Error loading car</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => router.push('/vendor/cars')}>
              Back to Cars
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => router.push('/vendor/cars')}>
          <ArrowLeft className="h-4 w-4" />
          Back to Cars
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Car</h1>
          <p className="text-muted-foreground">
            Update your car rental listing
          </p>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="makeId">Car Make *</Label>
                <Select 
                  value={formData.makeId} 
                  onValueChange={(value) => updateField('makeId', value)}
                  disabled={loadingMakes}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingMakes ? "Loading makes..." : "Select make"} />
                  </SelectTrigger>
                  <SelectContent>
                    {carMakes.map((make) => (
                      <SelectItem key={make.id} value={make.id}>
                        {make.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input 
                  id="model"
                  value={formData.model}
                  onChange={(e) => updateField('model', e.target.value)}
                  placeholder="e.g., Golf, 320i, C-Class"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Select value={formData.year.toString()} onValueChange={(value) => updateField('year', parseInt(value, 10))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bodyType">Body Type</Label>
                <Select value={formData.bodyType} onValueChange={(value) => updateField('bodyType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="coupe">Coupe</SelectItem>
                    <SelectItem value="convertible">Convertible</SelectItem>
                    <SelectItem value="wagon">Wagon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission *</Label>
                <Select value={formData.transmission} onValueChange={(value) => updateField('transmission', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type *</Label>
                <Select value={formData.fuelType} onValueChange={(value) => updateField('fuelType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="lpg">LPG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="drive">Drive Type</Label>
                <Select value={formData.drive} onValueChange={(value) => updateField('drive', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select drive" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FrontWheel">Front Wheel Drive</SelectItem>
                    <SelectItem value="RearWheel">Rear Wheel Drive</SelectItem>
                    <SelectItem value="4x4">Four Wheel Drive (4x4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seats">Seats *</Label>
                <Select value={formData.seats.toString()} onValueChange={(value) => updateField('seats', parseInt(value, 10))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 seats</SelectItem>
                    <SelectItem value="4">4 seats</SelectItem>
                    <SelectItem value="5">5 seats</SelectItem>
                    <SelectItem value="7">7 seats</SelectItem>
                    <SelectItem value="8">8+ seats</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doors">Doors</Label>
                <Select value={formData.doors.toString()} onValueChange={(value) => updateField('doors', parseInt(value, 10))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Doors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 doors</SelectItem>
                    <SelectItem value="4">4 doors</SelectItem>
                    <SelectItem value="5">5 doors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="luggage">Luggage *</Label>
                <Select value={formData.luggage.toString()} onValueChange={(value) => updateField('luggage', parseInt(value, 10))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Small (1-2 bags)</SelectItem>
                    <SelectItem value="2">Medium (3-4 bags)</SelectItem>
                    <SelectItem value="3">Large (5+ bags)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input 
                  id="color"
                  value={formData.color}
                  onChange={(e) => updateField('color', e.target.value)}
                  placeholder="e.g., Black, White, Silver"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input 
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => updateField('licensePlate', e.target.value)}
                  placeholder="TR 123 ABC"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vin">VIN Number (Optional)</Label>
              <Input 
                id="vin"
                value={formData.vin}
                onChange={(e) => updateField('vin', e.target.value)}
                placeholder="Vehicle Identification Number"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/vendor/cars')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
