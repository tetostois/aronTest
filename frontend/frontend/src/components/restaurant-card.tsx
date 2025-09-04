import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Star } from 'lucide-react';

type RestaurantCardProps = {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  cuisine: string;
  deliveryTime: string;
  deliveryFee: string;
  minOrder?: string;
};

export function RestaurantCard({
  id,
  name,
  description,
  image,
  rating,
  cuisine,
  deliveryTime,
  deliveryFee,
  minOrder = '',
}: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${id}`} className="group block h-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="w-3 h-3 text-yellow-500 mr-1" />
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
            <Badge variant="secondary" className="ml-2 flex-shrink-0">
              {cuisine}
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 flex-1">
            {description}
          </p>
          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {deliveryTime}
              </span>
              <span>•</span>
              <span>{deliveryFee} {deliveryFee.toLowerCase() !== 'gratuit' ? 'livraison' : ''}</span>
            </div>
            {minOrder && (
              <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                Min. {minOrder}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
