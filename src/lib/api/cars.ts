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
 * Car image from API
 */
export interface CarImage {
  id: string;
  url: string;
  contentType: string;
  sizeBytes: number;
}

/**
 * Car response from GET /cars endpoint
 * Matches the .NET API response structure
 */
export interface CarResponse {
  id: string;
  makeId: string;
  makeName: string;
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
  images: CarImage[];
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
 * Get all cars for the current vendor
 * @returns Array of cars
 */
export async function getCars(): Promise<CarResponse[]> {
  try {
    const response = await api.get<CarResponse[]>('/cars');
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (error.status === 403) {
        throw new Error('You do not have permission to view cars.');
      }
      if (error.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    throw error;
  }
}

/**
 * Get a single car by ID
 * @param carId - The ID of the car to fetch
 * @returns Car response
 */
export async function getCarById(carId: string): Promise<CarResponse> {
  try {
    const response = await api.get<CarResponse>(`/cars/${carId}`);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Car not found.');
      }
      if (error.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (error.status === 403) {
        throw new Error('You do not have permission to view this car.');
      }
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

/**
 * Update an existing car
 * @param carId - The ID of the car to update
 * @param carData - Car data to update
 * @returns Updated car response
 */
export async function updateCar(carId: string, carData: CreateCarRequest): Promise<CarResponse> {
  try {
    const response = await api.put<CarResponse>(`/cars/${carId}`, carData);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Invalid car data. Please check all fields.');
      }
      if (error.status === 404) {
        throw new Error('Car not found.');
      }
      if (error.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (error.status === 403) {
        throw new Error('You do not have permission to update this car.');
      }
      if (error.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    throw error;
  }
}

/**
 * Delete a car
 * @param carId - The ID of the car to delete
 */
export async function deleteCar(carId: string): Promise<void> {
  try {
    await api.delete(`/cars/${carId}`);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Car not found.');
      }
      if (error.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (error.status === 403) {
        throw new Error('You do not have permission to delete this car.');
      }
      if (error.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    throw error;
  }
}

