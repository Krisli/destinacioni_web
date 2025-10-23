'use client'

import { ReactNode } from 'react';
import { VendorSidebar } from '@/components/vendor/layout/VendorSidebar';
import { VendorHeader } from '@/components/vendor/layout/VendorHeader';

interface VendorLayoutProps {
  children: ReactNode;
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  // Middleware handles authentication, so we don't need to check here
  return (
    <div className="min-h-screen bg-background">
      <VendorHeader />
      <div className="flex">
        <VendorSidebar />
        <main className="flex-1 ml-64">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
