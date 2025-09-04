'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barre de navigation supérieure */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-primary">FoodExpress</span>
          </Link>

          {/* Barre de recherche - Version desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Rechercher un restaurant, une cuisine ou un plat..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
              <span className="sr-only">Mon compte</span>
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                0
              </span>
              <span className="sr-only">Panier</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </div>
        </div>

        {/* Barre de recherche - Version mobile */}
        <div className="md:hidden pb-4 px-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 px-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Mon compte
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Panier (0)
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Mes commandes
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Aide
            </Button>
          </div>
        )}
      </div>

      {/* Navigation principale */}
      {/* <nav className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex space-x-8 h-12 items-center">
            <Link href="/restaurants" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              Restaurants
            </Link>
            <Link href="/menus" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              Menus
            </Link>
            <Link href="/promotions" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              Promotions
            </Link>
            <Link href="/a-propos" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </nav> */}
    </header>
  );
}
