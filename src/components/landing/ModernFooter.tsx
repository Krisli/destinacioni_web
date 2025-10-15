import Link from "next/link";
import { MessageSquare, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ModernFooter = () => {
  return (
    <footer className="bg-primary-deep text-primary-deep-foreground">
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary">DESTINACIONI</div>
              <div className="text-sm font-medium text-white/60">.com</div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Your trusted partner for car rentals and accommodation in Albania. 
              Experience the beauty of Albania with our premium services.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Quick Links</h4>
            <div className="space-y-3">
              <Link 
                href="/" 
                className="block text-white/80 hover:text-white transition-smooth text-sm"
              >
                Home
              </Link>
              <Link 
                href="/cars" 
                className="block text-white/80 hover:text-white transition-smooth text-sm"
              >
                Cars
              </Link>
              <Link 
                href="/apartments" 
                className="block text-white/80 hover:text-white transition-smooth text-sm"
              >
                Apartments
              </Link>
              <Link 
                href="/vendor" 
                className="block text-white/80 hover:text-white transition-smooth text-sm"
              >
                List Your Property
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Support</h4>
            <div className="space-y-3">
              <Link 
                href="/about" 
                className="block text-white/80 hover:text-white transition-smooth text-sm"
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="block text-white/80 hover:text-white transition-smooth text-sm"
              >
                Contact
              </Link>
              <Link 
                href="/faq" 
                className="block text-white/80 hover:text-white transition-smooth text-sm"
              >
                FAQ
              </Link>
              <Link 
                href="/help" 
                className="block text-white/80 hover:text-white transition-smooth text-sm"
              >
                Help Center
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Legal</h4>
            <div className="space-y-3">
              <Link 
                href="/privacy" 
                className="block text-white/80 hover:text-white transition-smooth text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="block text-white/80 hover:text-white transition-smooth text-sm"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                className="block text-white/80 hover:text-white transition-smooth text-sm"
              >
                Cookie Policy
              </Link>
              <Link 
                href="/cancellation" 
                className="block text-white/80 hover:text-white transition-smooth text-sm"
              >
                Cancellation Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-white/60 text-sm">
            &copy; 2024 Destinacioni.com. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-white/60 text-sm">Available 24/7</span>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Button */}
      <Button 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-primary z-50 hover:scale-110 transition-transform"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </footer>
  );
};