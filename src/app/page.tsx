import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturedCars } from '@/components/landing/FeaturedCars';
import { PopularDestinations } from '@/components/landing/PopularDestinations';
import { FeaturedVehicleTypes } from '@/components/landing/FeaturedVehicleTypes';
import { TrustStrip } from '@/components/landing/TrustStrip';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { VendorCTA } from '@/components/landing/VendorCTA';
import { ModernFooter } from '@/components/landing/ModernFooter';
import { ModernHeader } from '@/components/landing/ModernHeader';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />
      <HeroSection />
      <FeaturedCars />
      <PopularDestinations />
      <FeaturedVehicleTypes />
      <TrustStrip />
      <HowItWorks />
      <VendorCTA />
      <ModernFooter />
    </div>
  );
}
