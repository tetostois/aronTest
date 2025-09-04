'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, CreditCard, Shield, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">FoodExpress</h3>
            <p className="text-gray-400 text-sm mb-4">
              Commandez vos plats préférés des meilleurs restaurants de votre ville et profitez d'une livraison rapide à votre porte.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/restaurants" className="hover:text-white transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/menus" className="hover:text-white transition-colors">
                  Menus du jour
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="hover:text-white transition-colors">
                  Promotions
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-white transition-colors">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contactez-nous
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>123 Rue de la Gastronomie, 75001 Paris, France</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <a href="tel:+33123456789" className="hover:text-white transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:contact@foodexpress.com" className="hover:text-white transition-colors">
                  contact@foodexpress.com
                </a>
              </li>
            </ul>
          </div>

          {/* Paiement et sécurité */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Paiement sécurisé</h3>
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="bg-white p-1.5 rounded">
                  <CreditCard className="h-6 w-6 text-gray-800" />
                </div>
                <div className="bg-white p-1.5 rounded">
                  <Shield className="h-6 w-6 text-gray-800" />
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Paiement 100% sécurisé avec cryptage SSL
              </p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Téléchargez notre application</h4>
              <div className="flex space-x-2">
                <button className="bg-black text-white text-xs px-3 py-2 rounded flex items-center">
                  <span className="text-xs">Disponible sur</span>
                  <span className="font-bold ml-1">App Store</span>
                </button>
                <button className="bg-black text-white text-xs px-3 py-2 rounded flex items-center">
                  <span className="text-xs">Disponible sur</span>
                  <span className="font-bold ml-1">Google Play</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>© {currentYear} FoodExpress. Tous droits réservés.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/conditions-generales" className="hover:text-white transition-colors">
              Conditions générales
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Préférences de cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
