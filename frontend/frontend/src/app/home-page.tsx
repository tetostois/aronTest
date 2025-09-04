'use client';

import { RestaurantCard } from '@/components/restaurant-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function HomePage() {
  // Données factices pour les restaurants (à remplacer par un appel API plus tard)
  const popularRestaurants = [
    {
      id: '1',
      name: 'Le Délicieux',
      description: 'Cuisine française raffinée avec des ingrédients locaux et de saison.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      rating: 4.7,
      cuisine: 'Française',
      deliveryTime: '20-30 min',
      deliveryFee: 'Gratuit',
    },
    {
      id: '2',
      name: 'Sushi Master',
      description: 'Sushis frais préparés par nos chefs japonais expérimentés.',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80',
      rating: 4.5,
      cuisine: 'Japonaise',
      deliveryTime: '30-45 min',
      deliveryFee: '500 FCFA',
    },
    {
      id: '3',
      name: 'La Pizzeria',
      description: 'Pizzas cuites au feu de bois avec des ingrédients frais.',
      image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      rating: 4.3,
      cuisine: 'Italienne',
      deliveryTime: '25-40 min',
      deliveryFee: 'Gratuit',
    },
    {
      id: '4',
      name: 'Burger House',
      description: 'Les meilleurs burgers de la ville avec des frites maison croustillantes.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=699&q=80',
      rating: 4.6,
      cuisine: 'Américaine',
      deliveryTime: '20-35 min',
      deliveryFee: '300 FCFA',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* En-tête avec barre de recherche */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="relative">
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
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Restaurants populaires près de chez vous
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              description={restaurant.description}
              image={restaurant.image}
              rating={restaurant.rating}
              cuisine={restaurant.cuisine}
              deliveryTime={restaurant.deliveryTime}
              deliveryFee={restaurant.deliveryFee}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
