'use client'

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/shared/components/LanguageProvider";

export const HeroSection = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [keywords, setKeywords] = useState("");

  const handleSearch = () => {
    if (keywords.trim()) {
      router.push(`/cars?search=${encodeURIComponent(keywords)}`);
    } else {
      router.push('/cars');
    }
  };

  const handleCarRental = () => {
    router.push('/cars');
  };

  const handleHotelsVillas = () => {
    router.push('/apartments');
  };

  return (
    <section className="relative bg-gradient-hero py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-8">
              {t("rentCarsHotelsVillas")}
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-12">
            <div className="flex w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 flex items-center px-4">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <Input
                  type="text"
                  placeholder={t("keywordsPlaceholder")}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="border-0 focus:ring-0 text-lg py-4"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-4 text-lg font-semibold rounded-none"
              >
                {t("searchButton")}
              </Button>
            </div>
          </div>

          {/* Two Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-8xl mx-auto">
            {/* Car Rental Card */}
            <div 
              className="bg-white rounded-2xl shadow-deep overflow-hidden cursor-pointer hover:shadow-primary transition-smooth group"
              onClick={handleCarRental}
            >
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop&crop=center"
                  alt="Red sports car on mountain road"
                  fill
                  className="object-cover group-hover:scale-105 transition-smooth duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("rentACar")}
                </h2>
                <Button 
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-3 font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCarRental();
                  }}
                >
                  {t("exploreOurFleet")}
                </Button>
              </div>
            </div>

            {/* Hotels & Villas Card */}
            <div 
              className="bg-white rounded-2xl shadow-deep overflow-hidden cursor-pointer hover:shadow-primary transition-smooth group"
              onClick={handleHotelsVillas}
            >
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&crop=center"
                  alt="Modern living room with mountain view"
                  fill
                  className="object-cover group-hover:scale-105 transition-smooth duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("hotelsVillas")}
                </h2>
                <Button 
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-3 font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHotelsVillas();
                  }}
                >
                  {t("bookNow")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};