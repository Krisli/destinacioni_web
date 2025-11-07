import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Upload, 
  X, 
  Check, 
  Car, 
  Camera, 
  Euro, 
  Calendar as CalendarIcon,
  MapPin,
  GripVertical,
  Image,
  Star,
  DollarSign,
  Shield,
  AlertCircle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableCarMakeSelect } from "./SearchableCarMakeSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { AirbnbDatePicker } from "@/components/ui/airbnb-date-picker";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/shared/components/LanguageProvider";
import { cn } from "@/lib/utils";
// import { toast } from "@/hooks/use-toast";

interface SeasonalPrice {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  price: number;
  type: 'peak' | 'off' | 'standard';
}

interface FormData {
  // Step 1
  make: string;
  makeId: string;              // UUID for the car make (required by backend)
  model: string;
  year: string;
  bodyType: string;
  transmission: string;
  fuel: string;
  drive: string;              // Drive type (FWD, RWD, AWD, 4WD)
  seats: string;
  doors: string;
  luggage: string;
  color: string;
  plate: string;
  vin: string;
  
  // Step 2
  photos: File[];
  coverPhotoIndex: number;
  
  // Step 3
  basePrice: string;
  weeklyDiscount: string;
  monthlyDiscount: string;
  extraDriverFee: string;
  airportDeliveryFee: string;
  childSeatFee: string;
  depositRequired: boolean;
  depositAmount: string;
  fuelPolicy: string;
  mileageLimit: string;
  overageFee: string;
  cancellationPolicy: string;
  // Seasonal pricing
  seasonalPricingEnabled: boolean;
  seasonalPrices: SeasonalPrice[];
  
  // Step 4
  blockedDates: Date[];
  specialPrices: { date: Date; price: number }[];
  alwaysAvailable: boolean;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
}

// Props interfaces for step components
interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{ id: number; title: string; icon: any }>;
}

interface Step1BasicsProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
  carMakes: Array<{ id: string; name: string }>;
  loadingMakes: boolean;
  handleMakeChange: (makeId: string) => void;
}

interface Step2PhotosProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
}

interface Step3PricingProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

interface Step4AvailabilityProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
  t: (key: string) => string;
}

