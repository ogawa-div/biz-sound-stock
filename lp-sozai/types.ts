export enum ThemeType {
  MODERN = 'modern', // Energetic, Gyms/Active
  ELEGANT = 'elegant', // Relaxing, Salons/Restaurants
  CLEAN = 'clean', // Professional, Office/Retail
  POP = 'pop', // Playful, Casual Dining/Teen
  LUXURY = 'luxury', // High-end, Bars/Hotels
  NATURE = 'nature', // Organic, Yoga/Florist
  JAPAN = 'japan', // Traditional, Sushi/Ryokan
  CYBER = 'cyber', // Tech, Gaming/Bar
  RETRO = 'retro', // Vintage, Diner/Clothes
  LOFI = 'lofi', // Chill, Pixel/Windows95
  NORDIC = 'nordic', // Minimal, Lifestyle
  BOLD = 'bold', // Brutalist, Street
  LOFI_WARM = 'lofi_warm', // Cafe, Study, Handwriting
  CITY_POP = 'city_pop', // 80s Night, VHS, Neon
  ANALOG = 'analog', // Cassette, DIY, Collage
  VAPORWAVE = 'vaporwave', // Aesthetic, 90s Web, Statue
  ABSTRACT = 'abstract', // Jazz Hop, Collage, Torn Paper
  RAINY = 'rainy', // Midnight, Glassmorphism, Melancholy
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  comment: string;
  image: string;
}