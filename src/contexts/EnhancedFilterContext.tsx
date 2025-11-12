'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface FilterState {
  location: string[];
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  carType: string;
  transmission: string;
  fuelType: string;
  seats: string;
  features: string[];
  suppliers: string[];
  priceRange: [number, number];
  sortBy: string;
  quickFilters: {
    unlimitedMileage: boolean;
    freeCancellation: boolean;
    instantConfirmation: boolean;
  };
  // New filters
  carBrand: string;
  deposit: string[];
  depositAmount: string;
  paymentMethod: string[];
  drive: string[];
  insurance: string[];
  crossborderFee: string;
  options: {
    topCars: boolean;
    cityDelivery: boolean;
    realPhotos: boolean;
    freeCancellation: boolean;
    unlimitedMileage: boolean;
    secondDriver: boolean;
    guaranteedModel: boolean;
  };
}

type FilterAction =
  | { type: 'SET_LOCATION'; payload: string[] }
  | { type: 'SET_PICKUP_LOCATION'; payload: string }
  | { type: 'SET_DROPOFF_LOCATION'; payload: string }
  | { type: 'SET_PICKUP_DATE'; payload: string }
  | { type: 'SET_DROPOFF_DATE'; payload: string }
  | { type: 'SET_CAR_TYPE'; payload: string }
  | { type: 'SET_TRANSMISSION'; payload: string }
  | { type: 'SET_FUEL_TYPE'; payload: string }
  | { type: 'SET_SEATS'; payload: string }
  | { type: 'SET_FEATURES'; payload: string[] }
  | { type: 'SET_SUPPLIERS'; payload: string[] }
  | { type: 'SET_PRICE_RANGE'; payload: [number, number] }
  | { type: 'SET_SORT_BY'; payload: string }
  | { type: 'SET_QUICK_FILTER'; payload: { key: keyof FilterState['quickFilters']; value: boolean } }
  | { type: 'SET_CAR_BRAND'; payload: string }
  | { type: 'SET_DEPOSIT'; payload: string[] }
  | { type: 'SET_DEPOSIT_AMOUNT'; payload: string }
  | { type: 'SET_PAYMENT_METHOD'; payload: string[] }
  | { type: 'SET_DRIVE'; payload: string[] }
  | { type: 'SET_INSURANCE'; payload: string[] }
  | { type: 'SET_CROSSBORDER_FEE'; payload: string }
  | { type: 'SET_OPTION'; payload: { key: keyof FilterState['options']; value: boolean } }
  | { type: 'RESET_FILTERS' };

const initialState: FilterState = {
  location: [],
  pickupLocation: '',
  dropoffLocation: 'same',
  pickupDate: '',
  dropoffDate: '',
  carType: 'all',
  transmission: 'all',
  fuelType: 'all',
  seats: 'all',
  features: [],
  suppliers: [],
  priceRange: [0, 200],
  sortBy: 'recommended',
  quickFilters: {
    unlimitedMileage: false,
    freeCancellation: false,
    instantConfirmation: false,
  },
  carBrand: 'any',
  deposit: [],
  depositAmount: 'any',
  paymentMethod: [],
  drive: [],
  insurance: [],
  crossborderFee: 'no',
  options: {
    topCars: false,
    cityDelivery: false,
    realPhotos: false,
    freeCancellation: false,
    unlimitedMileage: false,
    secondDriver: false,
    guaranteedModel: false,
  },
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_PICKUP_LOCATION':
      return { ...state, pickupLocation: action.payload };
    case 'SET_DROPOFF_LOCATION':
      return { ...state, dropoffLocation: action.payload };
    case 'SET_PICKUP_DATE':
      return { ...state, pickupDate: action.payload };
    case 'SET_DROPOFF_DATE':
      return { ...state, dropoffDate: action.payload };
    case 'SET_CAR_TYPE':
      return { ...state, carType: action.payload };
    case 'SET_TRANSMISSION':
      return { ...state, transmission: action.payload };
    case 'SET_FUEL_TYPE':
      return { ...state, fuelType: action.payload };
    case 'SET_SEATS':
      return { ...state, seats: action.payload };
    case 'SET_FEATURES':
      return { ...state, features: action.payload };
    case 'SET_SUPPLIERS':
      return { ...state, suppliers: action.payload };
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_QUICK_FILTER':
      return {
        ...state,
        quickFilters: {
          ...state.quickFilters,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_CAR_BRAND':
      return { ...state, carBrand: action.payload };
    case 'SET_DEPOSIT':
      return { ...state, deposit: action.payload };
    case 'SET_DEPOSIT_AMOUNT':
      return { ...state, depositAmount: action.payload };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    case 'SET_DRIVE':
      return { ...state, drive: action.payload };
    case 'SET_INSURANCE':
      return { ...state, insurance: action.payload };
    case 'SET_CROSSBORDER_FEE':
      return { ...state, crossborderFee: action.payload };
    case 'SET_OPTION':
      return {
        ...state,
        options: {
          ...state.options,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'RESET_FILTERS':
      return initialState;
    default:
      return state;
  }
}

interface FilterContextType {
  filters: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  getActiveFilterCount: () => number;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, dispatch] = useReducer(filterReducer, initialState);

  const getActiveFilterCount = () => {
    let count = 0;
    
    if (filters.location.length > 0) count++;
    if (filters.pickupLocation) count++;
    if (filters.dropoffLocation && filters.dropoffLocation !== 'same') count++;
    if (filters.pickupDate) count++;
    if (filters.dropoffDate) count++;
    if (filters.carType !== 'all') count++;
    if (filters.transmission !== 'all') count++;
    if (filters.fuelType !== 'all') count++;
    if (filters.seats !== 'all') count++;
    if (filters.features.length > 0) count++;
    if (filters.suppliers.length > 0) count++;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 200) count++;
    if (filters.quickFilters.unlimitedMileage) count++;
    if (filters.quickFilters.freeCancellation) count++;
    if (filters.quickFilters.instantConfirmation) count++;
    if (filters.carBrand !== 'any') count++;
    if (filters.deposit.length > 0) count++;
    if (filters.depositAmount !== 'any') count++;
    if (filters.paymentMethod.length > 0) count++;
    if (filters.drive.length > 0) count++;
    if (filters.insurance.length > 0) count++;
    if (filters.crossborderFee !== 'no') count++;
    if (filters.options.topCars) count++;
    if (filters.options.cityDelivery) count++;
    if (filters.options.realPhotos) count++;
    if (filters.options.freeCancellation) count++;
    if (filters.options.unlimitedMileage) count++;
    if (filters.options.secondDriver) count++;
    if (filters.options.guaranteedModel) count++;
    
    return count;
  };

  return (
    <FilterContext.Provider value={{ filters, dispatch, getActiveFilterCount }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