// Top-level step components
const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  const progress = (currentStep / 4) * 100;
  
  return (
    <div className="space-y-4 mb-8">
      <Progress value={progress} className="w-full max-w-md mx-auto" />
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-smooth",
              currentStep >= step.id 
                ? "bg-primary border-primary text-primary-foreground" 
                : currentStep === step.id
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground"
            )}>
              {currentStep > step.id ? (
                <Check className="h-4 w-4" />
              ) : (
                <step.icon className="h-4 w-4" />
              )}
            </div>
            <div className="ml-2 mr-6 hidden sm:block">
              <div className={cn(
                "text-xs font-medium",
                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
              )}>
                Step {step.id}
              </div>
              <div className="text-xs text-muted-foreground">{step.title}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-12 h-px mx-2 transition-smooth hidden sm:block",
                currentStep > step.id ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Step1Basics = ({ formData, updateField, carMakes, loadingMakes, handleMakeChange }: Step1BasicsProps) => (
  <Card className="max-w-4xl mx-auto">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Car className="h-5 w-5" />
        Basic Car Information
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        Enter the basic details about your vehicle
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="make">Car Make *</Label>
          <SearchableCarMakeSelect
            carMakes={carMakes}
            value={formData.makeId}
            onValueChange={handleMakeChange}
            disabled={loadingMakes}
            placeholder={loadingMakes ? "Loading makes..." : "Select make"}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input 
            id="model"
            value={formData.model}
            onChange={(e) => updateField('model', e.target.value)}
            placeholder="e.g., Golf, 320i, C-Class"
          />
          <p className="text-xs text-muted-foreground">Enter the exact model name</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Select value={formData.year} onValueChange={(value) => updateField('year', value)}>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="fuel">Fuel Type *</Label>
          <Select value={formData.fuel} onValueChange={(value) => updateField('fuel', value)}>
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
          <Select value={formData.seats} onValueChange={(value) => updateField('seats', value)}>
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
          <Select value={formData.doors} onValueChange={(value) => updateField('doors', value)}>
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
          <Select value={formData.luggage} onValueChange={(value) => updateField('luggage', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (1-2 bags)</SelectItem>
              <SelectItem value="medium">Medium (3-4 bags)</SelectItem>
              <SelectItem value="large">Large (5+ bags)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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
          <Label htmlFor="plate">License Plate</Label>
          <Input 
            id="plate"
            value={formData.plate}
            onChange={(e) => updateField('plate', e.target.value)}
            placeholder="TR 123 ABC"
          />
          <p className="text-xs text-muted-foreground">Private information, not shown to customers</p>
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
        <p className="text-xs text-muted-foreground">For insurance and verification purposes</p>
      </div>
    </CardContent>
  </Card>
);

const Step2Photos = ({ formData, updateField }: Step2PhotosProps) => (
  <Card className="max-w-4xl mx-auto">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Camera className="h-5 w-5" />
        Upload Photos
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        Add high-quality photos of your car (minimum 3 photos required)
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          High-quality photos increase booking rates by up to 40%. Include exterior, interior, and engine photos.
        </AlertDescription>
      </Alert>
      
      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-smooth">
        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">Drag & drop photos here</h3>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse files (JPEG, PNG up to 10MB each)
        </p>
        <Button variant="outline" type="button">Browse Files</Button>
      </div>

      {/* Photo grid placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">Photo {index}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Photo Tips:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Take photos in good lighting (natural daylight preferred)</li>
          <li>• Clean your car before photographing</li>
          <li>• Include exterior from all angles, interior, dashboard, and trunk</li>
          <li>• Avoid blurry or dark photos</li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

const Step3Pricing = ({ formData, updateField, selectedDate, setSelectedDate }: Step3PricingProps) => {
  const addSeasonalPrice = () => {
    const newSeason: SeasonalPrice = {
      id: Date.now().toString(),
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      type: 'standard'
    };
    updateField('seasonalPrices', [...formData.seasonalPrices, newSeason]);
  };

  const updateSeasonalPrice = (id: string, field: keyof SeasonalPrice, value: any) => {
    const updatedPrices = formData.seasonalPrices.map(price => 
      price.id === id ? { ...price, [field]: value } : price
    );
    updateField('seasonalPrices', updatedPrices);
  };

  const removeSeasonalPrice = (id: string) => {
    const filteredPrices = formData.seasonalPrices.filter(price => price.id !== id);
    updateField('seasonalPrices', filteredPrices);
  };

  const getPriceForDate = (date: Date): number => {
    if (!formData.seasonalPricingEnabled) return parseFloat(formData.basePrice) || 0;
    
    const seasonalPrice = formData.seasonalPrices.find(season => {
      const seasonStart = new Date(season.startDate);
      const seasonEnd = new Date(season.endDate);
      return date >= seasonStart && date <= seasonEnd;
    });
    
    return seasonalPrice ? seasonalPrice.price : parseFloat(formData.basePrice) || 0;
  };

  const getDateTypeColor = (date: Date): string => {
    if (!formData.seasonalPricingEnabled) return 'bg-blue-100 text-blue-800';
    
    const seasonalPrice = formData.seasonalPrices.find(season => {
      const seasonStart = new Date(season.startDate);
      const seasonEnd = new Date(season.endDate);
      return date >= seasonStart && date <= seasonEnd;
    });
    
    if (!seasonalPrice) return 'bg-blue-100 text-blue-800';
    
    switch (seasonalPrice.type) {
      case 'peak': return 'bg-red-100 text-red-800';
      case 'off': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="h-5 w-5" />
          Pricing & Policies
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Set your rental rates and policies
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Base Pricing */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Base Pricing
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Daily Rate (€) *</Label>
              <Input 
                id="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={(e) => updateField('basePrice', e.target.value)}
                placeholder="45"
              />
              <p className="text-xs text-muted-foreground">
                Competitive rates: €25-150/day
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weeklyDiscount">Weekly Discount (%)</Label>
              <Input 
                id="weeklyDiscount"
                type="number"
                value={formData.weeklyDiscount}
                onChange={(e) => updateField('weeklyDiscount', e.target.value)}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyDiscount">Monthly Discount (%)</Label>
              <Input 
                id="monthlyDiscount"
                type="number"
                value={formData.monthlyDiscount}
                onChange={(e) => updateField('monthlyDiscount', e.target.value)}
                placeholder="20"
              />
            </div>
          </div>
        </div>

        {/* Seasonal Pricing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Seasonal Pricing
            </h4>
            <Switch 
              checked={formData.seasonalPricingEnabled}
              onCheckedChange={(checked) => updateField('seasonalPricingEnabled', checked)}
            />
          </div>
          
          {formData.seasonalPricingEnabled && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Seasonal Pricing Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Configure different rates for peak seasons, holidays, and special events</p>
                  <Button onClick={addSeasonalPrice} variant="outline" size="sm">
                    Add Season
                  </Button>
                </div>
                
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {formData.seasonalPrices.map((season) => (
                    <Card key={season.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Input
                            placeholder="Season name (e.g., Summer 2024)"
                            value={season.name}
                            onChange={(e) => updateSeasonalPrice(season.id, 'name', e.target.value)}
                            className="flex-1 mr-2"
                          />
                          <Button 
                            onClick={() => removeSeasonalPrice(season.id)}
                            variant="outline" 
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              type="date"
                              value={season.startDate.toISOString().split('T')[0]}
                              onChange={(e) => updateSeasonalPrice(season.id, 'startDate', new Date(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                              type="date"
                              value={season.endDate.toISOString().split('T')[0]}
                              onChange={(e) => updateSeasonalPrice(season.id, 'endDate', new Date(e.target.value))}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Daily Rate (€)</Label>
                            <Input
                              type="number"
                              value={season.price}
                              onChange={(e) => updateSeasonalPrice(season.id, 'price', parseFloat(e.target.value) || 0)}
                              placeholder="60"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Season Type</Label>
                            <Select 
                              value={season.type} 
                              onValueChange={(value: 'peak' | 'off' | 'standard') => updateSeasonalPrice(season.id, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="peak">Peak Season</SelectItem>
                                <SelectItem value="off">Off Season</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Calendar Preview */}
              <div className="space-y-4">
                <h5 className="font-medium">Price Calendar Preview</h5>
                <div className="border rounded-lg p-4">
                  <AirbnbDatePicker
                    startDate={undefined}
                    endDate={undefined}
                    onChange={(startDate, endDate) => {
                      setSelectedDate(startDate || new Date());
                    }}
                    disabledDates={[]}
                    minDate={new Date()}
                    placeholder="Select date to preview pricing"
                    className="w-full"
                  />
                  
                  <div className="mt-4 space-y-2">
                    <h6 className="font-medium text-sm">Legend:</h6>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                        <span>Peak Season</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                        <span>Off Season</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                        <span>Standard</span>
                      </div>
                    </div>
                    
                    {selectedDate && (
                      <div className="mt-3 p-2 bg-muted rounded text-sm">
                        <strong>{selectedDate.toLocaleDateString()}</strong>: €{getPriceForDate(selectedDate)}/day
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Fees */}
        <div className="space-y-4">
          <h4 className="font-medium">Additional Fees (Optional)</h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="extraDriverFee">Extra Driver Fee (€)</Label>
              <Input 
                id="extraDriverFee"
                type="number"
                value={formData.extraDriverFee}
                onChange={(e) => updateField('extraDriverFee', e.target.value)}
                placeholder="15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airportDeliveryFee">Airport Delivery (€)</Label>
              <Input 
                id="airportDeliveryFee"
                type="number"
                value={formData.airportDeliveryFee}
                onChange={(e) => updateField('airportDeliveryFee', e.target.value)}
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="childSeatFee">Child Seat Fee (€/day)</Label>
              <Input 
                id="childSeatFee"
                type="number"
                value={formData.childSeatFee}
                onChange={(e) => updateField('childSeatFee', e.target.value)}
                placeholder="5"
              />
            </div>
          </div>
        </div>

        {/* Deposit */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Deposit
          </h4>
          <div className="flex items-center space-x-4">
            <Switch 
              checked={formData.depositRequired}
              onCheckedChange={(checked) => updateField('depositRequired', checked)}
            />
            <Label>Require security deposit</Label>
          </div>
          {formData.depositRequired && (
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="depositAmount">Deposit Amount (€)</Label>
              <Input 
                id="depositAmount"
                type="number"
                value={formData.depositAmount}
                onChange={(e) => updateField('depositAmount', e.target.value)}
                placeholder="500"
              />
            </div>
          )}
        </div>

        {/* Policies */}
        <div className="space-y-4">
          <h4 className="font-medium">Rental Policies</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fuelPolicy">Fuel Policy</Label>
              <Select value={formData.fuelPolicy} onValueChange={(value) => updateField('fuelPolicy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same">Return with same fuel level</SelectItem>
                  <SelectItem value="full">Return full tank</SelectItem>
                  <SelectItem value="prepaid">Pre-paid fuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
              <Select value={formData.cancellationPolicy} onValueChange={(value) => updateField('cancellationPolicy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">Flexible (free cancellation 24h before)</SelectItem>
                  <SelectItem value="moderate">Moderate (free cancellation 48h before)</SelectItem>
                  <SelectItem value="strict">Strict (free cancellation 7 days before)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="mileageLimit">Daily Mileage Limit (km)</Label>
              <Input 
                id="mileageLimit"
                type="number"
                value={formData.mileageLimit}
                onChange={(e) => updateField('mileageLimit', e.target.value)}
                placeholder="300"
              />
              <p className="text-xs text-muted-foreground">Leave empty for unlimited</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="overageFee">Overage Fee (€/km)</Label>
              <Input 
                id="overageFee"
                type="number"
                step="0.01"
                value={formData.overageFee}
                onChange={(e) => updateField('overageFee', e.target.value)}
                placeholder="0.25"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Step4Availability = ({ formData, updateField, t }: Step4AvailabilityProps) => (
  <Card className="max-w-4xl mx-auto">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" />
        Availability Settings
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        Set when your car is available for rent
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t('keepCalendarUpdated')}
        </AlertDescription>
      </Alert>

      <div className="flex items-center space-x-4">
        <Switch 
          checked={formData.alwaysAvailable}
          onCheckedChange={(checked) => updateField('alwaysAvailable', checked)}
        />
        <Label>Always available (can be booked anytime)</Label>
      </div>

      {!formData.alwaysAvailable && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h4 className="font-medium mb-3">Select dates to block or set special pricing</h4>
              <div className="space-y-4">
                <AirbnbDatePicker
                  startDate={formData.selectedStartDate || undefined}
                  endDate={formData.selectedEndDate || undefined}
                  onChange={(startDate, endDate) => {
                    updateField('selectedStartDate', startDate);
                    updateField('selectedEndDate', endDate);
                  }}
                  disabledDates={formData.blockedDates}
                  minDate={new Date()}
                  placeholder="Select dates to block"
                  className="w-full"
                />
                
                {formData.selectedStartDate && formData.selectedEndDate && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const newBlockedDates = [...formData.blockedDates];
                        const start = new Date(formData.selectedStartDate!);
                        const end = new Date(formData.selectedEndDate!);
                        
                        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                          if (!newBlockedDates.some(blocked => blocked.toDateString() === d.toDateString())) {
                            newBlockedDates.push(new Date(d));
                          }
                        }
                        
                        updateField('blockedDates', newBlockedDates);
                        updateField('selectedStartDate', null);
                        updateField('selectedEndDate', null);
                      }}
                    >
                      Block Selected Dates
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        updateField('selectedStartDate', null);
                        updateField('selectedEndDate', null);
                      }}
                    >
                      Clear Selection
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <h4 className="font-medium">Quick Actions</h4>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Block selected date
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Set special price
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Block all weekends (next 3 months)
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Set summer pricing (June-August)
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <h4 className="font-medium">Calendar Legend</h4>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-success rounded"></div>
                    Available
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-destructive rounded"></div>
                    Booked
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-muted border rounded"></div>
                    Blocked by you
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    Special price
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

export const AddCarWizard = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isPublishing, setIsPublishing] = useState(false);
  const [carMakes, setCarMakes] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingMakes, setLoadingMakes] = useState(true);
  
  const [formData, setFormData] = useState<FormData>({
    make: "",
    makeId: "",               // TODO: Fetch from makes API or map from make selection
    model: "",
    year: "",
    bodyType: "",
    transmission: "",
    fuel: "",
    drive: "",
    seats: "",
    doors: "",
    luggage: "",
    color: "",
    plate: "",
    vin: "",
    photos: [],
    coverPhotoIndex: 0,
    basePrice: "",
    weeklyDiscount: "",
    monthlyDiscount: "",
    extraDriverFee: "",
    airportDeliveryFee: "",
    childSeatFee: "",
    depositRequired: false,
    depositAmount: "",
    fuelPolicy: "same",
    mileageLimit: "",
    overageFee: "",
    cancellationPolicy: "flexible",
    seasonalPricingEnabled: false,
    seasonalPrices: [],
    blockedDates: [],
    specialPrices: [],
    alwaysAvailable: false,
    selectedStartDate: null,
    selectedEndDate: null,
  });

  const steps = [
    { id: 1, title: "Basics", icon: Car },
    { id: 2, title: "Photos", icon: Camera },
    { id: 3, title: "Pricing & Policies", icon: Euro },
    { id: 4, title: "Availability", icon: CalendarIcon }
  ];

  // Update field - simple state update
  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Fetch car makes on mount
  useEffect(() => {
    const fetchCarMakes = async () => {
      try {
        const { getCarMakes } = await import('@/lib/api/cars');
        const makes = await getCarMakes();
        setCarMakes(makes);
      } catch (error) {
        console.error('Error fetching car makes:', error);
      } finally {
        setLoadingMakes(false);
      }
    };
    fetchCarMakes();
  }, []);


  // Update makeId when make is selected
  const handleMakeChange = (makeId: string) => {
    setFormData(prev => ({ ...prev, makeId, make: makeId }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const saveAndExit = () => {
    // toast({
    //   title: "Draft Saved",
    //   description: "Your car listing has been saved as a draft.",
    // });
    console.log("Draft saved");
    router.push('/vendor/cars');
  };

  const publishListing = async () => {
    if (isPublishing) return; // Prevent double submission
    
    try {
      setIsPublishing(true);
      
      // Import the API function
      const { createCar } = await import('@/lib/api/cars');
      
      // Validate required fields
      if (!formData.makeId) {
        alert('Please select a car make.');
        setIsPublishing(false);
        return;
      }
      if (!formData.model || !formData.year || !formData.transmission || !formData.fuel) {
        alert('Please fill in all required fields.');
        setIsPublishing(false);
        return;
      }

      // Map luggage string to number (small=1, medium=2, large=3)
      const luggageMap: Record<string, number> = {
        'small': 1,
        'medium': 2,
        'large': 3,
      };
      const luggageValue = luggageMap[formData.luggage.toLowerCase()] || 2;

      // Prepare car data for API
      const carData = {
        makeId: formData.makeId,
        model: formData.model,
        year: parseInt(formData.year, 10),
        bodyType: formData.bodyType || '',
        transmission: formData.transmission,
        fuelType: formData.fuel,
        drive: formData.drive || '',
        seats: parseInt(formData.seats, 10) || 5,
        doors: parseInt(formData.doors, 10) || 4,
        luggage: luggageValue,
        color: formData.color || '',
        licensePlate: formData.plate || '',
        vin: formData.vin || '',
      };

      // Call the API
      await createCar(carData);
      
      // Success - redirect to cars list
      // toast({
      //   title: "🎉 Car Published!",
      //   description: "Your car is now live. Keep your calendar updated to avoid conflicts.",
      // });
      router.push('/vendor/cars');
    } catch (error) {
      console.error('Error creating car:', error);
      alert(error instanceof Error ? error.message : 'Failed to create car. Please try again.');
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/vendor/cars')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Add New Car</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
        <p className="text-muted-foreground">
          Follow these steps to create your car listing
        </p>
      </div>

      <StepIndicator currentStep={currentStep} steps={steps} />

      <div className="space-y-8">
        {currentStep === 1 && (
          <Step1Basics 
            formData={formData}
            updateField={updateField}
            carMakes={carMakes}
            loadingMakes={loadingMakes}
            handleMakeChange={handleMakeChange}
          />
        )}
        {currentStep === 2 && (
          <Step2Photos 
            formData={formData}
            updateField={updateField}
          />
        )}
        {currentStep === 3 && (
          <Step3Pricing 
            formData={formData}
            updateField={updateField}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
        {currentStep === 4 && (
          <Step4Availability 
            formData={formData}
            updateField={updateField}
            t={t}
          />
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-4xl mx-auto gap-4 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={saveAndExit} className="gap-2 flex-1 sm:flex-none">
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">{t('saveExit')}</span>
              <span className="sm:hidden">Save</span>
            </Button>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep} className="gap-2 flex-1 sm:flex-none">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t('back')}</span>
                <span className="sm:hidden">Back</span>
              </Button>
            )}
            {currentStep < 4 ? (
              <Button variant="hero" onClick={nextStep} className="gap-2 flex-1 sm:flex-none">
                <span className="hidden sm:inline">{t('next')}</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="hero" 
                onClick={publishListing} 
                disabled={isPublishing}
                className="gap-2 flex-1 sm:flex-none"
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span className="hidden sm:inline">Publishing...</span>
                    <span className="sm:hidden">Publishing...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">{t('publishListing')}</span>
                    <span className="sm:hidden">Publish</span>
                    <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
