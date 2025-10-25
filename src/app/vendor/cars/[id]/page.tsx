'use client'

import React from 'react';
import { CarEditForm } from '@/components/vendor/cars/CarEditForm';

interface EditCarPageProps {
  params: {
    id: string;
  };
}

export default function EditCarPage({ params }: EditCarPageProps) {
  return <CarEditForm carId={params.id} />;
}
