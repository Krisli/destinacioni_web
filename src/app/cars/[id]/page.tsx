'use client'

import { Suspense } from 'react';
import { CarDetailsHeader } from '@/components/cars/CarDetailsHeader';
import { CarDetailsContent } from '@/components/cars/CarDetailsContent';
import { CarDetailsSidebar } from '@/components/cars/CarDetailsSidebar';
import { CarDetailsSkeleton } from '@/components/cars/CarDetailsSkeleton';

interface CarDetailsPageProps {
  params: {
    id: string;
  };
  searchParams: {
    book?: string;
  };
}

export default function CarDetailsPage({ params, searchParams }: CarDetailsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<CarDetailsSkeleton />}>
        <CarDetailsHeader carId={params.id} />
        
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <main className="flex-1">
              <CarDetailsContent carId={params.id} />
            </main>
            
            {/* Sidebar - Booking */}
            <aside className="lg:w-96 flex-shrink-0">
              <div className="sticky top-8">
                <CarDetailsSidebar carId={params.id} searchParams={searchParams} />
              </div>
            </aside>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
