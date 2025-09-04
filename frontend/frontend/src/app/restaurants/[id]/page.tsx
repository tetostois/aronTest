'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Minus, Plus, ShoppingCart, Clock, MapPin, Star } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  category: string;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  cuisine: string;
  deliveryTime: string;
  deliveryFee: string;
  minOrder: string;
  address: string;
  menu: MenuItem[];
}

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    // Simuler un chargement de données
    const fetchRestaurant = async () => {
      try {
        // Dans une vraie application, on ferait un appel API ici
        // const response = await fetch(`/api/restaurants/${params.id}`);
        // const data = await response.json();
        
        // Données factices pour la démo
        const mockRestaurant: Restaurant = {
          id: params.id,
          name: 'Restaurant ' + params.id,
          description: 'Un délicieux restaurant proposant une cuisine raffinée avec des ingrédients frais et locaux.',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
          rating: 4.5,
          cuisine: 'Française',
          deliveryTime: '20-30 min',
          deliveryFee: 'Gratuit',
          minOrder: '5 000 FCFA',
          address: '123 Rue du Restaurant, Yaoundé, Cameroun',
          menu: [
            {
              id: '1',
              name: 'Poulet DG',
              description: 'Poulet avec des légumes et des plantains',
              price: '4 500 FCFA',
              category: 'Plats principaux',
              image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80'
            },
            {
              id: '2',
              name: 'Ndolè',
              description: 'Feuilles de ndolè avec de la viande ou du poisson',
              price: '3 500 FCFA',
              category: 'Plats principaux',
              image: 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1364&q=80'
            },
            {
              id: '3',
              name: 'Eru',
              description: 'Feuilles d\'eru avec de la viande et du poisson fumé',
              price: '3 000 FCFA',
              category: 'Plats principaux',
              image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
            },
            {
              id: '4',
              name: 'Salade César',
              description: 'Salade avec poulet grillé, croûtons et parmesan',
              price: '2 500 FCFA',
              category: 'Entrées',
              image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'
            },
            {
              id: '5',
              name: 'Tiramisu',
              description: 'Dessert italien au café et mascarpone',
              price: '2 000 FCFA',
              category: 'Desserts',
              image: 'https://images.unsplash.com/photo-1571993142257-eae0b44cf0f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'
            }
          ]
        };

        setRestaurant(mockRestaurant);
        
        // Extraire les catégories uniques
        const categories = [...new Set(mockRestaurant.menu.map(item => item.category))];
        if (categories.length > 0) {
          setActiveCategory(categories[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement du restaurant:', error);
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [params.id]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    setQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  const addToCart = (item: MenuItem) => {
    // Ici, vous pourriez ajouter la logique pour ajouter au panier
    console.log(`Ajout de ${quantities[item.id] || 1} ${item.name} au panier`);
    // Réinitialiser la quantité après l'ajout
    setQuantities(prev => ({
      ...prev,
      [item.id]: 0
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Restaurant non trouvé</h2>
          <p className="text-gray-600 dark:text-gray-300">Désolé, nous n'avons pas trouvé le restaurant que vous recherchez.</p>
        </div>
      </div>
    );
  }

  const categories = [...new Set(restaurant.menu.map(item => item.category))];
  const filteredItems = activeCategory 
    ? restaurant.menu.filter(item => item.category === activeCategory)
    : restaurant.menu;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* En-tête avec image du restaurant */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-6 text-white w-full">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center mr-4">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span>{restaurant.rating}</span>
                </div>
                <div className="flex items-center mr-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center">
                  <span>•</span>
                  <span className="ml-2">{restaurant.deliveryFee} de livraison</span>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{restaurant.address}</span>
              </div>
              <Badge variant="outline" className="mt-3 bg-white/20 text-white border-white/30 hover:bg-white/30">
                {restaurant.cuisine}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Notre menu</h2>
          
          {/* Catégories */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Liste des plats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {item.image && (
                  <div className="relative h-40 w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="font-bold text-primary">{item.price}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-md">
                      <button 
                        onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) - 1)}
                        className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-l-md"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 w-12 text-center">
                        {quantities[item.id] || 0}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) + 1)}
                        className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r-md"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => addToCart(item)}
                      disabled={!quantities[item.id] || quantities[item.id] <= 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
