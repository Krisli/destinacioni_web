'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface BookingLoaderProps {
  visible: boolean;
}

export const BookingLoader = ({ visible }: BookingLoaderProps) => {
  const [showLoader, setShowLoader] = useState(visible);

  useEffect(() => {
    setShowLoader(visible);
  }, [visible]);

  if (!showLoader) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div className="text-center">
          {/* Animated Logo */}
          <div className="relative">
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src="/logo.svg"
                alt="Logo"
                fill
                className="object-contain opacity-40 grayscale"
              />
              {/* Filling animation overlay */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 booking-fill-animation" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bookingFill {
          0% {
            clip-path: inset(100% 0 0 0);
            opacity: 0.2;
          }
          50% {
            clip-path: inset(0 0 0 0);
            opacity: 0.5;
          }
          100% {
            clip-path: inset(100% 0 0 0);
            opacity: 0.2;
          }
        }
        
        .booking-fill-animation {
          animation: bookingFill 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

