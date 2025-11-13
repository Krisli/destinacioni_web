/**
 * Images API
 * Handles image uploads to the .NET backend
 */

import { ApiError } from './client';

// API base URL from environment
const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 
    'http://destination-alb-1339224077.eu-central-1.elb.amazonaws.com/api';
};

/**
 * Get stored JWT token for authentication
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const tokenCookie = cookies.find(cookie => cookie.startsWith('jwt_token='));
    return tokenCookie ? tokenCookie.substring('jwt_token='.length) : null;
  } catch {
    return null;
  }
}

/**
 * Upload images for an owner (car, apartment, etc.)
 * @param ownerType - Type of owner (e.g., 'Car', 'Apartment')
 * @param ownerId - UUID of the owner
 * @param files - Array of File objects to upload
 * @returns Array of uploaded image data
 */
export async function uploadImages(
  ownerType: string,
  ownerId: string,
  files: File[]
): Promise<Array<{ id: string; url: string; contentType: string; sizeBytes: number }>> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append('ownerType', ownerType);
    formData.append('ownerId', ownerId);
    
    // Append each file
    files.forEach((file) => {
      formData.append('files', file);
    });

    // Build URL
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/images`;

    // Make request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        // Don't set Content-Type - browser will set it with boundary for FormData
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: unknown;
      let errorMessage: string;

      try {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          errorData = await response.json();
          const data = errorData as Record<string, unknown>;
          errorMessage = 
            (typeof data.message === 'string' ? data.message : null) ||
            (typeof data.error === 'string' ? data.error : null) ||
            (Array.isArray(data.errors) && data.errors.length > 0 
              ? String(data.errors[0]) 
              : null) ||
            response.statusText ||
            `HTTP ${response.status}`;
        } else {
          const text = await response.text();
          errorMessage = text || response.statusText || `HTTP ${response.status}`;
          errorData = { text };
        }
      } catch {
        errorMessage = response.statusText || `HTTP ${response.status}`;
        errorData = null;
      }

      throw new ApiError(
        errorMessage,
        response.status,
        response.statusText,
        errorData
      );
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    
    // If response is not JSON, return empty array
    return [];
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Invalid image data. Please check the files and try again.');
      }
      if (error.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (error.status === 403) {
        throw new Error('You do not have permission to upload images.');
      }
      if (error.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    throw error;
  }
}

/**
 * Delete an image by ID
 * @param imageId - UUID of the image to delete
 */
export async function deleteImage(imageId: string): Promise<void> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    // Build URL
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/images/${imageId}`;

    // Make request
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: unknown;
      let errorMessage: string;

      try {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          errorData = await response.json();
          const data = errorData as Record<string, unknown>;
          errorMessage = 
            (typeof data.message === 'string' ? data.message : null) ||
            (typeof data.error === 'string' ? data.error : null) ||
            response.statusText ||
            `HTTP ${response.status}`;
        } else {
          const text = await response.text();
          errorMessage = text || response.statusText || `HTTP ${response.status}`;
          errorData = { text };
        }
      } catch {
        errorMessage = response.statusText || `HTTP ${response.status}`;
        errorData = null;
      }

      throw new ApiError(
        errorMessage,
        response.status,
        response.statusText,
        errorData
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Image not found.');
      }
      if (error.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (error.status === 403) {
        throw new Error('You do not have permission to delete this image.');
      }
      if (error.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    throw error;
  }
}

