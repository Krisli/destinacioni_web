// app/(customer)/page.tsx
import type { Metadata } from 'next'

// Server Components (no "use client")
import { ModernHeader } from '@/components/landing/ModernHeader'
import { TrustStrip } from '@/components/landing/TrustStrip'
import { PopularDestinations } from '@/components/landing/PopularDestinations'
import { FeaturedVehicleTypes } from '@/components/landing/FeaturedVehicleTypes'
import { FeaturedCars } from '@/components/landing/FeaturedCars'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { VendorCTA } from '@/components/landing/VendorCTA'
import { ModernFooter } from '@/components/landing/ModernFooter'

// Client wrappers for interactive bits
import HeroSectionClient from '@/components/landing/HeroSection.client' // <-- add "use client" inside
// If your carousel is interactive, you can also wrap FeaturedCars as a client component later.

export const revalidate = 3600; // ISR: refresh once per hour

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Destinacioni – Rent Cars & Apartments in Albania'
  const description = 'Compare prices, explore destinations, and book verified cars & apartments. Simple, secure, local.'
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://destinacioni.com'

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Destinacioni',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function Page() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://destinacioni.com'

  // Optional: fetch some hero/popular data on the server for SEO-visible content
  // const popular = await fetch(`${siteUrl}/api/popular`, { next: { revalidate } }).then(r => r.json())

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Destinacioni',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <header>
        <ModernHeader />
      </header>

      <main id="main" className="contents">
        {/* Hero (interactive tabs/search lives in a client component) */}
        <HeroSectionClient />

        <TrustStrip />

        {/* Keep each section semantic and discoverable */}
        <section aria-labelledby="popular-destinations">
          <h2 id="popular-destinations" className="sr-only">Popular Destinations</h2>
          <PopularDestinations />
        </section>

        <section aria-labelledby="vehicle-types">
          <h2 id="vehicle-types" className="sr-only">Featured Vehicle Types</h2>
          <FeaturedVehicleTypes />
        </section>

        <section aria-labelledby="featured-cars">
          <h2 id="featured-cars" className="sr-only">Featured Cars</h2>
          <FeaturedCars />
        </section>

        <section aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="sr-only">How it works</h2>
          <HowItWorks />
        </section>

        <VendorCTA />
      </main>

      <footer>
        <ModernFooter />
      </footer>

      {/* JSON-LD for WebSite/SearchAction */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </div>
  )
}
