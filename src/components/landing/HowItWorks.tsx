'use client'

import { Search, MousePointer, CreditCard } from "lucide-react";
import { useLanguage } from "@/shared/components/LanguageProvider";

const steps = [
  {
    number: 1,
    icon: Search,
    titleKey: "searchSelect",
    descriptionKey: "findPerfectCar"
  },
  {
    number: 2, 
    icon: MousePointer,
    titleKey: "bookSecurely",
    descriptionKey: "instantConfirmation"
  },
  {
    number: 3,
    icon: CreditCard,
    titleKey: "enjoyRide",
    descriptionKey: "pickupDrive"
  }
];

export const HowItWorks = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t("howItWorks")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("simpleSteps")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="text-center">
                {/* Step Number */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-primary">
                    {step.number}
                  </div>
                  
                  {/* Connector Line (except for last step) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-border -translate-y-1/2 -z-10" />
                  )}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-card rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {t(step.titleKey)}
                </h3>
                <p className="text-muted-foreground">
                  {t(step.descriptionKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};