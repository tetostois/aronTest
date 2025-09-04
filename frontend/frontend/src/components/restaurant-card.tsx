import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';

type RestaurantCardProps = {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  cuisine: string;
  deliveryTime: string;
  deliveryFee: string;
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
}: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${id}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded-full text-sm font-medium">
            ⭐ {rating.toFixed(1)}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <Badge variant="secondary">{cuisine}</Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>🕒 {deliveryTime}</span>
            <span>🚚 {deliveryFee}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
