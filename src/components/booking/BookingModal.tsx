'use client'

import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Car, Calendar, CreditCard } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/shared/components/LanguageProvider';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CarData {
  id: string;
  make: string;
  model: string;
  year?: number;
  image: string;
  price: number;
  transmission: string;
  fuel: string;
  seats: number;
  luggage: string;
  location: string;
  rating: number;
  reviews: number;
  available: boolean;
}

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car: CarData | null;
}

export const BookingModal = ({ open, onOpenChange, car }: BookingModalProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);

  if (!car) return null;

  const steps = [
    { id: 1, label: t('stepCar') || 'Car', icon: Car },
    { id: 2, label: t('stepBooking') || 'Booking', icon: Calendar },
    { id: 3, label: t('stepPayment') || 'Payment', icon: CreditCard },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header with breadcrumb */}
        <div className="sticky top-0 bg-white border-b z-10 p-4">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className={cn(
                      currentStep >= step.id ? 'text-primary font-medium' : ''
                    )}>
                      {step.label}
                    </div>
                    {index < steps.length - 1 && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Car Details */}
              <div className="space-y-6">
                {/* Car Name and Actions */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-foreground">
                      {car.make} {car.model}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="text-yellow-500">⚡</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="text-red-500">❤️</span>
                      </Button>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {t('noDeposit') || 'No deposit'}
                  </Badge>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">{t('specifications') || 'Specifications'}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t('gearBox') || 'Gear box'}:</span>
                      <span className="ml-2 font-medium">{car.transmission}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('engine') || 'Engine'}:</span>
                      <span className="ml-2 font-medium">1.8 l</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('yearOfManufacture') || 'Year of manufacture'}:</span>
                      <span className="ml-2 font-medium">{car.year || '2008'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('audio') || 'Audio'}:</span>
                      <span className="ml-2 font-medium">Bluetooth</span>
                    </div>
                  </div>
                  <Button variant="link" className="p-0 mt-2 text-sm">
                    {t('allSpecifications') || 'ALL SPECIFICATIONS'} <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">{t('requirements') || 'Requirements'}</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t('driversAge') || 'Driver\'s age'}:</span>
                      <span className="ml-2 font-medium">20 – 60 years</span>
                      <Button variant="link" className="p-0 ml-2 text-sm h-auto">
                        {t('otherAge') || 'Other age?'}
                      </Button>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('minimumDrivingExperience') || 'Minimum driving experience'}:</span>
                      <span className="ml-2 font-medium">2 years</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('mileageLimit') || 'Mileage limit'}:</span>
                      <span className="ml-2 font-medium">{t('no') || 'No'}</span>
                    </div>
                  </div>
                </div>

                {/* Insurance */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">{t('insurance') || 'Insurance'}</h3>
                  <div className="space-y-3">
                    {/* Full Coverage Plus */}
                    <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                      <div className="flex items-start gap-3">
                        <input type="radio" name="insurance" defaultChecked className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{t('fullCoveragePlus') || 'Full Coverage Plus'}</span>
                            <Badge className="bg-green-500 text-white text-xs">
                              {t('weRecommend') || 'WE RECOMMEND'}
                            </Badge>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                              {t('noDeposit') || 'No deposit'}
                            </Badge>
                          </div>
                          <div className="text-lg font-bold text-primary mb-2">25€ {t('aDay') || 'a day'}</div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{t('fullDamageCoverage') || 'Full damage coverage'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{t('noDriverLiability') || 'No driver liability for accident-related damage'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full Coverage */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <input type="radio" name="insurance" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{t('fullCoverage') || 'Full Coverage'}</span>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                              {t('noDeposit') || 'No deposit'}
                            </Badge>
                          </div>
                          <div className="text-lg font-bold mb-2">18€ {t('aDay') || 'a day'}</div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{t('fullCoverageLimited') || 'Full coverage with limited driver liability (SuperCDW)'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{t('coverageForCollision') || 'Coverage for collision damage caused to other vehicles (TPL)'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Basic Coverage */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <input type="radio" name="insurance" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{t('basicCoverage') || 'Basic coverage'}</span>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                              {t('noDeposit') || 'No deposit'}
                            </Badge>
                          </div>
                          <div className="text-lg font-bold mb-2">15€ {t('aDay') || 'a day'}</div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{t('limitedCollisionCoverage') || 'Limited collision coverage (CDW)'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{t('coverageForCollision') || 'Coverage for collision damage caused to other vehicles (TPL)'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-red-500">✗</span>
                              <span className="text-muted-foreground line-through">{t('glassAndWheelDamage') || 'Glass and wheel damage coverage'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Minimum Coverage */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <input type="radio" name="insurance" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{t('minimumCoverage') || 'Minimum coverage'}</span>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                              {t('noDeposit') || 'No deposit'}
                            </Badge>
                          </div>
                          <div className="text-lg font-bold mb-2">{t('freeOfCharge') || 'Free of charge'}</div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{t('coverageForCollision') || 'Coverage for collision damage caused to other vehicles (TPL)'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-red-500">✗</span>
                              <span className="text-muted-foreground line-through">{t('collisionDamageCoverage') || 'Collision damage coverage'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-red-500">✗</span>
                              <span className="text-muted-foreground line-through">{t('glassAndWheelDamage') || 'Glass and wheel damage coverage'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Car Images and Cost */}
              <div className="space-y-6">
                {/* Car Images */}
                <div>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                    <Image
                      src={car.image}
                      alt={`${car.make} ${car.model}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className={cn(
                        "relative w-20 h-16 rounded overflow-hidden border-2",
                        index === 1 ? "border-primary" : "border-border"
                      )}>
                        <Image
                          src={car.image}
                          alt={`Thumbnail ${index}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg">{t('cost') || 'Cost'}</h3>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>{t('rentForDays') || 'Rent for 14 days'}:</span>
                      <span className="font-semibold">140€</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tirana, 15.11 — Bajram Curri, 29.11
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2">{t('delivery') || 'Delivery'}:</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>{t('atPickup') || 'At pick-up'}:</span>
                        <span>5€</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('atDropoff') || 'At drop-off'}:</span>
                        <span>100€</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2">{t('other') || 'Other'}:</div>
                    <div className="flex justify-between text-sm">
                      <span>{t('minimumCoverageTpl') || 'Minimum coverage (TPL)'}:</span>
                      <span>0€</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t('total') || 'Total'}:</span>
                      <span>245€</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div>
                      <div className="text-sm font-medium mb-1">
                        {t('toPayNow') || 'To pay now on the website'}:
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">28€</span>
                        <div className="flex gap-2">
                          <span className="text-xs">Visa</span>
                          <span className="text-xs">Master Card</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">
                        {t('toPayWhenPickingUp') || 'To pay when picking up the car'}:
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">217€</span>
                        <div className="flex gap-2 text-xs">
                          <span>Cash</span>
                          <span>Visa</span>
                          <span>MasterCard</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-semibold"
                    onClick={handleNext}
                  >
                    {t('continue') || 'Continue'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4">{t('stepBooking') || 'Booking'}</h3>
              <p className="text-muted-foreground">{t('bookingStepPlaceholder') || 'Booking step coming soon...'}</p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4">{t('stepPayment') || 'Payment'}</h3>
              <p className="text-muted-foreground">{t('paymentStepPlaceholder') || 'Payment step coming soon...'}</p>
            </div>
          )}

          {/* Navigation */}
          {currentStep > 1 && (
            <div className="flex justify-between mt-6 pt-6 border-t">
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                {t('previous') || 'Previous'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

