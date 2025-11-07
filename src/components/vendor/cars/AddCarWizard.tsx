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
  Image,
  DollarSign,
  Shield,
  AlertCircle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableCarMakeSelect } from "./SearchableCarMakeSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card";
import { Switch } from "@/components/ui/switch";
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
type IconComponent = React.ComponentType<{ className?: string }>;

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{ id: number; title: string; icon: IconComponent }>;
}

type FormFieldValue = string | number | boolean | Date | File[] | SeasonalPrice[] | { date: Date; price: number }[] | Date[] | null;

interface Step1BasicsProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: FormFieldValue) => void;
  carMakes: Array<{ id: string; name: string }>;
  loadingMakes: boolean;
  handleMakeChange: (makeId: string) => void;
}

interface Step2PhotosProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: FormFieldValue) => void;
}

interface Step3PricingProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: FormFieldValue) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

interface Step4AvailabilityProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: FormFieldValue) => void;
  t: (key: string) => string;
}

// Top-level step components
const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  const { t } = useLanguage();
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
                {t('vendor.step')} {step.id}
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

const Step1Basics = ({ formData, updateField, carMakes, loadingMakes, handleMakeChange }: Step1BasicsProps) => {
  const { t } = useLanguage();
  return (
  <Card className="max-w-4xl mx-auto">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Car className="h-5 w-5" />
        {t('vendor.basicCarInformation')}
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        {t('vendor.enterBasicDetails')}
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="make">{t('vendor.carMake')} *</Label>
          <SearchableCarMakeSelect
            carMakes={carMakes}
            value={formData.makeId}
            onValueChange={handleMakeChange}
            disabled={loadingMakes}
            placeholder={loadingMakes ? t('vendor.loadingCars') : t('vendor.selectMake')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">{t('vendor.model')} *</Label>
          <Input 
            id="model"
            value={formData.model}
            onChange={(e) => updateField('model', e.target.value)}
            placeholder="e.g., Golf, 320i, C-Class"
          />
          <p className="text-xs text-muted-foreground">{t('vendor.enterExactModel')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="year">{t('vendor.year')} *</Label>
          <Select value={formData.year} onValueChange={(value) => updateField('year', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('vendor.selectYear')} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bodyType">{t('vendor.bodyType')}</Label>
          <Select value={formData.bodyType} onValueChange={(value) => updateField('bodyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('vendor.selectType')} />
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
          <Label htmlFor="transmission">{t('transmission')} *</Label>
          <Select value={formData.transmission} onValueChange={(value) => updateField('transmission', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('vendor.selectTransmission')} />
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
          <Label htmlFor="fuel">{t('vendor.fuelType')} *</Label>
          <Select value={formData.fuel} onValueChange={(value) => updateField('fuel', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('vendor.selectFuel')} />
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
          <Label htmlFor="drive">{t('vendor.driveType')}</Label>
          <Select value={formData.drive} onValueChange={(value) => updateField('drive', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('vendor.selectDrive')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FrontWheel">Front Wheel Drive</SelectItem>
              <SelectItem value="RearWheel">Rear Wheel Drive</SelectItem>
              <SelectItem value="4x4">Four Wheel Drive (4x4)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seats">{t('vendor.seats')} *</Label>
          <Select value={formData.seats} onValueChange={(value) => updateField('seats', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('vendor.seats')} />
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
          <Label htmlFor="doors">{t('vendor.doors')}</Label>
          <Select value={formData.doors} onValueChange={(value) => updateField('doors', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('vendor.doors')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 doors</SelectItem>
              <SelectItem value="4">4 doors</SelectItem>
              <SelectItem value="5">5 doors</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="luggage">{t('vendor.luggage')} *</Label>
          <Select value={formData.luggage} onValueChange={(value) => updateField('luggage', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('vendor.luggage')} />
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
          <Label htmlFor="color">{t('vendor.color')}</Label>
          <Input 
            id="color"
            value={formData.color}
            onChange={(e) => updateField('color', e.target.value)}
            placeholder="e.g., Black, White, Silver"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="plate">{t('vendor.licensePlate')}</Label>
          <Input 
            id="plate"
            value={formData.plate}
            onChange={(e) => updateField('plate', e.target.value)}
            placeholder="TR 123 ABC"
          />
          <p className="text-xs text-muted-foreground">{t('vendor.privateInformation')}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vin">{t('vendor.vin')} ({t('vendor.optional')})</Label>
        <Input 
          id="vin"
          value={formData.vin}
          onChange={(e) => updateField('vin', e.target.value)}
          placeholder="Vehicle Identification Number"
        />
        <p className="text-xs text-muted-foreground">{t('vendor.forInsuranceVerification')}</p>
      </div>
    </CardContent>
  </Card>
  );
};

const Step2Photos = ({}: Step2PhotosProps) => {
  const { t } = useLanguage();
  return (
  <Card className="max-w-4xl mx-auto">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Camera className="h-5 w-5" />
        {t('vendor.uploadPhotos')}
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        {t('vendor.addHighQualityPhotos')}
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {t('vendor.photosIncreaseBookings')}
        </AlertDescription>
      </Alert>
      
      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-smooth">
        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">{t('vendor.dragDropPhotos')}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('vendor.clickToBrowse')}
        </p>
        <Button variant="outline" type="button">{t('vendor.browseFiles')}</Button>
      </div>

      {/* Photo grid placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" aria-label={`Photo placeholder ${index}`} />
              <p className="text-xs text-muted-foreground">Photo {index}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">{t('vendor.photoTips')}</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• {t('vendor.takePhotosGoodLighting')}</li>
          <li>• {t('vendor.cleanCarBefore')}</li>
          <li>• {t('vendor.includeAllAngles')}</li>
          <li>• {t('vendor.avoidBlurryPhotos')}</li>
        </ul>
      </div>
    </CardContent>
  </Card>
  );
};

const Step3Pricing = ({ formData, updateField, selectedDate, setSelectedDate }: Step3PricingProps) => {
  const { t } = useLanguage();
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

  const updateSeasonalPrice = (id: string, field: keyof SeasonalPrice, value: string | number | Date | 'peak' | 'off' | 'standard') => {
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

  // Note: getDateTypeColor is available for future use if needed
  // const getDateTypeColor = (date: Date): string => {
  //   if (!formData.seasonalPricingEnabled) return 'bg-blue-100 text-blue-800';
  //   
  //   const seasonalPrice = formData.seasonalPrices.find(season => {
  //     const seasonStart = new Date(season.startDate);
  //     const seasonEnd = new Date(season.endDate);
  //     return date >= seasonStart && date <= seasonEnd;
  //   });
  //   
  //   if (!seasonalPrice) return 'bg-blue-100 text-blue-800';
  //   
  //   switch (seasonalPrice.type) {
  //     case 'peak': return 'bg-red-100 text-red-800';
  //     case 'off': return 'bg-green-100 text-green-800';
  //     default: return 'bg-blue-100 text-blue-800';
  //   }
  // };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="h-5 w-5" />
          {t('vendor.pricingPolicies')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('vendor.setRentalRates')}
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Base Pricing */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {t('vendor.basePricing')}
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="basePrice">{t('vendor.dailyRate')} *</Label>
              <Input 
                id="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={(e) => updateField('basePrice', e.target.value)}
                placeholder="45"
              />
              <p className="text-xs text-muted-foreground">
                {t('vendor.competitiveRates')}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weeklyDiscount">{t('vendor.weeklyDiscount')}</Label>
              <Input 
                id="weeklyDiscount"
                type="number"
                value={formData.weeklyDiscount}
                onChange={(e) => updateField('weeklyDiscount', e.target.value)}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyDiscount">{t('vendor.monthlyDiscount')}</Label>
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
              {t('vendor.seasonalPricing')}
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
                  <p className="text-sm text-muted-foreground">{t('vendor.configureDifferentRates')}</p>
                  <Button onClick={addSeasonalPrice} variant="outline" size="sm">
                    {t('vendor.addSeason')}
                  </Button>
                </div>
                
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {formData.seasonalPrices.map((season) => (
                    <Card key={season.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Input
                            placeholder={t('vendor.seasonName')}
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
                            <Label>{t('vendor.startDate')}</Label>
                            <Input
                              type="date"
                              value={season.startDate.toISOString().split('T')[0]}
                              onChange={(e) => updateSeasonalPrice(season.id, 'startDate', new Date(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>{t('vendor.endDate')}</Label>
                            <Input
                              type="date"
                              value={season.endDate.toISOString().split('T')[0]}
                              onChange={(e) => updateSeasonalPrice(season.id, 'endDate', new Date(e.target.value))}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>{t('vendor.dailyRate')}</Label>
                            <Input
                              type="number"
                              value={season.price}
                              onChange={(e) => updateSeasonalPrice(season.id, 'price', parseFloat(e.target.value) || 0)}
                              placeholder="60"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>{t('vendor.seasonType')}</Label>
                            <Select 
                              value={season.type} 
                              onValueChange={(value: 'peak' | 'off' | 'standard') => updateSeasonalPrice(season.id, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">{t('vendor.standard')}</SelectItem>
                                <SelectItem value="peak">{t('vendor.peakSeason')}</SelectItem>
                                <SelectItem value="off">{t('vendor.offSeason')}</SelectItem>
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
                <h5 className="font-medium">{t('vendor.priceCalendarPreview')}</h5>
                <div className="border rounded-lg p-4">
                  <AirbnbDatePicker
                    startDate={undefined}
                    endDate={undefined}
                    onChange={(startDate) => {
                      setSelectedDate(startDate || new Date());
                    }}
                    disabledDates={[]}
                    minDate={new Date()}
                    placeholder={t('vendor.selectDatePreview')}
                    className="w-full"
                  />
                  
                  <div className="mt-4 space-y-2">
                    <h6 className="font-medium text-sm">{t('vendor.legend')}</h6>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                        <span>{t('vendor.peakSeason')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                        <span>{t('vendor.offSeason')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                        <span>{t('vendor.standard')}</span>
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
          <h4 className="font-medium">{t('vendor.additionalFees')}</h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="extraDriverFee">{t('vendor.extraDriverFee')}</Label>
              <Input 
                id="extraDriverFee"
                type="number"
                value={formData.extraDriverFee}
                onChange={(e) => updateField('extraDriverFee', e.target.value)}
                placeholder="15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airportDeliveryFee">{t('vendor.airportDelivery')}</Label>
              <Input 
                id="airportDeliveryFee"
                type="number"
                value={formData.airportDeliveryFee}
                onChange={(e) => updateField('airportDeliveryFee', e.target.value)}
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="childSeatFee">{t('vendor.childSeatFee')}</Label>
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
            {t('vendor.securityDeposit')}
          </h4>
          <div className="flex items-center space-x-4">
            <Switch 
              checked={formData.depositRequired}
              onCheckedChange={(checked) => updateField('depositRequired', checked)}
            />
            <Label>{t('vendor.requireSecurityDeposit')}</Label>
          </div>
          {formData.depositRequired && (
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="depositAmount">{t('vendor.depositAmount')}</Label>
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
          <h4 className="font-medium">{t('vendor.rentalPolicies')}</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fuelPolicy">{t('vendor.fuelPolicy')}</Label>
              <Select value={formData.fuelPolicy} onValueChange={(value) => updateField('fuelPolicy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same">{t('vendor.returnSameFuel')}</SelectItem>
                  <SelectItem value="full">{t('vendor.returnFullTank')}</SelectItem>
                  <SelectItem value="prepaid">{t('vendor.prepaidFuel')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancellationPolicy">{t('vendor.cancellationPolicy')}</Label>
              <Select value={formData.cancellationPolicy} onValueChange={(value) => updateField('cancellationPolicy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">{t('vendor.flexibleCancellation')}</SelectItem>
                  <SelectItem value="moderate">{t('vendor.moderateCancellation')}</SelectItem>
                  <SelectItem value="strict">{t('vendor.strictCancellation')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="mileageLimit">{t('vendor.dailyMileageLimit')}</Label>
              <Input 
                id="mileageLimit"
                type="number"
                value={formData.mileageLimit}
                onChange={(e) => updateField('mileageLimit', e.target.value)}
                placeholder="300"
              />
              <p className="text-xs text-muted-foreground">{t('vendor.leaveEmptyUnlimited')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="overageFee">{t('vendor.overageFee')}</Label>
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
          {t('vendor.availabilitySettings')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('vendor.setWhenAvailable')}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t('vendor.keepCalendarUpdated')}
        </AlertDescription>
      </Alert>

      <div className="flex items-center space-x-4">
        <Switch 
          checked={formData.alwaysAvailable}
          onCheckedChange={(checked) => updateField('alwaysAvailable', checked)}
        />
        <Label>{t('vendor.alwaysAvailable')}</Label>
      </div>

      {!formData.alwaysAvailable && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h4 className="font-medium mb-3">{t('vendor.selectDatesBlock')}</h4>
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
                  placeholder={t('vendor.selectDatesToBlock')}
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
                      {t('vendor.blockSelectedDates')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        updateField('selectedStartDate', null);
                        updateField('selectedEndDate', null);
                      }}
                    >
                      {t('vendor.clearSelection')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <h4 className="font-medium">{t('vendor.quickActions')}</h4>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    {t('vendor.blockSelectedDate')}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    {t('vendor.setSpecialPrice')}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    {t('vendor.blockAllWeekends')}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    {t('vendor.setSummerPricing')}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <h4 className="font-medium">{t('vendor.calendarLegend')}</h4>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-success rounded"></div>
                    {t('vendor.available')}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-destructive rounded"></div>
                    {t('vendor.booked')}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-muted border rounded"></div>
                    {t('vendor.blockedByYou')}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    {t('vendor.specialPrice')}
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
    { id: 1, title: t('vendor.basics'), icon: Car },
    { id: 2, title: t('vendor.photos'), icon: Camera },
    { id: 3, title: t('vendor.pricingPoliciesShort'), icon: Euro },
    { id: 4, title: t('vendor.availability'), icon: CalendarIcon }
  ];

  // Update field - simple state update
  const updateField = (field: keyof FormData, value: FormFieldValue) => {
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
        alert(t('vendor.pleaseSelectCarMake'));
        setIsPublishing(false);
        return;
      }
      if (!formData.model || !formData.year || !formData.transmission || !formData.fuel) {
        alert(t('vendor.pleaseFillRequiredFields'));
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
            {t('vendor.backToCars')}
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{t('vendor.addNewCar')}</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
        <p className="text-muted-foreground">
          {t('vendor.followSteps')}
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
              <span>{t('vendor.saveExit')}</span>
            </Button>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep} className="gap-2 flex-1 sm:flex-none">
                <ArrowLeft className="h-4 w-4" />
                <span>{t('vendor.back')}</span>
              </Button>
            )}
            {currentStep < 4 ? (
              <Button variant="hero" onClick={nextStep} className="gap-2 flex-1 sm:flex-none">
                <span>{t('vendor.next')}</span>
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
                    <span>{t('vendor.publishing')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('vendor.publishListing')}</span>
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
