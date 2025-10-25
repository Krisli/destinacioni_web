'use client'

import React from 'react';
import { ApartmentEditForm } from '@/components/vendor/apartments/ApartmentEditForm';

interface EditApartmentPageProps {
  params: {
    id: string;
  };
}

export default function EditApartmentPage({ params }: EditApartmentPageProps) {
  return <ApartmentEditForm apartmentId={params.id} />;
}
