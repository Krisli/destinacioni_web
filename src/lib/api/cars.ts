/**
 * Cars API
 * Handles all car-related API calls to the .NET backend
 */

import { api, ApiError } from './client';

/**
 * Request payload for creating a car
 * Matches the .NET API endpoint structure
 */
export interface CreateCarRequest {
  makeId: string;              // UUID of the car make
  model: string;
  year: number;
  bodyType: string;
  transmission: string;
  fuelType: string;
  drive: string;
  seats: number;
  doors: number;
  luggage: number;
  color: string;
  licensePlate: string;
  vin: string;
}

/**
 * Response from creating a car
 * (Structure will be determined by the .NET API response)
 */
export interface CreateCarResponse {
  id: string;
  makeId: string;
  model: string;
  year: number;
  // ... other fields as returned by the API
}

/**
 * Car Make from API
 */
export interface CarMake {
  id: string;
  name: string;
}

/**
 * Get all car makes
 * @returns Array of car makes
 */
export async function getCarMakes(): Promise<CarMake[]> {
  try {
    const response = await api.get<CarMake[]>('/car-makes');
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    throw error;
  }
}

/**
 * Create a new car
 * @param carData - Car data to create
 * @returns Created car response
 */
export async function createCar(carData: CreateCarRequest): Promise<CreateCarResponse> {
  try {
    const response = await api.post<CreateCarResponse>('/cars', carData);
    return response;
  } catch (error) {
    // Enhance error messages
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Invalid car data. Please check all fields.');
      }
      if (error.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (error.status === 403) {
        throw new Error('You do not have permission to create cars.');
      }
      if (error.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    throw error;
  }
}

