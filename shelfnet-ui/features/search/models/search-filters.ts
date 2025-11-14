import { BookCategory } from "../../books/models/book-category";

export interface SearchFilters {
  query: string;
  category?: BookCategory;
  rating?: number;
}
