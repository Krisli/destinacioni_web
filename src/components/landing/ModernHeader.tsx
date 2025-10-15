// src/components/landing/ModernHeader.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Menu, X, Globe, User, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/shared/components/LanguageProvider'
// Lazy-load the modal to cut JS on landing
import dynamic from 'next/dynamic'
const SignInModal = dynamic(() => import('@/components/auth/SignInModal'), { ssr: false })

import logo from '@/assets/logo.svg' // ensure next.config.js handles svg OR export a PNG

export function ModernHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleLanguage = () => setLanguage(language === 'en' ? 'al' : 'en')
  const handleAddListing = () => router.push('/vendor')

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-card/95 backdrop-blur-md shadow-card py-2' : 'bg-transparent py-4'
      )}
      role="banner"
    >
      {/* Skip link for accessibility */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 bg-white px-3 py-2 rounded">
        {t('skipToContent') ?? 'Skip to content'}
      </a>

      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" aria-label="Destinacioni home">
            {/* If using SVG, you can keep <Image> by exporting a static file or use an inline SVG */}
            <Image
              src={logo as unknown as string}
              alt="Destinacioni.com"
              width={40}
              height={40}
              priority
              className="h-10 w-10 transition-transform hover:scale-105"
            />
            <div className="flex flex-col">
              <div
                className={cn('text-xl font-bold transition-colors leading-none', isScrolled ? 'text-primary' : 'text-white')}
              >
                DESTINACIONI
              </div>
              <div
                className={cn('text-xs font-medium transition-colors leading-none', isScrolled ? 'text-muted-foreground' : 'text-white/80')}
                aria-hidden
              >
                .com
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Primary">
            <Link
              href="/"
              className={cn('font-medium transition-colors hover:text-primary', isScrolled ? 'text-foreground' : 'text-white')}
            >
              {t('home')}
            </Link>
            <Link
              href="/cars"
              className={cn('font-medium transition-colors hover:text-primary', isScrolled ? 'text-foreground' : 'text-white')}
            >
              {t('cars')}
            </Link>
            <Link
              href="/apartments"
              className={cn('font-medium transition-colors hover:text-primary', isScrolled ? 'text-foreground' : 'text-white')}
            >
              {t('apartments')}
            </Link>
            <Link
              href="/contact"
              className={cn('font-medium transition-colors hover:text-primary', isScrolled ? 'text-foreground' : 'text-white')}
            >
              {t('contact')}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className={cn('gap-1', isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80')}
            >
              <Globe className="h-4 w-4" />
              {language.toUpperCase()}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSignInModalOpen(true)}
              className={cn('gap-1', isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80')}
            >
              <User className="h-4 w-4" />
              {t('signIn')}
            </Button>

            <Button onClick={handleAddListing} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              {t('addListing')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className={cn('md:hidden', isScrolled ? 'text-foreground' : 'text-white')}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div id="mobile-nav" className="md:hidden mt-4 pb-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4 pt-4" aria-label="Mobile primary">
              {[
                { href: '/', label: t('home') },
                { href: '/cars', label: t('cars') },
                { href: '/apartments', label: t('apartments') },
                { href: '/contact', label: t('contact') },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn('font-medium transition-colors', isScrolled ? 'text-foreground' : 'text-white')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex items-center space-x-4 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className={cn('gap-1', isScrolled ? 'text-foreground' : 'text-white')}
                >
                  <Globe className="h-4 w-4" />
                  {language.toUpperCase()}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSignInModalOpen(true)}
                  className={cn('gap-1', isScrolled ? 'text-foreground' : 'text-white')}
                >
                  <User className="h-4 w-4" />
                  {t('signIn')}
                </Button>

                <Button onClick={handleAddListing} size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  {t('addListing')}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Sign In Modal */}
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </header>
  )
}
