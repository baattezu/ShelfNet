export type BookCategory =
  | "fiction"
  | "non-fiction"
  | "sci-fi"
  | "fantasy"
  | "mystery"
  | "romance"
  | "history"
  | "business";

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

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  location?: string;
  favoriteGenres: string[];
  stats: {
    booksRead: number;
    reviewsWritten: number;
    communitiesJoined: number;
  };
}

export interface SearchResult {
  id: string;
  type: "book" | "user" | "community";
  title: string;
  subtitle: string;
  thumbnail?: string;
  link: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface Community {
  id: string;
  name: string;
  members: number;
  description: string;
  coverUrl: string;
}

export interface SearchFilters {
  query: string;
  category?: BookCategory;
  rating?: number;
}
