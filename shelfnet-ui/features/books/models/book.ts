import { BookCategory } from "./book-category";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  tags: string[];
  category: BookCategory;
  description: string;
  stats: {
    pages: number;
    language: string;
    year: number;
  };
}

export interface TrendingBook {
  id: string;
  title: string;
  authors: string[];
  primaryAuthor: string;
  genre: string;
  categories: string[];
  tags: string[];
  thumbnail: string | null;
  year: number;
  avgRating: number;
  likes: number;
  reads: number;
  googleTrendingBoost: number;
  source: "GOOGLE" | "LOCAL";
  googleId: string | null;
  score: number;
}

export interface PopularShelfBook extends TrendingBook {}
