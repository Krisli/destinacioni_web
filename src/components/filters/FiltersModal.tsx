'use client'

import { useState } from 'react';
import { Filter, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFilters } from '@/contexts/EnhancedFilterContext';
import { useLanguage } from '@/shared/components/LanguageProvider';
import { cn } from '@/lib/utils';

// Mock counts - in real app, these would come from API
const getFilterCounts = () => ({
  transmission: { automatic: 611, manual: 290 },
  deposit: { noDeposit: 362, noDepositPaid: 395, cash: 811, creditCard: 644, debitCard: 516, crypto: 379 },
  engine: { gasoline: 309, diesel: 579, hybrid: 234, electric: 156, lpg: 89 },
  payment: { cash: 844, card: 683, crypto: 43, noCreditCard: 842 },
  drive: { frontWheel: 754, rearWheel: 26, fourWheel: 121 },
  insurance: { basic: 668, full: 481, fullPlus: 413 },
  options: { topCars: 35, cityDelivery: 753, realPhotos: 768, freeCancellation: 166, unlimitedMileage: 797, secondDriver: 874, guaranteedModel: 796 },
});

export const FiltersModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, dispatch, getActiveFilterCount } = useFilters();
  const { t } = useLanguage();
  const counts = getFilterCounts();

  const activeFilterCount = getActiveFilterCount();
  const totalCars = 901; // This would come from API

  const handleTransmissionChange = (value: string, checked: boolean) => {
    if (checked) {
      dispatch({ type: 'SET_TRANSMISSION', payload: value });
    } else {
      dispatch({ type: 'SET_TRANSMISSION', payload: 'all' });
    }
  };

  const handleDepositToggle = (value: string) => {
    const current = filters.deposit;
    const newDeposit = current.includes(value)
      ? current.filter(d => d !== value)
      : [...current, value];
    dispatch({ type: 'SET_DEPOSIT', payload: newDeposit });
  };

  const handlePaymentToggle = (value: string) => {
    const current = filters.paymentMethod;
    const newPayment = current.includes(value)
      ? current.filter(p => p !== value)
      : [...current, value];
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: newPayment });
  };

  const handleDriveToggle = (value: string) => {
    const current = filters.drive;
    const newDrive = current.includes(value)
      ? current.filter(d => d !== value)
      : [...current, value];
    dispatch({ type: 'SET_DRIVE', payload: newDrive });
  };

  const handleInsuranceToggle = (value: string) => {
    const current = filters.insurance;
    const newInsurance = current.includes(value)
      ? current.filter(i => i !== value)
      : [...current, value];
    dispatch({ type: 'SET_INSURANCE', payload: newInsurance });
  };

  const handleOptionToggle = (key: keyof typeof filters.options) => {
    dispatch({
      type: 'SET_OPTION',
      payload: { key, value: !filters.options[key] },
    });
  };

  const FilterCheckbox = ({ 
    checked, 
    onChange, 
    label, 
    count 
  }: { 
    checked: boolean; 
    onChange: () => void; 
    label: string; 
    count?: number;
  }) => (
    <label className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1 rounded">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <span className="text-sm text-foreground flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </label>
  );

  const FilterSection = ({ 
    title, 
    children 
  }: { 
    title: React.ReactNode; 
    children: React.ReactNode;
  }) => (
    <div className="space-y-3">
      <h3 className="font-medium text-sm text-foreground">{title}</h3>
      <div className="space-y-1.5">
        {children}
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        {t('filters')}
        {activeFilterCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold">{t('filters')}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Content - Multi Column Layout */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {/* Column 1: Gear box and Car brand */}
                <div className="space-y-6">
                  <FilterSection title="Gear box">
                    <FilterCheckbox
                      checked={filters.transmission === 'automatic'}
                      onChange={() => handleTransmissionChange('automatic', true)}
                      label="Automatic"
                      count={counts.transmission.automatic}
                    />
                    <FilterCheckbox
                      checked={filters.transmission === 'manual'}
                      onChange={() => handleTransmissionChange('manual', true)}
                      label="Manual"
                      count={counts.transmission.manual}
                    />
                  </FilterSection>

                  <FilterSection title="Car brand">
                    <Select value={filters.carBrand} onValueChange={(value) => dispatch({ type: 'SET_CAR_BRAND', payload: value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="bmw">BMW</SelectItem>
                        <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                        <SelectItem value="volkswagen">Volkswagen</SelectItem>
                        <SelectItem value="audi">Audi</SelectItem>
                        <SelectItem value="toyota">Toyota</SelectItem>
                        <SelectItem value="ford">Ford</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Brand logos would go here */}
                    <div className="flex gap-2 mt-2 opacity-50">
                      <div className="text-xs">BMW</div>
                      <div className="text-xs">MB</div>
                      <div className="text-xs">VW</div>
                    </div>
                  </FilterSection>
                </div>

                {/* Column 2: Deposit and Engine */}
                <div className="space-y-6">
                  <FilterSection title="Deposit">
                    <FilterCheckbox
                      checked={filters.deposit.includes('noDeposit')}
                      onChange={() => handleDepositToggle('noDeposit')}
                      label="No deposit"
                      count={counts.deposit.noDeposit}
                    />
                    <FilterCheckbox
                      checked={filters.deposit.includes('noDepositPaid')}
                      onChange={() => handleDepositToggle('noDepositPaid')}
                      label="No deposit (paid service)"
                      count={counts.deposit.noDepositPaid}
                    />
                    <FilterCheckbox
                      checked={filters.deposit.includes('cash')}
                      onChange={() => handleDepositToggle('cash')}
                      label="Cash"
                      count={counts.deposit.cash}
                    />
                    <FilterCheckbox
                      checked={filters.deposit.includes('creditCard')}
                      onChange={() => handleDepositToggle('creditCard')}
                      label="Credit card"
                      count={counts.deposit.creditCard}
                    />
                    <FilterCheckbox
                      checked={filters.deposit.includes('debitCard')}
                      onChange={() => handleDepositToggle('debitCard')}
                      label="Debit card"
                      count={counts.deposit.debitCard}
                    />
                    <FilterCheckbox
                      checked={filters.deposit.includes('crypto')}
                      onChange={() => handleDepositToggle('crypto')}
                      label="Crypto"
                      count={counts.deposit.crypto}
                    />
                    <div className="mt-3">
                      <Select value={filters.depositAmount} onValueChange={(value) => dispatch({ type: 'SET_DEPOSIT_AMOUNT', payload: value })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="0-100">€0 - €100</SelectItem>
                          <SelectItem value="100-300">€100 - €300</SelectItem>
                          <SelectItem value="300-500">€300 - €500</SelectItem>
                          <SelectItem value="500+">€500+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </FilterSection>

                  <FilterSection title="Engine">
                    <FilterCheckbox
                      checked={filters.fuelType === 'petrol'}
                      onChange={() => dispatch({ type: 'SET_FUEL_TYPE', payload: 'petrol' })}
                      label="Gasoline"
                      count={counts.engine.gasoline}
                    />
                    <FilterCheckbox
                      checked={filters.fuelType === 'diesel'}
                      onChange={() => dispatch({ type: 'SET_FUEL_TYPE', payload: 'diesel' })}
                      label="Diesel"
                      count={counts.engine.diesel}
                    />
                    <FilterCheckbox
                      checked={filters.fuelType === 'hybrid'}
                      onChange={() => dispatch({ type: 'SET_FUEL_TYPE', payload: 'hybrid' })}
                      label="Hybrid"
                      count={counts.engine.hybrid}
                    />
                    <FilterCheckbox
                      checked={filters.fuelType === 'electric'}
                      onChange={() => dispatch({ type: 'SET_FUEL_TYPE', payload: 'electric' })}
                      label="Electric"
                      count={counts.engine.electric}
                    />
                    <FilterCheckbox
                      checked={filters.fuelType === 'lpg'}
                      onChange={() => dispatch({ type: 'SET_FUEL_TYPE', payload: 'lpg' })}
                      label="LPG"
                      count={counts.engine.lpg}
                    />
                  </FilterSection>
                </div>

                {/* Column 3: Payment of rent and Drive */}
                <div className="space-y-6">
                  <FilterSection title="Payment of rent">
                    <FilterCheckbox
                      checked={filters.paymentMethod.includes('cash')}
                      onChange={() => handlePaymentToggle('cash')}
                      label="Cash"
                      count={counts.payment.cash}
                    />
                    <FilterCheckbox
                      checked={filters.paymentMethod.includes('card')}
                      onChange={() => handlePaymentToggle('card')}
                      label="Card"
                      count={counts.payment.card}
                    />
                    <FilterCheckbox
                      checked={filters.paymentMethod.includes('crypto')}
                      onChange={() => handlePaymentToggle('crypto')}
                      label="Crypto"
                      count={counts.payment.crypto}
                    />
                    <FilterCheckbox
                      checked={filters.paymentMethod.includes('noCreditCard')}
                      onChange={() => handlePaymentToggle('noCreditCard')}
                      label="No credit card"
                      count={counts.payment.noCreditCard}
                    />
                  </FilterSection>

                  <FilterSection title="Drive">
                    <FilterCheckbox
                      checked={filters.drive.includes('frontWheel')}
                      onChange={() => handleDriveToggle('frontWheel')}
                      label="Front wheel"
                      count={counts.drive.frontWheel}
                    />
                    <FilterCheckbox
                      checked={filters.drive.includes('rearWheel')}
                      onChange={() => handleDriveToggle('rearWheel')}
                      label="Rear wheel"
                      count={counts.drive.rearWheel}
                    />
                    <FilterCheckbox
                      checked={filters.drive.includes('fourWheel')}
                      onChange={() => handleDriveToggle('fourWheel')}
                      label="Four wheel"
                      count={counts.drive.fourWheel}
                    />
                  </FilterSection>
                </div>

                {/* Column 4: Insurance and Crossborder fee */}
                <div className="space-y-6">
                  <FilterSection title="Insurance">
                    <FilterCheckbox
                      checked={filters.insurance.includes('basic')}
                      onChange={() => handleInsuranceToggle('basic')}
                      label="Basic coverage"
                      count={counts.insurance.basic}
                    />
                    <FilterCheckbox
                      checked={filters.insurance.includes('full')}
                      onChange={() => handleInsuranceToggle('full')}
                      label="Full Coverage"
                      count={counts.insurance.full}
                    />
                    <FilterCheckbox
                      checked={filters.insurance.includes('fullPlus')}
                      onChange={() => handleInsuranceToggle('fullPlus')}
                      label="Full Coverage Plus"
                      count={counts.insurance.fullPlus}
                    />
                  </FilterSection>

                  <FilterSection title={
                    <div className="flex items-center gap-1">
                      <span>Crossborder fee</span>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  }>
                    <Select value={filters.crossborderFee} onValueChange={(value) => dispatch({ type: 'SET_CROSSBORDER_FEE', payload: value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No crossborder fee</SelectItem>
                        <SelectItem value="yes">With crossborder fee</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </FilterSection>
                </div>

                {/* Column 5: Options */}
                <div className="space-y-6">
                  <FilterSection title="Options">
                    <FilterCheckbox
                      checked={filters.options.topCars}
                      onChange={() => handleOptionToggle('topCars')}
                      label="Top cars"
                      count={counts.options.topCars}
                    />
                    <FilterCheckbox
                      checked={filters.options.cityDelivery}
                      onChange={() => handleOptionToggle('cityDelivery')}
                      label="City delivery"
                      count={counts.options.cityDelivery}
                    />
                    <FilterCheckbox
                      checked={filters.options.realPhotos}
                      onChange={() => handleOptionToggle('realPhotos')}
                      label="Real photos"
                      count={counts.options.realPhotos}
                    />
                    <FilterCheckbox
                      checked={filters.options.freeCancellation}
                      onChange={() => handleOptionToggle('freeCancellation')}
                      label="Free cancelation"
                      count={counts.options.freeCancellation}
                    />
                    <FilterCheckbox
                      checked={filters.options.unlimitedMileage}
                      onChange={() => handleOptionToggle('unlimitedMileage')}
                      label="Unlimited mileage"
                      count={counts.options.unlimitedMileage}
                    />
                    <FilterCheckbox
                      checked={filters.options.secondDriver}
                      onChange={() => handleOptionToggle('secondDriver')}
                      label="The second driver in the contract"
                      count={counts.options.secondDriver}
                    />
                    <FilterCheckbox
                      checked={filters.options.guaranteedModel}
                      onChange={() => handleOptionToggle('guaranteedModel')}
                      label="Guaranteed car model"
                      count={counts.options.guaranteedModel}
                    />
                  </FilterSection>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between p-6 border-t sticky bottom-0 bg-white">
              <button
                onClick={() => dispatch({ type: 'RESET_FILTERS' })}
                className="text-sm text-primary hover:underline"
              >
                Reset all filters
              </button>
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-primary hover:bg-primary/90 text-white"
                size="lg"
              >
                View {totalCars} cars
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
