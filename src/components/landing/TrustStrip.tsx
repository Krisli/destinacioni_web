'use client'

import { Shield, CreditCard, Clock, XCircle } from "lucide-react";
import { useLanguage } from "@/shared/components/LanguageProvider";

const trustFeatures = [
  {
    icon: Shield,
    titleKey: "verifiedAgencies",
    descriptionKey: "allPartnersVetted"
  },
  {
    icon: CreditCard,
    titleKey: "securePayments",
    descriptionKey: "sslEncrypted"
  },
  {
    icon: Clock,
    titleKey: "support247",
    descriptionKey: "roundClock"
  },
  {
    icon: XCircle,
    titleKey: "freeCancellationOptions",
    descriptionKey: "flexiblePolicies"
  }
];

export const TrustStrip = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-deep transition-smooth text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};