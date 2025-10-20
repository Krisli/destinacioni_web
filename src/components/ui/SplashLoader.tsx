'use client'

import { useEffect, useState } from 'react';
import { Car } from 'lucide-react';

interface SplashLoaderProps {
  title: string;
  subtitle: string;
  visible: boolean;
}

export const SplashLoader = ({ title, subtitle, visible }: SplashLoaderProps) => {
  const [showLoader, setShowLoader] = useState(visible);

  useEffect(() => {
    setShowLoader(visible);
  }, [visible]);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 bg-gradient-hero flex items-center justify-center z-50">
      <div className="text-center text-white">
        {/* Animated Logo */}
        <div className="mb-8">
          <div className="relative">
            <Car className="h-16 w-16 mx-auto mb-4 animate-bounce" />
            <div className="absolute inset-0 h-16 w-16 mx-auto border-2 border-white/30 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold mb-4 animate-fade-in">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-white/90 mb-8 animate-fade-in-delay">
          {subtitle}
        </p>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};
