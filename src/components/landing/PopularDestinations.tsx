'use client'

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/shared/components/LanguageProvider";

const destinations = [
  {
    name: "Tirana",
    nameAL: "Tiranë",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
    description: "Capital city adventures"
  },
  {
    name: "Rinas Airport",
    nameAL: "Aeroporti Rinas",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop&crop=center",
    description: "Quick airport pickup"
  },
  {
    name: "Durrës",
    nameAL: "Durrës",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
    description: "Coastal beauty"
  },
  {
    name: "Vlorë",
    nameAL: "Vlorë",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center",
    description: "Riviera gateway"
  },
  {
    name: "Sarandë",
    nameAL: "Sarandë",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center",
    description: "Southern paradise"
  },
  {
    name: "Shkodër",
    nameAL: "Shkodër",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center",
    description: "Northern culture"
  }
];

export const PopularDestinations = () => {
  const router = useRouter();
  const { t, language } = useLanguage();

  const handleDestinationClick = (cityName: string) => {
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + 3);
    const dropoffDate = new Date();
    dropoffDate.setDate(dropoffDate.getDate() + 6);
    
    const searchParams = new URLSearchParams({
      location: cityName,
      pickup: `${pickupDate.toISOString().split('T')[0]}T10:00`,
      dropoff: `${dropoffDate.toISOString().split('T')[0]}T10:00`
    });
    
    router.push(`/cars?${searchParams.toString()}`);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t("popularDestinations")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("exploreAlbania")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={index}
              onClick={() => handleDestinationClick(destination.name)}
              className="group relative overflow-hidden rounded-xl cursor-pointer shadow-card hover:shadow-deep transition-smooth"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-smooth duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {language === "al" ? destination.nameAL : destination.name}
                  </h3>
                  <p className="text-sm text-white/80 mb-3">
                    {destination.description}
                  </p>
                  <div className="flex items-center text-white/90 text-sm font-medium group-hover:text-white transition-smooth">
                    <span>{t("viewCars")}</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-smooth" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};