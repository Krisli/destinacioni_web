'use client'

import { Plus, BookOpen, Calendar, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/shared/components/LanguageProvider";

export const VendorCTA = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const handleAddListing = () => {
    router.push("/vendor");
  };

  const handleLearnMore = () => {
    // Navigate to vendor info page or scroll to more info
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="bg-gradient-card rounded-2xl p-8 lg:p-12 shadow-deep">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-4">
              {t("rentalAgency")}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t("listCarsToday")}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={handleAddListing}
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                {t("addListing")}
              </Button>
              <Button 
                onClick={handleLearnMore}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                {t("learnMore")}
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground mb-1">
                    {t("easyCalendar")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time availability management with automated sync
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground mb-1">
                    {t("conflictAlerts")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic notifications to prevent double bookings
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground mb-1">
                    {t("instantConfirmations")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Immediate booking confirmations for customer satisfaction
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};