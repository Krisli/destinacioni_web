'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/shared/components/LanguageProvider';

export const VendorHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="bg-white border-b border-border h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Logo */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.svg"
            alt="Destinacioni"
            width={32}
            height={32}
            className="h-6 w-6 sm:h-8 sm:w-8"
          />
          <span className="text-lg sm:text-xl font-bold text-primary hidden sm:block">Destinacioni</span>
        </Link>
      </div>

      {/* Search - Hidden on mobile, visible on tablet+ */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search') || 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Settings - Hidden on mobile */}
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          <Settings className="h-4 w-4" />
        </Button>

        {/* User menu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="text-sm hidden sm:block">
            <div className="font-medium">{user?.name}</div>
            <div className="text-muted-foreground text-xs">{user?.email}</div>
          </div>
          <div className="sm:hidden">
            <div className="text-xs font-medium">{user?.name?.split(' ')[0]}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="p-2">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
