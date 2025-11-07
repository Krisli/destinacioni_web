'use client'

import { Car, Truck, Zap, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/shared/components/LanguageProvider";

const vehicleTypes = [
  {
    id: "economy",
    icon: Car,
    titleKey: "economy",
    description: "Budget-friendly",
    param: "category",
    value: "economy"
  },
  {
    id: "compact",
    icon: Car,
    titleKey: "compact",
    description: "Perfect for city",
    param: "category", 
    value: "compact"
  },
  {
    id: "suv",
    icon: Truck,
    titleKey: "suv",
    description: "Space & comfort",
    param: "category",
    value: "suv"
  },
  {
    id: "van",
    icon: Truck,
    titleKey: "vanMinivan",
    description: "Group travel",
    param: "category",
    value: "van"
  },
  {
    id: "luxury",
    icon: Crown,
    titleKey: "luxury",
    description: "Premium experience",
    param: "category",
    value: "luxury"
  },
  {
    id: "electric",
    icon: Zap,
    titleKey: "electric",
    description: "Eco-friendly",
    param: "fuel",
    value: "electric"
  }
];

export const FeaturedVehicleTypes = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const handleTypeClick = (vehicleType: typeof vehicleTypes[0]) => {
    const searchParams = new URLSearchParams();
    searchParams.set(vehicleType.param, vehicleType.value);
    router.push(`/cars?${searchParams.toString()}`);
  };

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t("featuredVehicleTypes")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("chooseVehicle")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {vehicleTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                onClick={() => handleTypeClick(type)}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-deep transition-smooth cursor-pointer group text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-smooth">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  {t(type.titleKey)}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {type.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};