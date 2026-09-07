export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  variants: {
    colors?: { name: string; value: string }[];
    sizes?: string[];
  };
  inStock: boolean;
  featured: boolean;
  bestSeller: boolean;
  reviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  orders: Order[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered';
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
