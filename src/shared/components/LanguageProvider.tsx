'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'al'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation keys - you can expand this or move to separate files
const translations = {
  en: {
    home: 'Home',
    cars: 'Cars',
    apartments: 'Apartments',
    contact: 'Contact',
    signIn: 'Sign In',
    addListing: 'Add Listing',
    skipToContent: 'Skip to content',
    yourJourneyStartsHere: 'Your Journey Starts Here',
    discoverAlbania: 'Discover the beauty of Albania with our premium car rentals and accommodations',
    pickup: 'Pickup Location',
    wherePickup: 'Where do you want to pick up?',
    dropoff: 'Drop-off Location',
    quickFilters: 'Quick Filters',
    automatic: 'Automatic',
    suv: 'SUV',
    budget: 'Under €50/day',
    cancellation: 'Free cancellation',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    whereStay: 'Where do you want to stay?',
    guests: 'Guests',
    search: 'Search',
    featuredCars: 'Featured Cars',
    handpicked: 'Handpicked vehicles for your perfect journey',
    bookNow: 'Book Now',
    popularDestinations: 'Popular Destinations',
    exploreAlbania: 'Explore the most beautiful places in Albania',
    viewCars: 'View Cars',
    howItWorks: 'How It Works',
    simpleSteps: 'Simple steps to your perfect journey',
    searchSelect: 'Search & Select',
    findPerfectCar: 'Find the perfect car for your needs',
    bookSecurely: 'Book Securely',
    instantConfirmation: 'Get instant confirmation',
    enjoyRide: 'Enjoy Your Ride',
    pickupDrive: 'Pick up and drive away',
    rentalAgency: 'Are you a rental agency?',
    listCarsToday: 'List your cars today and start earning',
    learnMore: 'Learn More',
    easyCalendar: 'Easy Calendar Management',
    conflictAlerts: 'Conflict Alerts',
    instantConfirmations: 'Instant Confirmations',
    verifiedAgencies: 'Verified Agencies',
    allPartnersVetted: 'All our partners are thoroughly vetted',
    securePayments: 'Secure Payments',
    sslEncrypted: 'SSL encrypted transactions',
    support247: '24/7 Support',
    roundClock: 'Round-the-clock customer support',
    freeCancellationOptions: 'Free Cancellation',
    flexiblePolicies: 'Flexible cancellation policies',
    featuredVehicleTypes: 'Vehicle Types',
    chooseVehicle: 'Choose the perfect vehicle for your journey',
    economy: 'Economy',
    compact: 'Compact',
    vanMinivan: 'Van/Minivan',
    luxury: 'Luxury',
    electric: 'Electric',
    // New keys for screenshot design
    rentCarsHotelsVillas: 'Rent Cars Hotels & Villas',
    keywordsPlaceholder: 'Keywords...',
    searchButton: 'SEARCH',
    rentACar: 'Rent a Car',
    hotelsVillas: 'Hotels & Villas',
    exploreOurFleet: 'EXPLORE OUR FLEET',
    bookNow: 'BOOK NOW',
  },
  al: {
    home: 'Ballina',
    cars: 'Makinat',
    apartments: 'Apartamentet',
    contact: 'Kontakti',
    signIn: 'Hyr',
    addListing: 'Shto Listim',
    skipToContent: 'Kalo në përmbajtje',
    yourJourneyStartsHere: 'Udhëtimi Juaj Fillon Këtu',
    discoverAlbania: 'Zbuloni bukurinë e Shqipërisë me makinat dhe akomodimet tona premium',
    pickup: 'Vendi i Marrjes',
    wherePickup: 'Ku doni të merrni makinën?',
    dropoff: 'Vendi i Dorëzimit',
    quickFilters: 'Filtrat e Shpejtë',
    automatic: 'Automatik',
    suv: 'SUV',
    budget: 'Nën €50/ditë',
    cancellation: 'Anulim falas',
    checkIn: 'Regjistrimi',
    checkOut: 'Çregjistrimi',
    whereStay: 'Ku doni të qëndroni?',
    guests: 'Të ftuar',
    search: 'Kërko',
    featuredCars: 'Makinat e Rekomanduara',
    handpicked: 'Makinat e zgjedhura për udhëtimin tuaj të përsosur',
    bookNow: 'Rezervo Tani',
    popularDestinations: 'Destinacionet Popullore',
    exploreAlbania: 'Eksploroni vendet më të bukura në Shqipëri',
    viewCars: 'Shiko Makinat',
    howItWorks: 'Si Funksionon',
    simpleSteps: 'Hapa të thjeshtë për udhëtimin tuaj të përsosur',
    searchSelect: 'Kërko dhe Zgjidh',
    findPerfectCar: 'Gjej makinën e përsosur për nevojat e tua',
    bookSecurely: 'Rezervo Sigurt',
    instantConfirmation: 'Merr konfirmim të menjëhershëm',
    enjoyRide: 'Gëzo Udhëtimin',
    pickupDrive: 'Merr dhe nisu',
    rentalAgency: 'A jeni agjensi qiraje?',
    listCarsToday: 'Listoni makinat tuaja sot dhe filloni të fitoni',
    learnMore: 'Mëso Më Shumë',
    easyCalendar: 'Menaxhimi i Lehtë i Kalendarit',
    conflictAlerts: 'Sinjalizimet e Konfliktit',
    instantConfirmations: 'Konfirmimet e Menjëhershme',
    verifiedAgencies: 'Agjensi të Verifikuara',
    allPartnersVetted: 'Të gjithë partnerët tanë janë kontrolluar plotësisht',
    securePayments: 'Pagesa të Sigurta',
    sslEncrypted: 'Transaksione të enkriptuara SSL',
    support247: 'Mbështetje 24/7',
    roundClock: 'Mbështetje klienti gjatë gjithë orës',
    freeCancellationOptions: 'Anulim Falas',
    flexiblePolicies: 'Politika fleksibile anulimi',
    featuredVehicleTypes: 'Llojet e Automjeteve',
    chooseVehicle: 'Zgjidhni automjetin e përsosur për udhëtimin tuaj',
    economy: 'Ekonomik',
    compact: 'Kompakt',
    vanMinivan: 'Furgon/Minivan',
    luxury: 'Luksoz',
    electric: 'Elektrik',
    // New keys for screenshot design
    rentCarsHotelsVillas: 'Qira Makinash Hotele & Vila',
    keywordsPlaceholder: 'Fjalë kyçe...',
    searchButton: 'KËRKO',
    rentACar: 'Qira Makine',
    hotelsVillas: 'Hotele & Vila',
    exploreOurFleet: 'EKSPLORO FLOTËN TONË',
    bookNow: 'REZERVO TANI',
  },
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en')

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'al')) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
