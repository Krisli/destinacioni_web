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
    // Car listings translations
    findYourPerfectCar: 'Find Your Perfect Car',
    in: 'in',
    from: 'from',
    to: 'to',
    allCars: 'All Cars',
    vehiclesAvailable: 'vehicles available',
    averageRating: 'average rating',
    customerSupport: 'customer support',
    filters: 'Filters',
    clearAll: 'Clear All',
    location: 'Location',
    enterLocation: 'Enter location',
    pickupDate: 'Pickup Date',
    dropoffDate: 'Drop-off Date',
    vehicleType: 'Vehicle Type',
    selectVehicleType: 'Select vehicle type',
    allTypes: 'All Types',
    transmission: 'Transmission',
    selectTransmission: 'Select transmission',
    allTransmissions: 'All Transmissions',
    manual: 'Manual',
    maxPricePerDay: 'Max Price Per Day',
    selectMaxPrice: 'Select max price',
    anyPrice: 'Any Price',
    availableCars: 'Available Cars',
    showingResultsFor: 'Showing results for',
    allLocations: 'all locations',
    sortBy: 'Sort by',
    priceLowToHigh: 'Price: Low to High',
    priceHighToLow: 'Price: High to Low',
    highestRated: 'Highest Rated',
    mostPopular: 'Most Popular',
    reviews: 'reviews',
    viewDetails: 'View Details',
    loadMoreCars: 'Load More Cars',
    noCarsFound: 'No cars found',
    tryAdjustingFilters: 'Try adjusting your filters or search criteria',
    clearFilters: 'Clear Filters',
    carDetails: 'Car Details',
    detailedCarInformation: 'Detailed car information and specifications',
    bookThisCar: 'Book This Car',
    bookingSidebarPlaceholder: 'Booking sidebar placeholder',
    carDetailsContentPlaceholder: 'Car details content placeholder - you can copy your existing content here',
    // Additional translations for car listings
    loading: {
      title: 'Finding Your Perfect Car',
      subtitle: 'Searching through our fleet...',
    },
    cars: {
      foundCars: 'Found',
      carsText: 'cars',
      total: 'total',
      perDay: 'per day',
      available: 'Available',
      booked: 'Booked',
      recommended: 'Recommended',
      priceLowHigh: 'Price: Low to High',
      priceHighLow: 'Price: High to Low',
      highestRated: 'Highest Rated',
    },
    showOnMap: 'Show on Map',
    previous: 'Previous',
    next: 'Next',
    unavailable: 'Unavailable',
    learnMore: 'Learn More',
    quickFilters: 'Quick Filters',
    unlimitedMileage: 'Unlimited Mileage',
    instantConfirmation: 'Instant Confirmation',
    applyFilters: 'Apply Filters',
    mapPlaceholder: 'Interactive Map',
    mapDescription: 'View car locations on the map',
    adjustFilters: 'Adjust Filters',
    searchTips: 'Search Tips',
    tip1: 'Try different date ranges',
    tip2: 'Expand your location search',
    tip3: 'Check different vehicle types',
    // Header translations
    skipToContent: 'Skip to content',
    addListing: 'Add Listing',
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
    // Car listings translations
    findYourPerfectCar: 'Gjej Makinën Tënde Të Përsosur',
    in: 'në',
    from: 'nga',
    to: 'deri',
    allCars: 'Të Gjitha Makinat',
    vehiclesAvailable: 'automjete të disponueshme',
    averageRating: 'vlerësim mesatar',
    customerSupport: 'mbështetje klienti',
    filters: 'Filtrat',
    clearAll: 'Pastro Të Gjitha',
    location: 'Vendi',
    enterLocation: 'Shkruaj vendin',
    pickupDate: 'Data e Marrjes',
    dropoffDate: 'Data e Dorëzimit',
    vehicleType: 'Lloji i Automjetit',
    selectVehicleType: 'Zgjidh llojin e automjetit',
    allTypes: 'Të Gjitha Llojet',
    transmission: 'Transmetimi',
    selectTransmission: 'Zgjidh transmetimin',
    allTransmissions: 'Të Gjitha Transmetimet',
    manual: 'Manuale',
    maxPricePerDay: 'Çmimi Maksimal Për Ditë',
    selectMaxPrice: 'Zgjidh çmimin maksimal',
    anyPrice: 'Çdo Çmim',
    availableCars: 'Makinat e Disponueshme',
    showingResultsFor: 'Duke treguar rezultatet për',
    allLocations: 'të gjitha vendet',
    sortBy: 'Rendit sipas',
    priceLowToHigh: 'Çmimi: Nga i Uli në i Lartë',
    priceHighToLow: 'Çmimi: Nga i Lartë në i Uli',
    highestRated: 'Më të Vlerësuarat',
    mostPopular: 'Më të Popullarizuarat',
    reviews: 'vlerësime',
    viewDetails: 'Shiko Detajet',
    loadMoreCars: 'Ngarko Më Shumë Makina',
    noCarsFound: 'Nuk u gjetën makina',
    tryAdjustingFilters: 'Provo të rregullosh filtrat ose kriteret e kërkimit',
    clearFilters: 'Pastro Filtrat',
    carDetails: 'Detajet e Makinës',
    detailedCarInformation: 'Informacione të detajuara të makinës dhe specifikime',
    bookThisCar: 'Rezervo Këtë Makinë',
    bookingSidebarPlaceholder: 'Vendmbajtës i anës së rezervimit',
    carDetailsContentPlaceholder: 'Vendmbajtës i përmbajtjes së detajeve të makinës - mund të kopjosh përmbajtjen ekzistuese këtu',
    // Additional translations for car listings
    loading: {
      title: 'Duke Gjetur Makinën Tënde Të Përsosur',
      subtitle: 'Duke kërkuar në flotën tonë...',
    },
    cars: {
      foundCars: 'U gjetën',
      carsText: 'makina',
      total: 'total',
      perDay: 'për ditë',
      available: 'E Disponueshme',
      booked: 'E Rezervuar',
      recommended: 'E Rekomanduar',
      priceLowHigh: 'Çmimi: Nga i Uli në i Lartë',
      priceHighLow: 'Çmimi: Nga i Lartë në i Uli',
      highestRated: 'Më të Vlerësuarat',
    },
    showOnMap: 'Shiko në Hartë',
    previous: 'Mëparshme',
    next: 'Tjetra',
    unavailable: 'E Padisponueshme',
    learnMore: 'Mëso Më Shumë',
    quickFilters: 'Filtrat e Shpejtë',
    unlimitedMileage: 'Kilometrazh i Pakufizuar',
    instantConfirmation: 'Konfirmim i Menjëhershëm',
    applyFilters: 'Apliko Filtrat',
    mapPlaceholder: 'Harta Interaktive',
    mapDescription: 'Shiko vendndodhjet e makinave në hartë',
    adjustFilters: 'Rregullo Filtrat',
    searchTips: 'Këshilla për Kërkim',
    tip1: 'Provo vargje të ndryshme datash',
    tip2: 'Zgjero kërkimin e vendit',
    tip3: 'Kontrollo lloje të ndryshme automjetesh',
    // Header translations
    skipToContent: 'Kalo në përmbajtje',
    addListing: 'Shto Listim',
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
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
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
