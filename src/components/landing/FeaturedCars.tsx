'use client'

import { Star, Users, Fuel, Settings, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useLanguage } from "@/shared/components/LanguageProvider";

const featuredCars = [
  {
    id: 1,
    name: "BMW 3 Series",
    category: "Luxury Sedan",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=center",
    price: 89,
    rating: 4.8,
    reviews: 124,
    specs: {
      passengers: 5,
      transmission: "Automatic",
      fuel: "Petrol"
    },
    features: ["A/C", "Bluetooth", "GPS"]
  },
  {
    id: 2,
    name: "Mercedes C-Class",
    category: "Premium Sedan",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=center",
    price: 95,
    rating: 4.9,
    reviews: 89,
    specs: {
      passengers: 5,
      transmission: "Automatic", 
      fuel: "Petrol"
    },
    features: ["A/C", "Bluetooth", "GPS", "Parking sensors"]
  },
  {
    id: 3,
    name: "Toyota Yaris",
    category: "Economy Hatchback",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop&crop=center",
    price: 35,
    rating: 4.6,
    reviews: 156,
    specs: {
      passengers: 5,
      transmission: "Manual",
      fuel: "Petrol"
    },
    features: ["A/C", "Bluetooth"]
  },
  {
    id: 4,
    name: "Volkswagen Golf",
    category: "Compact Hatchback",
    image: "https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop&crop=center",
    price: 45,
    rating: 4.7,
    reviews: 98,
    specs: {
      passengers: 5,
      transmission: "Automatic",
      fuel: "Petrol"
    },
    features: ["A/C", "Bluetooth", "USB"]
  }
];

export const FeaturedCars = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const handleCarClick = (carId: number) => {
    // Navigate to cars page with this car potentially pre-selected
    router.push(`/cars?featured=${carId}`);
  };

  const handleBookNow = (carId: number) => {
    // Navigate directly to booking for this car
    router.push(`/cars?book=${carId}`);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t("featuredCars")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("handpicked")}
          </p>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredCars.map((car) => (
              <CarouselItem key={car.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="bg-card rounded-xl shadow-card hover:shadow-deep transition-smooth overflow-hidden">
                  {/* Car Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover hover:scale-105 transition-smooth duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        {car.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-card-foreground mb-1">
                          {car.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{car.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{car.reviews}+ reviews</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          €{car.price}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          per day
                        </div>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{car.specs.passengers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="h-4 w-4" />
                        <span>{car.specs.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-4 w-4" />
                        <span>{car.specs.fuel}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {car.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCarClick(car.id)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleBookNow(car.id)}
                        size="sm"
                        className="flex-1"
                      >
                        {t("bookNow")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};